<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\BuildingUnit;
use Illuminate\Support\Str;

class BuildingUnitController extends Controller
{
    public function create(Request $request)
    {
        $request->validate([
            'building_id' => 'required|uuid',
            'floor_no' => 'required',
            'unit_number' => 'required',
            'room_type' => 'required',
            'area_in_sqm' => ['required_without:estimate_price'],
            'status' => 'required',
            'price_per_meter_sq' => [
                'required_without:estimate_price',
                'numeric',
            ],
            'estimate_price' => [
                'required_without:price_per_meter_sq',
                'numeric',
            ],
        ]);
        $width = $request->get('width');
        $length = $request->get('length');
        $area_in_sqm = $request->get('area_in_sqm');

        if ($width === 'NaN' || !is_numeric($width)) {
            $width = null;
        }

        if ($length === 'NaN' || !is_numeric($length)) {
            $length = null;
        }

        if ($area_in_sqm === 'NaN' || !is_numeric($area_in_sqm)) {
            $area_in_sqm = null;
        }

        $buildingUnit = new BuildingUnit([
            'id' => Str::uuid(),
            'building_id' => $request->get('building_id'),
            'room_type' => $request->get('room_type'),
            'floor_no' => $request->get('floor_no'),
            'unit_number' => $request->get('unit_number'),
            'width' => $width,
            'length' => $length,
            'area_in_sqm' => $area_in_sqm,
            'price_per_meter_sq' => $request->get('price_per_meter_sq'),
            'estimate_price' => $request->get('estimate_price'),
            'status' => $request->get('status'),
        ]);
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/buildingunits'), $imageName);
            $buildingUnit->image = $imageName;
        } else {
            $defaultImage = 'default-image.jpg';
            $defaultImagePath = public_path(
                'images/buildingunits/' . $defaultImage
            );
            if (file_exists($defaultImagePath)) {
                $buildingUnit->image = $defaultImage;
            } else {
                return response()->json(
                    ['message' => 'Default image not found'],
                    404
                );
            }
        }
        $buildingUnit->save();

        return response()->json(
            [
                'message' => 'Building unit created successfully',
                'data' => $buildingUnit,
            ],
            201
        );
    }

    public function index(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $buildingId = $request->query('building_id');
        $floorNo = $request->query('floor_no');

        $query = BuildingUnit::with('building');

        if ($buildingId) {
            $query->where('building_id', $buildingId);
        }
        if ($floorNo) {
            $query->where('floor_no', $floorNo);
        }

        $buildingUnits = $query->paginate($perPage);

        $message = 'Building units retrieved successfully.';
        if ($buildingId) {
            $message .= ' Filtered by building ID: ' . $buildingId . '.';
        }
        if ($floorNo) {
            $message .= ' Filtered by floor number: ' . $floorNo . '.';
        }
        $message .= ' Total building units: ' . $buildingUnits->total() . '.';

        return response()->json(
            ['message' => $message, 'data' => $buildingUnits],
            200
        );
    }

    public function all()
    {
        try {
            $buildingUnits = BuildingUnit::with('building')->get();

            return response()->json(
                [
                    'message' => 'Building units retrieved successfully',
                    'data' => $buildingUnits,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to retrieve building units',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function count()
    {
        try {
            $total_count = BuildingUnit::count();
            $available_count = BuildingUnit::where(
                'status',
                'Available'
            )->count();
            $occupied_count = BuildingUnit::where(
                'status',
                'Occupied'
            )->count();

            return response()->json(
                [
                    'message' =>
                        'Counts of building units retrieved successfully',
                    'total_count' => $total_count,
                    'available_count' => $available_count,
                    'occupied_count' => $occupied_count,
                ],
                200
            );
        } catch (\Exception $e) {
            return response()->json(
                [
                    'message' => 'Failed to retrieve counts of building units',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }

    public function show($id)
    {
        $buildingUnit = BuildingUnit::find($id);

        if (!$buildingUnit) {
            return response()->json(
                ['message' => 'Building unit not found'],
                404
            );
        }

        return response()->json(['data' => $buildingUnit], 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'building_id' => 'required|uuid',
            'floor_no' => 'required',
            'unit_number' => 'required',
            'room_type' => 'required',
            'area_in_sqm' => ['required_without:estimate_price'],
            'status' => 'required',
            'price_per_meter_sq' => [
                'required_without:estimate_price',
                'numeric',
            ],
            'estimate_price' => [
                'required_without:price_per_meter_sq',
                'numeric',
            ],
        ]);

        $buildingUnit = BuildingUnit::findOrFail($id);

        $width = $request->get('width');
        $length = $request->get('length');
        $area_in_sqm = $request->get('area_in_sqm');

        if ($width === 'NaN' || !is_numeric($width)) {
            $width = null;
        }

        if ($length === 'NaN' || !is_numeric($length)) {
            $length = null;
        }

        if ($area_in_sqm === 'NaN' || !is_numeric($area_in_sqm)) {
            $area_in_sqm = null;
        }

        if (!$buildingUnit) {
            return response()->json(
                ['message' => 'Building unit not found'],
                404
            );
        }

        $buildingUnit->update($request->except('image'));

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/buildingunits'), $imageName);
            $buildingUnit->image = $imageName;
        }
        $buildingUnit->save();

        return response()->json(
            [
                'message' => 'Building unit updated successfully',
                'data' => $buildingUnit,
            ],
            200
        );
    }

    public function destroy($id)
    {
        $buildingUnit = BuildingUnit::find($id);

        if (!$buildingUnit) {
            return response()->json(
                ['message' => 'Building unit not found'],
                404
            );
        }

        if ($buildingUnit->status === 'Occupied') {
            return response()->json(
                ['message' => 'Cannot delete occupied building unit'],
                400
            );
        }

        $buildingUnit->delete();

        return response()->json(
            ['message' => 'Building unit deleted successfully'],
            200
        );
    }
}
