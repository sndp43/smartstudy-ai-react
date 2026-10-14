<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();
        $jsonPath = database_path('data/phonics_stories.json');
        $storiesData = [];
        if (file_exists($jsonPath)) {
            $storiesData = json_decode(file_get_contents($jsonPath), true) ?: [];
        }

        DB::table('learning_charts')->updateOrInsert(
            ['slug' => 'phonic-stories'],
            [
                'id' => (string) Str::uuid(),
                'subject' => 'english',
                'title' => 'Phonics Stories (Grade 1)',
                'description' => 'Interactive Grade 1 Decodable Readers with 3D Pixar illustrations, line-by-line audio reading, word sounding, and bilingual Marathi support.',
                'chart_type' => 'phonics-stories',
                'chart_data' => json_encode($storiesData, JSON_UNESCAPED_UNICODE),
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    public function down(): void
    {
        DB::table('learning_charts')->where('slug', 'phonic-stories')->delete();
    }
};
