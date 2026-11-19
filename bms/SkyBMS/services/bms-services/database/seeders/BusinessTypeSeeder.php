<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\BusinessType;

class BusinessTypeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $businessTypes = [
            ['name' => 'Retail', 'group' => 'Sales'],
            ['name' => 'Restaurant', 'group' => 'Food'],
            ['name' => 'Technology', 'group' => 'IT'],
            ['name' => 'Consulting', 'group' => 'Services'],
            ['name' => 'Construction', 'group' => 'Services'],
            ['name' => 'Healthcare', 'group' => 'Medical'],
            ['name' => 'Hospitality', 'group' => 'Services'],
            ['name' => 'Education', 'group' => 'Services'],
            ['name' => 'Automotive', 'group' => 'Services'],
            ['name' => 'Finance', 'group' => 'Financial'],
            ['name' => 'Real Estate', 'group' => 'Services'],
            ['name' => 'Legal', 'group' => 'Services'],
            ['name' => 'Marketing', 'group' => 'Services'],
            ['name' => 'Insurance', 'group' => 'Financial'],
            ['name' => 'Entertainment', 'group' => 'Services'],
            ['name' => 'Travel', 'group' => 'Services'],
            ['name' => 'Fashion', 'group' => 'Sales'],
            ['name' => 'Fitness', 'group' => 'Health'],
            ['name' => 'Media', 'group' => 'Services'],
            ['name' => 'Telecommunications', 'group' => 'IT'],
            ['name' => 'Other', 'group' => 'Other'],
        ];

        foreach ($businessTypes as $type) {
            BusinessType::create($type);
        }
    }
}
