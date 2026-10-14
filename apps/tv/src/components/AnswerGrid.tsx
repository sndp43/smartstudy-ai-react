// SmartStudy TV — AnswerGrid
// Renders answer choices in a 2×2 grid (4 options) or 2×1 (2 options).
// Each tile is D-pad navigable via Norigin FocusContext.

import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { FocusTile } from './FocusTile';
import { tvFocusManager } from '../utils/tvFocusManager';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';

export interface AnswerOption {
  label: string;
  value: string;
}

interface AnswerGridProps {
  focusKey: string;
  options: AnswerOption[];
  selectedValue: string | null;
  correctValue: string | null;  // null until answered
  onSelect: (value: string) => void;
  disabled?: boolean;
  skipRegister?: boolean;
}

export function AnswerGrid({
  focusKey,
  options,
  selectedValue,
  correctValue,
  onSelect,
  disabled = false,
  skipRegister = false,
}: AnswerGridProps) {
  useEffect(() => {
    if (skipRegister) return;
    if (options.length === 4) {
      tvFocusManager.register(
        {
          type: 'grid',
          grid: [
            [`${focusKey}-answer-0`, `${focusKey}-answer-1`],
            [`${focusKey}-answer-2`, `${focusKey}-answer-3`],
          ],
        },
        `${focusKey}-answer-0`,
      );
    } else if (options.length > 0) {
      tvFocusManager.register(
        {
          type: 'list',
          orientation: 'horizontal',
          list: options.map((_, i) => `${focusKey}-answer-${i}`),
        },
        `${focusKey}-answer-0`,
      );
    }
  }, [focusKey, options, skipRegister]);

  const getStyle = (value: string): ViewStyle => {
    if (correctValue !== null) {
      const isThisCorrect = value.trim().toLowerCase() === correctValue.trim().toLowerCase();
      if (isThisCorrect) return styles.correct;
      if (value === selectedValue) return styles.wrong;
    }
    return styles.default;
  };

  const getEmoji = (value: string) => {
    if (correctValue === null) return null;
    const isThisCorrect = value.trim().toLowerCase() === correctValue.trim().toLowerCase();
    if (isThisCorrect) return '✅';
    if (value === selectedValue) return '❌';
    return null;
  };

  return (
    <View style={styles.grid}>
      {options.map((opt, i) => (
        <FocusTile
          key={opt.value}
          focusKey={`${focusKey}-answer-${i}`}
          onPress={() => onSelect(opt.value)}
          style={[styles.tile, getStyle(opt.value)]}
          disabled={disabled}
        >
          <View style={styles.tileInner}>
            {getEmoji(opt.value) && (
              <Text style={styles.emoji}>{getEmoji(opt.value)}</Text>
            )}
            <Text style={typography.answer} numberOfLines={3}>
              {opt.label}
            </Text>
          </View>
        </FocusTile>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
    paddingHorizontal: spacing.md,
  },
  tile: {
    width: spacing.answerTileW,
    minHeight: spacing.answerTileH,
    backgroundColor: colors.surfaceCard,
    justifyContent: 'center',
    padding: spacing.md,
  },
  default: {
    backgroundColor: colors.surfaceCard,
  },
  correct: {
    backgroundColor: 'rgba(16, 185, 129, 0.25)',
    borderColor: colors.correct,
  },
  wrong: {
    backgroundColor: 'rgba(239, 68, 68, 0.20)',
    borderColor: colors.wrong,
  },
  tileInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },
  emoji: {
    fontSize: 36,
  },
});
