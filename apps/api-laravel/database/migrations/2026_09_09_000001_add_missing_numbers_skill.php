<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const MISSING_SKILL_ID = '00000000-0000-0000-0000-000000001019';
    private const NUMBERS_TOPIC_ID = '00000000-0000-0000-0000-000000000101';

    public function up(): void
    {
        // 1. Insert Missing Numbers Skill
        DB::table('skills')->updateOrInsert(
            ['id' => self::MISSING_SKILL_ID],
            [
                'topic_id' => self::NUMBERS_TOPIC_ID,
                'name' => 'Missing numbers',
                'description' => 'Find the missing number in sequences (100 to 500)',
                'difficulty' => 1,
                'template' => 'fill_blank',
                'table_range' => '100-500',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Clear previous exercises for this skill
        DB::table('exercises')->where('skill_id', self::MISSING_SKILL_ID)->delete();

        // 3. Generate 160 Missing Number questions across 100–500 (40 per century)
        $ranges = [
            ['min' => 102, 'max' => 198, 'count' => 40],
            ['min' => 202, 'max' => 298, 'count' => 40],
            ['min' => 302, 'max' => 398, 'count' => 40],
            ['min' => 402, 'max' => 498, 'count' => 40],
        ];

        $exercises = [];
        $totalIndex = 0;

        foreach ($ranges as $r) {
            $step = ($r['max'] - $r['min']) / ($r['count'] - 1);
            for ($k = 0; $k < $r['count']; $k++) {
                $n = (int) round($r['min'] + $k * $step);
                $correct = $n;

                // Alternate between 3-number and 4-number sequences
                if ($k % 3 === 0 && $n >= 103) {
                    // 4 numbers: e.g. 103, 104, __, 106
                    $question = "Write missing numbers\n\n" . ($n - 2) . ", " . ($n - 1) . ", __, " . ($n + 1);
                    $explanation = "The sequence is counting forward by 1: " . ($n - 2) . ", " . ($n - 1) . ", {$n}, " . ($n + 1) . ".";
                } else {
                    // 3 numbers: e.g. 105, __, 107
                    $question = "Write missing numbers\n\n" . ($n - 1) . ", __, " . ($n + 1);
                    $explanation = "The number that comes between " . ($n - 1) . " and " . ($n + 1) . " is {$n}.";
                }

                // Distractors: adjacent numbers that address common miscalculations
                $d1 = $n - 1;
                $d2 = $n + 1;
                $d3 = ($k % 2 === 0) ? ($n + 2) : ($n - 2);

                $options = array_values(array_unique([(string) $correct, (string) $d1, (string) $d2, (string) $d3]));
                shuffle($options);

                $exercises[] = [
                    'id' => (string) Str::uuid(),
                    'skill_id' => self::MISSING_SKILL_ID,
                    'question' => $question,
                    'question_type' => 'MCQ',
                    'template' => 'fill_blank',
                    'difficulty' => 1,
                    'options' => json_encode($options),
                    'correct_answer' => (string) $correct,
                    'explanation' => $explanation,
                    'image_url' => null,
                    'image_question' => null,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $totalIndex++;
            }
        }

        // Insert in batches of 40
        foreach (array_chunk($exercises, 40) as $batch) {
            DB::table('exercises')->insert($batch);
        }
    }

    public function down(): void
    {
        DB::table('exercises')->where('skill_id', self::MISSING_SKILL_ID)->delete();
        DB::table('skills')->where('id', self::MISSING_SKILL_ID)->delete();
    }
};
