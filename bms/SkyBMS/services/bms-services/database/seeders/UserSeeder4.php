<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder4 extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'admin2',
            'full_name' => 'admin2',
            'email' => 'admin2@gmail.com',
            'user_name' => 'admin2',
            'phone_number' => '0900000001',
            'password' => bcrypt('admin2@123'),
            'unhashed_password' => 'admin2@123',
        ]);
        $user->assignRole('admin');
    }
}
