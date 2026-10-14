import React, { useState, useRef, useEffect } from "react";
import { speak as voiceSpeak, stopSpeech as voiceStopSpeech } from "../services/voiceService";
import {
  DEFAULT_POEMS,
  POEM_CATEGORIES,
  PoemItem,
  PoemLine,
} from "./poemsData";

interface PoemsLearningChartViewProps {
  chartSlug?: string;
  chartProgressRecords?: Record<string, { practiceCount: number; lastPracticedAt: string; itemName?: string }>;
  onRecordPractice: (chartSlug: string, itemKey: string, itemName?: string) => Promise<void>;
  savingChartItem: string | null;
  childName?: string;
  apiUrl?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function PoemsLearningChartView({
  chartSlug = "poems",
  chartProgressRecords = {},
  onRecordPractice,
  savingChartItem,
  childName = "Student",
  apiUrl,
  isFullscreen = false,
  onToggleFullscreen,
}: PoemsLearningChartViewProps) {
  // Active poem: Default to Priority #1 ("see_me_skip")
  const [selectedPoemId, setSelectedPoemId] = useState<string>("see_me_skip");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [showMarathiTranslation, setShowMarathiTranslation] = useState<boolean>(true);
  const [speechSpeed, setSpeechSpeed] = useState<number>(0.9); // 0.9x pleasant nursery pace
  const [activeActionId, setActiveActionId] = useState<string | null>(null);

  // Recitation State
  const [isReciting, setIsReciting] = useState<boolean>(false);
  const [activeLineKey, setActiveLineKey] = useState<string | null>(null); // e.g. "s1_l0"
  const isRecitingRef = useRef<boolean>(false);
  const reciteTimerRef = useRef<any>(null);
  const sharedAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentPoem = DEFAULT_POEMS.find((p) => p.id === selectedPoemId) || DEFAULT_POEMS[0];
  const practiceData = chartProgressRecords[currentPoem.key];

  // Flat list of all lines for sequential karaoke recitation
  const allLines = currentPoem.stanzas.flatMap((stanza, sIdx) =>
    stanza.lines.map((line, lIdx) => ({
      ...line,
      lineKey: `s${sIdx}_l${lIdx}`,
      stanzaNumber: stanza.stanzaNumber,
      isLastInStanza: lIdx === stanza.lines.length - 1,
    }))
  );

  // Filter poems for the gallery
  const filteredPoems = selectedCategory === "all"
    ? DEFAULT_POEMS
    : DEFAULT_POEMS.filter((p) => p.category === selectedCategory);

  // Stop recitation on unmount or when changing poem
  useEffect(() => {
    return () => {
      stopRecitation();
    };
  }, [selectedPoemId]);

  const stopRecitation = () => {
    isRecitingRef.current = false;
    setIsReciting(false);
    setActiveLineKey(null);
    if (reciteTimerRef.current) {
      clearTimeout(reciteTimerRef.current);
      reciteTimerRef.current = null;
    }
    if (sharedAudioRef.current) {
      sharedAudioRef.current.pause();
    }
    voiceStopSpeech();
  };

  // Audio speech player
  const speakText = (text: string, rate: number = speechSpeed, lang: string = "en"): Promise<void> => {
    return voiceSpeak(text, { rate, lang, apiUrl });
  };

  // Click individual line to hear audio
  const handleLineClick = async (line: PoemLine, lineKey: string) => {
    stopRecitation();
    setActiveLineKey(lineKey);
    const lang = currentPoem.category === "marathi" ? "mr" : "en";
    await speakText(line.text, speechSpeed, lang);
  };

  // Sequential Recite Whole Poem (Karaoke Style)
  const reciteWholePoem = async () => {
    if (isReciting) {
      stopRecitation();
      return;
    }

    stopRecitation();
    isRecitingRef.current = true;
    setIsReciting(true);

    const lang = currentPoem.category === "marathi" ? "mr" : "en";

    const reciteLineAt = async (index: number) => {
      if (!isRecitingRef.current || index >= allLines.length) {
        stopRecitation();
        if (index >= allLines.length) {
          // Record practice automatically on full completion!
          await onRecordPractice(chartSlug, currentPoem.key, currentPoem.title);
          speakText(
            lang === "mr"
              ? `छान! ${currentPoem.title} कविता पूर्ण झाली!`
              : `Wonderful recitation of ${currentPoem.title}! Great job, ${childName}!`,
            speechSpeed,
            lang
          );
        }
        return;
      }

      const line = allLines[index];
      setActiveLineKey(line.lineKey);

      await speakText(line.text, speechSpeed, lang);

      // Pause duration: slightly longer if end of stanza for natural poetry rhythm
      const pauseDuration = line.isLastInStanza ? 1300 : 700;

      reciteTimerRef.current = setTimeout(() => {
        reciteLineAt(index + 1);
      }, pauseDuration);
    };

    reciteLineAt(0);
  };

  // Trigger Fun Poem Action
  const triggerAction = async (action: (typeof currentPoem.actions)[0]) => {
    setActiveActionId(action.id);
    stopRecitation();
    const lang = currentPoem.category === "marathi" ? "mr" : "en";
    await speakText(action.phrase, 1.0, lang);
    setTimeout(() => setActiveActionId(null), 1200);
  };

  // Pronounce vocabulary word
  const pronounceWord = async (vocab: (typeof currentPoem.vocabulary)[0]) => {
    stopRecitation();
    await speakText(`${vocab.word}. ${vocab.meaning}`, 0.9, "en");
  };

  // Pronounce rhyming pair
  const pronounceRhyme = async (pair: (typeof currentPoem.rhymingPairs)[0]) => {
    stopRecitation();
    const textToSpeak = pair.pair.join(", ");
    await speakText(`Rhyming words: ${textToSpeak}.`, 0.85, currentPoem.category === "marathi" ? "mr" : "en");
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === "ArrowLeft") {
        const currIdx = DEFAULT_POEMS.findIndex((p) => p.id === selectedPoemId);
        const prevIdx = currIdx <= 0 ? DEFAULT_POEMS.length - 1 : currIdx - 1;
        setSelectedPoemId(DEFAULT_POEMS[prevIdx].id);
      } else if (e.key === "ArrowRight") {
        const currIdx = DEFAULT_POEMS.findIndex((p) => p.id === selectedPoemId);
        const nextIdx = currIdx === -1 || currIdx >= DEFAULT_POEMS.length - 1 ? 0 : currIdx + 1;
        setSelectedPoemId(DEFAULT_POEMS[nextIdx].id);
      } else if (e.code === "Space") {
        e.preventDefault();
        reciteWholePoem();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedPoemId, isReciting]);

  return (
    <div className="poems-chart-container">
      {/* 1. Header & Control Toolbar */}
      <div className="poems-chart-header">
        <div className="poems-header-left">
          <div className="poems-header-badge">
            <span>🎭</span>
            <span>RHYMES &amp; POEMS (कविता आणि बालगीते)</span>
          </div>
          <h1 className="poems-main-title">Poems Learning Chart</h1>
          <p className="poems-header-subtitle">
            Interactive rhymes and school poems with rhythmic karaoke recitation, line-by-line audio, Marathi meanings, rhyming words, and action sounds!
          </p>
        </div>

        {/* Global Controls */}
        <div className="poems-header-controls">
          {/* Speed Selector */}
          <div className="poem-speed-control" title="Recite Speech Speed">
            <span style={{ fontSize: "13px", fontWeight: 700, color: "#475569" }}>⚡ Speed:</span>
            <div className="poem-speed-buttons">
              {[
                { val: 0.8, label: "0.8x Slow" },
                { val: 0.9, label: "0.9x Normal" },
                { val: 1.1, label: "1.1x Lively" },
              ].map((s) => (
                <button
                  key={s.val}
                  type="button"
                  className={`poem-speed-btn ${speechSpeed === s.val ? "active" : ""}`}
                  onClick={() => setSpeechSpeed(s.val)}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Marathi translation toggle */}
          <button
            type="button"
            className={`poem-toggle-marathi-btn ${showMarathiTranslation ? "active" : ""}`}
            onClick={() => setShowMarathiTranslation((prev) => !prev)}
            title="Toggle Marathi Line Translation"
          >
            <span>{showMarathiTranslation ? "📖" : "📕"}</span>
            <span>{showMarathiTranslation ? "मराठी अर्थ चालू (ON)" : "मराठी अर्थ बंद (OFF)"}</span>
          </button>

          {/* Full Screen Toggle */}
          {onToggleFullscreen && (
            <button
              type="button"
              className={`poem-fullscreen-btn ${isFullscreen ? "active" : ""}`}
              onClick={onToggleFullscreen}
              title={isFullscreen ? "Exit Full Screen (Esc)" : "Enter Full Screen Mode"}
            >
              <span>{isFullscreen ? "🗗" : "⛶"}</span>
              <span>{isFullscreen ? "Exit Full Screen" : "Full Screen Mode"}</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. Category Filter Bar */}
      <div className="poem-category-tabs" role="tablist">
        {POEM_CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            type="button"
            className={`poem-cat-tab ${selectedCategory === cat.id ? "active" : ""}`}
            onClick={() => setSelectedCategory(cat.id)}
            role="tab"
            aria-selected={selectedCategory === cat.id}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* 3. HERO POEM RECITER & STAGE */}
      <div
        className="poem-stage-card"
        style={{
          borderColor: currentPoem.color,
          background: "#ffffff",
        }}
      >
        {/* Top Banner Ribbon */}
        <div className="poem-stage-banner" style={{ background: currentPoem.headerBg }}>
          <div className="poem-banner-info">
            {currentPoem.badge && (
              <span className="poem-priority-badge">{currentPoem.badge}</span>
            )}
            <span className="poem-author-chip">✍️ {currentPoem.author}</span>
          </div>

          {/* Star Practice Counter */}
          <div className="poem-practice-status">
            {practiceData && practiceData.practiceCount > 0 ? (
              <span className="poem-practice-badge">
                ⭐ {practiceData.practiceCount}x सराव (Practiced)
              </span>
            ) : (
              <span className="poem-practice-badge empty">⭐ Not Practiced Yet</span>
            )}
          </div>
        </div>

        {/* Hero Content Grid (Left Illustration & Right Karaoke Reader) */}
        <div className="poem-stage-body">
          {/* Left Column: Visual Card, Information & Action Pad */}
          <div className="poem-left-column">
            {currentPoem.image ? (
              <div className="poem-image-wrapper">
                <img
                  src={currentPoem.image}
                  alt={currentPoem.title}
                  className="poem-main-image"
                />
                <div className="poem-image-caption">
                  <span style={{ fontSize: "20px" }}>{currentPoem.icon}</span>
                  <strong>{currentPoem.title}</strong>
                </div>
              </div>
            ) : (
              <div className="poem-icon-placeholder" style={{ background: currentPoem.bgGradient }}>
                <span style={{ fontSize: "64px" }}>{currentPoem.icon}</span>
                <h3>{currentPoem.title}</h3>
                <p>{currentPoem.marathiTitle}</p>
              </div>
            )}

            {/* Recitation Main Control Button */}
            <div className="poem-main-recite-row">
              <button
                type="button"
                className={`poem-recite-master-btn ${isReciting ? "reciting" : ""}`}
                onClick={reciteWholePoem}
                style={{
                  background: isReciting ? "#ef4444" : currentPoem.color,
                }}
              >
                <span style={{ fontSize: "22px" }}>{isReciting ? "⏹️" : "🎵"}</span>
                <span style={{ fontSize: "16px", fontWeight: 800 }}>
                  {isReciting ? "थांबवा (Stop Reciting)" : "कविता ऐका (Recite Poem)"}
                </span>
              </button>

              {/* Record Practice Button */}
              <button
                type="button"
                className="poem-star-practice-btn"
                onClick={() => onRecordPractice(chartSlug, currentPoem.key, currentPoem.title)}
                disabled={savingChartItem === currentPoem.key}
                title="Record poem practice session"
              >
                <span>⭐</span>
                <span>{savingChartItem === currentPoem.key ? "नोंदवत आहे..." : "मी सराव केला!"}</span>
              </button>
            </div>

            {/* Interactive Action Pad (for Priority poem "See Me Skip" and others) */}
            {currentPoem.actions && currentPoem.actions.length > 0 && (
              <div className="poem-actions-card">
                <div className="poem-actions-title">
                  <span>⚡ Fun Action Sounds (कृती करा):</span>
                </div>
                <div className="poem-actions-buttons">
                  {currentPoem.actions.map((act) => (
                    <button
                      key={act.id}
                      type="button"
                      className={`poem-action-btn ${activeActionId === act.id ? "active-action" : ""}`}
                      onClick={() => triggerAction(act)}
                    >
                      <span className="poem-act-icon">{act.icon}</span>
                      <span className="poem-act-label">{act.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Fun Educational Fact */}
            <div className="poem-fun-fact-box">
              <span style={{ fontSize: "18px" }}>💡</span>
              <div>
                <strong>Did you know? (माहित आहे का?)</strong>
                <p>{currentPoem.funFact}</p>
              </div>
            </div>
          </div>

          {/* Right Column: Karaoke Synchronized Stanza Reader */}
          <div className="poem-right-column">
            <div className="poem-title-box">
              <h2 className="poem-display-title">
                {currentPoem.icon} {currentPoem.title}
              </h2>
              <h4 className="poem-marathi-title">{currentPoem.marathiTitle}</h4>
              <p className="poem-desc-line">{currentPoem.description}</p>
            </div>

            {/* Stanzas Display with Karaoke Glow */}
            <div className="poem-stanzas-list">
              {currentPoem.stanzas.map((stanza) => (
                <div key={stanza.stanzaNumber} className="poem-stanza-block">
                  <div className="poem-stanza-badge">
                    <span>कडवे (Stanza) {stanza.stanzaNumber}</span>
                  </div>

                  <div className="poem-lines-group">
                    {stanza.lines.map((line, lIdx) => {
                      const lineKey = `s${stanza.stanzaNumber - 1}_l${lIdx}`;
                      const isActive = activeLineKey === lineKey;

                      return (
                        <div
                          key={lineKey}
                          className={`poem-line-row ${isActive ? "karaoke-active-line" : ""}`}
                          onClick={() => handleLineClick(line, lineKey)}
                          title="Click to hear this line read aloud!"
                          tabIndex={0}
                          role="button"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleLineClick(line, lineKey);
                          }}
                        >
                          <div className="poem-line-left">
                            <span className="poem-line-play-icon">
                              {isActive ? "🔊" : "▶"}
                            </span>
                            <span className="poem-line-text">{line.text}</span>
                            {line.actionIcon && (
                              <span className="poem-line-icon-tag">{line.actionIcon}</span>
                            )}
                          </div>

                          {/* Marathi translation under line */}
                          {showMarathiTranslation && line.marathi && (
                            <div className="poem-line-marathi">
                              {line.marathi}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rhyming Words Discovery Section */}
            {currentPoem.rhymingPairs && currentPoem.rhymingPairs.length > 0 && (
              <div className="poem-rhymes-container">
                <div className="poem-section-header">
                  <span>🎵 Rhyming Words Spotlight (यमक जुळणारे शब्द):</span>
                </div>
                <div className="poem-rhyme-chips">
                  {currentPoem.rhymingPairs.map((r, rIdx) => (
                    <div
                      key={rIdx}
                      className="poem-rhyme-card"
                      onClick={() => pronounceRhyme(r)}
                      title="Click to hear these rhyming words!"
                    >
                      <div className="rhyme-pair-words">
                        {r.pair.map((w, wIdx) => (
                          <span key={wIdx} className="rhyme-word-pill">
                            {w}
                          </span>
                        ))}
                      </div>
                      <div className="rhyme-sound-tag">
                        <span>Phonic sound: <strong>{r.sound}</strong></span>
                      </div>
                      {r.marathiTip && (
                        <div className="rhyme-marathi-tip">{r.marathiTip}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Vocabulary Dictionary Cards */}
            {currentPoem.vocabulary && currentPoem.vocabulary.length > 0 && (
              <div className="poem-vocab-container">
                <div className="poem-section-header">
                  <span>📖 Key Vocabulary &amp; Word Meanings (शब्दार्थ):</span>
                </div>
                <div className="poem-vocab-grid">
                  {currentPoem.vocabulary.map((v, vIdx) => (
                    <div
                      key={vIdx}
                      className="poem-vocab-item"
                      onClick={() => pronounceWord(v)}
                      title={`Click to pronounce "${v.word}"`}
                    >
                      <span className="poem-vocab-icon">{v.icon}</span>
                      <div className="poem-vocab-text">
                        <strong className="poem-vocab-word">{v.word}</strong>
                        <span className="poem-vocab-marathi">{v.marathi}</span>
                        <small className="poem-vocab-meaning">{v.meaning}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 4. POEMS GALLERY (CARDS FOR ALL POEMS) */}
      <div className="poems-gallery-section">
        <div className="poems-gallery-header">
          <h2>📚 All Poems in Chart ({filteredPoems.length} Available)</h2>
          <p>Click any poem card below to open its full karaoke recitation, lyrics, and fun activities!</p>
        </div>

        <div className="poems-grid">
          {filteredPoems.map((poem) => {
            const isSelected = poem.id === selectedPoemId;
            const rec = chartProgressRecords[poem.key];

            return (
              <div
                key={poem.id}
                className={`poem-card-item ${isSelected ? "selected-poem" : ""} ${poem.id === "see_me_skip" ? "priority-poem-card" : ""}`}
                onClick={() => {
                  stopRecitation();
                  setSelectedPoemId(poem.id);
                  // Scroll hero stage into view if needed
                  window.scrollTo({ top: 180, behavior: "smooth" });
                }}
                tabIndex={0}
                role="button"
                onKeyDown={(e) => {
                  if (e.key === "Enter") setSelectedPoemId(poem.id);
                }}
              >
                {/* Priority ribbon for See me skip */}
                {poem.id === "see_me_skip" && (
                  <div className="priority-ribbon">
                    <span>⭐ PRIORITY • GRADE 1</span>
                  </div>
                )}

                <div className="poem-card-top" style={{ background: poem.bgGradient }}>
                  <span className="poem-card-icon">{poem.icon}</span>
                  {poem.image && (
                    <img
                      src={poem.image}
                      alt={poem.title}
                      className="poem-card-thumb"
                    />
                  )}
                </div>

                <div className="poem-card-content">
                  <h3 className="poem-card-title">{poem.title}</h3>
                  <h5 className="poem-card-marathi">{poem.marathiTitle}</h5>
                  <p className="poem-card-first-line">
                    "{poem.stanzas[0]?.lines[0]?.text || ""} {poem.stanzas[0]?.lines[1]?.text || ""}"
                  </p>

                  <div className="poem-card-footer">
                    <span className="poem-card-stanzas">
                      📝 {poem.stanzas.length} {poem.stanzas.length === 1 ? "Stanza" : "Stanzas"}
                    </span>
                    {rec && rec.practiceCount > 0 ? (
                      <span className="poem-card-star-badge">
                        ⭐ {rec.practiceCount}x
                      </span>
                    ) : (
                      <span className="poem-card-star-badge new">New</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
