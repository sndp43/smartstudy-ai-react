<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SmartStudyController extends Controller
{
    private const DEMO_CHILD = '00000000-0000-0000-0000-000000000099';

    public function health()
    {
        return response()->json(['ok' => true, 'service' => 'smartstudy-api']);
    }

    public function child(string $childId)
    {
        return response()->json(DB::table('children')->where('id', $childId)->first());
    }

    public function children()
    {
        return response()->json(DB::table('children')->select('id', 'name', 'username', 'grade', 'board')->orderBy('name')->get());
    }

    public function createChild(Request $request)
    {
        $data = $request->validate(['name' => ['required', 'string', 'max:100'], 'grade' => ['required', 'string', 'max:20'], 'board' => ['nullable', 'string', 'max:50'], 'medium' => ['nullable', 'string', 'max:50']]);
        $base = Str::of($data['name'])->lower()->replaceMatches('/[^a-z0-9]+/', '_')->trim('_')->value() ?: 'child';
        $username = $base;
        $counter = 1;
        while (DB::table('children')->where('username', $username)->exists()) $username = $base . '_' . $counter++;
        $child = ['id' => (string) Str::uuid(), 'name' => $data['name'], 'username' => $username, 'grade' => $data['grade'], 'board' => $data['board'] ?? null, 'medium' => $data['medium'] ?? 'English', 'created_at' => now(), 'updated_at' => now()];
        DB::table('children')->insert($child);
        return response()->json($child, 201);
    }

    public function skills(string $childId)
    {
        $skills = DB::table('skills as s')
            ->join('topics as t', 't.id', '=', 's.topic_id')
            ->join('subjects as sub', 'sub.id', '=', 't.subject_id')
            ->leftJoin('skill_mastery as m', function ($join) use ($childId) {
                $join->on('m.skill_id', '=', 's.id')->where('m.child_id', '=', $childId);
            })
            ->select('s.id', 's.name', 's.description', 's.difficulty', 's.template', 's.table_range', 't.name as topic', 'sub.name as subject')
            ->selectRaw('COALESCE(m.mastery_score, 0) as mastery_score, COALESCE(m.attempts, 0) as attempts, COALESCE(m.correct_attempts, 0) as correct_attempts')
            ->orderBy('sub.name')->orderBy('t.name')->orderBy('s.difficulty')->orderBy('s.name')->get();

        return response()->json($skills);
    }

    public function learningCharts()
    {
        return response()->json(DB::table('learning_charts')->orderBy('subject')->orderBy('title')->get()->map(function ($chart) {
            $chart->chart_data = json_decode($chart->chart_data, true);
            return $chart;
        }));
    }

    public function learningChart(string $slug)
    {
        $chart = DB::table('learning_charts')->where('slug', $slug)->first();
        if (!$chart) return response()->json(['error' => 'Chart not found'], 404);
        $chart->chart_data = json_decode($chart->chart_data, true);
        return response()->json($chart);
    }

    public function chartProgress(string $childId)
    {
        $progress = DB::table('child_chart_progress')
            ->where('child_id', $childId)
            ->get();

        $tablesPracticed = $progress->whereIn('chart_slug', ['tables-2-30', 'tables-2-10'])->pluck('item_key')->unique()->count();
        $swarPracticed = $progress->where('chart_slug', 'marathi-swar')->pluck('item_key')->unique()->count();
        $vyanjanPracticed = $progress->where('chart_slug', 'marathi-vyanjan')->pluck('item_key')->unique()->count();
        $lettersPracticed = $progress->where('chart_slug', 'english-alphabet')->pluck('item_key')->unique()->count();
        $totalSessions = (int) $progress->sum('practice_count');

        $recordsMap = [];
        foreach ($progress as $row) {
            $recordsMap[$row->item_key] = [
                'practiceCount' => (int) $row->practice_count,
                'lastPracticedAt' => $row->last_practiced_at,
                'chartSlug' => $row->chart_slug,
                'itemKey' => $row->item_key,
            ];
        }

        return response()->json([
            'childId' => $childId,
            'summary' => [
                'tables' => $tablesPracticed,
                'tablesPracticed' => $tablesPracticed,
                'tablesTotal' => 29,
                'swar' => $swarPracticed,
                'swarPracticed' => $swarPracticed,
                'vyanjan' => $vyanjanPracticed,
                'vyanjanPracticed' => $vyanjanPracticed,
                'letters' => $lettersPracticed,
                'lettersPracticed' => $lettersPracticed,
                'totalPracticed' => $totalSessions,
                'totalPracticeSessions' => $totalSessions,
            ],
            'records' => $recordsMap,
            'rawRecords' => $progress,
        ]);
    }

    public function recordChartProgress(Request $request, string $childId)
    {
        $chartSlug = $request->input('chartSlug') ?? $request->input('chart_slug');
        $itemKey = $request->input('itemKey') ?? $request->input('item_key');

        if (!$chartSlug || !$itemKey) {
            return response()->json([
                'error' => 'chartSlug (or chart_slug) and itemKey (or item_key) are required'
            ], 422);
        }

        $child = DB::table('children')->where('id', $childId)->first();
        if (!$child) {
            return response()->json(['error' => 'Child not found'], 404);
        }

        $existing = DB::table('child_chart_progress')->where([
            'child_id' => $childId,
            'chart_slug' => $chartSlug,
            'item_key' => $itemKey,
        ])->first();

        if ($existing) {
            DB::table('child_chart_progress')->where('id', $existing->id)->update([
                'practice_count' => $existing->practice_count + 1,
                'last_practiced_at' => now(),
                'updated_at' => now(),
            ]);
            $count = $existing->practice_count + 1;
        } else {
            DB::table('child_chart_progress')->insert([
                'id' => (string) Str::uuid(),
                'child_id' => $childId,
                'chart_slug' => $chartSlug,
                'item_key' => $itemKey,
                'practice_count' => 1,
                'last_practiced_at' => now(),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
            $count = 1;
        }

        return response()->json([
            'success' => true,
            'record' => [
                'chartSlug' => $chartSlug,
                'itemKey' => $itemKey,
                'practiceCount' => $count,
                'practice_count' => $count,
                'lastPracticedAt' => now()->toISOString(),
            ],
        ]);
    }

    public function tts(Request $request)
    {
        $text = trim((string) $request->query('text', ''));
        $lang = trim((string) $request->query('lang', 'mr'));
        if (!$text) {
            return response()->json(['error' => 'Text parameter is required'], 422);
        }

        $cleanText = mb_substr($text, 0, 160);
        $cleanLang = preg_match('/^[a-z]{2}(-[A-Z]{2})?$/', $lang) ? $lang : 'mr';
        $shortLang = explode('-', $cleanLang)[0];

        $hash = md5("{$shortLang}_{$cleanText}");
        $cacheDir = storage_path('app/tts');
        if (!file_exists($cacheDir)) {
            @mkdir($cacheDir, 0755, true);
        }
        $cacheFile = "{$cacheDir}/{$hash}.mp3";

        if (!file_exists($cacheFile)) {
            $url = 'https://translate.google.com/translate_tts?ie=UTF-8&tl=' . urlencode($shortLang) . '&client=tw-ob&q=' . urlencode($cleanText);
            $ctx = stream_context_create([
                'http' => [
                    'header' => "User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64)\r\n",
                    'timeout' => 5,
                ],
                'ssl' => [
                    'verify_peer' => false,
                    'verify_peer_name' => false,
                ]
            ]);
            $audioData = @file_get_contents($url, false, $ctx);
            if ($audioData !== false && strlen($audioData) > 100) {
                @file_put_contents($cacheFile, $audioData);
            }
        }

        if (file_exists($cacheFile)) {
            return response()->file($cacheFile, [
                'Content-Type' => 'audio/mpeg',
                'Cache-Control' => 'public, max-age=86400',
                'Access-Control-Allow-Origin' => '*',
            ]);
        }

        return response()->json(['error' => 'Audio speech synthesis unavailable'], 503);
    }

    public function generate(Request $request)
    {
        $childId = $request->childId ?: self::DEMO_CHILD;
        $skill = DB::table('skills as s')->join('topics as t', 't.id', '=', 's.topic_id')->where('s.id', $request->skillId)->select('s.*', 't.name as topic')->first();
        if (!$skill) return response()->json(['error' => 'Skill not found'], 404);
        $pattern = DB::table('school_patterns')->where(['child_id' => $childId, 'skill_id' => $skill->id])->orderByDesc('frequency')->first();
        $requestedCount = min((int) ($request->count ?: 10), 100);
        if ($skill->name === 'English missing letters') $requestedCount = max($requestedCount, 10);
        $count = min(100, $requestedCount + ($pattern && $pattern->frequency >= 3 ? 1 : 0));

        $exercises = collect(range(0, $count - 1))->map(function ($i) use ($skill) {
            [$question, $answer, $options] = $this->exercise($skill->name, $i);
            $template = $skill->template ?? 'standard';
            $item = ['id' => (string) Str::uuid(), 'skillId' => $skill->id, 'skillName' => $skill->name, 'question' => $question, 'questionType' => 'MCQ', 'template' => $template, 'difficulty' => $skill->difficulty, 'options' => $options, 'correctAnswer' => $answer, 'explanation' => "The answer is {$answer}."];
            DB::table('exercises')->insert(['id' => $item['id'], 'skill_id' => $skill->id, 'question' => $question, 'question_type' => 'MCQ', 'template' => $template, 'difficulty' => $skill->difficulty, 'options' => json_encode($options), 'correct_answer' => $answer, 'explanation' => $item['explanation'], 'created_at' => now(), 'updated_at' => now()]);
            return $item;
        });

        return response()->json(['childId' => $childId, 'skill' => $skill, 'exercises' => $exercises, 'patternApplied' => $pattern ? ['skill' => $skill->name, 'questionType' => $pattern->question_type, 'frequency' => $pattern->frequency, 'message' => 'Practice adjusted using this school pattern.'] : null]);
    }

    private function exercise(string $name, int $i): array
    {
        if ($name === 'Number sequencing') { $start = 1 + $i % 10; return ["{$start}, ".($start + 1).', __, '.($start + 3), (string) ($start + 2), collect([(string) ($start + 2), (string) ($start + 1), (string) ($start + 4)])->sort()->values()->all()]; }
        if ($name === 'Compare numbers') { $a = 2 + $i % 8; $b = 1 + ($i * 3) % 8; return ["Which number is greater: {$a} or {$b}?", (string) max($a, $b), [(string) $a, (string) $b]]; }
        if ($name === 'Addition within 10') { $a = 1 + $i % 5; $b = 1 + ($i * 2) % 5; return ["{$a} + {$b} = ?", (string) ($a + $b), collect([(string) ($a + $b), (string) ($a + $b - 1), (string) ($a + $b + 1)])->unique()->sort()->values()->all()]; }
        if ($name === 'Addition across 10') { $a = 6 + $i % 4; $b = 4 + $i % 4; return ["{$a} + {$b} = ?", (string) ($a + $b), [(string) ($a + $b - 2), (string) ($a + $b - 1), (string) ($a + $b)]]; }
        if ($name === 'Before numbers' || str_contains(strtolower($name), 'before number')) {
            $num = 100 + ($i % 401);
            $correct = $num - 1;
            $d1 = $num + 1;
            $d2 = $num >= 102 ? $num - 2 : $num + 2;
            $d3 = $num;
            $options = collect([(string) $correct, (string) $d1, (string) $d2, (string) $d3])->unique()->shuffle()->values()->all();
            return ["Write before numbers\n\n__{$num}", (string) $correct, $options];
        }
        if ($name === 'After numbers' || str_contains(strtolower($name), 'after number')) {
            $num = 100 + ($i % 401);
            $correct = $num + 1;
            $d1 = $num - 1;
            $d2 = $num + 2;
            $d3 = $num;
            $options = collect([(string) $correct, (string) $d1, (string) $d2, (string) $d3])->unique()->shuffle()->values()->all();
            return ["Write after numbers\n\n{$num}__", (string) $correct, $options];
        }
        if ($name === 'Missing numbers' || str_contains(strtolower($name), 'missing number')) {
            $num = 101 + ($i % 399); // 101 to 499
            $correct = $num;
            $prev = $num - 1;
            $next = $num + 1;
            $d1 = $num - 1;
            $d2 = $num + 1;
            $d3 = $num >= 103 ? $num - 2 : $num + 2;
            $options = collect([(string) $correct, (string) $d1, (string) $d2, (string) $d3])->unique()->shuffle()->values()->all();
            return ["Write missing numbers\n\n{$prev}, __, {$next}", (string) $correct, $options];
        }
        if ($name === 'Multiplication tables 2-10' || str_contains(strtolower($name), 'multiplication')) {
            $table = 2 + ($i % 29); // 2 to 30
            $multiplier = 1 + (($i * 7) % 10);
            $answer = $table * $multiplier;
            $options = collect([$answer, max(1, $answer - $table), $answer + $table])->unique()->shuffle()->values()->map(fn ($value) => (string) $value)->all();
            return ["{$table} x {$multiplier} = ?", (string) $answer, $options];
        }
        if ($name === 'English phonics') { $items = [['Which letter makes the sound in sun?', 'S', ['S', 'M', 'T']], ['Which letter makes the sound in ball?', 'B', ['B', 'D', 'P']], ['Which letter makes the sound in cat?', 'C', ['C', 'K', 'G']]]; return $items[$i % count($items)]; }
        if ($name === 'English alphabet A-Z') {
            $letters = range('A', 'Z');
            $answer = $letters[$i % count($letters)];
            $position = array_search($answer, $letters, true);
            $options = array_values(array_unique([$answer, $letters[($position + 1) % 26], $letters[($position + 4) % 26]]));
            return ["Choose the letter {$answer}.", $answer, $options];
        }
        if ($name === 'Phonics chart A-Z') {
            $items = [['A as in apple', 'A', ['A', 'E', 'I']], ['B as in ball', 'B', ['B', 'D', 'P']], ['C as in cat', 'C', ['C', 'K', 'G']], ['D as in dog', 'D', ['D', 'T', 'B']], ['E as in egg', 'E', ['E', 'A', 'I']], ['F as in fish', 'F', ['F', 'V', 'P']], ['G as in goat', 'G', ['G', 'J', 'C']], ['H as in hat', 'H', ['H', 'N', 'M']], ['I as in ink', 'I', ['I', 'E', 'A']], ['J as in jug', 'J', ['J', 'G', 'D']], ['K as in kite', 'K', ['K', 'C', 'T']], ['L as in lion', 'L', ['L', 'R', 'N']], ['M as in mango', 'M', ['M', 'N', 'W']], ['N as in nest', 'N', ['N', 'M', 'H']], ['O as in orange', 'O', ['O', 'A', 'U']], ['P as in pen', 'P', ['P', 'B', 'T']], ['Q as in queen', 'Q', ['Q', 'G', 'C']], ['R as in rat', 'R', ['R', 'L', 'W']], ['S as in sun', 'S', ['S', 'Z', 'C']], ['T as in top', 'T', ['T', 'D', 'P']], ['U as in umbrella', 'U', ['U', 'O', 'A']], ['V as in van', 'V', ['V', 'F', 'W']], ['W as in watch', 'W', ['W', 'V', 'M']], ['X as in box', 'X', ['X', 'S', 'Z']], ['Y as in yellow', 'Y', ['Y', 'W', 'J']], ['Z as in zebra', 'Z', ['Z', 'S', 'C']]];
            $item = $items[$i % count($items)];
            return ["Which letter says the sound in {$item[0]}?", $item[1], $item[2]];
        }
        if ($name === 'Short vowel phonics (A, E, I, O, U)') {
            $items = [
                ['Which word starts with the vowel A?', 'apple', ['apple', 'sun', 'dog']],
                ['Which word has A in the middle?', 'cat', ['cat', 'hen', 'pig']],
                ['Which word ends with the vowel A?', 'pizza', ['pizza', 'bed', 'sun']],
                ['Which word starts with the vowel E?', 'egg', ['egg', 'hat', 'pin']],
                ['Which word has E in the middle?', 'bed', ['bed', 'cat', 'pig']],
                ['Which word ends with the vowel E?', 'kite', ['kite', 'dog', 'sun']],
                ['Which word starts with the vowel I?', 'igloo', ['igloo', 'egg', 'octopus']],
                ['Which word has I in the middle?', 'pig', ['pig', 'cat', 'sun']],
                ['Which word ends with the vowel I?', 'kiwi', ['kiwi', 'apple', 'bed']],
                ['Which word starts with the vowel O?', 'octopus', ['octopus', 'umbrella', 'egg']],
                ['Which word has O in the middle?', 'dog', ['dog', 'pig', 'hen']],
                ['Which word ends with the vowel O?', 'tomato', ['tomato', 'kite', 'sun']],
                ['Which word starts with the vowel U?', 'umbrella', ['umbrella', 'apple', 'igloo']],
                ['Which word has U in the middle?', 'sun', ['sun', 'bed', 'pig']],
                ['Which word ends with the vowel U?', 'menu', ['menu', 'cat', 'dog']],
            ];
            return $items[$i % count($items)];
        }
        if ($name === 'English missing letters') { $items = [["Which letter is missing?\n\nGA_E", 'T', ['T', 'K', 'P']], ["Which letter is missing?\n\nCA_E", 'K', ['K', 'V', 'T']], ["Which letter is missing?\n\nFI_H", 'S', ['S', 'T', 'C']], ["Which letter is missing?\n\nM_ON", 'O', ['O', 'A', 'E']], ["Which letter is missing?\n\nST_R", 'A', ['A', 'E', 'I']], ["Which letter is missing?\n\nBA_L", 'L', ['L', 'T', 'P']], ["Which letter is missing?\n\nD_G", 'O', ['O', 'A', 'U']], ["Which letter is missing?\n\nS_N", 'U', ['U', 'O', 'A']], ["Which letter is missing?\n\nBO_K", 'O', ['O', 'A', 'E']], ["Which letter is missing?\n\nTR_E", 'E', ['E', 'A', 'I']]]; return $items[$i % count($items)]; }
        if ($name === 'Hindi letters') { $items = [['Which is a Hindi letter?', 'Ka', ['Ka', 'Ma', 'Ta']], ['Which is a Hindi letter?', 'Ma', ['Ma', 'Pa', 'Na']], ['Which is a Hindi letter?', 'Ta', ['Ta', 'Ra', 'La']]]; return $items[$i % count($items)]; }
        if ($name === 'Marathi letters') {
            $items = [
                ['मराठी अक्षर ओळखा.', 'अ', ['अ', 'क', 'म']],
                ['मराठी अक्षर ओळखा.', 'क', ['क', 'प', 'त']],
                ['मराठी अक्षर ओळखा.', 'म', ['म', 'र', 'ल']],
                ['मराठी अक्षर ओळखा.', 'आ', ['आ', 'इ', 'उ']],
                ['मराठी अक्षर ओळखा.', 'न', ['न', 'व', 'स']],
            ];
            return $items[$i % count($items)];
        }
        if ($name === 'Marathi chaudakhadi') {
            $items = [
                ['क + ा = ?', 'का', ['क', 'का', 'कि']],
                ['क + ि = ?', 'कि', ['की', 'कि', 'कु']],
                ['क + ी = ?', 'की', ['कि', 'की', 'कू']],
                ['म + ु = ?', 'मु', ['मा', 'मु', 'मू']],
                ['म + ू = ?', 'मू', ['मु', 'मू', 'मे']],
                ['न + े = ?', 'ने', ['नै', 'ने', 'नो']],
                ['न + ै = ?', 'नै', ['ने', 'नै', 'नौ']],
                ['स + ो = ?', 'सो', ['से', 'सो', 'सौ']],
                ['स + ौ = ?', 'सौ', ['सो', 'सौ', 'सू']],
                ['र + ं = ?', 'रं', ['र', 'रा', 'रं']],
                ['ह + ः = ?', 'हः', ['ह', 'हा', 'हः']],
                ['क + ॅ = ?', 'कॅ', ['का', 'कॅ', 'के']],
                ['क + ॉ = ?', 'कॉ', ['को', 'कॉ', 'कौ']],
            ];
            return $items[$i % count($items)];
        }
        if ($name === 'Marathi vowels (अ to औ)') {
            $items = [['मराठी स्वर ओळखा.', 'अ', ['अ', 'क', 'म']], ['मराठी स्वर ओळखा.', 'आ', ['आ', 'इ', 'उ']], ['मराठी स्वर ओळखा.', 'इ', ['इ', 'ई', 'उ']], ['मराठी स्वर ओळखा.', 'ई', ['ई', 'इ', 'ए']], ['मराठी स्वर ओळखा.', 'उ', ['उ', 'ऊ', 'ओ']], ['मराठी स्वर ओळखा.', 'ऊ', ['ऊ', 'उ', 'औ']], ['मराठी स्वर ओळखा.', 'ए', ['ए', 'ऐ', 'ओ']], ['मराठी स्वर ओळखा.', 'ऐ', ['ऐ', 'ए', 'औ']], ['मराठी स्वर ओळखा.', 'ओ', ['ओ', 'औ', 'उ']], ['मराठी स्वर ओळखा.', 'औ', ['औ', 'ओ', 'आ']]];
            return $items[$i % count($items)];
        }
        if ($name === 'Living and non-living things') { $items = [['Which one is living?', 'Plant', ['Plant', 'Chair', 'Ball']], ['Which one is not living?', 'Book', ['Dog', 'Tree', 'Book']], ['Which one is living?', 'Bird', ['Rock', 'Bird', 'Cup']]]; return $items[$i % count($items)]; }
        $a = 5 + $i % 5; $b = 1 + $i % 4; return ["{$a} - {$b} = ?", (string) ($a - $b), [(string) ($a - $b - 1), (string) ($a - $b), (string) ($a - $b + 1)]];
    }

    public function attempt(Request $request)
    {
        $childId = $request->childId ?: self::DEMO_CHILD;
        $exercise = DB::table('exercises as e')->join('skills as s', 's.id', '=', 'e.skill_id')->where('e.id', $request->exerciseId)->select('e.*', 's.name as skill_name')->first();
        if (!$exercise) return response()->json(['error' => 'Exercise not found'], 404);
        $answer = trim((string) $request->answer);
        $correct = $answer === trim((string) $exercise->correct_answer);
        $attemptId = (string) Str::uuid();
        DB::table('attempts')->insert(['id' => $attemptId, 'child_id' => $childId, 'exercise_id' => $exercise->id, 'answer' => $answer, 'correct' => $correct, 'time_taken_ms' => $request->timeTakenMs, 'attempted_at' => now()]);
        $previous = DB::table('skill_mastery')->where(['child_id' => $childId, 'skill_id' => $exercise->skill_id])->first();
        $attempts = ($previous->attempts ?? 0) + 1; $correctAttempts = ($previous->correct_attempts ?? 0) + ($correct ? 1 : 0); $streak = $correct ? ($previous->consecutive_correct ?? 0) + 1 : 0;
        $masteryScore = (int) round(min(100, ($correctAttempts / $attempts) * 85 + min(15, $streak * 3)));
        $mastery = ['masteryScore' => $masteryScore, 'confidence' => (int) min(100, $attempts * 12 + ($correct ? 15 : 0)), 'attempts' => $attempts, 'correctAttempts' => $correctAttempts, 'consecutiveCorrect' => $streak];
        DB::table('skill_mastery')->updateOrInsert(['child_id' => $childId, 'skill_id' => $exercise->skill_id], ['id' => $previous->id ?? (string) Str::uuid(), 'mastery_score' => $masteryScore, 'confidence' => $mastery['confidence'], 'attempts' => $attempts, 'correct_attempts' => $correctAttempts, 'consecutive_correct' => $streak, 'last_attempt_at' => now(), 'next_review_at' => now()->addDay()]);
        $analysis = $intervention = null;
        if (!$correct) { $analysis = ['mistakeType' => 'CONCEPTUAL_ERROR', 'misconception' => 'The child may need another explanation of this skill.', 'confidence' => 0.55, 'evidence' => ["Question: {$exercise->question}", "Child answer: {$answer}", "Correct answer: {$exercise->correct_answer}"]]; $intervention = ['strategyType' => 'VISUAL', 'title' => "Let's see it another way", 'steps' => ['Use pictures or objects.', 'Explain the answer aloud.', 'Try one easier example.', 'Try the original type again.']]; DB::table('mistake_analysis')->insert(['id' => (string) Str::uuid(), 'attempt_id' => $attemptId, 'mistake_type' => $analysis['mistakeType'], 'misconception' => $analysis['misconception'], 'confidence' => $analysis['confidence'], 'evidence' => json_encode($analysis['evidence'])]); }
        return response()->json(compact('correct', 'mastery', 'analysis', 'intervention') + ['correctAnswer' => $exercise->correct_answer]);
    }

    public function dashboard(Request $request, string $childId)
    {
        $skills = DB::table('skills as s')->join('topics as t', 't.id', '=', 's.topic_id')->join('subjects as sub', 'sub.id', '=', 't.subject_id')->leftJoin('skill_mastery as m', function ($join) use ($childId) { $join->on('m.skill_id', '=', 's.id')->where('m.child_id', '=', $childId); })->select('s.id', 's.name', 's.description', 's.difficulty', 's.template', 's.table_range', 't.name as topic', 'sub.name as subject')->selectRaw('COALESCE(m.mastery_score, 0) as mastery_score, COALESCE(m.attempts, 0) as attempts')->orderBy('mastery_score')->get();
        $page = max(1, (int) $request->query('mistakePage', 1));
        $perPage = 10;
        $mistakeQuery = DB::table('mistake_analysis as ma')->join('attempts as a', 'a.id', '=', 'ma.attempt_id')->join('exercises as e', 'e.id', '=', 'a.exercise_id')->join('skills as s', 's.id', '=', 'e.skill_id')->join('topics as t', 't.id', '=', 's.topic_id')->join('subjects as sub', 'sub.id', '=', 't.subject_id')->where('a.child_id', $childId);
        $mistakes = (clone $mistakeQuery)->select('ma.mistake_type', 'ma.misconception', 'ma.confidence', 'e.question', 'sub.name as subject', 's.name as skill', 'a.attempted_at')->orderByDesc('a.attempted_at')->skip(($page - 1) * $perPage)->take($perPage)->get();
        $mistakesHasMore = $mistakeQuery->count() > $page * $perPage;
        return response()->json(compact('skills', 'mistakes', 'mistakesHasMore'));
    }

    public function report(string $childId)
    {
        $child = DB::table('children')->select('id', 'name', 'username', 'grade', 'board', 'medium')->where('id', $childId)->first();
        if (!$child) return response()->json(['error' => 'Child not found'], 404);

        $totals = DB::table('attempts')->where('child_id', $childId)->selectRaw('COUNT(*) as attempts, COALESCE(SUM(correct), 0) as correct_attempts')->first();
        $skills = DB::table('skills as s')->join('topics as t', 't.id', '=', 's.topic_id')->join('subjects as sub', 'sub.id', '=', 't.subject_id')->leftJoin('skill_mastery as m', function ($join) use ($childId) { $join->on('m.skill_id', '=', 's.id')->where('m.child_id', '=', $childId); })->select('s.id', 's.name', 't.name as topic', 'sub.name as subject')->selectRaw('COALESCE(m.mastery_score, 0) as mastery_score, COALESCE(m.confidence, 0) as confidence, COALESCE(m.attempts, 0) as attempts, COALESCE(m.correct_attempts, 0) as correct_attempts, m.last_attempt_at, m.next_review_at')->orderBy('mastery_score')->get();
        $misconceptions = DB::table('mistake_analysis as ma')->join('attempts as a', 'a.id', '=', 'ma.attempt_id')->join('exercises as e', 'e.id', '=', 'a.exercise_id')->join('skills as s', 's.id', '=', 'e.skill_id')->join('topics as t', 't.id', '=', 's.topic_id')->join('subjects as sub', 'sub.id', '=', 't.subject_id')->where('a.child_id', $childId)->select('ma.mistake_type', 'ma.misconception', 'ma.confidence', 's.name as skill', 'sub.name as subject', 'e.question', 'a.attempted_at')->orderByDesc('a.attempted_at')->limit(20)->get();
        $patterns = DB::table('school_patterns as p')->leftJoin('skills as s', 's.id', '=', 'p.skill_id')->select('p.question_type', 'p.frequency', 'p.difficulty_distribution', 'p.examples', 's.name as skill')->where('p.child_id', $childId)->orderByDesc('p.frequency')->get();
        $attempts = (int) ($totals->attempts ?? 0);
        $correctAttempts = (int) ($totals->correct_attempts ?? 0);

        return response()->json(['child' => $child, 'summary' => ['attempts' => $attempts, 'correctAttempts' => $correctAttempts, 'accuracy' => $attempts ? round(($correctAttempts / $attempts) * 100, 2) : 0, 'skillsTracked' => $skills->count(), 'skillsNeedingAttention' => $skills->where('mastery_score', '<', 60)->count(), 'strongSkills' => $skills->where('mastery_score', '>=', 80)->count()], 'skills' => $skills, 'misconceptions' => $misconceptions, 'schoolPatterns' => $patterns]);
    }

    public function material(Request $request)
    {
        $childId = $request->childId ?: self::DEMO_CHILD;
        $text = trim((string) ($request->extractedText ?: ''));
        if ($text === '') return response()->json(['error' => 'Worksheet text is required.'], 422);
        $materialId = (string) Str::uuid();
        DB::table('learning_materials')->insert(['id' => $materialId, 'child_id' => $childId, 'type' => 'WORKSHEET', 'title' => $request->title ?: 'Uploaded worksheet', 'extracted_text' => $text, 'created_at' => now(), 'updated_at' => now()]);
        $questions = preg_split('/\r?\n|(?<=[?])\s+/', $text, -1, PREG_SPLIT_NO_EMPTY);
        $skills = DB::table('skills as s')->join('topics as t', 't.id', '=', 's.topic_id')->select('s.id', 's.name', 's.difficulty', 't.subject_id')->get();
        $classified = collect($questions)->map(function ($question) use ($materialId, $skills) {
            $question = trim($question, " \t\n\r\0\x0B.-");
            if ($question === '' || preg_match('/^(fill\s+in\s+the\s+blanks?|answer\s+the\s+questions?|complete\s+the\s+blanks?)/i', $question)) return null;
            $blankAnswer = null;
            if (preg_match('/\bGA_E\b/i', $question)) {
                $blankAnswer = 'T';
                $type = 'FILL_IN_BLANK';
            } elseif (preg_match('/\bCA_E\b/i', $question)) {
                $blankAnswer = 'K';
                $type = 'FILL_IN_BLANK';
            } else {
                $type = stripos($question, '+') !== false || (stripos($question, '-') !== false && !preg_match('/:[-]\s*/', $question)) ? 'ARITHMETIC' : (stripos($question, 'greater') !== false ? 'COMPARISON' : 'SHORT_ANSWER');
            }
            $skill = $skills->first(fn ($item) => ($blankAnswer && stripos($item->name, 'missing letters') !== false) || ($type === 'ARITHMETIC' && stripos($item->name, 'addition') !== false) || ($type === 'ARITHMETIC' && stripos($item->name, 'subtraction') !== false) || (preg_match('/__|missing|before|after/i', $question) && stripos($item->name, 'sequencing') !== false) || ($type === 'COMPARISON' && stripos($item->name, 'compare') !== false));
            $metadata = ['source' => 'text-analysis'];
            if ($blankAnswer) $metadata['answer'] = $blankAnswer;
            DB::table('material_questions')->insert(['id' => (string) Str::uuid(), 'material_id' => $materialId, 'question_text' => $question, 'question_type' => $type, 'skill_id' => $skill->id ?? null, 'difficulty' => $skill->difficulty ?? 1, 'metadata' => json_encode($metadata), 'created_at' => now(), 'updated_at' => now()]);
            return ['question' => $question, 'questionType' => $type, 'skill' => $skill->name ?? null, 'difficulty' => $skill->difficulty ?? 1, 'answer' => $blankAnswer];
        })->values();
        $classified = $classified->filter()->values();
        foreach ($classified->groupBy(fn ($item) => ($item['skill'] ?: 'unknown').'|'.$item['questionType']) as $group) {
            $sample = $group->first();
            $skill = $skills->firstWhere('name', $sample['skill']);
            $existing = DB::table('school_patterns')->where(['child_id' => $childId, 'skill_id' => $skill->id ?? null, 'question_type' => $sample['questionType']])->first();
            $examples = $existing ? json_decode($existing->examples ?: '[]', true) : [];
            $examples = array_slice(array_values(array_unique(array_merge($examples, $group->pluck('question')->all()))), 0, 5);
            DB::table('school_patterns')->updateOrInsert(['child_id' => $childId, 'skill_id' => $skill->id ?? null, 'question_type' => $sample['questionType']], ['id' => $existing->id ?? (string) Str::uuid(), 'subject_id' => $skill->subject_id ?? DB::table('subjects')->value('id'), 'frequency' => ($existing->frequency ?? 0) + $group->count(), 'difficulty_distribution' => json_encode([$sample['difficulty'] => $group->count()]), 'examples' => json_encode($examples), 'updated_at' => now(), 'created_at' => $existing->created_at ?? now()]);
        }
        return response()->json(['materialId' => $materialId, 'status' => 'ANALYZED', 'questions' => $classified, 'patternsLearned' => $classified->groupBy(fn ($item) => ($item['skill'] ?: 'unknown').'|'.$item['questionType'])->count()]);
    }

    public function patterns(string $childId)
    {
        return response()->json(DB::table('school_patterns as p')->leftJoin('skills as s', 's.id', '=', 'p.skill_id')->select('p.id', 'p.question_type', 'p.frequency', 'p.difficulty_distribution', 'p.examples', 's.name as skill')->where('p.child_id', $childId)->orderByDesc('p.frequency')->get());
    }

    public function clearMisconceptions(Request $request, string $childId)
    {
        $subject = $request->query('subject');
        if (!$subject || $subject === 'All') {
            $attemptIds = DB::table('attempts')->where('child_id', $childId)->pluck('id');
        } else {
            $attemptIds = DB::table('attempts as a')
                ->join('exercises as e', 'e.id', '=', 'a.exercise_id')
                ->join('skills as s', 's.id', '=', 'e.skill_id')
                ->join('topics as t', 't.id', '=', 's.topic_id')
                ->join('subjects as sub', 'sub.id', '=', 't.subject_id')
                ->where('a.child_id', $childId)->where('sub.name', $subject)->pluck('a.id');
        }
        $deleted = DB::table('mistake_analysis')->whereIn('attempt_id', $attemptIds)->delete();
        return response()->json(['deleted' => $deleted, 'subject' => $subject ?: 'All']);
    }

    public function worksheets(string $childId)
    {
        return response()->json(DB::table('learning_materials as m')->where('m.child_id', $childId)->select('m.id', 'm.title', 'm.type', 'm.extracted_text', 'm.created_at')->orderByDesc('m.created_at')->get());
    }

    public function createSkill(Request $request)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:100'],
            'topic' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'difficulty' => ['nullable', 'integer', 'min:1', 'max:5'],
            'template' => ['nullable', 'string', 'in:standard,image_prompt,story_card,flashcard,fill_blank,true_false'],
            'table_range' => ['nullable', 'string', 'max:50'],
        ]);
        $subject = DB::table('subjects')->where('name', $data['subject'])->first();
        if (!$subject) return response()->json(['error' => 'Subject not found'], 404);
        $topic = DB::table('topics')->where(['subject_id' => $subject->id, 'name' => $data['topic']])->first();
        if (!$topic) {
            $topic = (object) ['id' => (string) Str::uuid(), 'subject_id' => $subject->id, 'name' => $data['topic']];
            DB::table('topics')->insert(['id' => $topic->id, 'subject_id' => $topic->subject_id, 'name' => $topic->name, 'description' => null, 'created_at' => now(), 'updated_at' => now()]);
        }
        $template = $data['template'] ?? 'standard';
        $tableRange = $data['table_range'] ?? '2-10';
        $skill = ['id' => (string) Str::uuid(), 'topic_id' => $topic->id, 'name' => $data['name'], 'description' => $data['description'] ?? null, 'difficulty' => $data['difficulty'] ?? 1, 'template' => $template, 'table_range' => $tableRange, 'created_at' => now(), 'updated_at' => now()];
        DB::table('skills')->insert($skill);
        return response()->json($skill + ['subject' => $subject->name, 'topic' => $topic->name], 201);
    }

    public function updateSkill(Request $request, string $skillId)
    {
        $data = $request->validate([
            'subject' => ['required', 'string', 'max:100'],
            'topic' => ['required', 'string', 'max:100'],
            'name' => ['required', 'string', 'max:150'],
            'description' => ['nullable', 'string', 'max:500'],
            'difficulty' => ['nullable', 'integer', 'min:1', 'max:5'],
            'template' => ['nullable', 'string', 'in:standard,image_prompt,story_card,flashcard,fill_blank,true_false'],
            'table_range' => ['nullable', 'string', 'max:50'],
        ]);
        $skill = DB::table('skills')->where('id', $skillId)->first();
        if (!$skill) return response()->json(['error' => 'Skill not found'], 404);
        $subject = DB::table('subjects')->where('name', $data['subject'])->first();
        if (!$subject) return response()->json(['error' => 'Subject not found'], 404);
        $topic = DB::table('topics')->where(['subject_id' => $subject->id, 'name' => $data['topic']])->first();
        if (!$topic) {
            $topic = (object) ['id' => (string) Str::uuid()];
            DB::table('topics')->insert(['id' => $topic->id, 'subject_id' => $subject->id, 'name' => $data['topic'], 'description' => null, 'created_at' => now(), 'updated_at' => now()]);
        }
        $template = $data['template'] ?? $skill->template ?? 'standard';
        $tableRange = $data['table_range'] ?? $skill->table_range ?? '2-10';
        DB::table('skills')->where('id', $skillId)->update([
            'topic_id' => $topic->id,
            'name' => $data['name'],
            'description' => $data['description'] ?? null,
            'difficulty' => $data['difficulty'] ?? 1,
            'template' => $template,
            'table_range' => $tableRange,
            'updated_at' => now()
        ]);
        // Also cascade the template update to all exercises under this skill
        DB::table('exercises')->where('skill_id', $skillId)->update([
            'template' => $template,
            'updated_at' => now()
        ]);
        return response()->json(DB::table('skills as s')->join('topics as t', 't.id', '=', 's.topic_id')->join('subjects as sub', 'sub.id', '=', 't.subject_id')->where('s.id', $skillId)->select('s.*', 't.name as topic', 'sub.name as subject')->first());
    }

    public function deleteSkill(string $skillId)
    {
        if (!DB::table('skills')->where('id', $skillId)->exists()) return response()->json(['error' => 'Skill not found'], 404);
        DB::transaction(function () use ($skillId) {
            $exerciseIds = DB::table('exercises')->where('skill_id', $skillId)->pluck('id');
            $attemptIds = DB::table('attempts')->whereIn('exercise_id', $exerciseIds)->pluck('id');
            DB::table('mistake_analysis')->whereIn('attempt_id', $attemptIds)->delete();
            DB::table('attempts')->whereIn('exercise_id', $exerciseIds)->delete();
            DB::table('teaching_interventions')->where('skill_id', $skillId)->delete();
            DB::table('skill_mastery')->where('skill_id', $skillId)->delete();
            DB::table('school_patterns')->where('skill_id', $skillId)->delete();
            DB::table('material_questions')->where('skill_id', $skillId)->update(['skill_id' => null]);
            DB::table('exercises')->where('skill_id', $skillId)->delete();
            DB::table('skills')->where('id', $skillId)->delete();
        });
        return response()->json(['deleted' => true, 'skillId' => $skillId]);
    }

    public function skillExercises(Request $request, string $skillId)
    {
        $skill = DB::table('skills')->where('id', $skillId)->first();
        if (!$skill) return response()->json(['error' => 'Skill not found'], 404);

        $range = $request->query('range');
        if ($range === null || $range === '') {
            $range = $skill->table_range ?? null;
        } elseif ($range === 'all') {
            $range = null;
        }

        $exercises = DB::table('exercises')->where('skill_id', $skillId)->orderBy('created_at')->get()->map(function ($exercise) {
            $exercise->options = json_decode($exercise->options ?: '[]', true);
            return $exercise;
        });

        if ($range && preg_match('/^(\d+)\s*-\s*(\d+)$/', $range, $m)) {
            $min = (int) $m[1];
            $max = (int) $m[2];
            if ($min > $max) {
                [$min, $max] = [$max, $min];
            }
            $exercises = $exercises->filter(function ($exercise) use ($min, $max) {
                if (preg_match('/^(\d+)\s*(?:x|\*|×)/i', $exercise->question, $match)) {
                    $table = (int) $match[1];
                    return $table >= $min && $table <= $max;
                }
                if (is_numeric($exercise->correct_answer)) {
                    $num = (int) $exercise->correct_answer;
                    return $num >= $min && $num <= $max;
                }
                if (preg_match('/(?:\b__(\d+)|(\d+)__\b|(?:before|after)[^\d]*(\d+)|(\d+))/i', $exercise->question, $match)) {
                    $num = (int) ($match[1] ?: $match[2] ?: $match[3] ?: $match[4]);
                    return $num >= $min && $num <= $max;
                }
                return true;
            })->values();
        }

        if ($request->boolean('shuffle')) {
            $exercises = $exercises->shuffle()->values()->map(function ($ex) {
                if (is_array($ex->options)) {
                    shuffle($ex->options);
                }
                return $ex;
            });
        }

        if ($request->has('limit') && (int) $request->query('limit') > 0) {
            $exercises = $exercises->take((int) $request->query('limit'))->values();
        }

        return response()->json($exercises);
    }

    public function updateExercise(Request $request, string $exerciseId)
    {
        $data = $request->validate(['question' => ['required', 'string', 'max:1000'], 'options' => ['required', 'array', 'min:2'], 'options.*' => ['string', 'max:200'], 'correctAnswer' => ['required', 'string', 'max:200'], 'explanation' => ['required', 'string', 'max:1000'], 'difficulty' => ['required', 'integer', 'min:1', 'max:5'], 'imageUrl' => ['nullable', 'string', 'max:10000000'], 'imageQuestion' => ['nullable', 'string', 'max:1000'], 'template' => ['nullable', 'in:standard,image_prompt,story_card,flashcard,fill_blank,true_false']]);
        if (!in_array($data['correctAnswer'], $data['options'], true)) return response()->json(['error' => 'Correct answer must be one of the options.'], 422);
        $exercise = DB::table('exercises')->where('id', $exerciseId)->first();
        if (!$exercise) return response()->json(['error' => 'Exercise not found'], 404);
        $skill = DB::table('skills')->where('id', $exercise->skill_id)->first();
        $template = $data['template'] ?? $skill->template ?? $exercise->template ?? 'standard';
        DB::table('exercises')->where('id', $exerciseId)->update(['question' => $data['question'], 'options' => json_encode(array_values($data['options'])), 'correct_answer' => $data['correctAnswer'], 'explanation' => $data['explanation'], 'difficulty' => $data['difficulty'], 'image_url' => $data['imageUrl'] ?? null, 'image_question' => $data['imageQuestion'] ?? null, 'template' => $template, 'updated_at' => now()]);
        $exercise = DB::table('exercises')->where('id', $exerciseId)->first();
        $exercise->options = json_decode($exercise->options ?: '[]', true);
        return response()->json($exercise);
    }

    public function createExercise(Request $request, string $skillId)
    {
        $data = $request->validate(['question' => ['required', 'string', 'max:1000'], 'options' => ['required', 'array', 'min:2'], 'options.*' => ['string', 'max:200'], 'correctAnswer' => ['required', 'string', 'max:200'], 'explanation' => ['required', 'string', 'max:1000'], 'difficulty' => ['required', 'integer', 'min:1', 'max:5'], 'imageUrl' => ['nullable', 'string', 'max:10000000'], 'imageQuestion' => ['nullable', 'string', 'max:1000'], 'template' => ['nullable', 'in:standard,image_prompt,story_card,flashcard,fill_blank,true_false']]);
        $skill = DB::table('skills')->where('id', $skillId)->first();
        if (!$skill) return response()->json(['error' => 'Skill not found'], 404);
        if (!in_array($data['correctAnswer'], $data['options'], true)) return response()->json(['error' => 'Correct answer must be one of the options.'], 422);
        $template = $data['template'] ?? $skill->template ?? 'standard';
        $exercise = ['id' => (string) Str::uuid(), 'skill_id' => $skillId, 'question' => $data['question'], 'question_type' => 'MCQ', 'template' => $template, 'difficulty' => $data['difficulty'], 'options' => json_encode(array_values($data['options'])), 'correct_answer' => $data['correctAnswer'], 'explanation' => $data['explanation'], 'image_url' => $data['imageUrl'] ?? null, 'image_question' => $data['imageQuestion'] ?? null, 'created_at' => now(), 'updated_at' => now()];
        DB::table('exercises')->insert($exercise);
        $exercise['options'] = $data['options'];
        return response()->json($exercise, 201);
    }

    public function deleteExercise(string $exerciseId)
    {
        if (!DB::table('exercises')->where('id', $exerciseId)->exists()) return response()->json(['error' => 'Question not found'], 404);
        DB::transaction(function () use ($exerciseId) {
            $attemptIds = DB::table('attempts')->where('exercise_id', $exerciseId)->pluck('id');
            DB::table('mistake_analysis')->whereIn('attempt_id', $attemptIds)->delete();
            DB::table('attempts')->where('exercise_id', $exerciseId)->delete();
            DB::table('exercises')->where('id', $exerciseId)->delete();
        });
        return response()->json(['deleted' => true, 'exerciseId' => $exerciseId]);
    }

    public function teacherLogin(Request $request)
    {
        $data = $request->validate([
            'email' => ['required', 'string'],
            'password' => ['required', 'string'],
        ]);

        $teacher = DB::table('teachers')
            ->where('email', $data['email'])
            ->first();

        if (!$teacher || !Hash::check($data['password'], $teacher->password)) {
            return response()->json(['error' => 'Invalid email or password.'], 401);
        }

        return response()->json([
            'ok' => true,
            'role' => 'teacher',
            'user' => [
                'id' => $teacher->id,
                'name' => $teacher->name,
                'email' => $teacher->email,
                'role' => $teacher->role ?? 'teacher',
            ],
            'token' => Str::random(40),
        ]);
    }

    public function studentLogin(Request $request)
    {
        $data = $request->validate([
            'childId' => ['nullable', 'string'],
            'username' => ['nullable', 'string'],
        ]);

        $query = DB::table('children');
        if (!empty($data['childId'])) {
            $query->where('id', $data['childId']);
        } elseif (!empty($data['username'])) {
            $query->where('username', $data['username']);
        } else {
            return response()->json(['error' => 'Child ID or username is required.'], 422);
        }

        $child = $query->first();
        if (!$child) {
            return response()->json(['error' => 'Student not found.'], 404);
        }

        return response()->json([
            'ok' => true,
            'role' => 'student',
            'user' => [
                'id' => $child->id,
                'name' => $child->name,
                'username' => $child->username,
                'grade' => $child->grade,
                'board' => $child->board,
                'medium' => $child->medium,
                'role' => 'student',
            ],
            'token' => Str::random(40),
        ]);
    }

    public function teachers()
    {
        return response()->json(
            DB::table('teachers')
                ->select('id', 'name', 'email', 'role', 'created_at')
                ->get()
        );
    }
}
