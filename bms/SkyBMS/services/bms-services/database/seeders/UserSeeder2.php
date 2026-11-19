<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder2 extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'system admin',
            'full_name' => 'system admin',
            'email' => 'sysadmin@gmail.com',
            'user_name' => 'sysadmin@admin.com',
            'phone_number' => '0941797541',
            'password' => bcrypt('P@55w0rd'),
            'unhashed_password' => 'P@55w0rd',
        ]);
        $user->assignRole('admin');
    }
}
