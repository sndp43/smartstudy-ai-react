<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const RHYMING_SKILL_ID = '00000000-0000-0000-0000-000000001020';
    private const RHYMING_TOPIC_ID = '00000000-0000-0000-0000-000000000205';
    private const ENGLISH_SUBJECT_ID = '00000000-0000-0000-0000-000000000002';

    public function up(): void
    {
        // 1. Ensure Rhyming Words Topic exists under English
        DB::table('topics')->updateOrInsert(
            ['id' => self::RHYMING_TOPIC_ID],
            [
                'subject_id' => self::ENGLISH_SUBJECT_ID,
                'name' => 'Rhyming words',
                'description' => 'Words that share the same ending phonetic sound',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 2. Insert Rhyming Words Skill
        DB::table('skills')->updateOrInsert(
            ['id' => self::RHYMING_SKILL_ID],
            [
                'topic_id' => self::RHYMING_TOPIC_ID,
                'name' => 'Rhyming words',
                'description' => 'Find and create rhyming words across 200+ word family combinations',
                'difficulty' => 1,
                'template' => 'rhyme_card',
                'table_range' => 'all',
                'created_at' => now(),
                'updated_at' => now(),
            ]
        );

        // 3. Clear previous exercises for this skill
        DB::table('exercises')->where('skill_id', self::RHYMING_SKILL_ID)->delete();

        // 4. Over 220 Curated Rhyming Word Combinations across 36 Word Families
        $wordFamilies = [
            // --- Short A Families ---
            [
                'group' => 'short-a',
                'family' => '-at',
                'words' => ['cat', 'bat', 'hat', 'mat', 'rat', 'fat', 'sat', 'pat', 'chat', 'flat'],
            ],
            [
                'group' => 'short-a',
                'family' => '-an',
                'words' => ['pan', 'fan', 'man', 'can', 'ran', 'van', 'tan', 'plan', 'scan'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ap',
                'words' => ['cap', 'map', 'tap', 'nap', 'lap', 'gap', 'clap', 'trap', 'snap'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ar',
                'words' => ['car', 'star', 'far', 'jar', 'bar', 'tar', 'scar'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ay',
                'words' => ['day', 'play', 'say', 'ray', 'may', 'hay', 'pay', 'stay', 'clay'],
            ],
            [
                'group' => 'short-a',
                'family' => '-all',
                'words' => ['ball', 'tall', 'fall', 'call', 'wall', 'mall', 'small'],
            ],

            // --- Short E Families ---
            [
                'group' => 'short-e',
                'family' => '-ed',
                'words' => ['bed', 'red', 'fed', 'led', 'shed', 'sled'],
            ],
            [
                'group' => 'short-e',
                'family' => '-en',
                'words' => ['hen', 'pen', 'ten', 'men', 'den', 'glen'],
            ],
            [
                'group' => 'short-e',
                'family' => '-et',
                'words' => ['net', 'pet', 'wet', 'jet', 'get', 'set', 'vet'],
            ],
            [
                'group' => 'short-e',
                'family' => '-ell',
                'words' => ['bell', 'yell', 'tell', 'well', 'shell', 'spell', 'fell'],
            ],
            [
                'group' => 'short-e',
                'family' => '-est',
                'words' => ['nest', 'vest', 'rest', 'best', 'test', 'chest'],
            ],

            // --- Short I Families ---
            [
                'group' => 'short-i',
                'family' => '-ig',
                'words' => ['pig', 'big', 'dig', 'fig', 'wig', 'twig'],
            ],
            [
                'group' => 'short-i',
                'family' => '-in',
                'words' => ['pin', 'bin', 'fin', 'tin', 'win', 'chin', 'spin'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ip',
                'words' => ['lip', 'tip', 'sip', 'dip', 'rip', 'ship', 'trip', 'clip'],
            ],
            [
                'group' => 'short-i',
                'family' => '-it',
                'words' => ['hit', 'sit', 'fit', 'bit', 'kit', 'pit', 'lit'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ick',
                'words' => ['kick', 'sick', 'pick', 'brick', 'stick', 'quick', 'tick'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ink',
                'words' => ['pink', 'sink', 'drink', 'wink', 'blink', 'think', 'link'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ing',
                'words' => ['ring', 'king', 'wing', 'sing', 'string', 'spring', 'swing'],
            ],

            // --- Short O Families ---
            [
                'group' => 'short-o-u',
                'family' => '-og',
                'words' => ['dog', 'frog', 'log', 'fog', 'jog', 'clog'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-op',
                'words' => ['top', 'mop', 'pop', 'hop', 'drop', 'crop', 'stop', 'shop'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ot',
                'words' => ['pot', 'hot', 'dot', 'cot', 'lot', 'not', 'spot', 'shot'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ox',
                'words' => ['box', 'fox', 'ox'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ock',
                'words' => ['lock', 'clock', 'rock', 'sock', 'block', 'knock'],
            ],

            // --- Short U Families ---
            [
                'group' => 'short-o-u',
                'family' => '-ub',
                'words' => ['tub', 'cub', 'rub', 'sub', 'club', 'scrub'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ug',
                'words' => ['bug', 'mug', 'hug', 'rug', 'jug', 'tug', 'plug', 'slug'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-un',
                'words' => ['sun', 'run', 'bun', 'fun', 'nun', 'gun', 'spun'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ut',
                'words' => ['nut', 'hut', 'cut', 'gut', 'shut'],
            ],

            // --- Long Vowels & Blends ---
            [
                'group' => 'long-vowels',
                'family' => '-ake',
                'words' => ['cake', 'bake', 'lake', 'make', 'take', 'wake', 'snake', 'rake'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ear',
                'words' => ['dear', 'hear', 'near', 'tear', 'fear', 'gear', 'clear'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ice',
                'words' => ['mice', 'rice', 'ice', 'nice', 'dice', 'price', 'slice'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ight',
                'words' => ['night', 'light', 'right', 'bright', 'sight', 'tight', 'flight'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ook',
                'words' => ['book', 'look', 'cook', 'took', 'hook', 'brook'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ool',
                'words' => ['cool', 'pool', 'tool', 'school', 'fool'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-oon',
                'words' => ['moon', 'spoon', 'noon', 'soon'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ore',
                'words' => ['core', 'more', 'sore', 'store', 'score', 'chore'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-own',
                'words' => ['clown', 'crown', 'brown', 'town', 'down', 'frown'],
            ],
        ];

        // Global distractors pool across distinct sounding words
        $allWordsFlat = [];
        foreach ($wordFamilies as $fam) {
            foreach ($fam['words'] as $w) {
                $allWordsFlat[] = $w;
            }
        }
        $allWordsFlat = array_values(array_unique($allWordsFlat));

        $exercises = [];
        $comboCount = 0;

        foreach ($wordFamilies as $famInfo) {
            $fam = $famInfo['family'];
            $group = $famInfo['group'];
            $words = $famInfo['words'];
            $countWords = count($words);

            for ($i = 0; $i < $countWords; $i++) {
                $targetWord = $words[$i];
                // Select a rhyming partner from the same family
                $rhymePartners = array_values(array_diff($words, [$targetWord]));
                if (empty($rhymePartners)) continue;

                // Pick two combinations for richer coverage if list is long enough
                $partnerIndices = [0];
                if (count($rhymePartners) > 1 && $countWords <= 6) {
                    $partnerIndices[] = 1;
                }

                foreach ($partnerIndices as $pIdx) {
                    $correctRhyme = $rhymePartners[($i + $pIdx) % count($rhymePartners)];

                    // Pick 3 distractors from words that do NOT belong to this sound family
                    $distractorPool = array_values(array_filter($allWordsFlat, function ($w) use ($words) {
                        return !in_array($w, $words, true);
                    }));
                    shuffle($distractorPool);
                    $distractors = array_slice($distractorPool, 0, 3);

                    // Capitalize nicely for kids
                    $targetDisplay = ucfirst($targetWord);
                    $correctDisplay = ucfirst($correctRhyme);
                    $options = array_map('ucfirst', array_merge([$correctRhyme], $distractors));
                    $options = array_values(array_unique($options));
                    shuffle($options);

                    // Varied, engaging child question phrasing
                    $questionTemplates = [
                        "Which word rhymes with {$targetDisplay}?",
                        "Find the rhyming pair for {$targetDisplay}:",
                        "Can you find the word that rhymes with {$targetDisplay}?",
                        "Listen to the sound of {$targetDisplay}. Which word rhymes?",
                    ];
                    $question = $questionTemplates[$comboCount % count($questionTemplates)];

                    $explanation = "{$targetDisplay} and {$correctDisplay} both share the '{$fam}' sound family! They rhyme.";

                    $exercises[] = [
                        'id' => (string) Str::uuid(),
                        'skill_id' => self::RHYMING_SKILL_ID,
                        'question' => $question,
                        'question_type' => 'MCQ',
                        'template' => 'rhyme_card',
                        'difficulty' => 1,
                        'options' => json_encode($options),
                        'correct_answer' => $correctDisplay,
                        'explanation' => $explanation,
                        'image_url' => null,
                        'image_question' => "Word Family: {$fam} ({$group})",
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];

                    $comboCount++;
                }
            }
        }

        // Batch insert in chunks of 50
        foreach (array_chunk($exercises, 50) as $batch) {
            DB::table('exercises')->insert($batch);
        }
    }

    public function down(): void
    {
        DB::table('exercises')->where('skill_id', self::RHYMING_SKILL_ID)->delete();
        DB::table('skills')->where('id', self::RHYMING_SKILL_ID)->delete();
        DB::table('topics')->where('id', self::RHYMING_TOPIC_ID)->delete();
    }
};
