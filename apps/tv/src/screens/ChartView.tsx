// SmartStudy TV — Interactive Chart View Dispatcher
// Dispatches to dedicated specialized views (Phonics Lab, Poems & Rhymes,
// Tables 2–30) or renders the visual chart viewer with D-pad grid & live spotlight.

import React, { useEffect, useState } from 'react';
import {
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
import { useTVSpeech } from '../hooks/useTVSpeech';
import { TV_CHART_CATEGORIES, TVChartItem } from '../data/tvChartsData';
import { PhonicsChartView } from './charts/PhonicsChartView';
import { PhonicsStoriesChartView } from './charts/PhonicsStoriesChartView';
import { PoemsChartView } from './charts/PoemsChartView';
import { TablesChartView } from './charts/TablesChartView';

interface ChartViewProps {
  slug: string;
  childId: string;
  onBack: () => void;
}

export function ChartView({ slug, childId, onBack }: ChartViewProps) {
  // 1. Phonics & CVC Word Families (Priority)
  if (slug === 'phonics') {
    return <PhonicsChartView childId={childId} onBack={onBack} />;
  }

  // 2. Grade 1 Phonics Decodable Stories
  if (slug === 'phonic-stories' || slug === 'phonics-stories') {
    return <PhonicsStoriesChartView childId={childId} onBack={onBack} />;
  }

  // 3. Poems & Nursery Rhymes
  if (slug === 'poems') {
    return <PoemsChartView childId={childId} onBack={onBack} />;
  }

  // 4. Multiplication Tables 2–30
  if (slug === 'tables-2-30') {
    return <TablesChartView childId={childId} onBack={onBack} />;
  }

  // 5. Visual Grid Charts (Animals, Birds, Vegetables, Body Parts, Emotions, Marathi Swar, Marathi Vyanjan, English A–Z)
  return <VisualChartView slug={slug} childId={childId} onBack={onBack} />;
}

function VisualChartView({ slug, childId, onBack }: ChartViewProps) {
  const category = TV_CHART_CATEGORIES[slug] ?? TV_CHART_CATEGORIES['animals'];
  const { talkEnabled, toggleTalk, speak } = useTVSpeech();

  const items = category.items || [];
  const [selectedItem, setSelectedItem] = useState<TVChartItem | null>(items[0] || null);

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

  // Auto-update spotlight panel on D-pad focus change
  useEffect(() => {
    const unsub = tvFocusManager.subscribe((key) => {
      if (key && key.startsWith('item-')) {
        const idx = parseInt(key.replace('item-', ''), 10);
        if (!isNaN(idx) && items[idx]) {
          setSelectedItem(items[idx]);
        }
      }
    });
    return () => unsub();
  }, [items]);

  // Register focus grid (Row 0: Voice Toggle, Rows 1..N: 2 columns)
  useEffect(() => {
    if (items.length > 0) {
      const cols = 2;
      const grid: string[][] = [
        ['btn-toggle-voice', 'btn-toggle-voice'],
      ];
      for (let i = 0; i < items.length; i += cols) {
        grid.push(items.slice(i, i + cols).map((_, idx) => `item-${i + idx}`));
      }
      tvFocusManager.register({ type: 'grid', grid }, 'item-0');
      if (items[0]) {
        setSelectedItem(items[0]);
        speak(items[0].audioText || items[0].name);
      }
    }
  }, [category.slug, items.length]);

  const handleItemPress = (item: TVChartItem) => {
    setSelectedItem(item);
    speak(item.audioText || `${item.name}. ${item.marathi || ''}. ${item.fact || ''}`);
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.headerIcon}>{category.icon}</Text>
          <View>
            <Text style={typography.title}>{category.title}</Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {category.description}
            </Text>
          </View>
        </View>

        <View style={styles.headerRight}>
          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[styles.voiceBtn, talkEnabled && styles.voiceBtnActive]}
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

          <View style={styles.hintPill}>
            <Text style={[typography.tiny, { color: colors.focusBorder }]}>
              D-pad to browse • OK to listen • Back to return
            </Text>
          </View>
        </View>
      </View>

      {/* ── GRID & SPOTLIGHT ── */}
      <View style={styles.gridAndSpotlight}>
        {/* Left Grid */}
        <TVScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.itemsGrid}
          showsVerticalScrollIndicator={false}
        >
          {items.map((item, idx) => (
            <FocusTile
              key={item.id}
              focusKey={`item-${idx}`}
              onPress={() => handleItemPress(item)}
              style={[
                styles.itemCard,
                selectedItem?.id === item.id && styles.itemCardActive,
              ]}
            >
              <Text style={styles.itemEmoji}>{item.icon}</Text>
              <Text style={[typography.heading, styles.itemName]} numberOfLines={1}>
                {item.name}
              </Text>
              {item.sub ? (
                <Text style={[typography.tiny, { color: colors.gold }]} numberOfLines={1}>
                  {item.sub}
                </Text>
              ) : item.marathi ? (
                <Text style={[typography.tiny, { color: colors.textMuted }]} numberOfLines={1}>
                  {item.marathi}
                </Text>
              ) : null}
            </FocusTile>
          ))}
        </TVScrollView>

        {/* Right Spotlight Panel */}
        {selectedItem && (
          <View style={styles.spotlightCard}>
            <Text style={styles.spotlightEmoji}>{selectedItem.icon}</Text>
            <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
              {selectedItem.name}
            </Text>

            {selectedItem.sub && (
              <Text style={[typography.heading, { color: colors.focusBorder, textAlign: 'center' }]}>
                {selectedItem.sub}
              </Text>
            )}

            {selectedItem.phonic && (
              <View style={styles.phonicBadge}>
                <Text style={[typography.caption, { color: colors.gold }]}>
                  Phonic: {selectedItem.phonic}
                </Text>
              </View>
            )}

            {selectedItem.marathi && (
              <View style={styles.translationRow}>
                <Text style={[typography.body, { color: colors.textMuted }]}>Marathi: </Text>
                <Text style={[typography.body, { color: colors.correct, fontWeight: '700' }]}>
                  {selectedItem.marathi}
                </Text>
              </View>
            )}

            {selectedItem.hindi && (
              <View style={styles.translationRow}>
                <Text style={[typography.body, { color: colors.textMuted }]}>Hindi: </Text>
                <Text style={[typography.body, { color: colors.gold, fontWeight: '700' }]}>
                  {selectedItem.hindi}
                </Text>
              </View>
            )}

            {selectedItem.fact && (
              <View style={styles.factBox}>
                <Text style={[typography.caption, { color: colors.text, textAlign: 'center' }]}>
                  💡 {selectedItem.fact}
                </Text>
              </View>
            )}
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
    paddingBottom: spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  headerIcon: {
    fontSize: 48,
    lineHeight: 56,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  voiceBtn: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  voiceBtnActive: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  hintPill: {
    backgroundColor: 'rgba(124, 58, 237, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.3)',
  },
  gridAndSpotlight: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.md,
    gap: spacing.lg,
  },
  scrollArea: {
    flex: 2.2,
  },
  itemsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: spacing.sm,
    paddingBottom: spacing.lg,
  },
  itemCard: {
    width: '47.5%',
    minHeight: 115,
    backgroundColor: colors.surfaceCard,
    borderRadius: spacing.radiusMd,
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.xs,
    gap: 2,
  },
  itemCardActive: {
    borderColor: colors.gold,
  },
  itemEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  itemName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  spotlightCard: {
    flex: 1.1,
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    shadowColor: colors.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  spotlightEmoji: {
    fontSize: 84,
    lineHeight: 96,
  },
  phonicBadge: {
    backgroundColor: 'rgba(255, 183, 3, 0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: 4,
    borderRadius: spacing.radiusSm,
  },
  translationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  factBox: {
    backgroundColor: colors.surfaceHigh,
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
    marginTop: spacing.xs,
  },
});
