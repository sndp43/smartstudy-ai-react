<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class SmartStudySeeder extends Seeder
{
    public function run(): void
    {
        DB::table('teachers')->insertOrIgnore([
            'id' => '00000000-0000-0000-0000-000000000001',
            'name' => 'Class 1 Teacher',
            'email' => 'teacher@smartstudy.ai',
            'password' => Hash::make('password123'),
            'role' => 'teacher',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $maths = '00000000-0000-0000-0000-000000000001';
        $english = '00000000-0000-0000-0000-000000000002';
        $hindi = '00000000-0000-0000-0000-000000000003';
        $marathi = '00000000-0000-0000-0000-000000000004';
        $evs = '00000000-0000-0000-0000-000000000005';
        DB::table('subjects')->insertOrIgnore([
            ['id' => $maths, 'name' => 'Maths', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $english, 'name' => 'English', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $hindi, 'name' => 'Hindi', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $marathi, 'name' => 'Marathi', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $evs, 'name' => 'EVS', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $numbers = '00000000-0000-0000-0000-000000000101';
        $addition = '00000000-0000-0000-0000-000000000102';
        $subtraction = '00000000-0000-0000-0000-000000000103';
        $multiplication = '00000000-0000-0000-0000-000000000104';
        $englishTopic = '00000000-0000-0000-0000-000000000201';
        $hindiTopic = '00000000-0000-0000-0000-000000000202';
        $marathiTopic = '00000000-0000-0000-0000-000000000203';
        $evsTopic = '00000000-0000-0000-0000-000000000204';
        $rhymingTopic = '00000000-0000-0000-0000-000000000205';
        DB::table('topics')->insertOrIgnore([
            ['id' => $numbers, 'subject_id' => $maths, 'name' => 'Numbers', 'description' => 'Counting and understanding numbers', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $addition, 'subject_id' => $maths, 'name' => 'Addition', 'description' => 'Adding small numbers', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $subtraction, 'subject_id' => $maths, 'name' => 'Subtraction', 'description' => 'Taking away small numbers', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $multiplication, 'subject_id' => $maths, 'name' => 'Multiplication', 'description' => 'Learning multiplication tables', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $englishTopic, 'subject_id' => $english, 'name' => 'Phonics', 'description' => 'Letters and simple sounds', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $rhymingTopic, 'subject_id' => $english, 'name' => 'Rhyming words', 'description' => 'Words that share the same ending phonetic sound', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $hindiTopic, 'subject_id' => $hindi, 'name' => 'Hindi letters', 'description' => 'Recognising Hindi letters and sounds', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $marathiTopic, 'subject_id' => $marathi, 'name' => 'Marathi letters', 'description' => 'Recognising Marathi letters and sounds', 'created_at' => now(), 'updated_at' => now()],
            ['id' => $evsTopic, 'subject_id' => $evs, 'name' => 'My world', 'description' => 'People, plants, animals and places', 'created_at' => now(), 'updated_at' => now()],
        ]);

        $skills = [
            ['00000000-0000-0000-0000-000000001001', $numbers, 'Number sequencing', 'Before, after and missing numbers', 1],
            ['00000000-0000-0000-0000-000000001002', $numbers, 'Compare numbers', 'Greater than and smaller than', 1],
            ['00000000-0000-0000-0000-000000001003', $addition, 'Addition within 10', 'Add numbers with totals up to 10', 1],
            ['00000000-0000-0000-0000-000000001004', $addition, 'Addition across 10', 'Addition where the total crosses 10', 2],
            ['00000000-0000-0000-0000-000000001005', $subtraction, 'Subtraction within 10', 'Take away numbers up to 10', 1],
            ['00000000-0000-0000-0000-000000001012', $multiplication, 'Multiplication tables 2-10', 'Practise multiplication tables from 2 to 10', 2],
            ['00000000-0000-0000-0000-000000001006', $englishTopic, 'English phonics', 'Recognise simple English sounds', 1],
            ['00000000-0000-0000-0000-000000001014', $englishTopic, 'English alphabet A-Z', 'Recognise and practise every letter from A to Z', 1],
            ['00000000-0000-0000-0000-000000001016', $englishTopic, 'Phonics chart A-Z', 'Match every English letter with its beginning sound and a familiar word', 1],
            ['00000000-0000-0000-0000-000000001010', $englishTopic, 'English missing letters', 'Complete simple words by adding the missing letter', 1],
            ['00000000-0000-0000-0000-000000001011', $englishTopic, 'Short vowel phonics (A, E, I, O, U)', 'Read and identify words that start with, contain, or end with the vowels A, E, I, O, and U', 1],
            ['00000000-0000-0000-0000-000000001007', $hindiTopic, 'Hindi letters', 'Recognise common Hindi letters', 1],
            ['00000000-0000-0000-0000-000000001008', $marathiTopic, 'Marathi letters', 'Recognise common Marathi letters', 1],
            ['00000000-0000-0000-0000-000000001015', $marathiTopic, 'Marathi vowels (अ to औ)', 'Learn Marathi vowels: अ, आ, इ, ई, उ, ऊ, ए, ऐ, ओ and औ', 1],
            ['00000000-0000-0000-0000-000000001013', $marathiTopic, 'Marathi chaudakhadi', 'Learn Marathi consonants with their vowel signs', 2],
            ['00000000-0000-0000-0000-000000001009', $evsTopic, 'Living and non-living things', 'Identify living and non-living things', 1],
            ['00000000-0000-0000-0000-000000001017', $numbers, 'Before numbers', 'Find the number that comes before (100 to 500)', 1],
            ['00000000-0000-0000-0000-000000001018', $numbers, 'After numbers', 'Find the number that comes after (100 to 500)', 1],
            ['00000000-0000-0000-0000-000000001019', $numbers, 'Missing numbers', 'Find the missing number in sequences (100 to 500)', 1],
            ['00000000-0000-0000-0000-000000001020', $rhymingTopic, 'Rhyming words', 'Find and create rhyming words across 200+ word family combinations', 1],
        ];
        foreach ($skills as [$id, $topic, $name, $description, $difficulty]) {
            DB::table('skills')->insertOrIgnore([
                'id' => $id, 'topic_id' => $topic, 'name' => $name, 'description' => $description,
                'difficulty' => $difficulty, 'created_at' => now(), 'updated_at' => now(),
            ]);
        }

        // Tables 2 to 30 with interactive "oneza / twoza" recital metadata
        $numToWords = function (int $n) use (&$numToWords): string {
            $ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten',
                     'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            $tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
            if ($n === 0) return 'zero';
            if ($n < 20) return $ones[$n];
            if ($n < 100) {
                $t = (int) floor($n / 10);
                $r = $n % 10;
                return $r === 0 ? $tens[$t] : "{$tens[$t]} {$ones[$r]}";
            }
            if ($n < 1000) {
                $h = (int) floor($n / 100);
                $rem = $n % 100;
                return $rem === 0 ? "{$ones[$h]} hundred" : "{$ones[$h]} hundred " . $numToWords($rem);
            }
            return (string) $n;
        };
        $multiplierRecite = [
            1 => 'oneza', 2 => 'twoza', 3 => 'threeza', 4 => 'fourza', 5 => 'fiveza',
            6 => 'sixza', 7 => 'sevenza', 8 => 'eightza', 9 => 'nineza', 10 => 'tenza',
        ];
        $tablesData = array_map(function ($table) use ($numToWords, $multiplierRecite) {
            $tableWord = ucfirst($numToWords($table));
            return [
                'table' => $table,
                'label' => "Table of {$table}",
                'key' => "table_{$table}",
                'items' => array_map(function ($m) use ($table, $tableWord, $numToWords, $multiplierRecite) {
                    $prod = $table * $m;
                    $multWord = $multiplierRecite[$m] ?? "{$numToWords($m)}za";
                    $prodWord = $numToWords($prod);
                    return [
                        'multiplier' => $m,
                        'equation' => "{$table} × {$m} = {$prod}",
                        'product' => $prod,
                        'reciteText' => "{$tableWord} {$multWord} {$prodWord}",
                    ];
                }, range(1, 10))
            ];
        }, range(2, 30));

        // Marathi चौदाखडी स्वर (14-Khadi Swar)
        $swarData = [
            ['letter' => 'अ', 'key' => 'swar_अ', 'transliteration' => 'A', 'matra' => '-', 'matraName' => 'मूळ स्वर', 'word' => 'अननस', 'englishWord' => 'Pineapple', 'sampleConsonant' => 'क', 'audioText' => 'अ, अननस'],
            ['letter' => 'आ', 'key' => 'swar_आ', 'transliteration' => 'Aa', 'matra' => 'ा', 'matraName' => 'काना', 'word' => 'आई', 'englishWord' => 'Mother', 'sampleConsonant' => 'का', 'audioText' => 'आ, आई'],
            ['letter' => 'इ', 'key' => 'swar_इ', 'transliteration' => 'I', 'matra' => 'ि', 'matraName' => 'पहिली वेलांटी', 'word' => 'इमारत', 'englishWord' => 'Building', 'sampleConsonant' => 'कि', 'audioText' => 'इ, इमारत'],
            ['letter' => 'ई', 'key' => 'swar_ई', 'transliteration' => 'Ee', 'matra' => 'ी', 'matraName' => 'दुसरी वेलांटी', 'word' => 'ईडलिंबू', 'englishWord' => 'Sweet Lemon', 'sampleConsonant' => 'की', 'audioText' => 'ई, ईडलिंबू'],
            ['letter' => 'उ', 'key' => 'swar_उ', 'transliteration' => 'U', 'matra' => 'ु', 'matraName' => 'पहिला उकार', 'word' => 'उखळ', 'englishWord' => 'Mortar', 'sampleConsonant' => 'कु', 'audioText' => 'उ, उखळ'],
            ['letter' => 'ऊ', 'key' => 'swar_ऊ', 'transliteration' => 'Oo', 'matra' => 'ू', 'matraName' => 'दुसरा उकार', 'word' => 'ऊस', 'englishWord' => 'Sugarcane', 'sampleConsonant' => 'कू', 'audioText' => 'ऊ, ऊस'],
            ['letter' => 'ए', 'key' => 'swar_ए', 'transliteration' => 'E', 'matra' => 'े', 'matraName' => 'एक मात्रा', 'word' => 'एडका', 'englishWord' => 'Ram', 'sampleConsonant' => 'के', 'audioText' => 'ए, एडका'],
            ['letter' => 'ॲ', 'key' => 'swar_ॲ', 'transliteration' => 'Ae', 'matra' => 'ॅ', 'matraName' => 'अर्धचंद्र', 'word' => 'ॲपल', 'englishWord' => 'Apple', 'sampleConsonant' => 'कॅ', 'audioText' => 'ॲ, ॲपल'],
            ['letter' => 'ऐ', 'key' => 'swar_ऐ', 'transliteration' => 'Ai', 'matra' => 'ै', 'matraName' => 'दोन मात्रे', 'word' => 'ऐरण', 'englishWord' => 'Anvil', 'sampleConsonant' => 'कै', 'audioText' => 'ऐ, ऐरण'],
            ['letter' => 'ओ', 'key' => 'swar_ओ', 'transliteration' => 'O', 'matra' => 'ो', 'matraName' => 'काना एक मात्रा', 'word' => 'ओठ', 'englishWord' => 'Lips', 'sampleConsonant' => 'को', 'audioText' => 'ओ, ओठ'],
            ['letter' => 'ऑ', 'key' => 'swar_ऑ', 'transliteration' => 'Aw', 'matra' => 'ॉ', 'matraName' => 'काना अर्धचंद्र', 'word' => 'ऑक्‍टोपस', 'englishWord' => 'Octopus', 'sampleConsonant' => 'कॉ', 'audioText' => 'ऑ, ऑक्‍टोपस'],
            ['letter' => 'औ', 'key' => 'swar_औ', 'transliteration' => 'Au', 'matra' => 'ौ', 'matraName' => 'काना दोन मात्रे', 'word' => 'औषध', 'englishWord' => 'Medicine', 'sampleConsonant' => 'कौ', 'audioText' => 'औ, औषध'],
            ['letter' => 'अं', 'key' => 'swar_अं', 'transliteration' => 'Am', 'matra' => 'ं', 'matraName' => 'अनुस्वार', 'word' => 'अंगठी', 'englishWord' => 'Ring', 'sampleConsonant' => 'कं', 'audioText' => 'अं, अंगठी'],
            ['letter' => 'अः', 'key' => 'swar_अः', 'transliteration' => 'Aha', 'matra' => 'ः', 'matraName' => 'विसर्ग', 'word' => 'नमः', 'englishWord' => 'Salutation', 'sampleConsonant' => 'कः', 'audioText' => 'अः, नमः'],
        ];

        // Marathi व्यंजने (Consonants - क ते ज्ञ) 36 consonants
        $vyanjanData = [
            ['letter' => 'क', 'key' => 'vyanjan_क', 'transliteration' => 'Ka', 'group' => 'क वर्ग', 'word' => 'कमळ', 'englishWord' => 'Lotus', 'audioText' => 'क, कमळ'],
            ['letter' => 'ख', 'key' => 'vyanjan_ख', 'transliteration' => 'Kha', 'group' => 'क वर्ग', 'word' => 'खडू', 'englishWord' => 'Chalk', 'audioText' => 'ख, खडू'],
            ['letter' => 'ग', 'key' => 'vyanjan_ग', 'transliteration' => 'Ga', 'group' => 'क वर्ग', 'word' => 'गणपती', 'englishWord' => 'Ganpati', 'audioText' => 'ग, गणपती'],
            ['letter' => 'घ', 'key' => 'vyanjan_घ', 'transliteration' => 'Gha', 'group' => 'क वर्ग', 'word' => 'घर', 'englishWord' => 'House', 'audioText' => 'घ, घर'],
            ['letter' => 'ङ', 'key' => 'vyanjan_ङ', 'transliteration' => 'Nga', 'group' => 'क वर्ग', 'word' => 'वाङ्मय', 'englishWord' => 'Nasal', 'audioText' => 'ङ'],

            ['letter' => 'च', 'key' => 'vyanjan_च', 'transliteration' => 'Cha', 'group' => 'च वर्ग', 'word' => 'चमचा', 'englishWord' => 'Spoon', 'audioText' => 'च, चमचा'],
            ['letter' => 'छ', 'key' => 'vyanjan_छ', 'transliteration' => 'Chha', 'group' => 'च वर्ग', 'word' => 'छत्री', 'englishWord' => 'Umbrella', 'audioText' => 'छ, छत्री'],
            ['letter' => 'ज', 'key' => 'vyanjan_ज', 'transliteration' => 'Ja', 'group' => 'च वर्ग', 'word' => 'जहाज', 'englishWord' => 'Ship', 'audioText' => 'ज, जहाज'],
            ['letter' => 'झ', 'key' => 'vyanjan_झ', 'transliteration' => 'Jha', 'group' => 'च वर्ग', 'word' => 'झेंडा', 'englishWord' => 'Flag', 'audioText' => 'झ, झेंडा'],
            ['letter' => 'ञ', 'key' => 'vyanjan_ञ', 'transliteration' => 'Nya', 'group' => 'च वर्ग', 'word' => 'चञ्चू', 'englishWord' => 'Nasal', 'audioText' => 'ञ'],

            ['letter' => 'ट', 'key' => 'vyanjan_ट', 'transliteration' => 'Ta', 'group' => 'ट वर्ग', 'word' => 'टोमॅटो', 'englishWord' => 'Tomato', 'audioText' => 'ट, टोमॅटो'],
            ['letter' => 'ठ', 'key' => 'vyanjan_ठ', 'transliteration' => 'Tha', 'group' => 'ट वर्ग', 'word' => 'ठसा', 'englishWord' => 'Stamp', 'audioText' => 'ठ, ठसा'],
            ['letter' => 'ड', 'key' => 'vyanjan_ड', 'transliteration' => 'Da', 'group' => 'ट वर्ग', 'word' => 'डबा', 'englishWord' => 'Box', 'audioText' => 'ड, डबा'],
            ['letter' => 'ढ', 'key' => 'vyanjan_ढ', 'transliteration' => 'Dha', 'group' => 'ट वर्ग', 'word' => 'ढग', 'englishWord' => 'Cloud', 'audioText' => 'ढ, ढग'],
            ['letter' => 'ण', 'key' => 'vyanjan_ण', 'transliteration' => 'Na', 'group' => 'ट वर्ग', 'word' => 'बाण', 'englishWord' => 'Arrow', 'audioText' => 'ण, बाण'],

            ['letter' => 'त', 'key' => 'vyanjan_त', 'transliteration' => 'Ta', 'group' => 'त वर्ग', 'word' => 'तलवार', 'englishWord' => 'Sword', 'audioText' => 'त, तलवार'],
            ['letter' => 'थ', 'key' => 'vyanjan_थ', 'transliteration' => 'Tha', 'group' => 'त वर्ग', 'word' => 'थवा', 'englishWord' => 'Flock of birds', 'audioText' => 'थ, थवा'],
            ['letter' => 'द', 'key' => 'vyanjan_द', 'transliteration' => 'Da', 'group' => 'त वर्ग', 'word' => 'दरवाजा', 'englishWord' => 'Door', 'audioText' => 'द, दरवाजा'],
            ['letter' => 'ध', 'key' => 'vyanjan_ध', 'transliteration' => 'Dha', 'group' => 'त वर्ग', 'word' => 'धनुष्य', 'englishWord' => 'Bow', 'audioText' => 'ध, धनुष्य'],
            ['letter' => 'न', 'key' => 'vyanjan_न', 'transliteration' => 'Na', 'group' => 'त वर्ग', 'word' => 'नळ', 'englishWord' => 'Tap', 'audioText' => 'न, नळ'],

            ['letter' => 'प', 'key' => 'vyanjan_प', 'transliteration' => 'Pa', 'group' => 'प वर्ग', 'word' => 'पतंग', 'englishWord' => 'Kite', 'audioText' => 'प, पतंग'],
            ['letter' => 'फ', 'key' => 'vyanjan_फ', 'transliteration' => 'Pha', 'group' => 'प वर्ग', 'word' => 'फणस', 'englishWord' => 'Jackfruit', 'audioText' => 'फ, फणस'],
            ['letter' => 'ब', 'key' => 'vyanjan_ब', 'transliteration' => 'Ba', 'group' => 'प वर्ग', 'word' => 'बदक', 'englishWord' => 'Duck', 'audioText' => 'ब, बदक'],
            ['letter' => 'भ', 'key' => 'vyanjan_भ', 'transliteration' => 'Bha', 'group' => 'प वर्ग', 'word' => 'भोवरा', 'englishWord' => 'Spinning top', 'audioText' => 'भ, भोवरा'],
            ['letter' => 'म', 'key' => 'vyanjan_म', 'transliteration' => 'Ma', 'group' => 'प वर्ग', 'word' => 'मगर', 'englishWord' => 'Crocodile', 'audioText' => 'म, मगर'],

            ['letter' => 'य', 'key' => 'vyanjan_य', 'transliteration' => 'Ya', 'group' => 'अंतस्थ', 'word' => 'यज्ञ', 'englishWord' => 'Sacred fire', 'audioText' => 'य, यज्ञ'],
            ['letter' => 'र', 'key' => 'vyanjan_र', 'transliteration' => 'Ra', 'group' => 'अंतस्थ', 'word' => 'रथ', 'englishWord' => 'Chariot', 'audioText' => 'र, रथ'],
            ['letter' => 'ल', 'key' => 'vyanjan_ल', 'transliteration' => 'La', 'group' => 'अंतस्थ', 'word' => 'लसूण', 'englishWord' => 'Garlic', 'audioText' => 'ल, लसूण'],
            ['letter' => 'व', 'key' => 'vyanjan_व', 'transliteration' => 'Va', 'group' => 'अंतस्थ', 'word' => 'वजन', 'englishWord' => 'Weight', 'audioText' => 'व, वजन'],

            ['letter' => 'श', 'key' => 'vyanjan_श', 'transliteration' => 'Sha', 'group' => 'उष्मे', 'word' => 'शहामृग', 'englishWord' => 'Ostrich', 'audioText' => 'श, शहामृग'],
            ['letter' => 'ष', 'key' => 'vyanjan_ष', 'transliteration' => 'Sha', 'group' => 'उष्मे', 'word' => 'षटकोन', 'englishWord' => 'Hexagon', 'audioText' => 'ष, षटकोन'],
            ['letter' => 'स', 'key' => 'vyanjan_स', 'transliteration' => 'Sa', 'group' => 'उष्मे', 'word' => 'ससा', 'englishWord' => 'Rabbit', 'audioText' => 'स, ससा'],
            ['letter' => 'ह', 'key' => 'vyanjan_ह', 'transliteration' => 'Ha', 'group' => 'महाप्राण', 'word' => 'हत्ती', 'englishWord' => 'Elephant', 'audioText' => 'ह, हत्ती'],
            ['letter' => 'ळ', 'key' => 'vyanjan_ळ', 'transliteration' => 'La', 'group' => 'स्वतंत्र', 'word' => 'बाळ', 'englishWord' => 'Baby', 'audioText' => 'ळ, बाळ'],

            ['letter' => 'क्ष', 'key' => 'vyanjan_क्ष', 'transliteration' => 'Ksha', 'group' => 'संयुक्त', 'word' => 'क्षत्रिय', 'englishWord' => 'Warrior', 'audioText' => 'क्ष, क्षत्रिय'],
            ['letter' => 'ज्ञ', 'key' => 'vyanjan_ज्ञ', 'transliteration' => 'Gnya', 'group' => 'संयुक्त', 'word' => 'ज्ञानेश्वर', 'englishWord' => 'Saint Dnyaneshwar', 'audioText' => 'ज्ञ, ज्ञानेश्वर'],
        ];

                // English Alphabet A to Z with uppercase and lowercase pairs
        $alphabetData = [
            ['upper' => 'A', 'lower' => 'a', 'key' => 'letter_A', 'word' => 'Apple', 'phonic' => '/æ/', 'isVowel' => true, 'audioText' => 'Capital A, small a, as in Apple'],
            ['upper' => 'B', 'lower' => 'b', 'key' => 'letter_B', 'word' => 'Ball', 'phonic' => '/b/', 'isVowel' => false, 'audioText' => 'Capital B, small b, as in Ball'],
            ['upper' => 'C', 'lower' => 'c', 'key' => 'letter_C', 'word' => 'Cat', 'phonic' => '/k/', 'isVowel' => false, 'audioText' => 'Capital C, small c, as in Cat'],
            ['upper' => 'D', 'lower' => 'd', 'key' => 'letter_D', 'word' => 'Dog', 'phonic' => '/d/', 'isVowel' => false, 'audioText' => 'Capital D, small d, as in Dog'],
            ['upper' => 'E', 'lower' => 'e', 'key' => 'letter_E', 'word' => 'Elephant', 'phonic' => '/e/', 'isVowel' => true, 'audioText' => 'Capital E, small e, as in Elephant'],
            ['upper' => 'F', 'lower' => 'f', 'key' => 'letter_F', 'word' => 'Fish', 'phonic' => '/f/', 'isVowel' => false, 'audioText' => 'Capital F, small f, as in Fish'],
            ['upper' => 'G', 'lower' => 'g', 'key' => 'letter_G', 'word' => 'Grapes', 'phonic' => '/ɡ/', 'isVowel' => false, 'audioText' => 'Capital G, small g, as in Grapes'],
            ['upper' => 'H', 'lower' => 'h', 'key' => 'letter_H', 'word' => 'Hat', 'phonic' => '/h/', 'isVowel' => false, 'audioText' => 'Capital H, small h, as in Hat'],
            ['upper' => 'I', 'lower' => 'i', 'key' => 'letter_I', 'word' => 'Igloo', 'phonic' => '/ɪ/', 'isVowel' => true, 'audioText' => 'Capital I, small i, as in Igloo'],
            ['upper' => 'J', 'lower' => 'j', 'key' => 'letter_J', 'word' => 'Jug', 'phonic' => '/dʒ/', 'isVowel' => false, 'audioText' => 'Capital J, small j, as in Jug'],
            ['upper' => 'K', 'lower' => 'k', 'key' => 'letter_K', 'word' => 'Kite', 'phonic' => '/k/', 'isVowel' => false, 'audioText' => 'Capital K, small k, as in Kite'],
            ['upper' => 'L', 'lower' => 'l', 'key' => 'letter_L', 'word' => 'Lion', 'phonic' => '/l/', 'isVowel' => false, 'audioText' => 'Capital L, small l, as in Lion'],
            ['upper' => 'M', 'lower' => 'm', 'key' => 'letter_M', 'word' => 'Mango', 'phonic' => '/m/', 'isVowel' => false, 'audioText' => 'Capital M, small m, as in Mango'],
            ['upper' => 'N', 'lower' => 'n', 'key' => 'letter_N', 'word' => 'Nest', 'phonic' => '/n/', 'isVowel' => false, 'audioText' => 'Capital N, small n, as in Nest'],
            ['upper' => 'O', 'lower' => 'o', 'key' => 'letter_O', 'word' => 'Orange', 'phonic' => '/ɒ/', 'isVowel' => true, 'audioText' => 'Capital O, small o, as in Orange'],
            ['upper' => 'P', 'lower' => 'p', 'key' => 'letter_P', 'word' => 'Parrot', 'phonic' => '/p/', 'isVowel' => false, 'audioText' => 'Capital P, small p, as in Parrot'],
            ['upper' => 'Q', 'lower' => 'q', 'key' => 'letter_Q', 'word' => 'Queen', 'phonic' => '/kw/', 'isVowel' => false, 'audioText' => 'Capital Q, small q, as in Queen'],
            ['upper' => 'R', 'lower' => 'r', 'key' => 'letter_R', 'word' => 'Rabbit', 'phonic' => '/r/', 'isVowel' => false, 'audioText' => 'Capital R, small r, as in Rabbit'],
            ['upper' => 'S', 'lower' => 's', 'key' => 'letter_S', 'word' => 'Sun', 'phonic' => '/s/', 'isVowel' => false, 'audioText' => 'Capital S, small s, as in Sun'],
            ['upper' => 'T', 'lower' => 't', 'key' => 'letter_T', 'word' => 'Tiger', 'phonic' => '/t/', 'isVowel' => false, 'audioText' => 'Capital T, small t, as in Tiger'],
            ['upper' => 'U', 'lower' => 'u', 'key' => 'letter_U', 'word' => 'Umbrella', 'phonic' => '/ʌ/', 'isVowel' => true, 'audioText' => 'Capital U, small u, as in Umbrella'],
            ['upper' => 'V', 'lower' => 'v', 'key' => 'letter_V', 'word' => 'Van', 'phonic' => '/v/', 'isVowel' => false, 'audioText' => 'Capital V, small v, as in Van'],
            ['upper' => 'W', 'lower' => 'w', 'key' => 'letter_W', 'word' => 'Watch', 'phonic' => '/w/', 'isVowel' => false, 'audioText' => 'Capital W, small w, as in Watch'],
            ['upper' => 'X', 'lower' => 'x', 'key' => 'letter_X', 'word' => 'Xylophone', 'phonic' => '/ks/', 'isVowel' => false, 'audioText' => 'Capital X, small x, as in Xylophone'],
            ['upper' => 'Y', 'lower' => 'y', 'key' => 'letter_Y', 'word' => 'Yak', 'phonic' => '/j/', 'isVowel' => false, 'audioText' => 'Capital Y, small y, as in Yak'],
            ['upper' => 'Z', 'lower' => 'z', 'key' => 'letter_Z', 'word' => 'Zebra', 'phonic' => '/z/', 'isVowel' => false, 'audioText' => 'Capital Z, small z, as in Zebra'],
        ];

        $charts = [
            ['tables-2-30', 'Maths', 'Tables 2 to 30', 'Multiplication tables from 2 to 30 with interactive recital.', 'multiplication', $tablesData],
            ['tables-2-10', 'Maths', 'Tables 2 to 30', 'Multiplication tables from 2 to 30 with interactive recital.', 'multiplication', $tablesData],
            ['marathi-swar', 'Marathi', 'मराठी चौदाखडी स्वर', 'मराठी चौदाखडीचे १४ स्वर (अ ते अः), मात्रा चिन्हे, उच्चार व बाराखडी/चौदाखडी.', 'chaudakhadi', $swarData],
            ['marathi-vyanjan', 'Marathi', 'मराठी व्यंजने (क ते ज्ञ)', 'क, ख, ग, घ... संपूर्ण ३६ मराठी व्यंजने चित्रांसह, उच्चार व सराव.', 'vyanjan', $vyanjanData],
            ['english-alphabet', 'English', 'A-Z Capital and Small Letters', 'Alphabet reference chart with uppercase and lowercase pairs, phonics, and words.', 'alphabet', $alphabetData],
        ];

        foreach ($charts as [$slug, $subject, $title, $description, $type, $data]) {
            DB::table('learning_charts')->updateOrInsert(
                ['slug' => $slug],
                [
                    'id' => (string) Str::uuid(),
                    'subject' => $subject,
                    'title' => $title,
                    'description' => $description,
                    'chart_type' => $type,
                    'chart_data' => json_encode($data, JSON_UNESCAPED_UNICODE),
                    'updated_at' => now(),
                    'created_at' => now(),
                ]
            );
        }

        DB::table('children')->insertOrIgnore([
            'id' => '00000000-0000-0000-0000-000000000099', 'name' => 'Demo Child', 'username' => 'demo_child', 'grade' => '1', 'board' => 'CBSE', 'medium' => 'English', 'created_at' => now(), 'updated_at' => now(),
        ]);
    }
}
