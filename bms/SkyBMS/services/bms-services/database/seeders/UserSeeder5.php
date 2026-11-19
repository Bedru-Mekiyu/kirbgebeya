<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder5 extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'admin3',
            'full_name' => 'admin3',
            'email' => 'admin3@gmail.com',
            'user_name' => 'admin3',
            'phone_number' => '0900000002',
            'password' => bcrypt('admin3@123'),
            'unhashed_password' => 'admin3@123',
        ]);
        $user->assignRole('admin');
    }
}
