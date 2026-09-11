<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $phonicsData = [
            // 1. Short a (60 words across 8 families)
            [
                'id' => 'short_a',
                'vowel' => 'a',
                'title' => 'short a',
                'color' => '#e11d48',
                'headerBg' => '#e11d48',
                'families' => [
                    [
                        'family' => '-ab',
                        'headerBg' => '#fb7185',
                        'columnBg' => '#fff1f2',
                        'words' => ['cab', 'dab', 'lab', 'tab', 'nab', 'jab', 'fab'],
                    ],
                    [
                        'family' => '-ad',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['bad', 'dad', 'had', 'lad', 'mad', 'pad', 'sad', 'tad'],
                    ],
                    [
                        'family' => '-ag',
                        'headerBg' => '#38bdf8',
                        'columnBg' => '#f0f9ff',
                        'words' => ['bag', 'gag', 'lag', 'nag', 'rag', 'sag', 'tag', 'wag'],
                    ],
                    [
                        'family' => '-am',
                        'headerBg' => '#f97316',
                        'columnBg' => '#fff7ed',
                        'words' => ['bam', 'dam', 'ham', 'jam', 'ram', 'yam', 'sam'],
                    ],
                    [
                        'family' => '-an',
                        'headerBg' => '#22c55e',
                        'columnBg' => '#f0fdf4',
                        'words' => ['ban', 'can', 'fan', 'man', 'pan', 'ran', 'tan', 'van'],
                    ],
                    [
                        'family' => '-ap',
                        'headerBg' => '#f43f5e',
                        'columnBg' => '#fff1f2',
                        'words' => ['cap', 'gap', 'lap', 'map', 'nap', 'rap', 'sap', 'tap', 'zap'],
                    ],
                    [
                        'family' => '-at',
                        'headerBg' => '#a855f7',
                        'columnBg' => '#faf5ff',
                        'words' => ['bat', 'cat', 'fat', 'hat', 'mat', 'pat', 'rat', 'sat', 'vat'],
                    ],
                    [
                        'family' => '-ax',
                        'headerBg' => '#eab308',
                        'columnBg' => '#fefce8',
                        'words' => ['fax', 'tax', 'wax', 'max'],
                    ],
                ],
            ],

            // 2. Short e (45 words across 6 families)
            [
                'id' => 'short_e',
                'vowel' => 'e',
                'title' => 'short e',
                'color' => '#0284c7',
                'headerBg' => '#0ea5e9',
                'families' => [
                    [
                        'family' => '-ed',
                        'headerBg' => '#3b82f6',
                        'columnBg' => '#eff6ff',
                        'words' => ['bed', 'fed', 'led', 'ned', 'red', 'ted', 'wed', 'zed'],
                    ],
                    [
                        'family' => '-eg',
                        'headerBg' => '#10b981',
                        'columnBg' => '#ecfdf5',
                        'words' => ['beg', 'keg', 'leg', 'peg', 'meg'],
                    ],
                    [
                        'family' => '-en',
                        'headerBg' => '#8b5cf6',
                        'columnBg' => '#f5f3ff',
                        'words' => ['ben', 'den', 'fen', 'hen', 'men', 'pen', 'ten', 'zen'],
                    ],
                    [
                        'family' => '-et',
                        'headerBg' => '#f59e0b',
                        'columnBg' => '#fffbeb',
                        'words' => ['bet', 'get', 'jet', 'let', 'met', 'net', 'pet', 'set', 'vet', 'wet', 'yet'],
                    ],
                    [
                        'family' => '-ell',
                        'headerBg' => '#06b6d4',
                        'columnBg' => '#ecfeff',
                        'words' => ['bell', 'fell', 'sell', 'tell', 'well', 'yell'],
                    ],
                    [
                        'family' => 'Other',
                        'headerBg' => '#d946ef',
                        'columnBg' => '#fdf4ff',
                        'words' => ['web', 'deb', 'gem', 'hem', 'pep', 'rex', 'yes'],
                    ],
                ],
            ],

            // 3. Short i (54 words across 8 families)
            [
                'id' => 'short_i',
                'vowel' => 'i',
                'title' => 'short i',
                'color' => '#ea580c',
                'headerBg' => '#f97316',
                'families' => [
                    [
                        'family' => '-ib',
                        'headerBg' => '#f43f5e',
                        'columnBg' => '#fff1f2',
                        'words' => ['bib', 'fib', 'nib', 'rib'],
                    ],
                    [
                        'family' => '-id',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['bid', 'did', 'hid', 'kid', 'lid', 'mid', 'rid', 'sid'],
                    ],
                    [
                        'family' => '-ig',
                        'headerBg' => '#14b8a6',
                        'columnBg' => '#f0fdfa',
                        'words' => ['big', 'dig', 'fig', 'gig', 'jig', 'pig', 'rig', 'wig', 'zig'],
                    ],
                    [
                        'family' => '-im',
                        'headerBg' => '#8b5cf6',
                        'columnBg' => '#f5f3ff',
                        'words' => ['dim', 'him', 'rim', 'vim', 'tim', 'jim'],
                    ],
                    [
                        'family' => '-in',
                        'headerBg' => '#84cc16',
                        'columnBg' => '#f7fee7',
                        'words' => ['bin', 'din', 'fin', 'kin', 'pin', 'sin', 'tin', 'win'],
                    ],
                    [
                        'family' => '-ip',
                        'headerBg' => '#f97316',
                        'columnBg' => '#fff7ed',
                        'words' => ['dip', 'hip', 'lip', 'nip', 'rip', 'sip', 'tip', 'zip'],
                    ],
                    [
                        'family' => '-it',
                        'headerBg' => '#6366f1',
                        'columnBg' => '#eef2ff',
                        'words' => ['bit', 'fit', 'hit', 'kit', 'lit', 'pit', 'sit', 'wit'],
                    ],
                    [
                        'family' => '-ix',
                        'headerBg' => '#eab308',
                        'columnBg' => '#fefce8',
                        'words' => ['fix', 'mix', 'six'],
                    ],
                ],
            ],

            // 4. Short o (44 words across 7 families)
            [
                'id' => 'short_o',
                'vowel' => 'o',
                'title' => 'short o',
                'color' => '#16a34a',
                'headerBg' => '#22c55e',
                'families' => [
                    [
                        'family' => '-ob',
                        'headerBg' => '#0ea5e9',
                        'columnBg' => '#f0f9ff',
                        'words' => ['bob', 'cob', 'gob', 'job', 'mob', 'rob', 'sob', 'lob'],
                    ],
                    [
                        'family' => '-od',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['cod', 'god', 'nod', 'pod', 'rod', 'sod'],
                    ],
                    [
                        'family' => '-og',
                        'headerBg' => '#10b981',
                        'columnBg' => '#ecfdf5',
                        'words' => ['bog', 'cog', 'dog', 'fog', 'hog', 'jog', 'log'],
                    ],
                    [
                        'family' => '-op',
                        'headerBg' => '#f43f5e',
                        'columnBg' => '#fff1f2',
                        'words' => ['bop', 'cop', 'hop', 'mop', 'pop', 'sop', 'top'],
                    ],
                    [
                        'family' => '-ot',
                        'headerBg' => '#a855f7',
                        'columnBg' => '#faf5ff',
                        'words' => ['cot', 'dot', 'got', 'hot', 'jot', 'lot', 'not', 'pot', 'rot', 'tot'],
                    ],
                    [
                        'family' => '-ox',
                        'headerBg' => '#eab308',
                        'columnBg' => '#fefce8',
                        'words' => ['box', 'fox', 'pox'],
                    ],
                    [
                        'family' => 'Other',
                        'headerBg' => '#f97316',
                        'columnBg' => '#fff7ed',
                        'words' => ['mom', 'pom', 'tom'],
                    ],
                ],
            ],

            // 5. Short u (46 words across 8 families)
            [
                'id' => 'short_u',
                'vowel' => 'u',
                'title' => 'short u',
                'color' => '#9333ea',
                'headerBg' => '#a855f7',
                'families' => [
                    [
                        'family' => '-ub',
                        'headerBg' => '#ef4444',
                        'columnBg' => '#fef2f2',
                        'words' => ['cub', 'dub', 'hub', 'pub', 'rub', 'sub', 'tub', 'nub'],
                    ],
                    [
                        'family' => '-ud',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['bud', 'cud', 'dud', 'mud'],
                    ],
                    [
                        'family' => '-ug',
                        'headerBg' => '#3b82f6',
                        'columnBg' => '#eff6ff',
                        'words' => ['bug', 'dug', 'hug', 'jug', 'lug', 'mug', 'pug', 'rug', 'tug'],
                    ],
                    [
                        'family' => '-um',
                        'headerBg' => '#10b981',
                        'columnBg' => '#ecfdf5',
                        'words' => ['bum', 'gum', 'hum', 'mum', 'sum', 'yum'],
                    ],
                    [
                        'family' => '-un',
                        'headerBg' => '#f59e0b',
                        'columnBg' => '#fffbeb',
                        'words' => ['bun', 'fun', 'gun', 'nun', 'pun', 'run', 'sun'],
                    ],
                    [
                        'family' => '-up',
                        'headerBg' => '#f43f5e',
                        'columnBg' => '#fff1f2',
                        'words' => ['cup', 'pup', 'sup'],
                    ],
                    [
                        'family' => '-ut',
                        'headerBg' => '#06b6d4',
                        'columnBg' => '#ecfeff',
                        'words' => ['but', 'cut', 'gut', 'hut', 'jut', 'nut', 'rut'],
                    ],
                    [
                        'family' => 'Other',
                        'headerBg' => '#d946ef',
                        'columnBg' => '#fdf4ff',
                        'words' => ['bus', 'gus'],
                    ],
                ],
            ],
        ];

        DB::table('learning_charts')
            ->where('slug', 'phonics')
            ->update([
                'title' => 'Phonics (CVC शब्द) — Short Vowels & Word Families (249 Words)',
                'description' => '249 CVC rhyming words across 37 word families and all 5 short vowels (A, E, I, O, U) with pure phonics blending sounds and speech recitation.',
                'chart_data' => json_encode($phonicsData, JSON_UNESCAPED_UNICODE),
                'updated_at' => $now,
            ]);
    }

    public function down(): void
    {
        // Reversible
    }
};
