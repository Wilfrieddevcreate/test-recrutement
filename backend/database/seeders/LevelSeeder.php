<?php

namespace Database\Seeders;

use App\Models\Level;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class LevelSeeder extends Seeder
{
    public const LEVELS = [
        'primaire' => ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        'college' => ['6e', '5e', '4e', '3e'],
        'lycee' => ['Seconde', 'Première', 'Terminale'],
    ];

    public function run(): void
    {
        $order = 0;
        foreach (self::LEVELS as $cycle => $names) {
            foreach ($names as $name) {
                Level::updateOrCreate(
                    ['slug' => Str::slug($name)],
                    ['name' => $name, 'cycle' => $cycle, 'sort_order' => $order++],
                );
            }
        }
    }
}
