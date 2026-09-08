<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    private const MISSING_SKILL_ID = '00000000-0000-0000-0000-000000001019';

    public function up(): void
    {
        DB::table('exercises')
            ->where('skill_id', self::MISSING_SKILL_ID)
            ->update([
                'image_url' => null,
                'image_question' => null,
                'updated_at' => now(),
            ]);
    }

    public function down(): void
    {
        // No-op
    }
};
