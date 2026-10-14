import React, { useEffect, useRef } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../components/FocusTile';
import { StarBurst } from '../components/StarBurst';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { useTVSpeech } from '../hooks/useTVSpeech';

interface EpisodeCompleteProps {
  score: number;
  total: number;
  childName: string;
  onPlayAgain: () => void;
  onHome: () => void;
}

function StarRating({ score, total }: { score: number; total: number }) {
  const pct = score / total;
  const stars = pct >= 0.9 ? 3 : pct >= 0.6 ? 2 : 1;
  return (
    <View style={{ flexDirection: 'row', gap: 12 }}>
      {[1, 2, 3].map(n => (
        <Text key={n} style={{ fontSize: 64, opacity: n <= stars ? 1 : 0.2 }}>⭐</Text>
      ))}
    </View>
  );
}

function getMessage(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.9) return { emoji: '🏆', msg: 'Outstanding! You are a superstar!' };
  if (pct >= 0.7) return { emoji: '🎉', msg: 'Great job! Keep it up!' };
  if (pct >= 0.5) return { emoji: '👍', msg: 'Good effort! Practice makes perfect!' };
  return { emoji: '💪', msg: "Keep trying — you're getting better every time!" };
}

export function EpisodeComplete({ score, total, childName, onPlayAgain, onHome }: EpisodeCompleteProps) {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const { speak } = useTVSpeech();

  const { emoji, msg } = getMessage(score, total);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 80,
      friction: 8,
      delay: 400,
    }).start();
    setTimeout(() => {
      speak(`${msg} You scored ${score} out of ${total}!`);
    }, 600);
    tvFocusManager.register(
      {
        type: 'list',
        orientation: 'horizontal',
        list: ['btn-again', 'btn-home'],
      },
      'btn-again',
    );
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <StarBurst visible onComplete={() => {}} />

      <Animated.View
        style={[styles.card, { transform: [{ scale: scaleAnim }] }]}
      >
        <Text style={styles.bigEmoji}>{emoji}</Text>
        <Text style={[typography.display, { textAlign: 'center', color: colors.gold }]}>
          {score} / {total}
        </Text>
        <StarRating score={score} total={total} />
        <Text style={[typography.heading, { textAlign: 'center' }]}>{msg}</Text>
        <Text style={[typography.muted, { textAlign: 'center', marginTop: spacing.sm }]}>
          Well done, {childName.split(' ')[0]}!
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          <FocusTile
            focusKey="btn-again"
            onPress={onPlayAgain}
            style={styles.btnAgain}
          >
            <Text style={[typography.heading, { color: colors.text }]}>🔄  Play Again</Text>
          </FocusTile>
          <FocusTile
            focusKey="btn-home"
            onPress={onHome}
            style={styles.btnHome}
          >
            <Text style={[typography.heading, { color: colors.text }]}>🏠  Home</Text>
          </FocusTile>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: spacing.radiusLg,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    gap: spacing.md,
    minWidth: 560,
    maxWidth: 750,
    shadowColor: colors.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 40,
    elevation: 30,
  },
  bigEmoji: {
    fontSize: 72,
    lineHeight: 84,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
    marginTop: spacing.sm,
  },
  btnAgain: {
    backgroundColor: colors.focus,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
  },
  btnHome: {
    backgroundColor: colors.surfaceHigh,
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.md,
    borderRadius: spacing.radiusMd,
  },
});
