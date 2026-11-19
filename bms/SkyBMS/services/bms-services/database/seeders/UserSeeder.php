<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;


class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        user::factory()->create([
            'name'=>'admin',
            'full_name'=>'admin',
            'email'=>'admin@gmail.com',
            'user_name'=>'admin@admin.com',
            'phone_number'=>'0941797541',
            'password'=>bcrypt('password'),
            'unhashed_password'=>'password'
        ])->assignRole('admin');

    }
}
