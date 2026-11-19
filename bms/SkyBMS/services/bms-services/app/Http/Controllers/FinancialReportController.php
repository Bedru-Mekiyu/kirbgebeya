<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Payment;
use App\Models\WorkOrder;
use Illuminate\Http\Request;

class FinancialReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        try {
            $request->validate([
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date',
            ]);

            $startDate = $request->input('start_date');
            $endDate = $request->input('end_date');

            $query = Payment::with(
                'lease',
                'lease.buildingUnit',
                'lease.buildingUnit.building',
                'lease.tenant',
                'lease.tenant.business',
                'lease.tenant.business.owner',
                'lease.tenant.business.owner.user'
            )->where('status', 'paid');

            $query2 = Payment::with(
                'lease',
                'lease.buildingUnit',
                'lease.buildingUnit.building',
                'lease.tenant',
                'lease.tenant.business',
                'lease.tenant.business.owner',
                'lease.tenant.business.owner.user'
            )->where('status', 'pending');

            $workOrders = WorkOrder::with(
                'contractor',
                'request',
                'request.buildingUnit'
            )->where('status', 'completed');

            if ($startDate && $endDate) {
                $query->whereBetween('paid_date', [$startDate, $endDate]);
                $query2->whereBetween('due_date', [$startDate, $endDate]);
                $workOrders->whereBetween('completion_date', [
                    $startDate,
                    $endDate,
                ]);
            }

            $financialData = $query->get();
            $financialData2 = $query2->get();
            $financialworkOrdersData = $workOrders->get();

            $responseData = [];
            $grandTotalPayment = 0;
            foreach ($financialData as $payment) {
                $totalPayment =
                    $payment->rent_fee * $payment->number_of_months +
                    $payment->penalty_fee +
                    $payment->utility_fee +
                    $payment->other_fee;

                $responseData[] = [
                    'total_payment' => $totalPayment,
                ];

                $grandTotalPayment += $totalPayment;
            }

            $grandTotalPayment2 = 0;
            foreach ($financialData2 as $payment) {
                $totalPayment2 =
                    $payment->rent_fee * $payment->number_of_months +
                    $payment->penalty_fee +
                    $payment->utility_fee +
                    $payment->other_fee;
                $grandTotalPayment2 += $totalPayment2;
            }

            $grandTotalWorkOrderCost = 0;
            foreach ($financialworkOrdersData as $orkOrder) {
                $grandTotalWorkOrderCost += $orkOrder->cost;
            }
            if ($grandTotalPayment > 0) {
                return response()->json([
                    'success' => true,
                    'data' => $responseData,
                    'summary' => [
                        'grand_total_payment' => $grandTotalPayment,
                        'grandTotalWorkOrderCost' => $grandTotalWorkOrderCost,
                        'net' => $grandTotalPayment - $grandTotalWorkOrderCost,
                        'outstandingPayments' => $grandTotalPayment2,
                    ],
                ]);
            } else {
                return response()->json([
                    'success' => true,
                    'data' => $responseData,
                    'summary' => [],
                ]);
            }
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
