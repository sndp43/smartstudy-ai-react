// SmartStudy TV — Typography
// Baloo 2 is round and child-friendly with full Devanagari support for Marathi.
// All sizes use sp (density-independent pixels) appropriate for TV viewing at 10ft.

import { StyleSheet, TextStyle } from 'react-native';
import { colors } from './colors';

// Base text style shared by all
const base: TextStyle = {
  fontFamily: 'Baloo2-Regular',
  color: colors.text,
  includeFontPadding: false,
};

export const typography = StyleSheet.create({
  // Display — hero titles, welcome names
  display: {
    ...base,
    fontFamily: 'Baloo2-Bold',
    fontSize: 36,
    lineHeight: 44,
  },
  // Title — screen headings, tile labels
  title: {
    ...base,
    fontFamily: 'Baloo2-Bold',
    fontSize: 26,
    lineHeight: 32,
  },
  // Heading — card headers, section names
  heading: {
    ...base,
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 20,
    lineHeight: 26,
  },
  // Body — question text, descriptions
  body: {
    ...base,
    fontSize: 18,
    lineHeight: 24,
  },
  // Answer — answer tile text
  answer: {
    ...base,
    fontFamily: 'Baloo2-SemiBold',
    fontSize: 22,
    lineHeight: 28,
    textAlign: 'center',
  },
  // Caption — hints, sub-labels
  caption: {
    ...base,
    fontSize: 13,
    lineHeight: 18,
    color: colors.textMuted,
  },
  // Tiny — badges, counters
  tiny: {
    ...base,
    fontSize: 11,
    lineHeight: 15,
    color: colors.textMuted,
  },
  // Devanagari — large Marathi characters
  devanagari: {
    ...base,
    fontFamily: 'Baloo2-Bold',
    fontSize: 56,
    lineHeight: 64,
    textAlign: 'center',
  },
  // Muted — subdued text variant
  muted: {
    ...base,
    color: colors.textMuted,
    fontSize: 16,
    lineHeight: 22,
  },
});

