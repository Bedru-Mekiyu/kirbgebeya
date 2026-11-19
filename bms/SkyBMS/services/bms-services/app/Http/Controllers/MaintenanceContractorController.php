<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\MaintenanceContractor;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Str;


class MaintenanceContractorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $maintenanceContractors = MaintenanceContractor::all();
        return response()->json($maintenanceContractors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'company_name' => 'required|string|unique:maintenance_contractors',
            'contact_name' => 'required|string',
            'email' => 'nullable|email|unique:maintenance_contractors',
            'phone' => 'required|string|unique:maintenance_contractors',
        ]);

        $maintenanceContractor = MaintenanceContractor::create([
            'id' => Str::uuid(),
            'company_name' => $request->company_name,
            'contact_name' => $request->contact_name,
            'email' => $request->email,
            'phone' => $request->phone,
        ]);

        return response()->json($maintenanceContractor, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $maintenanceContractor = MaintenanceContractor::findOrFail($id);
        return response()->json($maintenanceContractor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request->validate([
            'company_name' => 'required|string',
            'contact_name' => 'required|string',
            'email' => 'nullable|email',
            'phone' => 'required|string',
        ]);

        $maintenanceContractor = MaintenanceContractor::findOrFail($id);
        $maintenanceContractor->update($request->only(['company_name', 'contact_name', 'email', 'phone']));

        return response()->json($maintenanceContractor, 200);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $maintenanceContractor = MaintenanceContractor::findOrFail($id);
        $maintenanceContractor->delete();

        return response()->json(null, 204);
    }
}
