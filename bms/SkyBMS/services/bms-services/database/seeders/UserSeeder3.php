<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UserSeeder3 extends Seeder
{
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'admin1',
            'full_name' => 'admin1',
            'email' => 'admin1@gmail.com',
            'user_name' => 'admin1',
            'phone_number' => '0900000000',
            'password' => bcrypt('admin1@123'),
            'unhashed_password' => 'admin1@123',
        ]);
        $user->assignRole('admin');
    }
}
