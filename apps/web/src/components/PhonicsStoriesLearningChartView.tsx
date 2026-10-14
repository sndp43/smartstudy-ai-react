import React, { useState, useRef, useEffect } from "react";
import {
  GRADE1_PHONICS_STORIES,
  PHONICS_STORY_CATEGORIES,
  PhonicsStoryItem,
} from "./phonicsStoriesData";
import { speak as voiceSpeak, stopSpeech as voiceStopSpeech } from "../services/voiceService";
import { VoiceSettingsButton } from "./VoiceSettingsModal";

interface PhonicsStoriesLearningChartViewProps {
  chartSlug?: string;
  chartProgressRecords?: Record<string, { practiceCount: number; lastPracticedAt: string; itemName?: string }>;
  onRecordPractice: (chartSlug: string, itemKey: string, itemName?: string) => Promise<void>;
  savingChartItem: string | null;
  childName?: string;
  apiUrl?: string;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
}

export default function PhonicsStoriesLearningChartView({
  chartSlug = "phonic-stories",
  chartProgressRecords = {},
  onRecordPractice,
  savingChartItem,
  childName = "Learner",
  apiUrl,
  isFullscreen = false,
  onToggleFullscreen,
}: PhonicsStoriesLearningChartViewProps) {
  // Selected Story & Category
  const [selectedStoryId, setSelectedStoryId] = useState<string>("pat-the-cat");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [showMarathi, setShowMarathi] = useState<boolean>(true);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [highlightedWord, setHighlightedWord] = useState<string | null>(null);

  // Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});
  const [quizResults, setQuizResults] = useState<Record<string, boolean>>({});

  const readingTimerRef = useRef<any>(null);

  const currentStory: PhonicsStoryItem =
    GRADE1_PHONICS_STORIES.find((s) => s.id === selectedStoryId) || GRADE1_PHONICS_STORIES[0];

  const practiceData = chartProgressRecords[currentStory.slug];

  // Filter stories
  const filteredStories =
    selectedCategory === "all"
      ? GRADE1_PHONICS_STORIES
      : GRADE1_PHONICS_STORIES.filter((s) => s.categoryId === selectedCategory);

  // Reset page index and quiz on story change
  useEffect(() => {
    setCurrentPageIndex(0);
    setQuizAnswers({});
    setQuizResults({});
    stopReading();
  }, [selectedStoryId]);

  const speak = (text: string, rate?: number) => {
    voiceSpeak(text, { rate, apiUrl });
  };

  const stopReading = () => {
    if (readingTimerRef.current) {
      clearTimeout(readingTimerRef.current);
      readingTimerRef.current = null;
    }
    voiceStopSpeech();
    setIsReadingAloud(false);
    setHighlightedWord(null);
  };

  const handleReadCurrentPage = () => {
    const page = currentStory.pages[currentPageIndex];
    if (!page) return;
    setIsReadingAloud(true);
    speak(page.text, 0.82);

    // Track practice for reader
    onRecordPractice(chartSlug, currentStory.slug, currentStory.title);

    // Reset reading indicator when speech finishes
    readingTimerRef.current = setTimeout(() => {
      setIsReadingAloud(false);
    }, Math.max(3000, page.text.length * 90));
  };

  const handleReadEntireStory = () => {
    stopReading();
    setIsReadingAloud(true);
    let pageIdx = 0;

    const readStep = () => {
      if (pageIdx >= currentStory.pages.length) {
        setIsReadingAloud(false);
        return;
      }
      setCurrentPageIndex(pageIdx);
      const textToRead = currentStory.pages[pageIdx].text;
      speak(textToRead, 0.82);

      const duration = Math.max(3200, textToRead.length * 85);
      pageIdx++;
      readingTimerRef.current = setTimeout(readStep, duration);
    };

    readStep();
  };

  const handleSoundWord = (word: string) => {
    setHighlightedWord(word);
    speak(word, 0.75);
    setTimeout(() => setHighlightedWord(null), 1400);
  };

  const handleAnswerQuiz = (qId: string, choice: string, correct: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: choice }));
    setQuizResults((prev) => ({ ...prev, [qId]: choice === correct }));
    if (choice === correct) {
      speak("Great job! That is correct!", 0.95);
    } else {
      speak("Try again! Sound out the phonics clue.", 0.9);
    }
  };

  // Arrow key keyboard navigation for previous and next page
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setCurrentPageIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setCurrentPageIndex((prev) =>
          Math.min(currentStory.pages.length - 1, prev + 1)
        );
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentStory.pages.length]);

  const currentPage = currentStory.pages[currentPageIndex] || currentStory.pages[0];

  return (
    <div
      className={`phonics-story-container ${isFullscreen ? "phonics-fullscreen-view" : ""}`}
      style={{ display: "flex", flexDirection: "column", gap: isFullscreen ? "16px" : "20px" }}
    >
      {/* ── FULLSCREEN TOP STORY BAR (Only shown in Fullscreen mode) ── */}
      {isFullscreen && (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: currentStory.headerBg,
            color: "#fff",
            padding: "14px 22px",
            borderRadius: "16px",
            boxShadow: "0 6px 20px rgba(0,0,0,0.14)",
            flexWrap: "wrap",
            gap: "14px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "32px" }}>{currentStory.icon}</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                <h2 style={{ margin: 0, fontSize: "22px", fontWeight: 800 }}>
                  {currentStory.title}
                </h2>
                <span
                  style={{
                    background: "#FEF08A",
                    color: "#854D0E",
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 800,
                  }}
                >
                  {currentStory.phonicsFocus}
                </span>
                <span
                  style={{
                    background: "rgba(255,255,255,0.22)",
                    padding: "2px 10px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    fontWeight: 700,
                  }}
                >
                  Page {currentPageIndex + 1} of {currentStory.pages.length}
                </span>
              </div>
              {showMarathi && (
                <div style={{ fontSize: "14px", opacity: 0.92, fontWeight: 600, marginTop: "2px" }}>
                  {currentStory.marathiTitle}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span
              style={{
                background: "rgba(255,255,255,0.2)",
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              ⌨️ Use <strong>[←]</strong> and <strong>[→]</strong> keys
            </span>

            <button
              type="button"
              onClick={() => setShowMarathi(!showMarathi)}
              style={{
                background: showMarathi ? "#fff" : "rgba(255,255,255,0.2)",
                color: showMarathi ? currentStory.color : "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "7px 14px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              {showMarathi ? "मराठी ON" : "मराठी OFF"}
            </button>

            <button
              type="button"
              onClick={handleReadEntireStory}
              disabled={isReadingAloud}
              style={{
                background: "#FEF08A",
                color: "#713F12",
                border: "none",
                borderRadius: "8px",
                padding: "7px 16px",
                fontSize: "12px",
                fontWeight: 800,
                cursor: "pointer",
              }}
            >
              {isReadingAloud ? "🔊 Reading..." : "▶ Read Full Story"}
            </button>
            {isReadingAloud && (
              <button
                type="button"
                onClick={stopReading}
                style={{
                  background: "#EF4444",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "7px 12px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                ⏹ Stop
              </button>
            )}

            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                style={{
                  background: "rgba(0,0,0,0.35)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.3)",
                  borderRadius: "8px",
                  padding: "7px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
                title="Exit Full Screen Mode (Esc)"
              >
                ✕ Exit Fullscreen
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── HEADER BANNER (Hidden in Fullscreen) ── */}
      {!isFullscreen && (
        <div
          className="story-master-header"
          style={{
            background: currentStory.headerBg,
            borderRadius: "16px",
            padding: "24px 28px",
            color: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            boxShadow: "0 10px 25px rgba(0,0,0,0.12)",
          }}
        >
          <div style={{ maxWidth: "680px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <span style={{ fontSize: "36px" }}>{currentStory.icon}</span>
              <span
                style={{
                  background: "rgba(255,255,255,0.22)",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  fontSize: "12px",
                  fontWeight: 800,
                  letterSpacing: "0.5px",
                  textTransform: "uppercase",
                }}
              >
                {currentStory.badge}
              </span>
              <span
                style={{
                  background: "#FEF08A",
                  color: "#854D0E",
                  padding: "3px 10px",
                  borderRadius: "20px",
                  fontSize: "11px",
                  fontWeight: 800,
                }}
              >
                Phonics: {currentStory.phonicsFocus}
              </span>
            </div>
            <h2 style={{ margin: "0 0 6px", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.5px" }}>
              {currentStory.title}
            </h2>
            <div style={{ fontSize: "16px", opacity: 0.92, fontWeight: 600, marginBottom: "8px" }}>
              {currentStory.marathiTitle}
            </div>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9, lineHeight: 1.5 }}>
              {currentStory.summary}
            </p>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", alignItems: "flex-end" }}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                background: "rgba(255,255,255,0.18)",
                padding: "6px 14px",
                borderRadius: "10px",
                fontSize: "12px",
              }}
            >
              <span>⭐ Practiced:</span>
              <strong>{practiceData?.practiceCount || 0} times</strong>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                type="button"
                onClick={() => setShowMarathi(!showMarathi)}
                style={{
                  background: showMarathi ? "#fff" : "rgba(255,255,255,0.2)",
                  color: showMarathi ? currentStory.color : "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 14px",
                  fontSize: "12px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                }}
              >
                {showMarathi ? "मराठी ON" : "मराठी OFF"}
              </button>
              <button
                type="button"
                onClick={handleReadEntireStory}
                disabled={isReadingAloud}
                style={{
                  background: "#FEF08A",
                  color: "#713F12",
                  border: "none",
                  borderRadius: "8px",
                  padding: "8px 16px",
                  fontSize: "12px",
                  fontWeight: 800,
                  cursor: "pointer",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                }}
              >
                {isReadingAloud ? "🔊 Reading..." : "▶ Read Full Story"}
              </button>
              {isReadingAloud && (
                <button
                  type="button"
                  onClick={stopReading}
                  style={{
                    background: "#EF4444",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "8px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  ⏹ Stop
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CATEGORY TABS (Hidden in Fullscreen) ── */}
      {!isFullscreen && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--muted)" }}>Filter Category:</span>
          {PHONICS_STORY_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              style={{
                padding: "6px 14px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 700,
                cursor: "pointer",
                border: selectedCategory === cat.id ? "1px solid var(--teal)" : "1px solid var(--line)",
                background: selectedCategory === cat.id ? "var(--teal)" : "#fff",
                color: selectedCategory === cat.id ? "#fff" : "var(--ink)",
                boxShadow: selectedCategory === cat.id ? "0 2px 6px rgba(18,59,58,0.2)" : "none",
                transition: "all 0.15s ease",
              }}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* ── STORY SHELF CAROUSEL / GRID (Hidden in Fullscreen) ── */}
      {!isFullscreen && (
        <div
          className="story-shelf"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
            gap: "14px",
          }}
        >
          {filteredStories.map((story) => {
            const isSelected = story.id === currentStory.id;
            return (
              <button
                key={story.id}
                type="button"
                onClick={() => setSelectedStoryId(story.id)}
                style={{
                  textAlign: "left",
                  background: isSelected ? story.bgGradient : "#fff",
                  border: isSelected ? `2px solid ${story.color}` : "1px solid var(--line)",
                  borderRadius: "14px",
                  padding: "14px",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: "8px",
                  boxShadow: isSelected ? "0 6px 16px rgba(0,0,0,0.08)" : "0 2px 6px rgba(0,0,0,0.02)",
                  transform: isSelected ? "translateY(-2px)" : "none",
                  transition: "all 0.16s ease",
                }}
              >
                <div>
                  <div style={{ position: "relative", width: "100%", height: "120px", borderRadius: "10px", overflow: "hidden", marginBottom: "8px" }}>
                    {story.coverImage && ![
                      'zack-black-duck.jpg',
                      'queen-green-bee.jpg',
                      'goat-yellow-boat.jpg',
                      'king-shiny-ring.jpg',
                      'rain-on-train.jpg',
                      'mark-spark-barn.jpg'
                    ].some(f => story.coverImage?.includes(f)) ? (
                      <img
                        src={story.coverImage}
                        alt={story.title}
                        style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.3s ease" }}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          background: story.headerBg,
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "10px",
                          color: "#fff",
                          textAlign: "center",
                        }}
                      >
                        <span style={{ fontSize: "38px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.25))" }}>{story.icon}</span>
                        <span style={{ fontSize: "11px", fontWeight: 800, marginTop: "4px", background: "rgba(0,0,0,0.25)", padding: "2px 8px", borderRadius: "10px" }}>
                          {story.phonicsFocus}
                        </span>
                      </div>
                    )}
                    <span
                      style={{
                        position: "absolute",
                        top: "6px",
                        right: "6px",
                        fontSize: "10px",
                        fontWeight: 800,
                        color: story.color,
                        background: "rgba(255,255,255,0.95)",
                        padding: "2px 8px",
                        borderRadius: "6px",
                        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                      }}
                    >
                      {story.targetVowel}
                    </span>
                    <span
                      style={{
                        position: "absolute",
                        bottom: "4px",
                        left: "6px",
                        fontSize: "20px",
                        filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))",
                      }}
                    >
                      {story.icon}
                    </span>
                  </div>
                  <h4 style={{ margin: "0 0 4px", fontSize: "14px", fontWeight: 800, color: "var(--ink)" }}>
                    {story.title}
                  </h4>
                  <div style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
                    {story.marathiTitle}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: "11px",
                    fontWeight: 700,
                    color: isSelected ? story.color : "var(--teal)",
                    borderTop: "1px dashed var(--line)",
                    paddingTop: "6px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{story.pages.length} Pages</span>
                  <span>{isSelected ? "📖 Reading Now" : "Read →"}</span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── ACTIVE STORY BOOK READER (The Running Story) ── */}
      <div
        className="story-book-stage"
        style={{
          background: "#fff",
          border: `2px solid ${currentStory.color}`,
          borderRadius: "20px",
          padding: isFullscreen ? "30px 36px" : "26px 30px",
          boxShadow: "0 10px 30px rgba(0,0,0,0.06)",
        }}
      >
        {/* Decodable Words Pill Bar with Fullscreen toggle launcher */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
            <span style={{ fontSize: "13px", fontWeight: 800, color: "var(--ink)" }}>
              🎯 Target Phonics Decodable Words (Click to hear sound):
            </span>
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "12px", color: "var(--muted)" }}>
                Sight Words: {currentStory.sightWords.slice(0, 6).join(", ")}...
              </span>
              {onToggleFullscreen && !isFullscreen && (
                <button
                  type="button"
                  onClick={onToggleFullscreen}
                  style={{
                    background: "var(--teal)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "5px 12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "5px",
                    boxShadow: "0 2px 6px rgba(18,59,58,0.15)",
                  }}
                  title="Focus solely on this story and questions in full screen"
                >
                  <span>⛶</span> Full Screen Story
                </button>
              )}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {currentStory.decodableWords.map((word) => (
              <button
                key={word}
                type="button"
                onClick={() => handleSoundWord(word)}
                style={{
                  background: highlightedWord === word ? currentStory.color : "#F8FAFC",
                  color: highlightedWord === word ? "#fff" : "#1E293B",
                  border: `1px solid ${highlightedWord === word ? currentStory.color : "#CBD5E1"}`,
                  padding: "5px 12px",
                  borderRadius: "16px",
                  fontSize: "14px",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.12s ease",
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span>🔊</span> {word}
              </button>
            ))}
          </div>
        </div>

        {/* Story Page Card with Full Pictorial Scene */}
        <div
          style={{
            background: currentStory.bgGradient,
            borderRadius: "16px",
            border: "1px solid rgba(0,0,0,0.06)",
            padding: isFullscreen ? "32px 28px" : "28px 24px",
            textAlign: "center",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "22px",
            minHeight: "220px",
            justifyContent: "center",
            width: "100%",
            boxSizing: "border-box",
          }}
        >
          {/* Pictorial Storybook Illustration Banner */}
          <div
            style={{
              position: "relative",
              width: "100%",
              maxWidth: isFullscreen ? "800px" : "680px",
              borderRadius: "16px",
              overflow: "hidden",
              boxShadow: "0 12px 28px rgba(0,0,0,0.12)",
              border: "4px solid #fff",
            }}
          >
            {currentPage.image ? (
              <img
                src={currentPage.image}
                alt={`${currentStory.title} - Page ${currentPageIndex + 1}`}
                style={{
                  width: "100%",
                  maxHeight: isFullscreen ? "420px" : "360px",
                  objectFit: "cover",
                  display: "block",
                  transition: "opacity 0.25s ease",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  minHeight: isFullscreen ? "320px" : "250px",
                  background: currentStory.headerBg,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "36px 20px",
                  color: "#fff",
                  gap: "14px",
                }}
              >
                <div style={{ fontSize: "68px", filter: "drop-shadow(0 6px 14px rgba(0,0,0,0.3))" }}>
                  {currentPage.illustrationIcon}
                </div>
                <div style={{ fontSize: "20px", fontWeight: 800, textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
                  {currentStory.title} • Page {currentPageIndex + 1}
                </div>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", justifyContent: "center", maxWidth: "520px" }}>
                  {currentPage.focusWords.map((fw) => (
                    <span
                      key={fw}
                      style={{
                        background: "rgba(255,255,255,0.22)",
                        backdropFilter: "blur(6px)",
                        color: "#fff",
                        padding: "5px 14px",
                        borderRadius: "16px",
                        fontSize: "14px",
                        fontWeight: 800,
                        border: "1px solid rgba(255,255,255,0.45)",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      }}
                    >
                      {fw}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div
              style={{
                position: "absolute",
                top: "12px",
                right: "12px",
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(6px)",
                color: "#fff",
                padding: "4px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              <span>{currentPage.illustrationIcon}</span>
              <span>Page {currentPageIndex + 1} of {currentStory.pages.length}</span>
            </div>
          </div>

          {/* English Story Text with robust text wrapping */}
          <div
            style={{
              fontSize: isFullscreen ? "30px" : "26px",
              fontWeight: 800,
              color: "#0F172A",
              lineHeight: 1.55,
              width: "100%",
              maxWidth: "840px",
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              whiteSpace: "normal",
              textAlign: "center",
              boxSizing: "border-box",
              padding: "0 14px",
            }}
          >
            {currentPage.text.split(" ").map((w, idx) => {
              const cleanWord = w.replace(/[^a-zA-Z]/g, "");
              const isFocus = currentPage.focusWords.some(
                (fw) => fw.toLowerCase() === cleanWord.toLowerCase()
              );
              return (
                <span
                  key={idx}
                  onClick={() => handleSoundWord(cleanWord)}
                  style={{
                    display: "inline-block",
                    color: isFocus ? currentStory.color : "#0F172A",
                    backgroundColor: isFocus ? "rgba(255,255,255,0.85)" : "transparent",
                    padding: isFocus ? "2px 8px" : "0",
                    borderRadius: "6px",
                    margin: "2px 4px",
                    cursor: "pointer",
                    textDecoration: isFocus ? "underline" : "none",
                    textDecorationThickness: "2px",
                    boxShadow: isFocus ? "0 2px 4px rgba(0,0,0,0.06)" : "none",
                    transition: "all 0.12s ease",
                  }}
                  title="Click to sound word"
                >
                  {w}
                </span>
              );
            })}
          </div>

          {/* Marathi Translation with robust text wrapping */}
          {showMarathi && (
            <div
              style={{
                fontSize: isFullscreen ? "20px" : "18px",
                fontWeight: 600,
                color: "#475569",
                background: "rgba(255,255,255,0.85)",
                padding: "10px 20px",
                borderRadius: "12px",
                width: "100%",
                maxWidth: "760px",
                wordBreak: "break-word",
                overflowWrap: "anywhere",
                whiteSpace: "normal",
                boxSizing: "border-box",
                textAlign: "center",
              }}
            >
              {currentPage.marathiText}
            </div>
          )}

          {/* Voice read prompt & settings */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <button
              type="button"
              onClick={handleReadCurrentPage}
              style={{
                background: currentStory.color,
                color: "#fff",
                border: "none",
                borderRadius: "20px",
                padding: "10px 22px",
                fontSize: "14px",
                fontWeight: 800,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <span>🔊</span> Read This Page Aloud
            </button>
            <VoiceSettingsButton />
          </div>
        </div>

        {/* Page Flipper Navigation with Keyboard Shortcuts */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "22px",
            flexWrap: "wrap",
            gap: "12px",
          }}
        >
          <button
            type="button"
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "1px solid var(--line)",
              background: currentPageIndex === 0 ? "#F1F5F9" : "#fff",
              color: currentPageIndex === 0 ? "#94A3B8" : "var(--ink)",
              fontWeight: 700,
              fontSize: "14px",
              cursor: currentPageIndex === 0 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title="Previous Page (Press Left Arrow key)"
          >
            <span>←</span> Previous Page <span style={{ fontSize: "11px", opacity: 0.65 }}>[←]</span>
          </button>

          {/* Page Indicators with Keyboard Instruction */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
              {currentStory.pages.map((p, idx) => (
                <button
                  key={p.pageNumber}
                  type="button"
                  onClick={() => setCurrentPageIndex(idx)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    border: "none",
                    background: idx === currentPageIndex ? currentStory.color : "#E2E8F0",
                    color: idx === currentPageIndex ? "#fff" : "#475569",
                    fontWeight: 800,
                    fontSize: "13px",
                    cursor: "pointer",
                    transition: "all 0.15s ease",
                    transform: idx === currentPageIndex ? "scale(1.1)" : "scale(1)",
                    boxShadow: idx === currentPageIndex ? "0 2px 8px rgba(0,0,0,0.15)" : "none",
                  }}
                >
                  {p.pageNumber}
                </button>
              ))}
            </div>
            <span style={{ fontSize: "11px", color: "var(--muted)", fontWeight: 600 }}>
              Flip pages with <strong>←</strong> and <strong>→</strong> arrow keys
            </span>
          </div>

          <button
            type="button"
            disabled={currentPageIndex === currentStory.pages.length - 1}
            onClick={() => setCurrentPageIndex((prev) => Math.min(currentStory.pages.length - 1, prev + 1))}
            style={{
              padding: "10px 20px",
              borderRadius: "10px",
              border: "none",
              background:
                currentPageIndex === currentStory.pages.length - 1 ? "#F1F5F9" : currentStory.color,
              color:
                currentPageIndex === currentStory.pages.length - 1 ? "#94A3B8" : "#fff",
              fontWeight: 800,
              fontSize: "14px",
              cursor:
                currentPageIndex === currentStory.pages.length - 1 ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
            title="Next Page (Press Right Arrow key)"
          >
            Next Page <span>→</span> <span style={{ fontSize: "11px", opacity: 0.85 }}>[→]</span>
          </button>
        </div>

        {/* Fun Fact Callout */}
        <div
          style={{
            marginTop: "22px",
            background: "#FFFBEB",
            border: "1px dashed #F59E0B",
            borderRadius: "10px",
            padding: "12px 18px",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "13px",
            color: "#92400E",
          }}
        >
          <span style={{ fontSize: "22px" }}>💡</span>
          <div>
            <strong>Phonics Tip:</strong> {currentStory.funFact}
          </div>
        </div>
      </div>

      {/* ── COMPREHENSION & PHONICS QUIZ SECTION (Running Story Questions with Bigger Text) ── */}
      <div
        className="story-quiz-section"
        style={{
          background: "#fff",
          border: "1px solid var(--line)",
          borderRadius: "16px",
          padding: isFullscreen ? "28px 34px" : "24px 28px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <h3 style={{ margin: "0 0 6px", fontSize: isFullscreen ? "24px" : "20px", fontWeight: 800, color: "var(--ink)" }}>
              🧩 Story Comprehension &amp; Phonics Check
            </h3>
            <p style={{ margin: 0, fontSize: isFullscreen ? "15px" : "13px", color: "var(--muted)" }}>
              Check your understanding of '{currentStory.title}' and test your decoding skills!
            </p>
          </div>
          <button
            type="button"
            onClick={() => onRecordPractice(chartSlug, currentStory.slug, currentStory.title)}
            style={{
              background: "var(--mint)",
              color: "var(--teal-dark)",
              border: "1px solid var(--teal)",
              borderRadius: "8px",
              padding: "10px 18px",
              fontSize: "13px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {savingChartItem === currentStory.slug ? "Saving..." : "⭐ Record Reading Practice"}
          </button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {currentStory.quiz.map((q, qIndex) => {
            const userAnswer = quizAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = quizResults[q.id];

            return (
              <div
                key={q.id}
                style={{
                  background: isAnswered ? (isCorrect ? "#F0FDF4" : "#FEF2F2") : "#F8FAFC",
                  border: isAnswered
                    ? isCorrect
                      ? "2px solid #86EFAC"
                      : "2px solid #FCA5A5"
                    : "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: isFullscreen ? "22px 24px" : "18px 20px",
                }}
              >
                {/* Large Question Header */}
                <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                  <span
                    style={{
                      background: currentStory.color,
                      color: "#fff",
                      borderRadius: "50%",
                      minWidth: "32px",
                      height: "32px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "14px",
                      fontWeight: 800,
                      marginTop: "2px",
                    }}
                  >
                    {qIndex + 1}
                  </span>
                  <strong
                    style={{
                      fontSize: isFullscreen ? "22px" : "19px",
                      color: "#1E293B",
                      lineHeight: 1.45,
                      fontWeight: 800,
                    }}
                  >
                    {q.question}
                  </strong>
                </div>

                {/* Large Options Buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", marginBottom: "10px", paddingLeft: "44px" }}>
                  {q.options.map((opt) => {
                    const isSelected = userAnswer === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => handleAnswerQuiz(q.id, opt, q.correctAnswer)}
                        style={{
                          padding: isFullscreen ? "12px 24px" : "10px 20px",
                          borderRadius: "10px",
                          fontSize: isFullscreen ? "18px" : "16px",
                          fontWeight: 700,
                          cursor: "pointer",
                          border: isSelected
                            ? opt === q.correctAnswer
                              ? "2.5px solid #16A34A"
                              : "2.5px solid #DC2626"
                            : "1.5px solid #CBD5E1",
                          background: isSelected
                            ? opt === q.correctAnswer
                              ? "#DCFCE7"
                              : "#FEE2E2"
                            : "#fff",
                          color: isSelected
                            ? opt === q.correctAnswer
                              ? "#15803D"
                              : "#B91C1C"
                            : "#1E293B",
                          boxShadow: "0 2px 6px rgba(0,0,0,0.03)",
                          transition: "all 0.12s ease",
                        }}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {/* Large Explanation & Clue Feedback */}
                {isAnswered && (
                  <div
                    style={{
                      fontSize: isFullscreen ? "16px" : "15px",
                      color: isCorrect ? "#15803D" : "#B91C1C",
                      marginTop: "10px",
                      paddingLeft: "44px",
                      display: "flex",
                      alignItems: "center",
                      gap: "8px",
                      flexWrap: "wrap",
                      fontWeight: 600,
                      lineHeight: 1.5,
                    }}
                  >
                    <span style={{ fontSize: "18px" }}>{isCorrect ? "✅ Correct!" : "❌ Not quite."}</span>
                    <span>{q.explanation}</span>
                    <span style={{ color: "var(--muted)", fontStyle: "italic", marginLeft: "4px" }}>
                      ({q.phonicsClue})
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
