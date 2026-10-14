// SmartStudy TV — Learning Charts Data
// Self-contained chart items for all 11 chart categories with icons, names,
// translations (Marathi & Hindi), phonics, facts, and audio text for TV speech.

export interface TVChartItem {
  id: string;
  name: string;
  sub?: string;
  icon: string;
  marathi?: string;
  hindi?: string;
  phonic?: string;
  fact?: string;
  audioText?: string;
  color?: string;
}

export interface TVChartCategory {
  slug: string;
  title: string;
  icon: string;
  bg: string;
  description: string;
  type: 'grid' | 'tables';
  items?: TVChartItem[];
}

// 1. Animals
const ANIMALS: TVChartItem[] = [
  { id: 'a-lion', name: 'Lion', marathi: 'सिंह (Sinha)', hindi: 'शेर (Sher)', icon: '🦁', fact: 'King of the Jungle with a majestic mane!', audioText: 'Lion. Sinh. King of the Jungle.', color: '#D97706' },
  { id: 'a-tiger', name: 'Tiger', marathi: 'वाघ (Waagh)', hindi: 'बाघ (Baagh)', icon: '🐅', fact: 'National Animal of India with orange and black stripes!', audioText: 'Tiger. Waagh. National Animal of India.', color: '#EA580C' },
  { id: 'a-elephant', name: 'Elephant', marathi: 'हत्ती (Hatti)', hindi: 'हाथी (Haathi)', icon: '🐘', fact: 'Largest land animal with big ears and a long trunk!', audioText: 'Elephant. Hatti. Has a long trunk.', color: '#475569' },
  { id: 'a-giraffe', name: 'Giraffe', marathi: 'जिराफ (Giraffe)', hindi: 'जिराफ़ (Giraffe)', icon: '🦒', fact: 'Tallest animal on Earth reaching high tree leaves!', audioText: 'Giraffe. Tallest animal on Earth.', color: '#CA8A04' },
  { id: 'a-zebra', name: 'Zebra', marathi: 'झिब्रा (Zebra)', hindi: 'ज़ेबरा (Zebra)', icon: '🦓', fact: 'Famous for unique black and white zebra stripes!', audioText: 'Zebra. Black and white stripes.', color: '#334155' },
  { id: 'a-monkey', name: 'Monkey', marathi: 'माकड (Maakad)', hindi: 'बंदर (Bandar)', icon: '🐒', fact: 'Playful acrobats who love swinging on branches!', audioText: 'Monkey. Maakad. Loves jumping on trees.', color: '#92400E' },
  { id: 'a-bear', name: 'Bear', marathi: 'अस्वल (Aswal)', hindi: 'भालू (Bhalu)', icon: '🐻', fact: 'Big furry friend who loves honey and fishing!', audioText: 'Bear. Aswal. Loves honey.', color: '#78350F' },
  { id: 'a-kangaroo', name: 'Kangaroo', marathi: 'कांगारू (Kangaroo)', hindi: 'कंगारू (Kangaroo)', icon: '🦘', fact: 'Hops high on powerful legs and carries joey in pouch!', audioText: 'Kangaroo. Carries baby in a pouch.', color: '#B45309' },
  { id: 'a-dog', name: 'Dog', marathi: 'कुत्रा (Kutra)', hindi: 'कुत्ता (Kutta)', icon: '🐕', fact: "Human's most loyal best friend! Barks woof woof!", audioText: 'Dog. Kutra. Loyal and playful.', color: '#A16207' },
  { id: 'a-cat', name: 'Cat', marathi: 'मांजर (Manjar)', hindi: 'बिल्ली (Billi)', icon: '🐈', fact: 'Purrs sweetly and has super soft velvet paws!', audioText: 'Cat. Manjar. Purrs and says Meow.', color: '#D97706' },
  { id: 'a-cow', name: 'Cow', marathi: 'गाय (Gaay)', hindi: 'गाय (Gaay)', icon: '🐄', fact: 'Gentle friend who gives us healthy nutritious milk!', audioText: 'Cow. Gaay. Gives us healthy milk.', color: '#475569' },
  { id: 'a-horse', name: 'Horse', marathi: 'घोडा (Ghoda)', hindi: 'घोड़ा (Ghoda)', icon: '🐎', fact: 'Gallops fast across open green fields!', audioText: 'Horse. Ghoda. Gallops fast.', color: '#854D0E' },
  { id: 'a-panda', name: 'Panda', marathi: 'पांडा (Panda)', hindi: 'पांडा (Panda)', icon: '🐼', fact: 'Adorable black and white bear that crunches bamboo!', audioText: 'Panda. Loves crunchy green bamboo.', color: '#1E293B' },
  { id: 'a-rabbit', name: 'Rabbit', marathi: 'ससा (Sasa)', hindi: 'खरगोश (Khargosh)', icon: '🐇', fact: 'Long fluffy ears and loves sweet orange carrots!', audioText: 'Rabbit. Sasa. Hops and loves carrots.', color: '#64748B' },
  { id: 'a-fox', name: 'Fox', marathi: 'कोल्हा (Kolha)', hindi: 'लोमड़ी (Lomdi)', icon: '🦊', fact: 'Clever friend with a bushy fiery-red tail!', audioText: 'Fox. Kolha. Very clever animal.', color: '#C2410C' },
  { id: 'a-dolphin', name: 'Dolphin', marathi: 'डॉल्फिन (Dolphin)', hindi: 'डॉल्फ़िन (Dolphin)', icon: '🐬', fact: 'Super smart marine mammal that leaps and clicks!', audioText: 'Dolphin. Friendly and intelligent swimmer.', color: '#0284C7' },
];

// 2. Vegetables
const VEGETABLES: TVChartItem[] = [
  { id: 'v-tomato', name: 'Tomato', marathi: 'टोमॅटो (Tomato)', hindi: 'टमाटर (Tamatar)', icon: '🍅', fact: 'Juicy red fruit packed with Vitamin C & Lycopene!', audioText: 'Tomato. Juicy and rich in vitamins.', color: '#DC2626' },
  { id: 'v-potato', name: 'Potato', marathi: 'बटाटा (Batata)', hindi: 'आलू (Aalu)', icon: '🥔', fact: 'Most versatile root vegetable! Loved as crispy fries!', audioText: 'Potato. Batata. Versatile root vegetable.', color: '#92400E' },
  { id: 'v-onion', name: 'Onion', marathi: 'कांदा (Kanda)', hindi: 'प्याज (Pyaaz)', icon: '🧅', fact: 'Layers of flavor that make savory dishes tasty!', audioText: 'Onion. Kanda. Essential kitchen ingredient.', color: '#9D174D' },
  { id: 'v-carrot', name: 'Carrot', marathi: 'गाजर (Gaajar)', hindi: 'गाजर (Gaajar)', icon: '🥕', fact: 'Crunchy orange root full of Vitamin A for sharp eyes!', audioText: 'Carrot. Gaajar. Great for healthy eyes.', color: '#EA580C' },
  { id: 'v-broccoli', name: 'Broccoli', marathi: 'ब्रोकोली (Broccoli)', hindi: 'ब्रोकोली (Broccoli)', icon: '🥦', fact: 'Mini green trees packed with vitamins and iron!', audioText: 'Broccoli. Super healthy green vegetable.', color: '#16A34A' },
  { id: 'v-spinach', name: 'Spinach', marathi: 'पालक (Palak)', hindi: 'पालक (Palak)', icon: '🥬', fact: 'Super green leaves full of strength-giving iron!', audioText: 'Spinach. Palak. Makes you strong like Popeye.', color: '#15803D' },
  { id: 'v-peas', name: 'Green Peas', marathi: 'मटार (Mataar)', hindi: 'मटर (Matar)', icon: '🟢', fact: 'Sweet green pearls nestled in a snug pod!', audioText: 'Green Peas. Mataar. Sweet and nutritious.', color: '#22C55E' },
  { id: 'v-brinjal', name: 'Brinjal', marathi: 'वांगे (Vaange)', hindi: 'बैंगन (Baingan)', icon: '🍆', fact: 'Glossy purple vegetable known as Eggplant!', audioText: 'Brinjal. Vaange. Rich purple vegetable.', color: '#7E22CE' },
  { id: 'v-capsicum', name: 'Capsicum', marathi: 'ढोबळी मिरची (Dhobali Mirchi)', hindi: 'शिमला मिर्च (Shimla Mirch)', icon: '🫑', fact: 'Crisp bell peppers in red, green, and yellow!', audioText: 'Capsicum. Dhobali Mirchi. Crisp bell pepper.', color: '#15803D' },
  { id: 'v-cucumber', name: 'Cucumber', marathi: 'काकडी (Kaakdi)', hindi: 'खीरा (Kheera)', icon: '🥒', fact: 'Cool and refreshing with 95% pure hydrating water!', audioText: 'Cucumber. Kaakdi. Cool and refreshing.', color: '#16A34A' },
  { id: 'v-pumpkin', name: 'Pumpkin', marathi: 'भोपळा (Bhopla)', hindi: 'कद्दू (Kaddu)', icon: '🎃', fact: 'Big round orange giant full of vitamins and fiber!', audioText: 'Pumpkin. Bhopla. Big and nutritious.', color: '#D97706' },
  { id: 'v-corn', name: 'Sweet Corn', marathi: 'मका (Maka)', hindi: 'भुट्टा (Bhutta)', icon: '🌽', fact: 'Golden sweet kernels bursting with natural energy!', audioText: 'Sweet Corn. Maka. Delicious golden kernels.', color: '#EAB308' },
];

// 3. Birds
const BIRDS: TVChartItem[] = [
  { id: 'b-peacock', name: 'Peacock', marathi: 'मोर (Mor)', hindi: 'मोर (Mor)', icon: '🦚', fact: 'National Bird of India! Dances gracefully in the rain!', audioText: 'Peacock. Mor. National Bird of India.', color: '#0284C7' },
  { id: 'b-parrot', name: 'Parrot', marathi: 'पोपट (Popat)', hindi: 'तोता (Tota)', icon: '🦜', fact: 'Bright green feathers with a curved red beak!', audioText: 'Parrot. Popat. Bright green and can mimic words.', color: '#16A34A' },
  { id: 'b-sparrow', name: 'Sparrow', marathi: 'चिमणी (Chimni)', hindi: 'गौरैया (Gauraiya)', icon: '🐦', fact: 'Cheerful friendly bird that chirps tweet-tweet!', audioText: 'Sparrow. Chimni. Friendly little chirping bird.', color: '#92400E' },
  { id: 'b-owl', name: 'Owl', marathi: 'घुबड (Ghubad)', hindi: 'उल्लू (Ullu)', icon: '🦉', fact: 'Wise nocturnal bird with big round eyes and night vision!', audioText: 'Owl. Ghubad. Wise night hunter.', color: '#78350F' },
  { id: 'b-eagle', name: 'Eagle', marathi: 'गरुड (Garud)', hindi: 'चील (Cheel)', icon: '🦅', fact: 'Mighty king of the sky with razor-sharp eyesight!', audioText: 'Eagle. Garud. Majestic ruler of the sky.', color: '#854D0E' },
  { id: 'b-pigeon', name: 'Pigeon', marathi: 'कबुतर (Kabutar)', hindi: 'कबूतर (Kabutar)', icon: '🕊️', fact: 'Peaceful bird with incredible homing navigation!', audioText: 'Pigeon. Kabutar. Gentle cooing bird.', color: '#64748B' },
  { id: 'b-duck', name: 'Duck', marathi: 'बदक (Badak)', hindi: 'बत्तख (Battakh)', icon: '🦆', fact: 'Waterproof feathers and webbed feet for swimming!', audioText: 'Duck. Badak. Quack quack in the pond.', color: '#0D9488' },
  { id: 'b-penguin', name: 'Penguin', marathi: 'पेंग्विन (Penguin)', hindi: 'पेंगुइन (Penguin)', icon: '🐧', fact: 'Expert cold-water swimmer in a natural tuxedo!', audioText: 'Penguin. Waddle waddle on the icy snow.', color: '#1E293B' },
  { id: 'b-flamingo', name: 'Flamingo', marathi: 'रोहित पक्षी (Flamingo)', hindi: 'राजहंस (Flamingo)', icon: '🦩', fact: 'Stunning pink feathers and balances on one slender leg!', audioText: 'Flamingo. Elegant pink wading bird.', color: '#DB2777' },
  { id: 'b-kingfisher', name: 'Kingfisher', marathi: 'खंड्या (Khandya)', hindi: 'राम चिरैया (Kingfisher)', icon: '🐤', fact: 'Dazzling blue and orange diving champion for fish!', audioText: 'Kingfisher. Khandya. Swift diving bird.', color: '#0284C7' },
  { id: 'b-swan', name: 'Swan', marathi: 'हंस (Hans)', hindi: 'हंस (Hans)', icon: '🦢', fact: 'Graceful white beauty gliding silently across calm waters!', audioText: 'Swan. Hans. Graceful and pure white.', color: '#475569' },
  { id: 'b-hummingbird', name: 'Hummingbird', marathi: 'गुंजन पक्षी (Hummingbird)', hindi: 'गुंजन पक्षी (Hummingbird)', icon: '🐦‍⬛', fact: 'Tiny gem that beats wings 80 times per second!', audioText: 'Hummingbird. Can hover and fly backwards!', color: '#7C3AED' },
];

// 4. Body Parts
const BODY_PARTS: TVChartItem[] = [
  { id: 'bp-eyes', name: 'Eyes', marathi: 'डोळे (Dole)', hindi: 'आँखें (Aankhen)', icon: '👀', fact: 'Windows to the world that let us see colors & shapes!', audioText: 'Eyes. Dole. We see the world with our eyes.', color: '#2563EB' },
  { id: 'bp-ears', name: 'Ears', marathi: 'कान (Kaan)', hindi: 'कान (Kaan)', icon: '👂', fact: 'Hear sweet music, birds chirping, and words!', audioText: 'Ears. Kaan. We hear sounds and music with our ears.', color: '#D97706' },
  { id: 'bp-nose', name: 'Nose', marathi: 'नाक (Naak)', hindi: 'नाक (Naak)', icon: '👃', fact: 'Smells fresh flowers and helps us breathe fresh air!', audioText: 'Nose. Naak. We smell and breathe with our nose.', color: '#EA580C' },
  { id: 'bp-mouth', name: 'Mouth', marathi: 'तोंड (Tond)', hindi: 'मुँह (Munh)', icon: '👄', fact: 'Helps us talk, smile brightly, and taste delicious food!', audioText: 'Mouth. Tond. We smile and speak with our mouth.', color: '#E11D48' },
  { id: 'bp-teeth', name: 'Teeth', marathi: 'दांत (Daat)', hindi: 'दाँत (Daant)', icon: '🦷', fact: 'Chew nutritious meals! Brush twice every day!', audioText: 'Teeth. Daat. Keep them clean and shining white.', color: '#0284C7' },
  { id: 'bp-tongue', name: 'Tongue', marathi: 'जीभ (Jeebh)', hindi: 'जीभ (Jeebh)', icon: '👅', fact: 'Tastes sweet, sour, salty, and spicy treats!', audioText: 'Tongue. Jeebh. Tastes delicious flavors.', color: '#DB2777' },
  { id: 'bp-hands', name: 'Hands', marathi: 'हात (Haat)', hindi: 'हाथ (Haath)', icon: '🖐️', fact: 'Wave hello, draw pictures, write, and clap happily!', audioText: 'Hands. Haat. We write, clap, and hold with our hands.', color: '#D97706' },
  { id: 'bp-legs', name: 'Legs & Feet', marathi: 'पाय (Paay)', hindi: 'पैर (Pair)', icon: '🦵', fact: 'Carry us everywhere! Run, walk, jump, and dance!', audioText: 'Legs and Feet. Paay. Run, jump, and dance.', color: '#16A34A' },
  { id: 'bp-brain', name: 'Brain', marathi: 'मेंदू (Mendu)', hindi: 'दिमाग (Dimaag)', icon: '🧠', fact: 'The supercomputer inside our head for learning!', audioText: 'Brain. Mendu. The supercomputer of our body.', color: '#7C3AED' },
  { id: 'bp-heart', name: 'Heart', marathi: 'हृदय (Hruday)', hindi: 'दिल (Dil)', icon: '❤️', fact: 'Pumps fresh oxygen-rich blood day and night: lub-dub!', audioText: 'Heart. Hruday. Beats with love and pumps life.', color: '#DC2626' },
  { id: 'bp-hair', name: 'Hair', marathi: 'केस (Kes)', hindi: 'बाल (Baal)', icon: '💇', fact: 'Grows on our head to keep us cozy and protected!', audioText: 'Hair. Kes. Keeps our head cozy.', color: '#475569' },
  { id: 'bp-shoulders', name: 'Shoulders', marathi: 'खांदे (Khande)', hindi: 'कंधे (Kandhe)', icon: '💪', fact: 'Strong joints that help our arms lift and carry bags!', audioText: 'Shoulders. Khande. Connects arms and neck.', color: '#059669' },
];

// 5. Emotions
const EMOTIONS: TVChartItem[] = [
  { id: 'e-happy', name: 'Happy', marathi: 'आनंदी (Aanandi)', hindi: 'खुश (Khush)', icon: '😊', fact: 'A big warm smile that brightens everyone around you!', audioText: 'Happy. Aanandi. Feeling joyful and smiling.', color: '#EAB308' },
  { id: 'e-excited', name: 'Excited', marathi: 'उत्साही (Utsaahi)', hindi: 'उत्साहित (Utsaahit)', icon: '🤩', fact: 'Sparkly eyes and bubbling energy ready for adventure!', audioText: 'Excited. Utsaahi. Ready for a fun adventure!', color: '#F97316' },
  { id: 'e-calm', name: 'Calm & Peaceful', marathi: 'शांत (Shaant)', hindi: 'शांत (Shaant)', icon: '😌', fact: 'Slow deep breaths, feeling relaxed and serene.', audioText: 'Calm. Shaant. Feeling peaceful and relaxed.', color: '#06B6D4' },
  { id: 'e-curious', name: 'Curious', marathi: 'उत्सुक (Utsuk)', hindi: 'जिज्ञासु (Jigyasu)', icon: '🧐', fact: 'Asking big wonder questions to discover how things work!', audioText: 'Curious. Utsuk. Eager to explore and learn.', color: '#8B5CF6' },
  { id: 'e-brave', name: 'Brave & Courageous', marathi: 'शूर / धीट (Shoor)', hindi: 'बहादुर (Bahadur)', icon: '🦁', fact: 'Standing tall and trying your best even when scared!', audioText: 'Brave. Shoor. Courageous and strong.', color: '#D97706' },
  { id: 'e-proud', name: 'Proud', marathi: 'अभिमान (Abhimaan)', hindi: 'गर्व (Garv)', icon: '🌟', fact: 'Celebrating hard work and reaching a new milestone!', audioText: 'Proud. Abhimaan. Great job on your achievements!', color: '#F59E0B' },
  { id: 'e-loving', name: 'Loving & Kind', marathi: 'प्रेमाळू (Premaloo)', hindi: 'दयालु (Dayalu)', icon: '💖', fact: 'Sharing hugs, kind words, and helping friends.', audioText: 'Loving and Kind. Premaloo. Sharing warm hugs.', color: '#EC4899' },
  { id: 'e-silly', name: 'Silly & Playful', marathi: 'मस्तीखोर (Mastikhor)', hindi: 'मस्त (Mast)', icon: '🤪', fact: 'Giggling, making funny faces, and sharing laughs!', audioText: 'Silly and Playful. Mastikhor. Full of laughs and giggles.', color: '#A855F7' },
];

// 6. Marathi Swar
const MARATHI_SWAR: TVChartItem[] = [
  { id: 'ms-a', name: 'अ', sub: 'Ananas (अननस)', phonic: 'A as in America', icon: '🍍', marathi: 'अननस', fact: 'पहिला स्वर — अ अननसाचा', audioText: 'अ. अननस.', color: '#EF4444' },
  { id: 'ms-aa', name: 'आ', sub: 'Aai (आई)', phonic: 'Aa as in Father', icon: '👩‍👧', marathi: 'आई', fact: 'दुसरा स्वर — आ आईचा (काना)', audioText: 'आ. आई.', color: '#F97316' },
  { id: 'ms-i', name: 'इ', sub: 'Imaarat (इमारत)', phonic: 'I as in India', icon: '🏢', marathi: 'इमारत', fact: 'तिसरा स्वर — इ इमारतीचा (पहिली वेलांटी)', audioText: 'इ. इमारत.', color: '#EAB308' },
  { id: 'ms-ee', name: 'ई', sub: 'Eedlimbu (ईडलिंबू)', phonic: 'Ee as in Eagle', icon: '🍋', marathi: 'ईडलिंबू', fact: 'चौथा स्वर — ई ईडलिंबूचा (दुसरी वेलांटी)', audioText: 'ई. ईडलिंबू.', color: '#84CC16' },
  { id: 'ms-u', name: 'उ', sub: 'Ukhad (उखळ)', phonic: 'U as in Bull', icon: '🥣', marathi: 'उखळ', fact: 'पाचवा स्वर — उ उखळाचा (पहिला उकार)', audioText: 'उ. उखळ.', color: '#10B981' },
  { id: 'ms-oo', name: 'ऊ', sub: 'Oos (ऊस)', phonic: 'Oo as in Moon', icon: '🎋', marathi: 'ऊस', fact: 'सहावा स्वर — ऊ ऊसाचा (दुसरा उकार)', audioText: 'ऊ. ऊस.', color: '#06B6D4' },
  { id: 'ms-ru', name: 'ऋ', sub: 'Rushi (ऋषी)', phonic: 'Ru as in Rishi', icon: '🧘', marathi: 'ऋषी', fact: 'ऋ — ऋ ऋषीचा', audioText: 'ऋ. ऋषी.', color: '#3B82F6' },
  { id: 'ms-e', name: 'ए', sub: 'Edka (एडका)', phonic: 'E as in Elephant', icon: '🐑', marathi: 'एडका', fact: 'ए — ए एडक्याचा (एक मात्रा)', audioText: 'ए. एडका.', color: '#6366F1' },
  { id: 'ms-ai', name: 'ऐ', sub: 'Airan (ऐरण)', phonic: 'Ai as in Eye', icon: '⚒️', marathi: 'ऐरण', fact: 'ऐ — ऐ ऐरणीचा (दोन मात्रे)', audioText: 'ऐ. ऐरण.', color: '#8B5CF6' },
  { id: 'ms-o', name: 'ओ', sub: 'Oth (ओठ)', phonic: 'O as in Orange', icon: '👄', marathi: 'ओठ', fact: 'ओ — ओ ओठांचा (एक काना एक मात्रा)', audioText: 'ओ. ओठ.', color: '#D946EF' },
  { id: 'ms-au', name: 'औ', sub: 'Aushadh (औषध)', phonic: 'Au as in Cow', icon: '💊', marathi: 'औषध', fact: 'औ — औ औषधाचा (एक काना दोन मात्रे)', audioText: 'औ. औषध.', color: '#EC4899' },
  { id: 'ms-am', name: 'अं', sub: 'Angathi (अंगठी)', phonic: 'Am as in Umbrella', icon: '💍', marathi: 'अंगठी', fact: 'अं — अं अंगठीचा (अनुस्वार)', audioText: 'अं. अंगठी.', color: '#F43F5E' },
  { id: 'ms-aha', name: 'अः', sub: 'Namaha (नमः)', phonic: 'Aha as in Visarga', icon: '🙏', marathi: 'विसर्ग', fact: 'अः — विसर्ग नमः', audioText: 'अः. विसर्ग.', color: '#64748B' },
  { id: 'ms-ae', name: 'ॲ', sub: 'Bat (बॅट)', phonic: 'Ae as in Apple', icon: '🏏', marathi: 'बॅट', fact: 'ॲ — अर्धचंद्र', audioText: 'ॲ. बॅट.', color: '#0284C7' },
  { id: 'ms-aw', name: 'ऑ', sub: 'Ball (बॉल)', phonic: 'Aw as in Ball', icon: '⚽', marathi: 'बॉल', fact: 'ऑ — एक काना अर्धचंद्र', audioText: 'ऑ. बॉल.', color: '#16A34A' },
];

// 7. Marathi Vyanjan (Consonants)
const MARATHI_VYANJAN: TVChartItem[] = [
  { id: 'mv-ka', name: 'क', sub: 'Kamal (कमळ)', icon: '🪷', marathi: 'कमळ', fact: 'क कमळाचा', audioText: 'क. कमळ.', color: '#EF4444' },
  { id: 'mv-kha', name: 'ख', sub: 'Khadu (खडू)', icon: '✏️', marathi: 'खडू', fact: 'ख खडूचा', audioText: 'ख. खडू.', color: '#F97316' },
  { id: 'mv-ga', name: 'ग', sub: 'Gavat (गवत)', icon: '🌿', marathi: 'गवत', fact: 'ग गवताचा', audioText: 'ग. गवत.', color: '#EAB308' },
  { id: 'mv-gha', name: 'घ', sub: 'Ghar (घर)', icon: '🏠', marathi: 'घर', fact: 'घ घराचा', audioText: 'घ. घर.', color: '#84CC16' },
  { id: 'mv-cha', name: 'च', sub: 'Chamcha (चमचा)', icon: '🥄', marathi: 'चमचा', fact: 'च चमच्याचा', audioText: 'च. चमचा.', color: '#10B981' },
  { id: 'mv-chha', name: 'छ', sub: 'Chhatri (छत्री)', icon: '☂️', marathi: 'छत्री', fact: 'छ छत्रीचा', audioText: 'छ. छत्री.', color: '#06B6D4' },
  { id: 'mv-ja', name: 'ज', sub: 'Jahaaj (जहाज)', icon: '🚢', marathi: 'जहाज', fact: 'ज जहाजाचा', audioText: 'ज. जहाज.', color: '#3B82F6' },
  { id: 'mv-jha', name: 'झ', sub: 'Zhabla (झबला)', icon: '👶', marathi: 'झबला', fact: 'झ झबल्याचा', audioText: 'झ. झबला.', color: '#6366F1' },
  { id: 'mv-ta', name: 'ट', sub: 'Tarbooj (टरबूज)', icon: '🍉', marathi: 'टरबूज', fact: 'ट टरबुजाचा', audioText: 'ट. टरबूज.', color: '#8B5CF6' },
  { id: 'mv-tha', name: 'ठ', sub: 'Thasa (ठसा)', icon: '💮', marathi: 'ठसा', fact: 'ठ ठशाचा', audioText: 'ठ. ठसा.', color: '#D946EF' },
  { id: 'mv-da', name: 'ड', sub: 'Damru (डमरू)', icon: '🥁', marathi: 'डमरू', fact: 'ड डमरूचा', audioText: 'ड. डमरू.', color: '#EC4899' },
  { id: 'mv-dha', name: 'ढ', sub: 'Dhag (ढग)', icon: '☁️', marathi: 'ढग', fact: 'ढ ढगाचा', audioText: 'ढ. ढग.', color: '#0284C7' },
  { id: 'mv-na', name: 'ण', sub: 'Baan (बाण)', icon: '🏹', marathi: 'बाणाचा ण', fact: 'ण बाणाचा', audioText: 'ण. बाण.', color: '#14B8A6' },
  { id: 'mv-ta2', name: 'त', sub: 'Talwar (तलवार)', icon: '⚔️', marathi: 'तलवार', fact: 'त तलवारीचा', audioText: 'त. तलवार.', color: '#F59E0B' },
  { id: 'mv-tha2', name: 'थ', sub: 'Thawa (थवा)', icon: '🕊️', marathi: 'थवा', fact: 'थ थव्याचा', audioText: 'थ. थवा.', color: '#10B981' },
  { id: 'mv-da2', name: 'द', sub: 'Darwaja (दरवाजा)', icon: '🚪', marathi: 'दरवाजा', fact: 'द दरवाजाचा', audioText: 'द. दरवाजा.', color: '#3B82F6' },
  { id: 'mv-dha2', name: 'ध', sub: 'Dhanushya (धनुष्य)', icon: '🏹', marathi: 'धनुष्य', fact: 'ध धनुष्याचा', audioText: 'ध. धनुष्य.', color: '#8B5CF6' },
  { id: 'mv-na2', name: 'न', sub: 'Nal (नळ)', icon: '🚰', marathi: 'नळ', fact: 'न नळाचा', audioText: 'न. नळ.', color: '#06B6D4' },
  { id: 'mv-pa', name: 'प', sub: 'Patang (पतंग)', icon: '🪁', marathi: 'पतंग', fact: 'प पतंगाचा', audioText: 'प. पतंग.', color: '#EF4444' },
  { id: 'mv-pha', name: 'फ', sub: 'Fanas (फणस)', icon: '🍈', marathi: 'फणस', fact: 'फ फणसाचा', audioText: 'फ. फणस.', color: '#84CC16' },
  { id: 'mv-ba', name: 'ब', sub: 'Badak (बदक)', icon: '🦆', marathi: 'बदक', fact: 'ब बदकाचा', audioText: 'ब. बदक.', color: '#F59E0B' },
  { id: 'mv-bha', name: 'भ', sub: 'Bhatji (भटजी)', icon: '🕉️', marathi: 'भटजी', fact: 'भ भटजीचा', audioText: 'भ. भटजी.', color: '#EC4899' },
  { id: 'mv-ma', name: 'म', sub: 'Magar (मगर)', icon: '🐊', marathi: 'मगर', fact: 'म मगरीचा', audioText: 'म. मगर.', color: '#10B981' },
  { id: 'mv-ya', name: 'य', sub: 'Yadnya (यज्ञ)', icon: '🔥', marathi: 'यज्ञ', fact: 'य यज्ञाचा', audioText: 'य. यज्ञ.', color: '#F97316' },
  { id: 'mv-ra', name: 'र', sub: 'Rath (रथ)', icon: '🛞', marathi: 'रथ', fact: 'र रथाचा', audioText: 'र. रथ.', color: '#E11D48' },
  { id: 'mv-la', name: 'ल', sub: 'Lasun (लसूण)', icon: '🧄', marathi: 'लसूण', fact: 'ल लसणाचा', audioText: 'ल. लसूण.', color: '#6366F1' },
  { id: 'mv-va', name: 'व', sub: 'Vajan (वजन)', icon: '⚖️', marathi: 'वजन', fact: 'व वजनाचा', audioText: 'व. वजन.', color: '#0D9488' },
  { id: 'mv-sha', name: 'श', sub: 'Shahrug (शहामृग)', icon: '🦤', marathi: 'शहामृग', fact: 'श शहामृगाचा', audioText: 'श. शहामृग.', color: '#8B5CF6' },
  { id: 'mv-shha', name: 'ष', sub: 'Shatkon (षटकोन)', icon: '⬡', marathi: 'षटकोन', fact: 'ष षटकोनाचा', audioText: 'ष. षटकोन.', color: '#3B82F6' },
  { id: 'mv-sa', name: 'स', sub: 'Sasa (ससा)', icon: '🐰', marathi: 'ससा', fact: 'स सश्याचा', audioText: 'स. ससा.', color: '#14B8A6' },
  { id: 'mv-ha', name: 'ह', sub: 'Hatti (हत्ती)', icon: '🐘', marathi: 'हत्ती', fact: 'ह हत्तीचा', audioText: 'ह. हत्ती.', color: '#475569' },
  { id: 'mv-la2', name: 'ळ', sub: 'Baal (बाळ)', icon: '👶', marathi: 'बाळाचा ळ', fact: 'ळ बाळाचा', audioText: 'ळ. बाळ.', color: '#F59E0B' },
  { id: 'mv-ksha', name: 'क्ष', sub: 'Kshatriya (क्षत्रिय)', icon: '🛡️', marathi: 'क्षत्रिय', fact: 'क्ष क्षत्रियाचा', audioText: 'क्ष. क्षत्रिय.', color: '#DC2626' },
  { id: 'mv-dnya', name: 'ज्ञ', sub: 'Dnyaneshwar (ज्ञानेश्वर)', icon: '📖', marathi: 'ज्ञानेश्वर', fact: 'ज्ञ ज्ञानेश्वराचा', audioText: 'ज्ञ. ज्ञानेश्वर.', color: '#7C3AED' },
];

// 8. English Alphabet (A–Z)
const ENGLISH_ALPHABET: TVChartItem[] = [
  { id: 'ea-a', name: 'Aa', sub: 'Apple', phonic: '/æ/ as in Ant', icon: '🍎', fact: 'A is for sweet crunchy Apple!', audioText: 'A is for Apple. /æ/ /æ/ Apple.', color: '#EF4444' },
  { id: 'ea-b', name: 'Bb', sub: 'Ball', phonic: '/b/ as in Bat', icon: '⚽', fact: 'B is for bouncing round Ball!', audioText: 'B is for Ball. /b/ /b/ Ball.', color: '#F97316' },
  { id: 'ea-c', name: 'Cc', sub: 'Cat', phonic: '/k/ as in Cup', icon: '🐱', fact: 'C is for friendly furry Cat!', audioText: 'C is for Cat. /k/ /k/ Cat.', color: '#EAB308' },
  { id: 'ea-d', name: 'Dd', sub: 'Dog', phonic: '/d/ as in Drum', icon: '🐶', fact: 'D is for loyal barking Dog!', audioText: 'D is for Dog. /d/ /d/ Dog.', color: '#84CC16' },
  { id: 'ea-e', name: 'Ee', sub: 'Elephant', phonic: '/e/ as in Egg', icon: '🐘', fact: 'E is for giant Elephant with a long trunk!', audioText: 'E is for Elephant. /e/ /e/ Elephant.', color: '#10B981' },
  { id: 'ea-f', name: 'Ff', sub: 'Fish', phonic: '/f/ as in Fan', icon: '🐟', fact: 'F is for shiny swimming Fish!', audioText: 'F is for Fish. /f/ /f/ Fish.', color: '#06B6D4' },
  { id: 'ea-g', name: 'Gg', sub: 'Grapes', phonic: '/g/ as in Girl', icon: '🍇', fact: 'G is for juicy purple Grapes!', audioText: 'G is for Grapes. /g/ /g/ Grapes.', color: '#8B5CF6' },
  { id: 'ea-h', name: 'Hh', sub: 'Hat', phonic: '/h/ as in Hand', icon: '🎩', fact: 'H is for fancy top Hat!', audioText: 'H is for Hat. /h/ /h/ Hat.', color: '#D946EF' },
  { id: 'ea-i', name: 'Ii', sub: 'Ice Cream', phonic: '/ɪ/ as in Igloo', icon: '🍦', fact: 'I is for yummy cool Ice Cream!', audioText: 'I is for Ice Cream. /ɪ/ /ɪ/ Ice Cream.', color: '#EC4899' },
  { id: 'ea-j', name: 'Jj', sub: 'Juice', phonic: '/dʒ/ as in Jump', icon: '🧃', fact: 'J is for sweet refreshing Juice!', audioText: 'J is for Juice. /dʒ/ /dʒ/ Juice.', color: '#F59E0B' },
  { id: 'ea-k', name: 'Kk', sub: 'Kite', phonic: '/k/ as in King', icon: '🪁', fact: 'K is for high flying Kite!', audioText: 'K is for Kite. /k/ /k/ Kite.', color: '#10B981' },
  { id: 'ea-l', name: 'Ll', sub: 'Lion', phonic: '/l/ as in Lamp', icon: '🦁', fact: 'L is for roaring golden Lion!', audioText: 'L is for Lion. /l/ /l/ Lion.', color: '#F97316' },
  { id: 'ea-m', name: 'Mm', sub: 'Monkey', phonic: '/m/ as in Moon', icon: '🐒', fact: 'M is for playful jumping Monkey!', audioText: 'M is for Monkey. /m/ /m/ Monkey.', color: '#92400E' },
  { id: 'ea-n', name: 'Nn', sub: 'Nest', phonic: '/n/ as in Nut', icon: '🪺', fact: 'N is for cozy bird Nest!', audioText: 'N is for Nest. /n/ /n/ Nest.', color: '#78350F' },
  { id: 'ea-o', name: 'Oo', sub: 'Orange', phonic: '/ɒ/ as in Octopus', icon: '🍊', fact: 'O is for juicy Vitamin-C Orange!', audioText: 'O is for Orange. /ɒ/ /ɒ/ Orange.', color: '#EA580C' },
  { id: 'ea-p', name: 'Pp', sub: 'Parrot', phonic: '/p/ as in Pen', icon: '🦜', fact: 'P is for colorful talking Parrot!', audioText: 'P is for Parrot. /p/ /p/ Parrot.', color: '#16A34A' },
  { id: 'ea-q', name: 'Qq', sub: 'Queen', phonic: '/kw/ as in Quiet', icon: '👑', fact: 'Q is for graceful Queen with crown!', audioText: 'Q is for Queen. /kw/ /kw/ Queen.', color: '#7C3AED' },
  { id: 'ea-r', name: 'Rr', sub: 'Rabbit', phonic: '/r/ as in Ring', icon: '🐇', fact: 'R is for hopping fluffy Rabbit!', audioText: 'R is for Rabbit. /r/ /r/ Rabbit.', color: '#06B6D4' },
  { id: 'ea-s', name: 'Ss', sub: 'Sun', phonic: '/s/ as in Star', icon: '☀️', fact: 'S is for warm shining Sun!', audioText: 'S is for Sun. /s/ /s/ Sun.', color: '#EAB308' },
  { id: 'ea-t', name: 'Tt', sub: 'Tiger', phonic: '/t/ as in Tree', icon: '🐅', fact: 'T is for magnificent striped Tiger!', audioText: 'T is for Tiger. /t/ /t/ Tiger.', color: '#EA580C' },
  { id: 'ea-u', name: 'Uu', sub: 'Umbrella', phonic: '/ʌ/ as in Up', icon: '☂️', fact: 'U is for colorful rainy Umbrella!', audioText: 'U is for Umbrella. /ʌ/ /ʌ/ Umbrella.', color: '#3B82F6' },
  { id: 'ea-v', name: 'Vv', sub: 'Violin', phonic: '/v/ as in Van', icon: '🎻', fact: 'V is for melodious Violin music!', audioText: 'V is for Violin. /v/ /v/ Violin.', color: '#8B5CF6' },
  { id: 'ea-w', name: 'Ww', sub: 'Watch', phonic: '/w/ as in Water', icon: '⌚', fact: 'W is for shiny ticking Watch!', audioText: 'W is for Watch. /w/ /w/ Watch.', color: '#0284C7' },
  { id: 'ea-x', name: 'Xx', sub: 'Xylophone', phonic: '/ks/ as in Box', icon: '🎵', fact: 'X is for musical colorful Xylophone!', audioText: 'X is for Xylophone. Musical Xylophone.', color: '#10B981' },
  { id: 'ea-y', name: 'Yy', sub: 'Yak', phonic: '/j/ as in Yellow', icon: '🐂', fact: 'Y is for strong mountain Yak!', audioText: 'Y is for Yak. /j/ /j/ Yak.', color: '#B45309' },
  { id: 'ea-z', name: 'Zz', sub: 'Zebra', phonic: '/z/ as in Zoo', icon: '🦓', fact: 'Z is for striped wandering Zebra!', audioText: 'Z is for Zebra. /z/ /z/ Zebra.', color: '#334155' },
];

// 9. Phonics Word Families
const PHONICS_FAMILIES: TVChartItem[] = [
  { id: 'ph-at', name: '-AT Family', sub: 'Cat, Bat, Hat, Mat, Rat', icon: '🐱', fact: 'Short /a/ sound word family!', audioText: 'A-T Family. Cat, Bat, Hat, Mat, Rat.', color: '#EF4444' },
  { id: 'ph-an', name: '-AN Family', sub: 'Fan, Pan, Can, Van, Man', icon: '🍳', fact: 'Short /a/ sound with -n ending!', audioText: 'A-N Family. Fan, Pan, Can, Van, Man.', color: '#F97316' },
  { id: 'ph-ap', name: '-AP Family', sub: 'Cap, Map, Tap, Clap, Nap', icon: '🧢', fact: 'Short /a/ sound with -p ending!', audioText: 'A-P Family. Cap, Map, Tap, Clap, Nap.', color: '#EAB308' },
  { id: 'ph-en', name: '-EN Family', sub: 'Hen, Pen, Ten, Men, Den', icon: '🐔', fact: 'Short /e/ sound word family!', audioText: 'E-N Family. Hen, Pen, Ten, Men, Den.', color: '#10B981' },
  { id: 'ph-et', name: '-ET Family', sub: 'Net, Pet, Wet, Jet, Set', icon: '🚀', fact: 'Short /e/ sound with -t ending!', audioText: 'E-T Family. Net, Pet, Wet, Jet, Set.', color: '#06B6D4' },
  { id: 'ph-in', name: '-IN Family', sub: 'Pin, Bin, Win, Tin, Fin', icon: '📌', fact: 'Short /i/ sound word family!', audioText: 'I-N Family. Pin, Bin, Win, Tin, Fin.', color: '#3B82F6' },
  { id: 'ph-op', name: '-OP Family', sub: 'Hop, Mop, Top, Pop, Drop', icon: '🔝', fact: 'Short /o/ sound word family!', audioText: 'O-P Family. Hop, Mop, Top, Pop, Drop.', color: '#8B5CF6' },
  { id: 'ph-ug', name: '-UG Family', sub: 'Bug, Hug, Mug, Rug, Jug', icon: '🐛', fact: 'Short /u/ sound word family!', audioText: 'U-G Family. Bug, Hug, Mug, Rug, Jug.', color: '#EC4899' },
];

// 10. Poems & Rhymes
const POEMS: TVChartItem[] = [
  { id: 'poem-twinkle', name: 'Twinkle Twinkle Little Star', sub: 'How I wonder what you are...', icon: '⭐', fact: 'Up above the world so high, like a diamond in the sky!', audioText: 'Twinkle twinkle little star, how I wonder what you are! Up above the world so high, like a diamond in the sky!', color: '#EAB308' },
  { id: 'poem-humpty', name: 'Humpty Dumpty', sub: 'Sat on a wall...', icon: '🥚', fact: 'Humpty Dumpty had a great fall! All the king horses could not put him together again.', audioText: 'Humpty Dumpty sat on a wall, Humpty Dumpty had a great fall!', color: '#F97316' },
  { id: 'poem-bus', name: 'The Wheels on the Bus', sub: 'Go round and round...', icon: '🚌', fact: 'The wheels on the bus go round and round, all through the town!', audioText: 'The wheels on the bus go round and round, round and round, all through the town!', color: '#0284C7' },
  { id: 'poem-jack', name: 'Jack and Jill', sub: 'Went up the hill...', icon: '🪣', fact: 'To fetch a pail of water! Jack fell down and broke his crown.', audioText: 'Jack and Jill went up the hill to fetch a pail of water!', color: '#10B981' },
  { id: 'poem-baa', name: 'Baa Baa Black Sheep', sub: 'Have you any wool?', icon: '🐑', fact: 'Yes sir, yes sir, three bags full! One for the master, one for the dame.', audioText: 'Baa baa black sheep, have you any wool? Yes sir, yes sir, three bags full!', color: '#475569' },
  { id: 'poem-spider', name: 'Incy Wincy Spider', sub: 'Climbed up the water spout...', icon: '🕷️', fact: 'Down came the rain and washed the spider out! Out came the sunshine and dried up all the rain.', audioText: 'Incy Wincy spider climbed up the water spout, down came the rain and washed the spider out!', color: '#7C3AED' },
];

export const TV_CHART_CATEGORIES: Record<string, TVChartCategory> = {
  'tables-2-30': {
    slug: 'tables-2-30',
    title: 'Tables 2–30',
    icon: '🔢',
    bg: '#1A2A3A',
    description: 'Learn multiplication tables 2 to 30 step by step',
    type: 'tables',
  },
  'english-alphabet': {
    slug: 'english-alphabet',
    title: 'English A–Z',
    icon: '🔤',
    bg: '#1A1A3A',
    description: 'Learn 26 alphabet letters, phonics sounds, and vocabulary words',
    type: 'grid',
    items: ENGLISH_ALPHABET,
  },
  'marathi-swar': {
    slug: 'marathi-swar',
    title: 'Marathi Swar',
    icon: '🕉️',
    bg: '#3A1A2A',
    description: 'Learn Marathi vowels (स्वर) with matras and examples',
    type: 'grid',
    items: MARATHI_SWAR,
  },
  'marathi-vyanjan': {
    slug: 'marathi-vyanjan',
    title: 'Marathi Vyanjan',
    icon: '🪷',
    bg: '#2A3A1A',
    description: 'Learn 36 Marathi consonants (व्यंजन) from क to ज्ञ',
    type: 'grid',
    items: MARATHI_VYANJAN,
  },
  'animals': {
    slug: 'animals',
    title: 'Animals Chart',
    icon: '🦁',
    bg: '#3D1A1A',
    description: 'Explore wild & domestic animals with Marathi names and sounds',
    type: 'grid',
    items: ANIMALS,
  },
  'body-parts': {
    slug: 'body-parts',
    title: 'Body Parts',
    icon: '👦',
    bg: '#1A3A2A',
    description: 'Discover human body parts, Marathi translations, and functions',
    type: 'grid',
    items: BODY_PARTS,
  },
  'vegetables': {
    slug: 'vegetables',
    title: 'Vegetables',
    icon: '🥕',
    bg: '#1C2A10',
    description: 'Learn fresh healthy vegetables and nutritional facts',
    type: 'grid',
    items: VEGETABLES,
  },
  'birds': {
    slug: 'birds',
    title: 'Birds',
    icon: '🦜',
    bg: '#102A3A',
    description: 'Explore magnificent birds and their unique wings and songs',
    type: 'grid',
    items: BIRDS,
  },
  'emotions': {
    slug: 'emotions',
    title: 'Emotions & Feelings',
    icon: '😊',
    bg: '#2A1A3A',
    description: 'Recognize emotions, feelings, and social-emotional skills',
    type: 'grid',
    items: EMOTIONS,
  },
  'phonics': {
    slug: 'phonics',
    title: 'Phonics Word Families',
    icon: '🗣️',
    bg: '#3A2A1A',
    description: 'Master short vowels, word families, and rhyming sounds',
    type: 'grid',
    items: PHONICS_FAMILIES,
  },
  'poems': {
    slug: 'poems',
    title: 'Poems & Rhymes',
    icon: '🎭',
    bg: '#1A3A3A',
    description: 'Sing along to popular nursery rhymes and joyful poems',
    type: 'grid',
    items: POEMS,
  },
};
