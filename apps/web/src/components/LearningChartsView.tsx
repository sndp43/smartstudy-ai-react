import { useState, useRef, useEffect } from "react";
import VisualLearningChartGrid, { VisualChartItem } from "./VisualLearningChartGrid";
import { DEFAULT_ANIMALS, DEFAULT_VEGETABLES, DEFAULT_BIRDS, DEFAULT_EMOTIONS } from "./chartsData";
import PhonicsLearningChartView from "./PhonicsLearningChartView";

export interface ChartItem {
  key: string;
  [key: string]: any;
}

export interface LearningChart {
  id: string;
  slug: string;
  subject: string;
  title: string;
  description: string;
  chart_type: string;
  chart_data: any[];
}

export interface ChartProgressData {
  summary?: {
    tablesPracticed?: number;
    swarPracticed?: number;
    vyanjanPracticed?: number;
    lettersPracticed?: number;
    bodyPartsPracticed?: number;
    animalsPracticed?: number;
    vegetablesPracticed?: number;
    birdsPracticed?: number;
    emotionsPracticed?: number;
    phonicsPracticed?: number;
    totalPracticeSessions?: number;
  };
  records?: Record<string, { practiceCount: number; lastPracticedAt: string; itemName?: string }>;
}

interface LearningChartsViewProps {
  charts: LearningChart[];
  activeChartSlug: string;
  setActiveChartSlug: (slug: string) => void;
  selectedTable: number | "all";
  setSelectedTable: (val: number | "all") => void;
  alphabetFilter: "all" | "vowels" | "consonants";
  setAlphabetFilter: (val: "all" | "vowels" | "consonants") => void;
  recitingTable: number | null;
  setRecitingTable: (val: number | null) => void;
  chartProgress: ChartProgressData;
  onRecordPractice: (chartSlug: string, itemKey: string, itemName?: string) => Promise<void>;
  savingChartItem: string | null;
  childName: string;
  isTeacher: boolean;
  apiUrl?: string;
}

const CHAUDAKHADI_MATRAS = [
  { swar: "अ", matra: "", matraName: "मूळ स्वर", example: "क", phonic: "a", isNew: false },
  { swar: "आ", matra: "ा", matraName: "काना", example: "का", phonic: "aa", isNew: false },
  { swar: "इ", matra: "ि", matraName: "पहिली वेलांटी", example: "कि", phonic: "i", isNew: false },
  { swar: "ई", matra: "ी", matraName: "दुसरी वेलांटी", example: "की", phonic: "ee", isNew: false },
  { swar: "उ", matra: "ु", matraName: "पहिला उकार", example: "कु", phonic: "u", isNew: false },
  { swar: "ऊ", matra: "ू", matraName: "दुसरा उकार", example: "कू", phonic: "oo", isNew: false },
  { swar: "ए", matra: "े", matraName: "एक मात्रा", example: "के", phonic: "e", isNew: false },
  { swar: "ॲ", matra: "ॅ", matraName: "अर्धचंद्र", example: "कॅ", phonic: "ae", isNew: true },
  { swar: "ऐ", matra: "ै", matraName: "दोन मात्रे", example: "कै", phonic: "ai", isNew: false },
  { swar: "ओ", matra: "ो", matraName: "एक काना एक मात्रा", example: "को", phonic: "o", isNew: false },
  { swar: "ऑ", matra: "ॉ", matraName: "एक काना अर्धचंद्र", example: "कॉ", phonic: "aw", isNew: true },
  { swar: "औ", matra: "ौ", matraName: "एक काना दोन मात्रे", example: "कौ", phonic: "au", isNew: false },
  { swar: "अं", matra: "ं", matraName: "अनुस्वार", example: "कं", phonic: "am", isNew: false },
  { swar: "अः", matra: "ः", matraName: "विसर्ग", example: "कः", phonic: "aha", isNew: false },
];

const MARATHI_CONSONANTS = [
  "क", "ख", "ग", "घ", "च", "छ", "ज", "झ", "ट", "ठ", "ड", "ढ", "ण",
  "त", "थ", "द", "ध", "न", "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श", "ष", "स", "ह", "ळ", "क्ष", "ज्ञ"
];

const NUMBER_WORDS: Record<number, string> = {
  0: "zero", 1: "one", 2: "two", 3: "three", 4: "four", 5: "five",
  6: "six", 7: "seven", 8: "eight", 9: "nine", 10: "ten",
  11: "eleven", 12: "twelve", 13: "thirteen", 14: "fourteen", 15: "fifteen",
  16: "sixteen", 17: "seventeen", 18: "eighteen", 19: "nineteen", 20: "twenty",
  21: "twenty-one", 22: "twenty-two", 23: "twenty-three", 24: "twenty-four", 25: "twenty-five",
  26: "twenty-six", 27: "twenty-seven", 28: "twenty-eight", 29: "twenty-nine", 30: "thirty",
  32: "thirty-two", 35: "thirty-five", 36: "thirty-six", 40: "forty",
  42: "forty-two", 45: "forty-five", 48: "forty-eight", 49: "forty-nine", 50: "fifty",
  54: "fifty-four", 56: "fifty-six", 60: "sixty", 63: "sixty-three", 64: "sixty-four",
  70: "seventy", 72: "seventy-two", 80: "eighty", 81: "eighty-one", 90: "ninety", 100: "one hundred",
};

const MULTIPLIER_RECITE_WORDS: Record<number, string> = {
  1: "oneza",
  2: "twoza",
  3: "threeza",
  4: "fourza",
  5: "fiveza",
  6: "sixza",
  7: "sevenza",
  8: "eightza",
  9: "nineza",
  10: "tenza",
};

export function toWords(n: number): string {
  if (NUMBER_WORDS[n]) return NUMBER_WORDS[n];
  const ones = ["", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",
    "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen"];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 20) return ones[n] || String(n);
  if (n < 100) {
    const t = Math.floor(n / 10);
    const r = n % 10;
    return r === 0 ? tens[t] : `${tens[t]} ${ones[r]}`;
  }
  if (n < 1000) {
    const h = Math.floor(n / 100);
    const rem = n % 100;
    return rem === 0 ? `${ones[h]} hundred` : `${ones[h]} hundred ${toWords(rem)}`;
  }
  return String(n);
}

export const DEFAULT_BODY_PARTS = [
  {
    key: "part_hair",
    name: "Hair",
    marathi: "केस (Kes)",
    hindi: "बाल (Baal)",
    icon: "💇",
    category: "head",
    side: "left",
    x: 50,
    y: 5,
    svgX: 320,
    svgY: 55,
    labelY: 55,
    fact: "Grows on top of our head and keeps our head warm and protected.",
    audioText: "Hair",
  },
  {
    key: "part_forehead",
    name: "Forehead",
    marathi: "कपाळ (Kapaal)",
    hindi: "माथा (Maatha)",
    icon: "🧠",
    category: "head",
    side: "right",
    x: 50,
    y: 13,
    svgX: 325,
    svgY: 102,
    labelY: 75,
    fact: "The smooth area on our face right between our eyebrows and hair.",
    audioText: "Forehead",
  },
  {
    key: "part_head",
    name: "Head",
    marathi: "डोके (Doke)",
    hindi: "सिर (Sir)",
    icon: "🗣️",
    category: "head",
    side: "left",
    x: 50,
    y: 11,
    svgX: 295,
    svgY: 85,
    labelY: 95,
    fact: "Protects our brain and holds our face, eyes, ears, nose, and mouth.",
    audioText: "Head",
  },
  {
    key: "part_ears",
    name: "Ears",
    marathi: "कान (Kaan)",
    hindi: "कान (Kaan)",
    icon: "👂",
    category: "sense",
    side: "right",
    x: 38,
    y: 18,
    svgX: 374,
    svgY: 122,
    labelY: 120,
    fact: "Sense of Hearing: Two ears allow us to hear music, stories, and friends.",
    audioText: "Ears. Used for listening.",
  },
  {
    key: "part_eyes",
    name: "Eyes",
    marathi: "डोळे (Dole)",
    hindi: "आँखें (Aankhein)",
    icon: "👀",
    category: "sense",
    side: "left",
    x: 46,
    y: 16,
    svgX: 302,
    svgY: 122,
    labelY: 135,
    fact: "Sense of Sight: Two eyes help us see shapes, vibrant colors, and books.",
    audioText: "Eyes. Used for seeing.",
  },
  {
    key: "part_mouth",
    name: "Mouth",
    marathi: "तोंड (Tond)",
    hindi: "मुँह (Munh)",
    icon: "👄",
    category: "head",
    side: "right",
    x: 50,
    y: 22,
    svgX: 324,
    svgY: 154,
    labelY: 165,
    fact: "We use our mouth to smile, speak cheerfully, and eat delicious food.",
    audioText: "Mouth",
  },
  {
    key: "part_nose",
    name: "Nose",
    marathi: "नाक (Naak)",
    hindi: "नाक (Naak)",
    icon: "👃",
    category: "sense",
    side: "left",
    x: 50,
    y: 19,
    svgX: 316,
    svgY: 136,
    labelY: 175,
    fact: "Sense of Smell: Helps us smell fragrant flowers and breathe fresh air.",
    audioText: "Nose. Used for smelling and breathing.",
  },
  {
    key: "part_tongue",
    name: "Tongue",
    marathi: "जीभ (Jeebh)",
    hindi: "जीभ (Jeebh)",
    icon: "👅",
    category: "sense",
    side: "right",
    x: 52,
    y: 24,
    svgX: 322,
    svgY: 158,
    labelY: 210,
    fact: "Sense of Taste: Tastes sweet mangoes, salty popcorn, and sour lemons.",
    audioText: "Tongue. Used for tasting.",
  },
  {
    key: "part_teeth",
    name: "Teeth",
    marathi: "दात (Daat)",
    hindi: "दाँत (Daant)",
    icon: "🦷",
    category: "head",
    side: "left",
    x: 48,
    y: 23,
    svgX: 316,
    svgY: 151,
    labelY: 215,
    fact: "Shiny white teeth help us chew and break down nutritious food.",
    audioText: "Teeth",
  },
  {
    key: "part_shoulders",
    name: "Shoulders",
    marathi: "खांदे (Khaande)",
    hindi: "कंधे (Kandhe)",
    icon: "💪",
    category: "upper",
    side: "right",
    x: 36,
    y: 32,
    svgX: 382,
    svgY: 215,
    labelY: 255,
    fact: "Strong joints that carry school backpacks and connect our arms.",
    audioText: "Shoulders",
  },
  {
    key: "part_neck",
    name: "Neck",
    marathi: "मान (Maan)",
    hindi: "गर्दन (Gardan)",
    icon: "🧣",
    category: "upper",
    side: "left",
    x: 50,
    y: 28,
    svgX: 312,
    svgY: 188,
    labelY: 255,
    fact: "Connects our head to our torso and lets our head turn left and right.",
    audioText: "Neck",
  },
  {
    key: "part_elbow",
    name: "Elbow",
    marathi: "कोपरा (Kopra)",
    hindi: "कोहनी (Kohni)",
    icon: "🦾",
    category: "upper",
    side: "right",
    x: 26,
    y: 47,
    svgX: 410,
    svgY: 305,
    labelY: 305,
    fact: "The flexible hinge joint that lets our arm bend and fold.",
    audioText: "Elbow",
  },
  {
    key: "part_chest",
    name: "Chest",
    marathi: "छाती (Chhaati)",
    hindi: "छाती (Chhaati)",
    icon: "🫁",
    category: "upper",
    side: "left",
    x: 50,
    y: 35,
    svgX: 312,
    svgY: 245,
    labelY: 295,
    fact: "Contains our rib cage, which safely guards our heart and lungs.",
    audioText: "Chest",
  },
  {
    key: "part_stomach",
    name: "Stomach",
    marathi: "पोट (Pot)",
    hindi: "पेट (Pet)",
    icon: "🥑",
    category: "upper",
    side: "right",
    x: 50,
    y: 44,
    svgX: 325,
    svgY: 325,
    labelY: 355,
    fact: "Digests our meals to give our body energy to play and learn.",
    audioText: "Stomach",
  },
  {
    key: "part_arms",
    name: "Arms",
    marathi: "हात (Haat)",
    hindi: "बाँह (Baanh)",
    icon: "💪",
    category: "upper",
    side: "left",
    x: 30,
    y: 41,
    svgX: 235,
    svgY: 275,
    labelY: 340,
    fact: "Help us reach high objects, carry toys, and give warm hugs.",
    audioText: "Arms",
  },
  {
    key: "part_fingers",
    name: "Fingers",
    marathi: "बोटे (Bote)",
    hindi: "उंगलियाँ (Ungliyan)",
    icon: "✌️",
    category: "upper",
    side: "right",
    x: 20,
    y: 59,
    svgX: 450,
    svgY: 385,
    labelY: 405,
    fact: "Ten nimble fingers that hold crayons, turn book pages, and count.",
    audioText: "Fingers",
  },
  {
    key: "part_hands",
    name: "Hands",
    marathi: "हात (Haat / Panja)",
    hindi: "हाथ (Haath)",
    icon: "✋",
    category: "sense",
    side: "left",
    x: 22,
    y: 55,
    svgX: 195,
    svgY: 375,
    labelY: 395,
    fact: "Sense of Touch: We write, paint, clap, and feel warm or soft textures.",
    audioText: "Hands. Used for touching and holding.",
  },
  {
    key: "part_knees",
    name: "Knees",
    marathi: "गुडघे (Gudghe)",
    hindi: "घुटने (Ghutne)",
    icon: "🦿",
    category: "lower",
    side: "right",
    x: 43,
    y: 77,
    svgX: 354,
    svgY: 520,
    labelY: 520,
    fact: "Bendy joints that allow our legs to sit cross-legged, crouch, and pedal.",
    audioText: "Knees",
  },
  {
    key: "part_legs",
    name: "Legs",
    marathi: "पाय (Paay)",
    hindi: "टाँगें (Taangein)",
    icon: "🦵",
    category: "lower",
    side: "left",
    x: 42,
    y: 69,
    svgX: 286,
    svgY: 485,
    labelY: 485,
    fact: "Long and powerful limbs that let us walk, leap, run, and skip.",
    audioText: "Legs",
  },
  {
    key: "part_toes",
    name: "Toes",
    marathi: "पायाची बोटे (Paayachi Bote)",
    hindi: "पैर की उंगलियाँ",
    icon: "👣",
    category: "lower",
    side: "right",
    x: 40,
    y: 96,
    svgX: 365,
    svgY: 655,
    labelY: 645,
    fact: "Ten small toes at the front of our feet that assist our balance.",
    audioText: "Toes",
  },
  {
    key: "part_feet",
    name: "Feet",
    marathi: "पावले (Paavle)",
    hindi: "पैर (Pair)",
    icon: "🦶",
    category: "lower",
    side: "left",
    x: 41,
    y: 92,
    svgX: 278,
    svgY: 645,
    labelY: 645,
    fact: "Firm bases that support our body weight and let us stand upright.",
    audioText: "Feet",
  },
];

export interface PosterBodyPart {
  key: string;
  name: string;
  marathi: string;
  hindi: string;
  category: "head" | "sense" | "upper" | "lower";
  pill: { x: number; y: number; w: number; h: number };
  line: { x1: number; y1: number; x2: number; y2: number };
  boyHotspot: { cx: number; cy: number; r: number };
  themeColor: string;
  fact: string;
  icon: string;
  audioText?: string;
}

export const POSTER_BODY_PARTS: PosterBodyPart[] = [
  // Left Column (7 parts)
  {
    key: "part_head",
    name: "Head",
    marathi: "डोके (Doke)",
    hindi: "सिर (Sir)",
    category: "head",
    pill: { x: 50, y: 204, w: 175, h: 64 },
    line: { x1: 225, y1: 236, x2: 385, y2: 240 },
    boyHotspot: { cx: 400, cy: 260, r: 45 },
    themeColor: "#7c3aed",
    fact: "Our head holds our brain, eyes, nose, mouth, and ears!",
    icon: "👦",
    audioText: "Head",
  },
  {
    key: "part_eyes",
    name: "Eyes",
    marathi: "डोळे (Dole)",
    hindi: "आँखें (Aankhen)",
    category: "sense",
    pill: { x: 50, y: 296, w: 175, h: 64 },
    line: { x1: 225, y1: 327, x2: 418, y2: 338 },
    boyHotspot: { cx: 440, cy: 345, r: 28 },
    themeColor: "#0284c7",
    fact: "Sense of Sight! Two curious eyes help us see colorful pictures and smiles.",
    icon: "👀",
    audioText: "Eyes. Used for seeing.",
  },
  {
    key: "part_nose",
    name: "Nose",
    marathi: "नाक (Naak)",
    hindi: "नाक (Naak)",
    category: "sense",
    pill: { x: 50, y: 386, w: 175, h: 64 },
    line: { x1: 225, y1: 417, x2: 485, y2: 378 },
    boyHotspot: { cx: 495, cy: 375, r: 22 },
    themeColor: "#16a34a",
    fact: "Sense of Smell! Our cute nose smells fragrant flowers and delicious food.",
    icon: "👃",
    audioText: "Nose. Used for smelling.",
  },
  {
    key: "part_mouth",
    name: "Mouth",
    marathi: "तोंड (Tond)",
    hindi: "मुँह (Munh)",
    category: "sense",
    pill: { x: 50, y: 454, w: 180, h: 64 },
    line: { x1: 230, y1: 485, x2: 472, y2: 422 },
    boyHotspot: { cx: 505, cy: 415, r: 28 },
    themeColor: "#e11d48",
    fact: "We use our smiling mouth to laugh, sing, talk cheerfully, and eat tasty snacks!",
    icon: "👄",
    audioText: "Mouth",
  },
  {
    key: "part_arms",
    name: "Arms",
    marathi: "हात / बाहू (Haat)",
    hindi: "बाजू (Baaju)",
    category: "upper",
    pill: { x: 50, y: 546, w: 175, h: 64 },
    line: { x1: 225, y1: 577, x2: 356, y2: 577 },
    boyHotspot: { cx: 375, cy: 575, r: 32 },
    themeColor: "#ea580c",
    fact: "Strong arms help us lift our toys, reach high shelves, and give big warm hugs!",
    icon: "💪",
    audioText: "Arms",
  },
  {
    key: "part_hands",
    name: "Hands",
    marathi: "हात (Haat)",
    hindi: "हाथ (Haath)",
    category: "sense",
    pill: { x: 50, y: 622, w: 180, h: 64 },
    line: { x1: 230, y1: 653, x2: 326, y2: 648 },
    boyHotspot: { cx: 330, cy: 650, r: 35 },
    themeColor: "#db2777",
    fact: "Sense of Touch! Hands help us draw, hold pencils, wave hello, and clap happily!",
    icon: "✋",
    audioText: "Hands",
  },
  {
    key: "part_fingers",
    name: "Fingers",
    marathi: "बोटे (Bote)",
    hindi: "उंगलियाँ (Ungliyan)",
    category: "upper",
    pill: { x: 50, y: 696, w: 184, h: 64 },
    line: { x1: 234, y1: 727, x2: 318, y2: 715 },
    boyHotspot: { cx: 310, cy: 715, r: 32 },
    themeColor: "#65a30d",
    fact: "We have 10 nimble fingers to count 1-2-3, turn pages, and paint pictures!",
    icon: "🖐️",
    audioText: "Fingers",
  },
  // Right Column (9 parts)
  {
    key: "part_hair",
    name: "Hair",
    marathi: "केस (Kes)",
    hindi: "बाल (Baal)",
    category: "head",
    pill: { x: 592, y: 200, w: 175, h: 64 },
    line: { x1: 592, y1: 231, x2: 522, y2: 238 },
    boyHotspot: { cx: 515, cy: 235, r: 48 },
    themeColor: "#d97706",
    fact: "Soft hair grows on top of our head to keep us warm and protected from the sun.",
    icon: "💇",
    audioText: "Hair",
  },
  {
    key: "part_ears",
    name: "Ears",
    marathi: "कान (Kaan)",
    hindi: "कान (Kaan)",
    category: "sense",
    pill: { x: 592, y: 293, w: 175, h: 64 },
    line: { x1: 592, y1: 324, x2: 625, y2: 365 },
    boyHotspot: { cx: 635, cy: 365, r: 26 },
    themeColor: "#e11d48",
    fact: "Sense of Hearing! Two ears help us listen to music, stories, and friends talking.",
    icon: "👂",
    audioText: "Ears. Used for listening.",
  },
  {
    key: "part_neck",
    name: "Neck",
    marathi: "मान (Maan)",
    hindi: "गर्दन (Gardan)",
    category: "upper",
    pill: { x: 592, y: 373, w: 175, h: 64 },
    line: { x1: 592, y1: 404, x2: 530, y2: 452 },
    boyHotspot: { cx: 518, cy: 455, r: 24 },
    themeColor: "#16a34a",
    fact: "Our neck connects our head to our body so we can look up, down, and around!",
    icon: "🧣",
    audioText: "Neck",
  },
  {
    key: "part_shoulders",
    name: "Shoulders",
    marathi: "खांदे (Khaande)",
    hindi: "कंधे (Kandhe)",
    category: "upper",
    pill: { x: 580, y: 450, w: 195, h: 64 },
    line: { x1: 580, y1: 481, x2: 590, y2: 476 },
    boyHotspot: { cx: 595, cy: 476, r: 28 },
    themeColor: "#7c3aed",
    fact: "Shoulders support our arms and carry our school backpack every morning.",
    icon: "👕",
    audioText: "Shoulders",
  },
  {
    key: "part_tummy",
    name: "Tummy",
    marathi: "पोट (Pot)",
    hindi: "पेट (Pet)",
    category: "upper",
    pill: { x: 592, y: 533, w: 178, h: 64 },
    line: { x1: 592, y1: 564, x2: 542, y2: 574 },
    boyHotspot: { cx: 515, cy: 575, r: 35 },
    themeColor: "#0284c7",
    fact: "Our tummy (stomach) digests healthy fruits, vegetables, and milk into energy!",
    icon: "🥣",
    audioText: "Tummy",
  },
  {
    key: "part_legs",
    name: "Legs",
    marathi: "पाय (Paay)",
    hindi: "टाँगें (Taangen)",
    category: "lower",
    pill: { x: 592, y: 613, w: 175, h: 64 },
    line: { x1: 592, y1: 644, x2: 582, y2: 642 },
    boyHotspot: { cx: 565, cy: 655, r: 35 },
    themeColor: "#d97706",
    fact: "Strong legs help us stand tall, run in the playground, jump high, and dance!",
    icon: "🦵",
    audioText: "Legs",
  },
  {
    key: "part_knees",
    name: "Knees",
    marathi: "गुडघे (Gudaghe)",
    hindi: "घुटने (Ghutne)",
    category: "lower",
    pill: { x: 592, y: 684, w: 178, h: 64 },
    line: { x1: 592, y1: 715, x2: 552, y2: 742 },
    boyHotspot: { cx: 552, cy: 742, r: 26 },
    themeColor: "#c026d3",
    fact: "Bendy knee joints let us sit on the floor, squat down, and pedal our bicycle.",
    icon: "🧎",
    audioText: "Knees",
  },
  {
    key: "part_feet",
    name: "Feet",
    marathi: "पावले (Paavale)",
    hindi: "पैर (Pair)",
    category: "lower",
    pill: { x: 592, y: 753, w: 175, h: 64 },
    line: { x1: 592, y1: 784, x2: 565, y2: 802 },
    boyHotspot: { cx: 560, cy: 860, r: 32 },
    themeColor: "#16a34a",
    fact: "Feet support our entire body and give us firm balance as we step forward.",
    icon: "🦶",
    audioText: "Feet",
  },
  {
    key: "part_toes",
    name: "Toes",
    marathi: "पायाची बोटे (Paayachi Bote)",
    hindi: "पैर की उंगलियाँ (Pair Ki Ungliyan)",
    category: "lower",
    pill: { x: 592, y: 823, w: 175, h: 64 },
    line: { x1: 592, y1: 854, x2: 580, y2: 874 },
    boyHotspot: { cx: 585, cy: 900, r: 26 },
    themeColor: "#0284c7",
    fact: "Ten wiggly toes on our feet help us balance when walking and running barefoot!",
    icon: "👣",
    audioText: "Toes",
  },
];

export function formatTableRecitePhrase(table: number, multiplier: number, product?: number, dbReciteText?: string): string {
  if (dbReciteText && dbReciteText.toLowerCase().includes("za")) {
    return dbReciteText;
  }
  const prod = product ?? table * multiplier;
  const tableWord = toWords(table);
  const capitalizedTable = tableWord.charAt(0).toUpperCase() + tableWord.slice(1);
  const multWord = MULTIPLIER_RECITE_WORDS[multiplier] || `${toWords(multiplier)}za`;
  const prodWord = toWords(prod);
  return `${capitalizedTable} ${multWord} ${prodWord}`;
}

export default function LearningChartsView({
  charts,
  activeChartSlug,
  setActiveChartSlug,
  selectedTable,
  setSelectedTable,
  alphabetFilter,
  setAlphabetFilter,
  recitingTable,
  setRecitingTable,
  chartProgress,
  onRecordPractice,
  savingChartItem,
  childName,
  isTeacher,
  apiUrl,
}: LearningChartsViewProps) {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [chaudakhadiMode, setChaudakhadiMode] = useState<"swar" | "consonant">("swar");
  const [selectedConsonant, setSelectedConsonant] = useState<string>("क");
  const [recitingKhadi, setRecitingKhadi] = useState<boolean>(false);
  const [vyanjanFilter, setVyanjanFilter] = useState<string>("all");
  const [recitingVyanjan, setRecitingVyanjan] = useState<boolean>(false);
  const [recitingSwar, setRecitingSwar] = useState<boolean>(false);
  const [activeKhadiIndex, setActiveKhadiIndex] = useState<number | null>(null);
  const [activeVyanjanKey, setActiveVyanjanKey] = useState<string | null>(null);
  const [activeSwarKey, setActiveSwarKey] = useState<string | null>(null);
  const [tableGroupFilter, setTableGroupFilter] = useState<"all" | "2-10" | "11-20" | "21-30">("all");
  const [allTablesLayout, setAllTablesLayout] = useState<"columns" | "stack">("columns");
  const [recitingMultiplier, setRecitingMultiplier] = useState<number | null>(null);

  // Body Parts chart state
  const [bodyChartMode, setBodyChartMode] = useState<"poster" | "vector">("poster");
  const [hoveredPartKey, setHoveredPartKey] = useState<string | null>("part_head");
  const [selectedPartKey, setSelectedPartKey] = useState<string>("part_head");
  const [autoSpeakOnHover, setAutoSpeakOnHover] = useState<boolean>(true);
  const [bodyCategoryFilter, setBodyCategoryFilter] = useState<"all" | "sense" | "head" | "upper" | "lower">("all");
  const [recitingBodyParts, setRecitingBodyParts] = useState<boolean>(false);
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizTargetKey, setQuizTargetKey] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAudioResolverRef = useRef<(() => void) | null>(null);
  const recitingKhadiRef = useRef<boolean>(false);
  const recitingVyanjanRef = useRef<boolean>(false);
  const recitingSwarRef = useRef<boolean>(false);
  const recitingTableRef = useRef<boolean>(false);
  const recitingBodyPartsRef = useRef<boolean>(false);
  const hoverTimerRef = useRef<any>(null);

  useEffect(() => {
    return () => {
      stopAllAudio();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2400);
  };

  const stopAllAudio = () => {
    recitingKhadiRef.current = false;
    recitingVyanjanRef.current = false;
    recitingSwarRef.current = false;
    recitingTableRef.current = false;
    recitingBodyPartsRef.current = false;
    setRecitingKhadi(false);
    setRecitingVyanjan(false);
    setRecitingSwar(false);
    setRecitingTable(null);
    setRecitingMultiplier(null);
    setRecitingBodyParts(false);
    setActiveKhadiIndex(null);
    setActiveVyanjanKey(null);
    setActiveSwarKey(null);

    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = null;
    }

    if (pendingAudioResolverRef.current) {
      const resolver = pendingAudioResolverRef.current;
      pendingAudioResolverRef.current = null;
      resolver();
    }

    if (sharedAudioRef.current) {
      try {
        sharedAudioRef.current.pause();
        sharedAudioRef.current.currentTime = 0;
        sharedAudioRef.current.removeAttribute("src");
      } catch (e) {}
    }

    if (activeAudioRef.current) {
      try {
        activeAudioRef.current.pause();
        activeAudioRef.current.currentTime = 0;
      } catch (e) {}
      activeAudioRef.current = null;
    }

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  const playAudioPhrase = (text: string, lang = "mr-IN"): Promise<void> => {
    return new Promise((resolve) => {
      // For standalone clicks (when not reciting), stop existing audio first
      if (
        !recitingKhadiRef.current &&
        !recitingVyanjanRef.current &&
        !recitingSwarRef.current &&
        !recitingTableRef.current
      ) {
        if (sharedAudioRef.current) {
          try {
            sharedAudioRef.current.pause();
            sharedAudioRef.current.currentTime = 0;
          } catch (e) {}
        }
        if ("speechSynthesis" in window) {
          window.speechSynthesis.cancel();
        }
      }

      const shortLang = lang.startsWith("mr") ? "mr" : lang.startsWith("hi") ? "hi" : "en";
      const apiBase = apiUrl || "http://127.0.0.1:8000/api";
      const ttsUrl = `${apiBase}/tts?lang=${shortLang}&text=${encodeURIComponent(text)}`;

      if (!sharedAudioRef.current) {
        sharedAudioRef.current = new Audio();
      }
      const audio = sharedAudioRef.current;
      activeAudioRef.current = audio;

      let finished = false;
      let timer: any = null;

      const finish = () => {
        if (!finished) {
          finished = true;
          if (timer) clearTimeout(timer);
          audio.onended = null;
          audio.onerror = null;
          pendingAudioResolverRef.current = null;
          resolve();
        }
      };

      pendingAudioResolverRef.current = finish;
      // 6 second timeout safety net
      timer = setTimeout(finish, 6000);

      audio.onended = finish;
      audio.onerror = () => {
        if ("speechSynthesis" in window) {
          try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = lang;
            const voices = window.speechSynthesis.getVoices();
            const preferred = voices.find((v) => v.lang.startsWith(shortLang)) ||
              voices.find((v) => /female|samantha|zira|karen/i.test(`${v.name}`));
            if (preferred) utterance.voice = preferred;
            utterance.onend = finish;
            utterance.onerror = finish;
            window.speechSynthesis.speak(utterance);
          } catch (e) {
            finish();
          }
        } else {
          finish();
        }
      };

      try {
        audio.pause();
        audio.src = ttsUrl;
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Audio play() error, falling back to speech synthesis:", err);
            if ("speechSynthesis" in window) {
              try {
                const utterance = new SpeechSynthesisUtterance(text);
                utterance.lang = lang;
                utterance.onend = finish;
                utterance.onerror = finish;
                window.speechSynthesis.speak(utterance);
              } catch (e) {
                finish();
              }
            } else {
              finish();
            }
          });
        }
      } catch (err) {
        console.warn("Audio load error:", err);
        finish();
      }
    });
  };

  const speakPhrase = (text: string, lang = "en-US") => {
    // English tables with "oneza / twoza" can use browser speech synthesis directly
    if (lang === "en-US" && /oneza|twoza|threeza|fourza|fiveza|sixza|sevenza|eightza|nineza|tenza/i.test(text)) {
      stopAllAudio();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88;
      const voices = window.speechSynthesis.getVoices();
      const preferred = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
        voices.find((voice) =>
          /female|samantha|zira|karen|susan|victoria|google uk english female|microsoft.*female/i.test(
            `${voice.name} ${voice.voiceURI}`
          )
        );
      if (preferred) utterance.voice = preferred;
      window.speechSynthesis.speak(utterance);
      return;
    }

    // Native audio playback for Marathi Swar, Chaudakhadi, Vyanjan, and Alphabet phonetics
    playAudioPhrase(text, lang);
  };

  const reciteFullTable = async (tableNum: number, items: any[]) => {
    if (recitingTable === tableNum) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingTableRef.current = true;
    setRecitingTable(tableNum);
    showToast(`🔊 Reciting Table of ${tableNum}...`);

    try {
      for (let i = 0; i < items.length; i++) {
        if (!recitingTableRef.current) break;
        const row = items[i];
        setRecitingMultiplier(row.multiplier);
        const phrase = formatTableRecitePhrase(tableNum, row.multiplier, row.product, row.reciteText);
        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(phrase);
          utterance.rate = 0.88;
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
            voices.find((voice) =>
              /female|samantha|zira|karen|susan|victoria|google uk english female|microsoft.*female/i.test(
                `${voice.name} ${voice.voiceURI}`
              )
            );
          if (preferred) utterance.voice = preferred;
          utterance.onend = () => setTimeout(resolve, 380);
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        });
      }

      if (recitingTableRef.current) {
        await onRecordPractice(activeChart?.slug || "tables-2-30", `table_${tableNum}`, `Table of ${tableNum}`);
        showToast(`⭐ Completed recitation for Table of ${tableNum}!`);
      }
    } finally {
      recitingTableRef.current = false;
      setRecitingTable(null);
      setRecitingMultiplier(null);
    }
  };

  const reciteConsonantChaudakhadi = async (consonant: string) => {
    if (recitingKhadi) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingKhadiRef.current = true;
    setRecitingKhadi(true);
    showToast(`🔊 '${consonant}' ची चौदाखडी ऐकवत आहे...`);

    const khadiItems = CHAUDAKHADI_MATRAS.map((m) => {
      if (consonant === "र" && m.swar === "उ") return "रु";
      if (consonant === "र" && m.swar === "ऊ") return "रू";
      return consonant + m.matra;
    });

    try {
      for (let i = 0; i < khadiItems.length; i++) {
        if (!recitingKhadiRef.current) break;
        const char = khadiItems[i];
        setActiveKhadiIndex(i);
        await playAudioPhrase(char, "mr-IN");
        if (!recitingKhadiRef.current) break;
        await new Promise((r) => setTimeout(r, 260));
      }

      if (recitingKhadiRef.current) {
        await onRecordPractice("marathi-swar", `khadi_${consonant}`, `'${consonant}' ची चौदाखडी`);
        showToast(`⭐ '${consonant}' ची चौदाखडी पूर्ण!`);
      }
    } finally {
      recitingKhadiRef.current = false;
      setRecitingKhadi(false);
      setActiveKhadiIndex(null);
    }
  };

  const reciteAllVyanjan = async (vyanjanItems: any[]) => {
    if (recitingVyanjan) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingVyanjanRef.current = true;
    setRecitingVyanjan(true);
    showToast("🔊 संपूर्ण मराठी व्यंजने ऐकवत आहे (क, ख, ग, घ...)...");

    try {
      for (let i = 0; i < vyanjanItems.length; i++) {
        if (!recitingVyanjanRef.current) break;
        const item = vyanjanItems[i];
        setActiveVyanjanKey(item.key);
        const phrase = item.audioText || `${item.letter}, ${item.word}`;
        await playAudioPhrase(phrase, "mr-IN");
        if (!recitingVyanjanRef.current) break;
        await new Promise((r) => setTimeout(r, 280));
      }

      if (recitingVyanjanRef.current) {
        await onRecordPractice("marathi-vyanjan", "vyanjan_all", "मराठी व्यंजने (क ते ज्ञ)");
        showToast("⭐ संपूर्ण व्यंजनांचे वाचन पूर्ण!");
      }
    } finally {
      recitingVyanjanRef.current = false;
      setRecitingVyanjan(false);
      setActiveVyanjanKey(null);
    }
  };

  const reciteAllSwar = async (swarItems: any[]) => {
    if (recitingSwar) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingSwarRef.current = true;
    setRecitingSwar(true);
    showToast("🔊 संपूर्ण १४ स्वर ऐकवत आहे (अ, आ, इ, ई...)...");

    try {
      for (let i = 0; i < swarItems.length; i++) {
        if (!recitingSwarRef.current) break;
        const item = swarItems[i];
        setActiveSwarKey(item.key);
        const phrase = item.audioText || `${item.letter}, ${item.word}`;
        await playAudioPhrase(phrase, "mr-IN");
        if (!recitingSwarRef.current) break;
        await new Promise((r) => setTimeout(r, 280));
      }

      if (recitingSwarRef.current) {
        await onRecordPractice("marathi-swar", "swar_all", "मराठी स्वर (अ ते अः)");
        showToast("⭐ संपूर्ण १४ स्वरांचे वाचन पूर्ण!");
      }
    } finally {
      recitingSwarRef.current = false;
      setRecitingSwar(false);
      setActiveSwarKey(null);
    }
  };

  const speakBodyPart = (name: string) => {
    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(name);
        utterance.rate = 0.92;
        utterance.pitch = 1.06;
        const voices = window.speechSynthesis.getVoices();
        const preferred = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
          voices.find((v) => /female|samantha|zira|karen|susan|victoria|google us english|microsoft.*female/i.test(`${v.name}`));
        if (preferred) utterance.voice = preferred;
        window.speechSynthesis.speak(utterance);
        return;
      } catch (e) {}
    }
    speakPhrase(name, "en-US");
  };

  const handlePartHover = (part: any) => {
    setHoveredPartKey(part.key);
    setSelectedPartKey(part.key);
    if (autoSpeakOnHover) {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current);
      }
      hoverTimerRef.current = setTimeout(() => {
        speakBodyPart(part.name);
      }, 50);
    }
  };

  const handlePartSelect = (part: any) => {
    setSelectedPartKey(part.key);
    setHoveredPartKey(part.key);
    speakBodyPart(part.name);
  };

  const handlePuppyHover = () => {
    setHoveredPartKey("puppy");
    if (autoSpeakOnHover) {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      hoverTimerRef.current = setTimeout(() => {
        speakBodyPart("Puppy! A cute and loyal little dog! Woof woof!");
      }, 50);
    }
  };

  const startQuizGame = () => {
    setQuizActive(true);
    setQuizScore(0);
    setQuizFeedback(null);
    pickNextQuizTarget();
  };

  const stopQuizGame = () => {
    setQuizActive(false);
    setQuizTargetKey(null);
    setQuizFeedback(null);
    stopAllAudio();
  };

  const pickNextQuizTarget = (parts = POSTER_BODY_PARTS) => {
    const randomIndex = Math.floor(Math.random() * parts.length);
    const target = parts[randomIndex];
    setQuizTargetKey(target.key);
    setQuizFeedback(`Can you find the ${target.name}? Hover or click on the ${target.name}!`);
    speakBodyPart(`Can you find the ${target.name}? Point to the ${target.name}!`);
  };

  const handleQuizAnswer = (partKey: string) => {
    if (!quizActive || !quizTargetKey) return;
    const target = POSTER_BODY_PARTS.find((p) => p.key === quizTargetKey);
    if (!target) return;

    if (partKey === quizTargetKey) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback(`🎉 Great job! You found the ${target.name}! ⭐`);
      speakBodyPart(`Awesome! That is the ${target.name}!`);
      onRecordPractice("body-parts", target.key, target.name);
      setTimeout(() => {
        if (quizActive) pickNextQuizTarget();
      }, 1600);
    } else {
      const selected = POSTER_BODY_PARTS.find((p) => p.key === partKey);
      setQuizFeedback(`That's the ${selected?.name || "body part"}! Try finding the ${target.name}!`);
      speakBodyPart(`That is the ${selected?.name || "body part"}. Try finding the ${target.name}!`);
    }
  };

  const reciteAllPosterParts = async () => {
    if (recitingBodyParts) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingBodyPartsRef.current = true;
    setRecitingBodyParts(true);
    showToast("🔊 Reciting all 16 Body Parts from top to bottom...");

    try {
      for (let i = 0; i < POSTER_BODY_PARTS.length; i++) {
        if (!recitingBodyPartsRef.current) break;
        const part = POSTER_BODY_PARTS[i];
        setHoveredPartKey(part.key);
        setSelectedPartKey(part.key);
        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(part.name);
          utterance.rate = 0.88;
          utterance.pitch = 1.06;
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
            voices.find((voice) =>
              /female|samantha|zira|karen|susan|victoria|google us english|microsoft.*female/i.test(
                `${voice.name} ${voice.voiceURI}`
              )
            );
          if (preferred) utterance.voice = preferred;
          utterance.onend = () => setTimeout(resolve, 450);
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        });
      }

      if (recitingBodyPartsRef.current) {
        await onRecordPractice("body-parts", "body_parts_all", "All 16 Body Parts");
        showToast("⭐ Completed recitation for all Body Parts!");
      }
    } finally {
      recitingBodyPartsRef.current = false;
      setRecitingBodyParts(false);
    }
  };

  const reciteAllBodyParts = async (bodyPartsList: any[]) => {
    if (recitingBodyParts) {
      stopAllAudio();
      return;
    }
    stopAllAudio();
    recitingBodyPartsRef.current = true;
    setRecitingBodyParts(true);
    showToast("🔊 Reciting all Body Parts...");

    try {
      for (let i = 0; i < bodyPartsList.length; i++) {
        if (!recitingBodyPartsRef.current) break;
        const part = bodyPartsList[i];
        setHoveredPartKey(part.key);
        setSelectedPartKey(part.key);
        await new Promise<void>((resolve) => {
          const utterance = new SpeechSynthesisUtterance(part.name);
          utterance.rate = 0.88;
          const voices = window.speechSynthesis.getVoices();
          const preferred = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
            voices.find((voice) =>
              /female|samantha|zira|karen|susan|victoria|google uk english female|microsoft.*female/i.test(
                `${voice.name} ${voice.voiceURI}`
              )
            );
          if (preferred) utterance.voice = preferred;
          utterance.onend = () => setTimeout(resolve, 380);
          utterance.onerror = () => resolve();
          window.speechSynthesis.speak(utterance);
        });
        if (!recitingBodyPartsRef.current) break;
      }

      if (recitingBodyPartsRef.current) {
        await onRecordPractice("body-parts", "body_parts_all", "All 21 Body Parts");
        showToast("⭐ Completed recitation for all Body Parts!");
      }
    } finally {
      recitingBodyPartsRef.current = false;
      setRecitingBodyParts(false);
    }
  };

  const activeChart = charts.find((c) => c.slug === activeChartSlug) ||
    (activeChartSlug === "body-parts"
      ? {
          id: "body-parts",
          slug: "body-parts",
          subject: "Science",
          title: "Human Body Parts",
          description: "Explore 21 body parts and 5 sense organs with audio pronunciations in English, Marathi, and Hindi.",
          chart_type: "anatomy",
          chart_data: DEFAULT_BODY_PARTS,
        }
      : charts[0]);
  const records = chartProgress.records || {};
  const summary = chartProgress.summary || {};

  const isTablesActive = activeChartSlug === "tables-2-30" || activeChartSlug === "tables-2-10" || activeChart?.chart_type === "multiplication";
  const tablesChartSlug = charts.find(c => c.chart_type === "multiplication")?.slug || "tables-2-30";

  const mergeChartData = (apiList: any[] | undefined, defaultList: VisualChartItem[]): VisualChartItem[] => {
    if (!apiList || apiList.length === 0) return defaultList;
    return defaultList.map((defItem) => {
      const apiMatch = apiList.find((a) => a.key === defItem.key);
      return apiMatch ? { ...defItem, ...apiMatch, image: defItem.image || apiMatch.image } : defItem;
    });
  };

  return (
    <div className="learning-charts-container" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {toastMessage && (
        <div className="toast" style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
          {toastMessage}
        </div>
      )}

      {/* Header & Submenu Navigation */}
      <div className="chart-subnav" role="tablist" aria-label="Reference Charts Navigation">
        <button
          className={activeChartSlug === "body-parts" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("body-parts")}
          role="tab"
          aria-selected={activeChartSlug === "body-parts"}
        >
          <span style={{ fontSize: "18px" }}>👦</span>
          <span>Body Parts (अवयव)</span>
          {summary.bodyPartsPracticed ? (
            <span style={{ fontSize: "11px", background: "#fef3c7", color: "#b45309", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.bodyPartsPracticed}/21
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "animals" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("animals")}
          role="tab"
          aria-selected={activeChartSlug === "animals"}
        >
          <span style={{ fontSize: "18px" }}>🦁</span>
          <span>Animals (प्राणी)</span>
          {summary.animalsPracticed ? (
            <span style={{ fontSize: "11px", background: "#fef3c7", color: "#b45309", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.animalsPracticed}/24
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "vegetables" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("vegetables")}
          role="tab"
          aria-selected={activeChartSlug === "vegetables"}
        >
          <span style={{ fontSize: "18px" }}>🥕</span>
          <span>Vegetables (भाज्या)</span>
          {summary.vegetablesPracticed ? (
            <span style={{ fontSize: "11px", background: "#ecfdf5", color: "#047857", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.vegetablesPracticed}/20
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "birds" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("birds")}
          role="tab"
          aria-selected={activeChartSlug === "birds"}
        >
          <span style={{ fontSize: "18px" }}>🦜</span>
          <span>Birds (पक्षी)</span>
          {summary.birdsPracticed ? (
            <span style={{ fontSize: "11px", background: "#e0f2fe", color: "#0369a1", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.birdsPracticed}/16
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "emotions" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("emotions")}
          role="tab"
          aria-selected={activeChartSlug === "emotions"}
        >
          <span style={{ fontSize: "18px" }}>😊</span>
          <span>Emotions (भावना)</span>
          {summary.emotionsPracticed ? (
            <span style={{ fontSize: "11px", background: "#fdf4ff", color: "#a21caf", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.emotionsPracticed}/16
            </span>
          ) : null}
        </button>

        <button
          className={isTablesActive ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug(tablesChartSlug)}
          role="tab"
          aria-selected={isTablesActive}
        >
          <span style={{ fontSize: "18px" }}>🔢</span>
          <span>Tables 2–30</span>
          {summary.tablesPracticed ? (
            <span style={{ fontSize: "11px", background: "#e8f5e9", color: "#2e7d32", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.tablesPracticed}/29
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "marathi-swar" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("marathi-swar")}
          role="tab"
          aria-selected={activeChartSlug === "marathi-swar"}
        >
          <span style={{ fontSize: "18px" }}>🕉️</span>
          <span>मराठी चौदाखडी स्वर</span>
          {summary.swarPracticed ? (
            <span style={{ fontSize: "11px", background: "#fff3e0", color: "#e65100", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.swarPracticed}/14
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "marathi-vyanjan" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("marathi-vyanjan")}
          role="tab"
          aria-selected={activeChartSlug === "marathi-vyanjan"}
        >
          <span style={{ fontSize: "18px" }}>🪷</span>
          <span>मराठी व्यंजने (क-ख-ग-घ)</span>
          {summary.vyanjanPracticed ? (
            <span style={{ fontSize: "11px", background: "#e0f2fe", color: "#0284c7", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.vyanjanPracticed}/36
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "english-alphabet" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("english-alphabet")}
          role="tab"
          aria-selected={activeChartSlug === "english-alphabet"}
        >
          <span style={{ fontSize: "18px" }}>🔤</span>
          <span>A–Z Big &amp; Small</span>
          {summary.lettersPracticed ? (
            <span style={{ fontSize: "11px", background: "#f3e8ff", color: "#7e22ce", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.lettersPracticed}/26
            </span>
          ) : null}
        </button>

        <button
          className={activeChartSlug === "phonics" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("phonics")}
          role="tab"
          aria-selected={activeChartSlug === "phonics"}
        >
          <span style={{ fontSize: "18px" }}>🗣️</span>
          <span>Phonics (CVC शब्द)</span>
          {summary.phonicsPracticed ? (
            <span style={{ fontSize: "11px", background: "#fee2e2", color: "#b91c1c", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.phonicsPracticed}/{summary.phonicsTotal || 249}
            </span>
          ) : null}
        </button>
      </div>

      {/* Summary Metrics Bar */}
      <div className="chart-summary-bar">
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "20px" }}>📊</span>
          <div>
            <strong style={{ display: "block", fontSize: "15px", color: "var(--teal-dark)" }}>
              {isTeacher ? `Student Records: ${childName}` : `Practice Journey for ${childName}`}
            </strong>
            <small style={{ color: "var(--muted)" }}>
              {isTeacher
                ? "Review recorded student practice sessions or recite along in class."
                : "Listen, recite aloud, and earn stars as you practice each chart!"}
            </small>
          </div>
        </div>

        <div className="chart-summary-stats">
          <div className="chart-stat-chip">
            <span>🫀 Body Parts:</span>
            <strong>{summary.bodyPartsPracticed || 0} / 21</strong>
          </div>
          <div className="chart-stat-chip">
            <span>🔢 Tables:</span>
            <strong>{summary.tablesPracticed || 0} / 29</strong>
          </div>
          <div className="chart-stat-chip">
            <span>🕉️ 14 स्वर:</span>
            <strong>{summary.swarPracticed || 0} / 14</strong>
          </div>
          <div className="chart-stat-chip">
            <span>🪷 व्यंजने:</span>
            <strong>{summary.vyanjanPracticed || 0} / 36</strong>
          </div>
          <div className="chart-stat-chip">
            <span>🔤 Alphabet:</span>
            <strong>{summary.lettersPracticed || 0} / 26</strong>
          </div>
          <div className="chart-stat-chip">
            <span>⭐ Sessions:</span>
            <strong>{summary.totalPracticeSessions || 0}</strong>
          </div>
        </div>
      </div>

      {/* SUBMENU 1: Tables 2 to 30 */}
      {isTablesActive && (
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>Multiplication Tables 2 to 30</h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
                Select a table pill below to view, listen, recite aloud, and log practice sessions.
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
              {selectedTable === "all" && (
                <div className="table-layout-toggle-group">
                  <button
                    type="button"
                    className={`table-layout-toggle-btn ${allTablesLayout === "columns" ? "active" : ""}`}
                    onClick={() => setAllTablesLayout("columns")}
                    title="View as vertical columns side-by-side (poster view)"
                  >
                    <span>📑</span> Vertical Columns
                  </button>
                  <button
                    type="button"
                    className={`table-layout-toggle-btn ${allTablesLayout === "stack" ? "active" : ""}`}
                    onClick={() => setAllTablesLayout("stack")}
                    title="View as continuous vertical feed"
                  >
                    <span>↕️</span> Vertical Stack
                  </button>
                </div>
              )}
              <div className="table-range-quick-filters" style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>Jump to:</span>
                {[
                  { id: "all", label: "All (2–30)" },
                  { id: "2-10", label: "Tables 2–10" },
                  { id: "11-20", label: "Tables 11–20" },
                  { id: "21-30", label: "Tables 21–30" },
                ].map((grp) => (
                  <button
                    key={grp.id}
                    type="button"
                    className={`table-range-filter-pill ${tableGroupFilter === grp.id ? "active" : ""}`}
                    onClick={() => setTableGroupFilter(grp.id as any)}
                  >
                    {grp.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Table Selector Pills */}
          <div className="table-pills-row" style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {((activeChart?.chart_data?.map((t: any) => t.table) as number[]) || Array.from({ length: 29 }, (_, i) => i + 2))
              .filter((num) => {
                if (tableGroupFilter === "2-10") return num >= 2 && num <= 10;
                if (tableGroupFilter === "11-20") return num >= 11 && num <= 20;
                if (tableGroupFilter === "21-30") return num >= 21 && num <= 30;
                return true;
              })
              .map((num) => {
                const rec = records[`table_${num}`];
                const isPracticed = !!rec && rec.practiceCount > 0;
                return (
                  <button
                    key={num}
                    className={selectedTable === num ? "table-pill-btn active" : "table-pill-btn"}
                    onClick={() => setSelectedTable(num)}
                  >
                    Table {num} {isPracticed ? `⭐${rec.practiceCount > 1 ? ` (${rec.practiceCount})` : ""}` : ""}
                  </button>
                );
              })}
            <button
              className={selectedTable === "all" ? "table-pill-btn active" : "table-pill-btn"}
              onClick={() => setSelectedTable("all")}
            >
              📖 All Tables {tableGroupFilter === "all" ? "(2–30)" : `(${tableGroupFilter})`}
            </button>
          </div>

          {/* Table Display */}
          {selectedTable === "all" ? (
            <div className={allTablesLayout === "columns" ? "all-tables-vertical-grid" : "all-tables-vertical-stack"}>
              {activeChart?.chart_data
                ?.filter((tbl: any) => {
                  if (tableGroupFilter === "2-10") return tbl.table >= 2 && tbl.table <= 10;
                  if (tableGroupFilter === "11-20") return tbl.table >= 11 && tbl.table <= 20;
                  if (tableGroupFilter === "21-30") return tbl.table >= 21 && tbl.table <= 30;
                  return true;
                })
                .map((tbl: any) => {
                const rec = records[tbl.key];
                const isPracticed = !!rec && rec.practiceCount > 0;
                const isReciting = recitingTable === tbl.table;
                return (
                  <div key={tbl.key} className="table-display-card vertical-table-card">
                    <div className="table-display-header">
                      <div>
                        <h3>{tbl.label}</h3>
                        {isPracticed && (
                          <small style={{ color: "#2e7d32", fontWeight: 700, display: "block", marginTop: "2px" }}>
                            ⭐ Practiced {rec.practiceCount} time{rec.practiceCount > 1 ? "s" : ""}
                          </small>
                        )}
                      </div>
                      <div className="table-actions-group">
                        <button
                          className="recite-audio-btn"
                          onClick={() => reciteFullTable(tbl.table, tbl.items)}
                          title="Recite entire table aloud"
                          style={{ padding: "5px 9px", fontSize: "11px" }}
                        >
                          {isReciting ? "⏹️ Stop" : "🔊 Recite"}
                        </button>
                        <button
                          className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                          onClick={() => onRecordPractice(tablesChartSlug, tbl.key, tbl.label)}
                          disabled={savingChartItem === tbl.key}
                          style={{ padding: "5px 9px", fontSize: "11px" }}
                        >
                          {isPracticed ? `⭐ ${rec.practiceCount}x` : "☆ Practice"}
                        </button>
                      </div>
                    </div>
                    {/* Strictly vertical equations list 1 to 10 */}
                    <div className="table-equations-vertical-list">
                      {tbl.items?.map((item: any) => {
                        const phrase = formatTableRecitePhrase(tbl.table, item.multiplier, item.product, item.reciteText);
                        const isRowReciting = recitingTable === tbl.table && recitingMultiplier === item.multiplier;
                        return (
                          <div
                            key={item.multiplier}
                            className={`table-equation-item vertical-equation-row ${isRowReciting ? "active-reciting" : ""}`}
                            onClick={() => speakPhrase(phrase)}
                            title={`Click to hear: "${phrase}"`}
                          >
                            <span className="equation-math">{tbl.table} × {item.multiplier} =</span>
                            <div className="equation-result-box">
                              <span className="product-badge">{item.product}</span>
                              <span className="audio-icon-hint" title="Listen">🔊</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            (() => {
              const currentTableObj = activeChart?.chart_data?.find(
                (tbl: any) => tbl.table === selectedTable
              ) || activeChart?.chart_data?.[0];

              if (!currentTableObj) return <p>Loading table data...</p>;

              const rec = records[currentTableObj.key];
              const isPracticed = !!rec && rec.practiceCount > 0;
              const isReciting = recitingTable === currentTableObj.table;

              return (
                <div className="table-display-card single-table-vertical-card">
                  <div className="table-display-header">
                    <div>
                      <h3>{currentTableObj.label}</h3>
                      <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--muted)" }}>
                        {isPracticed ? (
                          <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                            ⭐ Practiced {rec.practiceCount} time{rec.practiceCount > 1 ? "s" : ""} · Last: {new Date(rec.lastPracticedAt).toLocaleDateString()}
                          </span>
                        ) : (
                          "Click equations to hear phonetics, or recite aloud to earn your practice star!"
                        )}
                      </p>
                    </div>
                    <div className="table-actions-group">
                      <button
                        className="recite-audio-btn"
                        onClick={() => reciteFullTable(currentTableObj.table, currentTableObj.items)}
                        aria-label={isReciting ? "Stop reciting table" : `Recite table of ${currentTableObj.table} aloud`}
                      >
                        <span>{isReciting ? "⏹️" : "🔊"}</span>
                        <span>{isReciting ? "Stop Reciting" : "Recite Table Aloud"}</span>
                      </button>
                      <button
                        className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                        onClick={() => onRecordPractice(tablesChartSlug, currentTableObj.key, currentTableObj.label)}
                        disabled={savingChartItem === currentTableObj.key}
                      >
                        <span>{isPracticed ? "⭐" : "☆"}</span>
                        <span>{isPracticed ? `Practiced (${rec.practiceCount}x)` : "Mark as Practiced"}</span>
                      </button>
                    </div>
                  </div>

                  {/* Strictly vertical equations list 1 to 10 */}
                  <div className="table-equations-vertical-list">
                    {currentTableObj.items?.map((item: any) => {
                      const phrase = formatTableRecitePhrase(currentTableObj.table, item.multiplier, item.product, item.reciteText);
                      const isRowReciting = recitingTable === currentTableObj.table && recitingMultiplier === item.multiplier;
                      return (
                        <div
                          key={item.multiplier}
                          className={`table-equation-item vertical-equation-row ${isRowReciting ? "active-reciting" : ""}`}
                          onClick={() => speakPhrase(phrase)}
                          title={`Click to pronounce: "${phrase}"`}
                        >
                          <span className="equation-math">{currentTableObj.table} × {item.multiplier} =</span>
                          <div className="equation-result-box">
                            <span className="product-badge">{item.product}</span>
                            <span className="audio-icon-hint" title="Listen">🔊</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()
          )}
        </section>
      )}

      {/* SUBMENU 2: Marathi 14-Khadi Swar */}
      {activeChartSlug === "marathi-swar" && (
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>मराठी चौदाखडी स्वर (14-Khadi Swar)</h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
                महाराष्ट्र शासनाच्या अधिकृत अभ्यासक्रमानुसार आधुनिक <strong>१४ स्वर</strong> (ॲ आणि ऑ सह) व मात्रा चिन्हे.
              </p>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
              {chaudakhadiMode === "swar" && (
                <button
                  className="recite-audio-btn"
                  style={{ background: "#2a9d8f", color: "#fff" }}
                  onClick={() => reciteAllSwar(activeChart?.chart_data || [])}
                >
                  <span>{recitingSwar ? "⏹️" : "🔊"}</span>
                  <span>{recitingSwar ? "थांबवा (Stop)" : "संपूर्ण स्वर ऐका (Recite All)"}</span>
                </button>
              )}

              {/* Mode Switcher */}
              <div className="chaudakhadi-mode-tabs">
                <button
                  className={chaudakhadiMode === "swar" ? "chaudakhadi-mode-tab active" : "chaudakhadi-mode-tab"}
                  onClick={() => setChaudakhadiMode("swar")}
                >
                  🕉️ १४ स्वर व मात्रा (14 Swar)
                </button>
                <button
                  className={chaudakhadiMode === "consonant" ? "chaudakhadi-mode-tab active" : "chaudakhadi-mode-tab"}
                  onClick={() => setChaudakhadiMode("consonant")}
                >
                  🔤 व्यंजन चौदाखडी (क, ख, ग...)
                </button>
              </div>
            </div>
          </div>

          {/* MODE 1: 14 Swar Cards */}
          {chaudakhadiMode === "swar" ? (
            <div className="swar-grid">
              {activeChart?.chart_data?.map((swar: any) => {
                const rec = records[swar.key];
                const isPracticed = !!rec && rec.practiceCount > 0;
                const isSpecial = swar.letter === "ॲ" || swar.letter === "ऑ";
                return (
                  <div
                    key={swar.key}
                    className={`swar-card ${isPracticed ? "practiced" : ""} ${activeSwarKey === swar.key ? "active-reciting" : ""}`}
                    onClick={() => speakPhrase(swar.audioText || `${swar.letter}, ${swar.word}`, "mr-IN")}
                    title={`Click to listen: ${swar.letter} (${swar.word})`}
                  >
                    {isSpecial && <span className="chaudakhadi-badge">चौदाखडी विशेष</span>}
                    <span className="swar-practiced-star" title={isPracticed ? `Practiced ${rec.practiceCount}x` : "Not practiced yet"}>
                      {isPracticed ? `⭐ ${rec.practiceCount > 1 ? rec.practiceCount : ""}` : "☆"}
                    </span>
                    <div className="swar-letter">{swar.letter}</div>
                    <span className="swar-translit">{swar.transliteration}</span>

                    {/* Matra information */}
                    {swar.matraName && (
                      <span className="swar-matra-badge">
                        {swar.matra ? `मात्रा: ${swar.matra} (${swar.matraName})` : swar.matraName}
                      </span>
                    )}

                    <div className="swar-word">{swar.word}</div>
                    <div className="swar-meaning">{swar.englishWord}</div>

                    <div style={{ display: "flex", gap: "8px", marginTop: "12px", width: "100%", justifyContent: "center" }}>
                      <button
                        className="swar-audio-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPhrase(swar.audioText || `${swar.letter}, ${swar.word}`, "mr-IN");
                        }}
                        title="Listen pronunciation"
                      >
                        <span>🔊</span>
                        <span>ऐका</span>
                      </button>
                      <button
                        className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                        style={{ padding: "6px 12px", fontSize: "11px", borderRadius: "20px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordPractice("marathi-swar", swar.key, `स्वर ${swar.letter} (${swar.word})`);
                        }}
                        disabled={savingChartItem === swar.key}
                        title="Mark practiced"
                      >
                        <span>{isPracticed ? "⭐" : "☆"}</span>
                        <span>{isPracticed ? `${rec.practiceCount}x` : "सराव"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* MODE 2: Consonant 14-Khadi Generator */
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div>
                <small style={{ fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                  व्यंजन निवडा (Select Consonant):
                </small>
                <div className="consonant-pills-row">
                  {MARATHI_CONSONANTS.map((c) => (
                    <button
                      key={c}
                      className={selectedConsonant === c ? "consonant-pill-btn active" : "consonant-pill-btn"}
                      onClick={() => setSelectedConsonant(c)}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Chaudakhadi Row Display Card */}
              <div className="table-display-card" style={{ background: "#fffaf6", borderColor: "#f7d5c9" }}>
                <div className="table-display-header" style={{ borderColor: "#f3c7b7" }}>
                  <div>
                    <h3 style={{ color: "#d9532f", fontSize: "22px" }}>
                      '{selectedConsonant}' ची संपूर्ण चौदाखडी (14-Khadi of '{selectedConsonant}')
                    </h3>
                    <p style={{ margin: "4px 0 0 0", fontSize: "13px", color: "var(--muted)" }}>
                      {records[`khadi_${selectedConsonant}`] ? (
                        <span style={{ color: "#2e7d32", fontWeight: 700 }}>
                          ⭐ Practiced {records[`khadi_${selectedConsonant}`].practiceCount} time(s)
                        </span>
                      ) : (
                        "Click any letter to hear its sound, or recite all 14 variations aloud!"
                      )}
                    </p>
                  </div>
                  <div className="table-actions-group">
                    <button
                      className="recite-audio-btn"
                      style={{ background: "#e76f51", color: "#fff" }}
                      onClick={() => reciteConsonantChaudakhadi(selectedConsonant)}
                    >
                      <span>{recitingKhadi ? "⏹️" : "🔊"}</span>
                      <span>{recitingKhadi ? "थांबवा (Stop)" : "संपूर्ण चौदाखडी ऐका (Recite)"}</span>
                    </button>
                    <button
                      className={`mark-practiced-btn ${records[`khadi_${selectedConsonant}`] ? "practiced" : ""}`}
                      onClick={() => onRecordPractice("marathi-swar", `khadi_${selectedConsonant}`, `'${selectedConsonant}' ची चौदाखडी`)}
                      disabled={savingChartItem === `khadi_${selectedConsonant}`}
                    >
                      <span>{records[`khadi_${selectedConsonant}`] ? "⭐" : "☆"}</span>
                      <span>
                        {records[`khadi_${selectedConsonant}`]
                          ? `Practiced (${records[`khadi_${selectedConsonant}`].practiceCount}x)`
                          : "Mark Practiced"}
                      </span>
                    </button>
                  </div>
                </div>

                {/* 14 Items Grid for the consonant */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: "10px" }}>
                  {CHAUDAKHADI_MATRAS.map((m, idx) => {
                    let char = selectedConsonant + m.matra;
                    if (selectedConsonant === "र" && m.swar === "उ") char = "रु";
                    if (selectedConsonant === "र" && m.swar === "ऊ") char = "रू";

                    return (
                      <div
                        key={m.swar}
                        className={`table-equation-item ${activeKhadiIndex === idx ? "active-reciting" : ""}`}
                        style={{
                          flexDirection: "column",
                          alignItems: "center",
                          padding: "14px 10px",
                          position: "relative",
                          border: activeKhadiIndex === idx ? "2.5px solid #e76f51" : m.isNew ? "1.5px solid #e76f51" : "1px solid var(--line)",
                          background: activeKhadiIndex === idx ? "#ffe8e0" : m.isNew ? "#fff4f0" : "#fff",
                          transform: activeKhadiIndex === idx ? "scale(1.06)" : "none",
                          boxShadow: activeKhadiIndex === idx ? "0 8px 24px rgba(231, 111, 81, 0.35)" : "none",
                          transition: "all 0.18s ease",
                        }}
                        onClick={() => speakPhrase(char, "mr-IN")}
                        title={`उच्चार: ${char} (${selectedConsonant} + ${m.swar})`}
                      >
                        {m.isNew && (
                          <span
                            style={{
                              position: "absolute",
                              top: "4px",
                              right: "6px",
                              fontSize: "9px",
                              fontWeight: 800,
                              color: "#e76f51",
                              background: "#ffe3da",
                              padding: "1px 4px",
                              borderRadius: "4px",
                            }}
                          >
                            नवीन
                          </span>
                        )}
                        <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 700 }}>
                          #{idx + 1} ({m.swar})
                        </span>
                        <span
                          style={{
                            fontSize: "36px",
                            fontWeight: 800,
                            color: m.isNew ? "#e76f51" : "var(--teal-dark)",
                            fontFamily: "'Noto Sans Devanagari', 'Nirmala UI', sans-serif",
                            margin: "4px 0",
                          }}
                        >
                          {char}
                        </span>
                        <span style={{ fontSize: "11px", color: "var(--muted)" }}>{m.matraName}</span>
                        <span style={{ fontSize: "10px", color: "var(--teal)", marginTop: "4px" }}>🔊 ऐका</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* SUBMENU 3: Marathi Vyanjan (क, ख, ग, घ...) */}
      {activeChartSlug === "marathi-vyanjan" && (
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>मराठी व्यंजने: क, ख, ग, घ... (३६ व्यंजने)</h2>
              <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
                क ते ज्ञ पर्यंतची सर्व व्यंजने, चित्रे, उच्चार व वर्गवार अभ्यास. Click cards to hear speech or recite aloud.
              </p>
            </div>

            <button
              className="recite-audio-btn"
              style={{ background: "#2a9d8f", color: "#fff" }}
              onClick={() => reciteAllVyanjan(activeChart?.chart_data || [])}
            >
              <span>{recitingVyanjan ? "⏹️" : "🔊"}</span>
              <span>{recitingVyanjan ? "थांबवा (Stop)" : "संपूर्ण व्यंजने ऐका (Recite All)"}</span>
            </button>
          </div>

          {/* Vyanjan Group Filter Toolbar */}
          <div className="vyanjan-toolbar">
            <div className="vyanjan-filter-group">
              {[
                { id: "all", label: "सर्व व्यंजने (36)" },
                { id: "क वर्ग", label: "क वर्ग (क-घ)" },
                { id: "च वर्ग", label: "च वर्ग (च-झ)" },
                { id: "ट वर्ग", label: "ट वर्ग (ट-ण)" },
                { id: "त वर्ग", label: "त वर्ग (त-न)" },
                { id: "प वर्ग", label: "प वर्ग (प-म)" },
                { id: "अंतस्थ", label: "अंतस्थ (य-व)" },
                { id: "उष्मे", label: "उष्मे (श-ह)" },
                { id: "संयुक्त", label: "संयुक्त (क्ष-ज्ञ)" },
              ].map((filter) => (
                <button
                  key={filter.id}
                  className={vyanjanFilter === filter.id ? "vyanjan-filter-btn active" : "vyanjan-filter-btn"}
                  onClick={() => setVyanjanFilter(filter.id)}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>

          {/* Vyanjan Grid */}
          <div className="vyanjan-grid">
            {activeChart?.chart_data
              ?.filter((item: any) => {
                if (vyanjanFilter === "all") return true;
                if (vyanjanFilter === "उष्मे") return item.group === "उष्मे" || item.group === "महाप्राण" || item.group === "स्वतंत्र";
                return item.group === vyanjanFilter;
              })
              .map((item: any) => {
                const rec = records[item.key];
                const isPracticed = !!rec && rec.practiceCount > 0;
                return (
                  <div
                    key={item.key}
                    className={`vyanjan-card ${isPracticed ? "practiced" : ""} ${activeVyanjanKey === item.key ? "active-reciting" : ""}`}
                    onClick={() => speakPhrase(item.audioText || `${item.letter}, ${item.word}`, "mr-IN")}
                    title={`Click to pronounce: ${item.letter} (${item.word})`}
                  >
                    <span className="vyanjan-group-badge">{item.group}</span>
                    <span className="swar-practiced-star" title={isPracticed ? `Practiced ${rec.practiceCount}x` : "Not practiced yet"}>
                      {isPracticed ? `⭐ ${rec.practiceCount > 1 ? rec.practiceCount : ""}` : "☆"}
                    </span>

                    <div className="vyanjan-letter">{item.letter}</div>
                    <span className="vyanjan-translit">{item.transliteration}</span>

                    <div className="vyanjan-word">{item.word}</div>
                    <div className="vyanjan-meaning">{item.englishWord}</div>

                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", width: "100%", justifyContent: "center", flexWrap: "wrap" }}>
                      <button
                        className="swar-audio-btn"
                        style={{ padding: "5px 10px", fontSize: "11px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPhrase(item.audioText || `${item.letter}, ${item.word}`, "mr-IN");
                        }}
                        title="Listen pronunciation"
                      >
                        <span>🔊</span>
                        <span>ऐका</span>
                      </button>
                      <button
                        className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                        style={{ padding: "5px 10px", fontSize: "11px", borderRadius: "16px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordPractice("marathi-vyanjan", item.key, `व्यंजन ${item.letter} (${item.word})`);
                        }}
                        disabled={savingChartItem === item.key}
                        title="Mark practiced"
                      >
                        <span>{isPracticed ? "⭐" : "☆"}</span>
                        <span>{isPracticed ? `${rec.practiceCount}x` : "सराव"}</span>
                      </button>
                    </div>

                    <button
                      className="vyanjan-shortcut-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedConsonant(item.letter);
                        setActiveChartSlug("marathi-swar");
                        setChaudakhadiMode("consonant");
                      }}
                      title={`'${item.letter}' ची चौदाखडी उघडा`}
                    >
                      १४-खडी पहा →
                    </button>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* SUBMENU 4: English Alphabet */}
      {activeChartSlug === "english-alphabet" && (
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>English Alphabet: A–Z Big &amp; Small Letters</h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
              Capital and small letter pairings, phonics cues, and beginner vocabulary. Filter by vowels or consonants.
            </p>
          </div>

          {/* Filter Toolbar */}
          <div className="alphabet-toolbar">
            <div className="alphabet-filter-group">
              <button
                className={alphabetFilter === "all" ? "alphabet-filter-btn active" : "alphabet-filter-btn"}
                onClick={() => setAlphabetFilter("all")}
              >
                All Letters (26)
              </button>
              <button
                className={alphabetFilter === "vowels" ? "alphabet-filter-btn active" : "alphabet-filter-btn"}
                onClick={() => setAlphabetFilter("vowels")}
              >
                Vowels (5)
              </button>
              <button
                className={alphabetFilter === "consonants" ? "alphabet-filter-btn active" : "alphabet-filter-btn"}
                onClick={() => setAlphabetFilter("consonants")}
              >
                Consonants (21)
              </button>
            </div>
          </div>

          {/* Alphabet Grid */}
          <div className="alphabet-grid">
            {activeChart?.chart_data
              ?.filter((letter: any) => {
                if (alphabetFilter === "vowels") return letter.isVowel;
                if (alphabetFilter === "consonants") return !letter.isVowel;
                return true;
              })
              .map((item: any) => {
                const rec = records[item.key];
                const isPracticed = !!rec && rec.practiceCount > 0;
                return (
                  <div
                    key={item.key}
                    className={`letter-card ${isPracticed ? "practiced" : ""}`}
                    onClick={() => speakPhrase(item.audioText || `Capital ${item.upper}, small ${item.lower}, as in ${item.word}`)}
                    title={`Click to listen: ${item.upper} ${item.lower} for ${item.word}`}
                  >
                    {item.isVowel && <span className="letter-vowel-badge">Vowel</span>}
                    <span className="letter-practiced-star" title={isPracticed ? `Practiced ${rec.practiceCount}x` : "Not practiced yet"}>
                      {isPracticed ? `⭐ ${rec.practiceCount > 1 ? rec.practiceCount : ""}` : "☆"}
                    </span>

                    <div className="letter-pairs-display">
                      <span className="letter-upper">{item.upper}</span>
                      <span className="letter-lower">{item.lower}</span>
                    </div>

                    <span className="letter-phonic">{item.phonic}</span>
                    <div className="letter-word">{item.word}</div>

                    <div style={{ display: "flex", gap: "6px", marginTop: "10px", width: "100%", justifyContent: "center" }}>
                      <button
                        className="letter-audio-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          speakPhrase(item.audioText || `Capital ${item.upper}, small ${item.lower}, as in ${item.word}`);
                        }}
                        title="Pronounce letter and word"
                      >
                        <span>🔊</span>
                        <span>Say</span>
                      </button>
                      <button
                        className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                        style={{ padding: "5px 10px", fontSize: "11px", borderRadius: "16px" }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onRecordPractice("english-alphabet", item.key, `Letter ${item.upper}${item.lower} (${item.word})`);
                        }}
                        disabled={savingChartItem === item.key}
                        title="Mark practiced"
                      >
                        <span>{isPracticed ? "⭐" : "☆"}</span>
                        <span>{isPracticed ? `${rec.practiceCount}x` : "Practice"}</span>
                      </button>
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* SUBMENU 5: Human Body Parts Chart */}
      {activeChartSlug === "body-parts" && (() => {
        const bodyPartsList: any[] = (activeChart?.chart_data && activeChart.chart_data.length > 0)
          ? activeChart.chart_data
          : DEFAULT_BODY_PARTS;

        const displayedParts = bodyPartsList.filter((p: any) => {
          if (bodyCategoryFilter === "all") return true;
          return p.category === bodyCategoryFilter;
        });

        const allPartsPool = [...POSTER_BODY_PARTS, ...DEFAULT_BODY_PARTS];
        const currentPart = allPartsPool.find((p: any) => p.key === (selectedPartKey || hoveredPartKey)) || POSTER_BODY_PARTS[0];
        const currentRec = records[currentPart?.key];
        const isCurrentPracticed = !!currentRec && currentRec.practiceCount > 0;

        return (
          <section className="panel body-parts-panel" style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Header & Controls */}
            <div className="body-parts-header-row">
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "26px" }}>👦</span>
                  <h2 style={{ margin: 0, fontSize: "22px", color: "var(--ink)", fontWeight: 800 }}>
                    Human Body Parts &amp; 5 Senses (मानवी शरीराचे अवयव)
                  </h2>
                </div>
                <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
                  Hover over any body part or label to hear its name pronounced aloud automatically! Learn English, Marathi, and Hindi names.
                </p>
              </div>

              <div className="body-parts-action-toolbar">
                {/* View Mode Toggle */}
                <div className="body-view-mode-toggle" role="group" aria-label="View mode">
                  <button
                    type="button"
                    className={`body-mode-btn ${bodyChartMode === "poster" ? "active" : ""}`}
                    onClick={() => setBodyChartMode("poster")}
                    title="Vibrant 3D Poster View"
                  >
                    <span>🌟 3D Poster View</span>
                  </button>
                  <button
                    type="button"
                    className={`body-mode-btn ${bodyChartMode === "vector" ? "active" : ""}`}
                    onClick={() => setBodyChartMode("vector")}
                    title="Vector Diagram View"
                  >
                    <span>✏️ Vector View</span>
                  </button>
                </div>

                <button
                  type="button"
                  className={`body-toggle-hover-btn ${autoSpeakOnHover ? "active" : ""}`}
                  onClick={() => setAutoSpeakOnHover(!autoSpeakOnHover)}
                  title="Toggle automatic pronunciation when hovering over body parts"
                >
                  <span style={{ fontSize: "16px" }}>{autoSpeakOnHover ? "🔊" : "🔈"}</span>
                  <span>{autoSpeakOnHover ? "Hover to Speak: ON" : "Hover to Speak: OFF"}</span>
                </button>

                <button
                  type="button"
                  className={`body-recite-btn ${recitingBodyParts ? "reciting" : ""}`}
                  onClick={() => (bodyChartMode === "poster" ? reciteAllPosterParts() : reciteAllBodyParts(displayedParts))}
                  title="Recite all body parts aloud sequentially"
                >
                  <span>{recitingBodyParts ? "⏹️ Stop Reciting" : "▶️ Recite All"}</span>
                </button>

                <button
                  type="button"
                  className={`body-quiz-btn ${quizActive ? "active" : ""}`}
                  onClick={() => (quizActive ? stopQuizGame() : startQuizGame())}
                  title="Interactive quiz: Can you find the body part?"
                >
                  <span>{quizActive ? "⏹️ Exit Quiz" : "🎯 Quiz Game"}</span>
                </button>
              </div>
            </div>

            {/* Quiz Banner if active */}
            {quizActive && (
              <div className="body-quiz-banner">
                <div className="body-quiz-banner-left">
                  <span style={{ fontSize: "28px" }}>🎯</span>
                  <div>
                    <div style={{ fontSize: "17px", fontWeight: 800, color: "#1e293b" }}>
                      {quizFeedback || "Find the body part!"}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>
                      Hover or click on the body part on the poster to answer!
                    </div>
                  </div>
                </div>
                <div className="body-quiz-score-badge">
                  <span>⭐ Score: <strong>{quizScore}</strong></span>
                </div>
              </div>
            )}

            {/* Category Filter Pills (when in vector view or for filtering cards) */}
            <div className="body-category-pills-bar">
              <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>Filter Parts:</span>
              {[
                { id: "all", label: "All Parts (21)", icon: "✨" },
                { id: "sense", label: "5 Sense Organs (5)", icon: "👀" },
                { id: "head", label: "Head & Face (6)", icon: "🗣️" },
                { id: "upper", label: "Upper Body & Arms (6)", icon: "💪" },
                { id: "lower", label: "Lower Body & Legs (4)", icon: "🦵" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  className={`body-category-pill ${bodyCategoryFilter === cat.id ? "active" : ""}`}
                  onClick={() => setBodyCategoryFilter(cat.id as any)}
                >
                  <span>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>

            {/* Main Interactive Stage: 3D Poster View or Vector Diagram + Spotlight Card */}
            <div className="body-parts-stage-container">
              {bodyChartMode === "poster" ? (
                /* === 3D POSTER VIEW (Default): Looks identical to the reference poster image === */
                <div className="body-poster-viewer-box">
                  <div className="body-anatomy-header-hint">
                    <span>✨ 3D Boy Body Parts Poster — Hover over any body part, arrow, or label to hear its name!</span>
                  </div>

                  <div className="poster-relative-stage">
                    {/* Underlying High-Res Poster Image */}
                    <img
                      src="/assets/body-parts-boy-poster.jpg"
                      alt="Human Boy Body Parts Poster"
                      className="poster-base-image"
                      draggable={false}
                    />

                    {/* SVG Interactive Overlay covering 100% with viewBox="0 0 818 1024" */}
                    <svg
                      viewBox="0 0 818 1024"
                      className="poster-interactive-svg-overlay"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <filter id="posterHighlightGlow" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.85" />
                        </filter>
                        <radialGradient id="hotspotRadarGrad" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.85" />
                          <stop offset="60%" stopColor="#ea580c" stopOpacity="0.45" />
                          <stop offset="100%" stopColor="#ea580c" stopOpacity="0" />
                        </radialGradient>
                      </defs>

                      {/* 16 Interactive Poster Body Parts */}
                      {POSTER_BODY_PARTS.map((part) => {
                        const isHovered = hoveredPartKey === part.key;
                        const isSelected = selectedPartKey === part.key;
                        const isQuizTarget = quizActive && quizTargetKey === part.key;
                        const isHighlighted = isHovered || isSelected || isQuizTarget;

                        return (
                          <g
                            key={`poster-part-${part.key}`}
                            className={`poster-part-group ${isHighlighted ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => (quizActive ? handleQuizAnswer(part.key) : handlePartHover(part))}
                            onClick={() => (quizActive ? handleQuizAnswer(part.key) : handlePartSelect(part))}
                          >
                            {/* 1. Pill Hitbox & Highlight */}
                            {isHighlighted && (
                              <rect
                                x={part.pill.x - 3}
                                y={part.pill.y - 3}
                                width={part.pill.w + 6}
                                height={part.pill.h + 6}
                                rx={34}
                                fill="rgba(255, 255, 255, 0.15)"
                                stroke={part.themeColor}
                                strokeWidth={5}
                                filter="url(#posterHighlightGlow)"
                                className="poster-pill-glow-outline"
                              />
                            )}
                            {/* Pill Hitbox (Transparent, captures hover) */}
                            <rect
                              x={part.pill.x}
                              y={part.pill.y}
                              width={part.pill.w}
                              height={part.pill.h}
                              rx={32}
                              fill="transparent"
                              className="poster-pill-hitbox"
                            >
                              <title>{`${part.name} (${part.marathi.split("(")[0].trim()}) — Hover to hear pronunciation`}</title>
                            </rect>

                            {/* 2. Pointer Line Hitbox & Highlight */}
                            {isHighlighted && (
                              <line
                                x1={part.line.x1}
                                y1={part.line.y1}
                                x2={part.line.x2}
                                y2={part.line.y2}
                                stroke={part.themeColor}
                                strokeWidth={5}
                                strokeDasharray="8 4"
                                strokeLinecap="round"
                                className="poster-line-active-glow"
                              />
                            )}
                            {/* Line Hitbox */}
                            <line
                              x1={part.line.x1}
                              y1={part.line.y1}
                              x2={part.line.x2}
                              y2={part.line.y2}
                              stroke="transparent"
                              strokeWidth={24}
                              strokeLinecap="round"
                              className="poster-line-hitbox"
                            />

                            {/* 3. Boy Body Part Hitbox & Hotspot Ring */}
                            {isHighlighted && (
                              <g className="poster-hotspot-highlight-group">
                                <circle
                                  cx={part.boyHotspot.cx}
                                  cy={part.boyHotspot.cy}
                                  r={part.boyHotspot.r + 14}
                                  fill="url(#hotspotRadarGrad)"
                                  className="poster-radar-pulse"
                                />
                                <circle
                                  cx={part.boyHotspot.cx}
                                  cy={part.boyHotspot.cy}
                                  r={part.boyHotspot.r}
                                  fill={part.themeColor}
                                  fillOpacity={0.4}
                                  stroke="#ffffff"
                                  strokeWidth={3}
                                />
                                <circle
                                  cx={part.boyHotspot.cx}
                                  cy={part.boyHotspot.cy}
                                  r={6}
                                  fill="#ffffff"
                                />
                              </g>
                            )}
                            {/* Boy Hotspot Hitbox */}
                            <circle
                              cx={part.boyHotspot.cx}
                              cy={part.boyHotspot.cy}
                              r={part.boyHotspot.r}
                              fill="transparent"
                              className="poster-hotspot-hitbox"
                            >
                              <title>{`Boy's ${part.name} — Hover to hear`}</title>
                            </circle>
                          </g>
                        );
                      })}

                      {/* Bonus: Puppy Dog Easter Egg! */}
                      <g
                        className="poster-puppy-group"
                        style={{ cursor: "pointer" }}
                        onMouseEnter={handlePuppyHover}
                        onClick={handlePuppyHover}
                      >
                        {hoveredPartKey === "puppy" && (
                          <g>
                            <circle
                              cx={210}
                              cy={870}
                              r={75}
                              fill="rgba(245, 158, 11, 0.25)"
                              stroke="#f59e0b"
                              strokeWidth={3}
                              filter="url(#posterHighlightGlow)"
                              className="poster-puppy-glow"
                            />
                            <text
                              x={210}
                              y={795}
                              textAnchor="middle"
                              fontSize="16"
                              fill="#ffffff"
                              fontWeight="bold"
                              filter="drop-shadow(0 2px 4px rgba(0,0,0,0.8))"
                            >
                              🐶 Woof Woof!
                            </text>
                          </g>
                        )}
                        <circle
                          cx={210}
                          cy={870}
                          r={65}
                          fill="transparent"
                          className="poster-puppy-hitbox"
                        >
                          <title>Cute Puppy Dog! Hover to hear!</title>
                        </circle>
                      </g>
                    </svg>
                  </div>
                </div>
              ) : (
                /* === VECTOR DIAGRAM VIEW === */
                <div className="body-anatomy-viewer-box">
                  <div className="body-anatomy-header-hint">
                    <span>👦 Human Boy Body Parts Chart — Hover over any body part or arrow to hear its name!</span>
                  </div>

                  <div className="body-svg-wrapper">
                    <svg
                      viewBox="0 0 640 740"
                      className="body-interactive-svg"
                      preserveAspectRatio="xMidYMid meet"
                    >
                      <defs>
                        <radialGradient id="bodyBgGlow" cx="50%" cy="45%" r="55%">
                          <stop offset="0%" stopColor="#ecfdf5" stopOpacity="0.95" />
                          <stop offset="65%" stopColor="#f0f9ff" stopOpacity="0.6" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="boyTeeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="50%" stopColor="#0ea5e9" />
                          <stop offset="100%" stopColor="#0284c7" />
                        </linearGradient>
                        <linearGradient id="boyShortsGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#1e3a8a" />
                          <stop offset="100%" stopColor="#172554" />
                        </linearGradient>
                        <filter id="boyGlowFilter" x="-20%" y="-20%" width="140%" height="140%">
                          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#ea580c" floodOpacity="0.4" />
                        </filter>

                        {/* Arrowhead Markers */}
                        <marker
                          id="boy-arrow"
                          viewBox="0 0 10 10"
                          refX="7"
                          refY="5"
                          markerWidth="8"
                          markerHeight="8"
                          orient="auto"
                        >
                          <path d="M 0 1 L 9 5 L 0 9 L 2 5 Z" fill="#0284c7" />
                        </marker>

                        <marker
                          id="boy-arrow-active"
                          viewBox="0 0 10 10"
                          refX="7"
                          refY="5"
                          markerWidth="9"
                          markerHeight="9"
                          orient="auto"
                        >
                          <path d="M 0 1 L 9 5 L 0 9 L 2 5 Z" fill="#ea580c" />
                        </marker>

                        <marker
                          id="boy-arrow-sense"
                          viewBox="0 0 10 10"
                          refX="7"
                          refY="5"
                          markerWidth="8"
                          markerHeight="8"
                          orient="auto"
                        >
                          <path d="M 0 1 L 9 5 L 0 9 L 2 5 Z" fill="#f59e0b" />
                        </marker>
                      </defs>

                      {/* Ambient circular backdrop */}
                      <ellipse cx="320" cy="370" rx="260" ry="340" fill="url(#bodyBgGlow)" />

                      {/* === Human Boy Vector Illustration === */}
                      <g className="boy-body-figure">
                        {/* Neck */}
                        <rect x="309" y="174" width="22" height="26" rx="5" fill="#fecba1" />

                        {/* Boy Head Base */}
                        <ellipse cx="320" cy="120" rx="55" ry="60" fill="#fecba1" />

                        {/* Rosy Boy Cheeks */}
                        <circle cx="282" cy="134" r="8" fill="#fda4af" opacity="0.5" />
                        <circle cx="358" cy="134" r="8" fill="#fda4af" opacity="0.5" />

                        {/* Cool Boy Hair */}
                        <path
                          d="M 265 110 C 255 45, 385 45, 375 110 C 362 68, 344 58, 320 60 C 296 58, 278 68, 265 110 Z"
                          fill="#2d1a10"
                        />
                        {/* Hair Locks / Spikes on top */}
                        <path
                          d="M 285 75 Q 295 55 310 65 Q 325 50 340 68 Q 355 58 360 78"
                          stroke="#2d1a10"
                          strokeWidth="7"
                          strokeLinecap="round"
                          fill="none"
                        />
                        {/* Boy Hair Fringe / Bangs */}
                        <path
                          d="M 268 110 Q 280 85 300 95 Q 320 80 340 92 Q 360 85 372 110 Q 358 98 335 102 Q 315 90 288 104 Z"
                          fill="#3f2618"
                        />

                        {/* Eyebrows */}
                        <path d="M 290 106 Q 302 101 312 106" stroke="#2d1a10" strokeWidth="3" strokeLinecap="round" fill="none" />
                        <path d="M 328 106 Q 338 101 350 106" stroke="#2d1a10" strokeWidth="3" strokeLinecap="round" fill="none" />

                        {/* Curious Big Eyes */}
                        <g className="boy-eyes">
                          <ellipse cx="302" cy="122" rx="7.5" ry="8.5" fill="#1e293b" />
                          <circle cx="300" cy="119" r="2.8" fill="#ffffff" />
                          <ellipse cx="338" cy="122" rx="7.5" ry="8.5" fill="#1e293b" />
                          <circle cx="336" cy="119" r="2.8" fill="#ffffff" />
                        </g>

                        {/* Ears */}
                        <ellipse cx="265" cy="122" rx="8" ry="13" fill="#fecba1" stroke="#f87171" strokeWidth="1.5" />
                        <ellipse cx="375" cy="122" rx="8" ry="13" fill="#fecba1" stroke="#f87171" strokeWidth="1.5" />

                        {/* Nose */}
                        <path d="M 316 130 Q 320 138 324 130" stroke="#f472b6" strokeWidth="2.5" strokeLinecap="round" fill="none" />

                        {/* Smiling Boy Mouth with Teeth & Tongue */}
                        <path d="M 308 146 Q 320 162 332 146" stroke="#be123c" strokeWidth="2.5" fill="#e11d48" />
                        <path d="M 312 146 Q 320 151 328 146" fill="#ffffff" />
                        <ellipse cx="320" cy="154" rx="5" ry="3" fill="#fb7185" />

                        {/* Shoulders & Cool Sporty Tee */}
                        <path
                          d="M 285 196 L 255 218 L 225 270 L 258 282 L 278 244 L 278 345 L 362 345 L 362 244 L 382 282 L 415 270 L 385 218 L 355 196 Q 320 206 285 196 Z"
                          fill="url(#boyTeeGrad)"
                        />
                        {/* White Collar Trim */}
                        <path d="M 302 196 Q 320 208 338 196" stroke="#ffffff" strokeWidth="4" fill="none" />
                        {/* Chest Emblem: Superhero Star */}
                        <circle cx="320" cy="245" r="16" fill="#ffffff" opacity="0.25" />
                        <text x="320" y="250" fontSize="13" textAnchor="middle" fill="#ffffff" fontWeight="900">★</text>

                        {/* Arms & Hands with 5 spread fingers */}
                        {/* Left Arm */}
                        <path d="M 245 275 L 210 355" stroke="#fecba1" strokeWidth="18" strokeLinecap="round" />
                        <circle cx="245" cy="275" r="9" fill="#fecba1" />
                        {/* Left Hand & 5 fingers */}
                        <circle cx="202" cy="370" r="12" fill="#fecba1" />
                        <path d="M 208 360 Q 218 362 216 372" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" fill="none" />
                        <path d="M 198 375 L 188 382" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 202 380 L 194 390" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 207 380 L 202 392" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 212 378 L 212 388" stroke="#fecba1" strokeWidth="4.5" strokeLinecap="round" />

                        {/* Right Arm */}
                        <path d="M 395 275 L 430 355" stroke="#fecba1" strokeWidth="18" strokeLinecap="round" />
                        <circle cx="395" cy="275" r="9" fill="#fecba1" />
                        {/* Right Hand & 5 fingers */}
                        <circle cx="438" cy="370" r="12" fill="#fecba1" />
                        <path d="M 432 360 Q 422 362 424 372" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" fill="none" />
                        <path d="M 442 375 L 452 382" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 438 380 L 446 390" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 433 380 L 438 392" stroke="#fecba1" strokeWidth="5" strokeLinecap="round" />
                        <path d="M 428 378 L 428 388" stroke="#fecba1" strokeWidth="4.5" strokeLinecap="round" />

                        {/* Sporty Athletic Shorts */}
                        <path
                          d="M 278 342 L 362 342 L 368 445 L 328 445 L 320 385 L 312 445 L 272 445 Z"
                          fill="url(#boyShortsGrad)"
                        />
                        {/* Side Athletic Racing Stripes */}
                        <path d="M 280 345 L 274 442" stroke="#ffffff" strokeWidth="3" />
                        <path d="M 360 345 L 366 442" stroke="#ffffff" strokeWidth="3" />

                        {/* Boy Legs */}
                        <path d="M 292 445 L 290 615" stroke="#fecba1" strokeWidth="24" strokeLinecap="round" />
                        <circle cx="290" cy="520" r="12" fill="#fde047" opacity="0.35" />

                        <path d="M 348 445 L 350 615" stroke="#fecba1" strokeWidth="24" strokeLinecap="round" />
                        <circle cx="350" cy="520" r="12" fill="#fde047" opacity="0.35" />

                        {/* White Crew Socks with Red Stripes */}
                        <rect x="278" y="605" width="24" height="18" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="278" y1="612" x2="302" y2="612" stroke="#ef4444" strokeWidth="2" />

                        <rect x="338" y="605" width="24" height="18" rx="4" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="338" y1="612" x2="362" y2="612" stroke="#ef4444" strokeWidth="2" />

                        {/* Cool Boy Running Sneakers & Toes */}
                        {/* Left Sneaker */}
                        <path d="M 264 622 L 302 622 Q 306 648 264 648 Z" fill="#ef4444" />
                        <path d="M 260 644 L 306 644 Q 308 654 260 654 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="280" y1="626" x2="292" y2="626" stroke="#ffffff" strokeWidth="2" />

                        {/* Right Sneaker */}
                        <path d="M 338 622 L 376 622 Q 380 648 338 648 Z" fill="#ef4444" />
                        <path d="M 334 644 L 380 644 Q 382 654 334 654 Z" fill="#ffffff" stroke="#cbd5e1" strokeWidth="1" />
                        <line x1="348" y1="626" x2="360" y2="626" stroke="#ffffff" strokeWidth="2" />
                      </g>

                      {/* === ARROWS & LABELS: By default shows boy picture with body parts name with arrow === */}
                      {displayedParts.map((part: any) => {
                        const isHovered = hoveredPartKey === part.key;
                        const isSelected = selectedPartKey === part.key;
                        const isHighlighted = isHovered || isSelected;
                        const isSense = part.category === "sense";

                        const pillW = 140;
                        const pillH = 30;
                        const isLeft = part.side === "left";
                        const pillX = isLeft ? 12 : 488;
                        const pillY = part.labelY - 15;
                        const lineStartX = isLeft ? pillX + pillW : pillX;
                        const lineStartY = part.labelY;
                        const lineEndX = part.svgX;
                        const lineEndY = part.svgY;

                        const arrowMarker = isHighlighted
                          ? "url(#boy-arrow-active)"
                          : isSense
                          ? "url(#boy-arrow-sense)"
                          : "url(#boy-arrow)";

                        const strokeColor = isHighlighted
                          ? "#ea580c"
                          : isSense
                          ? "#f59e0b"
                          : "#0284c7";

                        const strokeWidth = isHighlighted ? 3.5 : 2;

                        return (
                          <g
                            key={`boy-part-arrow-group-${part.key}`}
                            className={`boy-arrow-pin-group ${isHighlighted ? "active" : ""}`}
                            style={{ cursor: "pointer" }}
                            onMouseEnter={() => handlePartHover(part)}
                            onClick={() => handlePartSelect(part)}
                          >
                            {/* Visible Arrow pointing from label directly to boy's body */}
                            <line
                              x1={lineStartX}
                              y1={lineStartY}
                              x2={lineEndX}
                              y2={lineEndY}
                              stroke={strokeColor}
                              strokeWidth={strokeWidth}
                              markerEnd={arrowMarker}
                              strokeLinecap="round"
                              className={`boy-pointer-arrow ${isHighlighted ? "highlighted" : ""}`}
                            />

                            {/* Label Pill by default visible with Part Name and Icon */}
                            <g className="boy-label-pill-btn">
                              <rect
                                x={pillX}
                                y={pillY}
                                width={pillW}
                                height={pillH}
                                rx={15}
                                fill={isHighlighted ? "#ea580c" : isSense ? "#fffbeb" : "#ffffff"}
                                stroke={isHighlighted ? "#c2410c" : isSense ? "#f59e0b" : "#38bdf8"}
                                strokeWidth={isHighlighted ? 2.5 : 1.5}
                                filter={isHighlighted ? "url(#boyGlowFilter)" : "drop-shadow(0 2px 5px rgba(0,0,0,0.06))"}
                              />
                              <text x={pillX + 10} y={part.labelY + 5} fontSize="14">
                                {part.icon}
                              </text>
                              <text
                                x={pillX + 32}
                                y={part.labelY + 5}
                                fontSize="12.5"
                                fontWeight={isHighlighted ? "800" : "700"}
                                fill={isHighlighted ? "#ffffff" : isSense ? "#92400e" : "#0f172a"}
                                fontFamily="Outfit, Manrope, system-ui, sans-serif"
                              >
                                {part.name}
                              </text>
                              <text
                                x={pillX + pillW - 8}
                                y={part.labelY + 5}
                                fontSize="10"
                                textAnchor="end"
                                fill={isHighlighted ? "rgba(255,255,255,0.9)" : "#64748b"}
                                fontFamily="'Noto Sans Devanagari', sans-serif"
                              >
                                {part.marathi.split(" ")[0]}
                              </text>
                            </g>

                            {/* Hotspot Target Circle on the boy's body */}
                            <g className="boy-body-hotspot">
                              <circle
                                cx={part.svgX}
                                cy={part.svgY}
                                r={isHighlighted ? 15 : 8}
                                fill={isHighlighted ? "rgba(234, 88, 12, 0.4)" : "rgba(2, 132, 199, 0.25)"}
                                className="boy-pulse-ring"
                              />
                              <circle
                                cx={part.svgX}
                                cy={part.svgY}
                                r={isHighlighted ? 7 : 5}
                                fill={isHighlighted ? "#ea580c" : isSense ? "#f59e0b" : "#0284c7"}
                                stroke="#ffffff"
                                strokeWidth={1.8}
                              />
                              <title>{`${part.name} — ${part.marathi} (Hover to hear pronunciation)`}</title>
                            </g>
                          </g>
                        );
                      })}
                    </svg>
                  </div>
                </div>
              )}

              {/* Right Column: Spotlight Info Card */}
              <div className="body-spotlight-card">
                <div className="body-spotlight-header">
                  <div className="body-spotlight-icon-wrap">
                    <span className="body-spotlight-icon">{currentPart.icon}</span>
                  </div>
                  <div className="body-spotlight-titles">
                    <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", marginBottom: "4px" }}>
                      <span className={`body-part-category-tag ${currentPart.category}`}>
                        {currentPart.category === "sense" ? "👀 5 Senses Organ" : currentPart.category === "head" ? "🗣️ Head & Face" : currentPart.category === "upper" ? "💪 Upper Body" : "🦵 Lower Body"}
                      </span>
                      {isCurrentPracticed ? (
                        <span className="body-practiced-chip">
                          ⭐ Practiced {currentRec.practiceCount}x
                        </span>
                      ) : null}
                    </div>
                    <h3 className="body-spotlight-name">{currentPart.name}</h3>
                  </div>
                </div>

                {/* Multilingual Vocabulary Box */}
                <div className="body-multilingual-box">
                  <div className="body-lang-row">
                    <span className="lang-code-tag en">EN</span>
                    <strong className="lang-term">{currentPart.name}</strong>
                    <button
                      type="button"
                      className="lang-speak-mini-btn"
                      onClick={() => speakPhrase(currentPart.audioText || currentPart.name, "en-US")}
                      title="Pronounce in English"
                    >
                      <span>🔊 Say</span>
                    </button>
                  </div>

                  <div className="body-lang-row">
                    <span className="lang-code-tag mr">MR</span>
                    <strong className="lang-term devanagari">{currentPart.marathi}</strong>
                    <button
                      type="button"
                      className="lang-speak-mini-btn"
                      onClick={() => speakPhrase(currentPart.marathi.split("(")[0].trim(), "mr-IN")}
                      title="Pronounce in Marathi"
                    >
                      <span>🔊 ऐका</span>
                    </button>
                  </div>

                  <div className="body-lang-row">
                    <span className="lang-code-tag hi">HI</span>
                    <strong className="lang-term devanagari">{currentPart.hindi}</strong>
                    <button
                      type="button"
                      className="lang-speak-mini-btn"
                      onClick={() => speakPhrase(currentPart.hindi.split("(")[0].trim(), "hi-IN")}
                      title="Pronounce in Hindi"
                    >
                      <span>🔊 सुनें</span>
                    </button>
                  </div>
                </div>

                {/* Fact / Function Explanation */}
                <div className="body-fact-box">
                  <span className="fact-bulb">💡</span>
                  <div className="fact-text">
                    <strong>Did You Know?</strong>
                    <p>{currentPart.fact}</p>
                  </div>
                </div>

                {/* Actions: Pronounce & Record Practice */}
                <div className="body-spotlight-actions">
                  <button
                    type="button"
                    className="body-speak-big-btn"
                    onClick={() => speakPhrase(currentPart.audioText || currentPart.name, "en-US")}
                  >
                    <span>🔊 Pronounce Aloud</span>
                  </button>

                  <button
                    type="button"
                    className={`body-practice-btn ${isCurrentPracticed ? "practiced" : ""}`}
                    onClick={() => onRecordPractice("body-parts", currentPart.key, currentPart.name)}
                    disabled={savingChartItem === currentPart.key}
                  >
                    <span>{isCurrentPracticed ? "⭐ Practiced" : "☆ Mark Practiced"}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Bottom Section: All 21 Body Parts Cards Grid (Visible by default!) */}
            <div className="body-parts-grid-section">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                <div>
                  <h3 style={{ margin: 0, fontSize: "17px", color: "var(--ink)" }}>
                    All Body Parts ({displayedParts.length})
                  </h3>
                  <small style={{ color: "var(--muted)" }}>
                    Hover over any card to hear its name immediately!
                  </small>
                </div>
                <span style={{ fontSize: "12px", color: "#0284c7", fontWeight: 700 }}>
                  👆 Tap card or button for full pronunciation
                </span>
              </div>

              <div className="body-parts-card-grid">
                {displayedParts.map((part: any) => {
                  const rec = records[part.key];
                  const isPracticed = !!rec && rec.practiceCount > 0;
                  const isSelected = selectedPartKey === part.key;
                  const isHovered = hoveredPartKey === part.key;

                  return (
                    <div
                      key={part.key}
                      className={`body-part-card ${isPracticed ? "practiced" : ""} ${isSelected ? "selected" : ""} ${isHovered ? "hovered" : ""}`}
                      onMouseEnter={() => handlePartHover(part)}
                      onClick={() => handlePartSelect(part)}
                      title={`Click to pronounce: ${part.name}`}
                    >
                      <div className="body-card-top-row">
                        <span className={`body-card-category-dot ${part.category}`} title={part.category} />
                        <span className="body-card-star" title={isPracticed ? `Practiced ${rec.practiceCount}x` : "Not practiced yet"}>
                          {isPracticed ? `⭐ ${rec.practiceCount > 1 ? rec.practiceCount : ""}` : "☆"}
                        </span>
                      </div>

                      <div className="body-card-icon">{part.icon}</div>
                      <div className="body-card-name">{part.name}</div>
                      <div className="body-card-marathi">{part.marathi}</div>
                      <div className="body-card-hindi">{part.hindi}</div>

                      <div className="body-card-buttons">
                        <button
                          type="button"
                          className="body-card-sound-btn"
                          onClick={(e) => {
                            e.stopPropagation();
                            speakPhrase(part.audioText || part.name, "en-US");
                          }}
                          title="Listen pronunciation"
                        >
                          <span>🔊</span>
                          <span>Say</span>
                        </button>
                        <button
                          type="button"
                          className={`body-card-star-btn ${isPracticed ? "practiced" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecordPractice("body-parts", part.key, part.name);
                          }}
                          disabled={savingChartItem === part.key}
                          title="Mark practiced"
                        >
                          <span>{isPracticed ? "⭐" : "☆"}</span>
                          <span>{isPracticed ? `${rec.practiceCount}x` : "Practice"}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        );
      })()}

      {/* SUBMENU 6: Animals Chart */}
      {activeChartSlug === "animals" && (
        <VisualLearningChartGrid
          chartSlug="animals"
          title="Animals & Sounds"
          marathiTitle="प्राणी आणि आवाज"
          description="Interactive visual chart for wild, farm, and water animals. Click any animal picture to hear its name called out aloud! Click to practice."
          icon="🦁"
          items={mergeChartData(activeChart?.chart_data, DEFAULT_ANIMALS)}
          categories={[
            { id: "all", label: "All Animals (सर्व)", icon: "🐾" },
            { id: "wild", label: "Wild Animals (जंगली)", icon: "🦁" },
            { id: "domestic", label: "Farm & Pets (पाळीव)", icon: "🐄" },
            { id: "water", label: "Ocean & Water (जलचर)", icon: "🐬" },
          ]}
          chartProgressRecords={chartProgress.records}
          onRecordPractice={onRecordPractice}
          savingChartItem={savingChartItem}
          childName={childName}
          chartType="animals"
        />
      )}

      {/* SUBMENU 7: Vegetables Chart */}
      {activeChartSlug === "vegetables" && (
        <VisualLearningChartGrid
          chartSlug="vegetables"
          title="Healthy Vegetables"
          marathiTitle="पौष्टिक भाज्या"
          description="Interactive visual chart of nutritious everyday vegetables. Click any vegetable picture to hear its name and discover healthy benefits!"
          icon="🥕"
          items={mergeChartData(activeChart?.chart_data, DEFAULT_VEGETABLES)}
          categories={[
            { id: "all", label: "All Vegetables (सर्व भाज्या)", icon: "🥗" },
            { id: "root", label: "Root (कंदमुळे)", icon: "🥕" },
            { id: "leafy", label: "Leafy Greens (पालेभाज्या)", icon: "🥬" },
            { id: "fruit", label: "Fresh & Fruity (फळभाज्या)", icon: "🍅" },
            { id: "bulb", label: "Bulbs & Spices", icon: "🧅" },
          ]}
          chartProgressRecords={chartProgress.records}
          onRecordPractice={onRecordPractice}
          savingChartItem={savingChartItem}
          childName={childName}
          chartType="vegetables"
        />
      )}

      {/* SUBMENU 8: Birds Chart */}
      {activeChartSlug === "birds" && (
        <VisualLearningChartGrid
          chartSlug="birds"
          title="Beautiful Birds"
          marathiTitle="सुंदर पक्षी"
          description="Interactive visual chart of wondrous birds. Click any bird picture to hear its name and authentic bird call sound!"
          icon="🦜"
          items={mergeChartData(activeChart?.chart_data, DEFAULT_BIRDS)}
          categories={[
            { id: "all", label: "All Birds (सर्व पक्षी)", icon: "🪶" },
            { id: "garden", label: "Garden & Town", icon: "🦚" },
            { id: "wild", label: "Wild & Hunters", icon: "🦅" },
            { id: "water", label: "Water Birds", icon: "🦆" },
            { id: "flightless", label: "Unique / Flightless", icon: "🐧" },
          ]}
          chartProgressRecords={chartProgress.records}
          onRecordPractice={onRecordPractice}
          savingChartItem={savingChartItem}
          childName={childName}
          chartType="birds"
        />
      )}

      {/* SUBMENU 9: Emotions & Feelings Chart */}
      {activeChartSlug === "emotions" && (
        <VisualLearningChartGrid
          chartSlug="emotions"
          title="Feelings & Emotions"
          marathiTitle="भावना आणि मनःस्थिती"
          description="Interactive feelings chart helping children identify emotions, physical cues, and positive calming coping tools. Click any feeling face to hear it called out!"
          icon="😊"
          items={mergeChartData(activeChart?.chart_data, DEFAULT_EMOTIONS)}
          categories={[
            { id: "all", label: "All Feelings (सर्व भावना)", icon: "🌈" },
            { id: "positive", label: "Sunny & Joyful (आनंदी)", icon: "☀️" },
            { id: "calm", label: "Calm & Peaceful (शांत)", icon: "🌊" },
            { id: "big_feelings", label: "Big Feelings (गहन भावना)", icon: "🌧️" },
          ]}
          chartProgressRecords={chartProgress.records}
          onRecordPractice={onRecordPractice}
          savingChartItem={savingChartItem}
          childName={childName}
          chartType="emotions"
        />
      )}

      {/* SUBMENU 10: Phonics Short Vowels & CVC Word Families Chart */}
      {activeChartSlug === "phonics" && (
        <PhonicsLearningChartView
          chartSlug="phonics"
          chartProgressRecords={chartProgress.records}
          onRecordPractice={onRecordPractice}
          savingChartItem={savingChartItem}
          childName={childName}
          apiUrl={apiUrl}
        />
      )}
    </div>
  );
}
