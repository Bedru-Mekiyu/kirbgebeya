<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class TenantController extends Controller
{
    /**
     * Display a listing of the tenants.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $tenants = Tenant::with('business', 'business.owner')->get();

            $formattedTenants = $tenants->map(function ($tenant) {
                return [
                    'id' => $tenant->id,
                    'name' => $tenant->business->owner->user->name,
                    'business_id' => $tenant->business_id,
                    'business_name' => $tenant->business->name??null,
                    'business_email' => $tenant->business->business_email??null,
                    'business_address' => $tenant->business->business_address??null,
                    'business_phone_number' =>
                        $tenant->business->business_phone_number??null,
                    'number_of_years_in_business' =>
                        $tenant->business->number_of_years_in_business??null,
                    'owner' => $tenant->business->owner ?? null,
                    'owner_detail' => $tenant->business->owner->user ?? null,
                    'owner_id' => $tenant->business->owner_id??null,
                    'type_of_business' => $tenant->business->type_of_business,
                    'created_at' => $tenant->created_at,
                ];
            });

            return response()->json([
                'success' => true,
                'message' => 'Tenants retrieved successfully.',
                'data' => $formattedTenants,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to retrieve tenants.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Get the count of all tenants.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function tenantCount()
    {
        try {
            $count = Tenant::count();

            return response()->json([
                'success' => true,
                'message' => 'Tenant count retrieved successfully.',
                'data' => [
                    'tenant_count' => $count,
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to retrieve tenant count.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Store a newly created tenant in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'business_id' => 'required|uuid',
            ]);

            if ($validator->fails()) {
                return response()->json(
                    [
                        'success' => false,
                        'message' => 'Validation error.',
                        'errors' => $validator->errors(),
                    ],
                    400
                );
            }

            $existingTenant = Tenant::where(
                'business_id',
                $request->business_id
            )->first();

            if ($existingTenant) {
                return response()->json(
                    [
                        'success' => false,
                        'message' =>
                            'Tenant already exists with the provided business_id.',
                    ],
                    400
                );
            }

            $tenant = new Tenant();
            $tenant->id = Str::uuid();
            $tenant->fill($request->all());
            $tenant->save();

            return response()->json(
                [
                    'success' => true,
                    'message' => 'Tenant created successfully.',
                    'data' => $tenant,
                ],
                201
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to create tenant.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Display the specified tenant.
     *
     * @param  \App\Models\Tenant  $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Tenant $tenant)
    {
        try {
            return response()->json([
                'success' => true,
                'message' => 'Tenant retrieved successfully.',
                'data' => $tenant,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to retrieve tenant.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Update the specified tenant in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Tenant  $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, Tenant $tenant)
    {
        try {
            $validator = Validator::make($request->all(), [
                'business_id' => 'required|uuid',
            ]);

            if ($validator->fails()) {
                return response()->json(
                    [
                        'success' => false,
                        'message' => 'Validation error.',
                        'errors' => $validator->errors(),
                    ],
                    400
                );
            }

            $tenant->update($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Tenant updated successfully.',
                'data' => $tenant,
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to update tenant.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    /**
     * Remove the specified tenant from storage.
     *
     * @param  \App\Models\Tenant  $tenant
     * @return \Illuminate\Http\JsonResponse
     */
    protected function deleteLease($id, $building_unit_id)
    {
        // Call the lease deletion logic
        // You might want to move the lease deletion logic here for reuse
        $leaseController = app()->make('App\Http\Controllers\LeaseController');
        return $leaseController->destroy($id, $building_unit_id);
    }
    public function destroy($id)
    {
        try {
            $tenant = Tenant::findOrFail($id);
            $tenant->leases()->each(function ($lease) {
                $this->deleteLease($lease->id, $lease->building_unit_id);
            });
            $tenant->business()->delete();
            $tenant->delete();

            return response()->json([
                'success' => true,
                'message' => 'Tenant and associated data deleted successfully.',
            ]);
        } catch (\Exception $e) {
            return response()->json(
                [
                    'success' => false,
                    'message' => 'Failed to delete tenant.',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
