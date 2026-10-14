// apps/web/src/services/voiceService.ts
// Unified Voice Configuration & Speech Service for SmartStudy AI

export type VoicePersona =
  | "lady_studio"     // Default: Natural 14 Swar Studio Lady Voice (API / Google TTS)
  | "lady_natural"    // Natural Device Female Voice (SpeechSynthesis)
  | "kid_friendly"    // Cheerful Kid-friendly High-Pitch Female Voice
  | "male"            // Calm Male Narrator
  | "system_custom";  // User-selected specific system voice

export interface VoiceConfig {
  persona: VoicePersona;
  rate: number;                // 0.7 to 1.3 (Default: 0.88 for clear comprehension)
  pitch: number;               // 0.8 to 1.4 (Default: 1.05)
  volume: number;              // 0.0 to 1.0 (Default: 1.0)
  preferStudioAudio: boolean;  // Default: true (Uses 14 Swar / API audio engine)
  customVoiceURI?: string;     // Exact voiceURI when persona is "system_custom"
  customVoiceName?: string;
}

export const DEFAULT_VOICE_CONFIG: VoiceConfig = {
  persona: "lady_studio",      // DEFAULT TO THE LADY VOICE as used in 14 Swar Marathi
  rate: 0.88,
  pitch: 1.05,
  volume: 1.0,
  preferStudioAudio: true,
};

const STORAGE_KEY = "smartstudy-voice-config";
const EVENT_NAME = "smartstudy-voice-config-changed";

// Singleton shared Audio instance for API streaming
let sharedAudio: HTMLAudioElement | null = null;
let currentAudioResolver: (() => void) | null = null;
let isPlayingAudio = false;

export function getVoiceConfig(): VoiceConfig {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_VOICE_CONFIG, ...parsed };
    }
  } catch (err) {
    console.warn("Error reading voice config:", err);
  }
  return { ...DEFAULT_VOICE_CONFIG };
}

export function saveVoiceConfig(config: Partial<VoiceConfig>): VoiceConfig {
  const current = getVoiceConfig();
  const updated: VoiceConfig = { ...current, ...config };
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: updated }));
  } catch (err) {
    console.warn("Error saving voice config:", err);
  }
  return updated;
}

export function onVoiceConfigChange(callback: (config: VoiceConfig) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<VoiceConfig>).detail;
    callback(detail || getVoiceConfig());
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}

// System voices cache
let cachedVoices: SpeechSynthesisVoice[] = [];
function updateVoices(): SpeechSynthesisVoice[] {
  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    cachedVoices = window.speechSynthesis.getVoices();
  }
  return cachedVoices;
}

if (typeof window !== "undefined" && "speechSynthesis" in window) {
  updateVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    updateVoices();
  };
}

export function getAvailableSystemVoices(): SpeechSynthesisVoice[] {
  const list = updateVoices();
  return list.length ? list : (typeof window !== "undefined" && "speechSynthesis" in window ? window.speechSynthesis.getVoices() : []);
}

// Detect language from text (Devanagari characters = Marathi/Hindi)
export function detectLang(text: string, defaultLang = "en"): "mr" | "hi" | "en" {
  if (/[\u0900-\u097F]/.test(text)) {
    // If text contains Marathi specific words or characters
    if (/आहे|नाही|आणि|एक|दोन|स्वर|व्यंजन|कोंबडी|मांजर|कुत्रा|मुलगा/i.test(text)) {
      return "mr";
    }
    return "mr";
  }
  return defaultLang === "mr" ? "mr" : defaultLang === "hi" ? "hi" : "en";
}

// Find best matching SpeechSynthesis voice based on persona & language
export function findMatchingVoice(persona: VoicePersona, lang: "mr" | "hi" | "en", customVoiceURI?: string): SpeechSynthesisVoice | null {
  const voices = getAvailableSystemVoices();
  if (!voices.length) return null;

  // 1. Explicit custom voice
  if (persona === "system_custom" && customVoiceURI) {
    const custom = voices.find((v) => v.voiceURI === customVoiceURI || v.name === customVoiceURI);
    if (custom) return custom;
  }

  // 2. Language-specific matching
  if (lang === "mr") {
    // Prefer Marathi native voices
    const mrVoice = voices.find((v) => v.lang.startsWith("mr") || /marathi/i.test(v.name));
    if (mrVoice) return mrVoice;
    // Fallback to Hindi female voice for clear Devanagari pronunciation
    const hiFemale = voices.find((v) => v.lang.startsWith("hi") && /female|kalpana|swara|veena|sangeeta/i.test(v.name)) ||
      voices.find((v) => v.lang.startsWith("hi"));
    if (hiFemale) return hiFemale;
  }

  // 3. Male voice persona
  if (persona === "male") {
    const maleVoice = voices.find((v) =>
      /david|ravi|mark|george|male|guy|stefan/i.test(v.name) && !/female|girl/i.test(v.name)
    ) || voices.find((v) => !/female|zira|samantha|karen|victoria/i.test(v.name));
    if (maleVoice) return maleVoice;
  }

  // 4. Lady / Female persona (Default)
  // High priority for Indian English / Marathi female voices (Heera, Kalpana, etc.)
  const indianFemale = voices.find((v) =>
    (v.lang === "en-IN" || v.lang.startsWith("en-IN") || v.lang.startsWith("mr") || v.lang.startsWith("hi")) &&
    /female|heera|kalpana|swara|natural/i.test(`${v.name} ${v.voiceURI}`)
  );
  if (indianFemale) return indianFemale;

  const anyIndian = voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN") || /india/i.test(v.name));
  if (anyIndian) return anyIndian;

  // Any natural/high quality female voice
  const femaleVoice = voices.find((v) =>
    /female|samantha|zira|karen|victoria|susan|jenny|aria|google us english|google uk english female|microsoft.*female/i.test(
      `${v.name} ${v.voiceURI}`
    )
  );
  if (femaleVoice) return femaleVoice;

  // Generic fallback for English
  return voices.find((v) => v.lang.startsWith("en")) || voices[0] || null;
}

export function stopSpeech(): void {
  if (currentAudioResolver) {
    currentAudioResolver();
    currentAudioResolver = null;
  }
  if (sharedAudio) {
    try {
      sharedAudio.pause();
      sharedAudio.currentTime = 0;
    } catch (e) {}
  }
  isPlayingAudio = false;

  if (typeof window !== "undefined" && "speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
}

export interface SpeakOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  forceStudio?: boolean;
  forceSystem?: boolean;
  onStart?: () => void;
  onEnd?: () => void;
  onError?: () => void;
  apiUrl?: string;
}

/**
 * Universal Speak Function for SmartStudy AI.
 * Plays text using either the 14 Swar Studio Lady voice (/api/tts) or browser speech synthesis,
 * configured to the user's selected persona and speed preferences.
 */
export async function speak(text: string, options: SpeakOptions = {}): Promise<void> {
  if (!text || !text.trim()) return;
  const cleanText = text.trim();
  const config = getVoiceConfig();

  stopSpeech();

  const targetLang = options.lang
    ? (options.lang.startsWith("mr") ? "mr" : options.lang.startsWith("hi") ? "hi" : "en")
    : detectLang(cleanText);

  const shouldTryStudio = !options.forceSystem && (
    options.forceStudio ||
    config.persona === "lady_studio" ||
    config.preferStudioAudio
  );

  // If Studio Audio (14 Swar lady voice) is preferred and text is under 180 chars, use /api/tts
  if (shouldTryStudio && cleanText.length <= 180) {
    try {
      const apiBase = options.apiUrl || "http://127.0.0.1:8000/api";
      const ttsUrl = `${apiBase}/tts?lang=${targetLang}&text=${encodeURIComponent(cleanText)}`;

      const played = await playStudioAudioUrl(ttsUrl, options);
      if (played) return;
    } catch (err) {
      console.warn("Studio audio failed, falling back to browser SpeechSynthesis:", err);
    }
  }

  // Fallback to browser SpeechSynthesis with the configured persona
  return playBrowserSpeech(cleanText, targetLang, config, options);
}

function playStudioAudioUrl(url: string, options: SpeakOptions): Promise<boolean> {
  return new Promise((resolve) => {
    if (!sharedAudio) {
      sharedAudio = new Audio();
    }
    const audio = sharedAudio;
    isPlayingAudio = true;
    let finished = false;

    const cleanup = () => {
      if (!finished) {
        finished = true;
        audio.onended = null;
        audio.onerror = null;
        isPlayingAudio = false;
        currentAudioResolver = null;
      }
    };

    currentAudioResolver = () => {
      cleanup();
      resolve(true);
    };

    const timeout = setTimeout(() => {
      cleanup();
      resolve(true);
      options.onEnd?.();
    }, Math.max(5000, url.length * 50));

    audio.onended = () => {
      clearTimeout(timeout);
      cleanup();
      options.onEnd?.();
      resolve(true);
    };

    audio.onerror = () => {
      clearTimeout(timeout);
      cleanup();
      // Signal fallback
      resolve(false);
    };

    try {
      audio.pause();
      audio.src = url;
      audio.playbackRate = options.rate || getVoiceConfig().rate || 1.0;
      audio.volume = options.volume ?? getVoiceConfig().volume ?? 1.0;
      audio.load();
      options.onStart?.();
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          clearTimeout(timeout);
          cleanup();
          resolve(false);
        });
      }
    } catch (err) {
      clearTimeout(timeout);
      cleanup();
      resolve(false);
    }
  });
}

function playBrowserSpeech(
  text: string,
  lang: "mr" | "hi" | "en",
  config: VoiceConfig,
  options: SpeakOptions
): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      resolve();
      return;
    }

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);

      // Determine rate & pitch
      let rate = options.rate ?? config.rate;
      let pitch = options.pitch ?? config.pitch;

      if (config.persona === "kid_friendly") {
        pitch = Math.min(1.4, pitch * 1.18);
        rate = Math.max(0.85, rate * 1.05);
      } else if (config.persona === "male") {
        pitch = Math.max(0.8, pitch * 0.9);
      }

      utterance.rate = rate;
      utterance.pitch = pitch;
      utterance.volume = options.volume ?? config.volume ?? 1.0;

      // Assign matching voice
      const voice = findMatchingVoice(config.persona, lang, config.customVoiceURI);
      if (voice) {
        utterance.voice = voice;
        utterance.lang = voice.lang;
      } else {
        utterance.lang = lang === "mr" ? "mr-IN" : lang === "hi" ? "hi-IN" : "en-IN";
      }

      let timer: any = null;
      const finish = () => {
        if (timer) clearTimeout(timer);
        utterance.onend = null;
        utterance.onerror = null;
        options.onEnd?.();
        resolve();
      };

      // Safety timer
      timer = setTimeout(finish, Math.max(4000, text.length * 110));

      utterance.onstart = () => {
        options.onStart?.();
      };
      utterance.onend = finish;
      utterance.onerror = (e) => {
        options.onError?.();
        finish();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("SpeechSynthesis error:", err);
      options.onError?.();
      resolve();
    }
  });
}

// Friendly voice sample preview
export function previewVoice(config: VoiceConfig, sampleText?: string): Promise<void> {
  const text = sampleText || "Namaste! Welcome to SmartStudy! छान काम करत आहात!";
  return speak(text, {
    forceStudio: config.persona === "lady_studio" && config.preferStudioAudio,
    forceSystem: config.persona !== "lady_studio" || !config.preferStudioAudio,
    rate: config.rate,
    pitch: config.pitch,
    volume: config.volume,
  });
}
