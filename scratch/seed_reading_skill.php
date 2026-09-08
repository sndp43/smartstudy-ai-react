<?php

require __DIR__ . '/../../apps/api-laravel/vendor/autoload.php';
$app = require_once __DIR__ . '/../../apps/api-laravel/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

echo "Seeding English Reading Skill...\n";

// 1. Ensure English Subject and Reading Topic exist
$englishSubject = DB::table('subjects')->where('name', 'English')->first();
if (!$englishSubject) {
    echo "English subject not found!\n";
    exit(1);
}

$topicId = '00000000-0000-0000-0000-000000000205';
DB::table('topics')->updateOrInsert(
    ['id' => $topicId],
    [
        'subject_id' => $englishSubject->id,
        'name' => 'Reading & Actions',
        'description' => 'Read action sentences across simple, moderate, and hard levels with illustrations',
        'created_at' => now(),
        'updated_at' => now(),
    ]
);

$skillId = '00000000-0000-0000-0000-000000001018';
DB::table('skills')->updateOrInsert(
    ['id' => $skillId],
    [
        'topic_id' => $topicId,
        'name' => 'Sentence Reading & Actions',
        'description' => 'Read simple, moderate, and hard action sentences with vibrant pictures and speech recital',
        'difficulty' => 1,
        'template' => 'story_card',
        'created_at' => now(),
        'updated_at' => now(),
    ]
);

// Helper to make an SVG data URI
function svgDataUri(string $svg): string {
    return 'data:image/svg+xml;utf8,' . rawurlencode(trim($svg));
}

// 18 Sentences with SVGs
$items = [
    // --- SIMPLE LEVEL (Difficulty 1) ---
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'The cat sits on the red mat.',
        'question' => 'What is the cat doing on the red mat?',
        'options' => ['Sitting calmly', 'Flying in the sky', 'Swimming in water'],
        'correct' => 'Sitting calmly',
        'explanation' => 'The orange fluffy cat is resting and sitting comfortably on the round red mat.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff8f0"/><stop offset="100%" stop-color="#fed7aa"/></linearGradient>
    <radialGradient id="mat_s1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ef4444"/><stop offset="85%" stop-color="#b91c1c"/><stop offset="100%" stop-color="#991b1b"/></radialGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s1)"/>
  <!-- Floor line -->
  <line x1="20" y1="185" x2="340" y2="185" stroke="#cbd5e1" stroke-width="3" stroke-dasharray="6,6"/>
  <!-- Red Mat -->
  <ellipse cx="180" cy="170" rx="120" ry="32" fill="url(#mat_s1)"/>
  <ellipse cx="180" cy="170" rx="105" ry="24" fill="none" stroke="#fca5a5" stroke-width="2" stroke-dasharray="5,4"/>
  <!-- Cat Body -->
  <ellipse cx="180" cy="140" rx="42" ry="32" fill="#f97316"/>
  <!-- Cat Head -->
  <circle cx="180" cy="100" r="28" fill="#fb923c"/>
  <!-- Cat Ears -->
  <polygon points="158,82 166,54 176,78" fill="#f97316"/>
  <polygon points="162,79 166,60 172,77" fill="#fecdd3"/>
  <polygon points="202,82 194,54 184,78" fill="#f97316"/>
  <polygon points="198,79 194,60 188,77" fill="#fecdd3"/>
  <!-- Cat Eyes (Happy Sleeping) -->
  <path d="M 166 98 Q 172 104 176 98" fill="none" stroke="#431407" stroke-width="3" stroke-linecap="round"/>
  <path d="M 184 98 Q 188 104 194 98" fill="none" stroke="#431407" stroke-width="3" stroke-linecap="round"/>
  <!-- Nose & Mouth -->
  <polygon points="178,106 182,106 180,109" fill="#f43f5e"/>
  <path d="M 176 110 Q 180 114 184 110" fill="none" stroke="#431407" stroke-width="2"/>
  <!-- Whiskers -->
  <line x1="150" y1="104" x2="168" y2="106" stroke="#fdba74" stroke-width="2"/>
  <line x1="148" y1="110" x2="168" y2="109" stroke="#fdba74" stroke-width="2"/>
  <line x1="192" y1="106" x2="210" y2="104" stroke="#fdba74" stroke-width="2"/>
  <line x1="192" y1="109" x2="212" y2="110" stroke="#fdba74" stroke-width="2"/>
  <!-- Curled Tail -->
  <path d="M 218 145 C 245 145, 250 120, 235 110 C 225 102, 218 115, 224 125" fill="none" stroke="#f97316" stroke-width="8" stroke-linecap="round"/>
  <!-- Paws tucked -->
  <ellipse cx="168" cy="162" rx="10" ry="7" fill="#fed7aa"/>
  <ellipse cx="192" cy="162" rx="10" ry="7" fill="#fed7aa"/>
  <!-- Zzz or Peace heart -->
  <text x="210" y="70" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ea580c">Zzz...</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991b1b">ACTION: Sitting peacefully on the red mat</text>
</svg>'
    ],
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'A happy dog runs in the green park.',
        'question' => 'What action is the happy dog doing?',
        'options' => ['Running on the grass', 'Sleeping in bed', 'Cooking food'],
        'correct' => 'Running on the grass',
        'explanation' => 'The playful golden puppy is bounding joyfully with ears flapping across the grass.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#bae6fd"/><stop offset="65%" stop-color="#e0f2fe"/><stop offset="65%" stop-color="#86efac"/><stop offset="100%" stop-color="#22c55e"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s2)"/>
  <!-- Sun -->
  <circle cx="320" cy="40" r="24" fill="#facc15"/>
  <!-- Motion breeze lines -->
  <path d="M 50 120 Q 90 125 110 115" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none"/>
  <path d="M 40 135 Q 80 140 100 130" stroke="#ffffff" stroke-width="2" stroke-linecap="round" fill="none"/>
  <!-- Dog body running stretched -->
  <ellipse cx="180" cy="130" rx="46" ry="24" fill="#d97706" transform="rotate(-6 180 130)"/>
  <!-- Head -->
  <circle cx="230" cy="105" r="22" fill="#f59e0b"/>
  <polygon points="245,108 260,116 245,124" fill="#f59e0b"/>
  <!-- Floppy Ear flying back -->
  <path d="M 215 95 C 195 85, 185 98, 205 106 Z" fill="#b45309"/>
  <!-- Eye -->
  <circle cx="236" cy="100" r="4" fill="#1e293b"/>
  <circle cx="238" cy="98" r="1.5" fill="#fff"/>
  <!-- Nose & Tongue -->
  <circle cx="258" cy="116" r="4" fill="#1e293b"/>
  <path d="M 248 122 Q 252 134 246 136 Q 242 134 244 122" fill="#f43f5e"/>
  <!-- Front legs leaping -->
  <line x1="210" y1="140" x2="245" y2="165" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
  <line x1="200" y1="140" x2="230" y2="170" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>
  <!-- Back legs kicked back -->
  <line x1="150" y1="135" x2="115" y2="155" stroke="#d97706" stroke-width="8" stroke-linecap="round"/>
  <line x1="160" y1="135" x2="130" y2="162" stroke="#b45309" stroke-width="7" stroke-linecap="round"/>
  <!-- Tail wagging high -->
  <path d="M 138 124 Q 120 100 130 90" fill="none" stroke="#d97706" stroke-width="7" stroke-linecap="round"/>
  <!-- Park Flowers -->
  <circle cx="80" cy="190" r="4" fill="#fbbf24"/><circle cx="290" cy="180" r="4" fill="#f43f5e"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d">ACTION: Running fast across the park</text>
</svg>'
    ],
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'The boy drinks a glass of cold milk.',
        'question' => 'What is the boy drinking?',
        'options' => ['A glass of cold milk', 'A bowl of hot soup', 'A cup of warm tea'],
        'correct' => 'A glass of cold milk',
        'explanation' => 'The boy is holding a tall glass and enjoying cool fresh white milk.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="100%" stop-color="#bfdbfe"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s3)"/>
  <!-- Table -->
  <rect x="0" y="170" width="360" height="50" fill="#fde68a"/>
  <line x1="0" y1="170" x2="360" y2="170" stroke="#d97706" stroke-width="3"/>
  <!-- Boy Body -->
  <path d="M 110 210 Q 110 150 160 145 Q 210 150 210 210 Z" fill="#3b82f6"/>
  <!-- Head -->
  <circle cx="160" cy="90" r="32" fill="#fed7aa"/>
  <!-- Brown Hair -->
  <path d="M 128 90 C 128 55, 192 55, 192 90 C 185 70, 135 70, 128 90 Z" fill="#78350f"/>
  <!-- Eyes -->
  <circle cx="150" cy="88" r="3.5" fill="#1e293b"/>
  <circle cx="170" cy="88" r="3.5" fill="#1e293b"/>
  <!-- White Milk Mustache -->
  <path d="M 152 102 Q 160 100 168 102" stroke="#ffffff" stroke-width="3.5" stroke-linecap="round" fill="none"/>
  <!-- Smiling mouth -->
  <path d="M 154 106 Q 160 112 166 106" stroke="#be123c" stroke-width="2" fill="none"/>
  <!-- Arms holding glass -->
  <path d="M 125 170 Q 145 130 170 128" stroke="#fed7aa" stroke-width="12" stroke-linecap="round" fill="none"/>
  <path d="M 195 170 Q 175 130 150 128" stroke="#fed7aa" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Glass of Milk -->
  <polygon points="148,110 172,110 168,148 152,148" fill="#ffffff" stroke="#38bdf8" stroke-width="2"/>
  <rect x="150" y="116" width="20" height="30" fill="#f8fafc" opacity="0.9"/>
  <!-- Striped Straw -->
  <line x1="164" y1="92" x2="160" y2="135" stroke="#ef4444" stroke-width="3" stroke-linecap="round"/>
  <!-- Ice cube sparkle -->
  <text x="180" y="125" font-size="12">❄️</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e3a8a">ACTION: Drinking a glass of cold milk</text>
</svg>'
    ],
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'A little bird sings on the tree branch.',
        'question' => 'What is the little bird doing on the branch?',
        'options' => ['Singing musical notes', 'Swimming underwater', 'Digging a deep hole'],
        'correct' => 'Singing musical notes',
        'explanation' => 'The bluebird perches on the leafy branch with its beak open, singing sweet notes.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#fed7aa"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s4)"/>
  <!-- Tree Trunk & Branch -->
  <path d="M 0 160 Q 90 150 180 140 Q 270 135 360 145" stroke="#78350f" stroke-width="16" stroke-linecap="round" fill="none"/>
  <!-- Leaves on branch -->
  <ellipse cx="100" cy="140" rx="14" ry="7" fill="#22c55e" transform="rotate(-20 100 140)"/>
  <ellipse cx="260" cy="130" rx="14" ry="7" fill="#16a34a" transform="rotate(25 260 130)"/>
  <ellipse cx="280" cy="138" rx="12" ry="6" fill="#4ade80" transform="rotate(-15 280 138)"/>
  <!-- Bird Body -->
  <ellipse cx="170" cy="115" rx="24" ry="18" fill="#0284c7"/>
  <!-- Belly -->
  <ellipse cx="176" cy="120" rx="16" ry="12" fill="#bae6fd"/>
  <!-- Head -->
  <circle cx="188" cy="98" r="14" fill="#0369a1"/>
  <!-- Eye -->
  <circle cx="192" cy="95" r="2.5" fill="#ffffff"/>
  <circle cx="193" cy="95" r="1.5" fill="#0f172a"/>
  <!-- Open Beak singing -->
  <polygon points="202,96 215,92 203,100" fill="#f59e0b"/>
  <polygon points="203,100 214,103 201,104" fill="#d97706"/>
  <!-- Wing -->
  <ellipse cx="158" cy="114" rx="14" ry="9" fill="#075985" transform="rotate(-10 158 114)"/>
  <!-- Tail -->
  <polygon points="146,115 125,122 130,110" fill="#0369a1"/>
  <!-- Feet gripping branch -->
  <line x1="168" y1="130" x2="166" y2="140" stroke="#f59e0b" stroke-width="2.5"/>
  <line x1="178" y1="130" x2="176" y2="140" stroke="#f59e0b" stroke-width="2.5"/>
  <!-- Musical Notes floating -->
  <text x="225" y="85" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ec4899">♪</text>
  <text x="245" y="70" font-family="sans-serif" font-size="26" font-weight="bold" fill="#8b5cf6">♫</text>
  <text x="275" y="60" font-family="sans-serif" font-size="18" font-weight="bold" fill="#06b6d4">♪</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0369a1">ACTION: Singing cheerful musical notes</text>
</svg>'
    ],
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'The girl reads an open story book.',
        'question' => 'What is the girl holding and reading?',
        'options' => ['An open story book', 'A heavy hammer', 'A tennis racket'],
        'correct' => 'An open story book',
        'explanation' => 'The girl is sitting happily and following words in her colorful storybook.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fdf4ff"/><stop offset="100%" stop-color="#fbcfe8"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s5)"/>
  <!-- Cushion -->
  <ellipse cx="180" cy="180" rx="90" ry="24" fill="#a855f7"/>
  <!-- Girl body -->
  <path d="M 150 180 Q 150 130 180 130 Q 210 130 210 180 Z" fill="#ec4899"/>
  <!-- Head -->
  <circle cx="180" cy="95" r="26" fill="#fed7aa"/>
  <!-- Pigtails -->
  <circle cx="150" cy="92" r="12" fill="#78350f"/>
  <circle cx="210" cy="92" r="12" fill="#78350f"/>
  <path d="M 155 92 C 155 68, 205 68, 205 92 Z" fill="#78350f"/>
  <!-- Face looking down reading -->
  <path d="M 172 95 Q 175 100 178 95" stroke="#1e293b" stroke-width="2.5" fill="none"/>
  <path d="M 184 95 Q 187 100 190 95" stroke="#1e293b" stroke-width="2.5" fill="none"/>
  <path d="M 178 106 Q 181 110 184 106" stroke="#e11d48" stroke-width="2" fill="none"/>
  <!-- Hands holding book -->
  <!-- Open Book -->
  <path d="M 180 152 L 135 140 L 135 172 L 180 178 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <path d="M 180 152 L 225 140 L 225 172 L 180 178 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <path d="M 180 152 L 180 178" stroke="#94a3b8" stroke-width="3"/>
  <path d="M 133 140 L 133 174 L 180 180 L 227 174 L 227 140" fill="none" stroke="#3b82f6" stroke-width="3"/>
  <!-- Book lines/text -->
  <line x1="145" y1="148" x2="170" y2="152" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="145" y1="156" x2="170" y2="160" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="190" y1="152" x2="215" y2="148" stroke="#94a3b8" stroke-width="1.5"/>
  <line x1="190" y1="160" x2="215" y2="156" stroke="#94a3b8" stroke-width="1.5"/>
  <!-- Magic sparkles from book -->
  <text x="145" y="125" font-size="14">✨</text>
  <text x="210" y="125" font-size="14">⭐</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#86198f">ACTION: Reading an open storybook</text>
</svg>'
    ],
    [
        'difficulty' => 1,
        'level_name' => 'Simple',
        'sentence' => 'A green frog hops over the big rock.',
        'question' => 'How does the frog move over the rock?',
        'options' => ['Hops through the air', 'Drives a blue car', 'Crawls backwards'],
        'correct' => 'Hops through the air',
        'explanation' => 'The green frog leaps high in an arc right over the smooth grey stone.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_s6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#ecfdf5"/><stop offset="100%" stop-color="#a7f3d0"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_s6)"/>
  <!-- Pond ground & grass -->
  <rect x="0" y="170" width="360" height="50" fill="#059669"/>
  <!-- Big grey Rock -->
  <ellipse cx="180" cy="165" rx="55" ry="32" fill="#64748b"/>
  <ellipse cx="175" cy="155" rx="42" ry="20" fill="#94a3b8"/>
  <!-- Dotted Hop Arc -->
  <path d="M 80 165 Q 180 50 280 165" stroke="#f59e0b" stroke-width="3" stroke-dasharray="6,6" fill="none"/>
  <!-- Frog in mid air at apex -->
  <g transform="translate(180, 80)">
    <!-- Frog Body -->
    <ellipse cx="0" cy="0" rx="22" ry="16" fill="#22c55e"/>
    <ellipse cx="0" cy="2" rx="14" ry="10" fill="#86efac"/>
    <!-- Big Bulbous Eyes -->
    <circle cx="-10" cy="-14" r="8" fill="#22c55e"/>
    <circle cx="-10" cy="-14" r="5" fill="#ffffff"/>
    <circle cx="-9" cy="-14" r="2.5" fill="#0f172a"/>
    <circle cx="10" cy="-14" r="8" fill="#22c55e"/>
    <circle cx="10" cy="-14" r="5" fill="#ffffff"/>
    <circle cx="9" cy="-14" r="2.5" fill="#0f172a"/>
    <!-- Big Smile -->
    <path d="M -8 -2 Q 0 6 8 -2" stroke="#14532d" stroke-width="2" fill="none"/>
    <!-- Front legs out -->
    <line x1="-16" y1="4" x2="-28" y2="-6" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/>
    <line x1="16" y1="4" x2="28" y2="-6" stroke="#22c55e" stroke-width="4" stroke-linecap="round"/>
    <!-- Back legs stretched in hop -->
    <line x1="-12" y1="12" x2="-26" y2="24" stroke="#16a34a" stroke-width="5" stroke-linecap="round"/>
    <line x1="12" y1="12" x2="26" y2="24" stroke="#16a34a" stroke-width="5" stroke-linecap="round"/>
  </g>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Hopping high in the air over the rock</text>
</svg>'
    ],

    // --- MODERATE LEVEL (Difficulty 2) ---
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'The smiling girl rides her bright yellow bicycle down the sunny hill.',
        'question' => 'What is the smiling girl riding down the hill?',
        'options' => ['Her bright yellow bicycle', 'A large wooden canoe', 'A roaring motorcycle'],
        'correct' => 'Her bright yellow bicycle',
        'explanation' => 'The girl wears a protective helmet and pedals her yellow bike down the grassy slope.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m1" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#7dd3fc"/><stop offset="50%" stop-color="#bae6fd"/><stop offset="50%" stop-color="#86efac"/><stop offset="100%" stop-color="#22c55e"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m1)"/>
  <!-- Sunny Hill slope -->
  <path d="M 0 90 Q 180 120 360 180 L 360 220 L 0 220 Z" fill="#15803d"/>
  <!-- Sun -->
  <circle cx="40" cy="40" r="22" fill="#facc15"/>
  <!-- Back Wheel -->
  <circle cx="120" cy="140" r="26" fill="none" stroke="#334155" stroke-width="5"/>
  <circle cx="120" cy="140" r="4" fill="#0f172a"/>
  <!-- Front Wheel -->
  <circle cx="210" cy="165" r="26" fill="none" stroke="#334155" stroke-width="5"/>
  <circle cx="210" cy="165" r="4" fill="#0f172a"/>
  <!-- Yellow Bike Frame -->
  <line x1="120" y1="140" x2="155" y2="142" stroke="#eab308" stroke-width="6" stroke-linecap="round"/>
  <line x1="155" y1="142" x2="198" y2="125" stroke="#eab308" stroke-width="6" stroke-linecap="round"/>
  <line x1="155" y1="142" x2="140" y2="110" stroke="#eab308" stroke-width="6" stroke-linecap="round"/>
  <line x1="120" y1="140" x2="140" y2="110" stroke="#eab308" stroke-width="6" stroke-linecap="round"/>
  <line x1="198" y1="125" x2="210" y2="165" stroke="#eab308" stroke-width="6" stroke-linecap="round"/>
  <!-- Handlebars -->
  <line x1="198" y1="125" x2="192" y2="108" stroke="#334155" stroke-width="5"/>
  <line x1="185" y1="108" x2="200" y2="108" stroke="#334155" stroke-width="5" stroke-linecap="round"/>
  <!-- Saddle -->
  <line x1="135" y1="108" x2="148" y2="108" stroke="#0f172a" stroke-width="6" stroke-linecap="round"/>
  <!-- Girl Rider -->
  <!-- Leg pedaling -->
  <line x1="142" y1="110" x2="155" y2="142" stroke="#f43f5e" stroke-width="8" stroke-linecap="round"/>
  <!-- Torso leaning forward -->
  <line x1="142" y1="110" x2="168" y2="78" stroke="#8b5cf6" stroke-width="12" stroke-linecap="round"/>
  <!-- Arms to handlebar -->
  <line x1="168" y1="78" x2="192" y2="108" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
  <!-- Head & Helmet -->
  <circle cx="178" cy="62" r="14" fill="#fed7aa"/>
  <path d="M 166 60 C 166 45, 192 45, 194 60 Z" fill="#ec4899"/>
  <!-- Face smile -->
  <circle cx="182" cy="62" r="2" fill="#0f172a"/>
  <path d="M 180 68 Q 184 72 188 68" stroke="#b91c1c" stroke-width="1.5" fill="none"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Riding a yellow bicycle down the hill</text>
</svg>'
    ],
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'A fluffy puppy splashes playfully in a puddle of cool rainwater.',
        'question' => 'Where is the fluffy puppy splashing playfully?',
        'options' => ['In a puddle of cool rainwater', 'Inside a dark cupboard', 'On top of the dining table'],
        'correct' => 'In a puddle of cool rainwater',
        'explanation' => 'The puppy stomps joyfully into the water puddle, splashing droplets all around.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#cbd5e1"/><stop offset="100%" stop-color="#94a3b8"/></linearGradient>
    <radialGradient id="puddle_m2" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></radialGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m2)"/>
  <!-- Rainbow in clearing sky -->
  <path d="M 40 80 A 120 120 0 0 1 280 80" stroke="#f43f5e" stroke-width="4" fill="none" opacity="0.7"/>
  <path d="M 46 80 A 114 114 0 0 1 274 80" stroke="#fbbf24" stroke-width="4" fill="none" opacity="0.7"/>
  <path d="M 52 80 A 108 108 0 0 1 268 80" stroke="#34d399" stroke-width="4" fill="none" opacity="0.7"/>
  <path d="M 58 80 A 102 102 0 0 1 262 80" stroke="#60a5fa" stroke-width="4" fill="none" opacity="0.7"/>
  <!-- Rain Puddle -->
  <ellipse cx="180" cy="165" rx="110" ry="32" fill="url(#puddle_m2)"/>
  <ellipse cx="180" cy="165" rx="95" ry="24" fill="#7dd3fc" opacity="0.6"/>
  <!-- Water Splash Droplets -->
  <path d="M 140 160 Q 120 130 115 110" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none"/>
  <circle cx="115" cy="105" r="4" fill="#0284c7"/>
  <path d="M 220 160 Q 240 130 245 110" stroke="#38bdf8" stroke-width="4" stroke-linecap="round" fill="none"/>
  <circle cx="245" cy="105" r="4" fill="#0284c7"/>
  <circle cx="145" cy="125" r="3" fill="#38bdf8"/>
  <circle cx="215" cy="125" r="3" fill="#38bdf8"/>
  <!-- Puppy Body in center -->
  <ellipse cx="180" cy="125" rx="36" ry="26" fill="#f8fafc"/>
  <!-- Brown Spot on Back -->
  <ellipse cx="165" cy="120" rx="14" ry="10" fill="#78350f"/>
  <!-- Puppy Head -->
  <circle cx="180" cy="85" r="22" fill="#f8fafc"/>
  <circle cx="192" cy="82" r="10" fill="#78350f"/>
  <!-- Floppy Ears -->
  <path d="M 162 75 C 145 70, 148 95, 160 92 Z" fill="#78350f"/>
  <path d="M 198 75 C 215 70, 212 95, 200 92 Z" fill="#78350f"/>
  <!-- Eyes -->
  <circle cx="173" cy="82" r="3" fill="#0f172a"/>
  <circle cx="187" cy="82" r="3" fill="#0f172a"/>
  <!-- Nose & Tongue -->
  <circle cx="180" cy="90" r="3.5" fill="#0f172a"/>
  <path d="M 178 95 Q 180 102 182 95" fill="#f43f5e"/>
  <!-- Paws stomping in water -->
  <line x1="165" y1="140" x2="160" y2="165" stroke="#f8fafc" stroke-width="8" stroke-linecap="round"/>
  <line x1="195" y1="140" x2="200" y2="165" stroke="#f8fafc" stroke-width="8" stroke-linecap="round"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0c4a6e">ACTION: Splashing playfully in the puddle</text>
</svg>'
    ],
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'A busy brown squirrel gathers acorns and hides them under the tall oak tree.',
        'question' => 'What action is the busy squirrel doing?',
        'options' => ['Gathering acorns to hide them', 'Sleeping inside a warm oven', 'Building a sandcastle on the beach'],
        'correct' => 'Gathering acorns to hide them',
        'explanation' => 'The squirrel collects acorns in its little paws and stores them near oak tree roots.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef3c7"/><stop offset="100%" stop-color="#fed7aa"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m3)"/>
  <!-- Massive Oak Tree Trunk on Right -->
  <path d="M 280 0 L 260 160 Q 280 185 360 190 L 360 0 Z" fill="#78350f"/>
  <path d="M 260 160 Q 230 180 200 185" stroke="#78350f" stroke-width="12" stroke-linecap="round" fill="none"/>
  <!-- Forest Ground with Autumn Leaves -->
  <rect x="0" y="175" width="360" height="45" fill="#a16207"/>
  <!-- Falling autumn leaves -->
  <ellipse cx="230" cy="50" rx="8" ry="4" fill="#ea580c" transform="rotate(30 230 50)"/>
  <ellipse cx="140" cy="70" rx="8" ry="4" fill="#d97706" transform="rotate(-40 140 70)"/>
  <!-- Squirrel Body standing upright -->
  <ellipse cx="140" cy="135" rx="20" ry="26" fill="#9a3412"/>
  <ellipse cx="144" cy="135" rx="14" ry="18" fill="#ffedd5"/>
  <!-- Big Bushy Tail curved up -->
  <path d="M 125 150 C 90 145, 80 80, 115 70 C 130 65, 140 90, 128 115" stroke="#9a3412" stroke-width="18" stroke-linecap="round" fill="none"/>
  <!-- Squirrel Head -->
  <circle cx="150" cy="98" r="16" fill="#9a3412"/>
  <!-- Ears -->
  <polygon points="144,86 148,74 154,84" fill="#9a3412"/>
  <polygon points="156,86 160,76 164,86" fill="#9a3412"/>
  <!-- Eye -->
  <circle cx="155" cy="96" r="3" fill="#0f172a"/>
  <circle cx="156" cy="95" r="1" fill="#ffffff"/>
  <!-- Paws holding acorn -->
  <line x1="148" y1="120" x2="162" y2="115" stroke="#9a3412" stroke-width="4" stroke-linecap="round"/>
  <!-- Acorn held tightly -->
  <ellipse cx="168" cy="115" rx="7" ry="9" fill="#78350f"/>
  <path d="M 161 108 Q 168 105 175 108 Z" fill="#451a03"/>
  <line x1="168" y1="105" x2="168" y2="101" stroke="#451a03" stroke-width="2"/>
  <!-- Stash of Acorns on ground -->
  <circle cx="210" cy="170" r="6" fill="#78350f"/>
  <circle cx="220" cy="172" r="6" fill="#78350f"/>
  <circle cx="215" cy="166" r="5" fill="#451a03"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Gathering and storing acorns under the oak</text>
</svg>'
    ],
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'The friendly baker rolls soft dough and bakes warm bread in the oven.',
        'question' => 'What is the friendly baker doing with the dough?',
        'options' => ['Rolling it to bake warm bread', 'Painting it with purple paint', 'Throwing it into the river'],
        'correct' => 'Rolling it to bake warm bread',
        'explanation' => 'The baker flattens the soft dough with a rolling pin and bakes it into golden bread.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff7ed"/><stop offset="100%" stop-color="#fed7aa"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m4)"/>
  <!-- Brick Oven on Left -->
  <rect x="15" y="60" width="85" height="110" rx="8" fill="#78350f"/>
  <path d="M 30 140 A 30 30 0 0 1 85 140 Z" fill="#451a03"/>
  <!-- Fire glow in oven -->
  <path d="M 45 140 Q 57 115 70 140 Z" fill="#f97316"/>
  <path d="M 50 140 Q 57 125 64 140 Z" fill="#facc15"/>
  <!-- Wooden Baker Table -->
  <rect x="110" y="130" width="230" height="50" fill="#d97706"/>
  <rect x="120" y="180" width="16" height="35" fill="#b45309"/>
  <rect x="310" y="180" width="16" height="35" fill="#b45309"/>
  <!-- Fresh Bread Loaves on tray -->
  <ellipse cx="280" cy="124" rx="14" ry="7" fill="#b45309"/>
  <ellipse cx="305" cy="124" rx="14" ry="7" fill="#92400e"/>
  <!-- Baker Character Behind Table -->
  <!-- Body & White Apron -->
  <path d="M 180 135 L 170 80 Q 210 75 220 80 L 210 135 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <!-- Head -->
  <circle cx="195" cy="65" r="18" fill="#fed7aa"/>
  <!-- Chef Toque Hat -->
  <path d="M 180 50 C 170 25, 220 25, 210 50 Z" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <rect x="180" y="46" width="30" height="8" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
  <!-- Happy Face & Mustache -->
  <circle cx="190" cy="62" r="2" fill="#0f172a"/>
  <circle cx="200" cy="62" r="2" fill="#0f172a"/>
  <path d="M 188 68 Q 195 72 202 68" stroke="#78350f" stroke-width="2.5" stroke-linecap="round" fill="none"/>
  <!-- Soft Dough on Table -->
  <ellipse cx="195" cy="130" rx="30" ry="10" fill="#fef3c7" stroke="#fde047" stroke-width="2"/>
  <!-- Rolling Pin in hands -->
  <rect x="165" y="125" width="60" height="7" rx="3" fill="#b45309"/>
  <line x1="155" y1="128" x2="165" y2="128" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <line x1="225" y1="128" x2="235" y2="128" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#78350f">ACTION: Rolling dough and baking warm bread</text>
</svg>'
    ],
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'Two cheerful children build a tall sandcastle with shells along the ocean shore.',
        'question' => 'What are the two children building on the shore?',
        'options' => ['A tall sandcastle with shells', 'A snowman made of ice', 'A wooden treehouse'],
        'correct' => 'A tall sandcastle with shells',
        'explanation' => 'The children work together on the sandy beach to shape towers and decorate with shells.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#38bdf8"/><stop offset="50%" stop-color="#bae6fd"/><stop offset="50%" stop-color="#fde047"/><stop offset="100%" stop-color="#eab308"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m5)"/>
  <!-- Blue Sea horizon -->
  <rect x="0" y="80" width="360" height="30" fill="#0284c7"/>
  <path d="M 0 110 Q 90 105 180 110 Q 270 115 360 110 L 360 120 L 0 120 Z" fill="#38bdf8"/>
  <!-- Sandcastle in Center -->
  <!-- Base -->
  <polygon points="140,185 150,140 210,140 220,185" fill="#ca8a04"/>
  <!-- Central Main Tower -->
  <rect x="165" y="105" width="30" height="40" fill="#ca8a04"/>
  <!-- Battlements -->
  <rect x="165" y="98" width="8" height="8" fill="#ca8a04"/>
  <rect x="176" y="98" width="8" height="8" fill="#ca8a04"/>
  <rect x="187" y="98" width="8" height="8" fill="#ca8a04"/>
  <!-- Left and Right mini towers -->
  <polygon points="140,145 145,120 160,120 155,145" fill="#a16207"/>
  <polygon points="205,145 200,120 215,120 220,145" fill="#a16207"/>
  <!-- Red Flag on top -->
  <line x1="180" y1="98" x2="180" y2="78" stroke="#334155" stroke-width="2"/>
  <polygon points="180,78 196,85 180,92" fill="#ef4444"/>
  <!-- Seashells on castle -->
  <ellipse cx="160" cy="160" rx="4" ry="3" fill="#fbcfe8"/>
  <ellipse cx="198" cy="160" rx="4" ry="3" fill="#fed7aa"/>
  <!-- Child 1 on Left (with shovel) -->
  <circle cx="105" cy="130" r="14" fill="#fed7aa"/>
  <path d="M 95 185 L 105 145 L 118 185 Z" fill="#ec4899"/>
  <line x1="110" y1="155" x2="135" y2="165" stroke="#ef4444" stroke-width="3.5" stroke-linecap="round"/>
  <!-- Child 2 on Right (with bucket) -->
  <circle cx="255" cy="130" r="14" fill="#fed7aa"/>
  <path d="M 245 185 L 255 145 L 268 185 Z" fill="#3b82f6"/>
  <!-- Red Bucket -->
  <polygon points="228,175 238,175 236,188 230,188" fill="#ef4444"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#713f12">ACTION: Building a tall sandcastle with seashells</text>
</svg>'
    ],
    [
        'difficulty' => 2,
        'level_name' => 'Moderate',
        'sentence' => 'The clever monkey peels a yellow banana and shares it with a friend.',
        'question' => 'What action does the clever monkey take with the banana?',
        'options' => ['Peels it and shares with a friend', 'Hides it under a stone', 'Throws it at the clouds'],
        'correct' => 'Peels it and shares with a friend',
        'explanation' => 'The monkey removes the banana peel and kindly extends half to a baby monkey friend.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_m6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#dcfce7"/><stop offset="100%" stop-color="#86efac"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_m6)"/>
  <!-- Jungle Vines & Large Palm Leaves -->
  <path d="M 0 40 Q 180 80 360 30" stroke="#15803d" stroke-width="8" fill="none"/>
  <ellipse cx="60" cy="40" rx="30" ry="10" fill="#16a34a" transform="rotate(30 60 40)"/>
  <ellipse cx="300" cy="35" rx="30" ry="10" fill="#16a34a" transform="rotate(-25 300 35)"/>
  <!-- Jungle Branch where monkeys sit -->
  <path d="M 40 160 Q 180 150 320 160" stroke="#78350f" stroke-width="16" stroke-linecap="round" fill="none"/>
  <!-- Big Monkey on Left -->
  <ellipse cx="140" cy="125" rx="28" ry="24" fill="#854d0e"/>
  <circle cx="140" cy="90" r="20" fill="#854d0e"/>
  <!-- Face plate -->
  <ellipse cx="140" cy="94" rx="14" ry="12" fill="#fed7aa"/>
  <circle cx="134" cy="90" r="2.5" fill="#0f172a"/>
  <circle cx="146" cy="90" r="2.5" fill="#0f172a"/>
  <path d="M 136 98 Q 140 102 144 98" stroke="#78350f" stroke-width="2" fill="none"/>
  <!-- Monkey Ears -->
  <circle cx="118" cy="90" r="8" fill="#854d0e"/><circle cx="118" cy="90" r="4" fill="#fed7aa"/>
  <circle cx="162" cy="90" r="8" fill="#854d0e"/><circle cx="162" cy="90" r="4" fill="#fed7aa"/>
  <!-- Arm extending peeled banana -->
  <path d="M 155 118 Q 185 110 195 112" stroke="#854d0e" stroke-width="8" stroke-linecap="round" fill="none"/>
  <!-- Peeled Banana -->
  <path d="M 195 115 C 200 105, 215 105, 218 115" stroke="#facc15" stroke-width="6" fill="none"/>
  <!-- White banana fruit inside -->
  <ellipse cx="205" cy="110" rx="8" ry="4" fill="#ffffff"/>
  <!-- Peels hanging down -->
  <path d="M 198 114 Q 192 124 195 128" stroke="#eab308" stroke-width="2.5" fill="none"/>
  <path d="M 210 114 Q 216 124 214 128" stroke="#eab308" stroke-width="2.5" fill="none"/>
  <!-- Friendly Baby Monkey on Right -->
  <ellipse cx="240" cy="132" rx="18" ry="16" fill="#a16207"/>
  <circle cx="240" cy="108" r="14" fill="#a16207"/>
  <ellipse cx="240" cy="110" rx="10" ry="8" fill="#fed7aa"/>
  <circle cx="236" cy="108" r="2" fill="#0f172a"/>
  <circle cx="244" cy="108" r="2" fill="#0f172a"/>
  <!-- Baby reaching hands out happily -->
  <line x1="230" y1="120" x2="215" y2="114" stroke="#a16207" stroke-width="5" stroke-linecap="round"/>
  <!-- Heart symbol -->
  <text x="180" y="75" font-size="18">💛</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#14532d">ACTION: Peeling a banana and sharing with a friend</text>
</svg>'
    ],

    // --- HARD LEVEL (Difficulty 3) ---
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'Under the silvery moonlight, the wise old owl silently spreads its majestic wings to glide across the sleeping forest.',
        'question' => 'What does the wise old owl do under the silvery moonlight?',
        'options' => ['Silently spreads its wings to glide across the forest', 'Chases colorful butterflies through the garden', 'Swims across a wide rushing river'],
        'correct' => 'Silently spreads its wings to glide across the forest',
        'explanation' => 'The owl expands its large feathered wings and flies quietly across the starry night sky.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#020617"/><stop offset="50%" stop-color="#0f172a"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
    <radialGradient id="moon_h1" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#ffffff"/><stop offset="70%" stop-color="#f1f5f9"/><stop offset="100%" stop-color="#94a3b8"/></radialGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h1)"/>
  <!-- Twinkling Stars -->
  <circle cx="45" cy="35" r="1.5" fill="#fff"/><circle cx="120" cy="20" r="2" fill="#fff"/><circle cx="210" cy="40" r="1.5" fill="#fff"/><circle cx="310" cy="25" r="2" fill="#fff"/>
  <circle cx="85" cy="65" r="1" fill="#fff"/><circle cx="270" cy="70" r="1.5" fill="#fff"/>
  <!-- Glowing Full Moon -->
  <circle cx="180" cy="55" r="32" fill="url(#moon_h1)" filter="drop-shadow(0 0 12px rgba(255,255,255,0.45))"/>
  <!-- Sleeping Forest Pine Trees silhouette -->
  <polygon points="20,220 50,150 80,220" fill="#090d16"/>
  <polygon points="70,220 100,165 130,220" fill="#090d16"/>
  <polygon points="120,220 150,155 180,220" fill="#090d16"/>
  <polygon points="180,220 210,160 240,220" fill="#090d16"/>
  <polygon points="230,220 260,150 290,220" fill="#090d16"/>
  <polygon points="280,220 315,160 350,220" fill="#090d16"/>
  <!-- Owl in majestic gliding flight -->
  <g transform="translate(180, 105)">
    <!-- Outstretched Majestic Wings -->
    <!-- Left Wing -->
    <path d="M -15 0 C -60 -25, -110 -15, -120 5 C -95 20, -50 15, -15 8 Z" fill="#b45309"/>
    <path d="M -20 -2 C -65 -20, -105 -8, -112 5" stroke="#d97706" stroke-width="2" fill="none"/>
    <!-- Right Wing -->
    <path d="M 15 0 C 60 -25, 110 -15, 120 5 C 95 20, 50 15, 15 8 Z" fill="#b45309"/>
    <path d="M 20 -2 C 65 -20, 105 -8, 112 5" stroke="#d97706" stroke-width="2" fill="none"/>
    <!-- Body -->
    <ellipse cx="0" cy="5" rx="18" ry="22" fill="#78350f"/>
    <!-- Feathery chest -->
    <ellipse cx="0" cy="8" rx="12" ry="15" fill="#fef3c7"/>
    <!-- Head with tufts -->
    <circle cx="0" cy="-12" r="15" fill="#78350f"/>
    <polygon points="-12,-24 -6,-15 -2,-20" fill="#78350f"/>
    <polygon points="12,-24 6,-15 2,-20" fill="#78350f"/>
    <!-- Big Wise Golden Eyes -->
    <circle cx="-6" cy="-12" r="6" fill="#facc15"/>
    <circle cx="-6" cy="-12" r="3.5" fill="#0f172a"/>
    <circle cx="-5" cy="-13" r="1.5" fill="#ffffff"/>
    <circle cx="6" cy="-12" r="6" fill="#facc15"/>
    <circle cx="6" cy="-12" r="3.5" fill="#0f172a"/>
    <circle cx="7" cy="-13" r="1.5" fill="#ffffff"/>
    <!-- Beak -->
    <polygon points="-2,-7 2,-7 0,-2" fill="#d97706"/>
  </g>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#93c5fd">ACTION: Silently spreading wings to glide across the forest</text>
</svg>'
    ],
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'The curious young scientist carefully peers through her brass microscope to examine tiny glowing cells on a glass slide.',
        'question' => 'What action is the curious scientist performing in her laboratory?',
        'options' => ['Carefully peering through a microscope at cells', 'Cooking pancakes on a hot griddle', 'Riding a skateboard down a city street'],
        'correct' => 'Carefully peering through a microscope at cells',
        'explanation' => 'The young scientist adjusts the lens and looks closely into the microscope to study tiny cells.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h2" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#042f2e"/><stop offset="100%" stop-color="#115e59"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h2)"/>
  <!-- Lab Bench -->
  <rect x="0" y="150" width="360" height="70" fill="#1e293b"/>
  <line x1="0" y1="150" x2="360" y2="150" stroke="#0ea5e9" stroke-width="2"/>
  <!-- Test tubes rack on Left -->
  <rect x="25" y="125" width="45" height="25" fill="#334155"/>
  <rect x="30" y="95" width="8" height="30" rx="3" fill="#ec4899"/>
  <rect x="42" y="100" width="8" height="25" rx="3" fill="#06b6d4"/>
  <rect x="54" y="90" width="8" height="35" rx="3" fill="#a855f7"/>
  <!-- Brass Microscope in Center -->
  <!-- Heavy Horseshoe Base -->
  <ellipse cx="170" cy="150" rx="35" ry="10" fill="#b45309"/>
  <rect x="162" y="120" width="16" height="30" fill="#d97706"/>
  <!-- Stage holding slide -->
  <rect x="145" y="118" width="50" height="6" fill="#1e293b"/>
  <!-- Glass Slide with glowing green sample -->
  <rect x="155" y="116" width="30" height="3" fill="#6ee7b7" opacity="0.9"/>
  <!-- Microscope Tube & Eyepiece tilted -->
  <line x1="170" y1="118" x2="160" y2="70" stroke="#eab308" stroke-width="12" stroke-linecap="round"/>
  <line x1="160" y1="70" x2="155" y2="50" stroke="#ca8a04" stroke-width="14" stroke-linecap="round"/>
  <!-- Focus Adjustment Knob -->
  <circle cx="175" cy="100" r="7" fill="#f59e0b"/>
  <!-- Scientist on Right leaning in -->
  <!-- White Lab Coat -->
  <path d="M 200 150 L 220 95 Q 260 90 270 150 Z" fill="#ffffff"/>
  <!-- Head leaning toward eyepiece -->
  <circle cx="215" cy="65" r="22" fill="#fed7aa"/>
  <!-- Safety Goggles -->
  <ellipse cx="205" cy="64" rx="8" ry="7" fill="#38bdf8" opacity="0.8"/>
  <circle cx="205" cy="64" r="3" fill="#0f172a"/>
  <!-- Hair in tidy bun -->
  <circle cx="235" cy="50" r="14" fill="#451a03"/>
  <path d="M 210 50 C 210 40, 230 40, 235 55 Z" fill="#451a03"/>
  <!-- Hand adjusting focus knob -->
  <line x1="220" y1="110" x2="185" y2="102" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
  <!-- Magnified view circle floating -->
  <circle cx="310" cy="55" r="28" fill="#022c22" stroke="#10b981" stroke-width="3"/>
  <circle cx="305" cy="50" r="5" fill="#34d399"/><circle cx="320" cy="60" r="6" fill="#34d399"/><circle cx="308" cy="68" r="4" fill="#34d399"/>
  <text x="310" y="38" font-size="8" fill="#a7f3d0" text-anchor="middle">CELLS</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2dd4bf">ACTION: Peering through a brass microscope at cells</text>
</svg>'
    ],
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'An adventurous astronaut floats weightlessly outside the spacecraft, repairing solar panels while gazing down at the glowing blue planet Earth.',
        'question' => 'What is the adventurous astronaut doing during the spacewalk?',
        'options' => ['Repairing solar panels while floating weightlessly', 'Planting apple seeds in garden soil', 'Driving a submarine deep beneath the sea'],
        'correct' => 'Repairing solar panels while floating weightlessly',
        'explanation' => 'The astronaut does a spacewalk in zero gravity and repairs the solar panels with tools.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h3" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#020617"/><stop offset="100%" stop-color="#0b132b"/></linearGradient>
    <radialGradient id="earth_h3" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#38bdf8"/><stop offset="60%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0f172a"/></radialGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h3)"/>
  <!-- Glowing Curved Earth below -->
  <ellipse cx="180" cy="280" rx="260" ry="140" fill="url(#earth_h3)"/>
  <!-- Continents & white atmosphere clouds on Earth -->
  <path d="M 80 200 Q 140 180 220 195 Q 280 185 320 210" stroke="#4ade80" stroke-width="12" fill="none" opacity="0.7"/>
  <path d="M 50 195 Q 120 175 190 185" stroke="#ffffff" stroke-width="8" fill="none" opacity="0.8"/>
  <!-- Spacecraft Solar Panels on Left -->
  <rect x="0" y="40" width="80" height="90" fill="#1e3a8a" stroke="#60a5fa" stroke-width="2"/>
  <line x1="0" y1="70" x2="80" y2="70" stroke="#93c5fd" stroke-width="1.5"/>
  <line x1="0" y1="100" x2="80" y2="100" stroke="#93c5fd" stroke-width="1.5"/>
  <line x1="26" y1="40" x2="26" y2="130" stroke="#93c5fd" stroke-width="1.5"/>
  <line x1="53" y1="40" x2="53" y2="130" stroke="#93c5fd" stroke-width="1.5"/>
  <!-- Spacecraft hull truss -->
  <rect x="80" y="78" width="30" height="14" fill="#94a3b8"/>
  <!-- Safety Tether wire -->
  <path d="M 110 85 C 130 65, 140 120, 165 95" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="3,3" fill="none"/>
  <!-- Astronaut in Spacesuit floating -->
  <g transform="translate(185, 80) rotate(-15)">
    <!-- Backpack Life Support -->
    <rect x="-24" y="-18" width="14" height="36" rx="4" fill="#94a3b8"/>
    <!-- Torso Suit -->
    <ellipse cx="0" cy="0" rx="18" ry="22" fill="#f8fafc"/>
    <rect x="-8" y="-10" width="16" height="12" fill="#3b82f6"/>
    <!-- Helmet & Gold Reflective Visor -->
    <circle cx="0" cy="-24" r="16" fill="#f8fafc"/>
    <ellipse cx="2" cy="-24" rx="11" ry="8" fill="#f59e0b"/>
    <ellipse cx="0" cy="-25" rx="7" ry="4" fill="#fef08a" opacity="0.8"/>
    <!-- Arm holding tool near solar panel -->
    <path d="M -12 -5 L -32 0 L -45 -10" stroke="#f8fafc" stroke-width="8" stroke-linecap="round" fill="none"/>
    <!-- Tool sparkle -->
    <polygon points="-48,-15 -42,-12 -45,-8" fill="#38bdf8"/>
    <!-- Free floating legs -->
    <path d="M -8 18 L -15 42" stroke="#f8fafc" stroke-width="9" stroke-linecap="round"/>
    <path d="M 8 18 L 14 38" stroke="#f8fafc" stroke-width="9" stroke-linecap="round"/>
  </g>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Repairing solar panels while floating in space</text>
</svg>'
    ],
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'The patient painter dips her fine brush into vibrant watercolor paints, creating a breathtaking sunset over snowy mountain peaks.',
        'question' => 'What action is the patient painter doing with her fine brush?',
        'options' => ['Painting a breathtaking mountain sunset', 'Writing a letter with blue ink', 'Sweeping the dusty studio floor'],
        'correct' => 'Painting a breathtaking mountain sunset',
        'explanation' => 'The artist holds a palette, dips her paintbrush into watercolors, and paints the canvas.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h4" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fff1f2"/><stop offset="100%" stop-color="#ffe4e6"/></linearGradient>
    <linearGradient id="canvas_sunset" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#f43f5e"/><stop offset="40%" stop-color="#fb923c"/><stop offset="70%" stop-color="#fde047"/><stop offset="100%" stop-color="#1e293b"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h4)"/>
  <!-- Wooden Easel on Left -->
  <line x1="80" y1="30" x2="40" y2="190" stroke="#a16207" stroke-width="7" stroke-linecap="round"/>
  <line x1="120" y1="30" x2="160" y2="190" stroke="#a16207" stroke-width="7" stroke-linecap="round"/>
  <line x1="100" y1="25" x2="100" y2="190" stroke="#78350f" stroke-width="6"/>
  <!-- Canvas board on easel -->
  <rect x="45" y="45" width="110" height="85" fill="url(#canvas_sunset)" rx="4" stroke="#ffffff" stroke-width="3"/>
  <!-- Snowy Mountain Peaks painted on canvas -->
  <polygon points="50,115 80,75 105,115" fill="#334155"/>
  <polygon points="80,75 88,88 80,90 73,88" fill="#ffffff"/>
  <polygon points="90,115 125,70 150,115" fill="#1e293b"/>
  <polygon points="125,70 133,83 125,86 118,83" fill="#ffffff"/>
  <!-- Painter Character on Right -->
  <path d="M 230 200 L 215 130 Q 255 120 270 200 Z" fill="#4f46e5"/>
  <!-- Head with French Beret -->
  <circle cx="235" cy="85" r="22" fill="#fed7aa"/>
  <!-- Beret -->
  <ellipse cx="232" cy="70" rx="20" ry="8" fill="#be123c"/>
  <circle cx="232" cy="62" r="2" fill="#be123c"/>
  <!-- Face looking at canvas -->
  <circle cx="225" cy="84" r="2.5" fill="#0f172a"/>
  <path d="M 220 92 Q 225 96 230 92" stroke="#e11d48" stroke-width="1.5" fill="none"/>
  <!-- Left Hand holding Artist Palette -->
  <ellipse cx="195" cy="145" rx="22" ry="14" fill="#d97706"/>
  <circle cx="205" cy="148" r="4" fill="#fed7aa"/>
  <!-- Colorful paint wells on palette -->
  <circle cx="185" cy="140" r="3.5" fill="#ef4444"/>
  <circle cx="195" cy="138" r="3.5" fill="#eab308"/>
  <circle cx="205" cy="140" r="3.5" fill="#3b82f6"/>
  <circle cx="188" cy="148" r="3.5" fill="#22c55e"/>
  <!-- Right Arm with Brush touching canvas -->
  <path d="M 220 115 L 175 100" stroke="#fed7aa" stroke-width="7" stroke-linecap="round"/>
  <line x1="175" y1="100" x2="148" y2="92" stroke="#78350f" stroke-width="3" stroke-linecap="round"/>
  <polygon points="148,92 142,90 146,94" fill="#ef4444"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#881337">ACTION: Dipping fine brush and painting a mountain sunset</text>
</svg>'
    ],
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'A graceful dolphin leaps high out of the sparkling ocean waves, doing an elegant spin before diving back into the deep blue water.',
        'question' => 'What dynamic action does the graceful dolphin perform?',
        'options' => ['Leaps high out of the water and spins', 'Builds a nest in the tall trees', 'Runs swiftly across a sandy desert'],
        'correct' => 'Leaps high out of the water and spins',
        'explanation' => 'The dolphin leaps high into the air, spins in an arch, and dives back into ocean waves.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h5" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#bae6fd"/><stop offset="50%" stop-color="#0284c7"/><stop offset="100%" stop-color="#0c4a6e"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h5)"/>
  <!-- Afternoon Sun rays -->
  <circle cx="310" cy="40" r="24" fill="#fef08a" opacity="0.9"/>
  <!-- Sea Gulls in background -->
  <path d="M 50 40 Q 60 30 70 40 Q 80 30 90 40" stroke="#64748b" stroke-width="2" fill="none"/>
  <!-- Crashing Ocean Waves with Foam -->
  <path d="M 0 140 Q 40 120 80 140 Q 120 125 160 145 Q 200 125 240 145 Q 280 120 320 145 Q 340 135 360 140 L 360 220 L 0 220 Z" fill="#0369a1"/>
  <!-- Wave crest whitecaps -->
  <path d="M 120 145 Q 140 130 160 140" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
  <path d="M 230 145 Q 250 130 270 140" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none"/>
  <!-- Splash droplets at entry & exit points -->
  <circle cx="120" cy="135" r="4" fill="#e0f2fe"/>
  <circle cx="130" cy="125" r="3" fill="#ffffff"/>
  <circle cx="250" cy="135" r="4" fill="#e0f2fe"/>
  <circle cx="260" cy="128" r="3" fill="#ffffff"/>
  <!-- Dolphin soaring high in arched leap -->
  <g transform="translate(180, 80)">
    <!-- Sleek curved body -->
    <path d="M -60 35 C -40 -30, 20 -40, 60 10 C 30 5, -10 -5, -45 40 Z" fill="#475569"/>
    <!-- White Dolphin Belly -->
    <path d="M -40 30 C -20 -10, 15 -15, 45 10 C 25 2, -5 2, -30 32 Z" fill="#f1f5f9"/>
    <!-- Dolphin Snout & Beak -->
    <path d="M 60 10 Q 75 14 62 18 Z" fill="#475569"/>
    <!-- Eye & happy line -->
    <circle cx="48" cy="8" r="2.5" fill="#0f172a"/>
    <path d="M 52 14 Q 58 16 62 14" stroke="#0f172a" stroke-width="1.5" fill="none"/>
    <!-- Dorsal Fin on top -->
    <path d="M 0 -22 C -4 -42, 12 -38, 14 -18 Z" fill="#334155"/>
    <!-- Flipper -->
    <path d="M 10 0 C 15 18, 28 20, 24 5 Z" fill="#334155"/>
    <!-- Tail Flukes -->
    <polygon points="-58,35 -72,25 -66,38 -74,48" fill="#334155"/>
  </g>
  <!-- Spin sparkle -->
  <text x="180" y="45" font-size="16">✨</text>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Leaping high and spinning out of the waves</text>
</svg>'
    ],
    [
        'difficulty' => 3,
        'level_name' => 'Hard',
        'sentence' => 'The gentle gardener kneels on a soft cushion to plant fragile flower seedlings, watering each tender green sprout with care.',
        'question' => 'What is the gentle gardener doing in the flowerbed?',
        'options' => ['Planting and watering tender green sprouts', 'Digging a swimming pool for ducks', 'Raking dry leaves into a large pile'],
        'correct' => 'Planting and watering tender green sprouts',
        'explanation' => 'The gardener presses seedlings into rich soil and waters them with a green watering can.',
        'svg' => '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 360 220" width="100%" height="100%">
  <defs>
    <linearGradient id="bg_h6" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#fef9c3"/><stop offset="100%" stop-color="#bbf7d0"/></linearGradient>
  </defs>
  <rect width="360" height="220" fill="url(#bg_h6)"/>
  <!-- Garden Wooden Paling Fence -->
  <line x1="0" y1="90" x2="360" y2="90" stroke="#ca8a04" stroke-width="4"/>
  <rect x="30" y="60" width="12" height="60" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <rect x="70" y="60" width="12" height="60" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <rect x="110" y="60" width="12" height="60" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <rect x="270" y="60" width="12" height="60" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <rect x="310" y="60" width="12" height="60" fill="#fef08a" stroke="#ca8a04" stroke-width="1.5"/>
  <!-- Dark Rich Garden Soil Bed -->
  <rect x="0" y="145" width="360" height="75" fill="#451a03"/>
  <!-- Small Green Sprouts planted in a row -->
  <!-- Sprout 1 -->
  <path d="M 60 150 Q 55 135 60 128" stroke="#16a34a" stroke-width="3" fill="none"/>
  <ellipse cx="55" cy="130" rx="6" ry="3" fill="#22c55e" transform="rotate(-30 55 130)"/>
  <ellipse cx="65" cy="128" rx="6" ry="3" fill="#4ade80" transform="rotate(30 65 128)"/>
  <!-- Sprout 2 -->
  <path d="M 100 150 Q 95 135 100 128" stroke="#16a34a" stroke-width="3" fill="none"/>
  <ellipse cx="95" cy="130" rx="6" ry="3" fill="#22c55e" transform="rotate(-30 95 130)"/>
  <ellipse cx="105" cy="128" rx="6" ry="3" fill="#4ade80" transform="rotate(30 105 128)"/>
  <!-- Sprout 3 being watered -->
  <path d="M 140 150 Q 135 135 140 128" stroke="#16a34a" stroke-width="3" fill="none"/>
  <ellipse cx="135" cy="130" rx="6" ry="3" fill="#22c55e" transform="rotate(-30 135 130)"/>
  <ellipse cx="145" cy="128" rx="6" ry="3" fill="#4ade80" transform="rotate(30 145 128)"/>
  <!-- Kneeling Gardener on Right -->
  <!-- Kneeling Cushion -->
  <ellipse cx="230" cy="180" rx="35" ry="12" fill="#0284c7"/>
  <!-- Gardener Legs & Overalls -->
  <path d="M 215 180 L 220 135 Q 260 130 250 180 Z" fill="#0369a1"/>
  <!-- Head with Straw Sunhat -->
  <circle cx="215" cy="95" r="18" fill="#fed7aa"/>
  <ellipse cx="215" cy="85" rx="28" ry="8" fill="#facc15" stroke="#ca8a04" stroke-width="2"/>
  <circle cx="215" cy="80" r="12" fill="#ca8a04"/>
  <!-- Face looking down lovingly -->
  <circle cx="208" cy="94" r="2" fill="#0f172a"/>
  <path d="M 206 100 Q 210 104 214 100" stroke="#be123c" stroke-width="1.5" fill="none"/>
  <!-- Hands holding Green Watering Can -->
  <line x1="220" y1="120" x2="185" y2="120" stroke="#fed7aa" stroke-width="6" stroke-linecap="round"/>
  <!-- Watering Can -->
  <polygon points="175,110 190,110 186,135 170,135" fill="#15803d"/>
  <line x1="170" y1="125" x2="152" y2="116" stroke="#15803d" stroke-width="4" stroke-linecap="round"/>
  <!-- Rose sprinkler & water droplets pouring on sprout 3 -->
  <line x1="150" y1="118" x2="140" y2="128" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,3"/>
  <line x1="152" y1="120" x2="144" y2="132" stroke="#38bdf8" stroke-width="2" stroke-dasharray="2,3"/>
  <text x="180" y="210" text-anchor="middle" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">ACTION: Planting and watering green seedlings with care</text>
</svg>'
    ],
];

// Clean existing exercises for this skill and re-insert
DB::table('exercises')->where('skill_id', $skillId)->delete();

foreach ($items as $idx => $item) {
    $exId = sprintf('00000000-0000-0000-0000-%012d', 2001 + $idx);
    $dataUri = svgDataUri($item['svg']);

    DB::table('exercises')->insert([
        'id' => $exId,
        'skill_id' => $skillId,
        'question' => $item['sentence'],
        'question_type' => 'MCQ',
        'template' => 'story_card',
        'difficulty' => $item['difficulty'],
        'options' => json_encode($item['options'], JSON_UNESCAPED_UNICODE),
        'correct_answer' => $item['correct'],
        'explanation' => $item['explanation'],
        'image_url' => $dataUri,
        'image_question' => $item['question'],
        'created_at' => now(),
        'updated_at' => now(),
    ]);

    echo "Inserted [{$item['level_name']}] {$item['sentence']}\n";
}

echo "Successfully seeded " . count($items) . " action reading sentences!\n";
