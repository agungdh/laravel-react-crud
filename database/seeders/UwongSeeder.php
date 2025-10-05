<?php

namespace Database\Seeders;

use App\Models\Uwong;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class UwongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Uwong::factory(100)->create();
    }
}
