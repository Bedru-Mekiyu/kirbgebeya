<?php

namespace App\Http\Controllers;

use App\Events\NotificationEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MaintenanceRequest;
use App\Models\Notification;
use Illuminate\Support\Str;
use App\Models\Role;
use App\Models\BuildingUnit;
use Illuminate\Support\Facades\Log;

class MaintenanceRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $maintenanceRequests = MaintenanceRequest::with(
            'buildingUnit',
            'buildingUnit.building'
        )->get();
        return response()->json($maintenanceRequests);
    }

    public function maintenanceRequestsCount()
    {
        $count = MaintenanceRequest::count();
        return response()->json(['count' => $count]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $request->validate([
                'building_unit_id' => 'required|exists:building_units,id',
                'description' => 'required',
                'status' => 'in:pending,processing,completed',
            ]);

            $request->merge(['request_date' => now()]);

            $maintenanceRequest = MaintenanceRequest::create($request->all());

            $buildingUnit = BuildingUnit::find(
                $request->input('building_unit_id')
            );

            if (!$buildingUnit) {
                throw new \Exception('Building unit not found.');
            }

            $notificationMessage = "{$buildingUnit->floor_no} - {$buildingUnit->unit_number}";
            $requestId = $maintenanceRequest->id;
            $notificationData = [
                'notification_message' => $notificationMessage,
                'request_id' => $requestId,
            ];
            $encodedNotificationData = json_encode($notificationData);

            $adminRole = Role::where('name', 'admin')->first();
            if ($adminRole) {
                $adminUsers = $adminRole->users;
                foreach ($adminUsers as $user) {
                    $notification = new Notification([
                        'id' => (string) Str::uuid(),
                        'notifiable' => $user->id,
                        'type' => 'Maintenance Request Created',
                        'data' => $encodedNotificationData,
                        'unit' => $buildingUnit->id,
                        'read' => false,
                    ]);

                    $notification->save();

                    try {
                        event(new NotificationEvent($notification));
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

                return response()->json($maintenanceRequest, 201);
            }
        } catch (\Exception $e) {
            // Return detailed error response
            return response()->json(
                [
                    'error' => 'Failed to create maintenance request.',
                    'message' => $e->getMessage(),
                    'trace' => $e->getTrace(),
                ],
                500
            );
        }
    }

    public function getRequestByUserId($userId)
    {
        $request = MaintenanceRequest::whereHas(
            'buildingUnit.lease.tenant.business.owner.user',
            function ($query) use ($userId) {
                $query->where('id', $userId);
            }
        )
            ->where('status', '!=', 'completed')
            ->with(
                'buildingUnit.lease.tenant',
                'buildingUnit.lease.tenant.business',
                'buildingUnit.lease.tenant.business.owner.user',
                'buildingUnit',
                'buildingUnit.building'
            )
            ->get();

        if ($request->isEmpty()) {
            return response()->json(['message' => 'No Request found'], 404);
        }

        $formattedRequest = $request->map(function ($request) {
            return [
                'id' => $request->id,
                'building_unit' => $request->building_unit_id,
                'description' => $request->description,
                'status' => $request->status,
                'date' => $request->request_date,
                'work_orders' => $request->workOrder->map(function (
                    $workOrder
                ) {
                    return [
                        'id' => $workOrder->id,
                        'contractor' => $workOrder->contractor,
                        'work_description' => $workOrder->work_description,
                        'scheduled_date' => $workOrder->scheduled_date,
                        'completion_date' => $workOrder->completion_date,
                        'cost' => $workOrder->cost,
                    ];
                }),
            ];
        });

        return response()->json(
            [
                'message' => "Maintenace Request retrieved successfully",
                'data' => $formattedRequest,
            ],
            200
        );
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $maintenanceRequest = MaintenanceRequest::findOrFail($id);
        return response()->json($maintenanceRequest);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'building_unit_id' => 'exists:building_units,id',
            'request_date' => 'date',
            'status' => 'in:pending,processing,completed',
        ]);

        $maintenanceRequest = MaintenanceRequest::findOrFail($id);
        $maintenanceRequest->update($request->all());

        return response()->json($maintenanceRequest, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $maintenanceRequest = MaintenanceRequest::findOrFail($id);
        $maintenanceRequest->delete();

        return response()->json(null, 204);
    }
}
