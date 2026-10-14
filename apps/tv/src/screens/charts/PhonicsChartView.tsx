// SmartStudy TV — Phonics & CVC Word Families Learning Chart
// Prioritized, interactive 10-foot phonics lab with D-pad navigation,
// phonetic blending (c + at -> cat / क + ॲट -> कॅट), vowel tabs, and live spotlight.

import React, { useEffect, useState } from 'react';
import {
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../../components/FocusTile';
import { TVScrollView } from '../../components/TVScrollView';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { tvFocusManager } from '../../utils/tvFocusManager';
import { useTVSpeech } from '../../hooks/useTVSpeech';
import {
  PHONICS_DATA,
  ONSET_PHONIC_SOUNDS,
  ONSET_MARATHI_SOUNDS,
  RIME_MARATHI_SOUNDS,
  VOWEL_PHONIC_GUIDE,
  PhonicsVowelGroup,
  PhonicsFamily,
  PhonicsWord,
} from '../../data/phonicsData';

interface PhonicsChartViewProps {
  childId: string;
  onBack: () => void;
}

export function PhonicsChartView({ childId, onBack }: PhonicsChartViewProps) {
  const { talkEnabled, toggleTalk, speak } = useTVSpeech();
  const [selectedVowelIdx, setSelectedVowelIdx] = useState<number>(0);
  const [selectedFamilyIdx, setSelectedFamilyIdx] = useState<number>(0);
  const [blendingMode, setBlendingMode] = useState<boolean>(true);

  const currentVowelGroup: PhonicsVowelGroup = PHONICS_DATA[selectedVowelIdx] || PHONICS_DATA[0];
  const families: PhonicsFamily[] = currentVowelGroup.families || [];
  const currentFamily: PhonicsFamily = families[selectedFamilyIdx] || families[0];
  const words: PhonicsWord[] = currentFamily ? currentFamily.words : [];

  const [selectedWord, setSelectedWord] = useState<PhonicsWord | null>(words[0] || null);

  const vowelGuide = VOWEL_PHONIC_GUIDE[currentVowelGroup.vowel];

  // Hardware Back Handler
  useEffect(() => {
    const unregister = tvFocusManager.registerBackHandler(() => {
      onBack();
      return true;
    });
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => {
      unregister();
      sub.remove();
    };
  }, [onBack]);

  // Update selected word when family or vowel changes
  useEffect(() => {
    if (words[0]) {
      setSelectedWord(words[0]);
    }
  }, [selectedVowelIdx, selectedFamilyIdx]);

  // Auto-update spotlight panel on D-pad focus
  useEffect(() => {
    const unsub = tvFocusManager.subscribe((key) => {
      if (key && key.startsWith('word-')) {
        const idx = parseInt(key.replace('word-', ''), 10);
        if (!isNaN(idx) && words[idx]) {
          setSelectedWord(words[idx]);
        }
      }
    });
    return () => unsub();
  }, [words]);

  // Register D-Pad Navigation Grid
  useEffect(() => {
    // Row 0: Top controls (Voice Toggle, Blending Toggle)
    const topRow = ['btn-toggle-voice', 'btn-blending-toggle'];

    // Row 1: Vowel Tabs (5 tabs: v-0 to v-4)
    const vowelRow = PHONICS_DATA.map((_, i) => `v-${i}`);

    // Row 2: Family Tabs (fam-0 to fam-N)
    const famRow = families.map((_, i) => `fam-${i}`);

    // Row 3..N: Word Cards in 2 columns
    const cols = 2;
    const wordGrid: string[][] = [];
    for (let i = 0; i < words.length; i += cols) {
      wordGrid.push(words.slice(i, i + cols).map((_, idx) => `word-${i + idx}`));
    }

    const grid = [topRow, vowelRow, famRow, ...wordGrid];
    tvFocusManager.register({ type: 'grid', grid }, 'word-0');
  }, [selectedVowelIdx, selectedFamilyIdx, words.length]);

  const handleSelectVowel = (idx: number) => {
    setSelectedVowelIdx(idx);
    setSelectedFamilyIdx(0);
    const vGroup = PHONICS_DATA[idx];
    speak(vGroup.phonicSpeech || `Short vowel ${vGroup.vowel}`);
  };

  const handleSelectFamily = (idx: number) => {
    setSelectedFamilyIdx(idx);
    const fam = families[idx];
    speak(fam.familySpeech || `The ${fam.family} family`);
  };

  const handleWordPress = (word: PhonicsWord) => {
    setSelectedWord(word);
    if (blendingMode) {
      speak(word.blendSpeech || `${word.onset}, ${word.rime}, ${word.word}`);
    } else {
      speak(word.wordSpeech || word.word);
    }
  };

  const getOnsetSound = (onset: string) => ONSET_PHONIC_SOUNDS[onset] || onset;
  const getOnsetMarathi = (onset: string) => ONSET_MARATHI_SOUNDS[onset] || onset;
  const getRimeMarathi = (rime: string) => RIME_MARATHI_SOUNDS[rime] || rime;

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── TOP HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>🗣️</Text>
          <View>
            <Text style={typography.title}>Phonics & CVC Word Families</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {currentVowelGroup.title.toUpperCase()} {currentVowelGroup.ipa} • {currentVowelGroup.marathiSound}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm }}>
          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[styles.toggleBtn, talkEnabled && styles.toggleBtnActive]}
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

          <FocusTile
            focusKey="btn-blending-toggle"
            onPress={() => setBlendingMode(!blendingMode)}
            style={[styles.toggleBtn, blendingMode && styles.toggleBtnActive]}
          >
            <Text style={[typography.caption, { color: colors.text, fontWeight: '700' }]}>
              {blendingMode ? '🔊 Blending: ON' : '📖 Whole Word'}
            </Text>
          </FocusTile>
        </View>
      </View>

      {/* ── VOWEL SELECTOR TABS ── */}
      <View style={styles.vowelRow}>
        {PHONICS_DATA.map((vg, i) => (
          <FocusTile
            key={vg.id}
            focusKey={`v-${i}`}
            onPress={() => handleSelectVowel(i)}
            style={[
              styles.vowelTab,
              selectedVowelIdx === i && { backgroundColor: vg.color, borderColor: colors.gold },
            ]}
          >
            <Text style={[typography.heading, { color: colors.text }]}>
              {vg.vowel.toUpperCase()} {vg.ipa}
            </Text>
            <Text style={[typography.tiny, { color: colors.textDim }]}>
              {vg.marathiSound}
            </Text>
          </FocusTile>
        ))}
      </View>

      {/* ── WORD FAMILY PILLS ── */}
      <View style={styles.familyRow}>
        {families.map((fam, i) => (
          <FocusTile
            key={fam.family}
            focusKey={`fam-${i}`}
            onPress={() => handleSelectFamily(i)}
            style={[
              styles.familyPill,
              selectedFamilyIdx === i && styles.familyPillActive,
            ]}
          >
            <Text
              style={[
                typography.heading,
                { color: selectedFamilyIdx === i ? colors.gold : colors.text },
              ]}
            >
              {fam.family}
            </Text>
          </FocusTile>
        ))}
      </View>

      {/* ── MAIN CONTENT (GRID + SPOTLIGHT) ── */}
      <View style={styles.content}>
        {/* Left CVC Word Grid */}
        <TVScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.wordsGrid}
          showsVerticalScrollIndicator={false}
        >
          {words.map((w, idx) => (
            <FocusTile
              key={w.key}
              focusKey={`word-${idx}`}
              onPress={() => handleWordPress(w)}
              style={[
                styles.wordCard,
                selectedWord?.key === w.key && styles.wordCardActive,
              ]}
            >
              <View style={styles.wordTitleRow}>
                <Text style={[styles.wordOnset, { color: currentVowelGroup.color }]}>
                  {w.onset}
                </Text>
                <Text style={styles.wordRime}>{w.rime}</Text>
              </View>
              {w.marathi && (
                <Text style={[typography.caption, { color: colors.textMuted }]} numberOfLines={1}>
                  {w.marathi}
                </Text>
              )}
            </FocusTile>
          ))}
        </TVScrollView>

        {/* Right Phonics Lab Spotlight */}
        {selectedWord && (
          <View style={styles.spotlight}>
            <View style={styles.spotlightHeader}>
              <Text style={[typography.caption, { color: colors.gold, fontWeight: '700' }]}>
                ✨ PHONICS SPOTLIGHT
              </Text>
            </View>

            {/* Big CVC Word Breakdown */}
            <View style={styles.bigWordBox}>
              <Text style={[styles.bigOnset, { color: currentVowelGroup.color }]}>
                {selectedWord.onset}
              </Text>
              <Text style={styles.plusSign}>+</Text>
              <Text style={styles.bigRime}>{selectedWord.rime}</Text>
              <Text style={styles.equalsSign}>=</Text>
              <Text style={styles.bigWord}>{selectedWord.word}</Text>
            </View>

            {/* Phonics Sound Breakdown */}
            <View style={styles.soundBreakdown}>
              <Text style={[typography.heading, { color: colors.focusBorder }]}>
                /{getOnsetSound(selectedWord.onset)}/ + /{selectedWord.rime}/ = /{selectedWord.word}/
              </Text>
              <Text style={[typography.body, { color: colors.correct, marginTop: 4 }]}>
                {getOnsetMarathi(selectedWord.onset)} + {getRimeMarathi(selectedWord.rime)} = {selectedWord.marathi}
              </Text>
            </View>

            {/* Vowel Anchor Box */}
            {vowelGuide && (
              <View style={styles.anchorBox}>
                <Text style={[typography.caption, { color: colors.textMuted }]}>
                  Vowel Guide: {vowelGuide.anchorPhonics}
                </Text>
              </View>
            )}

            {/* Instructions */}
            <View style={styles.hintContainer}>
              <Text style={[typography.tiny, { color: colors.textDim, textAlign: 'center' }]}>
                Press OK on remote to hear pronunciation & blending
              </Text>
            </View>
          </View>
        )}
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
  },
  headerIcon: {
    fontSize: 44,
    lineHeight: 52,
  },
  toggleBtn: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  toggleBtnActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.focus,
  },
  vowelRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  vowelTab: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.radiusMd,
    paddingVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  familyRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  familyPill: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: 6,
    borderRadius: spacing.radiusSm,
  },
  familyPillActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.md,
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  scrollArea: {
    flex: 2,
  },
  wordsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  wordCard: {
    width: '47.5%',
    minHeight: 85,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    gap: 2,
  },
  wordCardActive: {
    borderColor: colors.gold,
  },
  wordTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  wordOnset: {
    fontSize: 32,
    fontWeight: '900',
  },
  wordRime: {
    fontSize: 32,
    fontWeight: '900',
    color: colors.text,
  },
  spotlight: {
    flex: 1.3,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 25,
  },
  spotlightHeader: {
    alignItems: 'center',
  },
  bigWordBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  bigOnset: {
    fontSize: 48,
    fontWeight: '900',
  },
  plusSign: {
    fontSize: 32,
    color: colors.textMuted,
    marginHorizontal: 4,
  },
  bigRime: {
    fontSize: 48,
    fontWeight: '900',
    color: colors.text,
  },
  equalsSign: {
    fontSize: 32,
    color: colors.gold,
    marginHorizontal: 4,
  },
  bigWord: {
    fontSize: 54,
    fontWeight: '900',
    color: colors.gold,
  },
  soundBreakdown: {
    backgroundColor: colors.surfaceHigh,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    width: '100%',
  },
  anchorBox: {
    backgroundColor: 'rgba(255, 183, 3, 0.1)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  hintContainer: {
    paddingTop: spacing.xs,
  },
});
