// SmartStudy TV — Practice Skill Picker
// Lists all skills for the child. D-pad to browse, OK to start episode.

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
import { api, Child, Skill } from '../hooks/useAPI';
import { useOfflineCache } from '../hooks/useOfflineCache';

interface PracticePickerProps {
  child: Child;
  onSelectSkill: (skill: Skill) => void;
  onBack: () => void;
}

function MasteryBar({ score }: { score: number }) {
  const color = score >= 80 ? colors.correct : score >= 60 ? colors.gold : colors.wrong;
  return (
    <View style={styles.masteryRow}>
      <View style={styles.masteryTrack}>
        <View style={[styles.masteryFill, { width: `${score}%` as any, backgroundColor: color }]} />
      </View>
      <Text style={[typography.tiny, { color, minWidth: 40 }]}>{score}%</Text>
    </View>
  );
}

const SUBJECT_ICONS: Record<string, string> = {
  English: '🔤', Mathematics: '🔢', Marathi: '🕉️', EVS: '🌿', default: '📖',
};

export function PracticePicker({ child, onSelectSkill, onBack }: PracticePickerProps) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const { fetchWithCache } = useOfflineCache();

  useEffect(() => {
    const unregister = tvFocusManager.registerBackHandler(() => {
      onBack();
      return true;
    });
    const sub = BackHandler.addEventListener('hardwareBackPress', () => { onBack(); return true; });
    return () => {
      unregister();
      sub.remove();
    };
  }, [onBack]);

  useEffect(() => {
    fetchWithCache(
      `skills-${child.id}`,
      () => api.getSkills(child.id),
      (data) => {
        // Sort by mastery ascending — weakest skills first
        const sorted = [...data].sort((a, b) => a.mastery_score - b.mastery_score);
        setSkills(sorted);
        setLoading(false);
        if (sorted.length > 0) {
          tvFocusManager.register(
            {
              type: 'list',
              orientation: 'vertical',
              list: sorted.map((_, i) => `skill-${i}`),
            },
            'skill-0',
          );
        }
      },
    ).catch(() => setLoading(false));
  }, [child.id]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.focus} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.header}>
        <Text style={typography.title}>🎯 Practice Mode</Text>
        <Text style={[typography.muted, { marginTop: 4 }]}>
          Choose a skill — weakest skills shown first
        </Text>
      </View>

      <TVScrollView
        style={styles.list}
        contentContainerStyle={styles.listContent}
      >
        {skills.map((skill, i) => {
          const icon = SUBJECT_ICONS[skill.subject] ?? SUBJECT_ICONS.default;
          return (
            <FocusTile
              key={skill.id}
              focusKey={`skill-${i}`}
              onPress={() => onSelectSkill(skill)}
              style={styles.skillCard}
            >
              <View style={styles.skillLeft}>
                <Text style={styles.skillIcon}>{icon}</Text>
                <View style={styles.skillInfo}>
                  <Text style={[typography.heading, { color: colors.text }]} numberOfLines={1}>
                    {skill.name}
                  </Text>
                  <Text style={[typography.caption, { color: colors.textMuted }]}>
                    {skill.subject} • {skill.topic}
                  </Text>
                  <MasteryBar score={skill.mastery_score} />
                </View>
              </View>
              <Text style={[typography.body, { color: colors.focusBorder }]}>▶</Text>
            </FocusTile>
          );
        })}
      </TVScrollView>

      <View style={styles.hintBar}>
        <Text style={[typography.tiny, { color: colors.textDim }]}>
          D-pad ↑↓ to browse  •  OK to start practice
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  center: { flex: 1, backgroundColor: colors.bg, alignItems: 'center', justifyContent: 'center' },
  header: {
    paddingHorizontal: spacing.safeH,
    paddingTop: spacing.safeV,
    paddingBottom: spacing.md,
  },
  list: { flex: 1 },
  listContent: {
    paddingHorizontal: spacing.safeH,
    paddingBottom: spacing.lg,
    gap: spacing.sm,
  },
  skillCard: {
    backgroundColor: colors.surfaceCard,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  skillLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
    flex: 1,
  },
  skillIcon: { fontSize: 40, lineHeight: 50 },
  skillInfo: { flex: 1, gap: 4 },
  masteryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginTop: 4,
  },
  masteryTrack: {
    flex: 1,
    height: 6,
    backgroundColor: colors.surfaceHigh,
    borderRadius: 3,
    overflow: 'hidden',
  },
  masteryFill: { height: '100%', borderRadius: 3 },
  hintBar: { alignItems: 'center', paddingBottom: spacing.sm },
});
