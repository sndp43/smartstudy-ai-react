export const ONSET_PHONIC_SOUNDS: Record<string, string> = {
  "b": "buh",
  "c": "kuh",
  "d": "duh",
  "f": "fuh",
  "g": "guh",
  "h": "huh",
  "j": "juh",
  "k": "kuh",
  "l": "luh",
  "m": "muh",
  "n": "nuh",
  "p": "puh",
  "r": "ruh",
  "s": "suh",
  "t": "tuh",
  "v": "vuh",
  "w": "wuh",
  "y": "yuh",
  "z": "zuh"
};

export const ONSET_MARATHI_SOUNDS: Record<string, string> = {
  "b": "ब",
  "c": "क",
  "d": "ड",
  "f": "फ",
  "g": "ग",
  "h": "ह",
  "j": "ज",
  "k": "क",
  "l": "ल",
  "m": "म",
  "n": "न",
  "p": "प",
  "r": "र",
  "s": "स",
  "t": "ट",
  "v": "व्ह",
  "w": "व",
  "y": "य",
  "z": "झ"
};

export const RIME_MARATHI_SOUNDS: Record<string, string> = {
  "ab": "ॲब",
  "ad": "ॲड",
  "ag": "ॲग",
  "am": "ॲम",
  "an": "ॲन",
  "ap": "ॲप",
  "at": "ॲट",
  "ed": "एड",
  "eg": "एग",
  "en": "एन",
  "et": "एट",
  "ell": "एल",
  "id": "इड",
  "ig": "इग",
  "in": "इन",
  "ip": "इप",
  "it": "इट",
  "ob": "ऑब",
  "og": "ऑग",
  "op": "ऑप",
  "ot": "ऑट",
  "ox": "ऑक्स",
  "ub": "अब",
  "ug": "अग",
  "um": "अम",
  "un": "अन",
  "ut": "अट"
};

export interface VowelGuideInfo {
  letterSound: string;
  shortSound: string;
  fullSpeech: string;
  marathiLetterSound: string;
  anchorWord: string;
  marathiAnchorWord: string;
  anchorPhonics: string;
}

export const VOWEL_PHONIC_GUIDE: Record<string, VowelGuideInfo> = {
  "a": {
    "letterSound": "a, apple",
    "shortSound": "a, apple",
    "fullSpeech": "Short vowel a, as in apple. a, apple.",
    "marathiLetterSound": "ॲ, ॲपल",
    "anchorWord": "apple",
    "marathiAnchorWord": "ॲपल",
    "anchorPhonics": "ॲ (ae) as in apple"
  },
  "e": {
    "letterSound": "e, elephant",
    "shortSound": "e, elephant",
    "fullSpeech": "Short vowel e, as in elephant. e, elephant.",
    "marathiLetterSound": "ए, एलिफंट",
    "anchorWord": "elephant",
    "marathiAnchorWord": "एलिफंट",
    "anchorPhonics": "ए (eh) as in elephant"
  },
  "i": {
    "letterSound": "i, igloo",
    "shortSound": "i, igloo",
    "fullSpeech": "Short vowel i, as in igloo. i, igloo.",
    "marathiLetterSound": "इ, इग्लू",
    "anchorWord": "igloo",
    "marathiAnchorWord": "इग्लू",
    "anchorPhonics": "इ (ih) as in igloo"
  },
  "o": {
    "letterSound": "o, octopus",
    "shortSound": "o, octopus",
    "fullSpeech": "Short vowel o, as in octopus. o, octopus.",
    "marathiLetterSound": "ऑ, ऑक्टोपस",
    "anchorWord": "octopus",
    "marathiAnchorWord": "ऑक्टोपस",
    "anchorPhonics": "ऑ (aw) as in octopus"
  },
  "u": {
    "letterSound": "u, umbrella",
    "shortSound": "u, umbrella",
    "fullSpeech": "Short vowel u, as in umbrella. u, umbrella.",
    "marathiLetterSound": "अ, अम्ब्रेला",
    "anchorWord": "umbrella",
    "marathiAnchorWord": "अम्ब्रेला",
    "anchorPhonics": "अ (uh) as in umbrella"
  }
};

export interface PhonicsWord {
  key: string;
  word: string;
  onset: string;
  rime: string;
  blendSpeech: string;
  wordSpeech: string;
  marathi?: string;
}

export interface PhonicsFamily {
  family: string;
  headerBg: string;
  columnBg: string;
  familySpeech: string;
  words: PhonicsWord[];
}

export interface PhonicsVowelGroup {
  id: string;
  vowel: "a" | "e" | "i" | "o" | "u";
  title: string;
  color: string;
  headerBg: string;
  ipa: string;
  marathiSound: string;
  phonicSpeech: string;
  exampleWords: string;
  families: PhonicsFamily[];
}

export const PHONICS_DATA: PhonicsVowelGroup[] = [
  {
    "id": "short_a",
    "vowel": "a",
    "title": "short a",
    "color": "#e11d48",
    "headerBg": "#e11d48",
    "ipa": "/æ/",
    "marathiSound": "ॲ (ae)",
    "phonicSpeech": "Short vowel a, as in apple. a, apple.",
    "exampleWords": "apple, cat, bat, van, cap, dad, jam",
    "families": [
      {
        "family": "-ab",
        "headerBg": "#fb7185",
        "columnBg": "#fff1f2",
        "familySpeech": "The ab family. ab. as in: Cab, dab, lab, tab, nab, jab, fab!",
        "words": [
          {
            "key": "ph_a_cab",
            "word": "cab",
            "onset": "c",
            "rime": "ab",
            "blendSpeech": "c ... ab ... cab!",
            "wordSpeech": "cab!",
            "marathi": "कॅब (Cab)"
          },
          {
            "key": "ph_a_dab",
            "word": "dab",
            "onset": "d",
            "rime": "ab",
            "blendSpeech": "d ... ab ... dab!",
            "wordSpeech": "dab!",
            "marathi": "डॅब (Dab)"
          },
          {
            "key": "ph_a_lab",
            "word": "lab",
            "onset": "l",
            "rime": "ab",
            "blendSpeech": "l ... ab ... lab!",
            "wordSpeech": "lab!",
            "marathi": "लॅब (Lab)"
          },
          {
            "key": "ph_a_tab",
            "word": "tab",
            "onset": "t",
            "rime": "ab",
            "blendSpeech": "t ... ab ... tab!",
            "wordSpeech": "tab!",
            "marathi": "टॅब (Tab)"
          },
          {
            "key": "ph_a_nab",
            "word": "nab",
            "onset": "n",
            "rime": "ab",
            "blendSpeech": "n ... ab ... nab!",
            "wordSpeech": "nab!",
            "marathi": "नॅब (Nab)"
          },
          {
            "key": "ph_a_jab",
            "word": "jab",
            "onset": "j",
            "rime": "ab",
            "blendSpeech": "j ... ab ... jab!",
            "wordSpeech": "jab!",
            "marathi": "जॅब (Jab)"
          },
          {
            "key": "ph_a_fab",
            "word": "fab",
            "onset": "f",
            "rime": "ab",
            "blendSpeech": "f ... ab ... fab!",
            "wordSpeech": "fab!",
            "marathi": "फॅब (Fab)"
          }
        ]
      },
      {
        "family": "-ad",
        "headerBg": "#ec4899",
        "columnBg": "#fdf2f8",
        "familySpeech": "The ad family. ad. as in: Bad, dad, had, lad, mad, pad, sad, tad!",
        "words": [
          {
            "key": "ph_a_bad",
            "word": "bad",
            "onset": "b",
            "rime": "ad",
            "blendSpeech": "b ... ad ... bad!",
            "wordSpeech": "bad!",
            "marathi": "बॅड (Bad)"
          },
          {
            "key": "ph_a_dad",
            "word": "dad",
            "onset": "d",
            "rime": "ad",
            "blendSpeech": "d ... ad ... dad!",
            "wordSpeech": "dad!",
            "marathi": "डॅड (Dad)"
          },
          {
            "key": "ph_a_had",
            "word": "had",
            "onset": "h",
            "rime": "ad",
            "blendSpeech": "h ... ad ... had!",
            "wordSpeech": "had!",
            "marathi": "हॅड (Had)"
          },
          {
            "key": "ph_a_lad",
            "word": "lad",
            "onset": "l",
            "rime": "ad",
            "blendSpeech": "l ... ad ... lad!",
            "wordSpeech": "lad!",
            "marathi": "लॅड (Lad)"
          },
          {
            "key": "ph_a_mad",
            "word": "mad",
            "onset": "m",
            "rime": "ad",
            "blendSpeech": "m ... ad ... mad!",
            "wordSpeech": "mad!",
            "marathi": "मॅड (Mad)"
          },
          {
            "key": "ph_a_pad",
            "word": "pad",
            "onset": "p",
            "rime": "ad",
            "blendSpeech": "p ... ad ... pad!",
            "wordSpeech": "pad!",
            "marathi": "पॅड (Pad)"
          },
          {
            "key": "ph_a_sad",
            "word": "sad",
            "onset": "s",
            "rime": "ad",
            "blendSpeech": "s ... ad ... sad!",
            "wordSpeech": "sad!",
            "marathi": "सॅड (Sad)"
          },
          {
            "key": "ph_a_tad",
            "word": "tad",
            "onset": "t",
            "rime": "ad",
            "blendSpeech": "t ... ad ... tad!",
            "wordSpeech": "tad!",
            "marathi": "टॅड (Tad)"
          }
        ]
      },
      {
        "family": "-ag",
        "headerBg": "#38bdf8",
        "columnBg": "#f0f9ff",
        "familySpeech": "The ag family. ag. as in: Bag, gag, lag, nag, rag, sag, tag, wag!",
        "words": [
          {
            "key": "ph_a_bag",
            "word": "bag",
            "onset": "b",
            "rime": "ag",
            "blendSpeech": "b ... ag ... bag!",
            "wordSpeech": "bag!",
            "marathi": "बॅग (Bag)"
          },
          {
            "key": "ph_a_gag",
            "word": "gag",
            "onset": "g",
            "rime": "ag",
            "blendSpeech": "g ... ag ... gag!",
            "wordSpeech": "gag!",
            "marathi": "गॅग (Gag)"
          },
          {
            "key": "ph_a_lag",
            "word": "lag",
            "onset": "l",
            "rime": "ag",
            "blendSpeech": "l ... ag ... lag!",
            "wordSpeech": "lag!",
            "marathi": "लॅग (Lag)"
          },
          {
            "key": "ph_a_nag",
            "word": "nag",
            "onset": "n",
            "rime": "ag",
            "blendSpeech": "n ... ag ... nag!",
            "wordSpeech": "nag!",
            "marathi": "नॅग (Nag)"
          },
          {
            "key": "ph_a_rag",
            "word": "rag",
            "onset": "r",
            "rime": "ag",
            "blendSpeech": "r ... ag ... rag!",
            "wordSpeech": "rag!",
            "marathi": "रॅग (Rag)"
          },
          {
            "key": "ph_a_sag",
            "word": "sag",
            "onset": "s",
            "rime": "ag",
            "blendSpeech": "s ... ag ... sag!",
            "wordSpeech": "sag!",
            "marathi": "सॅग (Sag)"
          },
          {
            "key": "ph_a_tag",
            "word": "tag",
            "onset": "t",
            "rime": "ag",
            "blendSpeech": "t ... ag ... tag!",
            "wordSpeech": "tag!",
            "marathi": "टॅग (Tag)"
          },
          {
            "key": "ph_a_wag",
            "word": "wag",
            "onset": "w",
            "rime": "ag",
            "blendSpeech": "w ... ag ... wag!",
            "wordSpeech": "wag!",
            "marathi": "वॅग (Wag)"
          }
        ]
      },
      {
        "family": "-am",
        "headerBg": "#f97316",
        "columnBg": "#fff7ed",
        "familySpeech": "The am family. am. as in: Bam, dam, ham, jam, ram, yam, sam!",
        "words": [
          {
            "key": "ph_a_bam",
            "word": "bam",
            "onset": "b",
            "rime": "am",
            "blendSpeech": "b ... am ... bam!",
            "wordSpeech": "bam!",
            "marathi": "बॅम (Bam)"
          },
          {
            "key": "ph_a_dam",
            "word": "dam",
            "onset": "d",
            "rime": "am",
            "blendSpeech": "d ... am ... dam!",
            "wordSpeech": "dam!",
            "marathi": "डॅम (Dam)"
          },
          {
            "key": "ph_a_ham",
            "word": "ham",
            "onset": "h",
            "rime": "am",
            "blendSpeech": "h ... am ... ham!",
            "wordSpeech": "ham!",
            "marathi": "हॅम (Ham)"
          },
          {
            "key": "ph_a_jam",
            "word": "jam",
            "onset": "j",
            "rime": "am",
            "blendSpeech": "j ... am ... jam!",
            "wordSpeech": "jam!",
            "marathi": "जॅम (Jam)"
          },
          {
            "key": "ph_a_ram",
            "word": "ram",
            "onset": "r",
            "rime": "am",
            "blendSpeech": "r ... am ... ram!",
            "wordSpeech": "ram!",
            "marathi": "रॅम (Ram)"
          },
          {
            "key": "ph_a_yam",
            "word": "yam",
            "onset": "y",
            "rime": "am",
            "blendSpeech": "y ... am ... yam!",
            "wordSpeech": "yam!",
            "marathi": "यॅम (Yam)"
          },
          {
            "key": "ph_a_sam",
            "word": "sam",
            "onset": "s",
            "rime": "am",
            "blendSpeech": "s ... am ... sam!",
            "wordSpeech": "sam!",
            "marathi": "सॅम (Sam)"
          }
        ]
      },
      {
        "family": "-an",
        "headerBg": "#22c55e",
        "columnBg": "#f0fdf4",
        "familySpeech": "The an family. an. as in: Ban, can, fan, man, pan, ran, tan, van!",
        "words": [
          {
            "key": "ph_a_ban",
            "word": "ban",
            "onset": "b",
            "rime": "an",
            "blendSpeech": "b ... an ... ban!",
            "wordSpeech": "ban!",
            "marathi": "बॅन (Ban)"
          },
          {
            "key": "ph_a_can",
            "word": "can",
            "onset": "c",
            "rime": "an",
            "blendSpeech": "c ... an ... can!",
            "wordSpeech": "can!",
            "marathi": "कॅन (Can)"
          },
          {
            "key": "ph_a_fan",
            "word": "fan",
            "onset": "f",
            "rime": "an",
            "blendSpeech": "f ... an ... fan!",
            "wordSpeech": "fan!",
            "marathi": "फॅन (Fan)"
          },
          {
            "key": "ph_a_man",
            "word": "man",
            "onset": "m",
            "rime": "an",
            "blendSpeech": "m ... an ... man!",
            "wordSpeech": "man!",
            "marathi": "मॅन (Man)"
          },
          {
            "key": "ph_a_pan",
            "word": "pan",
            "onset": "p",
            "rime": "an",
            "blendSpeech": "p ... an ... pan!",
            "wordSpeech": "pan!",
            "marathi": "पॅन (Pan)"
          },
          {
            "key": "ph_a_ran",
            "word": "ran",
            "onset": "r",
            "rime": "an",
            "blendSpeech": "r ... an ... ran!",
            "wordSpeech": "ran!",
            "marathi": "रॅन (Ran)"
          },
          {
            "key": "ph_a_tan",
            "word": "tan",
            "onset": "t",
            "rime": "an",
            "blendSpeech": "t ... an ... tan!",
            "wordSpeech": "tan!",
            "marathi": "टॅन (Tan)"
          },
          {
            "key": "ph_a_van",
            "word": "van",
            "onset": "v",
            "rime": "an",
            "blendSpeech": "v ... an ... van!",
            "wordSpeech": "van!",
            "marathi": "व्हॅन (Van)"
          }
        ]
      },
      {
        "family": "-ap",
        "headerBg": "#f43f5e",
        "columnBg": "#fff1f2",
        "familySpeech": "The ap family. ap. as in: Cap, gap, lap, map, nap, rap, sap, tap, zap!",
        "words": [
          {
            "key": "ph_a_cap",
            "word": "cap",
            "onset": "c",
            "rime": "ap",
            "blendSpeech": "c ... ap ... cap!",
            "wordSpeech": "cap!",
            "marathi": "कॅप (Cap)"
          },
          {
            "key": "ph_a_gap",
            "word": "gap",
            "onset": "g",
            "rime": "ap",
            "blendSpeech": "g ... ap ... gap!",
            "wordSpeech": "gap!",
            "marathi": "गॅप (Gap)"
          },
          {
            "key": "ph_a_lap",
            "word": "lap",
            "onset": "l",
            "rime": "ap",
            "blendSpeech": "l ... ap ... lap!",
            "wordSpeech": "lap!",
            "marathi": "लॅप (Lap)"
          },
          {
            "key": "ph_a_map",
            "word": "map",
            "onset": "m",
            "rime": "ap",
            "blendSpeech": "m ... ap ... map!",
            "wordSpeech": "map!",
            "marathi": "मॅप (Map)"
          },
          {
            "key": "ph_a_nap",
            "word": "nap",
            "onset": "n",
            "rime": "ap",
            "blendSpeech": "n ... ap ... nap!",
            "wordSpeech": "nap!",
            "marathi": "नॅप (Nap)"
          },
          {
            "key": "ph_a_rap",
            "word": "rap",
            "onset": "r",
            "rime": "ap",
            "blendSpeech": "r ... ap ... rap!",
            "wordSpeech": "rap!",
            "marathi": "रॅप (Rap)"
          },
          {
            "key": "ph_a_sap",
            "word": "sap",
            "onset": "s",
            "rime": "ap",
            "blendSpeech": "s ... ap ... sap!",
            "wordSpeech": "sap!",
            "marathi": "सॅप (Sap)"
          },
          {
            "key": "ph_a_tap",
            "word": "tap",
            "onset": "t",
            "rime": "ap",
            "blendSpeech": "t ... ap ... tap!",
            "wordSpeech": "tap!",
            "marathi": "टॅप (Tap)"
          },
          {
            "key": "ph_a_zap",
            "word": "zap",
            "onset": "z",
            "rime": "ap",
            "blendSpeech": "z ... ap ... zap!",
            "wordSpeech": "zap!",
            "marathi": "झॅप (Zap)"
          }
        ]
      },
      {
        "family": "-at",
        "headerBg": "#a855f7",
        "columnBg": "#faf5ff",
        "familySpeech": "The at family. at. as in: Bat, cat, fat, hat, mat, pat, rat, sat, vat!",
        "words": [
          {
            "key": "ph_a_bat",
            "word": "bat",
            "onset": "b",
            "rime": "at",
            "blendSpeech": "b ... at ... bat!",
            "wordSpeech": "bat!",
            "marathi": "बॅट (Bat)"
          },
          {
            "key": "ph_a_cat",
            "word": "cat",
            "onset": "c",
            "rime": "at",
            "blendSpeech": "c ... at ... cat!",
            "wordSpeech": "cat!",
            "marathi": "कॅट (Cat)"
          },
          {
            "key": "ph_a_fat",
            "word": "fat",
            "onset": "f",
            "rime": "at",
            "blendSpeech": "f ... at ... fat!",
            "wordSpeech": "fat!",
            "marathi": "फॅट (Fat)"
          },
          {
            "key": "ph_a_hat",
            "word": "hat",
            "onset": "h",
            "rime": "at",
            "blendSpeech": "h ... at ... hat!",
            "wordSpeech": "hat!",
            "marathi": "हॅट (Hat)"
          },
          {
            "key": "ph_a_mat",
            "word": "mat",
            "onset": "m",
            "rime": "at",
            "blendSpeech": "m ... at ... mat!",
            "wordSpeech": "mat!",
            "marathi": "मॅट (Mat)"
          },
          {
            "key": "ph_a_pat",
            "word": "pat",
            "onset": "p",
            "rime": "at",
            "blendSpeech": "p ... at ... pat!",
            "wordSpeech": "pat!",
            "marathi": "पॅट (Pat)"
          },
          {
            "key": "ph_a_rat",
            "word": "rat",
            "onset": "r",
            "rime": "at",
            "blendSpeech": "r ... at ... rat!",
            "wordSpeech": "rat!",
            "marathi": "रॅट (Rat)"
          },
          {
            "key": "ph_a_sat",
            "word": "sat",
            "onset": "s",
            "rime": "at",
            "blendSpeech": "s ... at ... sat!",
            "wordSpeech": "sat!",
            "marathi": "सॅट (Sat)"
          },
          {
            "key": "ph_a_vat",
            "word": "vat",
            "onset": "v",
            "rime": "at",
            "blendSpeech": "v ... at ... vat!",
            "wordSpeech": "vat!",
            "marathi": "व्हॅट (Vat)"
          }
        ]
      },
      {
        "family": "-ax",
        "headerBg": "#eab308",
        "columnBg": "#fefce8",
        "familySpeech": "The ax family. ax. as in: Fax, tax, wax, max!",
        "words": [
          {
            "key": "ph_a_fax",
            "word": "fax",
            "onset": "f",
            "rime": "ax",
            "blendSpeech": "f ... ax ... fax!",
            "wordSpeech": "fax!",
            "marathi": "फॅक्स (Fax)"
          },
          {
            "key": "ph_a_tax",
            "word": "tax",
            "onset": "t",
            "rime": "ax",
            "blendSpeech": "t ... ax ... tax!",
            "wordSpeech": "tax!",
            "marathi": "टॅक्स (Tax)"
          },
          {
            "key": "ph_a_wax",
            "word": "wax",
            "onset": "w",
            "rime": "ax",
            "blendSpeech": "w ... ax ... wax!",
            "wordSpeech": "wax!",
            "marathi": "वॅक्स (Wax)"
          },
          {
            "key": "ph_a_max",
            "word": "max",
            "onset": "m",
            "rime": "ax",
            "blendSpeech": "m ... ax ... max!",
            "wordSpeech": "max!",
            "marathi": "मॅक्स (Max)"
          }
        ]
      }
    ]
  },
  {
    "id": "short_e",
    "vowel": "e",
    "title": "short e",
    "color": "#0284c7",
    "headerBg": "#0ea5e9",
    "ipa": "/e/",
    "marathiSound": "ए (e)",
    "phonicSpeech": "Short vowel e, as in elephant. e, elephant.",
    "exampleWords": "egg, bed, red, pen, jet, bell, leg",
    "families": [
      {
        "family": "-ed",
        "headerBg": "#3b82f6",
        "columnBg": "#eff6ff",
        "familySpeech": "The ed family. ed. as in: Bed, fed, led, ned, red, ted, wed, zed!",
        "words": [
          {
            "key": "ph_e_bed",
            "word": "bed",
            "onset": "b",
            "rime": "ed",
            "blendSpeech": "b ... ed ... bed!",
            "wordSpeech": "bed!",
            "marathi": "बेड (Bed)"
          },
          {
            "key": "ph_e_fed",
            "word": "fed",
            "onset": "f",
            "rime": "ed",
            "blendSpeech": "f ... ed ... fed!",
            "wordSpeech": "fed!",
            "marathi": "फेड (Fed)"
          },
          {
            "key": "ph_e_led",
            "word": "led",
            "onset": "l",
            "rime": "ed",
            "blendSpeech": "l ... ed ... led!",
            "wordSpeech": "led!",
            "marathi": "लेड (Led)"
          },
          {
            "key": "ph_e_ned",
            "word": "ned",
            "onset": "n",
            "rime": "ed",
            "blendSpeech": "n ... ed ... ned!",
            "wordSpeech": "ned!",
            "marathi": "नेड (Ned)"
          },
          {
            "key": "ph_e_red",
            "word": "red",
            "onset": "r",
            "rime": "ed",
            "blendSpeech": "r ... ed ... red!",
            "wordSpeech": "red!",
            "marathi": "रेड (Red)"
          },
          {
            "key": "ph_e_ted",
            "word": "ted",
            "onset": "t",
            "rime": "ed",
            "blendSpeech": "t ... ed ... ted!",
            "wordSpeech": "ted!",
            "marathi": "टेड (Ted)"
          },
          {
            "key": "ph_e_wed",
            "word": "wed",
            "onset": "w",
            "rime": "ed",
            "blendSpeech": "w ... ed ... wed!",
            "wordSpeech": "wed!",
            "marathi": "वेड (Wed)"
          },
          {
            "key": "ph_e_zed",
            "word": "zed",
            "onset": "z",
            "rime": "ed",
            "blendSpeech": "z ... ed ... zed!",
            "wordSpeech": "zed!",
            "marathi": "झेड (Zed)"
          }
        ]
      },
      {
        "family": "-eg",
        "headerBg": "#10b981",
        "columnBg": "#ecfdf5",
        "familySpeech": "The eg family. eg. as in: Beg, keg, leg, peg, meg!",
        "words": [
          {
            "key": "ph_e_beg",
            "word": "beg",
            "onset": "b",
            "rime": "eg",
            "blendSpeech": "b ... eg ... beg!",
            "wordSpeech": "beg!",
            "marathi": "बेग (Beg)"
          },
          {
            "key": "ph_e_keg",
            "word": "keg",
            "onset": "k",
            "rime": "eg",
            "blendSpeech": "k ... eg ... keg!",
            "wordSpeech": "keg!",
            "marathi": "केग (Keg)"
          },
          {
            "key": "ph_e_leg",
            "word": "leg",
            "onset": "l",
            "rime": "eg",
            "blendSpeech": "l ... eg ... leg!",
            "wordSpeech": "leg!",
            "marathi": "लेग (Leg)"
          },
          {
            "key": "ph_e_peg",
            "word": "peg",
            "onset": "p",
            "rime": "eg",
            "blendSpeech": "p ... eg ... peg!",
            "wordSpeech": "peg!",
            "marathi": "पेग (Peg)"
          },
          {
            "key": "ph_e_meg",
            "word": "meg",
            "onset": "m",
            "rime": "eg",
            "blendSpeech": "m ... eg ... meg!",
            "wordSpeech": "meg!",
            "marathi": "मेग (Meg)"
          }
        ]
      },
      {
        "family": "-en",
        "headerBg": "#8b5cf6",
        "columnBg": "#f5f3ff",
        "familySpeech": "The en family. en. as in: Ben, den, fen, hen, men, pen, ten, zen!",
        "words": [
          {
            "key": "ph_e_ben",
            "word": "ben",
            "onset": "b",
            "rime": "en",
            "blendSpeech": "b ... en ... ben!",
            "wordSpeech": "ben!",
            "marathi": "बेन (Ben)"
          },
          {
            "key": "ph_e_den",
            "word": "den",
            "onset": "d",
            "rime": "en",
            "blendSpeech": "d ... en ... den!",
            "wordSpeech": "den!",
            "marathi": "डेन (Den)"
          },
          {
            "key": "ph_e_fen",
            "word": "fen",
            "onset": "f",
            "rime": "en",
            "blendSpeech": "f ... en ... fen!",
            "wordSpeech": "fen!",
            "marathi": "फेन (Fen)"
          },
          {
            "key": "ph_e_hen",
            "word": "hen",
            "onset": "h",
            "rime": "en",
            "blendSpeech": "h ... en ... hen!",
            "wordSpeech": "hen!",
            "marathi": "हेन (Hen)"
          },
          {
            "key": "ph_e_men",
            "word": "men",
            "onset": "m",
            "rime": "en",
            "blendSpeech": "m ... en ... men!",
            "wordSpeech": "men!",
            "marathi": "मेन (Men)"
          },
          {
            "key": "ph_e_pen",
            "word": "pen",
            "onset": "p",
            "rime": "en",
            "blendSpeech": "p ... en ... pen!",
            "wordSpeech": "pen!",
            "marathi": "पेन (Pen)"
          },
          {
            "key": "ph_e_ten",
            "word": "ten",
            "onset": "t",
            "rime": "en",
            "blendSpeech": "t ... en ... ten!",
            "wordSpeech": "ten!",
            "marathi": "टेन (Ten)"
          },
          {
            "key": "ph_e_zen",
            "word": "zen",
            "onset": "z",
            "rime": "en",
            "blendSpeech": "z ... en ... zen!",
            "wordSpeech": "zen!",
            "marathi": "झेन (Zen)"
          }
        ]
      },
      {
        "family": "-et",
        "headerBg": "#f59e0b",
        "columnBg": "#fffbeb",
        "familySpeech": "The et family. et. as in: Bet, get, jet, let, met, net, pet, set, vet, wet, yet!",
        "words": [
          {
            "key": "ph_e_bet",
            "word": "bet",
            "onset": "b",
            "rime": "et",
            "blendSpeech": "b ... et ... bet!",
            "wordSpeech": "bet!",
            "marathi": "बेट (Bet)"
          },
          {
            "key": "ph_e_get",
            "word": "get",
            "onset": "g",
            "rime": "et",
            "blendSpeech": "g ... et ... get!",
            "wordSpeech": "get!",
            "marathi": "गेट (Get)"
          },
          {
            "key": "ph_e_jet",
            "word": "jet",
            "onset": "j",
            "rime": "et",
            "blendSpeech": "j ... et ... jet!",
            "wordSpeech": "jet!",
            "marathi": "जेट (Jet)"
          },
          {
            "key": "ph_e_let",
            "word": "let",
            "onset": "l",
            "rime": "et",
            "blendSpeech": "l ... et ... let!",
            "wordSpeech": "let!",
            "marathi": "लेट (Let)"
          },
          {
            "key": "ph_e_met",
            "word": "met",
            "onset": "m",
            "rime": "et",
            "blendSpeech": "m ... et ... met!",
            "wordSpeech": "met!",
            "marathi": "मेट (Met)"
          },
          {
            "key": "ph_e_net",
            "word": "net",
            "onset": "n",
            "rime": "et",
            "blendSpeech": "n ... et ... net!",
            "wordSpeech": "net!",
            "marathi": "नेट (Net)"
          },
          {
            "key": "ph_e_pet",
            "word": "pet",
            "onset": "p",
            "rime": "et",
            "blendSpeech": "p ... et ... pet!",
            "wordSpeech": "pet!",
            "marathi": "पेट (Pet)"
          },
          {
            "key": "ph_e_set",
            "word": "set",
            "onset": "s",
            "rime": "et",
            "blendSpeech": "s ... et ... set!",
            "wordSpeech": "set!",
            "marathi": "सेट (Set)"
          },
          {
            "key": "ph_e_vet",
            "word": "vet",
            "onset": "v",
            "rime": "et",
            "blendSpeech": "v ... et ... vet!",
            "wordSpeech": "vet!",
            "marathi": "व्हेट (Vet)"
          },
          {
            "key": "ph_e_wet",
            "word": "wet",
            "onset": "w",
            "rime": "et",
            "blendSpeech": "w ... et ... wet!",
            "wordSpeech": "wet!",
            "marathi": "वेट (Wet)"
          },
          {
            "key": "ph_e_yet",
            "word": "yet",
            "onset": "y",
            "rime": "et",
            "blendSpeech": "y ... et ... yet!",
            "wordSpeech": "yet!",
            "marathi": "येट (Yet)"
          }
        ]
      },
      {
        "family": "-ell",
        "headerBg": "#06b6d4",
        "columnBg": "#ecfeff",
        "familySpeech": "The ell family. ell. as in: Bell, fell, sell, tell, well, yell!",
        "words": [
          {
            "key": "ph_e_bell",
            "word": "bell",
            "onset": "b",
            "rime": "ell",
            "blendSpeech": "b ... ell ... bell!",
            "wordSpeech": "bell!",
            "marathi": "बेल (Bell)"
          },
          {
            "key": "ph_e_fell",
            "word": "fell",
            "onset": "f",
            "rime": "ell",
            "blendSpeech": "f ... ell ... fell!",
            "wordSpeech": "fell!",
            "marathi": "फेल (Fell)"
          },
          {
            "key": "ph_e_sell",
            "word": "sell",
            "onset": "s",
            "rime": "ell",
            "blendSpeech": "s ... ell ... sell!",
            "wordSpeech": "sell!",
            "marathi": "सेल (Sell)"
          },
          {
            "key": "ph_e_tell",
            "word": "tell",
            "onset": "t",
            "rime": "ell",
            "blendSpeech": "t ... ell ... tell!",
            "wordSpeech": "tell!",
            "marathi": "टेल (Tell)"
          },
          {
            "key": "ph_e_well",
            "word": "well",
            "onset": "w",
            "rime": "ell",
            "blendSpeech": "w ... ell ... well!",
            "wordSpeech": "well!",
            "marathi": "वेल (Well)"
          },
          {
            "key": "ph_e_yell",
            "word": "yell",
            "onset": "y",
            "rime": "ell",
            "blendSpeech": "y ... ell ... yell!",
            "wordSpeech": "yell!",
            "marathi": "येल (Yell)"
          }
        ]
      },
      {
        "family": "Other",
        "headerBg": "#d946ef",
        "columnBg": "#fdf4ff",
        "familySpeech": "Other short e words: Web, deb, gem, hem, pep, rex, yes!",
        "words": [
          {
            "key": "ph_e_web",
            "word": "web",
            "onset": "w",
            "rime": "eb",
            "blendSpeech": "w ... eb ... web!",
            "wordSpeech": "web!",
            "marathi": "वेब (Web)"
          },
          {
            "key": "ph_e_deb",
            "word": "deb",
            "onset": "d",
            "rime": "eb",
            "blendSpeech": "d ... eb ... deb!",
            "wordSpeech": "deb!",
            "marathi": "डेब (Deb)"
          },
          {
            "key": "ph_e_gem",
            "word": "gem",
            "onset": "g",
            "rime": "em",
            "blendSpeech": "g ... em ... gem!",
            "wordSpeech": "gem!",
            "marathi": "जेम (Gem)"
          },
          {
            "key": "ph_e_hem",
            "word": "hem",
            "onset": "h",
            "rime": "em",
            "blendSpeech": "h ... em ... hem!",
            "wordSpeech": "hem!",
            "marathi": "हेम (Hem)"
          },
          {
            "key": "ph_e_pep",
            "word": "pep",
            "onset": "p",
            "rime": "ep",
            "blendSpeech": "p ... ep ... pep!",
            "wordSpeech": "pep!",
            "marathi": "पेप (Pep)"
          },
          {
            "key": "ph_e_rex",
            "word": "rex",
            "onset": "r",
            "rime": "ex",
            "blendSpeech": "r ... ex ... rex!",
            "wordSpeech": "rex!",
            "marathi": "रेक्स (Rex)"
          },
          {
            "key": "ph_e_yes",
            "word": "yes",
            "onset": "y",
            "rime": "es",
            "blendSpeech": "y ... es ... yes!",
            "wordSpeech": "yes!",
            "marathi": "येस (Yes)"
          }
        ]
      }
    ]
  },
  {
    "id": "short_i",
    "vowel": "i",
    "title": "short i",
    "color": "#ea580c",
    "headerBg": "#f97316",
    "ipa": "/ɪ/",
    "marathiSound": "इ (i)",
    "phonicSpeech": "Short vowel i, as in igloo. i, igloo.",
    "exampleWords": "igloo, pin, pig, sit, lip, kid, bib",
    "families": [
      {
        "family": "-ib",
        "headerBg": "#f43f5e",
        "columnBg": "#fff1f2",
        "familySpeech": "The ib family. ib. as in: Bib, fib, nib, rib!",
        "words": [
          {
            "key": "ph_i_bib",
            "word": "bib",
            "onset": "b",
            "rime": "ib",
            "blendSpeech": "b ... ib ... bib!",
            "wordSpeech": "bib!",
            "marathi": "बिब (Bib)"
          },
          {
            "key": "ph_i_fib",
            "word": "fib",
            "onset": "f",
            "rime": "ib",
            "blendSpeech": "f ... ib ... fib!",
            "wordSpeech": "fib!",
            "marathi": "फिब (Fib)"
          },
          {
            "key": "ph_i_nib",
            "word": "nib",
            "onset": "n",
            "rime": "ib",
            "blendSpeech": "n ... ib ... nib!",
            "wordSpeech": "nib!",
            "marathi": "निब (Nib)"
          },
          {
            "key": "ph_i_rib",
            "word": "rib",
            "onset": "r",
            "rime": "ib",
            "blendSpeech": "r ... ib ... rib!",
            "wordSpeech": "rib!",
            "marathi": "रिब (Rib)"
          }
        ]
      },
      {
        "family": "-id",
        "headerBg": "#ec4899",
        "columnBg": "#fdf2f8",
        "familySpeech": "The id family. id. as in: Bid, did, hid, kid, lid, mid, rid, sid!",
        "words": [
          {
            "key": "ph_i_bid",
            "word": "bid",
            "onset": "b",
            "rime": "id",
            "blendSpeech": "b ... id ... bid!",
            "wordSpeech": "bid!",
            "marathi": "बीड (Bid)"
          },
          {
            "key": "ph_i_did",
            "word": "did",
            "onset": "d",
            "rime": "id",
            "blendSpeech": "d ... id ... did!",
            "wordSpeech": "did!",
            "marathi": "डिड (Did)"
          },
          {
            "key": "ph_i_hid",
            "word": "hid",
            "onset": "h",
            "rime": "id",
            "blendSpeech": "h ... id ... hid!",
            "wordSpeech": "hid!",
            "marathi": "हिड (Hid)"
          },
          {
            "key": "ph_i_kid",
            "word": "kid",
            "onset": "k",
            "rime": "id",
            "blendSpeech": "k ... id ... kid!",
            "wordSpeech": "kid!",
            "marathi": "किड (Kid)"
          },
          {
            "key": "ph_i_lid",
            "word": "lid",
            "onset": "l",
            "rime": "id",
            "blendSpeech": "l ... id ... lid!",
            "wordSpeech": "lid!",
            "marathi": "लिड (Lid)"
          },
          {
            "key": "ph_i_mid",
            "word": "mid",
            "onset": "m",
            "rime": "id",
            "blendSpeech": "m ... id ... mid!",
            "wordSpeech": "mid!",
            "marathi": "मिड (Mid)"
          },
          {
            "key": "ph_i_rid",
            "word": "rid",
            "onset": "r",
            "rime": "id",
            "blendSpeech": "r ... id ... rid!",
            "wordSpeech": "rid!",
            "marathi": "रिड (Rid)"
          },
          {
            "key": "ph_i_sid",
            "word": "sid",
            "onset": "s",
            "rime": "id",
            "blendSpeech": "s ... id ... sid!",
            "wordSpeech": "sid!",
            "marathi": "सिड (Sid)"
          }
        ]
      },
      {
        "family": "-ig",
        "headerBg": "#14b8a6",
        "columnBg": "#f0fdfa",
        "familySpeech": "The ig family. ig. as in: Big, dig, fig, gig, jig, pig, rig, wig, zig!",
        "words": [
          {
            "key": "ph_i_big",
            "word": "big",
            "onset": "b",
            "rime": "ig",
            "blendSpeech": "b ... ig ... big!",
            "wordSpeech": "big!",
            "marathi": "बिग (Big)"
          },
          {
            "key": "ph_i_dig",
            "word": "dig",
            "onset": "d",
            "rime": "ig",
            "blendSpeech": "d ... ig ... dig!",
            "wordSpeech": "dig!",
            "marathi": "डिग (Dig)"
          },
          {
            "key": "ph_i_fig",
            "word": "fig",
            "onset": "f",
            "rime": "ig",
            "blendSpeech": "f ... ig ... fig!",
            "wordSpeech": "fig!",
            "marathi": "फिग (Fig)"
          },
          {
            "key": "ph_i_gig",
            "word": "gig",
            "onset": "g",
            "rime": "ig",
            "blendSpeech": "g ... ig ... gig!",
            "wordSpeech": "gig!",
            "marathi": "गिग (Gig)"
          },
          {
            "key": "ph_i_jig",
            "word": "jig",
            "onset": "j",
            "rime": "ig",
            "blendSpeech": "j ... ig ... jig!",
            "wordSpeech": "jig!",
            "marathi": "जिग (Jig)"
          },
          {
            "key": "ph_i_pig",
            "word": "pig",
            "onset": "p",
            "rime": "ig",
            "blendSpeech": "p ... ig ... pig!",
            "wordSpeech": "pig!",
            "marathi": "पिग (Pig)"
          },
          {
            "key": "ph_i_rig",
            "word": "rig",
            "onset": "r",
            "rime": "ig",
            "blendSpeech": "r ... ig ... rig!",
            "wordSpeech": "rig!",
            "marathi": "रिग (Rig)"
          },
          {
            "key": "ph_i_wig",
            "word": "wig",
            "onset": "w",
            "rime": "ig",
            "blendSpeech": "w ... ig ... wig!",
            "wordSpeech": "wig!",
            "marathi": "विग (Wig)"
          },
          {
            "key": "ph_i_zig",
            "word": "zig",
            "onset": "z",
            "rime": "ig",
            "blendSpeech": "z ... ig ... zig!",
            "wordSpeech": "zig!",
            "marathi": "झिग (Zig)"
          }
        ]
      },
      {
        "family": "-im",
        "headerBg": "#8b5cf6",
        "columnBg": "#f5f3ff",
        "familySpeech": "The im family. im. as in: Dim, him, rim, vim, tim, jim!",
        "words": [
          {
            "key": "ph_i_dim",
            "word": "dim",
            "onset": "d",
            "rime": "im",
            "blendSpeech": "d ... im ... dim!",
            "wordSpeech": "dim!",
            "marathi": "डिम (Dim)"
          },
          {
            "key": "ph_i_him",
            "word": "him",
            "onset": "h",
            "rime": "im",
            "blendSpeech": "h ... im ... him!",
            "wordSpeech": "him!",
            "marathi": "हिम (Him)"
          },
          {
            "key": "ph_i_rim",
            "word": "rim",
            "onset": "r",
            "rime": "im",
            "blendSpeech": "r ... im ... rim!",
            "wordSpeech": "rim!",
            "marathi": "रिम (Rim)"
          },
          {
            "key": "ph_i_vim",
            "word": "vim",
            "onset": "v",
            "rime": "im",
            "blendSpeech": "v ... im ... vim!",
            "wordSpeech": "vim!",
            "marathi": "व्हिम (Vim)"
          },
          {
            "key": "ph_i_tim",
            "word": "tim",
            "onset": "t",
            "rime": "im",
            "blendSpeech": "t ... im ... tim!",
            "wordSpeech": "tim!",
            "marathi": "टिम (Tim)"
          },
          {
            "key": "ph_i_jim",
            "word": "jim",
            "onset": "j",
            "rime": "im",
            "blendSpeech": "j ... im ... jim!",
            "wordSpeech": "jim!",
            "marathi": "जिम (Jim)"
          }
        ]
      },
      {
        "family": "-in",
        "headerBg": "#84cc16",
        "columnBg": "#f7fee7",
        "familySpeech": "The in family. in. as in: Bin, din, fin, kin, pin, sin, tin, win!",
        "words": [
          {
            "key": "ph_i_bin",
            "word": "bin",
            "onset": "b",
            "rime": "in",
            "blendSpeech": "b ... in ... bin!",
            "wordSpeech": "bin!",
            "marathi": "बिन (Bin)"
          },
          {
            "key": "ph_i_din",
            "word": "din",
            "onset": "d",
            "rime": "in",
            "blendSpeech": "d ... in ... din!",
            "wordSpeech": "din!",
            "marathi": "डिन (Din)"
          },
          {
            "key": "ph_i_fin",
            "word": "fin",
            "onset": "f",
            "rime": "in",
            "blendSpeech": "f ... in ... fin!",
            "wordSpeech": "fin!",
            "marathi": "फिन (Fin)"
          },
          {
            "key": "ph_i_kin",
            "word": "kin",
            "onset": "k",
            "rime": "in",
            "blendSpeech": "k ... in ... kin!",
            "wordSpeech": "kin!",
            "marathi": "किन (Kin)"
          },
          {
            "key": "ph_i_pin",
            "word": "pin",
            "onset": "p",
            "rime": "in",
            "blendSpeech": "p ... in ... pin!",
            "wordSpeech": "pin!",
            "marathi": "पिन (Pin)"
          },
          {
            "key": "ph_i_sin",
            "word": "sin",
            "onset": "s",
            "rime": "in",
            "blendSpeech": "s ... in ... sin!",
            "wordSpeech": "sin!",
            "marathi": "सिन (Sin)"
          },
          {
            "key": "ph_i_tin",
            "word": "tin",
            "onset": "t",
            "rime": "in",
            "blendSpeech": "t ... in ... tin!",
            "wordSpeech": "tin!",
            "marathi": "टिन (Tin)"
          },
          {
            "key": "ph_i_win",
            "word": "win",
            "onset": "w",
            "rime": "in",
            "blendSpeech": "w ... in ... win!",
            "wordSpeech": "win!",
            "marathi": "विन (Win)"
          }
        ]
      },
      {
        "family": "-ip",
        "headerBg": "#f97316",
        "columnBg": "#fff7ed",
        "familySpeech": "The ip family. ip. as in: Dip, hip, lip, nip, rip, sip, tip, zip!",
        "words": [
          {
            "key": "ph_i_dip",
            "word": "dip",
            "onset": "d",
            "rime": "ip",
            "blendSpeech": "d ... ip ... dip!",
            "wordSpeech": "dip!",
            "marathi": "डिप (Dip)"
          },
          {
            "key": "ph_i_hip",
            "word": "hip",
            "onset": "h",
            "rime": "ip",
            "blendSpeech": "h ... ip ... hip!",
            "wordSpeech": "hip!",
            "marathi": "हिप (Hip)"
          },
          {
            "key": "ph_i_lip",
            "word": "lip",
            "onset": "l",
            "rime": "ip",
            "blendSpeech": "l ... ip ... lip!",
            "wordSpeech": "lip!",
            "marathi": "लिप (Lip)"
          },
          {
            "key": "ph_i_nip",
            "word": "nip",
            "onset": "n",
            "rime": "ip",
            "blendSpeech": "n ... ip ... nip!",
            "wordSpeech": "nip!",
            "marathi": "निप (Nip)"
          },
          {
            "key": "ph_i_rip",
            "word": "rip",
            "onset": "r",
            "rime": "ip",
            "blendSpeech": "r ... ip ... rip!",
            "wordSpeech": "rip!",
            "marathi": "रिप (Rip)"
          },
          {
            "key": "ph_i_sip",
            "word": "sip",
            "onset": "s",
            "rime": "ip",
            "blendSpeech": "s ... ip ... sip!",
            "wordSpeech": "sip!",
            "marathi": "सिप (Sip)"
          },
          {
            "key": "ph_i_tip",
            "word": "tip",
            "onset": "t",
            "rime": "ip",
            "blendSpeech": "t ... ip ... tip!",
            "wordSpeech": "tip!",
            "marathi": "टिप (Tip)"
          },
          {
            "key": "ph_i_zip",
            "word": "zip",
            "onset": "z",
            "rime": "ip",
            "blendSpeech": "z ... ip ... zip!",
            "wordSpeech": "zip!",
            "marathi": "झिप (Zip)"
          }
        ]
      },
      {
        "family": "-it",
        "headerBg": "#6366f1",
        "columnBg": "#eef2ff",
        "familySpeech": "The it family. it. as in: Bit, fit, hit, kit, lit, pit, sit, wit!",
        "words": [
          {
            "key": "ph_i_bit",
            "word": "bit",
            "onset": "b",
            "rime": "it",
            "blendSpeech": "b ... it ... bit!",
            "wordSpeech": "bit!",
            "marathi": "बिट (Bit)"
          },
          {
            "key": "ph_i_fit",
            "word": "fit",
            "onset": "f",
            "rime": "it",
            "blendSpeech": "f ... it ... fit!",
            "wordSpeech": "fit!",
            "marathi": "फिट (Fit)"
          },
          {
            "key": "ph_i_hit",
            "word": "hit",
            "onset": "h",
            "rime": "it",
            "blendSpeech": "h ... it ... hit!",
            "wordSpeech": "hit!",
            "marathi": "हिट (Hit)"
          },
          {
            "key": "ph_i_kit",
            "word": "kit",
            "onset": "k",
            "rime": "it",
            "blendSpeech": "k ... it ... kit!",
            "wordSpeech": "kit!",
            "marathi": "किट (Kit)"
          },
          {
            "key": "ph_i_lit",
            "word": "lit",
            "onset": "l",
            "rime": "it",
            "blendSpeech": "l ... it ... lit!",
            "wordSpeech": "lit!",
            "marathi": "लिट (Lit)"
          },
          {
            "key": "ph_i_pit",
            "word": "pit",
            "onset": "p",
            "rime": "it",
            "blendSpeech": "p ... it ... pit!",
            "wordSpeech": "pit!",
            "marathi": "पिट (Pit)"
          },
          {
            "key": "ph_i_sit",
            "word": "sit",
            "onset": "s",
            "rime": "it",
            "blendSpeech": "s ... it ... sit!",
            "wordSpeech": "sit!",
            "marathi": "सिट (Sit)"
          },
          {
            "key": "ph_i_wit",
            "word": "wit",
            "onset": "w",
            "rime": "it",
            "blendSpeech": "w ... it ... wit!",
            "wordSpeech": "wit!",
            "marathi": "विट (Wit)"
          }
        ]
      },
      {
        "family": "-ix",
        "headerBg": "#eab308",
        "columnBg": "#fefce8",
        "familySpeech": "The ix family. ix. as in: Fix, mix, six!",
        "words": [
          {
            "key": "ph_i_fix",
            "word": "fix",
            "onset": "f",
            "rime": "ix",
            "blendSpeech": "f ... ix ... fix!",
            "wordSpeech": "fix!",
            "marathi": "फिक्स (Fix)"
          },
          {
            "key": "ph_i_mix",
            "word": "mix",
            "onset": "m",
            "rime": "ix",
            "blendSpeech": "m ... ix ... mix!",
            "wordSpeech": "mix!",
            "marathi": "मिक्स (Mix)"
          },
          {
            "key": "ph_i_six",
            "word": "six",
            "onset": "s",
            "rime": "ix",
            "blendSpeech": "s ... ix ... six!",
            "wordSpeech": "six!",
            "marathi": "सिक्स (Six)"
          }
        ]
      }
    ]
  },
  {
    "id": "short_o",
    "vowel": "o",
    "title": "short o",
    "color": "#16a34a",
    "headerBg": "#22c55e",
    "ipa": "/ɒ/",
    "marathiSound": "ऑ (aw)",
    "phonicSpeech": "Short vowel o, as in octopus. o, octopus.",
    "exampleWords": "octopus, dog, pot, box, mop, hot, rod",
    "families": [
      {
        "family": "-ob",
        "headerBg": "#0ea5e9",
        "columnBg": "#f0f9ff",
        "familySpeech": "The ob family. ob. as in: Bob, cob, gob, job, mob, rob, sob, lob!",
        "words": [
          {
            "key": "ph_o_bob",
            "word": "bob",
            "onset": "b",
            "rime": "ob",
            "blendSpeech": "b ... ob ... bob!",
            "wordSpeech": "bob!",
            "marathi": "बॉब (Bob)"
          },
          {
            "key": "ph_o_cob",
            "word": "cob",
            "onset": "c",
            "rime": "ob",
            "blendSpeech": "c ... ob ... cob!",
            "wordSpeech": "cob!",
            "marathi": "कॉब (Cob)"
          },
          {
            "key": "ph_o_gob",
            "word": "gob",
            "onset": "g",
            "rime": "ob",
            "blendSpeech": "g ... ob ... gob!",
            "wordSpeech": "gob!",
            "marathi": "गॉब (Gob)"
          },
          {
            "key": "ph_o_job",
            "word": "job",
            "onset": "j",
            "rime": "ob",
            "blendSpeech": "j ... ob ... job!",
            "wordSpeech": "job!",
            "marathi": "जॉब (Job)"
          },
          {
            "key": "ph_o_mob",
            "word": "mob",
            "onset": "m",
            "rime": "ob",
            "blendSpeech": "m ... ob ... mob!",
            "wordSpeech": "mob!",
            "marathi": "मॉब (Mob)"
          },
          {
            "key": "ph_o_rob",
            "word": "rob",
            "onset": "r",
            "rime": "ob",
            "blendSpeech": "r ... ob ... rob!",
            "wordSpeech": "rob!",
            "marathi": "रॉब (Rob)"
          },
          {
            "key": "ph_o_sob",
            "word": "sob",
            "onset": "s",
            "rime": "ob",
            "blendSpeech": "s ... ob ... sob!",
            "wordSpeech": "sob!",
            "marathi": "सॉब (Sob)"
          },
          {
            "key": "ph_o_lob",
            "word": "lob",
            "onset": "l",
            "rime": "ob",
            "blendSpeech": "l ... ob ... lob!",
            "wordSpeech": "lob!",
            "marathi": "लॉब (Lob)"
          }
        ]
      },
      {
        "family": "-od",
        "headerBg": "#ec4899",
        "columnBg": "#fdf2f8",
        "familySpeech": "The od family. od. as in: Cod, god, nod, pod, rod, sod!",
        "words": [
          {
            "key": "ph_o_cod",
            "word": "cod",
            "onset": "c",
            "rime": "od",
            "blendSpeech": "c ... od ... cod!",
            "wordSpeech": "cod!",
            "marathi": "कॉड (Cod)"
          },
          {
            "key": "ph_o_god",
            "word": "god",
            "onset": "g",
            "rime": "od",
            "blendSpeech": "g ... od ... god!",
            "wordSpeech": "god!",
            "marathi": "गॉड (God)"
          },
          {
            "key": "ph_o_nod",
            "word": "nod",
            "onset": "n",
            "rime": "od",
            "blendSpeech": "n ... od ... nod!",
            "wordSpeech": "nod!",
            "marathi": "नॉड (Nod)"
          },
          {
            "key": "ph_o_pod",
            "word": "pod",
            "onset": "p",
            "rime": "od",
            "blendSpeech": "p ... od ... pod!",
            "wordSpeech": "pod!",
            "marathi": "पॉड (Pod)"
          },
          {
            "key": "ph_o_rod",
            "word": "rod",
            "onset": "r",
            "rime": "od",
            "blendSpeech": "r ... od ... rod!",
            "wordSpeech": "rod!",
            "marathi": "रॉड (Rod)"
          },
          {
            "key": "ph_o_sod",
            "word": "sod",
            "onset": "s",
            "rime": "od",
            "blendSpeech": "s ... od ... sod!",
            "wordSpeech": "sod!",
            "marathi": "सॉड (Sod)"
          }
        ]
      },
      {
        "family": "-og",
        "headerBg": "#10b981",
        "columnBg": "#ecfdf5",
        "familySpeech": "The og family. og. as in: Bog, cog, dog, fog, hog, jog, log!",
        "words": [
          {
            "key": "ph_o_bog",
            "word": "bog",
            "onset": "b",
            "rime": "og",
            "blendSpeech": "b ... og ... bog!",
            "wordSpeech": "bog!",
            "marathi": "बॉग (Bog)"
          },
          {
            "key": "ph_o_cog",
            "word": "cog",
            "onset": "c",
            "rime": "og",
            "blendSpeech": "c ... og ... cog!",
            "wordSpeech": "cog!",
            "marathi": "कॉग (Cog)"
          },
          {
            "key": "ph_o_dog",
            "word": "dog",
            "onset": "d",
            "rime": "og",
            "blendSpeech": "d ... og ... dog!",
            "wordSpeech": "dog!",
            "marathi": "डॉग (Dog)"
          },
          {
            "key": "ph_o_fog",
            "word": "fog",
            "onset": "f",
            "rime": "og",
            "blendSpeech": "f ... og ... fog!",
            "wordSpeech": "fog!",
            "marathi": "फॉग (Fog)"
          },
          {
            "key": "ph_o_hog",
            "word": "hog",
            "onset": "h",
            "rime": "og",
            "blendSpeech": "h ... og ... hog!",
            "wordSpeech": "hog!",
            "marathi": "हॉग (Hog)"
          },
          {
            "key": "ph_o_jog",
            "word": "jog",
            "onset": "j",
            "rime": "og",
            "blendSpeech": "j ... og ... jog!",
            "wordSpeech": "jog!",
            "marathi": "जॉग (Jog)"
          },
          {
            "key": "ph_o_log",
            "word": "log",
            "onset": "l",
            "rime": "og",
            "blendSpeech": "l ... og ... log!",
            "wordSpeech": "log!",
            "marathi": "लॉग (Log)"
          }
        ]
      },
      {
        "family": "-op",
        "headerBg": "#f43f5e",
        "columnBg": "#fff1f2",
        "familySpeech": "The op family. op. as in: Bop, cop, hop, mop, pop, sop, top!",
        "words": [
          {
            "key": "ph_o_bop",
            "word": "bop",
            "onset": "b",
            "rime": "op",
            "blendSpeech": "b ... op ... bop!",
            "wordSpeech": "bop!",
            "marathi": "बॉप (Bop)"
          },
          {
            "key": "ph_o_cop",
            "word": "cop",
            "onset": "c",
            "rime": "op",
            "blendSpeech": "c ... op ... cop!",
            "wordSpeech": "cop!",
            "marathi": "कॉॅप (Cop)"
          },
          {
            "key": "ph_o_hop",
            "word": "hop",
            "onset": "h",
            "rime": "op",
            "blendSpeech": "h ... op ... hop!",
            "wordSpeech": "hop!",
            "marathi": "हॉप (Hop)"
          },
          {
            "key": "ph_o_mop",
            "word": "mop",
            "onset": "m",
            "rime": "op",
            "blendSpeech": "m ... op ... mop!",
            "wordSpeech": "mop!",
            "marathi": "मॉप (Mop)"
          },
          {
            "key": "ph_o_pop",
            "word": "pop",
            "onset": "p",
            "rime": "op",
            "blendSpeech": "p ... op ... pop!",
            "wordSpeech": "pop!",
            "marathi": "पॉप (Pop)"
          },
          {
            "key": "ph_o_sop",
            "word": "sop",
            "onset": "s",
            "rime": "op",
            "blendSpeech": "s ... op ... sop!",
            "wordSpeech": "sop!",
            "marathi": "सॉप (Sop)"
          },
          {
            "key": "ph_o_top",
            "word": "top",
            "onset": "t",
            "rime": "op",
            "blendSpeech": "t ... op ... top!",
            "wordSpeech": "top!",
            "marathi": "टॉप (Top)"
          }
        ]
      },
      {
        "family": "-ot",
        "headerBg": "#a855f7",
        "columnBg": "#faf5ff",
        "familySpeech": "The ot family. ot. as in: Cot, dot, got, hot, jot, lot, not, pot, rot, tot!",
        "words": [
          {
            "key": "ph_o_cot",
            "word": "cot",
            "onset": "c",
            "rime": "ot",
            "blendSpeech": "c ... ot ... cot!",
            "wordSpeech": "cot!",
            "marathi": "कॉट (Cot)"
          },
          {
            "key": "ph_o_dot",
            "word": "dot",
            "onset": "d",
            "rime": "ot",
            "blendSpeech": "d ... ot ... dot!",
            "wordSpeech": "dot!",
            "marathi": "डॉट (Dot)"
          },
          {
            "key": "ph_o_got",
            "word": "got",
            "onset": "g",
            "rime": "ot",
            "blendSpeech": "g ... ot ... got!",
            "wordSpeech": "got!",
            "marathi": "गॉट (Got)"
          },
          {
            "key": "ph_o_hot",
            "word": "hot",
            "onset": "h",
            "rime": "ot",
            "blendSpeech": "h ... ot ... hot!",
            "wordSpeech": "hot!",
            "marathi": "हॉट (Hot)"
          },
          {
            "key": "ph_o_jot",
            "word": "jot",
            "onset": "j",
            "rime": "ot",
            "blendSpeech": "j ... ot ... jot!",
            "wordSpeech": "jot!",
            "marathi": "जॉट (Jot)"
          },
          {
            "key": "ph_o_lot",
            "word": "lot",
            "onset": "l",
            "rime": "ot",
            "blendSpeech": "l ... ot ... lot!",
            "wordSpeech": "lot!",
            "marathi": "लॉट (Lot)"
          },
          {
            "key": "ph_o_not",
            "word": "not",
            "onset": "n",
            "rime": "ot",
            "blendSpeech": "n ... ot ... not!",
            "wordSpeech": "not!",
            "marathi": "नॉट (Not)"
          },
          {
            "key": "ph_o_pot",
            "word": "pot",
            "onset": "p",
            "rime": "ot",
            "blendSpeech": "p ... ot ... pot!",
            "wordSpeech": "pot!",
            "marathi": "पॉट (Pot)"
          },
          {
            "key": "ph_o_rot",
            "word": "rot",
            "onset": "r",
            "rime": "ot",
            "blendSpeech": "r ... ot ... rot!",
            "wordSpeech": "rot!",
            "marathi": "रॉट (Rot)"
          },
          {
            "key": "ph_o_tot",
            "word": "tot",
            "onset": "t",
            "rime": "ot",
            "blendSpeech": "t ... ot ... tot!",
            "wordSpeech": "tot!",
            "marathi": "टॉट (Tot)"
          }
        ]
      },
      {
        "family": "-ox",
        "headerBg": "#eab308",
        "columnBg": "#fefce8",
        "familySpeech": "The ox family. ox. as in: Box, fox, pox!",
        "words": [
          {
            "key": "ph_o_box",
            "word": "box",
            "onset": "b",
            "rime": "ox",
            "blendSpeech": "b ... ox ... box!",
            "wordSpeech": "box!",
            "marathi": "बॉक्स (Box)"
          },
          {
            "key": "ph_o_fox",
            "word": "fox",
            "onset": "f",
            "rime": "ox",
            "blendSpeech": "f ... ox ... fox!",
            "wordSpeech": "fox!",
            "marathi": "फॉक्स (Fox)"
          },
          {
            "key": "ph_o_pox",
            "word": "pox",
            "onset": "p",
            "rime": "ox",
            "blendSpeech": "p ... ox ... pox!",
            "wordSpeech": "pox!",
            "marathi": "पॉक्स (Pox)"
          }
        ]
      },
      {
        "family": "Other",
        "headerBg": "#f97316",
        "columnBg": "#fff7ed",
        "familySpeech": "Other short o words: Mom, pom, tom!",
        "words": [
          {
            "key": "ph_o_mom",
            "word": "mom",
            "onset": "m",
            "rime": "om",
            "blendSpeech": "m ... om ... mom!",
            "wordSpeech": "mom!",
            "marathi": "मॉम (Mom)"
          },
          {
            "key": "ph_o_pom",
            "word": "pom",
            "onset": "p",
            "rime": "om",
            "blendSpeech": "p ... om ... pom!",
            "wordSpeech": "pom!",
            "marathi": "पॉम (Pom)"
          },
          {
            "key": "ph_o_tom",
            "word": "tom",
            "onset": "t",
            "rime": "om",
            "blendSpeech": "t ... om ... tom!",
            "wordSpeech": "tom!",
            "marathi": "टॉम (Tom)"
          }
        ]
      }
    ]
  },
  {
    "id": "short_u",
    "vowel": "u",
    "title": "short u",
    "color": "#9333ea",
    "headerBg": "#a855f7",
    "ipa": "/ʌ/",
    "marathiSound": "अ (uh)",
    "phonicSpeech": "Short vowel u, as in umbrella. u, umbrella.",
    "exampleWords": "umbrella, sun, cup, bug, hut, tub, mud",
    "families": [
      {
        "family": "-ub",
        "headerBg": "#ef4444",
        "columnBg": "#fef2f2",
        "familySpeech": "The ub family. ub. as in: Cub, dub, hub, pub, rub, sub, tub, nub!",
        "words": [
          {
            "key": "ph_u_cub",
            "word": "cub",
            "onset": "c",
            "rime": "ub",
            "blendSpeech": "c ... ub ... cub!",
            "wordSpeech": "cub!",
            "marathi": "कब (Cub)"
          },
          {
            "key": "ph_u_dub",
            "word": "dub",
            "onset": "d",
            "rime": "ub",
            "blendSpeech": "d ... ub ... dub!",
            "wordSpeech": "dub!",
            "marathi": "डब (Dub)"
          },
          {
            "key": "ph_u_hub",
            "word": "hub",
            "onset": "h",
            "rime": "ub",
            "blendSpeech": "h ... ub ... hub!",
            "wordSpeech": "hub!",
            "marathi": "हब (Hub)"
          },
          {
            "key": "ph_u_pub",
            "word": "pub",
            "onset": "p",
            "rime": "ub",
            "blendSpeech": "p ... ub ... pub!",
            "wordSpeech": "pub!",
            "marathi": "पब (Pub)"
          },
          {
            "key": "ph_u_rub",
            "word": "rub",
            "onset": "r",
            "rime": "ub",
            "blendSpeech": "r ... ub ... rub!",
            "wordSpeech": "rub!",
            "marathi": "रब (Rub)"
          },
          {
            "key": "ph_u_sub",
            "word": "sub",
            "onset": "s",
            "rime": "ub",
            "blendSpeech": "s ... ub ... sub!",
            "wordSpeech": "sub!",
            "marathi": "सब (Sub)"
          },
          {
            "key": "ph_u_tub",
            "word": "tub",
            "onset": "t",
            "rime": "ub",
            "blendSpeech": "t ... ub ... tub!",
            "wordSpeech": "tub!",
            "marathi": "टब (Tub)"
          },
          {
            "key": "ph_u_nub",
            "word": "nub",
            "onset": "n",
            "rime": "ub",
            "blendSpeech": "n ... ub ... nub!",
            "wordSpeech": "nub!",
            "marathi": "नब (Nub)"
          }
        ]
      },
      {
        "family": "-ud",
        "headerBg": "#ec4899",
        "columnBg": "#fdf2f8",
        "familySpeech": "The ud family. ud. as in: Bud, cud, dud, mud!",
        "words": [
          {
            "key": "ph_u_bud",
            "word": "bud",
            "onset": "b",
            "rime": "ud",
            "blendSpeech": "b ... ud ... bud!",
            "wordSpeech": "bud!",
            "marathi": "बड (Bud)"
          },
          {
            "key": "ph_u_cud",
            "word": "cud",
            "onset": "c",
            "rime": "ud",
            "blendSpeech": "c ... ud ... cud!",
            "wordSpeech": "cud!",
            "marathi": "कड (Cud)"
          },
          {
            "key": "ph_u_dud",
            "word": "dud",
            "onset": "d",
            "rime": "ud",
            "blendSpeech": "d ... ud ... dud!",
            "wordSpeech": "dud!",
            "marathi": "डड (Dud)"
          },
          {
            "key": "ph_u_mud",
            "word": "mud",
            "onset": "m",
            "rime": "ud",
            "blendSpeech": "m ... ud ... mud!",
            "wordSpeech": "mud!",
            "marathi": "मड (Mud)"
          }
        ]
      },
      {
        "family": "-ug",
        "headerBg": "#3b82f6",
        "columnBg": "#eff6ff",
        "familySpeech": "The ug family. ug. as in: Bug, dug, hug, jug, lug, mug, pug, rug, tug!",
        "words": [
          {
            "key": "ph_u_bug",
            "word": "bug",
            "onset": "b",
            "rime": "ug",
            "blendSpeech": "b ... ug ... bug!",
            "wordSpeech": "bug!",
            "marathi": "बग (Bug)"
          },
          {
            "key": "ph_u_dug",
            "word": "dug",
            "onset": "d",
            "rime": "ug",
            "blendSpeech": "d ... ug ... dug!",
            "wordSpeech": "dug!",
            "marathi": "डग (Dug)"
          },
          {
            "key": "ph_u_hug",
            "word": "hug",
            "onset": "h",
            "rime": "ug",
            "blendSpeech": "h ... ug ... hug!",
            "wordSpeech": "hug!",
            "marathi": "हग (Hug)"
          },
          {
            "key": "ph_u_jug",
            "word": "jug",
            "onset": "j",
            "rime": "ug",
            "blendSpeech": "j ... ug ... jug!",
            "wordSpeech": "jug!",
            "marathi": "जग (Jug)"
          },
          {
            "key": "ph_u_lug",
            "word": "lug",
            "onset": "l",
            "rime": "ug",
            "blendSpeech": "l ... ug ... lug!",
            "wordSpeech": "lug!",
            "marathi": "लग (Lug)"
          },
          {
            "key": "ph_u_mug",
            "word": "mug",
            "onset": "m",
            "rime": "ug",
            "blendSpeech": "m ... ug ... mug!",
            "wordSpeech": "mug!",
            "marathi": "मग (Mug)"
          },
          {
            "key": "ph_u_pug",
            "word": "pug",
            "onset": "p",
            "rime": "ug",
            "blendSpeech": "p ... ug ... pug!",
            "wordSpeech": "pug!",
            "marathi": "पग (Pug)"
          },
          {
            "key": "ph_u_rug",
            "word": "rug",
            "onset": "r",
            "rime": "ug",
            "blendSpeech": "r ... ug ... rug!",
            "wordSpeech": "rug!",
            "marathi": "रग (Rug)"
          },
          {
            "key": "ph_u_tug",
            "word": "tug",
            "onset": "t",
            "rime": "ug",
            "blendSpeech": "t ... ug ... tug!",
            "wordSpeech": "tug!",
            "marathi": "टग (Tug)"
          }
        ]
      },
      {
        "family": "-um",
        "headerBg": "#10b981",
        "columnBg": "#ecfdf5",
        "familySpeech": "The um family. um. as in: Bum, gum, hum, mum, sum, yum!",
        "words": [
          {
            "key": "ph_u_bum",
            "word": "bum",
            "onset": "b",
            "rime": "um",
            "blendSpeech": "b ... um ... bum!",
            "wordSpeech": "bum!",
            "marathi": "बम (Bum)"
          },
          {
            "key": "ph_u_gum",
            "word": "gum",
            "onset": "g",
            "rime": "um",
            "blendSpeech": "g ... um ... gum!",
            "wordSpeech": "gum!",
            "marathi": "गम (Gum)"
          },
          {
            "key": "ph_u_hum",
            "word": "hum",
            "onset": "h",
            "rime": "um",
            "blendSpeech": "h ... um ... hum!",
            "wordSpeech": "hum!",
            "marathi": "हम (Hum)"
          },
          {
            "key": "ph_u_mum",
            "word": "mum",
            "onset": "m",
            "rime": "um",
            "blendSpeech": "m ... um ... mum!",
            "wordSpeech": "mum!",
            "marathi": "मम (Mum)"
          },
          {
            "key": "ph_u_sum",
            "word": "sum",
            "onset": "s",
            "rime": "um",
            "blendSpeech": "s ... um ... sum!",
            "wordSpeech": "sum!",
            "marathi": "सम (Sum)"
          },
          {
            "key": "ph_u_yum",
            "word": "yum",
            "onset": "y",
            "rime": "um",
            "blendSpeech": "y ... um ... yum!",
            "wordSpeech": "yum!",
            "marathi": "यम (Yum)"
          }
        ]
      },
      {
        "family": "-un",
        "headerBg": "#f59e0b",
        "columnBg": "#fffbeb",
        "familySpeech": "The un family. un. as in: Bun, fun, gun, nun, pun, run, sun!",
        "words": [
          {
            "key": "ph_u_bun",
            "word": "bun",
            "onset": "b",
            "rime": "un",
            "blendSpeech": "b ... un ... bun!",
            "wordSpeech": "bun!",
            "marathi": "बन (Bun)"
          },
          {
            "key": "ph_u_fun",
            "word": "fun",
            "onset": "f",
            "rime": "un",
            "blendSpeech": "f ... un ... fun!",
            "wordSpeech": "fun!",
            "marathi": "फन (Fun)"
          },
          {
            "key": "ph_u_gun",
            "word": "gun",
            "onset": "g",
            "rime": "un",
            "blendSpeech": "g ... un ... gun!",
            "wordSpeech": "gun!",
            "marathi": "गन (Gun)"
          },
          {
            "key": "ph_u_nun",
            "word": "nun",
            "onset": "n",
            "rime": "un",
            "blendSpeech": "n ... un ... nun!",
            "wordSpeech": "nun!",
            "marathi": "नन (Nun)"
          },
          {
            "key": "ph_u_pun",
            "word": "pun",
            "onset": "p",
            "rime": "un",
            "blendSpeech": "p ... un ... pun!",
            "wordSpeech": "pun!",
            "marathi": "पन (Pun)"
          },
          {
            "key": "ph_u_run",
            "word": "run",
            "onset": "r",
            "rime": "un",
            "blendSpeech": "r ... un ... run!",
            "wordSpeech": "run!",
            "marathi": "रन (Run)"
          },
          {
            "key": "ph_u_sun",
            "word": "sun",
            "onset": "s",
            "rime": "un",
            "blendSpeech": "s ... un ... sun!",
            "wordSpeech": "sun!",
            "marathi": "सन (Sun)"
          }
        ]
      },
      {
        "family": "-up",
        "headerBg": "#f43f5e",
        "columnBg": "#fff1f2",
        "familySpeech": "The up family. up. as in: Cup, pup, sup!",
        "words": [
          {
            "key": "ph_u_cup",
            "word": "cup",
            "onset": "c",
            "rime": "up",
            "blendSpeech": "c ... up ... cup!",
            "wordSpeech": "cup!",
            "marathi": "कप (Cup)"
          },
          {
            "key": "ph_u_pup",
            "word": "pup",
            "onset": "p",
            "rime": "up",
            "blendSpeech": "p ... up ... pup!",
            "wordSpeech": "pup!",
            "marathi": "पप (Pup)"
          },
          {
            "key": "ph_u_sup",
            "word": "sup",
            "onset": "s",
            "rime": "up",
            "blendSpeech": "s ... up ... sup!",
            "wordSpeech": "sup!",
            "marathi": "सप (Sup)"
          }
        ]
      },
      {
        "family": "-ut",
        "headerBg": "#06b6d4",
        "columnBg": "#ecfeff",
        "familySpeech": "The ut family. ut. as in: But, cut, gut, hut, jut, nut, rut!",
        "words": [
          {
            "key": "ph_u_but",
            "word": "but",
            "onset": "b",
            "rime": "ut",
            "blendSpeech": "b ... ut ... but!",
            "wordSpeech": "but!",
            "marathi": "बट (But)"
          },
          {
            "key": "ph_u_cut",
            "word": "cut",
            "onset": "c",
            "rime": "ut",
            "blendSpeech": "c ... ut ... cut!",
            "wordSpeech": "cut!",
            "marathi": "कट (Cut)"
          },
          {
            "key": "ph_u_gut",
            "word": "gut",
            "onset": "g",
            "rime": "ut",
            "blendSpeech": "g ... ut ... gut!",
            "wordSpeech": "gut!",
            "marathi": "गट (Gut)"
          },
          {
            "key": "ph_u_hut",
            "word": "hut",
            "onset": "h",
            "rime": "ut",
            "blendSpeech": "h ... ut ... hut!",
            "wordSpeech": "hut!",
            "marathi": "हट (Hut)"
          },
          {
            "key": "ph_u_jut",
            "word": "jut",
            "onset": "j",
            "rime": "ut",
            "blendSpeech": "j ... ut ... jut!",
            "wordSpeech": "jut!",
            "marathi": "जट (Jut)"
          },
          {
            "key": "ph_u_nut",
            "word": "nut",
            "onset": "n",
            "rime": "ut",
            "blendSpeech": "n ... ut ... nut!",
            "wordSpeech": "nut!",
            "marathi": "नट (Nut)"
          },
          {
            "key": "ph_u_rut",
            "word": "rut",
            "onset": "r",
            "rime": "ut",
            "blendSpeech": "r ... ut ... rut!",
            "wordSpeech": "rut!",
            "marathi": "रट (Rut)"
          }
        ]
      },
      {
        "family": "Other",
        "headerBg": "#d946ef",
        "columnBg": "#fdf4ff",
        "familySpeech": "Other short u words: Bus, gus!",
        "words": [
          {
            "key": "ph_u_bus",
            "word": "bus",
            "onset": "b",
            "rime": "us",
            "blendSpeech": "b ... us ... bus!",
            "wordSpeech": "bus!",
            "marathi": "बस (Bus)"
          },
          {
            "key": "ph_u_gus",
            "word": "gus",
            "onset": "g",
            "rime": "us",
            "blendSpeech": "g ... us ... gus!",
            "wordSpeech": "gus!",
            "marathi": "गस (Gus)"
          }
        ]
      }
    ]
  }
];
