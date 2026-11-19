<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Building;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class BuildingController extends Controller
{
    public function index()
    {
        return Building::all();
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
            'created_by' => 'nullable',
            'updated_by' => 'nullable',
        ]);

        $existingBuilding = Building::where(
            'name',
            $request->input('name')
        )->first();
        if ($existingBuilding) {
            return response()->json(
                ['message' => 'Building with the same name already exists'],
                400
            );
        }

        $building = new Building();
        $building->name = $request->input('name');
        $building->address = $request->input('address');
        $building->id = Str::uuid();
        $building->created_by = "test";

        // Handle image upload if provided
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/buildings'), $imageName);
            $building->image = $imageName;
        } else {
            $defaultImage = 'default-image.jpg';
            $defaultImagePath = public_path(
                'images/buildings/' . $defaultImage
            );
            if (file_exists($defaultImagePath)) {
                $building->image = $defaultImage;
            } else {
                return response()->json(
                    ['message' => 'Default image not found'],
                    404
                );
            }
        }

        $building->save();
        return response()->json(
            ['message' => 'Building created successfully'],
            201
        );
    }

    public function show($id)
    {
        return Building::findOrFail($id);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required',
            'address' => 'required',
        ]);

        $building = Building::findOrFail($id);
        $building->update($request->except('image'));

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('images/buildings'), $imageName);
            $building->image = $imageName;
        }
        $building->save();

        return response()->json($building, 200);
    }

    public function destroy($id)
    {
        try {
            $building = Building::findOrFail($id);
            $building->delete();

            // If you want to return a JSON response indicating success
            return response()->json(
                [
                    'message' => 'Building deleted successfully',
                    'data' => null,
                ],
                204
            );
        } catch (\Exception $e) {
            // Handle any errors that occur during deletion
            return response()->json(
                [
                    'message' => 'Failed to delete building',
                    'error' => $e->getMessage(),
                ],
                500
            );
        }
    }
}
