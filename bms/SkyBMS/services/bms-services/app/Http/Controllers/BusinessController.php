<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Business;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use App\Models\Tenant;

class BusinessController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        try {
            $businesses = Business::with('owner')->get();
            $formattedBusinesses = $businesses->map(function ($businesses) {
                return [
                    'business_address' => $businesses->business_address,
                    'business_email' => $businesses->business_email,
                    'business_phone_number' =>
                        $businesses->business_phone_number,
                    'created_at' => $businesses->created_at,
                    'id' => $businesses->id,
                    'name' => $businesses->name,
                    'number_of_years_in_business' =>
                        $businesses->number_of_years_in_business,
                    'owner' => $businesses->owner??null,
                    'owner_detail' => $businesses->owner->user??null,
                    'owner_id' => $businesses->owner_id,
                    'type_of_business' => $businesses->type_of_business,
                    'updated_at' => $businesses->updated_at,
                ];
            });
            return response()->json([
                'message' => 'Successfully retrieved businesses',
                'data' => $formattedBusinesses,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to loading tenants',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'owner_id' => 'required',
            'business_address' => 'nullable',
            'business_phone_number' => 'required',
            'business_email' => 'nullable|email',
            'type_of_business' => 'required',
            'number_of_years_in_business' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ],
                400
            );
        }

        // Check if the business name already exists
        if (Business::where('name', $request->name)->exists()) {
            return response()->json(
                ['message' => 'Business name already exists'],
                400
            );
        }

        $business = new Business();
        $business->id = Str::uuid();
        $business->fill($request->all());
        $business->save();

        $tenant = new Tenant();
        $tenant->id = Str::uuid();
        $tenant->business_id = $business->id;
        $tenant->save();

        return response()->json(
            ['message' => 'Business created successfully', 'data' => $business],
            201
        );
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $business = Business::with('owner')->findOrFail($id);
        return response()->json([
            'message' => 'Business found',
            'data' => $business,
        ]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'owner_id' => 'required',
            'business_address' => 'nullable',
            'business_phone_number' => 'required',
            'business_email' => 'nullable|email',
            'type_of_business' => 'required',
            'number_of_years_in_business' => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(
                [
                    'message' => 'Validation error',
                    'errors' => $validator->errors(),
                ],
                400
            );
        }

        $business = Business::findOrFail($id);
        $business->update($request->all());

        return response()->json(
            ['message' => 'Business updated successfully', 'data' => $business],
            200
        );
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {
        $business = Business::findOrFail($id);
        $business->delete();

        return response()->json(
            ['message' => 'Business deleted successfully'],
            204
        );
    }
}
