<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    private const SKILL_ID = '00000000-0000-0000-0000-000000001010';

    public function up(): void
    {
        // 1. Ensure English Missing Letters Skill exists and uses fill_blank template
        DB::table('skills')->where('id', self::SKILL_ID)->update([
            'template' => 'fill_blank',
            'updated_at' => now(),
        ]);

        // 2. Clear old exercises for this skill
        DB::table('exercises')->where('skill_id', self::SKILL_ID)->delete();

        // 3. 112 Curated Kid-Friendly Vocabulary Words
        $wordsData = [
            // Animals (35)
            ['word' => 'Ant', 'blankIdx' => 1, 'wiki' => 'Ant'],
            ['word' => 'Bear', 'blankIdx' => 1, 'wiki' => 'Bear'],
            ['word' => 'Bee', 'blankIdx' => 1, 'wiki' => 'Bee'],
            ['word' => 'Bird', 'blankIdx' => 1, 'wiki' => 'Bird'],
            ['word' => 'Camel', 'blankIdx' => 1, 'wiki' => 'Camel'],
            ['word' => 'Cat', 'blankIdx' => 1, 'wiki' => 'Cat'],
            ['word' => 'Cow', 'blankIdx' => 1, 'wiki' => 'Cattle'],
            ['word' => 'Crab', 'blankIdx' => 2, 'wiki' => 'Crab'],
            ['word' => 'Deer', 'blankIdx' => 2, 'wiki' => 'Deer'],
            ['word' => 'Dog', 'blankIdx' => 1, 'wiki' => 'Dog'],
            ['word' => 'Dolphin', 'blankIdx' => 1, 'wiki' => 'Dolphin'],
            ['word' => 'Duck', 'blankIdx' => 1, 'wiki' => 'Duck'],
            ['word' => 'Elephant', 'blankIdx' => 2, 'wiki' => 'Elephant'],
            ['word' => 'Fish', 'blankIdx' => 1, 'wiki' => 'Fish'],
            ['word' => 'Fox', 'blankIdx' => 1, 'wiki' => 'Fox'],
            ['word' => 'Frog', 'blankIdx' => 2, 'wiki' => 'Frog'],
            ['word' => 'Giraffe', 'blankIdx' => 3, 'wiki' => 'Giraffe'],
            ['word' => 'Goat', 'blankIdx' => 2, 'wiki' => 'Goat'],
            ['word' => 'Hen', 'blankIdx' => 1, 'wiki' => 'Chicken'],
            ['word' => 'Horse', 'blankIdx' => 1, 'wiki' => 'Horse'],
            ['word' => 'Koala', 'blankIdx' => 2, 'wiki' => 'Koala'],
            ['word' => 'Lion', 'blankIdx' => 1, 'wiki' => 'Lion'],
            ['word' => 'Monkey', 'blankIdx' => 1, 'wiki' => 'Monkey'],
            ['word' => 'Owl', 'blankIdx' => 1, 'wiki' => 'Owl'],
            ['word' => 'Panda', 'blankIdx' => 1, 'wiki' => 'Giant panda'],
            ['word' => 'Penguin', 'blankIdx' => 1, 'wiki' => 'Penguin'],
            ['word' => 'Pig', 'blankIdx' => 1, 'wiki' => 'Pig'],
            ['word' => 'Rabbit', 'blankIdx' => 1, 'wiki' => 'Rabbit'],
            ['word' => 'Shark', 'blankIdx' => 2, 'wiki' => 'Shark'],
            ['word' => 'Sheep', 'blankIdx' => 2, 'wiki' => 'Sheep'],
            ['word' => 'Snail', 'blankIdx' => 2, 'wiki' => 'Snail'],
            ['word' => 'Tiger', 'blankIdx' => 1, 'wiki' => 'Tiger'],
            ['word' => 'Turtle', 'blankIdx' => 1, 'wiki' => 'Turtle'],
            ['word' => 'Whale', 'blankIdx' => 2, 'wiki' => 'Whale'],
            ['word' => 'Zebra', 'blankIdx' => 1, 'wiki' => 'Zebra'],

            // Fruits & Food (26)
            ['word' => 'Apple', 'blankIdx' => 1, 'wiki' => 'Apple'],
            ['word' => 'Banana', 'blankIdx' => 1, 'wiki' => 'Banana'],
            ['word' => 'Berry', 'blankIdx' => 1, 'wiki' => 'Berry'],
            ['word' => 'Bread', 'blankIdx' => 2, 'wiki' => 'Bread'],
            ['word' => 'Cake', 'blankIdx' => 1, 'wiki' => 'Cake'],
            ['word' => 'Carrot', 'blankIdx' => 1, 'wiki' => 'Carrot'],
            ['word' => 'Cheese', 'blankIdx' => 2, 'wiki' => 'Cheese'],
            ['word' => 'Cherry', 'blankIdx' => 2, 'wiki' => 'Cherry'],
            ['word' => 'Cookie', 'blankIdx' => 2, 'wiki' => 'Cookie'],
            ['word' => 'Corn', 'blankIdx' => 1, 'wiki' => 'Maize'],
            ['word' => 'Egg', 'blankIdx' => 1, 'wiki' => 'Egg as food'],
            ['word' => 'Grape', 'blankIdx' => 2, 'wiki' => 'Grape'],
            ['word' => 'Lemon', 'blankIdx' => 1, 'wiki' => 'Lemon'],
            ['word' => 'Mango', 'blankIdx' => 1, 'wiki' => 'Mango'],
            ['word' => 'Melon', 'blankIdx' => 1, 'wiki' => 'Melon'],
            ['word' => 'Milk', 'blankIdx' => 1, 'wiki' => 'Milk'],
            ['word' => 'Onion', 'blankIdx' => 2, 'wiki' => 'Onion'],
            ['word' => 'Orange', 'blankIdx' => 2, 'wiki' => 'Orange (fruit)'],
            ['word' => 'Peach', 'blankIdx' => 1, 'wiki' => 'Peach'],
            ['word' => 'Pear', 'blankIdx' => 1, 'wiki' => 'Pear'],
            ['word' => 'Pizza', 'blankIdx' => 1, 'wiki' => 'Pizza'],
            ['word' => 'Potato', 'blankIdx' => 1, 'wiki' => 'Potato'],
            ['word' => 'Rice', 'blankIdx' => 1, 'wiki' => 'Rice'],
            ['word' => 'Soup', 'blankIdx' => 1, 'wiki' => 'Soup'],
            ['word' => 'Tomato', 'blankIdx' => 1, 'wiki' => 'Tomato'],
            ['word' => 'Water', 'blankIdx' => 1, 'wiki' => 'Water'],

            // Nature & Sky (18)
            ['word' => 'Beach', 'blankIdx' => 1, 'wiki' => 'Beach'],
            ['word' => 'Cloud', 'blankIdx' => 2, 'wiki' => 'Cloud'],
            ['word' => 'Flower', 'blankIdx' => 2, 'wiki' => 'Flower'],
            ['word' => 'Forest', 'blankIdx' => 1, 'wiki' => 'Forest'],
            ['word' => 'Garden', 'blankIdx' => 1, 'wiki' => 'Garden'],
            ['word' => 'Grass', 'blankIdx' => 2, 'wiki' => 'Grass'],
            ['word' => 'Lake', 'blankIdx' => 1, 'wiki' => 'Lake'],
            ['word' => 'Leaf', 'blankIdx' => 2, 'wiki' => 'Leaf'],
            ['word' => 'Moon', 'blankIdx' => 1, 'wiki' => 'Moon'],
            ['word' => 'Mountain', 'blankIdx' => 2, 'wiki' => 'Mountain'],
            ['word' => 'Ocean', 'blankIdx' => 1, 'wiki' => 'Ocean'],
            ['word' => 'Rain', 'blankIdx' => 1, 'wiki' => 'Rain'],
            ['word' => 'River', 'blankIdx' => 1, 'wiki' => 'River'],
            ['word' => 'Rock', 'blankIdx' => 1, 'wiki' => 'Rock (geology)'],
            ['word' => 'Rose', 'blankIdx' => 1, 'wiki' => 'Rose'],
            ['word' => 'Star', 'blankIdx' => 2, 'wiki' => 'Star'],
            ['word' => 'Sun', 'blankIdx' => 1, 'wiki' => 'Sun'],
            ['word' => 'Tree', 'blankIdx' => 2, 'wiki' => 'Tree'],

            // Everyday Objects, Toys & Vehicles (33)
            ['word' => 'Bag', 'blankIdx' => 1, 'wiki' => 'Handbag'],
            ['word' => 'Ball', 'blankIdx' => 1, 'wiki' => 'Ball'],
            ['word' => 'Bell', 'blankIdx' => 1, 'wiki' => 'Bell'],
            ['word' => 'Bike', 'blankIdx' => 1, 'wiki' => 'Bicycle'],
            ['word' => 'Boat', 'blankIdx' => 1, 'wiki' => 'Boat'],
            ['word' => 'Book', 'blankIdx' => 1, 'wiki' => 'Book'],
            ['word' => 'Box', 'blankIdx' => 1, 'wiki' => 'Box'],
            ['word' => 'Bus', 'blankIdx' => 1, 'wiki' => 'Bus'],
            ['word' => 'Cap', 'blankIdx' => 1, 'wiki' => 'Baseball cap'],
            ['word' => 'Car', 'blankIdx' => 1, 'wiki' => 'Car'],
            ['word' => 'Chair', 'blankIdx' => 2, 'wiki' => 'Chair'],
            ['word' => 'Clock', 'blankIdx' => 2, 'wiki' => 'Clock'],
            ['word' => 'Coat', 'blankIdx' => 1, 'wiki' => 'Coat (clothing)'],
            ['word' => 'Cup', 'blankIdx' => 1, 'wiki' => 'Cup'],
            ['word' => 'Desk', 'blankIdx' => 1, 'wiki' => 'Desk'],
            ['word' => 'Door', 'blankIdx' => 1, 'wiki' => 'Door'],
            ['word' => 'Drum', 'blankIdx' => 2, 'wiki' => 'Drum'],
            ['word' => 'Fork', 'blankIdx' => 1, 'wiki' => 'Fork'],
            ['word' => 'Hat', 'blankIdx' => 1, 'wiki' => 'Hat'],
            ['word' => 'House', 'blankIdx' => 2, 'wiki' => 'House'],
            ['word' => 'Key', 'blankIdx' => 1, 'wiki' => 'Car key'],
            ['word' => 'Kite', 'blankIdx' => 1, 'wiki' => 'Kite'],
            ['word' => 'Lamp', 'blankIdx' => 1, 'wiki' => 'Lantern'],
            ['word' => 'Pen', 'blankIdx' => 1, 'wiki' => 'Pen'],
            ['word' => 'Plane', 'blankIdx' => 2, 'wiki' => 'Airplane'],
            ['word' => 'Plate', 'blankIdx' => 2, 'wiki' => 'Plate (dishware)'],
            ['word' => 'Ring', 'blankIdx' => 1, 'wiki' => 'Ring (jewellery)'],
            ['word' => 'Ship', 'blankIdx' => 2, 'wiki' => 'Ship'],
            ['word' => 'Shoe', 'blankIdx' => 1, 'wiki' => 'Shoe'],
            ['word' => 'Sock', 'blankIdx' => 1, 'wiki' => 'Sock'],
            ['word' => 'Spoon', 'blankIdx' => 2, 'wiki' => 'Spoon'],
            ['word' => 'Train', 'blankIdx' => 2, 'wiki' => 'Train'],
            ['word' => 'Truck', 'blankIdx' => 2, 'wiki' => 'Truck'],
        ];

        // Verified Unsplash fallbacks for items with disambiguation
        $fallbacks = [
            'Coat' => 'https://images.unsplash.com/photo-1539533018447-63fcce667883?auto=format&fit=crop&w=320&q=80',
            'Key' => 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=320&q=80',
            'Lamp' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=320&q=80',
            'Cap' => 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=320&q=80',
            'Egg' => 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?auto=format&fit=crop&w=320&q=80',
            'Default' => 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=320&q=80',
        ];

        // 4. Batch query Wikipedia for high-resolution images
        $ctx = stream_context_create([
            'http' => [
                'header' => "User-Agent: KidsSmartStudyApp/1.0 (contact: support@kidsstudy.org)\r\n",
                'timeout' => 8,
            ]
        ]);

        $wikiTitles = array_map(fn($d) => $d['wiki'], $wordsData);
        $thumbs = [];

        foreach (array_chunk($wikiTitles, 40) as $chunk) {
            $param = implode('|', array_map('urlencode', $chunk));
            $url = "https://en.wikipedia.org/w/api.php?action=query&titles={$param}&prop=pageimages&format=json&pithumbsize=320";
            $raw = @file_get_contents($url, false, $ctx);
            if ($raw) {
                $json = json_decode($raw, true);
                $pages = $json['query']['pages'] ?? [];
                foreach ($pages as $p) {
                    $title = $p['title'] ?? '';
                    $src = $p['thumbnail']['source'] ?? null;
                    if ($title && $src) {
                        $thumbs[strtolower($title)] = $src;
                    }
                }
            }
        }

        $vowels = ['A', 'E', 'I', 'O', 'U'];
        $alphabet = range('A', 'Z');

        $exercises = [];

        foreach ($wordsData as $item) {
            $rawWord = $item['word'];
            $word = strtoupper($rawWord);
            $len = strlen($word);
            $idx = min($item['blankIdx'], $len - 1);
            $correct = $word[$idx];

            // Target word with blank (e.g. A_PLE, D_G)
            $blankWord = substr($word, 0, $idx) . '_' . substr($word, $idx + 1);

            // Select 3 distractors
            if (in_array($correct, $vowels)) {
                $otherVowels = array_values(array_diff($vowels, [$correct]));
                shuffle($otherVowels);
                $distractors = array_slice($otherVowels, 0, 3);
            } else {
                $otherConsonants = array_values(array_diff($alphabet, $vowels, [$correct]));
                shuffle($otherConsonants);
                $distractors = array_slice($otherConsonants, 0, 3);
            }

            $options = array_values(array_unique(array_merge([$correct], $distractors)));
            shuffle($options);

            $wikiKey = strtolower($item['wiki']);
            $img = $thumbs[$wikiKey] ?? ($fallbacks[$rawWord] ?? $fallbacks['Default']);

            $question = "Which letter is missing?\n\n{$blankWord}";
            $explanation = "The missing letter is {$correct} to complete the word {$word}.";

            $exercises[] = [
                'id' => (string) Str::uuid(),
                'skill_id' => self::SKILL_ID,
                'question' => $question,
                'question_type' => 'MCQ',
                'template' => 'fill_blank',
                'difficulty' => 1,
                'options' => json_encode($options),
                'correct_answer' => $correct,
                'explanation' => $explanation,
                'image_url' => $img,
                'image_question' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // 5. Insert in batches of 40
        foreach (array_chunk($exercises, 40) as $batch) {
            DB::table('exercises')->insert($batch);
        }
    }

    public function down(): void
    {
        DB::table('exercises')->where('skill_id', self::SKILL_ID)->delete();
    }
};
