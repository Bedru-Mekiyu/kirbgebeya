<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Models\Payment;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;
use App\Models\Lease;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use App\Models\MaintenanceRequest;
use App\Models\Notification;
use App\Models\Role;
use App\Models\BuildingUnit;
use App\Models\Sms;
use Twilio\Rest\Client;

class PaymentController extends Controller
{
    public function index()
    {
        // Retrieve all payments
        $payments = Payment::with(
            'lease',
            'lease.buildingUnit',
            'lease.buildingUnit.building',
            'lease.tenant',
            'lease.tenant.business',
            'lease.tenant.business.owner',
            'lease.tenant.business.owner.user'
        )->get();
        return response()->json($payments);
    }

    public function getPaymentsByLeaseId($leaseId)
    {
        try {
            // Find payments associated with the lease ID
            $payments = Payment::where('lease_id', $leaseId)->get();

            if ($payments->isEmpty()) {
                return response()->json(
                    [
                        'error' =>
                            'No payments found for the specified lease ID.',
                    ],
                    404
                );
            }

            return response()->json($payments, 200);
        } catch (ModelNotFoundException $e) {
            // Handle "Model not found" exception
            return response()->json(['error' => 'Lease not found.'], 404);
        } catch (QueryException $e) {
            // Handle database query exception
            return response()->json(
                ['error' => 'Failed to fetch payments. Database error.'],
                500
            );
        } catch (\Exception $e) {
            // Handle other unexpected exceptions
            return response()->json(
                ['error' => 'Failed to fetch payments.'],
                500
            );
        }
    }

    public function store(Request $request)
    {
        try {
            // Validate and store a new payment
            $validatedData = $request->validate([
                'lease_id' => 'required|uuid',
                'number_of_months' => 'required|string',
                'start_month' => 'required|string',
                'end_month' => 'required_if:number_of_months,>1',
                'rent_fee' => 'required|numeric',
                'due_date' => 'required|date',
                'penalty_fee' => 'nullable|numeric',
                'utility_fee' => 'nullable|numeric',
                'other_fee' => 'nullable|numeric',
            ]);

            $validatedData['status'] = 'pending';
            $validatedData['id'] = Str::uuid();
            $validatedData['penalty_fee'] = $request->input('penalty_fee');
            $validatedData['utility_fee'] = $request->input('utility_fee');
            $validatedData['other_fee'] = $request->input('other_fee');
            $validatedData['remark'] = $request->input('remark');
            $validatedData['due_date'] = date(
                'Y-m-d H:i:s',
                strtotime($request->input('due_date'))
            );
            $validatedData['penalty_fee'] = $validatedData['penalty_fee'] ?? 0;
            $validatedData['utility_fee'] = $validatedData['utility_fee'] ?? 0;
            $validatedData['other_fee'] = $validatedData['other_fee'] ?? 0;

            $totalFee =
                $validatedData['rent_fee'] +
                ($validatedData['penalty_fee'] ?? 0) +
                ($validatedData['utility_fee'] ?? 0) +
                ($validatedData['other_fee'] ?? 0);

            $payment = Payment::create($validatedData);

            // Update the lease status to 'active'
            $lease = Lease::where('id', $validatedData['lease_id'])->first();
            if ($lease) {
                $lease->status = 'active';
                $lease->save();
            } else {
                throw new \Exception('Lease not found.');
            }

            $buildingUnit = $payment->lease->buildingUnit;
            $user = $payment->lease->tenant->business->owner->user;

            $buildingUnit = BuildingUnit::find($buildingUnit->id);

            $unit = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";
            $phoneNumber = $user->phone_number;
            // $this->sendPayment(
            //     $unit,
            //     $request->input('start_month'),
            //     $request->input('end_month'),
            //     $totalFee,
            //     $phoneNumber
            // );

            $this->storePaymentSMSInDatabase(
                $unit,
                $request->input('start_month'),
                $request->input('end_month'),
                $totalFee,
                $phoneNumber
            );

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";

            $notification = new Notification([
                'id' => (string) Str::uuid(),
                'notifiable' => $user->id,
                'type' => 'Tenant Payment Created',
                'data' => $notificationMessage,
                'unit' => $buildingUnit->id,
                'read' => false,
            ]);
            $notification->save();

            try {
                event(new NotificationEvent($notification));
                return response()->json(
                    [
                        'message' => 'Payment created successfully',
                        'payment' => $payment,
                    ],
                    201
                );
            } catch (\Exception $e) {
                return response()->json(
                    [
                        'error' => 'Failed to send payment event.',
                        'message' => $e->getMessage(),
                        'trace' => $e->getTrace(),
                    ],
                    500
                );
            }
        } catch (ValidationException $e) {
            return response()->json(
                ['error' => $e->errors(), 'message' => $e->getMessage()],
                400
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to add payment.',
                    'message' => 'Failed to add payment. ' . $e->getMessage(),
                ],
                500
            );
        }
    }

    private function storePaymentSMSInDatabase(
        $unit,
        $startMonth,
        $endMonth,
        $totalFee,
        $phoneNumber
    ) {
        if ($endMonth) {
            $monthRange = "$startMonth - $endMonth";
        } else {
            $monthRange = $startMonth;
        }
        Sms::create([
            'phone_number' => $phoneNumber,
            'message' => "Your payment of unit $unit for month $monthRange with a total fee of $totalFee.",
            'status' => 'pending',
        ]);
    }

    private function sendPayment(
        $unit,
        $startMonth,
        $endMonth,
        $totalFee,
        $phoneNumber
    ) {
        $sid = config('services.twilio.sid');
        $token = config('services.twilio.token');
        $twilioNumber = config('services.twilio.phone_number');
        if ($endMonth) {
            $monthRange = "$startMonth - $endMonth";
        } else {
            $monthRange = $startMonth;
        }

        $client = new Client($sid, $token);

        $message = "Your payment of unit $unit for month $monthRange with a total fee of $totalFee.";
        $client->messages->create($phoneNumber, [
            'from' => $twilioNumber,
            'body' => $message,
        ]);
    }

    public function show($id)
    {
        // Retrieve a single payment
        $payment = Payment::findOrFail($id);
        return response()->json($payment);
    }

    public function update(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'lease_id' => 'required|uuid',
                'number_of_months' => 'required|string',
                'start_month' => 'required|string',
                'end_month' => 'required_if:number_of_months,>1',
                'rent_fee' => 'required|numeric',
                'due_date' => 'required|date',
                'penalty_fee' => 'nullable|numeric',
                'utility_fee' => 'nullable|numeric',
                'other_fee' => 'nullable|numeric',
                'remark' => 'nullable',
            ]);
            $validatedData['status'] = $request->input('status');
            $validatedData['id'] = $id;
            $validatedData['penalty_fee'] = $request->input('penalty_fee');
            $validatedData['utility_fee'] = $request->input('utility_fee');
            $validatedData['other_fee'] = $request->input('other_fee');
            $validatedData['remark'] = $request->input('remark');
            $validatedData['due_date'] = date(
                'Y-m-d H:i:s',
                strtotime($request->input('due_date'))
            );
            $validatedData['penalty_fee'] = $validatedData['penalty_fee'] ?? 0;
            $validatedData['utility_fee'] = $validatedData['utility_fee'] ?? 0;
            $validatedData['other_fee'] = $validatedData['other_fee'] ?? 0;

            $payment = Payment::findOrFail($id);

            $payment->update($validatedData);

            return response()->json($payment, 200);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Failed to update payment.'],
                500
            );
        }
    }

    public function updatePayment(Request $request, $id)
    {
        try {
            $validatedData = $request->validate([
                'invoice_number' => 'required|string',
                'slip' => 'required|file|mimes:pdf,png,jpg,jpeg|max:4096',
                'bank_name' => 'required|string',
            ]);

            $payment = Payment::findOrFail($id);

            $payment->invoice_number = $validatedData['invoice_number'];
            $payment->status = 'awaiting approval';
            $payment->bank_name = $validatedData['bank_name'];
            $payment->paid_date = now();

            if ($request->hasFile('slip')) {
                $file = $request->file('slip');

                if ($file->isValid()) {
                    $fileName = time() . '_' . $file->getClientOriginalName();

                    $filePath = $file->move(public_path('invoice'), $fileName);

                    $payment->slip = 'invoice/' . $fileName;
                } else {
                    throw new \Exception('Uploaded file is not valid.');
                }
            }

            $payment->save();

            $buildingUnit = $payment->lease->buildingUnit;

            $buildingUnit = BuildingUnit::find($buildingUnit->id);

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";

            $adminRole = Role::where('name', 'admin')->first();

            if ($adminRole) {
                $adminUsers = $adminRole->users;
                foreach ($adminUsers as $user) {
                    $notification = new Notification([
                        'id' => (string) Str::uuid(),
                        'notifiable' => $user->id,
                        'type' => 'Tenant Payment Attached',
                        'data' => $notificationMessage,
                        'unit' => $buildingUnit->id,
                        'read' => false,
                    ]);
                    $notification->save();

                    try {
                        event(new NotificationEvent($notification));
                        return response()->json($payment, 200);
                    } catch (\Exception $e) {
                        return response()->json(
                            [
                                'error' =>
                                    'Failed to send maintenance request event.',
                                'message' => $e->getMessage(),
                                'trace' => $e->getTrace(),
                            ],
                            500
                        );
                    }
                }
            }
        } catch (ValidationException $e) {
            return response()->json(
                [
                    'error' =>
                        "Failed to update payment information. Please check your details and try again.",
                ],
                400
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to update payment.',
                    'message' => $e->getMessage(),
                    'trace' => $e->getTrace(),
                ],
                500
            );
        }
    }

    public function approvePayment(Request $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            $payment->status = 'paid';

            $payment->save();

            $buildingUnit = $payment->lease->buildingUnit;
            $user = $payment->lease->tenant->business->owner->user;

            $buildingUnit = BuildingUnit::find($buildingUnit->id);

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";

            $notification = new Notification([
                'id' => (string) Str::uuid(),
                'notifiable' => $user->id,
                'type' => 'Tenant Payment Approved',
                'data' => $notificationMessage,
                'unit' => $buildingUnit->id,
                'read' => false,
            ]);
            $notification->save();

            return response()->json(
                [
                    'message' => 'Payment updated successfully.',
                    'payment' => $payment,
                ],
                200
            );
        } catch (ValidationException $e) {
            // Validation failed
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            // Something unexpected happened
            return response()->json(
                ['error' => 'Failed to update payment.'],
                500
            );
        }
    }

    public function rejectPayment(Request $request, $id)
    {
        try {
            $payment = Payment::findOrFail($id);

            $payment->status = 'canceled';

            $payment->save();

            $buildingUnit = $payment->lease->buildingUnit;
            $user = $payment->lease->tenant->business->owner->user;

            $buildingUnit = BuildingUnit::find($buildingUnit->id);

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";

            $notification = new Notification([
                'id' => (string) Str::uuid(),
                'notifiable' => $user->id,
                'type' => 'Tenant Payment Rejected',
                'data' => $notificationMessage,
                'unit' => $buildingUnit->id,
                'read' => false,
            ]);
            $notification->save();

            return response()->json(
                [
                    'message' => 'Payment updated successfully.',
                    'payment' => $payment,
                ],
                200
            );
        } catch (ValidationException $e) {
            // Validation failed
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            // Something unexpected happened
            return response()->json(
                ['error' => 'Failed to update payment.'],
                500
            );
        }
    }

    public function destroy($id)
    {
        // Delete a payment
        $payment = Payment::findOrFail($id);
        $payment->delete();

        return response()->json(null, 204);
    }
}
