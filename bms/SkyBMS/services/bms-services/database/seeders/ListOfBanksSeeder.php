<?php

namespace Database\Seeders;

use App\Models\ListOfBanks;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ListOfBanksSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $banks = [
            'Nib International Bank',
            'Abay Bank',
            'Addis International Bank',
            'Amhara Bank',
            'Awash International Bank',
            'Bank of Abyssinia',
            'Berhan International Bank',
            'Bunna International Bank',
            'Commercial Bank of Ethiopia',
            'Cooperative Bank of Oromia',
            'Dashen Bank',
            'Global Bank Ethiopia',
            'Enat Bank',
            'Lion International Bank',
            'Oromia International Bank',
            'Hibret Bank',
            'Wegagen Bank',
            'Zemen Bank',
            'ZamZam Bank',
            'Hijra Bank',
            'Siinqee Bank',
            'Ahadu Bank',
            'Tsedey Bank',
        ];
        foreach ($banks as $bank) {
            ListOfBanks::create(['name' => $bank]);
        }
    }
}
