<?php

namespace App\Http\Controllers;
use Carbon\Carbon;
use App\Models\Lease;
use App\Models\BuildingUnit;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use App\Models\Notification;
use Illuminate\Support\Facades\Log;

class LeaseController extends Controller
{
    public function index()
    {
        try {
            $leases = Lease::with('tenant', 'buildingUnit')->get();
            Log::info($leases);

            $formattedLeases = $leases->map(function ($lease) {
                return [
                    'id' => $lease->id,
                    'tenant' => $lease->tenant->business,
                    'tenant_id' => $lease->tenant->id ?? null,
                    'user' => optional($lease->tenant->business->owner)->user,
                    'status' => $lease->status,
                    'start_date' => $lease->start_date,
                    'end_date' => $lease->end_date,
                    'monthly_rent' => $lease->monthly_rent,
                    'building_unit' => $lease->buildingUnit,
                    'building' => $lease->buildingUnit->building ?? null,
                    'lease_agreement_document' =>
                        $lease->lease_agreement_document,
                    'created_at' => $lease->created_at,
                ];
            });

            return response()->json(
                [
                    'message' => "Lease retrieved successfully",
                    'data' => $formattedLeases,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to retrieve leases',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function leaseCount()
    {
        try {
            $leasesCount = Lease::count();

            return response()->json(
                [
                    'message' => "Total number of leases",
                    'count' => $leasesCount,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to fetch lease count',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function countPendingPaymentsByMonth()
    {
        return $this->countPaymentsByStatus('pending');
    }

    public function countPaidPaymentsByMonth()
    {
        return $this->countPaymentsByStatus('paid');
    }

    public function countLatePaymentsByMonth()
    {
        return $this->countPaymentsByStatus('late');
    }

    private function countPaymentsByStatus($status)
    {
        try {
            $today = Carbon::now();
            $months = [];

            // Generate an array of months for the last 12 months including the current month
            for ($i = 0; $i < 12; $i++) {
                $date = $today->copy()->subMonths($i);
                $monthYear = $date->format('Y-m');
                $months[$monthYear] = 0;
            }

            // Fetch payments for the last 12 months with the specified status
            $payments = Lease::with([
                'payment' => function ($query) use ($today, $status) {
                    $query
                        ->whereBetween('due_date', [
                            $today
                                ->copy()
                                ->subMonths(11)
                                ->startOfMonth(),
                            $today->endOfMonth(),
                        ])
                        ->where('status', $status);
                },
            ])->get();

            foreach ($payments as $lease) {
                foreach ($lease->payment as $payment) {
                    $monthYear = Carbon::parse($payment->due_date)->format(
                        'Y-m'
                    );

                    if (isset($months[$monthYear])) {
                        $months[$monthYear] += 1;
                    }
                }
            }

            return response()->json(
                [
                    'message' =>
                        ucfirst($status) .
                        ' lease payment counts retrieved successfully',
                    'data' => $months,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' =>
                        'Failed to retrieve ' .
                        $status .
                        ' lease payment counts',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function getLeaseByUserId($userId)
    {
        $leases = Lease::whereHas('tenant.business.owner.user', function (
            $query
        ) use ($userId) {
            $query->where('id', $userId);
        })
            ->with(
                'tenant',
                'tenant.business',
                'tenant.business.owner.user',
                'buildingUnit',
                'buildingUnit.building'
            )
            ->get();

        if ($leases->isEmpty()) {
            return response()->json(['message' => 'No leases found'], 404);
        }

        $formattedLeases = $leases->map(function ($lease) {
            return [
                'id' => $lease->id,
                'tenant' => $lease->tenant->business,
                'status' => $lease->status,
                'start_date' => $lease->start_date,
                'end_date' => $lease->end_date,
                'monthly_rent' => $lease->monthly_rent,
                'building_unit' => $lease->buildingUnit,
                'lease_agreement_document' => $lease->lease_agreement_document,
                'created_at' => $lease->created_at,
            ];
        });

        $today = Carbon::now();
        $twoDaysFromNow = Carbon::now()->addDays(2);
        $oneWeekFromNow = Carbon::now()->addWeek();
        $oneMonthFromNow = Carbon::now()->addMonth();

        foreach ($leases as $lease) {
            $endDate = Carbon::parse($lease->end_date);

            // Lease expiration notifications
            if ($endDate->lessThanOrEqualTo($today)) {
                $notificationType = 'Lease Expired';
            } elseif ($endDate->lessThanOrEqualTo($twoDaysFromNow)) {
                $notificationType = 'Lease Expiration Warning (2 Days)';
            } elseif ($endDate->lessThanOrEqualTo($oneWeekFromNow)) {
                $notificationType = 'Lease Expiration Warning (1 Week)';
            } elseif ($endDate->lessThanOrEqualTo($oneMonthFromNow)) {
                $notificationType = 'Lease Expiration Warning (1 Month)';
            } else {
                continue;
            }
            $buildingUnit = $lease->buildingUnit;
            $user = $lease->tenant->business->owner->user;

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $existingNotification = Notification::where([
                ['notifiable', $user->id],
                ['unit', $buildingUnit->id],
                ['type', $notificationType],
            ])->exists();

            if (!$existingNotification) {
                $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";
                $notification = new Notification([
                    'id' => (string) Str::uuid(),
                    'notifiable' => $user->id,
                    'type' => $notificationType,
                    'data' => $notificationMessage,
                    'unit' => $buildingUnit->id,
                    'read' => false,
                ]);
                $notification->save();
            }

            // Payment notifications
            foreach ($lease->payment as $payment) {
                // Check if the payment status is not paid
                if ($payment->status !== 'paid') {
                    $dueDate = Carbon::parse($payment->due_date);

                    // Payment due date notifications
                    if ($dueDate->lessThanOrEqualTo($today)) {
                        $notificationType = 'Payment Due Today';
                    } elseif ($dueDate->lessThanOrEqualTo($twoDaysFromNow)) {
                        $notificationType = 'Payment Due Soon (2 Days)';
                    } elseif ($dueDate->lessThanOrEqualTo($oneWeekFromNow)) {
                        $notificationType = 'Payment Due Soon (1 Week)';
                    } else {
                        continue;
                    }

                    $buildingUnit = $lease->buildingUnit;
                    $user = $lease->tenant->business->owner->user;

                    if (!$buildingUnit) {
                        throw new \Exception('Building unit not found.');
                    }

                    $existingNotification = Notification::where([
                        ['notifiable', $user->id],
                        ['unit', $buildingUnit->id],
                        ['type', $notificationType],
                    ])->exists();

                    if (!$existingNotification) {
                        $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";
                        $notification = new Notification([
                            'id' => (string) Str::uuid(),
                            'notifiable' => $user->id,
                            'type' => $notificationType,
                            'data' => $notificationMessage,
                            'unit' => $buildingUnit->id,
                            'read' => false,
                        ]);
                        $notification->save();
                    }
                }
            }
        }

        return response()->json(
            [
                'message' => "Leases retrieved successfully",
                'data' => $formattedLeases,
            ],
            200
        );
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'tenant_id' => 'required',
            'building_unit_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'monthly_rent' => 'required|string',
            'status' => 'required|string',
            'lease_agreement_document' =>
                'required|file|mimes:pdf,png,jpg,jpeg|max:5120',
        ]);

        $validatedData['start_date'] = \Carbon\Carbon::parse(
            $validatedData['start_date']
        )->format('Y-m-d H:i:s');
        $validatedData['end_date'] = \Carbon\Carbon::parse(
            $validatedData['end_date']
        )->format('Y-m-d H:i:s');

        $existingLease = Lease::where(
            'building_unit_id',
            $validatedData['building_unit_id']
        )->first();

        if ($existingLease) {
            return response()->json(
                ['message' => 'Lease already exists for this  building unit.'],
                409
            );
        }

        $lease = new Lease();

        if ($request->hasFile('lease_agreement_document')) {
            $file = $request->file('lease_agreement_document');
            if ($file->isValid()) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->move(
                    public_path('lease_documents'),
                    $fileName
                );
                $validatedData['lease_agreement_document'] =
                    'lease_documents/' . $fileName;
            } else {
                throw new \Exception('Uploaded file is not valid.');
            }
        } else {
            return response()->json(
                ['message' => 'No lease agreement document uploaded'],
                400
            );
        }

        $lease->building_unit_id = $validatedData['building_unit_id'];
        $lease->id = Str::uuid();

        $lease->fill($validatedData);

        try {
            $lease->save();

            $buildingUnit = BuildingUnit::find(
                $validatedData['building_unit_id']
            );

            if ($buildingUnit) {
                $buildingUnit->status = 'Occupied';
                $buildingUnit->save();
            }
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to save lease.',
                    'message' => 'Failed to save lease. ' . $e->getMessage(),
                ],
                500
            );
        }

        return response()->json(
            ['message' => 'Lease created successfully', 'lease' => $lease],
            201
        );
    }

    public function show(Lease $lease)
    {
        return $lease;
    }

    public function update(Request $request, Lease $lease)
    {
        $request->validate([
            'tenant_id' => 'required',
            'building_unit_id' => 'required',
            'start_date' => 'required|date',
            'end_date' => 'required|date',
            'monthly_rent' => 'required|string',
            'status' => 'required|string',
        ]);

        // Convert start_date and end_date to datetime format
        $request->merge([
            'start_date' => \Carbon\Carbon::parse(
                $request->input('start_date')
            )->format('Y-m-d H:i:s'),
            'end_date' => \Carbon\Carbon::parse(
                $request->input('end_date')
            )->format('Y-m-d H:i:s'),
        ]);

        $lease->update($request->except('lease_agreement_document'));

        if ($request->hasFile('lease_agreement_document')) {
            $file = $request->file('lease_agreement_document');
            if ($file->isValid()) {
                $fileName = time() . '_' . $file->getClientOriginalName();
                $filePath = $file->move(
                    public_path('lease_documents'),
                    $fileName
                );
                $validatedData['lease_agreement_document'] =
                    'lease_documents/' . $fileName;
                $lease->lease_agreement_document =
                    $validatedData['lease_agreement_document'];
            } else {
                throw new \Exception('Uploaded file is not valid.');
            }
        }
        $lease->save();

        return response()->json($lease, 200);
    }

    public function destroy($id, $building_unit_id)
    {
        $lease = Lease::find($id);

        if (!$lease) {
            return response()->json(['message' => 'Lease not found'], 404);
        }

        try {
            $lease->delete();

            $documentPath =
                public_path('lease_document/') .
                $lease->lease_agreement_document;
            if (file_exists($documentPath)) {
                unlink($documentPath);
            }

            $buildingUnit = BuildingUnit::where(
                'id',
                $building_unit_id
            )->first();

            if ($buildingUnit) {
                $buildingUnit->status = 'Available';
                $buildingUnit->save();
            } else {
            }
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to save lease.',
                    'message' => 'Failed to save lease. ' . $e->getMessage(),
                ],
                500
            );
        }

        return response()->json(
            ['message' => 'Lease deleted successfully'],
            200
        );
    }
}
