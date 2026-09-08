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
            'description' => 'Find the missing letter in 500 illustrated everyday words',
            'updated_at' => now(),
        ]);

        // 2. Clear old exercises for this skill
        \Illuminate\Support\Facades\Schema::disableForeignKeyConstraints();
        DB::table('exercises')->where('skill_id', self::SKILL_ID)->delete();
        \Illuminate\Support\Facades\Schema::enableForeignKeyConstraints();

        // 3. 500 Curated Kid-Friendly Vocabulary Words
        $wordsData = array (
  0 => 
  array (
    'word' => 'Ant',
    'blankIdx' => 1,
    'wiki' => 'Ant',
  ),
  1 => 
  array (
    'word' => 'Bat',
    'blankIdx' => 1,
    'wiki' => 'Bat',
  ),
  2 => 
  array (
    'word' => 'Bear',
    'blankIdx' => 1,
    'wiki' => 'Bear',
  ),
  3 => 
  array (
    'word' => 'Beaver',
    'blankIdx' => 1,
    'wiki' => 'Beaver',
  ),
  4 => 
  array (
    'word' => 'Bee',
    'blankIdx' => 1,
    'wiki' => 'Bee',
  ),
  5 => 
  array (
    'word' => 'Beetle',
    'blankIdx' => 2,
    'wiki' => 'Beetle',
  ),
  6 => 
  array (
    'word' => 'Bird',
    'blankIdx' => 1,
    'wiki' => 'Bird',
  ),
  7 => 
  array (
    'word' => 'Butterfly',
    'blankIdx' => 1,
    'wiki' => 'Butterfly',
  ),
  8 => 
  array (
    'word' => 'Camel',
    'blankIdx' => 1,
    'wiki' => 'Camel',
  ),
  9 => 
  array (
    'word' => 'Cat',
    'blankIdx' => 1,
    'wiki' => 'Cat',
  ),
  10 => 
  array (
    'word' => 'Caterpillar',
    'blankIdx' => 3,
    'wiki' => 'Caterpillar',
  ),
  11 => 
  array (
    'word' => 'Chameleon',
    'blankIdx' => 2,
    'wiki' => 'Chameleon',
  ),
  12 => 
  array (
    'word' => 'Cheetah',
    'blankIdx' => 2,
    'wiki' => 'Cheetah',
  ),
  13 => 
  array (
    'word' => 'Cow',
    'blankIdx' => 1,
    'wiki' => 'Cattle',
  ),
  14 => 
  array (
    'word' => 'Crab',
    'blankIdx' => 2,
    'wiki' => 'Crab',
  ),
  15 => 
  array (
    'word' => 'Crocodile',
    'blankIdx' => 2,
    'wiki' => 'Crocodile',
  ),
  16 => 
  array (
    'word' => 'Deer',
    'blankIdx' => 2,
    'wiki' => 'Deer',
  ),
  17 => 
  array (
    'word' => 'Dog',
    'blankIdx' => 1,
    'wiki' => 'Dog',
  ),
  18 => 
  array (
    'word' => 'Dolphin',
    'blankIdx' => 1,
    'wiki' => 'Dolphin',
  ),
  19 => 
  array (
    'word' => 'Donkey',
    'blankIdx' => 1,
    'wiki' => 'Donkey',
  ),
  20 => 
  array (
    'word' => 'Dragonfly',
    'blankIdx' => 2,
    'wiki' => 'Dragonfly',
  ),
  21 => 
  array (
    'word' => 'Duck',
    'blankIdx' => 1,
    'wiki' => 'Duck',
  ),
  22 => 
  array (
    'word' => 'Eagle',
    'blankIdx' => 1,
    'wiki' => 'Eagle',
  ),
  23 => 
  array (
    'word' => 'Elephant',
    'blankIdx' => 2,
    'wiki' => 'Elephant',
  ),
  24 => 
  array (
    'word' => 'Fish',
    'blankIdx' => 1,
    'wiki' => 'Fish',
  ),
  25 => 
  array (
    'word' => 'Flamingo',
    'blankIdx' => 2,
    'wiki' => 'Flamingo',
  ),
  26 => 
  array (
    'word' => 'Fox',
    'blankIdx' => 1,
    'wiki' => 'Fox',
  ),
  27 => 
  array (
    'word' => 'Frog',
    'blankIdx' => 2,
    'wiki' => 'Frog',
  ),
  28 => 
  array (
    'word' => 'Giraffe',
    'blankIdx' => 3,
    'wiki' => 'Giraffe',
  ),
  29 => 
  array (
    'word' => 'Goat',
    'blankIdx' => 2,
    'wiki' => 'Goat',
  ),
  30 => 
  array (
    'word' => 'Goose',
    'blankIdx' => 2,
    'wiki' => 'Goose',
  ),
  31 => 
  array (
    'word' => 'Grasshopper',
    'blankIdx' => 3,
    'wiki' => 'Grasshopper',
  ),
  32 => 
  array (
    'word' => 'Hedgehog',
    'blankIdx' => 2,
    'wiki' => 'Hedgehog',
  ),
  33 => 
  array (
    'word' => 'Hen',
    'blankIdx' => 1,
    'wiki' => 'Chicken',
  ),
  34 => 
  array (
    'word' => 'Hippo',
    'blankIdx' => 1,
    'wiki' => 'Hippopotamus',
  ),
  35 => 
  array (
    'word' => 'Horse',
    'blankIdx' => 1,
    'wiki' => 'Horse',
  ),
  36 => 
  array (
    'word' => 'Jellyfish',
    'blankIdx' => 1,
    'wiki' => 'Jellyfish',
  ),
  37 => 
  array (
    'word' => 'Kangaroo',
    'blankIdx' => 2,
    'wiki' => 'Kangaroo',
  ),
  38 => 
  array (
    'word' => 'Koala',
    'blankIdx' => 2,
    'wiki' => 'Koala',
  ),
  39 => 
  array (
    'word' => 'Ladybug',
    'blankIdx' => 2,
    'wiki' => 'Coccinellidae',
  ),
  40 => 
  array (
    'word' => 'Leopard',
    'blankIdx' => 2,
    'wiki' => 'Leopard',
  ),
  41 => 
  array (
    'word' => 'Lion',
    'blankIdx' => 1,
    'wiki' => 'Lion',
  ),
  42 => 
  array (
    'word' => 'Lizard',
    'blankIdx' => 1,
    'wiki' => 'Lizard',
  ),
  43 => 
  array (
    'word' => 'Lobster',
    'blankIdx' => 1,
    'wiki' => 'Lobster',
  ),
  44 => 
  array (
    'word' => 'Monkey',
    'blankIdx' => 1,
    'wiki' => 'Monkey',
  ),
  45 => 
  array (
    'word' => 'Mosquito',
    'blankIdx' => 2,
    'wiki' => 'Mosquito',
  ),
  46 => 
  array (
    'word' => 'Octopus',
    'blankIdx' => 2,
    'wiki' => 'Octopus',
  ),
  47 => 
  array (
    'word' => 'Ostrich',
    'blankIdx' => 2,
    'wiki' => 'Common ostrich',
  ),
  48 => 
  array (
    'word' => 'Otter',
    'blankIdx' => 1,
    'wiki' => 'Otter',
  ),
  49 => 
  array (
    'word' => 'Owl',
    'blankIdx' => 1,
    'wiki' => 'Owl',
  ),
  50 => 
  array (
    'word' => 'Panda',
    'blankIdx' => 1,
    'wiki' => 'Giant panda',
  ),
  51 => 
  array (
    'word' => 'Parrot',
    'blankIdx' => 2,
    'wiki' => 'Parrot',
  ),
  52 => 
  array (
    'word' => 'Peacock',
    'blankIdx' => 2,
    'wiki' => 'Peafowl',
  ),
  53 => 
  array (
    'word' => 'Penguin',
    'blankIdx' => 1,
    'wiki' => 'Penguin',
  ),
  54 => 
  array (
    'word' => 'Pig',
    'blankIdx' => 1,
    'wiki' => 'Pig',
  ),
  55 => 
  array (
    'word' => 'Rabbit',
    'blankIdx' => 1,
    'wiki' => 'Rabbit',
  ),
  56 => 
  array (
    'word' => 'Raccoon',
    'blankIdx' => 1,
    'wiki' => 'Raccoon',
  ),
  57 => 
  array (
    'word' => 'Rhino',
    'blankIdx' => 1,
    'wiki' => 'Rhinoceros',
  ),
  58 => 
  array (
    'word' => 'Rooster',
    'blankIdx' => 2,
    'wiki' => 'Rooster',
  ),
  59 => 
  array (
    'word' => 'Seahorse',
    'blankIdx' => 2,
    'wiki' => 'Seahorse',
  ),
  60 => 
  array (
    'word' => 'Seal',
    'blankIdx' => 1,
    'wiki' => 'Pinniped',
  ),
  61 => 
  array (
    'word' => 'Shark',
    'blankIdx' => 2,
    'wiki' => 'Shark',
  ),
  62 => 
  array (
    'word' => 'Sheep',
    'blankIdx' => 2,
    'wiki' => 'Sheep',
  ),
  63 => 
  array (
    'word' => 'Slug',
    'blankIdx' => 1,
    'wiki' => 'Slug',
  ),
  64 => 
  array (
    'word' => 'Snail',
    'blankIdx' => 2,
    'wiki' => 'Snail',
  ),
  65 => 
  array (
    'word' => 'Snake',
    'blankIdx' => 2,
    'wiki' => 'Snake',
  ),
  66 => 
  array (
    'word' => 'Spider',
    'blankIdx' => 1,
    'wiki' => 'Spider',
  ),
  67 => 
  array (
    'word' => 'Squid',
    'blankIdx' => 2,
    'wiki' => 'Squid',
  ),
  68 => 
  array (
    'word' => 'Squirrel',
    'blankIdx' => 2,
    'wiki' => 'Squirrel',
  ),
  69 => 
  array (
    'word' => 'Starfish',
    'blankIdx' => 2,
    'wiki' => 'Starfish',
  ),
  70 => 
  array (
    'word' => 'Swan',
    'blankIdx' => 1,
    'wiki' => 'Swan',
  ),
  71 => 
  array (
    'word' => 'Tiger',
    'blankIdx' => 1,
    'wiki' => 'Tiger',
  ),
  72 => 
  array (
    'word' => 'Toad',
    'blankIdx' => 1,
    'wiki' => 'Toad',
  ),
  73 => 
  array (
    'word' => 'Turkey',
    'blankIdx' => 1,
    'wiki' => 'Wild turkey',
  ),
  74 => 
  array (
    'word' => 'Turtle',
    'blankIdx' => 1,
    'wiki' => 'Turtle',
  ),
  75 => 
  array (
    'word' => 'Walrus',
    'blankIdx' => 1,
    'wiki' => 'Walrus',
  ),
  76 => 
  array (
    'word' => 'Whale',
    'blankIdx' => 2,
    'wiki' => 'Whale',
  ),
  77 => 
  array (
    'word' => 'Wolf',
    'blankIdx' => 1,
    'wiki' => 'Wolf',
  ),
  78 => 
  array (
    'word' => 'Worm',
    'blankIdx' => 1,
    'wiki' => 'Earthworm',
  ),
  79 => 
  array (
    'word' => 'Zebra',
    'blankIdx' => 1,
    'wiki' => 'Zebra',
  ),
  80 => 
  array (
    'word' => 'Apple',
    'blankIdx' => 1,
    'wiki' => 'Apple',
  ),
  81 => 
  array (
    'word' => 'Apricot',
    'blankIdx' => 1,
    'wiki' => 'Apricot',
  ),
  82 => 
  array (
    'word' => 'Avocado',
    'blankIdx' => 2,
    'wiki' => 'Avocado',
  ),
  83 => 
  array (
    'word' => 'Banana',
    'blankIdx' => 1,
    'wiki' => 'Banana',
  ),
  84 => 
  array (
    'word' => 'Berry',
    'blankIdx' => 1,
    'wiki' => 'Berry',
  ),
  85 => 
  array (
    'word' => 'Blackberry',
    'blankIdx' => 2,
    'wiki' => 'Blackberry',
  ),
  86 => 
  array (
    'word' => 'Blueberry',
    'blankIdx' => 2,
    'wiki' => 'Blueberry',
  ),
  87 => 
  array (
    'word' => 'Cantaloupe',
    'blankIdx' => 3,
    'wiki' => 'Cantaloupe',
  ),
  88 => 
  array (
    'word' => 'Cherry',
    'blankIdx' => 2,
    'wiki' => 'Cherry',
  ),
  89 => 
  array (
    'word' => 'Clementine',
    'blankIdx' => 2,
    'wiki' => 'Clementine',
  ),
  90 => 
  array (
    'word' => 'Coconut',
    'blankIdx' => 2,
    'wiki' => 'Coconut',
  ),
  91 => 
  array (
    'word' => 'Cranberry',
    'blankIdx' => 2,
    'wiki' => 'Cranberry',
  ),
  92 => 
  array (
    'word' => 'Date',
    'blankIdx' => 1,
    'wiki' => 'Date palm',
  ),
  93 => 
  array (
    'word' => 'Dragonfruit',
    'blankIdx' => 2,
    'wiki' => 'Pitaya',
  ),
  94 => 
  array (
    'word' => 'Fig',
    'blankIdx' => 1,
    'wiki' => 'Common fig',
  ),
  95 => 
  array (
    'word' => 'Gooseberry',
    'blankIdx' => 2,
    'wiki' => 'Gooseberry',
  ),
  96 => 
  array (
    'word' => 'Grape',
    'blankIdx' => 2,
    'wiki' => 'Grape',
  ),
  97 => 
  array (
    'word' => 'Grapefruit',
    'blankIdx' => 3,
    'wiki' => 'Grapefruit',
  ),
  98 => 
  array (
    'word' => 'Guava',
    'blankIdx' => 2,
    'wiki' => 'Guava',
  ),
  99 => 
  array (
    'word' => 'Kiwi',
    'blankIdx' => 1,
    'wiki' => 'Kiwifruit',
  ),
  100 => 
  array (
    'word' => 'Kumquat',
    'blankIdx' => 2,
    'wiki' => 'Kumquat',
  ),
  101 => 
  array (
    'word' => 'Lemon',
    'blankIdx' => 1,
    'wiki' => 'Lemon',
  ),
  102 => 
  array (
    'word' => 'Lime',
    'blankIdx' => 1,
    'wiki' => 'Lime (fruit)',
  ),
  103 => 
  array (
    'word' => 'Lychee',
    'blankIdx' => 2,
    'wiki' => 'Lychee',
  ),
  104 => 
  array (
    'word' => 'Mandarin',
    'blankIdx' => 2,
    'wiki' => 'Mandarin orange',
  ),
  105 => 
  array (
    'word' => 'Mango',
    'blankIdx' => 1,
    'wiki' => 'Mango',
  ),
  106 => 
  array (
    'word' => 'Melon',
    'blankIdx' => 1,
    'wiki' => 'Melon',
  ),
  107 => 
  array (
    'word' => 'Mulberry',
    'blankIdx' => 2,
    'wiki' => 'Morus (plant)',
  ),
  108 => 
  array (
    'word' => 'Olive',
    'blankIdx' => 1,
    'wiki' => 'Olive',
  ),
  109 => 
  array (
    'word' => 'Orange',
    'blankIdx' => 2,
    'wiki' => 'Orange (fruit)',
  ),
  110 => 
  array (
    'word' => 'Papaya',
    'blankIdx' => 2,
    'wiki' => 'Papaya',
  ),
  111 => 
  array (
    'word' => 'Passionfruit',
    'blankIdx' => 2,
    'wiki' => 'Passiflora edulis',
  ),
  112 => 
  array (
    'word' => 'Peach',
    'blankIdx' => 1,
    'wiki' => 'Peach',
  ),
  113 => 
  array (
    'word' => 'Pear',
    'blankIdx' => 1,
    'wiki' => 'Pear',
  ),
  114 => 
  array (
    'word' => 'Pineapple',
    'blankIdx' => 2,
    'wiki' => 'Pineapple',
  ),
  115 => 
  array (
    'word' => 'Plantain',
    'blankIdx' => 2,
    'wiki' => 'Cooking banana',
  ),
  116 => 
  array (
    'word' => 'Plum',
    'blankIdx' => 2,
    'wiki' => 'Plum',
  ),
  117 => 
  array (
    'word' => 'Pomegranate',
    'blankIdx' => 2,
    'wiki' => 'Pomegranate',
  ),
  118 => 
  array (
    'word' => 'Pomelo',
    'blankIdx' => 2,
    'wiki' => 'Pomelo',
  ),
  119 => 
  array (
    'word' => 'Raisin',
    'blankIdx' => 2,
    'wiki' => 'Raisin',
  ),
  120 => 
  array (
    'word' => 'Raspberry',
    'blankIdx' => 2,
    'wiki' => 'Raspberry',
  ),
  121 => 
  array (
    'word' => 'Starfruit',
    'blankIdx' => 2,
    'wiki' => 'Carambola',
  ),
  122 => 
  array (
    'word' => 'Strawberry',
    'blankIdx' => 2,
    'wiki' => 'Strawberry',
  ),
  123 => 
  array (
    'word' => 'Tangerine',
    'blankIdx' => 2,
    'wiki' => 'Tangerine',
  ),
  124 => 
  array (
    'word' => 'Watermelon',
    'blankIdx' => 3,
    'wiki' => 'Watermelon',
  ),
  125 => 
  array (
    'word' => 'Artichoke',
    'blankIdx' => 2,
    'wiki' => 'Artichoke',
  ),
  126 => 
  array (
    'word' => 'Arugula',
    'blankIdx' => 1,
    'wiki' => 'Eruca vesicaria',
  ),
  127 => 
  array (
    'word' => 'Asparagus',
    'blankIdx' => 2,
    'wiki' => 'Asparagus',
  ),
  128 => 
  array (
    'word' => 'Bean',
    'blankIdx' => 1,
    'wiki' => 'Bean',
  ),
  129 => 
  array (
    'word' => 'Beetroot',
    'blankIdx' => 2,
    'wiki' => 'Beetroot',
  ),
  130 => 
  array (
    'word' => 'Bokchoy',
    'blankIdx' => 2,
    'wiki' => 'Bok choy',
  ),
  131 => 
  array (
    'word' => 'Broccoli',
    'blankIdx' => 2,
    'wiki' => 'Broccoli',
  ),
  132 => 
  array (
    'word' => 'Cabbage',
    'blankIdx' => 1,
    'wiki' => 'Cabbage',
  ),
  133 => 
  array (
    'word' => 'Carrot',
    'blankIdx' => 1,
    'wiki' => 'Carrot',
  ),
  134 => 
  array (
    'word' => 'Cauliflower',
    'blankIdx' => 3,
    'wiki' => 'Cauliflower',
  ),
  135 => 
  array (
    'word' => 'Celeriac',
    'blankIdx' => 2,
    'wiki' => 'Celeriac',
  ),
  136 => 
  array (
    'word' => 'Celery',
    'blankIdx' => 1,
    'wiki' => 'Celery',
  ),
  137 => 
  array (
    'word' => 'Chard',
    'blankIdx' => 2,
    'wiki' => 'Chard',
  ),
  138 => 
  array (
    'word' => 'Chickpea',
    'blankIdx' => 2,
    'wiki' => 'Chickpea',
  ),
  139 => 
  array (
    'word' => 'Chili',
    'blankIdx' => 2,
    'wiki' => 'Chili pepper',
  ),
  140 => 
  array (
    'word' => 'Corn',
    'blankIdx' => 1,
    'wiki' => 'Maize',
  ),
  141 => 
  array (
    'word' => 'Cucumber',
    'blankIdx' => 2,
    'wiki' => 'Cucumber',
  ),
  142 => 
  array (
    'word' => 'Eggplant',
    'blankIdx' => 2,
    'wiki' => 'Eggplant',
  ),
  143 => 
  array (
    'word' => 'Fennel',
    'blankIdx' => 2,
    'wiki' => 'Fennel',
  ),
  144 => 
  array (
    'word' => 'Garlic',
    'blankIdx' => 2,
    'wiki' => 'Garlic',
  ),
  145 => 
  array (
    'word' => 'Ginger',
    'blankIdx' => 2,
    'wiki' => 'Ginger',
  ),
  146 => 
  array (
    'word' => 'Kale',
    'blankIdx' => 1,
    'wiki' => 'Kale',
  ),
  147 => 
  array (
    'word' => 'Leek',
    'blankIdx' => 2,
    'wiki' => 'Leek',
  ),
  148 => 
  array (
    'word' => 'Lentil',
    'blankIdx' => 2,
    'wiki' => 'Lentil',
  ),
  149 => 
  array (
    'word' => 'Lettuce',
    'blankIdx' => 2,
    'wiki' => 'Lettuce',
  ),
  150 => 
  array (
    'word' => 'Mushroom',
    'blankIdx' => 2,
    'wiki' => 'Mushroom',
  ),
  151 => 
  array (
    'word' => 'Okra',
    'blankIdx' => 1,
    'wiki' => 'Okra',
  ),
  152 => 
  array (
    'word' => 'Onion',
    'blankIdx' => 2,
    'wiki' => 'Onion',
  ),
  153 => 
  array (
    'word' => 'Parsnip',
    'blankIdx' => 2,
    'wiki' => 'Parsnip',
  ),
  154 => 
  array (
    'word' => 'Peas',
    'blankIdx' => 1,
    'wiki' => 'Pea',
  ),
  155 => 
  array (
    'word' => 'Pepper',
    'blankIdx' => 2,
    'wiki' => 'Bell pepper',
  ),
  156 => 
  array (
    'word' => 'Potato',
    'blankIdx' => 1,
    'wiki' => 'Potato',
  ),
  157 => 
  array (
    'word' => 'Pumpkin',
    'blankIdx' => 2,
    'wiki' => 'Pumpkin',
  ),
  158 => 
  array (
    'word' => 'Radish',
    'blankIdx' => 2,
    'wiki' => 'Radish',
  ),
  159 => 
  array (
    'word' => 'Scallion',
    'blankIdx' => 2,
    'wiki' => 'Scallion',
  ),
  160 => 
  array (
    'word' => 'Shallot',
    'blankIdx' => 2,
    'wiki' => 'Shallot',
  ),
  161 => 
  array (
    'word' => 'Soybean',
    'blankIdx' => 2,
    'wiki' => 'Soybean',
  ),
  162 => 
  array (
    'word' => 'Spinach',
    'blankIdx' => 2,
    'wiki' => 'Spinach',
  ),
  163 => 
  array (
    'word' => 'Squash',
    'blankIdx' => 2,
    'wiki' => 'Squash (plant)',
  ),
  164 => 
  array (
    'word' => 'Sweetpotato',
    'blankIdx' => 3,
    'wiki' => 'Sweet potato',
  ),
  165 => 
  array (
    'word' => 'Tomato',
    'blankIdx' => 1,
    'wiki' => 'Tomato',
  ),
  166 => 
  array (
    'word' => 'Turnip',
    'blankIdx' => 2,
    'wiki' => 'Turnip',
  ),
  167 => 
  array (
    'word' => 'Watercress',
    'blankIdx' => 3,
    'wiki' => 'Watercress',
  ),
  168 => 
  array (
    'word' => 'Yam',
    'blankIdx' => 1,
    'wiki' => 'Yam (vegetable)',
  ),
  169 => 
  array (
    'word' => 'Zucchini',
    'blankIdx' => 2,
    'wiki' => 'Zucchini',
  ),
  170 => 
  array (
    'word' => 'Bagel',
    'blankIdx' => 2,
    'wiki' => 'Bagel',
  ),
  171 => 
  array (
    'word' => 'Biscuit',
    'blankIdx' => 2,
    'wiki' => 'Biscuit',
  ),
  172 => 
  array (
    'word' => 'Bread',
    'blankIdx' => 2,
    'wiki' => 'Bread',
  ),
  173 => 
  array (
    'word' => 'Brownie',
    'blankIdx' => 2,
    'wiki' => 'Chocolate brownie',
  ),
  174 => 
  array (
    'word' => 'Burger',
    'blankIdx' => 2,
    'wiki' => 'Hamburger',
  ),
  175 => 
  array (
    'word' => 'Butter',
    'blankIdx' => 2,
    'wiki' => 'Butter',
  ),
  176 => 
  array (
    'word' => 'Cake',
    'blankIdx' => 1,
    'wiki' => 'Cake',
  ),
  177 => 
  array (
    'word' => 'Candy',
    'blankIdx' => 2,
    'wiki' => 'Candy',
  ),
  178 => 
  array (
    'word' => 'Cereal',
    'blankIdx' => 2,
    'wiki' => 'Breakfast cereal',
  ),
  179 => 
  array (
    'word' => 'Cheese',
    'blankIdx' => 2,
    'wiki' => 'Cheese',
  ),
  180 => 
  array (
    'word' => 'Chocolate',
    'blankIdx' => 3,
    'wiki' => 'Chocolate',
  ),
  181 => 
  array (
    'word' => 'Cocoa',
    'blankIdx' => 2,
    'wiki' => 'Hot chocolate',
  ),
  182 => 
  array (
    'word' => 'Cookie',
    'blankIdx' => 2,
    'wiki' => 'Cookie',
  ),
  183 => 
  array (
    'word' => 'Cracker',
    'blankIdx' => 2,
    'wiki' => 'Cracker (food)',
  ),
  184 => 
  array (
    'word' => 'Croissant',
    'blankIdx' => 3,
    'wiki' => 'Croissant',
  ),
  185 => 
  array (
    'word' => 'Donut',
    'blankIdx' => 2,
    'wiki' => 'Doughnut',
  ),
  186 => 
  array (
    'word' => 'Egg',
    'blankIdx' => 1,
    'wiki' => 'Egg as food',
  ),
  187 => 
  array (
    'word' => 'Honey',
    'blankIdx' => 2,
    'wiki' => 'Honey',
  ),
  188 => 
  array (
    'word' => 'Icecream',
    'blankIdx' => 2,
    'wiki' => 'Ice cream',
  ),
  189 => 
  array (
    'word' => 'Jam',
    'blankIdx' => 1,
    'wiki' => 'Fruit preserves',
  ),
  190 => 
  array (
    'word' => 'Jelly',
    'blankIdx' => 2,
    'wiki' => 'Gelatin dessert',
  ),
  191 => 
  array (
    'word' => 'Juice',
    'blankIdx' => 2,
    'wiki' => 'Juice',
  ),
  192 => 
  array (
    'word' => 'Lemonade',
    'blankIdx' => 3,
    'wiki' => 'Lemonade',
  ),
  193 => 
  array (
    'word' => 'Milk',
    'blankIdx' => 1,
    'wiki' => 'Milk',
  ),
  194 => 
  array (
    'word' => 'Muffin',
    'blankIdx' => 2,
    'wiki' => 'Muffin',
  ),
  195 => 
  array (
    'word' => 'Noodle',
    'blankIdx' => 2,
    'wiki' => 'Noodle',
  ),
  196 => 
  array (
    'word' => 'Oatmeal',
    'blankIdx' => 2,
    'wiki' => 'Oatmeal',
  ),
  197 => 
  array (
    'word' => 'Pancake',
    'blankIdx' => 2,
    'wiki' => 'Pancake',
  ),
  198 => 
  array (
    'word' => 'Pasta',
    'blankIdx' => 2,
    'wiki' => 'Pasta',
  ),
  199 => 
  array (
    'word' => 'Pastry',
    'blankIdx' => 2,
    'wiki' => 'Pastry',
  ),
  200 => 
  array (
    'word' => 'Pie',
    'blankIdx' => 1,
    'wiki' => 'Pie',
  ),
  201 => 
  array (
    'word' => 'Pizza',
    'blankIdx' => 2,
    'wiki' => 'Pizza',
  ),
  202 => 
  array (
    'word' => 'Popcorn',
    'blankIdx' => 2,
    'wiki' => 'Popcorn',
  ),
  203 => 
  array (
    'word' => 'Pretzel',
    'blankIdx' => 2,
    'wiki' => 'Pretzel',
  ),
  204 => 
  array (
    'word' => 'Pudding',
    'blankIdx' => 2,
    'wiki' => 'Pudding',
  ),
  205 => 
  array (
    'word' => 'Rice',
    'blankIdx' => 1,
    'wiki' => 'Rice',
  ),
  206 => 
  array (
    'word' => 'Salad',
    'blankIdx' => 2,
    'wiki' => 'Salad',
  ),
  207 => 
  array (
    'word' => 'Sandwich',
    'blankIdx' => 3,
    'wiki' => 'Sandwich',
  ),
  208 => 
  array (
    'word' => 'Soup',
    'blankIdx' => 2,
    'wiki' => 'Soup',
  ),
  209 => 
  array (
    'word' => 'Syrup',
    'blankIdx' => 2,
    'wiki' => 'Maple syrup',
  ),
  210 => 
  array (
    'word' => 'Tart',
    'blankIdx' => 1,
    'wiki' => 'Tart',
  ),
  211 => 
  array (
    'word' => 'Tea',
    'blankIdx' => 1,
    'wiki' => 'Tea',
  ),
  212 => 
  array (
    'word' => 'Toast',
    'blankIdx' => 2,
    'wiki' => 'Toast (food)',
  ),
  213 => 
  array (
    'word' => 'Waffle',
    'blankIdx' => 2,
    'wiki' => 'Waffle',
  ),
  214 => 
  array (
    'word' => 'Yogurt',
    'blankIdx' => 2,
    'wiki' => 'Yogurt',
  ),
  215 => 
  array (
    'word' => 'Beach',
    'blankIdx' => 1,
    'wiki' => 'Beach',
  ),
  216 => 
  array (
    'word' => 'Breeze',
    'blankIdx' => 2,
    'wiki' => 'Wind',
  ),
  217 => 
  array (
    'word' => 'Canyon',
    'blankIdx' => 2,
    'wiki' => 'Canyon',
  ),
  218 => 
  array (
    'word' => 'Cave',
    'blankIdx' => 1,
    'wiki' => 'Cave',
  ),
  219 => 
  array (
    'word' => 'Cliff',
    'blankIdx' => 2,
    'wiki' => 'Cliff',
  ),
  220 => 
  array (
    'word' => 'Cloud',
    'blankIdx' => 2,
    'wiki' => 'Cloud',
  ),
  221 => 
  array (
    'word' => 'Dawn',
    'blankIdx' => 1,
    'wiki' => 'Dawn',
  ),
  222 => 
  array (
    'word' => 'Desert',
    'blankIdx' => 2,
    'wiki' => 'Desert',
  ),
  223 => 
  array (
    'word' => 'Dune',
    'blankIdx' => 1,
    'wiki' => 'Dune',
  ),
  224 => 
  array (
    'word' => 'Earth',
    'blankIdx' => 1,
    'wiki' => 'Earth',
  ),
  225 => 
  array (
    'word' => 'Forest',
    'blankIdx' => 2,
    'wiki' => 'Forest',
  ),
  226 => 
  array (
    'word' => 'Frost',
    'blankIdx' => 2,
    'wiki' => 'Frost',
  ),
  227 => 
  array (
    'word' => 'Geyser',
    'blankIdx' => 2,
    'wiki' => 'Geyser',
  ),
  228 => 
  array (
    'word' => 'Glacier',
    'blankIdx' => 2,
    'wiki' => 'Glacier',
  ),
  229 => 
  array (
    'word' => 'Hill',
    'blankIdx' => 1,
    'wiki' => 'Hill',
  ),
  230 => 
  array (
    'word' => 'Ice',
    'blankIdx' => 1,
    'wiki' => 'Ice',
  ),
  231 => 
  array (
    'word' => 'Island',
    'blankIdx' => 2,
    'wiki' => 'Island',
  ),
  232 => 
  array (
    'word' => 'Jungle',
    'blankIdx' => 2,
    'wiki' => 'Jungle',
  ),
  233 => 
  array (
    'word' => 'Lake',
    'blankIdx' => 1,
    'wiki' => 'Lake',
  ),
  234 => 
  array (
    'word' => 'Lightning',
    'blankIdx' => 3,
    'wiki' => 'Lightning',
  ),
  235 => 
  array (
    'word' => 'Meadow',
    'blankIdx' => 2,
    'wiki' => 'Meadow',
  ),
  236 => 
  array (
    'word' => 'Moon',
    'blankIdx' => 2,
    'wiki' => 'Moon',
  ),
  237 => 
  array (
    'word' => 'Mountain',
    'blankIdx' => 3,
    'wiki' => 'Mountain',
  ),
  238 => 
  array (
    'word' => 'Mud',
    'blankIdx' => 1,
    'wiki' => 'Mud',
  ),
  239 => 
  array (
    'word' => 'Oasis',
    'blankIdx' => 2,
    'wiki' => 'Oasis',
  ),
  240 => 
  array (
    'word' => 'Ocean',
    'blankIdx' => 2,
    'wiki' => 'Ocean',
  ),
  241 => 
  array (
    'word' => 'Pebble',
    'blankIdx' => 2,
    'wiki' => 'Pebble',
  ),
  242 => 
  array (
    'word' => 'Planet',
    'blankIdx' => 2,
    'wiki' => 'Planet',
  ),
  243 => 
  array (
    'word' => 'Pond',
    'blankIdx' => 1,
    'wiki' => 'Pond',
  ),
  244 => 
  array (
    'word' => 'Rain',
    'blankIdx' => 1,
    'wiki' => 'Rain',
  ),
  245 => 
  array (
    'word' => 'Rainbow',
    'blankIdx' => 2,
    'wiki' => 'Rainbow',
  ),
  246 => 
  array (
    'word' => 'River',
    'blankIdx' => 2,
    'wiki' => 'River',
  ),
  247 => 
  array (
    'word' => 'Rock',
    'blankIdx' => 1,
    'wiki' => 'Rock (geology)',
  ),
  248 => 
  array (
    'word' => 'Sand',
    'blankIdx' => 1,
    'wiki' => 'Sand',
  ),
  249 => 
  array (
    'word' => 'Sea',
    'blankIdx' => 1,
    'wiki' => 'Sea',
  ),
  250 => 
  array (
    'word' => 'Sky',
    'blankIdx' => 1,
    'wiki' => 'Sky',
  ),
  251 => 
  array (
    'word' => 'Snow',
    'blankIdx' => 2,
    'wiki' => 'Snow',
  ),
  252 => 
  array (
    'word' => 'Soil',
    'blankIdx' => 2,
    'wiki' => 'Soil',
  ),
  253 => 
  array (
    'word' => 'Star',
    'blankIdx' => 2,
    'wiki' => 'Star',
  ),
  254 => 
  array (
    'word' => 'Stone',
    'blankIdx' => 2,
    'wiki' => 'Stone',
  ),
  255 => 
  array (
    'word' => 'Storm',
    'blankIdx' => 2,
    'wiki' => 'Storm',
  ),
  256 => 
  array (
    'word' => 'Stream',
    'blankIdx' => 2,
    'wiki' => 'Stream',
  ),
  257 => 
  array (
    'word' => 'Sun',
    'blankIdx' => 1,
    'wiki' => 'Sun',
  ),
  258 => 
  array (
    'word' => 'Sunset',
    'blankIdx' => 2,
    'wiki' => 'Sunset',
  ),
  259 => 
  array (
    'word' => 'Swamp',
    'blankIdx' => 2,
    'wiki' => 'Swamp',
  ),
  260 => 
  array (
    'word' => 'Thunder',
    'blankIdx' => 2,
    'wiki' => 'Thunder',
  ),
  261 => 
  array (
    'word' => 'Valley',
    'blankIdx' => 2,
    'wiki' => 'Valley',
  ),
  262 => 
  array (
    'word' => 'Volcano',
    'blankIdx' => 2,
    'wiki' => 'Volcano',
  ),
  263 => 
  array (
    'word' => 'Waterfall',
    'blankIdx' => 3,
    'wiki' => 'Waterfall',
  ),
  264 => 
  array (
    'word' => 'Wind',
    'blankIdx' => 1,
    'wiki' => 'Wind',
  ),
  265 => 
  array (
    'word' => 'Bamboo',
    'blankIdx' => 2,
    'wiki' => 'Bamboo',
  ),
  266 => 
  array (
    'word' => 'Bark',
    'blankIdx' => 2,
    'wiki' => 'Bark (botany)',
  ),
  267 => 
  array (
    'word' => 'Blossom',
    'blankIdx' => 2,
    'wiki' => 'Blossom',
  ),
  268 => 
  array (
    'word' => 'Branch',
    'blankIdx' => 2,
    'wiki' => 'Branch',
  ),
  269 => 
  array (
    'word' => 'Bush',
    'blankIdx' => 1,
    'wiki' => 'Shrub',
  ),
  270 => 
  array (
    'word' => 'Cactus',
    'blankIdx' => 2,
    'wiki' => 'Cactus',
  ),
  271 => 
  array (
    'word' => 'Carnation',
    'blankIdx' => 2,
    'wiki' => 'Dianthus caryophyllus',
  ),
  272 => 
  array (
    'word' => 'Clover',
    'blankIdx' => 2,
    'wiki' => 'Clover',
  ),
  273 => 
  array (
    'word' => 'Daisy',
    'blankIdx' => 2,
    'wiki' => 'Bellis perennis',
  ),
  274 => 
  array (
    'word' => 'Dandelion',
    'blankIdx' => 3,
    'wiki' => 'Taraxacum',
  ),
  275 => 
  array (
    'word' => 'Fern',
    'blankIdx' => 1,
    'wiki' => 'Fern',
  ),
  276 => 
  array (
    'word' => 'Flower',
    'blankIdx' => 2,
    'wiki' => 'Flower',
  ),
  277 => 
  array (
    'word' => 'Grass',
    'blankIdx' => 2,
    'wiki' => 'Grass',
  ),
  278 => 
  array (
    'word' => 'Hibiscus',
    'blankIdx' => 2,
    'wiki' => 'Hibiscus',
  ),
  279 => 
  array (
    'word' => 'Jasmine',
    'blankIdx' => 2,
    'wiki' => 'Jasmine',
  ),
  280 => 
  array (
    'word' => 'Lavender',
    'blankIdx' => 3,
    'wiki' => 'Lavandula',
  ),
  281 => 
  array (
    'word' => 'Leaf',
    'blankIdx' => 2,
    'wiki' => 'Leaf',
  ),
  282 => 
  array (
    'word' => 'Lily',
    'blankIdx' => 1,
    'wiki' => 'Lilium',
  ),
  283 => 
  array (
    'word' => 'Lotus',
    'blankIdx' => 2,
    'wiki' => 'Nelumbo nucifera',
  ),
  284 => 
  array (
    'word' => 'Maple',
    'blankIdx' => 2,
    'wiki' => 'Maple',
  ),
  285 => 
  array (
    'word' => 'Marigold',
    'blankIdx' => 2,
    'wiki' => 'Tagetes',
  ),
  286 => 
  array (
    'word' => 'Moss',
    'blankIdx' => 1,
    'wiki' => 'Moss',
  ),
  287 => 
  array (
    'word' => 'Oak',
    'blankIdx' => 1,
    'wiki' => 'Oak',
  ),
  288 => 
  array (
    'word' => 'Orchid',
    'blankIdx' => 2,
    'wiki' => 'Orchid',
  ),
  289 => 
  array (
    'word' => 'Palm',
    'blankIdx' => 1,
    'wiki' => 'Arecaceae',
  ),
  290 => 
  array (
    'word' => 'Petal',
    'blankIdx' => 2,
    'wiki' => 'Petal',
  ),
  291 => 
  array (
    'word' => 'Pine',
    'blankIdx' => 2,
    'wiki' => 'Pine',
  ),
  292 => 
  array (
    'word' => 'Poppy',
    'blankIdx' => 2,
    'wiki' => 'Poppy',
  ),
  293 => 
  array (
    'word' => 'Root',
    'blankIdx' => 2,
    'wiki' => 'Root',
  ),
  294 => 
  array (
    'word' => 'Rose',
    'blankIdx' => 1,
    'wiki' => 'Rose',
  ),
  295 => 
  array (
    'word' => 'Seed',
    'blankIdx' => 2,
    'wiki' => 'Seed',
  ),
  296 => 
  array (
    'word' => 'Shrub',
    'blankIdx' => 2,
    'wiki' => 'Shrub',
  ),
  297 => 
  array (
    'word' => 'Sprout',
    'blankIdx' => 2,
    'wiki' => 'Shoot',
  ),
  298 => 
  array (
    'word' => 'Sunflower',
    'blankIdx' => 3,
    'wiki' => 'Helianthus',
  ),
  299 => 
  array (
    'word' => 'Thorn',
    'blankIdx' => 2,
    'wiki' => 'Thorns, spines, and prickles',
  ),
  300 => 
  array (
    'word' => 'Tree',
    'blankIdx' => 2,
    'wiki' => 'Tree',
  ),
  301 => 
  array (
    'word' => 'Tulip',
    'blankIdx' => 2,
    'wiki' => 'Tulip',
  ),
  302 => 
  array (
    'word' => 'Vine',
    'blankIdx' => 1,
    'wiki' => 'Vine',
  ),
  303 => 
  array (
    'word' => 'Violet',
    'blankIdx' => 2,
    'wiki' => 'Viola (plant)',
  ),
  304 => 
  array (
    'word' => 'Willow',
    'blankIdx' => 2,
    'wiki' => 'Willow',
  ),
  305 => 
  array (
    'word' => 'Backpack',
    'blankIdx' => 2,
    'wiki' => 'Backpack',
  ),
  306 => 
  array (
    'word' => 'Bell',
    'blankIdx' => 1,
    'wiki' => 'Bell',
  ),
  307 => 
  array (
    'word' => 'Binder',
    'blankIdx' => 2,
    'wiki' => 'Ring binder',
  ),
  308 => 
  array (
    'word' => 'Board',
    'blankIdx' => 2,
    'wiki' => 'Blackboard',
  ),
  309 => 
  array (
    'word' => 'Book',
    'blankIdx' => 2,
    'wiki' => 'Book',
  ),
  310 => 
  array (
    'word' => 'Brush',
    'blankIdx' => 2,
    'wiki' => 'Paintbrush',
  ),
  311 => 
  array (
    'word' => 'Calculator',
    'blankIdx' => 3,
    'wiki' => 'Calculator',
  ),
  312 => 
  array (
    'word' => 'Calendar',
    'blankIdx' => 2,
    'wiki' => 'Calendar',
  ),
  313 => 
  array (
    'word' => 'Canvas',
    'blankIdx' => 2,
    'wiki' => 'Canvas',
  ),
  314 => 
  array (
    'word' => 'Chair',
    'blankIdx' => 2,
    'wiki' => 'Chair',
  ),
  315 => 
  array (
    'word' => 'Chalkboard',
    'blankIdx' => 3,
    'wiki' => 'Blackboard',
  ),
  316 => 
  array (
    'word' => 'Clay',
    'blankIdx' => 2,
    'wiki' => 'Clay',
  ),
  317 => 
  array (
    'word' => 'Clip',
    'blankIdx' => 2,
    'wiki' => 'Paper clip',
  ),
  318 => 
  array (
    'word' => 'Clock',
    'blankIdx' => 2,
    'wiki' => 'Clock',
  ),
  319 => 
  array (
    'word' => 'Compass',
    'blankIdx' => 2,
    'wiki' => 'Compass (drawing tool)',
  ),
  320 => 
  array (
    'word' => 'Crayon',
    'blankIdx' => 2,
    'wiki' => 'Crayon',
  ),
  321 => 
  array (
    'word' => 'Desk',
    'blankIdx' => 1,
    'wiki' => 'Desk',
  ),
  322 => 
  array (
    'word' => 'Diary',
    'blankIdx' => 2,
    'wiki' => 'Diary',
  ),
  323 => 
  array (
    'word' => 'Easel',
    'blankIdx' => 2,
    'wiki' => 'Easel',
  ),
  324 => 
  array (
    'word' => 'Envelope',
    'blankIdx' => 2,
    'wiki' => 'Envelope',
  ),
  325 => 
  array (
    'word' => 'Eraser',
    'blankIdx' => 2,
    'wiki' => 'Eraser',
  ),
  326 => 
  array (
    'word' => 'Folder',
    'blankIdx' => 2,
    'wiki' => 'File folder',
  ),
  327 => 
  array (
    'word' => 'Glitter',
    'blankIdx' => 2,
    'wiki' => 'Glitter',
  ),
  328 => 
  array (
    'word' => 'Globe',
    'blankIdx' => 2,
    'wiki' => 'Globe',
  ),
  329 => 
  array (
    'word' => 'Glue',
    'blankIdx' => 2,
    'wiki' => 'Adhesive',
  ),
  330 => 
  array (
    'word' => 'Map',
    'blankIdx' => 1,
    'wiki' => 'Map',
  ),
  331 => 
  array (
    'word' => 'Marker',
    'blankIdx' => 2,
    'wiki' => 'Marker pen',
  ),
  332 => 
  array (
    'word' => 'Notebook',
    'blankIdx' => 2,
    'wiki' => 'Notebook',
  ),
  333 => 
  array (
    'word' => 'Paint',
    'blankIdx' => 2,
    'wiki' => 'Paint',
  ),
  334 => 
  array (
    'word' => 'Palette',
    'blankIdx' => 2,
    'wiki' => 'Palette (painting)',
  ),
  335 => 
  array (
    'word' => 'Paper',
    'blankIdx' => 2,
    'wiki' => 'Paper',
  ),
  336 => 
  array (
    'word' => 'Pen',
    'blankIdx' => 1,
    'wiki' => 'Pen',
  ),
  337 => 
  array (
    'word' => 'Pencil',
    'blankIdx' => 2,
    'wiki' => 'Pencil',
  ),
  338 => 
  array (
    'word' => 'Pin',
    'blankIdx' => 1,
    'wiki' => 'Pushpin',
  ),
  339 => 
  array (
    'word' => 'Ribbon',
    'blankIdx' => 2,
    'wiki' => 'Ribbon',
  ),
  340 => 
  array (
    'word' => 'Ruler',
    'blankIdx' => 2,
    'wiki' => 'Ruler',
  ),
  341 => 
  array (
    'word' => 'Scissors',
    'blankIdx' => 2,
    'wiki' => 'Scissors',
  ),
  342 => 
  array (
    'word' => 'Sharpener',
    'blankIdx' => 3,
    'wiki' => 'Pencil sharpener',
  ),
  343 => 
  array (
    'word' => 'Slate',
    'blankIdx' => 2,
    'wiki' => 'Slate (writing)',
  ),
  344 => 
  array (
    'word' => 'Stapler',
    'blankIdx' => 2,
    'wiki' => 'Stapler',
  ),
  345 => 
  array (
    'word' => 'Sticker',
    'blankIdx' => 2,
    'wiki' => 'Sticker',
  ),
  346 => 
  array (
    'word' => 'Tape',
    'blankIdx' => 2,
    'wiki' => 'Adhesive tape',
  ),
  347 => 
  array (
    'word' => 'Telescope',
    'blankIdx' => 2,
    'wiki' => 'Telescope',
  ),
  348 => 
  array (
    'word' => 'Whiteboard',
    'blankIdx' => 3,
    'wiki' => 'Whiteboard',
  ),
  349 => 
  array (
    'word' => 'Accordion',
    'blankIdx' => 2,
    'wiki' => 'Accordion',
  ),
  350 => 
  array (
    'word' => 'Badminton',
    'blankIdx' => 3,
    'wiki' => 'Badminton',
  ),
  351 => 
  array (
    'word' => 'Ball',
    'blankIdx' => 1,
    'wiki' => 'Ball',
  ),
  352 => 
  array (
    'word' => 'Balloon',
    'blankIdx' => 2,
    'wiki' => 'Balloon',
  ),
  353 => 
  array (
    'word' => 'Baseball',
    'blankIdx' => 2,
    'wiki' => 'Baseball',
  ),
  354 => 
  array (
    'word' => 'Basketball',
    'blankIdx' => 3,
    'wiki' => 'Basketball',
  ),
  355 => 
  array (
    'word' => 'Bicycle',
    'blankIdx' => 2,
    'wiki' => 'Bicycle',
  ),
  356 => 
  array (
    'word' => 'Blocks',
    'blankIdx' => 2,
    'wiki' => 'Toy block',
  ),
  357 => 
  array (
    'word' => 'Chess',
    'blankIdx' => 2,
    'wiki' => 'Chess',
  ),
  358 => 
  array (
    'word' => 'Dice',
    'blankIdx' => 1,
    'wiki' => 'Dice',
  ),
  359 => 
  array (
    'word' => 'Doll',
    'blankIdx' => 1,
    'wiki' => 'Doll',
  ),
  360 => 
  array (
    'word' => 'Domino',
    'blankIdx' => 2,
    'wiki' => 'Dominoes',
  ),
  361 => 
  array (
    'word' => 'Drum',
    'blankIdx' => 2,
    'wiki' => 'Drum',
  ),
  362 => 
  array (
    'word' => 'Flute',
    'blankIdx' => 2,
    'wiki' => 'Flute',
  ),
  363 => 
  array (
    'word' => 'Football',
    'blankIdx' => 2,
    'wiki' => 'Football (ball)',
  ),
  364 => 
  array (
    'word' => 'Frisbee',
    'blankIdx' => 2,
    'wiki' => 'Frisbee',
  ),
  365 => 
  array (
    'word' => 'Golf',
    'blankIdx' => 1,
    'wiki' => 'Golf',
  ),
  366 => 
  array (
    'word' => 'Guitar',
    'blankIdx' => 2,
    'wiki' => 'Guitar',
  ),
  367 => 
  array (
    'word' => 'Harp',
    'blankIdx' => 2,
    'wiki' => 'Harp',
  ),
  368 => 
  array (
    'word' => 'Hockey',
    'blankIdx' => 2,
    'wiki' => 'Ice hockey',
  ),
  369 => 
  array (
    'word' => 'Horn',
    'blankIdx' => 2,
    'wiki' => 'French horn',
  ),
  370 => 
  array (
    'word' => 'Kite',
    'blankIdx' => 1,
    'wiki' => 'Kite',
  ),
  371 => 
  array (
    'word' => 'Marbles',
    'blankIdx' => 2,
    'wiki' => 'Marble (toy)',
  ),
  372 => 
  array (
    'word' => 'Piano',
    'blankIdx' => 2,
    'wiki' => 'Piano',
  ),
  373 => 
  array (
    'word' => 'Puzzle',
    'blankIdx' => 2,
    'wiki' => 'Jigsaw puzzle',
  ),
  374 => 
  array (
    'word' => 'Robot',
    'blankIdx' => 2,
    'wiki' => 'Robot',
  ),
  375 => 
  array (
    'word' => 'Rollerblade',
    'blankIdx' => 3,
    'wiki' => 'Inline skates',
  ),
  376 => 
  array (
    'word' => 'Sandbox',
    'blankIdx' => 2,
    'wiki' => 'Sandplay',
  ),
  377 => 
  array (
    'word' => 'Scooter',
    'blankIdx' => 2,
    'wiki' => 'Kick scooter',
  ),
  378 => 
  array (
    'word' => 'Skateboard',
    'blankIdx' => 3,
    'wiki' => 'Skateboard',
  ),
  379 => 
  array (
    'word' => 'Slide',
    'blankIdx' => 2,
    'wiki' => 'Playground slide',
  ),
  380 => 
  array (
    'word' => 'Snowboard',
    'blankIdx' => 3,
    'wiki' => 'Snowboard',
  ),
  381 => 
  array (
    'word' => 'Swing',
    'blankIdx' => 2,
    'wiki' => 'Swing (seat)',
  ),
  382 => 
  array (
    'word' => 'Tambourine',
    'blankIdx' => 3,
    'wiki' => 'Tambourine',
  ),
  383 => 
  array (
    'word' => 'Teddybear',
    'blankIdx' => 2,
    'wiki' => 'Teddy bear',
  ),
  384 => 
  array (
    'word' => 'Tennis',
    'blankIdx' => 2,
    'wiki' => 'Tennis',
  ),
  385 => 
  array (
    'word' => 'Top',
    'blankIdx' => 1,
    'wiki' => 'Spinning top',
  ),
  386 => 
  array (
    'word' => 'Trampoline',
    'blankIdx' => 3,
    'wiki' => 'Trampoline',
  ),
  387 => 
  array (
    'word' => 'Tricycle',
    'blankIdx' => 2,
    'wiki' => 'Tricycle',
  ),
  388 => 
  array (
    'word' => 'Trumpet',
    'blankIdx' => 2,
    'wiki' => 'Trumpet',
  ),
  389 => 
  array (
    'word' => 'Violin',
    'blankIdx' => 2,
    'wiki' => 'Violin',
  ),
  390 => 
  array (
    'word' => 'Whistle',
    'blankIdx' => 2,
    'wiki' => 'Whistle',
  ),
  391 => 
  array (
    'word' => 'Xylophone',
    'blankIdx' => 2,
    'wiki' => 'Xylophone',
  ),
  392 => 
  array (
    'word' => 'Bed',
    'blankIdx' => 1,
    'wiki' => 'Bed',
  ),
  393 => 
  array (
    'word' => 'Blanket',
    'blankIdx' => 2,
    'wiki' => 'Blanket',
  ),
  394 => 
  array (
    'word' => 'Blender',
    'blankIdx' => 2,
    'wiki' => 'Blender',
  ),
  395 => 
  array (
    'word' => 'Bottle',
    'blankIdx' => 2,
    'wiki' => 'Bottle',
  ),
  396 => 
  array (
    'word' => 'Bowl',
    'blankIdx' => 2,
    'wiki' => 'Bowl',
  ),
  397 => 
  array (
    'word' => 'Broom',
    'blankIdx' => 2,
    'wiki' => 'Broom',
  ),
  398 => 
  array (
    'word' => 'Bucket',
    'blankIdx' => 2,
    'wiki' => 'Bucket',
  ),
  399 => 
  array (
    'word' => 'Carpet',
    'blankIdx' => 2,
    'wiki' => 'Carpet',
  ),
  400 => 
  array (
    'word' => 'Comb',
    'blankIdx' => 1,
    'wiki' => 'Comb',
  ),
  401 => 
  array (
    'word' => 'Cup',
    'blankIdx' => 1,
    'wiki' => 'Cup',
  ),
  402 => 
  array (
    'word' => 'Curtain',
    'blankIdx' => 2,
    'wiki' => 'Curtain',
  ),
  403 => 
  array (
    'word' => 'Door',
    'blankIdx' => 2,
    'wiki' => 'Door',
  ),
  404 => 
  array (
    'word' => 'Drawer',
    'blankIdx' => 2,
    'wiki' => 'Drawer (furniture)',
  ),
  405 => 
  array (
    'word' => 'Fan',
    'blankIdx' => 1,
    'wiki' => 'Mechanical fan',
  ),
  406 => 
  array (
    'word' => 'Fork',
    'blankIdx' => 1,
    'wiki' => 'Fork',
  ),
  407 => 
  array (
    'word' => 'Fridge',
    'blankIdx' => 2,
    'wiki' => 'Refrigerator',
  ),
  408 => 
  array (
    'word' => 'Glass',
    'blankIdx' => 2,
    'wiki' => 'Drinking glass',
  ),
  409 => 
  array (
    'word' => 'Hammer',
    'blankIdx' => 2,
    'wiki' => 'Hammer',
  ),
  410 => 
  array (
    'word' => 'Heater',
    'blankIdx' => 2,
    'wiki' => 'Space heater',
  ),
  411 => 
  array (
    'word' => 'Iron',
    'blankIdx' => 1,
    'wiki' => 'Clothes iron',
  ),
  412 => 
  array (
    'word' => 'Kettle',
    'blankIdx' => 2,
    'wiki' => 'Kettle',
  ),
  413 => 
  array (
    'word' => 'Key',
    'blankIdx' => 1,
    'wiki' => 'Key (lock)',
  ),
  414 => 
  array (
    'word' => 'Knife',
    'blankIdx' => 2,
    'wiki' => 'Kitchen knife',
  ),
  415 => 
  array (
    'word' => 'Lamp',
    'blankIdx' => 1,
    'wiki' => 'Lamp (electrical component)',
  ),
  416 => 
  array (
    'word' => 'Lock',
    'blankIdx' => 1,
    'wiki' => 'Lock (security device)',
  ),
  417 => 
  array (
    'word' => 'Mirror',
    'blankIdx' => 2,
    'wiki' => 'Mirror',
  ),
  418 => 
  array (
    'word' => 'Mop',
    'blankIdx' => 1,
    'wiki' => 'Mop',
  ),
  419 => 
  array (
    'word' => 'Mug',
    'blankIdx' => 1,
    'wiki' => 'Mug',
  ),
  420 => 
  array (
    'word' => 'Nail',
    'blankIdx' => 2,
    'wiki' => 'Nail (fastener)',
  ),
  421 => 
  array (
    'word' => 'Oven',
    'blankIdx' => 1,
    'wiki' => 'Oven',
  ),
  422 => 
  array (
    'word' => 'Pan',
    'blankIdx' => 1,
    'wiki' => 'Frying pan',
  ),
  423 => 
  array (
    'word' => 'Pillow',
    'blankIdx' => 2,
    'wiki' => 'Pillow',
  ),
  424 => 
  array (
    'word' => 'Plate',
    'blankIdx' => 2,
    'wiki' => 'Plate (dishware)',
  ),
  425 => 
  array (
    'word' => 'Pliers',
    'blankIdx' => 2,
    'wiki' => 'Pliers',
  ),
  426 => 
  array (
    'word' => 'Pot',
    'blankIdx' => 1,
    'wiki' => 'Cookware and bakeware',
  ),
  427 => 
  array (
    'word' => 'Rug',
    'blankIdx' => 1,
    'wiki' => 'Carpet',
  ),
  428 => 
  array (
    'word' => 'Saw',
    'blankIdx' => 1,
    'wiki' => 'Hand saw',
  ),
  429 => 
  array (
    'word' => 'Screw',
    'blankIdx' => 2,
    'wiki' => 'Screw (simple machine)',
  ),
  430 => 
  array (
    'word' => 'Shelf',
    'blankIdx' => 2,
    'wiki' => 'Shelf (storage)',
  ),
  431 => 
  array (
    'word' => 'Sink',
    'blankIdx' => 1,
    'wiki' => 'Sink',
  ),
  432 => 
  array (
    'word' => 'Soap',
    'blankIdx' => 2,
    'wiki' => 'Soap',
  ),
  433 => 
  array (
    'word' => 'Sofa',
    'blankIdx' => 1,
    'wiki' => 'Couch',
  ),
  434 => 
  array (
    'word' => 'Sponge',
    'blankIdx' => 2,
    'wiki' => 'Sponge (tool)',
  ),
  435 => 
  array (
    'word' => 'Spoon',
    'blankIdx' => 2,
    'wiki' => 'Spoon',
  ),
  436 => 
  array (
    'word' => 'Table',
    'blankIdx' => 2,
    'wiki' => 'Table (furniture)',
  ),
  437 => 
  array (
    'word' => 'Teapot',
    'blankIdx' => 2,
    'wiki' => 'Teapot',
  ),
  438 => 
  array (
    'word' => 'Toaster',
    'blankIdx' => 2,
    'wiki' => 'Toaster',
  ),
  439 => 
  array (
    'word' => 'Toothbrush',
    'blankIdx' => 3,
    'wiki' => 'Toothbrush',
  ),
  440 => 
  array (
    'word' => 'Torch',
    'blankIdx' => 2,
    'wiki' => 'Flashlight',
  ),
  441 => 
  array (
    'word' => 'Towel',
    'blankIdx' => 2,
    'wiki' => 'Towel',
  ),
  442 => 
  array (
    'word' => 'Wardrobe',
    'blankIdx' => 2,
    'wiki' => 'Wardrobe',
  ),
  443 => 
  array (
    'word' => 'Window',
    'blankIdx' => 2,
    'wiki' => 'Window',
  ),
  444 => 
  array (
    'word' => 'Wrench',
    'blankIdx' => 2,
    'wiki' => 'Wrench',
  ),
  445 => 
  array (
    'word' => 'Airplane',
    'blankIdx' => 2,
    'wiki' => 'Airplane',
  ),
  446 => 
  array (
    'word' => 'Ambulance',
    'blankIdx' => 2,
    'wiki' => 'Ambulance',
  ),
  447 => 
  array (
    'word' => 'Anchor',
    'blankIdx' => 2,
    'wiki' => 'Anchor',
  ),
  448 => 
  array (
    'word' => 'Belt',
    'blankIdx' => 1,
    'wiki' => 'Belt (clothing)',
  ),
  449 => 
  array (
    'word' => 'Boat',
    'blankIdx' => 2,
    'wiki' => 'Boat',
  ),
  450 => 
  array (
    'word' => 'Boots',
    'blankIdx' => 2,
    'wiki' => 'Boot',
  ),
  451 => 
  array (
    'word' => 'Bulldozer',
    'blankIdx' => 3,
    'wiki' => 'Bulldozer',
  ),
  452 => 
  array (
    'word' => 'Bus',
    'blankIdx' => 1,
    'wiki' => 'Bus',
  ),
  453 => 
  array (
    'word' => 'Canoe',
    'blankIdx' => 2,
    'wiki' => 'Canoe',
  ),
  454 => 
  array (
    'word' => 'Cap',
    'blankIdx' => 1,
    'wiki' => 'Baseball cap',
  ),
  455 => 
  array (
    'word' => 'Car',
    'blankIdx' => 1,
    'wiki' => 'Car',
  ),
  456 => 
  array (
    'word' => 'Castle',
    'blankIdx' => 2,
    'wiki' => 'Castle',
  ),
  457 => 
  array (
    'word' => 'Coat',
    'blankIdx' => 2,
    'wiki' => 'Coat (clothing)',
  ),
  458 => 
  array (
    'word' => 'Crane',
    'blankIdx' => 2,
    'wiki' => 'Crane (machine)',
  ),
  459 => 
  array (
    'word' => 'Crown',
    'blankIdx' => 2,
    'wiki' => 'Crown',
  ),
  460 => 
  array (
    'word' => 'Dress',
    'blankIdx' => 2,
    'wiki' => 'Dress',
  ),
  461 => 
  array (
    'word' => 'Engine',
    'blankIdx' => 2,
    'wiki' => 'Engine',
  ),
  462 => 
  array (
    'word' => 'Fireengine',
    'blankIdx' => 3,
    'wiki' => 'Fire engine',
  ),
  463 => 
  array (
    'word' => 'Glasses',
    'blankIdx' => 2,
    'wiki' => 'Glasses',
  ),
  464 => 
  array (
    'word' => 'Gloves',
    'blankIdx' => 2,
    'wiki' => 'Glove',
  ),
  465 => 
  array (
    'word' => 'Hat',
    'blankIdx' => 1,
    'wiki' => 'Hat',
  ),
  466 => 
  array (
    'word' => 'Helicopter',
    'blankIdx' => 3,
    'wiki' => 'Helicopter',
  ),
  467 => 
  array (
    'word' => 'House',
    'blankIdx' => 2,
    'wiki' => 'House',
  ),
  468 => 
  array (
    'word' => 'Jacket',
    'blankIdx' => 2,
    'wiki' => 'Jacket',
  ),
  469 => 
  array (
    'word' => 'Jeep',
    'blankIdx' => 2,
    'wiki' => 'Jeep',
  ),
  470 => 
  array (
    'word' => 'Jet',
    'blankIdx' => 1,
    'wiki' => 'Jet aircraft',
  ),
  471 => 
  array (
    'word' => 'Lighthouse',
    'blankIdx' => 3,
    'wiki' => 'Lighthouse',
  ),
  472 => 
  array (
    'word' => 'Microscope',
    'blankIdx' => 3,
    'wiki' => 'Microscope',
  ),
  473 => 
  array (
    'word' => 'Mittens',
    'blankIdx' => 2,
    'wiki' => 'Mitten',
  ),
  474 => 
  array (
    'word' => 'Motorcycle',
    'blankIdx' => 3,
    'wiki' => 'Motorcycle',
  ),
  475 => 
  array (
    'word' => 'Necklace',
    'blankIdx' => 2,
    'wiki' => 'Necklace',
  ),
  476 => 
  array (
    'word' => 'Pants',
    'blankIdx' => 2,
    'wiki' => 'Trousers',
  ),
  477 => 
  array (
    'word' => 'Parachute',
    'blankIdx' => 3,
    'wiki' => 'Parachute',
  ),
  478 => 
  array (
    'word' => 'Policecar',
    'blankIdx' => 3,
    'wiki' => 'Police car',
  ),
  479 => 
  array (
    'word' => 'Pyramid',
    'blankIdx' => 2,
    'wiki' => 'Egyptian pyramids',
  ),
  480 => 
  array (
    'word' => 'Ring',
    'blankIdx' => 1,
    'wiki' => 'Ring (jewellery)',
  ),
  481 => 
  array (
    'word' => 'Rocket',
    'blankIdx' => 2,
    'wiki' => 'Rocket',
  ),
  482 => 
  array (
    'word' => 'Scarf',
    'blankIdx' => 2,
    'wiki' => 'Scarf',
  ),
  483 => 
  array (
    'word' => 'Ship',
    'blankIdx' => 2,
    'wiki' => 'Ship',
  ),
  484 => 
  array (
    'word' => 'Shirt',
    'blankIdx' => 2,
    'wiki' => 'Shirt',
  ),
  485 => 
  array (
    'word' => 'Shoes',
    'blankIdx' => 2,
    'wiki' => 'Shoe',
  ),
  486 => 
  array (
    'word' => 'Shorts',
    'blankIdx' => 2,
    'wiki' => 'Shorts',
  ),
  487 => 
  array (
    'word' => 'Skirt',
    'blankIdx' => 2,
    'wiki' => 'Skirt',
  ),
  488 => 
  array (
    'word' => 'Slippers',
    'blankIdx' => 2,
    'wiki' => 'Slipper',
  ),
  489 => 
  array (
    'word' => 'Socks',
    'blankIdx' => 2,
    'wiki' => 'Sock',
  ),
  490 => 
  array (
    'word' => 'Spaceship',
    'blankIdx' => 3,
    'wiki' => 'Spacecraft',
  ),
  491 => 
  array (
    'word' => 'Submarine',
    'blankIdx' => 3,
    'wiki' => 'Submarine',
  ),
  492 => 
  array (
    'word' => 'Sunglasses',
    'blankIdx' => 3,
    'wiki' => 'Sunglasses',
  ),
  493 => 
  array (
    'word' => 'Sweater',
    'blankIdx' => 2,
    'wiki' => 'Sweater',
  ),
  494 => 
  array (
    'word' => 'Taxi',
    'blankIdx' => 1,
    'wiki' => 'Taxicab',
  ),
  495 => 
  array (
    'word' => 'Tie',
    'blankIdx' => 1,
    'wiki' => 'Necktie',
  ),
  496 => 
  array (
    'word' => 'Tractor',
    'blankIdx' => 2,
    'wiki' => 'Tractor',
  ),
  497 => 
  array (
    'word' => 'Train',
    'blankIdx' => 2,
    'wiki' => 'Train',
  ),
  498 => 
  array (
    'word' => 'Truck',
    'blankIdx' => 2,
    'wiki' => 'Truck',
  ),
  499 => 
  array (
    'word' => 'Van',
    'blankIdx' => 1,
    'wiki' => 'Van',
  ),
);

        // 4. Curated high-resolution fallback educational images
        $fallbacks = array (
  'Rooster' => 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=400&q=80',
  'Dragonfruit' => 'https://images.unsplash.com/photo-1527325678964-54921661f888?auto=format&fit=crop&w=400&q=80',
  'Fig' => 'https://images.unsplash.com/photo-1601379327928-bedfaf9da2d0?auto=format&fit=crop&w=400&q=80',
  'Asparagus' => 'https://images.unsplash.com/photo-1515471209610-dae1c92d8777?auto=format&fit=crop&w=400&q=80',
  'Squash' => 'https://images.unsplash.com/photo-1570586435893-ab4c330ffda9?auto=format&fit=crop&w=400&q=80',
  'Egg' => 'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?auto=format&fit=crop&w=400&q=80',
  'Jelly' => 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?auto=format&fit=crop&w=400&q=80',
  'Stone' => 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?auto=format&fit=crop&w=400&q=80',
  'Thunder' => 'https://images.unsplash.com/photo-1605727216801-e27ce1d0cc28?auto=format&fit=crop&w=400&q=80',
  'Sprout' => 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=400&q=80',
  'Pin' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?auto=format&fit=crop&w=400&q=80',
  'Sandbox' => 'https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=400&q=80',
  'Blender' => 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?auto=format&fit=crop&w=400&q=80',
  'Drawer' => 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=400&q=80',
  'Fan' => 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=400&q=80',
  'Glass' => 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=400&q=80',
  'Key' => 'https://images.unsplash.com/photo-1582139329536-e7284fece509?auto=format&fit=crop&w=400&q=80',
  'Lamp' => 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80',
  'Lock' => 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=400&q=80',
  'Screw' => 'https://images.unsplash.com/photo-1586864387789-62899f733614?auto=format&fit=crop&w=400&q=80',
  'Wardrobe' => 'https://images.unsplash.com/photo-1558997519-83ea9252def8?auto=format&fit=crop&w=400&q=80',
  'Coat' => 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?auto=format&fit=crop&w=400&q=80',
  'Shorts' => 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?auto=format&fit=crop&w=400&q=80',
  'Taxi' => 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
  'Tie' => 'https://images.unsplash.com/photo-1589756823695-278bc923f962?auto=format&fit=crop&w=400&q=80',
  'Tractor' => 'https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=400&q=80',
  'Train' => 'https://images.unsplash.com/photo-1474487548417-781cb71495f3?auto=format&fit=crop&w=400&q=80',
  'Truck' => 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?auto=format&fit=crop&w=400&q=80',
  'Van' => 'https://images.unsplash.com/photo-1527786356703-4b100091cd2c?auto=format&fit=crop&w=400&q=80',
);

        // 5. Batch-fetch Wikimedia Commons pageimages (in batches of 45 titles)
        $ctx = stream_context_create([
            'http' => [
                'header' => "User-Agent: SmartStudyKidApp/1.0 (educational kid app)
",
                'timeout' => 6,
            ]
        ]);

        $wikiImages = [];
        $chunks = array_chunk($wordsData, 45);

        foreach ($chunks as $chunk) {
            $titlesMap = [];
            foreach ($chunk as $item) {
                $titlesMap[$item['wiki']] = $item['word'];
            }

            $titlesParam = implode('|', array_keys($titlesMap));
            $url = 'https://en.wikipedia.org/w/api.php?action=query&titles=' . urlencode($titlesParam) . '&prop=pageimages&format=json&pithumbsize=320';

            $response = @file_get_contents($url, false, $ctx);
            if ($response) {
                $data = json_decode($response, true);
                if (!empty($data['query']['pages'])) {
                    foreach ($data['query']['pages'] as $page) {
                        $pageTitle = $page['title'] ?? '';
                        if (!empty($page['thumbnail']['source'])) {
                            $thumb = $page['thumbnail']['source'];
                            foreach ($titlesMap as $wikiKey => $wordName) {
                                if (strcasecmp($wikiKey, $pageTitle) === 0 || strcasecmp($wordName, $pageTitle) === 0) {
                                    $wikiImages[$wordName] = $thumb;
                                }
                            }
                        }
                    }
                }
            }
        }

        // 6. Assemble 500 exercises
        $vowels = ['A', 'E', 'I', 'O', 'U'];
        $consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'R', 'S', 'T', 'W', 'Y'];
        $exercises = [];

        foreach ($wordsData as $item) {
            $word = strtoupper($item['word']);
            $idx = $item['blankIdx'];
            if ($idx >= strlen($word)) {
                $idx = 1;
            }

            $missingLetter = $word[$idx];
            $prefix = substr($word, 0, $idx);
            $suffix = substr($word, $idx + 1);

            // 3 plausible distractors
            $isVowel = in_array($missingLetter, $vowels);
            $pool = $isVowel ? $vowels : $consonants;
            $distractors = array_values(array_diff($pool, [$missingLetter]));
            shuffle($distractors);
            $chosen = array_slice($distractors, 0, 3);
            $options = array_merge([$missingLetter], $chosen);
            shuffle($options);

            // Sourced web image
            $img = $wikiImages[$item['word']] ?? $fallbacks[$item['word']] ?? ('https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=400&q=80');

            $exercises[] = [
                'id' => (string) Str::uuid(),
                'skill_id' => self::SKILL_ID,
                'question' => "Which letter is missing?

{$prefix}_{$suffix}",
                'question_type' => 'MCQ',
                'template' => 'fill_blank',
                'difficulty' => 1,
                'options' => json_encode($options),
                'correct_answer' => $missingLetter,
                'explanation' => "The missing letter is '{$missingLetter}' to spell '{$item['word']}'.",
                'image_url' => $img,
                'image_question' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        // Insert in batches of 50
        foreach (array_chunk($exercises, 50) as $batch) {
            DB::table('exercises')->insert($batch);
        }
    }

    public function down(): void
    {
        DB::table('exercises')->where('skill_id', self::SKILL_ID)->delete();
    }
};