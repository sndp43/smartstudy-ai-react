// SmartStudy TV — Spacing & Layout Constants
// 7% horizontal + 5% vertical margins enforce TV safe zones,
// preventing content from being cut off by overscan on older TVs.

import { Dimensions } from 'react-native';

const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

const safeH = Math.round(SCREEN_W * 0.07);
const safeV = Math.round(SCREEN_H * 0.05);

const sidebarW = Math.min(Math.round(SCREEN_W * 0.22), 260);
const availableGridW = SCREEN_W - (safeH * 2) - sidebarW - 32;
const availableGridH = SCREEN_H - (safeV * 2) - 48;

export const spacing = {
  // Safe zone padding (applied to root container)
  safeH,   // 7% horizontal
  safeV,   // 5% vertical
  sidebarW,

  // Generic spacing scale
  xs: 8,
  sm: 14,
  md: 20,
  lg: 32,
  xl: 48,
  xxl: 72,

  // Focus border
  focusBorderWidth: 4,

  // Card dimensions
  homeTileW: Math.round((availableGridW - 20) / 2),  // 2-column grid
  homeTileH: Math.round((availableGridH - 20) / 2),

  chartCardW: Math.round((SCREEN_W - (safeH * 2) - 48) / 3), // 3-column grid
  chartCardH: Math.min(Math.round((SCREEN_H - (safeV * 2) - 180) / 2), 240),

  answerTileW: Math.round((SCREEN_W - (safeH * 2) - 32) / 2),
  answerTileH: Math.min(Math.round((SCREEN_H - (safeV * 2) - 400) / 2), 170),

  profileCardW: Math.min(Math.round((SCREEN_W - (safeH * 2) - 48) / 3), 280),
  profileCardH: Math.min(Math.round(SCREEN_H * 0.55), 320),

  // Screen dimensions
  screenW: SCREEN_W,
  screenH: SCREEN_H,

  // Border radius
  radiusSm: 12,
  radiusMd: 18,
  radiusLg: 24,
};

