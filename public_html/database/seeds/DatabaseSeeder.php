<?php

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        require_once __DIR__ . '/HalalCategorySeeder.php';
        $this->call(HalalCategorySeeder::class);
    }
}
