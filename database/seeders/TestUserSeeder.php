<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class TestUserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'frank@buildflow.org'],
            [
                'name' => 'Frank',
                'email' => 'frank@buildflow.org',
                'password' => Hash::make('dm@b@c@4wq$8CH3'),
            ]
        );
    }
}