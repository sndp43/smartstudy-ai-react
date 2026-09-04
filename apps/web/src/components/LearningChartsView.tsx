import { useState, useRef, useEffect } from "react";

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
  const t = Math.floor(n / 10);
  const r = n % 10;
  return r === 0 ? tens[t] : `${tens[t]} ${ones[r]}`;
}

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

  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);
  const activeAudioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAudioResolverRef = useRef<(() => void) | null>(null);
  const recitingKhadiRef = useRef<boolean>(false);
  const recitingVyanjanRef = useRef<boolean>(false);
  const recitingSwarRef = useRef<boolean>(false);
  const recitingTableRef = useRef<boolean>(false);

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
    setRecitingKhadi(false);
    setRecitingVyanjan(false);
    setRecitingSwar(false);
    setRecitingTable(null);
    setActiveKhadiIndex(null);
    setActiveVyanjanKey(null);
    setActiveSwarKey(null);

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
        await onRecordPractice("tables-2-10", `table_${tableNum}`, `Table of ${tableNum}`);
        showToast(`⭐ Completed recitation for Table of ${tableNum}!`);
      }
    } finally {
      recitingTableRef.current = false;
      setRecitingTable(null);
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

  const activeChart = charts.find((c) => c.slug === activeChartSlug) || charts[0];
  const records = chartProgress.records || {};
  const summary = chartProgress.summary || {};

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
          className={activeChartSlug === "tables-2-10" ? "chart-subnav-tab active" : "chart-subnav-tab"}
          onClick={() => setActiveChartSlug("tables-2-10")}
          role="tab"
          aria-selected={activeChartSlug === "tables-2-10"}
        >
          <span style={{ fontSize: "18px" }}>🔢</span>
          <span>Tables 2–10</span>
          {summary.tablesPracticed ? (
            <span style={{ fontSize: "11px", background: "#e8f5e9", color: "#2e7d32", padding: "2px 6px", borderRadius: "10px", fontWeight: 800 }}>
              {summary.tablesPracticed}/9
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
            <span>🔢 Tables:</span>
            <strong>{summary.tablesPracticed || 0} / 9</strong>
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

      {/* SUBMENU 1: Tables 2 to 10 */}
      {activeChartSlug === "tables-2-10" && (
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <h2 style={{ margin: "0 0 6px 0", fontSize: "20px" }}>Multiplication Tables 2 to 10</h2>
            <p style={{ margin: 0, color: "var(--muted)", fontSize: "13px" }}>
              Select a table pill below to view, listen, recite aloud, and log practice sessions.
            </p>
          </div>

          {/* Table Selector Pills */}
          <div className="table-pills-row">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => {
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
              📖 All Tables (2–10)
            </button>
          </div>

          {/* Table Display */}
          {selectedTable === "all" ? (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "18px" }}>
              {activeChart?.chart_data?.map((tbl: any) => {
                const rec = records[tbl.key];
                const isPracticed = !!rec && rec.practiceCount > 0;
                const isReciting = recitingTable === tbl.table;
                return (
                  <div key={tbl.key} className="table-display-card" style={{ padding: "16px" }}>
                    <div className="table-display-header" style={{ marginBottom: "14px", paddingBottom: "10px" }}>
                      <div>
                        <h3 style={{ fontSize: "18px" }}>{tbl.label}</h3>
                        {isPracticed && (
                          <small style={{ color: "#2e7d32", fontWeight: 700 }}>
                            ⭐ Practiced {rec.practiceCount} time{rec.practiceCount > 1 ? "s" : ""}
                          </small>
                        )}
                      </div>
                      <div className="table-actions-group">
                        <button
                          className="recite-audio-btn"
                          onClick={() => reciteFullTable(tbl.table, tbl.items)}
                          title="Recite entire table aloud"
                          style={{ padding: "6px 10px", fontSize: "11px" }}
                        >
                          {isReciting ? "⏹️ Stop" : "🔊 Recite"}
                        </button>
                        <button
                          className={`mark-practiced-btn ${isPracticed ? "practiced" : ""}`}
                          onClick={() => onRecordPractice("tables-2-10", tbl.key, tbl.label)}
                          disabled={savingChartItem === tbl.key}
                          style={{ padding: "6px 10px", fontSize: "11px" }}
                        >
                          {isPracticed ? `⭐ ${rec.practiceCount}x` : "☆ Practice"}
                        </button>
                      </div>
                    </div>
                    <div className="table-equations-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                      {tbl.items?.map((item: any) => {
                        const phrase = formatTableRecitePhrase(tbl.table, item.multiplier, item.product, item.reciteText);
                        return (
                          <div
                            key={item.multiplier}
                            className="table-equation-item"
                            onClick={() => speakPhrase(phrase)}
                            title={`Click to hear: "${phrase}"`}
                            style={{ padding: "8px 10px", fontSize: "13px" }}
                          >
                            <span>{item.equation}</span>
                            <span className="product-badge" style={{ fontSize: "12px", padding: "2px 6px" }}>
                              {item.product}
                            </span>
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
                <div className="table-display-card">
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
                        onClick={() => onRecordPractice("tables-2-10", currentTableObj.key, currentTableObj.label)}
                        disabled={savingChartItem === currentTableObj.key}
                      >
                        <span>{isPracticed ? "⭐" : "☆"}</span>
                        <span>{isPracticed ? `Practiced (${rec.practiceCount}x)` : "Mark as Practiced"}</span>
                      </button>
                    </div>
                  </div>

                  <div className="table-equations-grid">
                    {currentTableObj.items?.map((item: any) => {
                      const phrase = formatTableRecitePhrase(currentTableObj.table, item.multiplier, item.product, item.reciteText);
                      return (
                        <div
                          key={item.multiplier}
                          className="table-equation-item"
                          onClick={() => speakPhrase(phrase)}
                          title={`Click to pronounce: "${phrase}"`}
                        >
                          <span style={{ fontSize: "16px", fontWeight: 700 }}>{item.equation}</span>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <span className="product-badge">{item.product}</span>
                            <span style={{ fontSize: "12px", color: "var(--teal)" }}>🔊</span>
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
    </div>
  );
}
