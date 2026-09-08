<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const BEFORE_SKILL_ID = '00000000-0000-0000-0000-000000001017';
    private const AFTER_SKILL_ID  = '00000000-0000-0000-0000-000000001018';
    private const NUMBERS_TOPIC_ID = '00000000-0000-0000-0000-000000000101';

    public function up(): void
    {
        // 1. Insert Before Numbers Skill
        DB::table('skills')->updateOrInsert(
            ['id' => self::BEFORE_SKILL_ID],
            [
                'topic_id' => self::NUMBERS_TOPIC_ID,
                'name' => 'Before numbers',
                'description' => 'Find the number that comes before (100 to 500)',
                'difficulty' => 1,
                'template' => 'standard',
                'table_range' => '100-500',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Insert After Numbers Skill
        DB::table('skills')->updateOrInsert(
            ['id' => self::AFTER_SKILL_ID],
            [
                'topic_id' => self::NUMBERS_TOPIC_ID,
                'name' => 'After numbers',
                'description' => 'Find the number that comes after (100 to 500)',
                'difficulty' => 1,
                'template' => 'standard',
                'table_range' => '100-500',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Generate all combinations for Before Numbers (100 to 500)
        DB::table('exercises')->whereIn('skill_id', [self::BEFORE_SKILL_ID, self::AFTER_SKILL_ID])->delete();

        $beforeExercises = [];
        for ($n = 100; $n <= 500; $n++) {
            $correct = $n - 1;
            // Distractors:
            $d1 = $n + 1;
            $d2 = $n >= 102 ? $n - 2 : $n + 2;
            $d3 = $n;

            $options = array_values(array_unique([(string) $correct, (string) $d1, (string) $d2, (string) $d3]));
            shuffle($options);

            $beforeExercises[] = [
                'id' => (string) Str::uuid(),
                'skill_id' => self::BEFORE_SKILL_ID,
                'question' => "Write before numbers\n\n__{$n}",
                'image_url' => null,
                'image_question' => null,
                'question_type' => 'MCQ',
                'template' => 'standard',
                'difficulty' => 1,
                'options' => json_encode($options),
                'correct_answer' => (string) $correct,
                'explanation' => "Write before numbers: __{$n} -> {$correct} comes before {$n}.",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($beforeExercises, 100) as $chunk) {
            DB::table('exercises')->insert($chunk);
        }

        // 4. Generate all combinations for After Numbers (100 to 500)
        $afterExercises = [];
        for ($n = 100; $n <= 500; $n++) {
            $correct = $n + 1;
            // Distractors:
            $d1 = $n - 1;
            $d2 = $n + 2;
            $d3 = $n;

            $options = array_values(array_unique([(string) $correct, (string) $d1, (string) $d2, (string) $d3]));
            shuffle($options);

            $afterExercises[] = [
                'id' => (string) Str::uuid(),
                'skill_id' => self::AFTER_SKILL_ID,
                'question' => "Write after numbers\n\n{$n}__",
                'image_url' => null,
                'image_question' => null,
                'question_type' => 'MCQ',
                'template' => 'standard',
                'difficulty' => 1,
                'options' => json_encode($options),
                'correct_answer' => (string) $correct,
                'explanation' => "Write after numbers: {$n}__ -> {$correct} comes after {$n}.",
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        foreach (array_chunk($afterExercises, 100) as $chunk) {
            DB::table('exercises')->insert($chunk);
        }
    }

    public function down(): void
    {
        $exerciseIds = DB::table('exercises')->whereIn('skill_id', [self::BEFORE_SKILL_ID, self::AFTER_SKILL_ID])->pluck('id');
        $attemptIds = DB::table('attempts')->whereIn('exercise_id', $exerciseIds)->pluck('id');
        DB::table('mistake_analysis')->whereIn('attempt_id', $attemptIds)->delete();
        DB::table('attempts')->whereIn('id', $attemptIds)->delete();
        DB::table('exercises')->whereIn('id', $exerciseIds)->delete();
        DB::table('skill_mastery')->whereIn('skill_id', [self::BEFORE_SKILL_ID, self::AFTER_SKILL_ID])->delete();
        DB::table('skills')->whereIn('id', [self::BEFORE_SKILL_ID, self::AFTER_SKILL_ID])->delete();
    }
};
