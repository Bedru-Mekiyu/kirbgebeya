<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Lease;
use Illuminate\Http\Request;

class LeaseExpiryReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        try {
            $leases = Lease::with('tenant', 'buildingUnit')->get();

            $formattedLeases = $leases->map(function ($lease) {
                return [
                    'id' => $lease->id,
                    'tenant' => $lease->tenant->business,
                    'tenant_id' => $lease->tenant->id,
                    'status' => $lease->status,
                    'start_date' => $lease->start_date,
                    'end_date' => $lease->end_date,
                    'monthly_rent' => $lease->monthly_rent,
                    'building_unit' => $lease->buildingUnit,
                    'building' => $lease->buildingUnit->building,
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
