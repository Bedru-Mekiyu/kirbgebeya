<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WorkOrder;
use App\Models\MaintenanceRequest;
use App\Models\Notification;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class WorkOrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $workOrders = WorkOrder::with(
            'contractor',
            'request',
            'request.buildingUnit'
        )->get();
        return response()->json(['workOrders' => $workOrders], 200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $validatedData = $request->validate([
                'contractor_id' => 'required|exists:maintenance_contractors,id',
                'request_id' => 'required|exists:maintenance_requests,id',
                'work_description' => 'nullable',
                'scheduled_date' => 'nullable|date',
                'completion_date' => 'nullable|date',
                'cost' => 'nullable|numeric',
                'status' => 'nullable|in_progress,completed,canceled',
            ]);

            $workOrder = WorkOrder::create(
                array_merge($validatedData, [
                    'id' => Str::uuid(),
                    'status' => $validatedData['status'] ?? 'in_progress',
                ])
            );

            $maintenanceRequest = MaintenanceRequest::findOrFail(
                $validatedData['request_id']
            );

            $buildingUnit = $maintenanceRequest->buildingUnit;
            if (!$buildingUnit) {
                throw new \Exception(
                    'Building unit not found for the maintenance request.'
                );
            }

            $lease = $buildingUnit->lease;

            if (!$lease) {
                throw new \Exception('Lease not found for the building unit.');
            }

            $tenant = $lease->first()->tenant;

            if (!$tenant) {
                throw new \Exception('Tenant not found for the lease.');
            }

            $user = $tenant->business->owner->user;
            $shortRequestId = substr($validatedData['request_id'], 0, 5);

            $notificationMessage = "#{$shortRequestId}";

            $notification = new Notification([
                'id' => (string) Str::uuid(),
                'notifiable' => $user->id,
                'type' => 'Work Order Created',
                'data' => $notificationMessage,
                'unit' => $buildingUnit->id,
                'read' => false,
            ]);
            $notification->save();
            try {
                event(new NotificationEvent($notification));
            } catch (\Exception $e) {
                return response()->json(
                    [
                        'error' => 'Failed to send notification event.',
                        'message' => $e->getMessage(),
                        'trace' => $e->getTrace(),
                    ],
                    500
                );
            }

            $maintenanceRequest->status = 'processing';
            $maintenanceRequest->save();

            return response()->json(['workOrder' => $workOrder], 201);
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'error' => 'Failed to create work order.',
                    'message' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $workOrder = WorkOrder::findOrFail($id);
        return response()->json(['workOrder' => $workOrder], 200);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validatedData = $request->validate([
            'contractor_id' => 'exists:maintenance_contractors,id',
            'request_id' => 'exists:maintenance_requests,id',
            'work_description' => 'string',
            'scheduled_date' => 'nullable|date',
            'completion_date' => 'nullable|date',
            'cost' => 'nullable|numeric',
        ]);

        $workOrder = WorkOrder::findOrFail($id);
        $workOrder->update($validatedData);

        return response()->json(['workOrder' => $workOrder], 200);
    }

    /**
     * Mark a work order as completed.
     */
    public function completeWorkOrder(Request $request, string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);

            $workOrder->status = 'completed';
            $workOrder->save();

            $maintenanceRequest = MaintenanceRequest::findOrFail(
                $workOrder->request->id
            );
            $maintenanceRequest->status = 'completed';
            $maintenanceRequest->save();

            return response()->json(
                [
                    'message' => 'Work order marked as completed successfully.',
                    'workOrder' => $workOrder,
                ],
                200
            );
        } catch (ValidationException $e) {
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            return response()->json(
                ['error' => 'Failed to update work order.'],
                500
            );
        }
    }

    /**
     * Mark a work order as canceled.
     */
    public function cancelWorkOrder(Request $request, string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);
            $workOrder->status = 'canceled';
            $workOrder->save();
            $maintenanceRequest = MaintenanceRequest::findOrFail(
                $workOrder->request->id
            );
            $maintenanceRequest->status = 'canceled';
            $maintenanceRequest->save();

            return response()->json(
                [
                    'message' => 'Work order marked as canceled successfully.',
                    'workOrder' => $workOrder,
                ],
                200
            );
        } catch (ValidationException $e) {
            // Validation failed
            return response()->json(['error' => $e->errors()], 400);
        } catch (\Exception $e) {
            // Something unexpected happened
            return response()->json(
                ['error' => 'Failed to update work order.'],
                500
            );
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $workOrder = WorkOrder::findOrFail($id);
            $maintenanceRequest = MaintenanceRequest::findOrFail(
                $workOrder->request->id
            );
            $maintenanceRequest->status = 'pending';
            $maintenanceRequest->save();
            $workOrder->delete();

            return response()->json(null, 204);
        } catch (\Exception $e) {
            // Handle exceptions, such as if the maintenance request is not found
            return response()->json(
                [
                    'error' =>
                        'Failed to delete work order or update maintenance request.',
                ],
                500
            );
        }
    }
}
