import React, { useState, useRef, useEffect } from "react";
import {
  PHONICS_DATA,
  ONSET_PHONIC_SOUNDS,
  ONSET_MARATHI_SOUNDS,
  RIME_MARATHI_SOUNDS,
  VOWEL_PHONIC_GUIDE,
  PhonicsVowelGroup,
  PhonicsFamily,
  PhonicsWord,
} from "./phonicsData";

interface PhonicsLearningChartViewProps {
  chartSlug?: string;
  chartProgressRecords?: Record<string, { practiceCount: number; lastPracticedAt: string }>;
  onRecordPractice: (chartSlug: string, itemKey: string, itemName: string) => Promise<void>;
  savingChartItem: string | null;
  childName?: string;
  apiUrl?: string;
}

export default function PhonicsLearningChartView({
  chartSlug = "phonics",
  chartProgressRecords = {},
  onRecordPractice,
  savingChartItem,
  childName = "Student",
  apiUrl,
}: PhonicsLearningChartViewProps) {
  const [selectedVowel, setSelectedVowel] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [activeWordKey, setActiveWordKey] = useState<string | null>(null);
  const [activeFamilyKey, setActiveFamilyKey] = useState<string | null>(null);
  const [activeVowelId, setActiveVowelId] = useState<string | null>(null);
  const [blendingMode, setBlendingMode] = useState<boolean>(true); // Phonetic Blending (buh + at -> bat) vs Whole Word
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.8); // Gentle, little slow phonics pace (0.80x default)
  const [voiceEngine, setVoiceEngine] = useState<"vyanjan" | "english">("vyanjan"); // "vyanjan" = accurate Devanagari phonetics like in Vyanjans
  const [recitingWordKey, setRecitingWordKey] = useState<string | null>(null);
  const [isReciting, setIsReciting] = useState<boolean>(false);

  // Quiz Game Mode
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizTarget, setQuizTarget] = useState<{ word: PhonicsWord; vowel: PhonicsVowelGroup; family: PhonicsFamily } | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);

  // Full Screen Section Mode
  const [fullscreenSection, setFullscreenSection] = useState<string | null>(null);
  const [fullscreenFamilyFilter, setFullscreenFamilyFilter] = useState<string>("all");

  const isRecitingRef = useRef<boolean>(false);
  const reciteTimerRef = useRef<any>(null);
  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);

  const enterFullscreen = (sectionId: string) => {
    setFullscreenSection(sectionId);
    setFullscreenFamilyFilter("all");
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  const exitFullscreen = () => {
    setFullscreenSection(null);
    setFullscreenFamilyFilter("all");
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Keyboard navigation & browser fullscreen sync
  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && fullscreenSection !== null) {
        setFullscreenSection(null);
        setFullscreenFamilyFilter("all");
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!fullscreenSection) return;

      if (e.key === "Escape") {
        exitFullscreen();
      } else if (e.key === "ArrowLeft") {
        const vowelIds = ["short_a", "short_e", "short_i", "short_o", "short_u"];
        const currIdx = vowelIds.indexOf(fullscreenSection);
        const prevIdx = currIdx <= 0 ? vowelIds.length - 1 : currIdx - 1;
        setFullscreenSection(vowelIds[prevIdx]);
        setFullscreenFamilyFilter("all");
      } else if (e.key === "ArrowRight") {
        const vowelIds = ["short_a", "short_e", "short_i", "short_o", "short_u"];
        const currIdx = vowelIds.indexOf(fullscreenSection);
        const nextIdx = currIdx === -1 || currIdx >= vowelIds.length - 1 ? 0 : currIdx + 1;
        setFullscreenSection(vowelIds[nextIdx]);
        setFullscreenFamilyFilter("all");
      }
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [fullscreenSection]);

  // Cleanup speech and timers on unmount
  useEffect(() => {
    return () => {
      isRecitingRef.current = false;
      if (reciteTimerRef.current) clearTimeout(reciteTimerRef.current);
      if (sharedAudioRef.current) {
        try {
          sharedAudioRef.current.pause();
          sharedAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Primary High-Fidelity Audio Engine (Uses /api/tts studio audio like Vyanjans + slow playback rate)
  const playPhonicsAudio = (phrase: string, speedOverride?: number, langOverride?: string): Promise<void> => {
    return new Promise((resolve) => {
      const currentSpeed = speedOverride !== undefined ? speedOverride : speechSpeed;
      const targetLang = langOverride || (voiceEngine === "vyanjan" ? "mr" : "en");

      // Stop existing audio or browser speech
      if (sharedAudioRef.current) {
        try {
          sharedAudioRef.current.pause();
          sharedAudioRef.current.currentTime = 0;
        } catch (e) {}
      }
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }

      const apiBase = apiUrl || "http://127.0.0.1:8000/api";
      const ttsUrl = `${apiBase}/tts?lang=${targetLang}&text=${encodeURIComponent(phrase)}`;

      if (!sharedAudioRef.current) {
        sharedAudioRef.current = new Audio();
      }
      const audio = sharedAudioRef.current;
      audio.playbackRate = currentSpeed; // Sets smooth slow playback (e.g. 0.80x)

      let finished = false;
      let timer: any = null;

      const finish = () => {
        if (!finished) {
          finished = true;
          if (timer) clearTimeout(timer);
          audio.onended = null;
          audio.onerror = null;
          resolve();
        }
      };

      // 8-second safety timeout
      timer = setTimeout(finish, 8000);
      audio.onended = finish;

      audio.onerror = () => {
        fallbackSpeechSynthesis(phrase, currentSpeed, targetLang, finish);
      };

      try {
        audio.pause();
        audio.src = ttsUrl;
        audio.load();
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("HTML5 Audio play error, falling back to speech synthesis:", err);
            fallbackSpeechSynthesis(phrase, currentSpeed, targetLang, finish);
          });
        }
      } catch (err) {
        fallbackSpeechSynthesis(phrase, currentSpeed, targetLang, finish);
      }
    });
  };

  // Browser SpeechSynthesis Fallback with matching slow rate
  const fallbackSpeechSynthesis = (phrase: string, rate: number, lang: string, onDone: () => void) => {
    if (!("speechSynthesis" in window)) {
      onDone();
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = rate;
      utterance.pitch = 1.0;
      utterance.lang = lang === "mr" ? "mr-IN" : "en-US";

      const voices = window.speechSynthesis.getVoices();
      const preferred = lang === "mr"
        ? voices.find((v) => v.lang.startsWith("mr") || v.lang.startsWith("hi"))
        : voices.find((v) => /natural.*english|google us english|zira|samantha|karen|jenny|aria|david/i.test(v.name)) ||
          voices.find((v) => v.lang === "en-US") ||
          voices.find((v) => v.lang.startsWith("en"));
      if (preferred) utterance.voice = preferred;

      utterance.onend = onDone;
      utterance.onerror = onDone;
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      onDone();
    }
  };

  // Stop all active reciting or audio
  const stopAllReciting = () => {
    isRecitingRef.current = false;
    setIsReciting(false);
    setRecitingWordKey(null);
    if (reciteTimerRef.current) {
      clearTimeout(reciteTimerRef.current);
      reciteTimerRef.current = null;
    }
    if (sharedAudioRef.current) {
      try {
        sharedAudioRef.current.pause();
        sharedAudioRef.current.currentTime = 0;
      } catch (e) {}
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  };

  // 1. Click on Vowel Header Banner (e.g. 'short a', 'short e')
  const handleVowelClick = (group: PhonicsVowelGroup) => {
    setActiveVowelId(group.id);
    setActiveWordKey(null);
    const guide = VOWEL_PHONIC_GUIDE[group.vowel];
    if (voiceEngine === "vyanjan") {
      // Exact Marathi Phonics sound + word (like in Vyanjans: ॲ, ॲपल)
      playPhonicsAudio(guide ? guide.marathiLetterSound : `${group.marathiSound.split(" ")[0]}, ${group.title}`, speechSpeed, "mr");
    } else {
      // English clean phonics sound + word
      playPhonicsAudio(guide ? guide.letterSound : `${group.vowel}, ${group.exampleWords.split(",")[0]}`, speechSpeed, "en");
    }
    onRecordPractice(chartSlug, `vowel_${group.vowel}`, `Short Vowel ${group.vowel.toUpperCase()}`);
  };

  // 1b. Direct Click on Highlighted Letter (e.g. 'a', 'e', 'i', 'o', 'u')
  const handleLetterOnlyClick = (group: PhonicsVowelGroup) => {
    setActiveVowelId(group.id);
    setActiveWordKey(null);
    const guide = VOWEL_PHONIC_GUIDE[group.vowel];
    if (voiceEngine === "vyanjan") {
      playPhonicsAudio(guide ? guide.marathiLetterSound : `${group.marathiSound.split(" ")[0]}`, speechSpeed, "mr");
    } else {
      playPhonicsAudio(guide ? guide.letterSound : `${group.vowel}, ${group.exampleWords.split(",")[0]}`, speechSpeed, "en");
    }
    onRecordPractice(chartSlug, `vowel_${group.vowel}`, `Letter ${group.vowel.toUpperCase()}`);
  };

  // 2. Click on Family Header (e.g. '-ad', '-at', '-ug')
  const handleFamilyClick = (group: PhonicsVowelGroup, family: PhonicsFamily) => {
    setActiveFamilyKey(`${group.vowel}_${family.family}`);
    setActiveWordKey(null);
    const rimeClean = family.family.replace(/^-/, "");
    const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || family.family;
    if (voiceEngine === "vyanjan") {
      playPhonicsAudio(`${rimeMarathi} फॅमिली`, speechSpeed, "mr");
    } else {
      playPhonicsAudio(`${family.family.replace("-", "")} family`, speechSpeed, "en");
    }
    onRecordPractice(chartSlug, `family_${group.vowel}_${family.family}`, `${group.title} ${family.family}`);
  };

  // 3. Click on Word (e.g. 'bat', 'cat')
  const handleWordClick = (group: PhonicsVowelGroup, family: PhonicsFamily, wordItem: PhonicsWord) => {
    setActiveWordKey(wordItem.key);

    // If quiz is active, check answer
    if (quizActive && quizTarget) {
      if (wordItem.key === quizTarget.word.key) {
        setQuizScore((prev) => prev + 1);
        setQuizFeedback(`🎉 Bravo! That is "${wordItem.word.toUpperCase()}"! ${wordItem.marathi || ""}`);
        playPhonicsAudio(
          voiceEngine === "vyanjan"
            ? `शाब्बास! ${wordItem.marathi || wordItem.word}`
            : `Awesome! That is ${wordItem.word}!`,
          speechSpeed,
          voiceEngine === "vyanjan" ? "mr" : "en"
        );
        onRecordPractice(chartSlug, wordItem.key, wordItem.word);
        setTimeout(() => {
          pickRandomQuizTarget();
        }, 1900);
      } else {
        setQuizFeedback(`Try again! That is "${wordItem.word}". Look for "${quizTarget.word.word.toUpperCase()}" in ${quizTarget.family.family}!`);
        playPhonicsAudio(
          voiceEngine === "vyanjan"
            ? `हा शब्द ${wordItem.marathi || wordItem.word} आहे.`
            : `That is ${wordItem.word}.`,
          speechSpeed,
          voiceEngine === "vyanjan" ? "mr" : "en"
        );
      }
      return;
    }

    // Normal practice click:
    const onsetClean = wordItem.onset.toLowerCase();
    const rimeClean = wordItem.rime.toLowerCase();
    const onsetMarathi = ONSET_MARATHI_SOUNDS[onsetClean] || wordItem.onset;
    const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || wordItem.rime;
    const wordMarathi = wordItem.marathi || wordItem.word;

    if (voiceEngine === "vyanjan") {
      if (blendingMode) {
        // Vyanjan blending: ब, ॲट ... बॅट (buh, at, bat) like in Vyanjans!
        playPhonicsAudio(`${onsetMarathi}, ${rimeMarathi}, ${wordMarathi}`, speechSpeed, "mr");
      } else {
        // Whole word: बॅट (bat)
        playPhonicsAudio(wordMarathi, speechSpeed, "mr");
      }
    } else {
      if (blendingMode) {
        const onsetSound = ONSET_PHONIC_SOUNDS[onsetClean] || wordItem.onset;
        playPhonicsAudio(`${onsetSound}, ${wordItem.rime}, ${wordItem.word}`, speechSpeed, "en");
      } else {
        playPhonicsAudio(wordItem.word, speechSpeed, "en");
      }
    }

    onRecordPractice(chartSlug, wordItem.key, wordItem.word);
  };

  // Quiz Game Generators
  const allWordEntries = PHONICS_DATA.flatMap((v) =>
    v.families.flatMap((f) => f.words.map((w) => ({ word: w, vowel: v, family: f })))
  );

  const pickRandomQuizTarget = () => {
    const random = allWordEntries[Math.floor(Math.random() * allWordEntries.length)];
    setQuizTarget(random);
    setQuizFeedback(null);
    const prompt = voiceEngine === "vyanjan"
      ? `"${random.word.word.toUpperCase()}" हा शब्द ${random.family.family} फॅमिलीमध्ये शोधा!`
      : `Can you find the word "${random.word.word.toUpperCase()}" in the ${random.family.family} family?`;
    playPhonicsAudio(prompt, speechSpeed, voiceEngine === "vyanjan" ? "mr" : "en");
  };

  const startQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    pickRandomQuizTarget();
  };

  const stopQuiz = () => {
    setQuizActive(false);
    setQuizTarget(null);
    setQuizFeedback(null);
  };

  // Recite all words in a vowel group sequentially at steady phonics pace
  const reciteVowelWords = (group: PhonicsVowelGroup) => {
    if (isReciting) {
      stopAllReciting();
      return;
    }

    stopAllReciting();
    isRecitingRef.current = true;
    setIsReciting(true);
    const wordsToRecite = group.families.flatMap((f) => f.words);

    const speakNext = async (i: number) => {
      if (!isRecitingRef.current || i >= wordsToRecite.length) {
        stopAllReciting();
        if (i >= wordsToRecite.length) {
          playPhonicsAudio(
            voiceEngine === "vyanjan"
              ? `${group.title} चा सराव पूर्ण झाला! छान!`
              : `All done reciting ${group.title} words! Wonderful job, ${childName}!`,
            speechSpeed,
            voiceEngine === "vyanjan" ? "mr" : "en"
          );
        }
        return;
      }
      const item = wordsToRecite[i];
      setRecitingWordKey(item.key);
      setActiveWordKey(item.key);

      const onsetClean = item.onset.toLowerCase();
      const rimeClean = item.rime.toLowerCase();
      const onsetMarathi = ONSET_MARATHI_SOUNDS[onsetClean] || item.onset;
      const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || item.rime;
      const wordMarathi = item.marathi || item.word;

      if (voiceEngine === "vyanjan") {
        const phrase = blendingMode ? `${onsetMarathi}, ${rimeMarathi}, ${wordMarathi}` : wordMarathi;
        await playPhonicsAudio(phrase, speechSpeed, "mr");
      } else {
        const onsetSound = ONSET_PHONIC_SOUNDS[onsetClean] || item.onset;
        const phrase = blendingMode ? `${onsetSound}, ${item.rime}, ${item.word}` : item.word;
        await playPhonicsAudio(phrase, speechSpeed, "en");
      }

      reciteTimerRef.current = setTimeout(() => {
        speakNext(i + 1);
      }, 1400);
    };

    speakNext(0);
  };

  // Recite All Phonics (Like "संपूर्ण व्यंजने ऐका" in Vyanjans)
  const reciteAllPhonics = async () => {
    if (isReciting) {
      stopAllReciting();
      return;
    }

    stopAllReciting();
    isRecitingRef.current = true;
    setIsReciting(true);

    const targetGroups =
      selectedVowel === "all" ? PHONICS_DATA : PHONICS_DATA.filter((g) => g.vowel === selectedVowel);

    for (const group of targetGroups) {
      if (!isRecitingRef.current) break;
      setActiveVowelId(group.id);
      setActiveFamilyKey(null);
      setActiveWordKey(null);

      const guide = VOWEL_PHONIC_GUIDE[group.vowel];
      if (voiceEngine === "vyanjan") {
        await playPhonicsAudio(
          guide ? guide.marathiLetterSound : `${group.marathiSound.split(" ")[0]}, ${group.title}`,
          speechSpeed,
          "mr"
        );
      } else {
        await playPhonicsAudio(guide ? guide.letterSound : `${group.vowel}, apple`, speechSpeed, "en");
      }

      await new Promise((r) => setTimeout(r, 600));

      for (const fam of group.families) {
        if (!isRecitingRef.current) break;
        setActiveFamilyKey(`${group.vowel}_${fam.family}`);

        for (const w of fam.words) {
          if (!isRecitingRef.current) break;
          setActiveWordKey(w.key);
          setRecitingWordKey(w.key);

          const onsetClean = w.onset.toLowerCase();
          const rimeClean = w.rime.toLowerCase();
          const onsetMarathi = ONSET_MARATHI_SOUNDS[onsetClean] || w.onset;
          const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || w.rime;
          const wordMarathi = w.marathi || w.word;

          if (voiceEngine === "vyanjan") {
            const phrase = blendingMode ? `${onsetMarathi}, ${rimeMarathi}, ${wordMarathi}` : wordMarathi;
            await playPhonicsAudio(phrase, speechSpeed, "mr");
          } else {
            const onsetSound = ONSET_PHONIC_SOUNDS[onsetClean] || w.onset;
            const phrase = blendingMode ? `${onsetSound}, ${w.rime}, ${w.word}` : w.word;
            await playPhonicsAudio(phrase, speechSpeed, "en");
          }

          await new Promise((r) => setTimeout(r, 550));
        }
      }
    }

    if (isRecitingRef.current) {
      await onRecordPractice(chartSlug, "phonics_all", "Phonics All Words Recited");
    }

    stopAllReciting();
  };

  // Filter groups
  const displayedGroups =
    selectedVowel === "all"
      ? PHONICS_DATA
      : PHONICS_DATA.filter((g) => g.vowel === selectedVowel);

  // Dynamic total word count
  const totalWords = PHONICS_DATA.reduce(
    (acc, group) => acc + group.families.reduce((fAcc, fam) => fAcc + fam.words.length, 0),
    0
  );

  // Active word details
  const activeWordObj = allWordEntries.find((e) => e.word.key === activeWordKey);

  // Full Screen Active Group and Filters
  const activeFullscreenGroup =
    fullscreenSection && fullscreenSection !== "all"
      ? PHONICS_DATA.find((g) => g.id === fullscreenSection)
      : null;

  const displayedFullscreenGroups = activeFullscreenGroup
    ? [activeFullscreenGroup]
    : PHONICS_DATA;

  const getFilteredFullscreenFamilies = (group: PhonicsVowelGroup) => {
    if (fullscreenFamilyFilter === "all") return group.families;
    return group.families.filter((f) => f.family === fullscreenFamilyFilter);
  };

  return (
    <div className="phonics-poster-container">
      {/* 1. Main Poster Header */}
      <div className="phonics-poster-header">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px", width: "100%" }}>
          <div className="phonics-main-title-wrap">
            <h1 className="phonics-main-title">PHONICS</h1>
            <div className="phonics-title-underline" />
            <p className="phonics-subtitle">
              Short Vowels <strong>A, E, I, O, U</strong> &amp; CVC Rhyming Word Families ({totalWords} Words)
            </p>
          </div>

          {/* Top Recite All & Full Screen Buttons */}
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
            <button
              className="recite-audio-btn"
              style={{ background: isReciting ? "#e76f51" : "#2a9d8f", color: "#fff" }}
              onClick={reciteAllPhonics}
              title="Recite all vowels and words sequentially"
            >
              <span>{isReciting ? "⏹️" : "🔊"}</span>
              <span>
                {isReciting
                  ? "थांबवा (Stop Reciting)"
                  : selectedVowel === "all"
                  ? "संपूर्ण फोनिक्स ऐका (Recite All)"
                  : `${selectedVowel.toUpperCase()} चे सर्व शब्द ऐका (Recite ${selectedVowel.toUpperCase()})`}
              </span>
            </button>
            <button
              className="phonics-header-fs-btn"
              onClick={() => enterFullscreen(selectedVowel === "all" ? "all" : `short_${selectedVowel}`)}
              title="Open Phonics in Full Screen Mode (⛶ पूर्ण स्क्रीन)"
            >
              <span>⛶</span>
              <span>पूर्ण स्क्रीन (Full Screen)</span>
            </button>
          </div>
        </div>

        {/* Quick Vowel Sound Pills (Click on a, e, i, o, u to hear their pure phonic sound) */}
        <div className="phonics-vowel-sound-bar" role="navigation" aria-label="Short Vowels Phonetic Pronunciation">
          <span className="phonics-sound-bar-label">🔊 Click Vowel to Hear Phonics:</span>
          {PHONICS_DATA.map((group) => {
            const isPlaying = activeVowelId === group.id;
            const guide = VOWEL_PHONIC_GUIDE[group.vowel];
            return (
              <button
                key={`pill-${group.id}`}
                className={`phonics-vowel-btn ${isPlaying ? "playing" : ""}`}
                style={{
                  backgroundColor: isPlaying ? group.color : "#ffffff",
                  color: isPlaying ? "#ffffff" : group.color,
                  borderColor: group.color,
                }}
                onClick={() => handleLetterOnlyClick(group)}
                title={`Click to hear ${group.title} sound: ${guide?.marathiLetterSound || group.ipa}`}
              >
                <span className="vowel-letter">{group.vowel}</span>
                <span className="vowel-sound-tag">{group.ipa}</span>
                <span className="vowel-marathi-tag">{guide?.marathiAnchorWord || group.marathiSound.split(" ")[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. Interactive Controls Toolbar */}
      <div className="phonics-controls-toolbar">
        {/* Vowel Filter Toolbar (Matches Vyanjans vyanjan-filter-group) */}
        <div className="vyanjan-filter-group">
          <button
            className={`vyanjan-filter-btn ${selectedVowel === "all" ? "active" : ""}`}
            onClick={() => setSelectedVowel("all")}
          >
            सर्व शब्द (All {totalWords})
          </button>
          {PHONICS_DATA.map((g) => {
            const guide = VOWEL_PHONIC_GUIDE[g.vowel];
            const wordCount = g.families.reduce((sum, f) => sum + f.words.length, 0);
            return (
              <button
                key={`filter-${g.id}`}
                className={`vyanjan-filter-btn ${selectedVowel === g.vowel ? "active" : ""}`}
                onClick={() => setSelectedVowel(g.vowel)}
                style={{
                  borderColor: selectedVowel === g.vowel ? g.color : undefined,
                  backgroundColor: selectedVowel === g.vowel ? g.color : undefined,
                  color: selectedVowel === g.vowel ? "#ffffff" : undefined,
                }}
              >
                {g.title} ({guide?.marathiLetterSound.split(",")[0] || g.vowel}) &bull; {wordCount}
              </button>
            );
          })}
        </div>

        {/* Speed Controls & Voice Engine Switch (Addresses "like we have in vyanjans" & "and little slow") */}
        <div className="phonics-mode-controls">
          {/* Voice Engine Toggle: Vyanjans-style vs English Studio */}
          <div className="phonics-speed-selector" title="Pronunciation Voice Engine">
            <span className="speed-label">🎙️ Voice:</span>
            <button
              className={`phonics-speed-pill ${voiceEngine === "vyanjan" ? "active" : ""}`}
              onClick={() => setVoiceEngine("vyanjan")}
              title="Vyanjans authentic Marathi-English phonics audio (100% accurate Indian school phonetics)"
            >
              🕉️ व्यंजने फोनिक्स (Vyanjan Style)
            </button>
            <button
              className={`phonics-speed-pill ${voiceEngine === "english" ? "active" : ""}`}
              onClick={() => setVoiceEngine("english")}
              title="English studio voice audio"
            >
              🇬🇧 English Studio
            </button>
          </div>

          {/* Speed Selector (addresses "and little slow") */}
          <div className="phonics-speed-selector" title="Pronunciation Speed">
            <span className="speed-label">⏱️ Speed:</span>
            {[
              { rate: 0.70, label: "🐢 सावकाश (0.7x)", title: "Very slow pace for careful listening" },
              { rate: 0.80, label: "⭐ फोनिक्स (0.8x)", title: "Gentle phonics pace (recommended)" },
              { rate: 1.00, label: "🐇 सामान्य (1x)", title: "Standard conversation speed" },
            ].map((s) => (
              <button
                key={`speed-${s.rate}`}
                className={`phonics-speed-pill ${speechSpeed === s.rate ? "active" : ""}`}
                onClick={() => setSpeechSpeed(s.rate)}
                title={s.title}
              >
                {s.label}
              </button>
            ))}
          </div>

          {/* Sound Blending Mode Toggle */}
          <button
            className={`phonics-mode-toggle ${blendingMode ? "blending-active" : ""}`}
            onClick={() => setBlendingMode(!blendingMode)}
            title="Toggle between phonics blending (b + at = bat) or whole word pronunciation"
          >
            <span>{blendingMode ? "🧩 Blending: ब + ॲट = बॅट" : "🗣️ Whole Word"}</span>
          </button>

          {/* Quiz Game Toggle */}
          <button
            className={`phonics-quiz-toggle ${quizActive ? "active" : ""}`}
            onClick={quizActive ? stopQuiz : startQuiz}
          >
            <span>🎯</span>
            <span>{quizActive ? "Exit Quiz" : "Phonics Quiz"}</span>
          </button>

          {/* Search Box */}
          <div className="phonics-search-box">
            <span>🔍</span>
            <input
              type="text"
              placeholder="Search (e.g. cat, dog)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="phonics-search-input"
            />
            {searchTerm && (
              <button className="search-clear-btn" onClick={() => setSearchTerm("")}>
                ✕
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Quiz Game Active Banner */}
      {quizActive && quizTarget && (
        <div className="phonics-quiz-banner" style={{ borderLeftColor: quizTarget.vowel.color }}>
          <div className="quiz-banner-left">
            <span className="quiz-target-icon">🎯</span>
            <div>
              <div className="quiz-prompt">
                Find the word: <strong>"{quizTarget.word.word.toUpperCase()}"</strong> in the{" "}
                <span className="quiz-family-pill" style={{ backgroundColor: quizTarget.family.headerBg }}>
                  {quizTarget.family.family}
                </span>{" "}
                family ({quizTarget.vowel.title})!
              </div>
              <small className="quiz-hint">Click on the word cell in the chart below!</small>
            </div>
          </div>
          <div className="quiz-banner-actions">
            <div className="quiz-score-pill">⭐ Score: <strong>{quizScore}</strong></div>
            <button className="quiz-skip-btn" onClick={pickRandomQuizTarget}>
              Skip ⏭️
            </button>
          </div>
          {quizFeedback && <div className="quiz-feedback-banner">{quizFeedback}</div>}
        </div>
      )}

      {/* 4. The 5 Vowel Educational Poster Layout */}
      <div className="phonics-poster-grid">
        {displayedGroups.map((group) => {
          const isShortU = group.vowel === "u";
          const guide = VOWEL_PHONIC_GUIDE[group.vowel];
          return (
            <div
              key={group.id}
              className={`phonics-vowel-block ${isShortU ? "full-width-u-block" : ""}`}
              style={{
                borderColor: `${group.color}44`,
              }}
            >
              {/* Vowel Header Banner (Click to hear phonics) */}
              <div
                className="phonics-vowel-header-banner"
                style={{ backgroundColor: group.headerBg }}
                onClick={() => handleVowelClick(group)}
                role="button"
                tabIndex={0}
                title={`Click to hear ${group.title} sound: ${guide?.marathiLetterSound || group.ipa}`}
              >
                <div className="vowel-title-text">
                  <span>short </span>
                  <span
                    className="highlighted-vowel-letter"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLetterOnlyClick(group);
                    }}
                    title={`Click to hear ${group.vowel.toUpperCase()} sound`}
                  >
                    {group.vowel}
                  </span>
                </div>
                <div className="vowel-header-sound-badge">
                  <span>🔊 {group.ipa} ({guide?.marathiAnchorWord || group.marathiSound})</span>
                </div>
                <div className="vowel-header-actions" style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <button
                    className="recite-vowel-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      reciteVowelWords(group);
                    }}
                    title={`Recite all ${group.title} words`}
                  >
                    {isReciting ? "⏸️" : "▶️ Recite"}
                  </button>
                  <button
                    className="phonics-section-fs-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      enterFullscreen(group.id);
                    }}
                    title={`Open ${group.title.toUpperCase()} in Full Screen Mode (⛶ पूर्ण स्क्रीन)`}
                    aria-label={`Open ${group.title} in Full Screen Mode`}
                  >
                    <span>⛶</span>
                    <span>पूर्ण स्क्रीन</span>
                  </button>
                </div>
              </div>

              {/* Columns Table of Word Families */}
              <div
                className="phonics-columns-table"
                style={{
                  gridTemplateColumns: `repeat(${group.families.length}, minmax(0, 1fr))`,
                }}
              >
                {group.families.map((familyCol) => {
                  const isFamilyActive = activeFamilyKey === `${group.vowel}_${familyCol.family}`;

                  return (
                    <div
                      key={`col-${group.vowel}-${familyCol.family}`}
                      className={`phonics-family-column ${isFamilyActive ? "family-active" : ""}`}
                    >
                      {/* Family Column Pill Header */}
                      <button
                        className="phonics-col-header"
                        style={{ backgroundColor: familyCol.headerBg }}
                        onClick={() => handleFamilyClick(group, familyCol)}
                        title={`Click to hear ${familyCol.family} family words`}
                      >
                        {familyCol.family}
                      </button>

                      {/* Stack of Word Cells */}
                      <div className="phonics-words-stack">
                        {familyCol.words.map((wordItem) => {
                          const isWordActive = activeWordKey === wordItem.key;
                          const isRecitingThis = recitingWordKey === wordItem.key;
                          const matchesSearch =
                            searchTerm &&
                            wordItem.word.toLowerCase().includes(searchTerm.toLowerCase());
                          const practiceData = chartProgressRecords[wordItem.key];
                          const practiceCount = practiceData?.practiceCount || 0;

                          return (
                            <button
                              key={wordItem.key}
                              className={`phonics-word-cell ${isWordActive ? "active" : ""} ${
                                isRecitingThis ? "reciting active-reciting" : ""
                              } ${matchesSearch ? "search-match" : ""}`}
                              style={{
                                backgroundColor: familyCol.columnBg,
                              }}
                              onClick={() => handleWordClick(group, familyCol, wordItem)}
                              title={`Click to pronounce "${wordItem.word}" (${wordItem.onset} + ${wordItem.rime} = ${wordItem.marathi || wordItem.word})`}
                            >
                              <span className="phonics-word-text">{wordItem.word}</span>
                              {practiceCount > 0 && (
                                <span className="phonics-word-practice-dot" title={`Practiced ${practiceCount} times`}>
                                  ⭐
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Bottom Phonics Word Spotlight Card (Matches Vyanjans Card Style) */}
      {activeWordObj && (
        <div
          className="phonics-word-spotlight-bar"
          style={{ borderLeftColor: activeWordObj.vowel.color }}
        >
          <div className="spotlight-word-badge" style={{ backgroundColor: activeWordObj.family.headerBg }}>
            {activeWordObj.word.word}
          </div>
          <div className="spotlight-word-details">
            <div className="spotlight-word-blend-row">
              <span className="sound-token onset-token">
                {activeWordObj.word.onset} (
                {voiceEngine === "vyanjan"
                  ? ONSET_MARATHI_SOUNDS[activeWordObj.word.onset.toLowerCase()] || activeWordObj.word.onset
                  : ONSET_PHONIC_SOUNDS[activeWordObj.word.onset.toLowerCase()] || activeWordObj.word.onset}
                )
              </span>
              <span className="sound-plus">+</span>
              <span className="sound-token rime-token">
                {activeWordObj.word.rime} (
                {RIME_MARATHI_SOUNDS[activeWordObj.word.rime.toLowerCase()] || activeWordObj.word.rime}
                )
              </span>
              <span className="sound-arrow">➔</span>
              <span className="sound-token word-token">{activeWordObj.word.word}</span>
              {activeWordObj.word.marathi && (
                <span className="spotlight-marathi-tag">{activeWordObj.word.marathi}</span>
              )}
            </div>
            <p className="spotlight-family-note">
              Belongs to <strong>{activeWordObj.vowel.title}</strong> ({activeWordObj.vowel.ipa} sound) &bull;{" "}
              <strong>{activeWordObj.family.family}</strong> family
              {chartProgressRecords[activeWordObj.word.key] && (
                <span style={{ marginLeft: "10px", color: "#2e7d32", fontWeight: 700 }}>
                  ⭐ Practiced {chartProgressRecords[activeWordObj.word.key].practiceCount} time(s)
                </span>
              )}
            </p>
          </div>
          <div className="spotlight-actions">
            <button
              className="spotlight-speak-btn"
              onClick={() => {
                const onsetClean = activeWordObj.word.onset.toLowerCase();
                const rimeClean = activeWordObj.word.rime.toLowerCase();
                if (voiceEngine === "vyanjan") {
                  const onsetMarathi = ONSET_MARATHI_SOUNDS[onsetClean] || activeWordObj.word.onset;
                  const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || activeWordObj.word.rime;
                  const wordMarathi = activeWordObj.word.marathi || activeWordObj.word.word;
                  playPhonicsAudio(`${onsetMarathi}, ${rimeMarathi}, ${wordMarathi}`, speechSpeed, "mr");
                } else {
                  const onsetSound = ONSET_PHONIC_SOUNDS[onsetClean] || activeWordObj.word.onset;
                  playPhonicsAudio(`${onsetSound}, ${activeWordObj.word.rime}, ${activeWordObj.word.word}`, speechSpeed, "en");
                }
                onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word);
              }}
              title="Sound out onset + rime blend slowly like in Vyanjans"
            >
              <span>🧩</span>
              <span>जोडा (Blend Sound)</span>
            </button>
            <button
              className="spotlight-speak-btn"
              style={{ background: "#0284c7" }}
              onClick={() => {
                if (voiceEngine === "vyanjan") {
                  playPhonicsAudio(activeWordObj.word.marathi || activeWordObj.word.word, speechSpeed, "mr");
                } else {
                  playPhonicsAudio(activeWordObj.word.word, speechSpeed, "en");
                }
                onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word);
              }}
              title="Pronounce word"
            >
              <span>🔊</span>
              <span>ऐका (Say Word)</span>
            </button>
            <button
              className="spotlight-speak-btn"
              style={{ background: "#2e7d32" }}
              onClick={() => onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word)}
              disabled={savingChartItem === activeWordObj.word.key}
              title="Mark word practiced"
            >
              <span>⭐</span>
              <span>
                {chartProgressRecords[activeWordObj.word.key]
                  ? `${chartProgressRecords[activeWordObj.word.key].practiceCount}x सराव`
                  : "सराव (Practice)"}
              </span>
            </button>
          </div>
        </div>
      )}

      {/* 6. Educational Tip Footer */}
      <div className="phonics-educational-tips-card">
        <div className="tips-header">
          <span>💡</span>
          <strong>How to Read CVC Phonics Words (व्यंजने व फोनिक्स जोडून वाचन):</strong>
        </div>
        <div className="tips-grid">
          <div className="tip-box">
            <strong>1. Sound Out Onset (व्यंजन आवाज)</strong>
            <p>Say the pure consonant sound (उदा. <em>b</em> साठी <code>ब</code>, <em>c</em> साठी <code>क</code>).</p>
          </div>
          <div className="tip-box">
            <strong>2. Sound Out Rime (स्वर व शेवट)</strong>
            <p>Say the short vowel and ending together (उदा. <em>-at</em> साठी <code>ॲट</code>, <em>-in</em> साठी <code>इन</code>).</p>
          </div>
          <div className="tip-box">
            <strong>3. Blend Slowly (हळूच एकत्र जोडा)</strong>
            <p>Slide the sounds together into one word: <code>ब + ॲट = बॅट (bat)!</code></p>
          </div>
        </div>
      </div>

      {/* 7. Dedicated Interactive Full-Screen Section Mode Overlay */}
      {fullscreenSection && (
        <div
          className="phonics-fullscreen-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Phonics Full Screen Mode"
        >
          {/* Full Screen Top Navigation & Control Ribbon */}
          <div
            className="phonics-fs-topbar"
            style={{
              background: activeFullscreenGroup
                ? `linear-gradient(135deg, ${activeFullscreenGroup.headerBg}, ${activeFullscreenGroup.color}ee)`
                : "linear-gradient(135deg, #1e293b, #0f172a)",
            }}
          >
            {/* Left: Vowel Info & Sound Recitation */}
            <div className="phonics-fs-brand-block">
              <div
                className="phonics-fs-vowel-badge"
                onClick={() => {
                  if (activeFullscreenGroup) handleLetterOnlyClick(activeFullscreenGroup);
                }}
                title={activeFullscreenGroup ? `Click to hear ${activeFullscreenGroup.vowel.toUpperCase()} sound` : "Phonics"}
              >
                {activeFullscreenGroup ? activeFullscreenGroup.vowel.toUpperCase() : "🔤"}
              </div>
              <div className="phonics-fs-title-wrap">
                <h2 className="phonics-fs-title">
                  {activeFullscreenGroup ? activeFullscreenGroup.title.toUpperCase() : "ALL PHONICS SECTIONS"}
                  {activeFullscreenGroup && (
                    <span className="phonics-fs-ipa-badge">
                      {activeFullscreenGroup.ipa} &bull; {VOWEL_PHONIC_GUIDE[activeFullscreenGroup.vowel]?.marathiAnchorWord || activeFullscreenGroup.marathiSound}
                    </span>
                  )}
                </h2>
                <p className="phonics-fs-sub">
                  {activeFullscreenGroup
                    ? `Short Vowel ${activeFullscreenGroup.vowel.toUpperCase()} (${VOWEL_PHONIC_GUIDE[activeFullscreenGroup.vowel]?.marathiLetterSound || activeFullscreenGroup.ipa}) as in ${VOWEL_PHONIC_GUIDE[activeFullscreenGroup.vowel]?.anchorWord || "words"}`
                    : `All 5 Short Vowels & CVC Word Families (${totalWords} Words)`}
                </p>
              </div>

              {/* Sound Action Buttons */}
              {activeFullscreenGroup && (
                <div className="phonics-fs-sound-actions">
                  <button
                    className="phonics-fs-vowel-speak-btn"
                    onClick={() => handleLetterOnlyClick(activeFullscreenGroup)}
                    title={`Hear ${activeFullscreenGroup.vowel.toUpperCase()} phonetic sound`}
                  >
                    🔊 {activeFullscreenGroup.vowel.toUpperCase()} Sound
                  </button>
                  <button
                    className="phonics-fs-recite-btn"
                    onClick={() => reciteVowelWords(activeFullscreenGroup)}
                    title={`Recite all words in ${activeFullscreenGroup.title}`}
                  >
                    {isReciting ? "⏸️ थांबवा (Stop)" : "▶️ Recite Section"}
                  </button>
                </div>
              )}
            </div>

            {/* Center: Section Switcher Tabs & Prev/Next */}
            <div className="phonics-fs-section-switcher">
              <button
                className="phonics-fs-nav-arrow"
                onClick={() => {
                  const vowelIds = ["short_a", "short_e", "short_i", "short_o", "short_u"];
                  const currIdx = vowelIds.indexOf(fullscreenSection);
                  const prevIdx = currIdx <= 0 ? vowelIds.length - 1 : currIdx - 1;
                  setFullscreenSection(vowelIds[prevIdx]);
                  setFullscreenFamilyFilter("all");
                }}
                title="Previous section (Left Arrow ◀)"
                aria-label="Previous section"
              >
                ◀
              </button>

              <div className="phonics-fs-vowel-pills">
                {PHONICS_DATA.map((g) => {
                  const isActive = fullscreenSection === g.id;
                  const wordCount = g.families.reduce((acc, f) => acc + f.words.length, 0);
                  return (
                    <button
                      key={`fs-pill-${g.id}`}
                      className={`phonics-fs-vowel-pill ${isActive ? "active" : ""}`}
                      onClick={() => {
                        setFullscreenSection(g.id);
                        setFullscreenFamilyFilter("all");
                      }}
                      style={{
                        backgroundColor: isActive ? "#ffffff" : "rgba(255,255,255,0.18)",
                        color: isActive ? g.color : "#ffffff",
                        borderColor: isActive ? "#ffffff" : "rgba(255,255,255,0.3)",
                      }}
                      title={`Switch to ${g.title} (${wordCount} words)`}
                    >
                      <span className="fs-pill-letter">{g.vowel.toUpperCase()}</span>
                      <span className="fs-pill-sound">{VOWEL_PHONIC_GUIDE[g.vowel]?.marathiLetterSound.split(",")[0] || g.vowel}</span>
                    </button>
                  );
                })}
                <button
                  className={`phonics-fs-vowel-pill ${fullscreenSection === "all" ? "active" : ""}`}
                  onClick={() => {
                    setFullscreenSection("all");
                    setFullscreenFamilyFilter("all");
                  }}
                  style={{
                    backgroundColor: fullscreenSection === "all" ? "#ffffff" : "rgba(255,255,255,0.18)",
                    color: fullscreenSection === "all" ? "#0f172a" : "#ffffff",
                  }}
                  title="View all 5 sections"
                >
                  <span className="fs-pill-letter">ALL</span>
                </button>
              </div>

              <button
                className="phonics-fs-nav-arrow"
                onClick={() => {
                  const vowelIds = ["short_a", "short_e", "short_i", "short_o", "short_u"];
                  const currIdx = vowelIds.indexOf(fullscreenSection);
                  const nextIdx = currIdx === -1 || currIdx >= vowelIds.length - 1 ? 0 : currIdx + 1;
                  setFullscreenSection(vowelIds[nextIdx]);
                  setFullscreenFamilyFilter("all");
                }}
                title="Next section (Right Arrow ▶)"
                aria-label="Next section"
              >
                ▶
              </button>
            </div>

            {/* Right: Controls & Exit Full Screen */}
            <div className="phonics-fs-actions">
              {/* Voice Engine Toggle */}
              <button
                className="phonics-fs-control-pill"
                onClick={() => setVoiceEngine(voiceEngine === "vyanjan" ? "english" : "vyanjan")}
                title="Toggle pronunciation voice engine"
              >
                {voiceEngine === "vyanjan" ? "🕉️ व्यंजने फोनिक्स" : "🇬🇧 English"}
              </button>

              {/* Speed Selector */}
              <div className="phonics-fs-speed-group">
                {[
                  { rate: 0.70, label: "0.7x" },
                  { rate: 0.80, label: "0.8x" },
                  { rate: 1.00, label: "1.0x" },
                ].map((s) => (
                  <button
                    key={`fs-speed-${s.rate}`}
                    className={`phonics-fs-speed-btn ${speechSpeed === s.rate ? "active" : ""}`}
                    onClick={() => setSpeechSpeed(s.rate)}
                    title={`Set speech speed to ${s.rate}x`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>

              {/* Blending Mode Toggle */}
              <button
                className={`phonics-fs-control-pill ${blendingMode ? "blend-active" : ""}`}
                onClick={() => setBlendingMode(!blendingMode)}
                title="Toggle Phonetic Blending (b + at = bat)"
              >
                {blendingMode ? "🧩 Blending" : "🗣️ Word"}
              </button>

              {/* Close / Exit Fullscreen Button */}
              <button
                className="phonics-fs-exit-btn"
                onClick={exitFullscreen}
                title="Exit Full Screen (Escape)"
                aria-label="Exit Full Screen"
              >
                ✕ Exit (Esc)
              </button>
            </div>
          </div>

          {/* Sub-bar: Family Filter Pills */}
          {activeFullscreenGroup && (
            <div className="phonics-fs-subbar">
              <span className="phonics-fs-filter-label">🎯 Word Families:</span>
              <button
                className={`phonics-fs-fam-filter-btn ${fullscreenFamilyFilter === "all" ? "active" : ""}`}
                onClick={() => setFullscreenFamilyFilter("all")}
              >
                All Families ({activeFullscreenGroup.families.reduce((s, f) => s + f.words.length, 0)} words)
              </button>
              {activeFullscreenGroup.families.map((f) => {
                const isSelected = fullscreenFamilyFilter === f.family;
                return (
                  <button
                    key={`fs-fam-filter-${f.family}`}
                    className={`phonics-fs-fam-filter-btn ${isSelected ? "active" : ""}`}
                    style={{
                      borderColor: f.headerBg,
                      backgroundColor: isSelected ? f.headerBg : undefined,
                      color: isSelected ? "#ffffff" : undefined,
                    }}
                    onClick={() => setFullscreenFamilyFilter(f.family)}
                  >
                    {f.family} ({f.words.length})
                  </button>
                );
              })}
            </div>
          )}

          {/* Scrollable Main Columns Content */}
          <div className="phonics-fs-body">
            {displayedFullscreenGroups.map((group) => {
              const familiesToRender = getFilteredFullscreenFamilies(group);
              return (
                <div key={`fs-sec-${group.id}`} className="phonics-fs-section-block">
                  {displayedFullscreenGroups.length > 1 && (
                    <div
                      className="phonics-fs-multisection-header"
                      style={{ backgroundColor: group.headerBg }}
                    >
                      <span>Short {group.vowel.toUpperCase()} &bull; {group.ipa} ({group.marathiSound})</span>
                      <button
                        className="fs-zoom-sec-btn"
                        onClick={() => setFullscreenSection(group.id)}
                        title={`Focus only on ${group.title}`}
                      >
                        🔍 Focus Section
                      </button>
                    </div>
                  )}

                  <div
                    className="phonics-fs-columns-grid"
                    style={{
                      gridTemplateColumns: `repeat(${familiesToRender.length}, minmax(130px, 1fr))`,
                    }}
                  >
                    {familiesToRender.map((familyCol) => {
                      const isFamilyActive = activeFamilyKey === `${group.vowel}_${familyCol.family}`;

                      return (
                        <div
                          key={`fs-col-${group.vowel}-${familyCol.family}`}
                          className={`phonics-fs-family-col ${isFamilyActive ? "family-active" : ""}`}
                        >
                          {/* Family Column Header */}
                          <button
                            className="phonics-fs-family-header"
                            style={{ backgroundColor: familyCol.headerBg }}
                            onClick={() => handleFamilyClick(group, familyCol)}
                            title={`Click to hear ${familyCol.family} family words`}
                          >
                            <span className="fs-family-name">{familyCol.family}</span>
                            <span className="fs-family-badge">{familyCol.words.length}</span>
                          </button>

                          {/* Words List with Large Cards */}
                          <div className="phonics-fs-words-container">
                            {familyCol.words.map((wordItem) => {
                              const isWordActive = activeWordKey === wordItem.key;
                              const isRecitingThis = recitingWordKey === wordItem.key;
                              const matchesSearch =
                                searchTerm &&
                                wordItem.word.toLowerCase().includes(searchTerm.toLowerCase());
                              const practiceData = chartProgressRecords[wordItem.key];
                              const practiceCount = practiceData?.practiceCount || 0;

                              return (
                                <button
                                  key={`fs-w-${wordItem.key}`}
                                  className={`phonics-fs-word-btn ${isWordActive ? "active" : ""} ${
                                    isRecitingThis ? "reciting" : ""
                                  } ${matchesSearch ? "search-match" : ""}`}
                                  style={{ backgroundColor: familyCol.columnBg }}
                                  onClick={() => handleWordClick(group, familyCol, wordItem)}
                                  title={`Click to pronounce "${wordItem.word}" (${wordItem.onset} + ${wordItem.rime} = ${wordItem.marathi || wordItem.word})`}
                                >
                                  <span className="phonics-fs-word-main">{wordItem.word}</span>
                                  {wordItem.marathi && (
                                    <span className="phonics-fs-word-sub">{wordItem.marathi}</span>
                                  )}
                                  {practiceCount > 0 && (
                                    <span className="phonics-fs-star-indicator" title={`Practiced ${practiceCount} time(s)`}>
                                      ⭐{practiceCount > 1 ? practiceCount : ""}
                                    </span>
                                  )}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Floating Spotlight Card at Bottom of Full-Screen */}
          {activeWordObj && (
            <div
              className="phonics-fs-spotlight-bar"
              style={{ borderLeftColor: activeWordObj.vowel.color }}
            >
              <div className="fs-spotlight-left">
                <div
                  className="fs-spotlight-word-badge"
                  style={{ backgroundColor: activeWordObj.family.headerBg }}
                >
                  {activeWordObj.word.word}
                </div>
                <div className="fs-spotlight-phonics-breakdown">
                  <span className="fs-token fs-onset-token">
                    {activeWordObj.word.onset} (
                    {voiceEngine === "vyanjan"
                      ? ONSET_MARATHI_SOUNDS[activeWordObj.word.onset.toLowerCase()] || activeWordObj.word.onset
                      : ONSET_PHONIC_SOUNDS[activeWordObj.word.onset.toLowerCase()] || activeWordObj.word.onset}
                    )
                  </span>
                  <span className="fs-plus-sign">+</span>
                  <span className="fs-token fs-rime-token">
                    {activeWordObj.word.rime} (
                    {RIME_MARATHI_SOUNDS[activeWordObj.word.rime.toLowerCase()] || activeWordObj.word.rime}
                    )
                  </span>
                  <span className="fs-arrow-sign">➔</span>
                  <span className="fs-token fs-result-token">{activeWordObj.word.word}</span>
                  {activeWordObj.word.marathi && (
                    <span className="fs-marathi-meaning">{activeWordObj.word.marathi}</span>
                  )}
                </div>
                <div className="fs-spotlight-meta">
                  {activeWordObj.vowel.title.toUpperCase()} ({activeWordObj.vowel.ipa}) &bull;{" "}
                  <strong>{activeWordObj.family.family}</strong> family
                  {chartProgressRecords[activeWordObj.word.key] && (
                    <span style={{ marginLeft: "8px", color: "#16a34a", fontWeight: 700 }}>
                      ⭐ Practiced {chartProgressRecords[activeWordObj.word.key].practiceCount} time(s)
                    </span>
                  )}
                </div>
              </div>

              <div className="fs-spotlight-actions">
                <button
                  className="fs-spotlight-act-btn fs-btn-blend"
                  onClick={() => {
                    const onsetClean = activeWordObj.word.onset.toLowerCase();
                    const rimeClean = activeWordObj.word.rime.toLowerCase();
                    if (voiceEngine === "vyanjan") {
                      const onsetMarathi = ONSET_MARATHI_SOUNDS[onsetClean] || activeWordObj.word.onset;
                      const rimeMarathi = RIME_MARATHI_SOUNDS[rimeClean] || activeWordObj.word.rime;
                      const wordMarathi = activeWordObj.word.marathi || activeWordObj.word.word;
                      playPhonicsAudio(`${onsetMarathi}, ${rimeMarathi}, ${wordMarathi}`, speechSpeed, "mr");
                    } else {
                      const onsetSound = ONSET_PHONIC_SOUNDS[onsetClean] || activeWordObj.word.onset;
                      playPhonicsAudio(`${onsetSound}, ${activeWordObj.word.rime}, ${activeWordObj.word.word}`, speechSpeed, "en");
                    }
                    onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word);
                  }}
                  title="Sound out onset + rime blend slowly like in Vyanjans"
                >
                  <span>🧩 जोडा (Blend)</span>
                </button>
                <button
                  className="fs-spotlight-act-btn fs-btn-say"
                  onClick={() => {
                    if (voiceEngine === "vyanjan") {
                      playPhonicsAudio(activeWordObj.word.marathi || activeWordObj.word.word, speechSpeed, "mr");
                    } else {
                      playPhonicsAudio(activeWordObj.word.word, speechSpeed, "en");
                    }
                    onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word);
                  }}
                  title="Pronounce word"
                >
                  <span>🔊 ऐका (Say Word)</span>
                </button>
                <button
                  className="fs-spotlight-act-btn fs-btn-star"
                  onClick={() => onRecordPractice(chartSlug, activeWordObj.word.key, activeWordObj.word.word)}
                  disabled={savingChartItem === activeWordObj.word.key}
                  title="Mark word practiced"
                >
                  <span>⭐ {chartProgressRecords[activeWordObj.word.key] ? `${chartProgressRecords[activeWordObj.word.key].practiceCount}x सराव` : "सराव (Star)"}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
