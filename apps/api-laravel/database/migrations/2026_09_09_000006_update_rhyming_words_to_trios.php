<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const RHYMING_SKILL_ID = '00000000-0000-0000-0000-000000001020';

    public function up(): void
    {
        // 1. Update skill description to highlight 3 rhyming words for one base word
        DB::table('skills')->where('id', self::RHYMING_SKILL_ID)->update([
            'description' => 'Make and find three rhyming words for one base word across 200+ combinations',
            'updated_at' => now(),
        ]);

        // 2. Clear previous exercises for this skill
        DB::table('exercises')->where('skill_id', self::RHYMING_SKILL_ID)->delete();

        // 3. Word Families with rich vocabulary (at least 4 words each for 1 base + 3 rhymes)
        $wordFamilies = [
            // --- Short A Families ---
            [
                'group' => 'short-a',
                'family' => '-at',
                'words' => ['cat', 'bat', 'hat', 'mat', 'rat', 'fat', 'sat', 'pat'],
            ],
            [
                'group' => 'short-a',
                'family' => '-an',
                'words' => ['pan', 'fan', 'man', 'can', 'ran', 'van', 'tan'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ap',
                'words' => ['cap', 'map', 'tap', 'nap', 'lap', 'gap', 'clap'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ar',
                'words' => ['car', 'star', 'far', 'jar', 'bar', 'tar'],
            ],
            [
                'group' => 'short-a',
                'family' => '-ay',
                'words' => ['day', 'play', 'say', 'ray', 'may', 'hay', 'pay'],
            ],
            [
                'group' => 'short-a',
                'family' => '-all',
                'words' => ['ball', 'tall', 'fall', 'call', 'wall', 'mall'],
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
                'words' => ['net', 'pet', 'wet', 'jet', 'get', 'set'],
            ],
            [
                'group' => 'short-e',
                'family' => '-ell',
                'words' => ['bell', 'yell', 'tell', 'well', 'shell', 'spell'],
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
                'words' => ['pin', 'bin', 'fin', 'tin', 'win', 'chin'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ip',
                'words' => ['lip', 'tip', 'sip', 'dip', 'rip', 'ship'],
            ],
            [
                'group' => 'short-i',
                'family' => '-it',
                'words' => ['hit', 'sit', 'fit', 'bit', 'kit', 'lit'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ick',
                'words' => ['kick', 'sick', 'pick', 'brick', 'stick', 'quick'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ink',
                'words' => ['pink', 'sink', 'drink', 'wink', 'blink', 'think'],
            ],
            [
                'group' => 'short-i',
                'family' => '-ing',
                'words' => ['ring', 'king', 'wing', 'sing', 'string', 'spring'],
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
                'words' => ['top', 'mop', 'pop', 'hop', 'drop', 'stop'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-ot',
                'words' => ['pot', 'hot', 'dot', 'cot', 'lot', 'spot'],
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
                'words' => ['bug', 'mug', 'hug', 'rug', 'jug', 'tug'],
            ],
            [
                'group' => 'short-o-u',
                'family' => '-un',
                'words' => ['sun', 'run', 'bun', 'fun', 'nun', 'gun'],
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
                'words' => ['cake', 'bake', 'lake', 'make', 'take', 'wake'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ear',
                'words' => ['dear', 'hear', 'near', 'tear', 'fear', 'gear'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ice',
                'words' => ['mice', 'rice', 'ice', 'nice', 'dice', 'price'],
            ],
            [
                'group' => 'long-vowels',
                'family' => '-ight',
                'words' => ['night', 'light', 'right', 'bright', 'sight', 'tight'],
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

        // Pre-build sample trios for each family to use as realistic distractor triplets
        $familyTrios = [];
        foreach ($wordFamilies as $famInfo) {
            $words = $famInfo['words'];
            $familyTrios[$famInfo['family']] = array_map('ucfirst', array_slice($words, 0, 3));
        }

        $exercises = [];
        $comboCount = 0;

        foreach ($wordFamilies as $famIndex => $famInfo) {
            $fam = $famInfo['family'];
            $group = $famInfo['group'];
            $words = $famInfo['words'];
            $countWords = count($words);

            // Each word in the family acts as the base word
            for ($i = 0; $i < $countWords; $i++) {
                $baseWord = $words[$i];
                $otherWords = array_values(array_diff($words, [$baseWord]));
                if (count($otherWords) < 3) continue;

                // Pick 3 distinct rhyming partner words for this base word
                $rhymeTrio = [
                    $otherWords[($i) % count($otherWords)],
                    $otherWords[($i + 1) % count($otherWords)],
                    $otherWords[($i + 2) % count($otherWords)],
                ];
                $rhymeTrio = array_map('ucfirst', $rhymeTrio);
                $correctAnswerString = implode(', ', $rhymeTrio);

                // Pick 3 distractor triplets from different sound families
                $otherFamilies = array_values(array_filter(array_keys($familyTrios), fn ($f) => $f !== $fam));
                shuffle($otherFamilies);
                $chosenFamilies = array_slice($otherFamilies, 0, 3);

                $distractorStrings = [];
                foreach ($chosenFamilies as $dFam) {
                    $distractorStrings[] = implode(', ', $familyTrios[$dFam]);
                }

                $options = array_merge([$correctAnswerString], $distractorStrings);
                shuffle($options);

                $baseDisplay = ucfirst($baseWord);
                $questionTemplates = [
                    "Which 3 words rhyme with {$baseDisplay}?",
                    "Find 3 words that rhyme with {$baseDisplay}:",
                    "Can you make 3 rhyming words for {$baseDisplay}?",
                    "Choose the 3 words that rhyme with {$baseDisplay}:",
                ];
                $question = $questionTemplates[$comboCount % count($questionTemplates)];

                $trioSpoken = implode(', ', array_slice($rhymeTrio, 0, 2)) . ', and ' . $rhymeTrio[2];
                $explanation = "{$baseDisplay} rhymes with {$trioSpoken}! All three words share the '{$fam}' sound family.";

                $exercises[] = [
                    'id' => (string) Str::uuid(),
                    'skill_id' => self::RHYMING_SKILL_ID,
                    'question' => $question,
                    'question_type' => 'MCQ',
                    'template' => 'rhyme_card',
                    'difficulty' => 1,
                    'options' => json_encode($options),
                    'correct_answer' => $correctAnswerString,
                    'explanation' => $explanation,
                    'image_url' => null,
                    'image_question' => "Word Family: {$fam} ({$group}) · Trio: " . implode(', ', $rhymeTrio),
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                $comboCount++;
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
    }
};
