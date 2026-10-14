// SmartStudy TV — Poems & Nursery Rhymes Chart Screen
// Full 10-foot interactive poem reader with D-pad grid navigation,
// line-by-line reading, karaoke recitation, rhyming pairs, and vocabulary explorer.

import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../../components/FocusTile';
import { TVScrollView, TVScrollSection } from '../../components/TVScrollView';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { tvFocusManager } from '../../utils/tvFocusManager';
import { useTVSpeech } from '../../hooks/useTVSpeech';
import {
  DEFAULT_POEMS,
  POEM_CATEGORIES,
  PoemItem,
  PoemLine,
} from '../../data/poemsData';

interface PoemsChartViewProps {
  childId: string;
  onBack: () => void;
}

export function PoemsChartView({ childId, onBack }: PoemsChartViewProps) {
  const { talkEnabled, toggleTalk, speak, stop } = useTVSpeech();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedPoemId, setSelectedPoemId] = useState<string>('see_me_skip');
  const [showMarathi, setShowMarathi] = useState<boolean>(true);
  const [activeLineIdx, setActiveLineIdx] = useState<number | null>(null);
  const [isReciting, setIsReciting] = useState<boolean>(false);

  const reciteTimerRef = useRef<any>(null);
  const isRecitingRef = useRef<boolean>(false);

  const filteredPoems =
    selectedCategory === 'all'
      ? DEFAULT_POEMS
      : DEFAULT_POEMS.filter((p) => p.category === selectedCategory);

  const currentPoem: PoemItem =
    DEFAULT_POEMS.find((p) => p.id === selectedPoemId) || DEFAULT_POEMS[0];

  // Flattened lines for linear navigation & recitation
  const allLines: Array<PoemLine & { stanzaNum: number; globalIdx: number }> =
    currentPoem.stanzas.flatMap((stanza) =>
      stanza.lines.map((line) => ({
        ...line,
        stanzaNum: stanza.stanzaNumber,
        globalIdx: 0,
      })),
    ).map((line, idx) => ({ ...line, globalIdx: idx }));

  // Hardware Back Handler
  useEffect(() => {
    const unregister = tvFocusManager.registerBackHandler(() => {
      stopRecitation();
      onBack();
      return true;
    });
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      stopRecitation();
      onBack();
      return true;
    });
    return () => {
      unregister();
      sub.remove();
      stopRecitation();
    };
  }, [onBack]);

  const stopRecitation = () => {
    isRecitingRef.current = false;
    setIsReciting(false);
    setActiveLineIdx(null);
    if (reciteTimerRef.current) {
      clearTimeout(reciteTimerRef.current);
      reciteTimerRef.current = null;
    }
    stop();
  };

  // Register TV Focus Grid
  useEffect(() => {
    // Row 0: Category tabs (e.g. cat-0 to cat-5)
    const catRow = POEM_CATEGORIES.map((_, i) => `cat-${i}`);

    // Row 1: Poem selection pills (e.g. poem-0 to poem-N)
    const poemRow = filteredPoems.slice(0, 8).map((_, i) => `p-pill-${i}`);

    // Row 2: Action buttons (Recite, Translation Toggle, Voice Toggle)
    const actionRow = ['btn-recite-toggle', 'btn-trans-toggle', 'btn-toggle-voice'];

    // Row 3..N: Poem Lines
    const lineRows = allLines.map((_, i) => [`line-${i}`]);

    // Rhyming pairs & vocab rows
    const rhymeRow = currentPoem.rhymingPairs.slice(0, 4).map((_, i) => `rhyme-${i}`);
    const vocabRow = currentPoem.vocabulary.slice(0, 4).map((_, i) => `vocab-${i}`);

    const grid = [
      catRow,
      poemRow.length > 0 ? poemRow : ['p-pill-0'],
      actionRow,
      ...lineRows,
      ...(rhymeRow.length > 0 ? [rhymeRow] : []),
      ...(vocabRow.length > 0 ? [vocabRow] : []),
    ];

    tvFocusManager.register({ type: 'grid', grid }, 'line-0');
  }, [selectedCategory, selectedPoemId, filteredPoems.length, allLines.length]);

  const handleSelectCategory = (catId: string, idx: number) => {
    stopRecitation();
    setSelectedCategory(catId);
    const newFiltered =
      catId === 'all'
        ? DEFAULT_POEMS
        : DEFAULT_POEMS.filter((p) => p.category === catId);
    if (newFiltered[0]) {
      setSelectedPoemId(newFiltered[0].id);
    }
  };

  const handleSelectPoem = (poem: PoemItem) => {
    stopRecitation();
    setSelectedPoemId(poem.id);
    speak(`${poem.title}. ${poem.marathiTitle || ''}`);
  };

  const handleReadLine = (line: PoemLine, idx: number) => {
    stopRecitation();
    setActiveLineIdx(idx);
    const textToSpeak = line.text;
    speak(textToSpeak);
  };

  const toggleRecitation = () => {
    if (isReciting) {
      stopRecitation();
      return;
    }

    isRecitingRef.current = true;
    setIsReciting(true);

    let currentIdx = 0;
    const playNextLine = () => {
      if (!isRecitingRef.current || currentIdx >= allLines.length) {
        setIsReciting(false);
        setActiveLineIdx(null);
        isRecitingRef.current = false;
        speak(`Great job! You finished reading ${currentPoem.title}!`, true);
        return;
      }

      const l = allLines[currentIdx];
      setActiveLineIdx(currentIdx);
      speak(l.text, true);

      currentIdx++;
      // Wait ~2.8s per line for speech to finish before next line
      reciteTimerRef.current = setTimeout(playNextLine, 2800);
    };

    playNextLine();
  };

  const handleRhymePress = (pair: string[], tip?: string) => {
    speak(`${pair.join(' and ')}. ${tip || ''}`);
  };

  const handleVocabPress = (word: string, marathi: string, meaning: string) => {
    speak(`${word}. In Marathi: ${marathi}. Meaning: ${meaning}`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── TOP BAR (HEADER & CATEGORIES) ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{currentPoem.icon}</Text>
          <View>
            <Text style={typography.title}>
              {currentPoem.title}{' '}
              <Text style={{ color: colors.gold, fontSize: 20 }}>
                {currentPoem.badge ? `• ${currentPoem.badge}` : ''}
              </Text>
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {currentPoem.marathiTitle} • {currentPoem.author}
            </Text>
          </View>
        </View>

        {/* Action Controls */}
        <View style={styles.headerControls}>
          <FocusTile
            focusKey="btn-recite-toggle"
            onPress={toggleRecitation}
            style={[
              styles.actionBtn,
              isReciting && { backgroundColor: colors.gold, borderColor: '#FFF' },
            ]}
          >
            <Text
              style={[
                typography.caption,
                { color: isReciting ? '#000' : colors.text, fontWeight: '700' },
              ]}
            >
              {isReciting ? '⏹️ Stop Reciting' : '▶️ Recite Whole Poem'}
            </Text>
          </FocusTile>

          <FocusTile
            focusKey="btn-trans-toggle"
            onPress={() => setShowMarathi(!showMarathi)}
            style={[styles.actionBtn, showMarathi && styles.actionBtnActive]}
          >
            <Text style={[typography.caption, { color: colors.text, fontWeight: '700' }]}>
              {showMarathi ? '🕉️ Marathi: ON' : '🕉️ Marathi: OFF'}
            </Text>
          </FocusTile>

          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[styles.actionBtn, talkEnabled && styles.actionBtnActive]}
          >
            <Text
              style={[
                typography.caption,
                { color: talkEnabled ? colors.gold : colors.textMuted, fontWeight: '700' },
              ]}
            >
              {talkEnabled ? '🔊 Voice: ON' : '🔇 Voice: OFF'}
            </Text>
          </FocusTile>
        </View>
      </View>

      {/* ── CATEGORY TABS ── */}
      <View style={styles.categoryRow}>
        {POEM_CATEGORIES.map((cat, i) => (
          <FocusTile
            key={cat.id}
            focusKey={`cat-${i}`}
            onPress={() => handleSelectCategory(cat.id, i)}
            style={[
              styles.categoryTab,
              selectedCategory === cat.id && styles.categoryTabActive,
            ]}
          >
            <Text
              style={[
                typography.caption,
                {
                  color: selectedCategory === cat.id ? colors.gold : colors.textMuted,
                  fontWeight: selectedCategory === cat.id ? '700' : '500',
                },
              ]}
            >
              {cat.icon} {cat.label.split(' (')[0]}
            </Text>
          </FocusTile>
        ))}
      </View>

      {/* ── POEM SELECTOR PILLS ── */}
      <View style={styles.poemPillRow}>
        {filteredPoems.slice(0, 8).map((p, i) => (
          <FocusTile
            key={p.id}
            focusKey={`p-pill-${i}`}
            onPress={() => handleSelectPoem(p)}
            style={[
              styles.poemPill,
              selectedPoemId === p.id && { backgroundColor: p.color, borderColor: colors.gold },
            ]}
          >
            <Text style={styles.poemPillIcon}>{p.icon}</Text>
            <Text
              style={[
                typography.caption,
                { color: colors.text, fontWeight: selectedPoemId === p.id ? '700' : '500' },
              ]}
              numberOfLines={1}
            >
              {p.title}
            </Text>
          </FocusTile>
        ))}
      </View>

      {/* ── MAIN CONTENT (LEFT: STANZAS, RIGHT: SPOTLIGHT / RHYMES / VOCAB) ── */}
      <View style={styles.content}>
        {/* Left Stanzas / Lines List */}
        <TVScrollView
          style={styles.stanzasScroll}
          contentContainerStyle={styles.stanzasContainer}
          showsVerticalScrollIndicator={false}
        >
          {currentPoem.stanzas.map((stanza) => (
            <TVScrollSection key={`stanza-${stanza.stanzaNumber}`} style={styles.stanzaCard}>
              <View style={styles.stanzaHeader}>
                <Text style={[typography.tiny, { color: colors.gold, fontWeight: '700' }]}>
                  STANZA {stanza.stanzaNumber}
                </Text>
              </View>

              {stanza.lines.map((line) => {
                const globalIdx = allLines.findIndex((l) => l.text === line.text);
                const isActive = activeLineIdx === globalIdx;

                return (
                  <FocusTile
                    key={`line-${globalIdx}`}
                    focusKey={`line-${globalIdx}`}
                    onPress={() => handleReadLine(line, globalIdx)}
                    style={[styles.lineCard, isActive && styles.lineCardActive]}
                  >
                    <View style={styles.lineRow}>
                      <Text style={styles.actionIcon}>{line.actionIcon || '🎶'}</Text>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            typography.title,
                            {
                              color: isActive ? colors.gold : colors.text,
                              fontSize: 22,
                              fontWeight: '700',
                            },
                          ]}
                        >
                          {line.text}
                        </Text>
                        {showMarathi && line.marathi ? (
                          <Text
                            style={[
                              typography.body,
                              { color: colors.textMuted, marginTop: 2 },
                            ]}
                          >
                            {line.marathi}
                          </Text>
                        ) : null}
                      </View>
                      <Text style={styles.speakerIcon}>🔊</Text>
                    </View>
                  </FocusTile>
                );
              })}
            </TVScrollSection>
          ))}
        </TVScrollView>

        {/* Right Pane: Rhyming Pairs & Vocabulary */}
        <TVScrollView
          style={styles.sideScroll}
          contentContainerStyle={styles.sideContainer}
          showsVerticalScrollIndicator={false}
        >
          {/* Rhyming Pairs Card */}
          {currentPoem.rhymingPairs && currentPoem.rhymingPairs.length > 0 && (
            <View style={styles.spotlightSection}>
              <Text style={[typography.caption, { color: colors.gold, fontWeight: '700' }]}>
                🎯 RHYMING WORDS
              </Text>
              <View style={styles.rhymeGrid}>
                {currentPoem.rhymingPairs.map((rp, i) => (
                  <FocusTile
                    key={`rhyme-${i}`}
                    focusKey={`rhyme-${i}`}
                    onPress={() => handleRhymePress(rp.pair, rp.marathiTip)}
                    style={styles.rhymePill}
                  >
                    <Text style={[typography.caption, { color: colors.text, fontWeight: '700' }]}>
                      {rp.pair.join(' ↔ ')}
                    </Text>
                    {rp.sound && (
                      <Text style={[typography.tiny, { color: colors.focusBorder }]}>
                        {rp.sound}
                      </Text>
                    )}
                  </FocusTile>
                ))}
              </View>
            </View>
          )}

          {/* Vocabulary Card */}
          {currentPoem.vocabulary && currentPoem.vocabulary.length > 0 && (
            <View style={styles.spotlightSection}>
              <Text style={[typography.caption, { color: colors.focusBorder, fontWeight: '700' }]}>
                📖 VOCABULARY WORDS
              </Text>
              <View style={styles.vocabGrid}>
                {currentPoem.vocabulary.map((v, i) => (
                  <FocusTile
                    key={`vocab-${i}`}
                    focusKey={`vocab-${i}`}
                    onPress={() => handleVocabPress(v.word, v.marathi, v.meaning)}
                    style={styles.vocabCard}
                  >
                    <Text style={styles.vocabIcon}>{v.icon}</Text>
                    <Text style={[typography.caption, { color: colors.text, fontWeight: '700' }]}>
                      {v.word}
                    </Text>
                    <Text style={[typography.tiny, { color: colors.correct }]}>
                      {v.marathi}
                    </Text>
                  </FocusTile>
                ))}
              </View>
            </View>
          )}

          {/* Fun Fact Card */}
          {currentPoem.funFact && (
            <View style={styles.funFactBox}>
              <Text style={[typography.caption, { color: colors.gold, fontWeight: '700' }]}>
                💡 DID YOU KNOW?
              </Text>
              <Text style={[typography.tiny, { color: colors.text, marginTop: 4 }]}>
                {currentPoem.funFact}
              </Text>
            </View>
          )}
        </TVScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.safeH,
    paddingTop: spacing.safeV,
    paddingBottom: spacing.xs,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  headerIcon: {
    fontSize: 44,
    lineHeight: 52,
  },
  headerControls: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'center',
  },
  actionBtn: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  actionBtnActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  categoryRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.sm,
    paddingVertical: 4,
  },
  categoryTab: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: spacing.radiusSm,
  },
  categoryTabActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.3)',
    borderColor: colors.gold,
  },
  poemPillRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.sm,
    paddingVertical: 4,
  },
  poemPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: 6,
    borderRadius: spacing.radiusMd,
    gap: 6,
  },
  poemPillIcon: {
    fontSize: 18,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.sm,
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  stanzasScroll: {
    flex: 1.8,
  },
  stanzasContainer: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  stanzaCard: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
  },
  stanzaHeader: {
    marginBottom: 4,
  },
  lineCard: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusSm,
  },
  lineCardActive: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(124, 58, 237, 0.35)',
  },
  lineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  actionIcon: {
    fontSize: 24,
  },
  speakerIcon: {
    fontSize: 18,
    opacity: 0.6,
  },
  sideScroll: {
    flex: 1.2,
  },
  sideContainer: {
    gap: spacing.md,
    paddingBottom: spacing.lg,
  },
  spotlightSection: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusMd,
    padding: spacing.md,
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  rhymeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  rhymePill: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  vocabGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
  },
  vocabCard: {
    width: '48%',
    backgroundColor: colors.surfaceCard,
    padding: spacing.xs,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
    gap: 2,
  },
  vocabIcon: {
    fontSize: 24,
  },
  funFactBox: {
    backgroundColor: 'rgba(255, 183, 3, 0.12)',
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 3, 0.25)',
  },
});
