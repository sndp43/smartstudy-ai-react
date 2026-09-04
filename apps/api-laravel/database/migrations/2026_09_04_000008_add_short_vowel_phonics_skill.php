<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const SKILL_ID = '00000000-0000-0000-0000-000000001011';
    private const TOPIC_ID = '00000000-0000-0000-0000-000000000201';

    public function up(): void
    {
        DB::table('skills')->insertOrIgnore([
            'id' => self::SKILL_ID,
            'topic_id' => self::TOPIC_ID,
            'name' => 'Short vowel phonics (A, E, I, O, U)',
            'description' => 'Read and identify words that start with, contain, or end with the vowels A, E, I, O, and U',
            'difficulty' => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('skills')->where('id', self::SKILL_ID)->delete();
    }
};
