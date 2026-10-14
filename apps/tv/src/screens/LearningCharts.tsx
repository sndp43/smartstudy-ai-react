// SmartStudy TV — Learning Charts Browser
// Grid of category cards. Selecting one navigates into the chart viewer.
// Prioritizes Phonics Lab, Poems & Rhymes, and Tables at the top.

import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../components/FocusTile';
import { TVScrollView } from '../components/TVScrollView';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { api } from '../hooks/useAPI';
import { useOfflineCache } from '../hooks/useOfflineCache';

// Prioritized order: Phonics first, Phonics Stories, then Poems, Tables, Marathi, English, Visuals
const ORDERED_CHARTS = [
  { slug: 'phonics',          label: 'Phonics & CVC',     icon: '🗣️', bg: '#4A1D24', badge: '⭐ PRIORITY' },
  { slug: 'phonic-stories',   label: 'Phonics Stories',   icon: '📖', bg: '#4C1D95', badge: '⭐ GRADE 1' },
  { slug: 'poems',            label: 'Poems & Rhymes',    icon: '🎭', bg: '#1E293B', badge: 'NEW' },
  { slug: 'tables-2-30',      label: 'Tables 2–30',       icon: '🔢', bg: '#1E3A5F' },
  { slug: 'marathi-swar',     label: 'Marathi Swar',      icon: '🕉️', bg: '#3B1A40' },
  { slug: 'marathi-vyanjan',  label: 'Marathi Vyanjan',   icon: '🪷', bg: '#1B382B' },
  { slug: 'english-alphabet', label: 'English A–Z',       icon: '🔤', bg: '#1E2548' },
  { slug: 'animals',          label: 'Animals',           icon: '🦁', bg: '#3D1A1A' },
  { slug: 'birds',            label: 'Birds',             icon: '🦜', bg: '#102A3A' },
  { slug: 'vegetables',       label: 'Vegetables',        icon: '🥕', bg: '#1C2A10' },
  { slug: 'body-parts',       label: 'Body Parts',        icon: '👦', bg: '#1A3A2A' },
  { slug: 'emotions',         label: 'Emotions',          icon: '😊', bg: '#2A1A3A' },
];

const CHART_META: Record<string, { label: string; icon: string; bg: string; badge?: string }> =
  ORDERED_CHARTS.reduce((acc, c) => ({ ...acc, [c.slug]: c }), {});

interface LearningChartsProps {
  childId: string;
  onSelectChart: (slug: string) => void;
  onBack: () => void;
}

export function LearningCharts({ childId, onSelectChart, onBack }: LearningChartsProps) {
  const [charts, setCharts] = useState<{ slug: string }[]>(ORDERED_CHARTS.map((c) => ({ slug: c.slug })));
  const [loading, setLoading] = useState(false);
  const { fetchWithCache } = useOfflineCache();

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

  const registerGrid = (list: { slug: string }[]) => {
    const cols = 3;
    const grid: string[][] = [];
    for (let i = 0; i < list.length; i += cols) {
      grid.push(list.slice(i, i + cols).map((_, idx) => `chart-${i + idx}`));
    }
    tvFocusManager.register({ type: 'grid', grid }, 'chart-0');
  };

  useEffect(() => {
    let isMounted = true;
    registerGrid(charts);

    // Optional background sync with API if available
    fetchWithCache(
      'learning-charts',
      () => api.getCharts(),
      (apiCharts) => {
        if (!isMounted) return;
        if (apiCharts && apiCharts.length > 0) {
          // Merge API charts while keeping prioritized ordering
          const existingSlugs = new Set(ORDERED_CHARTS.map((c) => c.slug));
          const extra = apiCharts.filter((ac: any) => !existingSlugs.has(ac.slug));
          const combined = [...ORDERED_CHARTS, ...extra];
          setCharts(combined);
          registerGrid(combined);
        }
      },
    ).catch(() => {
      // Keep curated list
    });

    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.focus} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={typography.title}>📚 Learning Charts</Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
            Explore interactive phonics, poems, tables, alphabets, and visual charts
          </Text>
        </View>

        <View style={styles.hintPill}>
          <Text style={[typography.tiny, { color: colors.focusBorder }]}>
            D-pad to navigate • OK to open
          </Text>
        </View>
      </View>

      {/* Chart grid */}
      <TVScrollView
        style={styles.scroll}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {charts.map((chart, i) => {
          const meta = CHART_META[chart.slug] ?? { label: chart.slug, icon: '📊', bg: '#1C2538' };
          const isPriority = chart.slug === 'phonics';

          return (
            <FocusTile
              key={chart.slug}
              focusKey={`chart-${i}`}
              onPress={() => onSelectChart(chart.slug)}
              style={[
                styles.card,
                { backgroundColor: meta.bg },
                isPriority && styles.priorityCard,
              ]}
            >
              {meta.badge && (
                <View style={styles.badgePill}>
                  <Text style={[typography.tiny, { color: colors.gold, fontWeight: '800' }]}>
                    {meta.badge}
                  </Text>
                </View>
              )}
              <Text style={styles.cardEmoji}>{meta.icon}</Text>
              <Text style={[typography.heading, styles.cardLabel]} numberOfLines={2}>
                {meta.label}
              </Text>
            </FocusTile>
          );
        })}
      </TVScrollView>

      <View style={styles.hintBar}>
        <Text style={[typography.tiny, { color: colors.textDim }]}>
          D-pad to navigate • OK to open chart • Back to return home
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.safeH,
    paddingTop: spacing.safeV,
    paddingBottom: spacing.sm,
  },
  hintPill: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
  },
  scroll: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.md,
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.lg,
  },
  card: {
    width: '31.2%',
    minHeight: 120,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
    position: 'relative',
  },
  priorityCard: {
    borderColor: 'rgba(255, 183, 3, 0.4)',
    borderWidth: 1.5,
  },
  badgePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardEmoji: {
    fontSize: 44,
    lineHeight: 52,
  },
  cardLabel: {
    color: colors.text,
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '700',
  },
  hintBar: {
    paddingHorizontal: spacing.safeH,
    paddingVertical: spacing.xs,
    alignItems: 'center',
  },
});
