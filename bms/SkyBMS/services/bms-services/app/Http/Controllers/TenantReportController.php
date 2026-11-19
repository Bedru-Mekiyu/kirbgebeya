<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\BuildingUnit;
use App\Models\Lease;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class TenantReportController extends Controller
{
    public function index(Request $request)
    {
        try {
            $buildingId = $request->query('building_id');
            $floorNo = $request->query('floor_no');

            $request->validate([
                'payment_status' => 'nullable|in:ALL,paid,UNPAID',
            ]);

            $paymentStatus = $request->input('payment_status', 'ALL');

            $buildingUnitsQuery = BuildingUnit::with('building');

            if ($buildingId) {
                $buildingUnitsQuery->where('building_id', $buildingId);
            }
            if ($floorNo) {
                $buildingUnitsQuery->where('floor_no', $floorNo);
            }

            $buildingUnits = $buildingUnitsQuery->pluck('id');

            $query = Lease::with([
                'tenant',
                'buildingUnit',
                'payment',
            ])->whereIn('building_unit_id', $buildingUnits);
            Log::info($buildingUnits);
            // $query = Lease::with(['tenant', 'buildingUnit', 'payment']);

            if ($paymentStatus !== 'ALL') {
                if ($paymentStatus === 'paid') {
                    $query->whereHas('payment', function ($q) {
                        $q->where('status', 'paid');
                    });
                } elseif ($paymentStatus === 'UNPAID') {
                    $query->whereHas('payment', function ($q) {
                        $q->whereIn('status', [
                            'pending',
                            'canceled',
                            'awaiting approval',
                        ]);
                    });
                }
            }
            $leases = $query->get();
            $result = $leases->map(function ($lease) use ($paymentStatus) {
                $payments = $lease->payment;
                if (!$payments instanceof \Illuminate\Support\Collection) {
                    $payments = collect($payments);
                }
                if ($paymentStatus !== 'ALL') {
                    if ($paymentStatus === 'paid') {
                        $payments = $payments->filter(
                            fn($payment) => $payment->status === 'paid'
                        );
                    } elseif ($paymentStatus === 'UNPAID') {
                        $payments = $payments->filter(
                            fn($payment) => in_array($payment->status, [
                                'pending',
                                'canceled',
                                'awaiting approval',
                            ])
                        );
                    }
                }

                return [
                    'tenant_business_name' =>
                        $lease->tenant->business->name ?? 'N/A',
                    'building_unit_number' =>
                        $lease->buildingUnit->unit_number ?? 'N/A',
                    'lease_start_date' => Carbon::parse(
                        $lease->start_date
                    )->format('Y-m-d'),
                    'lease_end_date' => Carbon::parse($lease->end_date)->format(
                        'Y-m-d'
                    ),
                    'monthly_rent' => $lease->monthly_rent,
                    'tenant_name' =>
                        $lease->tenant->business->owner->user->full_name ??
                        'N/A',
                    'payments' => $payments
                        ->map(function ($payment) {
                            $totalPayment =
                                $payment->rent_fee *
                                    $payment->number_of_months +
                                $payment->penalty_fee +
                                $payment->utility_fee +
                                $payment->other_fee;
                            return [
                                'id' => $payment->id,
                                'status' =>
                                    $payment->status == 'paid'
                                        ? 'paid'
                                        : 'unpaid',
                                'total_payment' => $totalPayment,
                                'number_of_months' =>
                                    $payment->number_of_months,
                                'start_month' => $payment->start_month,
                                'end_month' => $payment->end_month,
                                'due_date' => $payment->due_date
                                    ? Carbon::parse($payment->due_date)->format(
                                        'Y-m-d'
                                    )
                                    : 'N/A',
                            ];
                        })
                        ->values()
                        ->toArray(),
                    'tenant_business_phone_number' =>
                        $lease->tenant->business->business_phone_number ??
                        'N/A',
                ];
            });

            return response()->json($result);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to load filtered tenants.',
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
