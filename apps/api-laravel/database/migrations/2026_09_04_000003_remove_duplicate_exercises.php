<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        DB::transaction(function () {
            $duplicateGroups = DB::table('exercises')
                ->select('skill_id', 'question', DB::raw('COUNT(*) as total'))
                ->groupBy('skill_id', 'question')
                ->having('total', '>', 1)
                ->get();

            foreach ($duplicateGroups as $group) {
                // Keep the earliest copy so existing references remain stable.
                $duplicates = DB::table('exercises')
                    ->where('skill_id', $group->skill_id)
                    ->where('question', $group->question)
                    ->orderBy('created_at')
                    ->orderBy('id')
                    ->get()
                    ->skip(1)
                    ->pluck('id');

                if ($duplicates->isEmpty()) continue;

                $attemptIds = DB::table('attempts')
                    ->whereIn('exercise_id', $duplicates)
                    ->pluck('id');
                DB::table('mistake_analysis')->whereIn('attempt_id', $attemptIds)->delete();
                DB::table('attempts')->whereIn('exercise_id', $duplicates)->delete();
                DB::table('exercises')->whereIn('id', $duplicates)->delete();
            }
        });
    }

    public function down(): void
    {
        // Duplicate exercise records cannot be reconstructed safely.
    }
};
