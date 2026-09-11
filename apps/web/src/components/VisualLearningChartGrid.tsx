import React, { useState, useRef, useEffect } from "react";

export interface VisualChartItem {
  key: string;
  name: string;
  marathi: string;
  hindi?: string;
  icon: string;
  image?: string;
  category: string;
  sound?: string;
  benefit?: string;
  clue?: string;
  cue?: string;
  tool?: string;
  fact?: string;
  color?: string;
  audioText?: string;
}

interface VisualLearningChartGridProps {
  chartSlug: string;
  title: string;
  marathiTitle?: string;
  description: string;
  icon: string;
  items: VisualChartItem[];
  categories: { id: string; label: string; icon?: string }[];
  chartProgressRecords?: Record<string, { practiceCount: number; lastPracticedAt: string; itemName?: string }>;
  onRecordPractice: (chartSlug: string, itemKey: string, itemName?: string) => Promise<void>;
  savingChartItem: string | null;
  childName: string;
  chartType: "animals" | "vegetables" | "birds" | "emotions";
}

export default function VisualLearningChartGrid({
  chartSlug,
  title,
  marathiTitle,
  description,
  icon,
  items,
  categories,
  chartProgressRecords = {},
  onRecordPractice,
  savingChartItem,
  childName,
  chartType,
}: VisualLearningChartGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [hoveredKey, setHoveredKey] = useState<string | null>(null);
  const [selectedItemKey, setSelectedItemKey] = useState<string | null>(items[0]?.key || null);
  const [isRecitingAll, setIsRecitingAll] = useState<boolean>(false);
  const [reciteIndex, setReciteIndex] = useState<number>(-1);

  // Quiz Game Mode state
  const [quizActive, setQuizActive] = useState<boolean>(false);
  const [quizTarget, setQuizTarget] = useState<VisualChartItem | null>(null);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState<number>(0);

  // Daily Mood check-in for emotions
  const [dailyMoodKey, setDailyMoodKey] = useState<string | null>(() => {
    return localStorage.getItem(`smartstudy-daily-mood-${childName}`) || null;
  });

  const hoverTimerRef = useRef<any>(null);
  const reciteTimerRef = useRef<any>(null);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current);
      if (reciteTimerRef.current) clearTimeout(reciteTimerRef.current);
      if ("speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSearch =
      !searchTerm ||
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.marathi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.hindi && item.hindi.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  // Active item for spotlight
  const activeItem = items.find((i) => i.key === (hoveredKey || selectedItemKey)) || items[0];

  // Speech Helper
  const speak = (phrase: string, isClick = false) => {
    if (!("speechSynthesis" in window)) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.rate = 0.94;
      utterance.pitch = 1.05;

      const voices = window.speechSynthesis.getVoices();
      const preferred =
        voices.find((v) => v.lang === "en-IN" || v.lang.startsWith("en-IN")) ||
        voices.find((v) => /female|samantha|zira|karen|victoria|google us english|microsoft.*female/i.test(`${v.name}`));
      if (preferred) utterance.voice = preferred;

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis error:", err);
    }
  };

  // Hover Handler: highlights card visually without audio call-out
  const handleItemHover = (item: VisualChartItem) => {
    setHoveredKey(item.key);
  };

  const handleItemLeave = () => {
    setHoveredKey(null);
  };

  // Click handler (speaks details and records practice)
  const handleItemClick = (item: VisualChartItem) => {
    setSelectedItemKey(item.key);

    // If quiz is active, check answer
    if (quizActive && quizTarget) {
      if (item.key === quizTarget.key) {
        setQuizScore((prev) => prev + 1);
        setQuizFeedback(`🎉 Bravo! That is ${item.name}! ${item.marathi}`);
        speak(`Awesome! That is ${item.name}! ${item.marathi}`);
        onRecordPractice(chartSlug, item.key, item.name);
        setTimeout(() => {
          pickRandomQuizTarget(items);
        }, 1800);
      } else {
        setQuizFeedback(`Try again! That is ${item.name}. Look for ${quizTarget.name} (${quizTarget.marathi.split("(")[0]}).`);
        speak(`That is ${item.name}. Can you find ${quizTarget.name}?`);
      }
      return;
    }

    // Normal practice click
    let detailSpeech = `${item.name}. ${item.marathi}.`;
    if (item.sound) detailSpeech += ` Says: ${item.sound}.`;
    if (item.benefit) detailSpeech += ` Health benefit: ${item.benefit}`;
    if (item.tool) detailSpeech += ` Feel better tip: ${item.tool}`;
    if (item.fact) detailSpeech += ` Fun fact: ${item.fact}`;

    speak(detailSpeech, true);
    onRecordPractice(chartSlug, item.key, item.name);
  };

  // Quiz game generator
  const startQuiz = () => {
    setQuizActive(true);
    setQuizScore(0);
    pickRandomQuizTarget(items);
  };

  const stopQuiz = () => {
    setQuizActive(false);
    setQuizTarget(null);
    setQuizFeedback(null);
  };

  const pickRandomQuizTarget = (list: VisualChartItem[]) => {
    if (!list || list.length === 0) return;
    const random = list[Math.floor(Math.random() * list.length)];
    setQuizTarget(random);
    setQuizFeedback(null);
    const cleanMarathi = random.marathi.split("(")[0].trim();
    const prompt = `Can you find the ${random.name}? ${cleanMarathi ? `शोध: ${cleanMarathi}` : ""}`;
    speak(prompt);
  };

  // Recite All Mode
  const startReciteAll = () => {
    if (isRecitingAll) {
      setIsRecitingAll(false);
      setReciteIndex(-1);
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
      return;
    }

    setIsRecitingAll(true);
    let idx = 0;
    setReciteIndex(0);

    const speakNext = (index: number) => {
      if (index >= filteredItems.length) {
        setIsRecitingAll(false);
        setReciteIndex(-1);
        speak(`All done! Great job learning ${title}!`);
        return;
      }
      const itm = filteredItems[index];
      setSelectedItemKey(itm.key);
      setReciteIndex(index);

      const phrase = `${itm.name}! ${itm.marathi.split("(")[0].trim()}`;
      speak(phrase);

      reciteTimerRef.current = setTimeout(() => {
        speakNext(index + 1);
      }, 1900);
    };

    speakNext(0);
  };

  // Mood selection for emotions
  const handleMoodSelect = (item: VisualChartItem) => {
    setDailyMoodKey(item.key);
    localStorage.setItem(`smartstudy-daily-mood-${childName}`, item.key);
    onRecordPractice(chartSlug, item.key, item.name);
    const msg = `Today I feel ${item.name}! ${item.tool || item.cue || ""}`;
    speak(`You are feeling ${item.name} today. ${item.tool || ""}`);
  };

  return (
    <div className="visual-chart-wrapper">
      {/* Chart Hero Header */}
      <div className="visual-chart-header">
        <div className="visual-chart-title-row">
          <div className="visual-chart-badge">{icon}</div>
          <div>
            <h2 className="visual-chart-title">
              {title} {marathiTitle && <span className="visual-chart-marathi-tag">{marathiTitle}</span>}
            </h2>
            <p className="visual-chart-desc">{description}</p>
          </div>
        </div>

        {/* Action Controls Bar */}
        <div className="visual-chart-actions">
          <div className="chart-cue-badge" title="Click any picture card to hear its name spoken aloud">
            <span>🔊</span>
            <span>Click any item to hear name</span>
          </div>

          <button
            className={`chart-action-btn ${isRecitingAll ? "active reciting" : ""}`}
            onClick={startReciteAll}
            title="Listen to all items sequentially"
          >
            <span>{isRecitingAll ? "⏹️" : "▶️"}</span>
            <span>{isRecitingAll ? "Stop Reciting" : "Recite All"}</span>
          </button>

          <button
            className={`chart-action-btn quiz-btn ${quizActive ? "active" : ""}`}
            onClick={() => (quizActive ? stopQuiz() : startQuiz())}
            title="Interactive find-and-tap challenge"
          >
            <span>🎯</span>
            <span>{quizActive ? "Exit Quiz" : "Quiz Game"}</span>
          </button>
        </div>
      </div>

      {/* Interactive Quiz Mode Banner */}
      {quizActive && quizTarget && (
        <div className="chart-quiz-banner">
          <div className="quiz-banner-content">
            <span className="quiz-target-icon">🎯</span>
            <div>
              <div className="quiz-prompt">
                Can you find the: <strong>{quizTarget.name}</strong> ({quizTarget.marathi})?
              </div>
              <small className="quiz-hint">Click on the correct picture card below!</small>
            </div>
          </div>
          <div className="quiz-banner-actions">
            <div className="quiz-score-pill">⭐ Score: <strong>{quizScore}</strong></div>
            <button className="quiz-skip-btn" onClick={() => pickRandomQuizTarget(items)}>
              Skip ⏭️
            </button>
          </div>
          {quizFeedback && <div className="quiz-feedback-banner">{quizFeedback}</div>}
        </div>
      )}

      {/* Special Emotion Daily Mood Check-In Bar */}
      {chartType === "emotions" && (
        <div className="daily-mood-container">
          <div className="daily-mood-header">
            <span style={{ fontSize: "22px" }}>🌈</span>
            <div>
              <strong>Daily Feelings Check-in:</strong> How are you feeling right now, {childName}?
            </div>
            {dailyMoodKey && (
              <span className="daily-mood-badge">
                Selected: {items.find((i) => i.key === dailyMoodKey)?.icon}{" "}
                {items.find((i) => i.key === dailyMoodKey)?.name}
              </span>
            )}
          </div>
          <div className="daily-mood-pills">
            {items.map((emo) => {
              const isSelected = dailyMoodKey === emo.key;
              return (
                <button
                  key={`mood-${emo.key}`}
                  className={`mood-chip ${isSelected ? "selected" : ""}`}
                  onClick={() => handleMoodSelect(emo)}
                  style={{ borderColor: isSelected ? emo.color || "#f59e0b" : undefined }}
                >
                  <span className="mood-chip-icon">{emo.icon}</span>
                  <span className="mood-chip-name">{emo.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Pills & Search Filter */}
      <div className="visual-chart-filter-bar">
        <div className="category-pills" role="tablist" aria-label="Categories">
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={`cat-pill ${selectedCategory === cat.id ? "active" : ""}`}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon && <span style={{ marginRight: "4px" }}>{cat.icon}</span>}
              {cat.label}
            </button>
          ))}
        </div>

        <div className="chart-search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder={`Search ${title.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="chart-search-input"
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm("")}>
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Grid of Picture Cards with Name Below */}
      <div className="chart-card-grid">
        {filteredItems.map((item, idx) => {
          const isHovered = hoveredKey === item.key;
          const isSelected = selectedItemKey === item.key;
          const isReciting = isRecitingAll && reciteIndex === idx;
          const practiceData = chartProgressRecords[item.key];
          const practiceCount = practiceData?.practiceCount || 0;
          const isSaving = savingChartItem === item.key;

          return (
            <div
              key={item.key}
              className={`visual-card ${isHovered ? "hovered" : ""} ${isSelected ? "selected" : ""} ${
                isReciting ? "reciting-card" : ""
              }`}
              onMouseEnter={() => handleItemHover(item)}
              onMouseLeave={handleItemLeave}
              onClick={() => handleItemClick(item)}
              role="button"
              tabIndex={0}
              aria-label={`${item.name}, ${item.marathi}. Click to hear pronunciation.`}
            >
              {/* Practice Counter Badge */}
              {practiceCount > 0 && (
                <div className="card-practice-pill" title={`Practiced ${practiceCount} times`}>
                  ✓ {practiceCount}
                </div>
              )}

              {/* Category / Sound Chip */}
              {item.sound && (
                <div className="card-top-chip sound-chip" title="Animal / bird sound">
                  🔊 {item.sound.split("(")[0]}
                </div>
              )}
              {chartType === "vegetables" && item.category && (
                <div className="card-top-chip veg-chip">
                  {item.category === "root" ? "🥕 Root" : item.category === "leafy" ? "🥬 Leafy" : "🍅 Fresh"}
                </div>
              )}
              {chartType === "emotions" && item.color && (
                <div className="card-top-chip emotion-chip" style={{ backgroundColor: `${item.color}22`, color: item.color }}>
                  ● {item.name}
                </div>
              )}

              {/* 1. Large Picture of the Item (Realistic Photo with Emoji Fallback) */}
              <div className="card-picture-stage">
                {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="card-realistic-photo"
                    loading="lazy"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.display = "none";
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.style.display = "flex";
                    }}
                  />
                ) : null}
                <span
                  className="card-emoji-illustration"
                  style={{ display: item.image ? "none" : "flex" }}
                >
                  {item.icon}
                </span>
                {isHovered && <div className="card-picture-halo" />}
              </div>

              {/* 2. Name Directly Below the Picture */}
              <div className="card-name-box">
                <div className="card-primary-name">{item.name}</div>
                <div className="card-marathi-name">{item.marathi}</div>
                {item.hindi && <div className="card-hindi-name">{item.hindi}</div>}
              </div>

              {/* 3. Audio Speaker Icon Call-Out Cue */}
              <div className="card-hover-audio-cue">
                <span>{isSaving ? "⏳" : "🔊"}</span>
                <small>{isSelected ? "Speaking..." : "Click to Hear"}</small>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="chart-empty-state">
          <span style={{ fontSize: "36px" }}>🔍</span>
          <p>No items match "{searchTerm}". Try a different search term or category!</p>
          <button className="cat-pill active" onClick={() => { setSearchTerm(""); setSelectedCategory("all"); }}>
            Clear Filters
          </button>
        </div>
      )}

      {/* Spotlight Info Card at the Bottom */}
      {activeItem && (
        <div className="chart-spotlight-card" style={{ borderColor: activeItem.color || "var(--teal)" }}>
          <div className="spotlight-left">
            {activeItem.image ? (
              <img
                src={activeItem.image}
                alt={activeItem.name}
                className="spotlight-photo"
                onError={(e) => {
                  (e.currentTarget as HTMLElement).style.display = "none";
                  const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                  if (fallback) fallback.style.display = "flex";
                }}
              />
            ) : null}
            <span
              className="spotlight-icon"
              style={{ display: activeItem.image ? "none" : "flex" }}
            >
              {activeItem.icon}
            </span>
            <div>
              <div className="spotlight-title-row">
                <h3 className="spotlight-name">{activeItem.name}</h3>
                <span className="spotlight-marathi">{activeItem.marathi}</span>
                {activeItem.hindi && <span className="spotlight-hindi">({activeItem.hindi})</span>}
              </div>
              <p className="spotlight-desc">
                {activeItem.fact || activeItem.benefit || activeItem.cue || activeItem.tool || activeItem.clue || ""}
              </p>
            </div>
          </div>

          <div className="spotlight-actions">
            <button
              className="spotlight-speak-btn"
              onClick={() => {
                const phrase = `${activeItem.name}! ${activeItem.marathi}. ${
                  activeItem.sound || activeItem.fact || activeItem.benefit || activeItem.tool || ""
                }`;
                speak(phrase, true);
                onRecordPractice(chartSlug, activeItem.key, activeItem.name);
              }}
            >
              <span>🔊</span>
              <span>Say Again</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
