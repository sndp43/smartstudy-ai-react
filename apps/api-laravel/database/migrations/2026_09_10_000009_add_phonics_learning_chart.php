<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $phonicsData = [
            // 1. Short a
            [
                'id' => 'short_a',
                'vowel' => 'a',
                'title' => 'short a',
                'color' => '#e11d48',
                'headerBg' => '#e11d48',
                'families' => [
                    [
                        'family' => '-ad',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['tad', 'mad', 'lad', 'pad', 'bad', 'sad'],
                    ],
                    [
                        'family' => '-ag',
                        'headerBg' => '#38bdf8',
                        'columnBg' => '#f0f9ff',
                        'words' => ['lag', 'sag', 'tag', 'gag', 'nag', 'bag'],
                    ],
                    [
                        'family' => '-an',
                        'headerBg' => '#22c55e',
                        'columnBg' => '#f0fdf4',
                        'words' => ['van', 'ban', 'tan', 'fan', 'pan', 'ran'],
                    ],
                    [
                        'family' => '-ap',
                        'headerBg' => '#f43f5e',
                        'columnBg' => '#fff1f2',
                        'words' => ['lap', 'sap', 'rap', 'nap', 'gap', 'cap'],
                    ],
                    [
                        'family' => '-at',
                        'headerBg' => '#a855f7',
                        'columnBg' => '#faf5ff',
                        'words' => ['mat', 'rat', 'hat', 'bat', 'fat', 'sat'],
                    ],
                    [
                        'family' => 'Other',
                        'headerBg' => '#f97316',
                        'columnBg' => '#fff7ed',
                        'words' => ['hab', 'ram', 'ham', 'tab', 'lab', 'cab'],
                    ],
                ],
            ],

            // 2. Short e
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
                        'words' => ['led', 'bed', 'red', 'fed', 'wed', 'ned'],
                    ],
                    [
                        'family' => '-eg',
                        'headerBg' => '#d946ef',
                        'columnBg' => '#fdf4ff',
                        'words' => ['beg', 'peg', 'leg', 'keg', 'neg', 'meg'],
                    ],
                    [
                        'family' => '-en',
                        'headerBg' => '#fb923c',
                        'columnBg' => '#fff7ed',
                        'words' => ['hen', 'pen', 'men', 'den', 'ten', 'yen'],
                    ],
                    [
                        'family' => '-et',
                        'headerBg' => '#8b5cf6',
                        'columnBg' => '#f5f3ff',
                        'words' => ['let', 'bet', 'met', 'jet', 'get', 'net'],
                    ],
                    [
                        'family' => 'other',
                        'headerBg' => '#10b981',
                        'columnBg' => '#ecfdf5',
                        'words' => ['hem', 'web', 'pep', 'gem', 'yes', 'wet'],
                    ],
                ],
            ],

            // 3. Short i
            [
                'id' => 'short_i',
                'vowel' => 'i',
                'title' => 'short i',
                'color' => '#ea580c',
                'headerBg' => '#f97316',
                'families' => [
                    [
                        'family' => '-id',
                        'headerBg' => '#f59e0b',
                        'columnBg' => '#fffbeb',
                        'words' => ['did', 'hid', 'kid', 'bid', 'rid', 'lid'],
                    ],
                    [
                        'family' => '-ig',
                        'headerBg' => '#ec4899',
                        'columnBg' => '#fdf2f8',
                        'words' => ['dig', 'wig', 'rig', 'gig', 'jig', 'fig'],
                    ],
                    [
                        'family' => '-in',
                        'headerBg' => '#06b6d4',
                        'columnBg' => '#ecfeff',
                        'words' => ['din', 'fin', 'sin', 'kin', 'bin', 'win'],
                    ],
                    [
                        'family' => '-ip',
                        'headerBg' => '#10b981',
                        'columnBg' => '#ecfdf5',
                        'words' => ['kip', 'fip', 'pip', 'bip', 'wip', 'dip'],
                    ],
                    [
                        'family' => '-it',
                        'headerBg' => '#ef4444',
                        'columnBg' => '#fef2f2',
                        'words' => ['kit', 'pit', 'bit', 'fit', 'wit', 'lit'],
                    ],
                    [
                        'family' => 'other',
                        'headerBg' => '#8b5cf6',
                        'columnBg' => '#f5f3ff',
                        'words' => ['rib', 'him', 'dim', 'bib', 'fib', 'zig'],
                    ],
                ],
            ],

            // 4. Short o
            [
                'id' => 'short_o',
                'vowel' => 'o',
                'title' => 'short o',
                'color' => '#65a30d',
                'headerBg' => '#84cc16',
                'families' => [
                    [
                        'family' => '-ob',
                        'headerBg' => '#22c55e',
                        'columnBg' => '#f0fdf4',
                        'words' => ['gob', 'cob', 'mob', 'sob', 'bob', 'rob'],
                    ],
                    [
                        'family' => '-og',
                        'headerBg' => '#f97316',
                        'columnBg' => '#fff7ed',
                        'words' => ['dog', 'jog', 'bog', 'log', 'hog', 'cog'],
                    ],
                    [
                        'family' => '-op',
                        'headerBg' => '#a855f7',
                        'columnBg' => '#faf5ff',
                        'words' => ['hop', 'pop', 'top', 'mop', 'cop', 'lop'],
                    ],
                    [
                        'family' => '-ot',
                        'headerBg' => '#0284c7',
                        'columnBg' => '#f0f9ff',
                        'words' => ['jot', 'cot', 'got', 'hot', 'not', 'lot'],
                    ],
                    [
                        'family' => '-other',
                        'headerBg' => '#ef4444',
                        'columnBg' => '#fef2f2',
                        'words' => ['god', 'pod', 'rod', 'mom', 'rom', 'rot'],
                    ],
                ],
            ],

            // 5. Short u
            [
                'id' => 'short_u',
                'vowel' => 'u',
                'title' => 'short u',
                'color' => '#db2777',
                'headerBg' => '#ec4899',
                'families' => [
                    [
                        'family' => '-ub',
                        'headerBg' => '#f472b6',
                        'columnBg' => '#fdf2f8',
                        'words' => ['sub', 'rub', 'cub', 'nub', 'dub', 'tub'],
                    ],
                    [
                        'family' => '-ug',
                        'headerBg' => '#38bdf8',
                        'columnBg' => '#f0f9ff',
                        'words' => ['mug', 'lug', 'pug', 'dug', 'bug', 'hug'],
                    ],
                    [
                        'family' => '-um',
                        'headerBg' => '#4ade80',
                        'columnBg' => '#f0fdf4',
                        'words' => ['mum', 'hum', 'sum', 'bum', 'gum', 'tum'],
                    ],
                    [
                        'family' => '-un',
                        'headerBg' => '#f87171',
                        'columnBg' => '#fef2f2',
                        'words' => ['fun', 'gun', 'bun', 'pun', 'dun', 'nun'],
                    ],
                    [
                        'family' => '-ut',
                        'headerBg' => '#c084fc',
                        'columnBg' => '#faf5ff',
                        'words' => ['hut', 'jut', 'rut', 'gut', 'but', 'cut'],
                    ],
                    [
                        'family' => '-ud',
                        'headerBg' => '#2dd4bf',
                        'columnBg' => '#f0fdfa',
                        'words' => ['bud', 'cud', 'dud', 'mud', 'tud', 'rud'],
                    ],
                    [
                        'family' => 'Other',
                        'headerBg' => '#fb923c',
                        'columnBg' => '#fff7ed',
                        'words' => ['jug', 'rug', 'pup', 'sun', 'nut', 'tug'],
                    ],
                ],
            ],
        ];

        DB::table('learning_charts')->updateOrInsert(
            ['slug' => 'phonics'],
            [
                'id' => (string) Str::uuid(),
                'subject' => 'english',
                'title' => 'Phonics & Word Families',
                'description' => 'Interactive educational phonics chart covering short vowels A, E, I, O, U CVC rhyming word families with audio blending and pronunciation.',
                'chart_type' => 'phonics',
                'chart_data' => json_encode($phonicsData, JSON_UNESCAPED_UNICODE),
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    public function down(): void
    {
        DB::table('learning_charts')->where('slug', 'phonics')->delete();
    }
};
