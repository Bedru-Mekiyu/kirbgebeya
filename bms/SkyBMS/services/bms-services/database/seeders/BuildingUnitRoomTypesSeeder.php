<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BuildingUnitRoomType;

class BuildingUnitRoomTypesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Define common room types
        $commonRoomTypes = [
            'Office',
            'Shop',
            'Apartment',
            'Conference Room',
            'Storage Room',
            'Restaurant',
            'Gym',
            'Studio',
            'Clinic',
            'Classroom',
            'Cafeteria',
            'Bar',
            'Theater',
            'Event Space',
            'Service',
            'Finance',
            'Other',
        ];

        // Insert data into the table using Eloquent
        foreach ($commonRoomTypes as $type) {
            BuildingUnitRoomType::create(['name' => $type]);
        }
    }
}
