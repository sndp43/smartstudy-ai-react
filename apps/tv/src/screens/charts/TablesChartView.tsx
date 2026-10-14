// SmartStudy TV — Multiplication Tables 2–30 Chart Screen
// Full 10-foot interactive math tables lab with D-pad navigation,
// single step audio recitation, whole-table chant, and math trick spotlights.

import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  SafeAreaView,
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

interface TablesChartViewProps {
  childId: string;
  onBack: () => void;
}

const TABLE_RANGES = [
  { id: 'r1', label: '2 to 10', tables: [2, 3, 4, 5, 6, 7, 8, 9, 10] },
  { id: 'r2', label: '11 to 20', tables: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
  { id: 'r3', label: '21 to 30', tables: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
];

const MULTIPLIER_RECITE: Record<number, string> = {
  1: 'one za',
  2: 'two za',
  3: 'three za',
  4: 'four za',
  5: 'five za',
  6: 'six za',
  7: 'seven za',
  8: 'eight za',
  9: 'nine za',
  10: 'ten za',
};

const TABLE_TIPS: Record<number, string> = {
  2: 'Even numbers! All answers end in 0, 2, 4, 6, or 8.',
  3: 'The sum of digits in each answer is always divisible by 3!',
  4: 'Double the 2x table! (4 × 3 is double of 2 × 3).',
  5: 'All answers end in 0 or 5! Super easy to remember.',
  6: 'Multiply by 3 and double the answer.',
  7: 'Lucky 7! Practice chanting with rhythm to memorize easily.',
  8: 'Double, double, and double again!',
  9: 'Magic 9! The sum of digits in the answer always equals 9 (e.g. 1+8=9, 2+7=9).',
  10: 'Just attach a zero to the number! (10 × 7 = 70).',
  11: 'Double digits up to 99! (11 × 4 = 44).',
  12: 'Add table of 10 + table of 2.',
  15: 'Count in 15s: 15, 30, 45, 60, 75, 90!',
  20: 'Multiply by 2 and add a zero!',
  25: 'Count like quarters: 25, 50, 75, 100, 125, 150!',
  30: 'Multiply by 3 and add a zero!',
};

export function TablesChartView({ childId, onBack }: TablesChartViewProps) {
  const { talkEnabled, toggleTalk, speak, stop } = useTVSpeech();
  const [selectedRangeIdx, setSelectedRangeIdx] = useState<number>(0);
  const [currentTable, setCurrentTable] = useState<number>(2);
  const [isReciting, setIsReciting] = useState<boolean>(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);

  const reciteTimerRef = useRef<any>(null);
  const isRecitingRef = useRef<boolean>(false);

  const currentRange = TABLE_RANGES[selectedRangeIdx] || TABLE_RANGES[0];

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
    setActiveStep(null);
    if (reciteTimerRef.current) {
      clearTimeout(reciteTimerRef.current);
      reciteTimerRef.current = null;
    }
    stop();
  };

  // Register TV Focus Grid
  useEffect(() => {
    // Row 0: Range tabs (r-0, r-1, r-2)
    const rangeRow = TABLE_RANGES.map((_, i) => `trange-${i}`);

    // Row 1: Tables in active range (tbl-2, tbl-3, ...)
    const tableRow = currentRange.tables.map((t) => `tbl-btn-${t}`);

    // Row 2: Action buttons (Voice Toggle, Recite Chant)
    const actionRow = ['btn-toggle-voice', 'btn-recite-table'];

    // Rows 3..7: Steps in 2 columns (step-1, step-2, ..., step-10)
    const stepRows = [
      ['tbl-step-1', 'tbl-step-2'],
      ['tbl-step-3', 'tbl-step-4'],
      ['tbl-step-5', 'tbl-step-6'],
      ['tbl-step-7', 'tbl-step-8'],
      ['tbl-step-9', 'tbl-step-10'],
    ];

    const grid = [rangeRow, tableRow, actionRow, ...stepRows];
    tvFocusManager.register({ type: 'grid', grid }, 'tbl-step-1');
  }, [selectedRangeIdx, currentTable, currentRange.tables.length]);

  const handleSelectRange = (idx: number) => {
    stopRecitation();
    setSelectedRangeIdx(idx);
    const range = TABLE_RANGES[idx];
    if (range && range.tables[0]) {
      setCurrentTable(range.tables[0]);
      speak(`Tables ${range.label}`);
    }
  };

  const handleSelectTable = (tbl: number) => {
    stopRecitation();
    setCurrentTable(tbl);
    speak(`Table of ${tbl}`);
  };

  const handleStepPress = (multiplier: number) => {
    stopRecitation();
    setActiveStep(multiplier);
    const res = currentTable * multiplier;
    speak(`${currentTable} ${MULTIPLIER_RECITE[multiplier]} ${res}`);
  };

  const toggleReciteChant = () => {
    if (isReciting) {
      stopRecitation();
      return;
    }

    isRecitingRef.current = true;
    setIsReciting(true);

    let m = 1;
    const playNextStep = () => {
      if (!isRecitingRef.current || m > 10) {
        setIsReciting(false);
        setActiveStep(null);
        isRecitingRef.current = false;
        speak(`Excellent! Table of ${currentTable} completed!`, true);
        return;
      }

      setActiveStep(m);
      const res = currentTable * m;
      speak(`${currentTable} ${MULTIPLIER_RECITE[m]} ${res}`, true);

      m++;
      reciteTimerRef.current = setTimeout(playNextStep, 2200);
    };

    playNextStep();
  };

  const tip = TABLE_TIPS[currentTable] || `Practice table of ${currentTable} daily for lightning speed math!`;

  return (
    <SafeAreaView style={styles.screen}>
      <TVScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── HEADER ── */}
        <TVScrollSection style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerIcon}>🔢</Text>
            <View>
              <Text style={typography.title}>Multiplication Table of {currentTable}</Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Master tables 2 to 30 • Interactive recitation & chants
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: spacing.sm }}>
            <FocusTile
              focusKey="btn-toggle-voice"
              onPress={toggleTalk}
              style={[
                styles.reciteBtn,
                talkEnabled && { backgroundColor: 'rgba(124, 58, 237, 0.4)', borderColor: colors.gold },
              ]}
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
              focusKey="btn-recite-table"
              onPress={toggleReciteChant}
              style={[
                styles.reciteBtn,
                isReciting && { backgroundColor: colors.gold, borderColor: '#FFF' },
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  { color: isReciting ? '#000' : colors.text, fontWeight: '700' },
                ]}
              >
                {isReciting ? '⏹️ Stop Reciting' : `▶️ Recite Table of ${currentTable}`}
              </Text>
            </FocusTile>
          </View>
        </TVScrollSection>

        {/* ── TABLE RANGE SELECTOR (2-10, 11-20, 21-30) ── */}
        <TVScrollSection style={styles.rangeRow}>
          {TABLE_RANGES.map((r, i) => (
            <FocusTile
              key={r.id}
              focusKey={`trange-${i}`}
              onPress={() => handleSelectRange(i)}
              style={[
                styles.rangeTab,
                selectedRangeIdx === i && styles.rangeTabActive,
              ]}
            >
              <Text
                style={[
                  typography.caption,
                  {
                    color: selectedRangeIdx === i ? colors.gold : colors.textMuted,
                    fontWeight: selectedRangeIdx === i ? '700' : '500',
                  },
                ]}
              >
                Tables {r.label}
              </Text>
            </FocusTile>
          ))}
        </TVScrollSection>

        {/* ── NUMBER PILLS (2..10 or 11..20 or 21..30) ── */}
        <TVScrollSection style={styles.tablePillsRow}>
          {currentRange.tables.map((tbl) => (
            <FocusTile
              key={`tbl-btn-${tbl}`}
              focusKey={`tbl-btn-${tbl}`}
              onPress={() => handleSelectTable(tbl)}
              style={[
                styles.tablePill,
                currentTable === tbl && styles.tablePillActive,
              ]}
            >
              <Text
                style={[
                  typography.heading,
                  { color: currentTable === tbl ? colors.gold : colors.text },
                ]}
              >
                {tbl}
              </Text>
            </FocusTile>
          ))}
        </TVScrollSection>

        {/* ── MAIN CONTENT (LEFT: 10 STEPS, RIGHT: TIP & SPOTLIGHT) ── */}
        <TVScrollSection style={styles.content}>
          {/* 10 Steps Grid (2 cols x 5 rows) */}
          <View style={styles.stepsGrid}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((m) => {
              const res = currentTable * m;
              const isActive = activeStep === m;

              return (
                <FocusTile
                  key={`tbl-step-${m}`}
                  focusKey={`tbl-step-${m}`}
                  onPress={() => handleStepPress(m)}
                  style={[styles.stepTile, isActive && styles.stepTileActive]}
                >
                  <Text style={[typography.title, { color: colors.text, fontSize: 26 }]}>
                    {currentTable} × {m} ={' '}
                    <Text style={{ color: isActive ? colors.gold : colors.text, fontWeight: '900' }}>
                      {res}
                    </Text>
                  </Text>
                  <Text style={[typography.caption, { color: colors.focusBorder }]}>
                    🗣️ {MULTIPLIER_RECITE[m]}
                  </Text>
                </FocusTile>
              );
            })}
          </View>

          {/* Right Info & Trick Card */}
          <View style={styles.rightCard}>
            <Text style={styles.bigMathEmoji}>🧮</Text>
            <Text style={[typography.title, { color: colors.gold, textAlign: 'center' }]}>
              Table of {currentTable}
            </Text>

            <View style={styles.trickBox}>
              <Text style={[typography.caption, { color: colors.gold, fontWeight: '700' }]}>
                💡 MATH TRICK & TIP
              </Text>
              <Text style={[typography.body, { color: colors.text, marginTop: 4, textAlign: 'center' }]}>
                {tip}
              </Text>
            </View>

            <View style={styles.hintContainer}>
              <Text style={[typography.tiny, { color: colors.textDim, textAlign: 'center' }]}>
                Press OK on any step to hear Indian chant pronunciation.
              </Text>
            </View>
          </View>
        </TVScrollSection>
      </TVScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.xl,
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
  reciteBtn: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  rangeRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.sm,
    paddingVertical: 4,
  },
  rangeTab: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: 4,
    borderRadius: spacing.radiusSm,
  },
  rangeTabActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  tablePillsRow: {
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    gap: spacing.xs,
    paddingVertical: 4,
  },
  tablePill: {
    flex: 1,
    backgroundColor: colors.surfaceCard,
    paddingVertical: 6,
    borderRadius: spacing.radiusSm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tablePillActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.45)',
    borderColor: colors.gold,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.sm,
    gap: spacing.lg,
    marginTop: spacing.xs,
  },
  stepsGrid: {
    flex: 2,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    alignContent: 'center',
  },
  stepTile: {
    width: '48.5%',
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusMd,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepTileActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  rightCard: {
    flex: 1,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  bigMathEmoji: {
    fontSize: 64,
    lineHeight: 74,
  },
  trickBox: {
    backgroundColor: colors.surfaceHigh,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    width: '100%',
    alignItems: 'center',
  },
  hintContainer: {
    paddingHorizontal: spacing.sm,
  },
});
