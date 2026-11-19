<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionGroupSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissionGroups = [
            ['name' => 'Building', 'description' => 'Manage buildings'],
            [
                'name' => 'Building Unit',
                'description' => 'Manage units within buildings',
            ],
            ['name' => 'Tenant', 'description' => 'Manage tenant information'],
            ['name' => 'Users', 'description' => 'Manage user accounts'],
            ['name' => 'Roles', 'description' => 'Manage user roles'],
            ['name' => 'Lease', 'description' => 'Manage lease agreements'],
            [
                'name' => 'Payment',
                'description' => 'Manage payments and transactions',
            ],
            [
                'name' => 'Maintenance Request',
                'description' => 'Manage maintenance requests',
            ],
            [
                'name' => 'Maintenance Contractor',
                'description' => 'Manage maintenance contractors',
            ],
            [
                'name' => 'Work Order',
                'description' => 'Manage work orders for maintenance',
            ],
            [
                'name' => 'Tenant Information Report',
                'description' => 'Reports related to tenant information',
            ],
            [
                'name' => 'Maintenance Request Report',
                'description' => 'Reports related to maintenance requests',
            ],
            [
                'name' => 'Financial Report',
                'description' => 'Reports related to financial transactions',
            ],
            [
                'name' => 'Lease Expiry Report',
                'description' => 'Reports related to lease expiries',
            ],
        ];

        DB::table('permission_groups')->insert($permissionGroups);
    }
}
