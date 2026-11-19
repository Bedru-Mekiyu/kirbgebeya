<?php

namespace App\Http\Controllers;

use App\Models\BuildingUnitRoomType;
use Illuminate\Http\Request;

class BuildingUnitRoomTypeController extends Controller
{
    public function index()
    {
        $roomTypes = BuildingUnitRoomType::all();
        return response()->json($roomTypes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $roomType = BuildingUnitRoomType::create([
            'name' => $request->name,
        ]);

        return response()->json($roomType, 201);
    }

    public function show($id)
    {
        $roomType = BuildingUnitRoomType::findOrFail($id);
        return response()->json($roomType);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
        ]);

        $roomType = BuildingUnitRoomType::findOrFail($id);
        $roomType->name = $request->name;
        $roomType->save();

        return response()->json($roomType, 200);
    }

    public function destroy($id)
    {
        $roomType = BuildingUnitRoomType::findOrFail($id);
        $roomType->delete();

        return response()->json(null, 204);
    }
}
