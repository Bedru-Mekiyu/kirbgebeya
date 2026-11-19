<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\MaintenanceRequest;
use Illuminate\Http\Request;

class MaintenanceRequestReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'request_status' =>
                    'nullable|in:all,pending,in_progress,completed',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            $requestStatus = $request->input('request_status');
            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $query = MaintenanceRequest::with(
                'buildingUnit.lease.tenant.business',
                'workOrder.contractor'
            );

            if ($requestStatus && $requestStatus !== 'all') {
                $query->where(
                    'status',
                    $requestStatus === 'pending'
                        ? 'pending'
                        : ($requestStatus === 'in_progress'
                            ? 'processing'
                            : 'completed')
                );
            }

            if ($startDate && $endDate) {
                $query->whereBetween('request_date', [$startDate, $endDate]);
            } elseif ($startDate) {
                $query->whereDate('request_date', '>=', $startDate);
            } elseif ($endDate) {
                $query->whereDate('request_date', '<=', $endDate);
            }

            $maintenanceRequests = $query->get();

            $responseData = [];
            foreach ($maintenanceRequests as $request) {
                $leaseItem = $request->buildingUnit->lease[0];
                if ($request->status !== 'pending') {
                    foreach ($request->workOrder as $workOrder) {
                        $responseData[] = [
                            'tenant_name' => $leaseItem->tenant->business->name,
                            'building_unit' =>
                                $request->buildingUnit->unit_number,
                            'request_date' => $request->request_date,
                            'request_description' => $request->description,
                            'additional_description' =>
                                $workOrder->work_description,
                            'status' => $request->status,
                            'contractor' =>
                                $workOrder->contractor->company_name,
                            'completion_date' => $workOrder->completion_date,
                            'cost' => $workOrder->cost,
                            'created_at' => $request->created_at,
                        ];
                    }
                } else {
                    $responseData[] = [
                        'tenant_name' => $leaseItem->tenant->business->name,
                        'building_unit' => $request->buildingUnit->unit_number,
                        'request_date' => $request->request_date,
                        'request_description' => $request->description,
                        'additional_description' => null,
                        'status' => $request->status,
                        'contractor' => null,
                        'completion_date' => null,
                        'cost' => null,
                        'created_at' => $request->created_at,
                    ];
                }
            }

            return response()->json([
                'success' => true,
                'data' => $responseData,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to load maintenance request report.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
