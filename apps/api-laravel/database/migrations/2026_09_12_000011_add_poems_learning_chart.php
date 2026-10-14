<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $now = now();

        $poemsData = [
            [
                'id' => 'see_me_skip',
                'key' => 'poem_see_me_skip',
                'title' => 'See Me Skip',
                'marathiTitle' => 'पहा मी उड्या मारते (See Me Skip)',
                'category' => 'school',
                'icon' => '🎒',
                'image' => '/assets/charts/poem_see_me_skip.png',
                'color' => '#e11d48',
                'headerBg' => 'linear-gradient(135deg, #e11d48 0%, #be123c 100%)',
                'bgGradient' => 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)',
                'badge' => '⭐ Priority • Balbharti Grade 1',
                'author' => 'Balbharti English Grade 1 • Unit 1',
                'description' => 'A joyful, rhythmic poem celebrating skipping, running, smiling, and stepping enthusiastically into First Grade!',
                'marathiDescription' => 'शाळेत जाताना उड्या मारणे, धावणे, हसणे आणि पहिलीच्या वर्गात आनंदाने प्रवेश करण्याचे सुंदर बालगीत!',
                'funFact' => 'Skipping rope builds brain rhythm, heart fitness, and coordination between both feet and eyes!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'See me skip,', 'marathi' => 'मला दोरी उड्या मारताना पहा,', 'rhymeWord' => 'skip', 'actionIcon' => '🏃‍♀️'],
                            ['text' => 'See me run,', 'marathi' => 'मला आनंदाने पळताना पहा,', 'rhymeWord' => 'run', 'actionIcon' => '👟'],
                            ['text' => "I'm going to school like everyone.", 'marathi' => 'मी प्रत्येकाप्रमाणे शाळेत जात आहे.', 'rhymeWord' => 'everyone', 'actionIcon' => '🏫'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 2,
                        'lines' => [
                            ['text' => 'See me smile,', 'marathi' => 'माझे गोड हसू पहा,', 'rhymeWord' => 'smile', 'actionIcon' => '😊'],
                            ['text' => 'See me grin,', 'marathi' => 'माझे आनंदी हास्य पहा,', 'rhymeWord' => 'grin', 'actionIcon' => '😁'],
                            ['text' => 'When the bell rings, I walk in.', 'marathi' => 'जेव्हा शाळेची घंटा वाजते, मी आत जातो.', 'rhymeWord' => 'in', 'actionIcon' => '🔔'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 3,
                        'lines' => [
                            ['text' => 'See me learn,', 'marathi' => 'मला नवीन गोष्टी शिकताना पहा,', 'rhymeWord' => 'learn', 'actionIcon' => '📚'],
                            ['text' => 'See me play,', 'marathi' => 'मला मित्रांसोबत खेळताना पहा,', 'rhymeWord' => 'play', 'actionIcon' => '⚽'],
                            ['text' => "I'm in First Grade! Hip, hip, hooray!", 'marathi' => 'मी पहिलीच्या वर्गात आहे! हिप, हिप, हुर्रे!', 'rhymeWord' => 'hooray', 'actionIcon' => '🎉'],
                        ],
                    ],
                ],
                'rhymingPairs' => [
                    ['pair' => ['run', 'everyone'], 'sound' => '/ʌn/', 'marathiTip' => "'run' आणि 'everyone' मध्ये 'अन' असा सारखा नाद आहे."],
                    ['pair' => ['grin', 'in'], 'sound' => '/ɪn/', 'marathiTip' => "'grin' आणि 'in' मध्ये 'इन' असा यमक आहे."],
                    ['pair' => ['play', 'hooray'], 'sound' => '/eɪ/', 'marathiTip' => "'play' आणि 'hooray' शेवटी 'ए' आवाजाने यमक जुळवतात."],
                    ['pair' => ['skip', 'trip', 'flip'], 'sound' => '/ɪp/', 'marathiTip' => "'skip' चा rhyming family -ip शब्दसमूह."],
                ],
                'vocabulary' => [
                    ['word' => 'Skip', 'icon' => '🏃‍♀️', 'marathi' => 'उड्या मारणे', 'meaning' => 'Jump lightly stepping from one foot to the other'],
                    ['word' => 'Run', 'icon' => '👟', 'marathi' => 'पळणे / धावणे', 'meaning' => 'Move fast on your feet'],
                    ['word' => 'School', 'icon' => '🏫', 'marathi' => 'शाळा', 'meaning' => 'A joyful place where we learn and make friends'],
                    ['word' => 'Smile', 'icon' => '😊', 'marathi' => 'हसणे', 'meaning' => 'A cheerful expression on the face'],
                    ['word' => 'Grin', 'icon' => '😁', 'marathi' => 'मोठे आनंदी हसू', 'meaning' => 'A wide, enthusiastic smile showing teeth'],
                    ['word' => 'Bell', 'icon' => '🔔', 'marathi' => 'घंटा', 'meaning' => 'A musical chime that signals school time'],
                    ['word' => 'First Grade', 'icon' => '🎒', 'marathi' => 'पहिली इयत्ता', 'meaning' => 'Your wonderful class in primary school'],
                    ['word' => 'Hooray', 'icon' => '🎉', 'marathi' => 'हुर्रे! (आनंदाची घोषणा)', 'meaning' => 'A happy cheer shouted when excited'],
                ],
            ],
            [
                'id' => 'weather',
                'key' => 'poem_weather',
                'title' => 'Weather',
                'marathiTitle' => 'हवामान आणि आजचा दिवस (Weather)',
                'category' => 'nature',
                'icon' => '🌦️',
                'image' => '/assets/charts/poem_weather.png',
                'color' => '#0284c7',
                'headerBg' => 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                'bgGradient' => 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                'badge' => '🌦️ Nature & Weather Rhyme',
                'author' => 'Primary English Curriculum • Grade 1',
                'description' => 'A lively interactive weather rhyme asking how the weather changes from sunny, rainy, to breezy as we enjoy school!',
                'marathiDescription' => 'ऊन, पाऊस, ढग आणि वाऱ्यासह आजचे हवामान कसे आहे हे विचारणारे आनंददायी बालगीत!',
                'funFact' => 'Clouds are actually made of billions of tiny floating water droplets and ice crystals in the sky!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'How is the weather and how is the day?', 'marathi' => 'हवामान कसे आहे आणि आजचा दिवस कसा आहे?', 'rhymeWord' => 'day', 'actionIcon' => '⛅'],
                            ['text' => 'Is it sunny and bright so we can play?', 'marathi' => 'सूर्य चमकत आहे का जेणेकरून आपण खेळू शकू?', 'rhymeWord' => 'play', 'actionIcon' => '☀️'],
                            ['text' => 'Look at the sky, so blue and clear,', 'marathi' => 'आकाशाकडे पहा, किती निळे आणि स्वच्छ आहे,', 'rhymeWord' => 'clear', 'actionIcon' => '🌤️'],
                            ['text' => 'Sunshine brings joy and happy cheer!', 'marathi' => 'सूर्यप्रकाश आनंद आणि उत्साह घेऊन येतो!', 'rhymeWord' => 'cheer', 'actionIcon' => '😊'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 2,
                        'lines' => [
                            ['text' => 'How is the weather and how is the day?', 'marathi' => 'हवामान कसे आहे आणि आजचा दिवस कसा आहे?', 'rhymeWord' => 'day', 'actionIcon' => '🌧️'],
                            ['text' => 'Is it rainy and wet along the way?', 'marathi' => 'रस्त्यावर पाऊस आणि पाणी आहे का?', 'rhymeWord' => 'way', 'actionIcon' => '☔'],
                            ['text' => 'Pitter-patter drops fall from the cloud,', 'marathi' => 'ढगांतून टपटप पाण्याचे थेंब पडतात,', 'rhymeWord' => 'cloud', 'actionIcon' => '💧'],
                            ['text' => 'Singing their rainy song out loud!', 'marathi' => 'आणि पावसाचे गाणे आनंदाने गातात!', 'rhymeWord' => 'loud', 'actionIcon' => '🎶'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 3,
                        'lines' => [
                            ['text' => 'How is the weather and how is the day?', 'marathi' => 'हवामान कसे आहे आणि आजचा दिवस कसा आहे?', 'rhymeWord' => 'day', 'actionIcon' => '🍃'],
                            ['text' => 'Is it cool and breezy, blowing away?', 'marathi' => 'थंडगार वारा वाहत आहे का?', 'rhymeWord' => 'away', 'actionIcon' => '💨'],
                            ['text' => 'Whatever the weather, warm or cool,', 'marathi' => 'हवामान कसेही असो, ऊन असो वा गारवा,', 'rhymeWord' => 'cool', 'actionIcon' => '🧣'],
                            ['text' => "We're always excited to go to school!", 'marathi' => 'आम्ही शाळेत जायला नेहमी आनंदाने तयार आहोत!', 'rhymeWord' => 'school', 'actionIcon' => '🎒'],
                        ],
                    ],
                ],
                'rhymingPairs' => [
                    ['pair' => ['day', 'play', 'way', 'away'], 'sound' => '/eɪ/', 'marathiTip' => "-ay फॅमिली: day, play, way, away मध्ये 'ए' यमक आहे."],
                    ['pair' => ['clear', 'cheer'], 'sound' => '/ɪər/', 'marathiTip' => "clear आणि cheer मध्ये 'इयर' यमक आहे."],
                    ['pair' => ['cloud', 'loud'], 'sound' => '/aʊd/', 'marathiTip' => '-oud फॅमिली: cloud, loud, proud.'],
                    ['pair' => ['cool', 'school'], 'sound' => '/uːl/', 'marathiTip' => '-ool फॅमिली: cool, school, pool.'],
                ],
                'vocabulary' => [
                    ['word' => 'Weather', 'icon' => '🌦️', 'marathi' => 'हवामान', 'meaning' => 'Condition of the atmosphere like sunshine, rain, or wind'],
                    ['word' => 'Sunny', 'icon' => '☀️', 'marathi' => 'सूर्यप्रकाशित', 'meaning' => 'Bright and full of warm sunshine'],
                    ['word' => 'Rainy', 'icon' => '🌧️', 'marathi' => 'पावसाळी', 'meaning' => 'Wet with raindrops falling from clouds'],
                    ['word' => 'Breezy', 'icon' => '🍃', 'marathi' => 'मंद वारा', 'meaning' => 'Pleasantly windy and cool'],
                    ['word' => 'Pitter-patter', 'icon' => '💧', 'marathi' => 'टपटप आवाज', 'meaning' => 'The light tapping sound of raindrops'],
                    ['word' => 'Cheer', 'icon' => '😊', 'marathi' => 'उत्साह / आनंद', 'meaning' => 'A joyful and happy feeling'],
                ],
            ],
            [
                'id' => 'my_flower',
                'key' => 'poem_my_flower',
                'title' => 'My Flower',
                'marathiTitle' => 'माझे सुंदर फूल (My Flower)',
                'category' => 'nature',
                'icon' => '🌸',
                'image' => '/assets/charts/poem_my_flower.png',
                'color' => '#db2777',
                'headerBg' => 'linear-gradient(135deg, #db2777 0%, #be185d 100%)',
                'bgGradient' => 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                'badge' => '🌱 Plant Growth & Nature Rhyme',
                'author' => "Classic Children's Nature Rhyme",
                'description' => 'A sweet rhyme following the magical journey of a tiny seed planted in the soil, watered with love, blooming into a happy flower!',
                'marathiDescription' => 'मातीत लावलेले लहान बी, सूर्यप्रकाश आणि पाण्याने वाढून सुंदर फूल कसे उमलते याचे गोड बालगीत!',
                'funFact' => 'Sunflowers follow the sun across the sky every day from east to west—this is called heliotropism!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'I had a little seed,', 'marathi' => 'माझ्याकडे एक लहान बी होते,', 'rhymeWord' => 'seed', 'actionIcon' => '🌱'],
                            ['text' => 'I planted it in the ground.', 'marathi' => 'मी ते मातीमध्ये खोल लावले.', 'rhymeWord' => 'ground', 'actionIcon' => '🪴'],
                            ['text' => 'I gave it some water,', 'marathi' => 'मी त्याला थोडे पाणी दिले,', 'rhymeWord' => 'water', 'actionIcon' => '💧'],
                            ['text' => 'And soft soil all around.', 'marathi' => 'आणि आजूबाजूला मऊ माती ठेवली.', 'rhymeWord' => 'around', 'actionIcon' => '🟤'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 2,
                        'lines' => [
                            ['text' => 'Out came the yellow sun,', 'marathi' => 'पिवळाधमक सूर्य वर आला,', 'rhymeWord' => 'sun', 'actionIcon' => '☀️'],
                            ['text' => 'So warm and bright and round.', 'marathi' => 'किती उबदार, तेजस्वी आणि गोल!', 'rhymeWord' => 'round', 'actionIcon' => '🟡'],
                            ['text' => 'Down came the gentle rain,', 'marathi' => 'हलकासा गोड पाऊस खाली आला,', 'rhymeWord' => 'rain', 'actionIcon' => '🌧️'],
                            ['text' => 'Without a single sound.', 'marathi' => 'अगदी शांतपणे जमिनीवर!', 'rhymeWord' => 'sound', 'actionIcon' => '🤫'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 3,
                        'lines' => [
                            ['text' => 'Up grew a tiny shoot,', 'marathi' => 'मातीतून एक लहान हिरवा कोंब वर आला,', 'rhymeWord' => 'shoot', 'actionIcon' => '🌿'],
                            ['text' => 'Reaching for the light!', 'marathi' => 'प्रकाशाकडे हात पसरत!', 'rhymeWord' => 'light', 'actionIcon' => '🌤️'],
                            ['text' => 'Now open is my flower,', 'marathi' => 'आता माझे सुंदर फूल उमलले आहे,', 'rhymeWord' => 'flower', 'actionIcon' => '🌸'],
                            ['text' => 'So colorful and bright!', 'marathi' => 'किती रंगीबेरंगी आणि चमकदार!', 'rhymeWord' => 'bright', 'actionIcon' => '✨'],
                        ],
                    ],
                ],
                'rhymingPairs' => [
                    ['pair' => ['ground', 'around', 'round', 'sound'], 'sound' => '/aʊnd/', 'marathiTip' => '-ound फॅमिली: ground, around, round, sound.'],
                    ['pair' => ['light', 'bright'], 'sound' => '/aɪt/', 'marathiTip' => '-ight फॅमिली: light, bright, sight, night.'],
                    ['pair' => ['seed', 'need'], 'sound' => '/iːd/', 'marathiTip' => '-eed फॅमिली: seed, need, feed, weed.'],
                ],
                'vocabulary' => [
                    ['word' => 'Seed', 'icon' => '🌱', 'marathi' => 'बी / बियाणे', 'meaning' => 'A tiny grain from which a new plant grows'],
                    ['word' => 'Ground', 'icon' => '🪴', 'marathi' => 'जमीन / माती', 'meaning' => 'The earth and soil where plants grow roots'],
                    ['word' => 'Shoot', 'icon' => '🌿', 'marathi' => 'कोंब', 'meaning' => 'The first young green stem rising above ground'],
                    ['word' => 'Bloom', 'icon' => '🌸', 'marathi' => 'उमलणे', 'meaning' => 'When the flower petals open up beautifully'],
                    ['word' => 'Gentle', 'icon' => '💧', 'marathi' => 'हळुवार / मऊ', 'meaning' => 'Soft, mild, and calm'],
                    ['word' => 'Bright', 'icon' => '✨', 'marathi' => 'तेजस्वी / चमकदार', 'meaning' => 'Full of vivid light and radiant colors'],
                ],
            ],
            [
                'id' => 'things_i_do',
                'key' => 'poem_things_i_do',
                'title' => 'Things I Do',
                'marathiTitle' => 'मी करणारी कामे (Things I Do)',
                'category' => 'school',
                'icon' => '👞',
                'image' => '/assets/charts/poem_things_i_do.png',
                'color' => '#059669',
                'headerBg' => 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                'bgGradient' => 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                'badge' => '🔢 Counting & Action Rhyme',
                'author' => 'Primary English Curriculum • Class 1',
                'description' => 'A cheerful counting and action rhyme from 1 to 10 that turns everyday helpful chores into an engaging, rhythmic musical game!',
                'marathiDescription' => '१ ते १० पर्यंत मोजत बूट पॉलिश करणे, काठ्या उचलणे, गेट उघडणे आणि पेनने लिहिण्याचे मजेशीर कृतीगीत!',
                'funFact' => 'Connecting numbers with physical actions is one of the fastest ways for young children to build memory and coordination!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'One and two,', 'marathi' => 'एक आणि दोन,', 'rhymeWord' => 'two', 'actionIcon' => '1️⃣'],
                            ['text' => 'Polish my shoe.', 'marathi' => 'माझ्या बुटांना पॉलिश करा.', 'rhymeWord' => 'shoe', 'actionIcon' => '👞'],
                            ['text' => 'Three and four,', 'marathi' => 'तीन आणि चार,', 'rhymeWord' => 'four', 'actionIcon' => '3️⃣'],
                            ['text' => 'Wipe the floor.', 'marathi' => 'जमिनीची फरशी पुसा.', 'rhymeWord' => 'floor', 'actionIcon' => '🧹'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 2,
                        'lines' => [
                            ['text' => 'Five and six,', 'marathi' => 'पाच आणि सहा,', 'rhymeWord' => 'six', 'actionIcon' => '5️⃣'],
                            ['text' => 'Pick up sticks.', 'marathi' => 'बागेतील लाकडी काठ्या उचला.', 'rhymeWord' => 'sticks', 'actionIcon' => '🪵'],
                            ['text' => 'Seven and eight,', 'marathi' => 'सात आणि आठ,', 'rhymeWord' => 'eight', 'actionIcon' => '7️⃣'],
                            ['text' => 'Open the gate.', 'marathi' => 'घराचे सुंदर गेट उघडा.', 'rhymeWord' => 'gate', 'actionIcon' => '🚪'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 3,
                        'lines' => [
                            ['text' => 'Nine and ten,', 'marathi' => 'नऊ आणि दहा,', 'rhymeWord' => 'ten', 'actionIcon' => '9️⃣'],
                            ['text' => 'Write with a pen!', 'marathi' => 'पेनने छान अभ्यास लिहा!', 'rhymeWord' => 'pen', 'actionIcon' => '✍️'],
                            ['text' => 'All done now,', 'marathi' => 'सर्व कामे पूर्ण झाली,', 'rhymeWord' => 'now', 'actionIcon' => '🎉'],
                            ['text' => "Let's count again!", 'marathi' => 'चला, पुन्हा एकदा मोजूया!', 'rhymeWord' => 'again', 'actionIcon' => '🔢'],
                        ],
                    ],
                ],
                'rhymingPairs' => [
                    ['pair' => ['two', 'shoe'], 'sound' => '/uː/', 'marathiTip' => "'two' आणि 'shoe' मध्ये 'ऊ' यमक आहे."],
                    ['pair' => ['four', 'floor'], 'sound' => '/ɔːr/', 'marathiTip' => "'four' आणि 'floor' मध्ये 'ओर' यमक आहे."],
                    ['pair' => ['six', 'sticks'], 'sound' => '/ɪks/', 'marathiTip' => "'six' आणि 'sticks' मध्ये 'इक्स' यमक आहे."],
                    ['pair' => ['eight', 'gate'], 'sound' => '/eɪt/', 'marathiTip' => '-ate फॅमिली: eight, gate, late, date.'],
                    ['pair' => ['ten', 'pen'], 'sound' => '/ɛn/', 'marathiTip' => '-en फॅमिली: ten, pen, hen, men.'],
                ],
                'vocabulary' => [
                    ['word' => 'Polish', 'icon' => '👞', 'marathi' => 'पॉलिश करणे', 'meaning' => 'Make shoes clean, shiny, and neat with a brush'],
                    ['word' => 'Shoe', 'icon' => '👟', 'marathi' => 'बूट', 'meaning' => 'Comfortable footwear worn on the feet'],
                    ['word' => 'Floor', 'icon' => '🧹', 'marathi' => 'फरशी / जमीन', 'meaning' => 'The flat surface we walk on indoors'],
                    ['word' => 'Sticks', 'icon' => '🪵', 'marathi' => 'काठ्या', 'meaning' => 'Small wooden branches from trees or garden'],
                    ['word' => 'Gate', 'icon' => '🚪', 'marathi' => 'गेट / फाटक', 'meaning' => 'A hinged barrier used to close an entrance'],
                    ['word' => 'Pen', 'icon' => '✍️', 'marathi' => 'पेन / लेखणी', 'meaning' => 'A tool used for writing neatly with ink'],
                ],
            ],
            [
                'id' => 'twinkle_star',
                'key' => 'poem_twinkle_star',
                'title' => 'Twinkle, Twinkle, Little Star',
                'marathiTitle' => 'चमक चमक छोट्या ताऱ्या (Twinkle Star)',
                'category' => 'classic',
                'icon' => '⭐',
                'color' => '#8b5cf6',
                'headerBg' => 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                'bgGradient' => 'linear-gradient(135deg, #f5f3ff 0%, #ede9fe 100%)',
                'badge' => 'Classic Wonder Rhyme',
                'author' => 'Jane Taylor (1806)',
                'description' => "The world's most beloved bedtime lullaby and poem of celestial curiosity.",
                'marathiDescription' => 'रात्रीच्या आकाशातील चमकणाऱ्या ताऱ्यांचे आणि कुतूहलाचे प्रसिद्ध बालगीत.',
                'funFact' => "Stars twinkle because their light passes through ripples in Earth's atmosphere!",
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'Twinkle, twinkle, little star,', 'marathi' => 'चमक चमक छोट्या ताऱ्या,', 'rhymeWord' => 'star', 'actionIcon' => '✨'],
                            ['text' => 'How I wonder what you are!', 'marathi' => 'मला किती नवल वाटते तू कोण आहेस!', 'rhymeWord' => 'are', 'actionIcon' => '🤔'],
                            ['text' => 'Up above the world so high,', 'marathi' => 'या जगाच्या खूप उंच वर,', 'rhymeWord' => 'high', 'actionIcon' => '🌌'],
                            ['text' => 'Like a diamond in the sky.', 'marathi' => 'आकाशात चमकणाऱ्या हिऱ्यासारखा!', 'rhymeWord' => 'sky', 'actionIcon' => '💎'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'rain_rain',
                'key' => 'poem_rain_rain',
                'title' => 'Rain, Rain, Go Away',
                'marathiTitle' => 'पावसा पावसा दूर जा (Rain, Rain)',
                'category' => 'nature',
                'icon' => '🌧️',
                'color' => '#0ea5e9',
                'headerBg' => 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                'bgGradient' => 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
                'badge' => 'Weather & Play Rhyme',
                'author' => 'Traditional English Rhyme',
                'description' => 'A fun rhyme about waiting for the rain to stop so children can run out and play outdoors!',
                'marathiDescription' => 'बाहेर खेळण्यासाठी पाऊस थांबण्याची वाट पाहताना गायले जाणारे बालगीत.',
                'funFact' => 'Raindrops are shaped like round hamburger buns with flat bottoms as they fall!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'Rain, rain, go away,', 'marathi' => 'पावसा, पावसा, निघून जा,', 'rhymeWord' => 'away', 'actionIcon' => '🌧️'],
                            ['text' => 'Come again another day!', 'marathi' => 'दुसऱ्या दिवशी परत ये!', 'rhymeWord' => 'day', 'actionIcon' => '📅'],
                            ['text' => 'Little children want to play,', 'marathi' => 'लहान मुलांना बाहेर खेळायचे आहे,', 'rhymeWord' => 'play', 'actionIcon' => '⚽'],
                            ['text' => 'Rain, rain, go away!', 'marathi' => 'पावसा, पावसा, दूर जा!', 'rhymeWord' => 'away', 'actionIcon' => '🌈'],
                        ],
                    ],
                ],
            ],
            [
                'id' => 'ye_re_ye_re_pavsa',
                'key' => 'poem_ye_re_pavsa',
                'title' => 'ये रे ये रे पावसा (Ye Re Ye Re Pavsa)',
                'marathiTitle' => 'ये रे ये रे पावसा (पारंपरिक मराठी बालगीत)',
                'category' => 'marathi',
                'icon' => '🌧️',
                'color' => '#059669',
                'headerBg' => 'linear-gradient(135deg, #059669 0%, #047857 100%)',
                'bgGradient' => 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                'badge' => 'लाडकं मराठी बालगीत',
                'author' => 'पारंपरिक मराठी बालगीत (Maharashtra Traditional)',
                'description' => 'महाराष्ट्रातील लहान मुलांचे अत्यंत लोकप्रिय, गोड आणि तालबद्ध पावसाचे बालगीत!',
                'marathiDescription' => 'पावसाला बोलावणारे आणि मातीचे मडके भरण्याचे लहान मुलांचे सर्वात लाडके गाणे!',
                'funFact' => 'हे बालगीत महाराष्ट्रात पिढ्यानपिढ्या लहान मुले पहिल्या पावसाच्या आनंदात गात आली आहेत!',
                'stanzas' => [
                    [
                        'stanzaNumber' => 1,
                        'lines' => [
                            ['text' => 'ये रे ये रे पावसा,', 'marathi' => 'Come, oh come, dear rain,', 'rhymeWord' => 'पावसा', 'actionIcon' => '🌧️'],
                            ['text' => 'तुला देतो पैसा!', 'marathi' => 'I will give you a coin!', 'rhymeWord' => 'पैसा', 'actionIcon' => '🪙'],
                            ['text' => 'पैसा झाला खोटा,', 'marathi' => 'The coin turned out fake,', 'rhymeWord' => 'खोटा', 'actionIcon' => '❌'],
                            ['text' => 'पाऊस आला मोठा!', 'marathi' => 'And down poured a huge shower of rain!', 'rhymeWord' => 'मोठा', 'actionIcon' => '🌊'],
                        ],
                    ],
                    [
                        'stanzaNumber' => 2,
                        'lines' => [
                            ['text' => 'ये ग ये ग सरी,', 'marathi' => 'Come, oh gentle shower drops,', 'rhymeWord' => 'सरी', 'actionIcon' => '💧'],
                            ['text' => 'माझे मडके भरी!', 'marathi' => 'Fill up my little earthen pot!', 'rhymeWord' => 'भरी', 'actionIcon' => '🏺'],
                            ['text' => 'सर आली धावून,', 'marathi' => 'The shower rushed running in,', 'rhymeWord' => 'धावून', 'actionIcon' => '🏃'],
                            ['text' => 'मडके गेले वाहून!', 'marathi' => 'And washed the little pot away!', 'rhymeWord' => 'वाहून', 'actionIcon' => '⛵'],
                        ],
                    ],
                ],
            ],
        ];

        DB::table('learning_charts')->updateOrInsert(
            ['slug' => 'poems'],
            [
                'id' => (string) Str::uuid(),
                'subject' => 'english',
                'title' => 'Poems & Rhymes (कविता आणि बालगीते)',
                'description' => 'Interactive educational poems and rhymes chart featuring See Me Skip, classic nursery rhymes, and Marathi Balgeet with synchronized karaoke line recitation, word meanings, and rhythm practice.',
                'chart_type' => 'poems',
                'chart_data' => json_encode($poemsData, JSON_UNESCAPED_UNICODE),
                'created_at' => $now,
                'updated_at' => $now,
            ]
        );
    }

    public function down(): void
    {
        DB::table('learning_charts')->where('slug', 'poems')->delete();
    }
};
