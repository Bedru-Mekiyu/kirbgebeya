<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $permissionGroups = [
            'Building' => ['Create', 'View', 'Edit', 'Delete'],
            'Building Unit' => ['Create', 'View', 'Edit', 'Delete'],
            'Tenant' => ['Create', 'View', 'Edit', 'Delete'],
            'Users' => ['Create', 'View', 'Edit', 'Delete'],
            'Roles' => ['Create', 'View', 'Edit', 'Delete'],
            'Lease' => ['Create', 'View', 'Edit', 'Delete'],
            'Payment' => ['Create', 'View', 'Edit', 'Delete'],
            'Maintenance Request' => ['Create', 'View', 'Edit', 'Delete'],
            'Maintenance Contractor' => ['Create', 'View', 'Edit', 'Delete'],
            'Work Order' => ['Create', 'View', 'Edit', 'Delete'],
            'Tenant Information Report' => ['View'],
            'Maintenance Request Report' => ['View'],
            'Financial Report' => ['View'],
            'Lease Expiry Report' => ['View'],
        ];

        foreach ($permissionGroups as $groupName => $actions) {
            $groupId = DB::table('permission_groups')
                ->where('name', $groupName)
                ->value('id');

            foreach ($actions as $action) {
                DB::table('permissions')->insert([
                    'name' => "{$action} {$groupName}",
                    'guard_name' => 'api',
                    'permission_group_id' => $groupId,
                ]);
            }
        }
    }
}
