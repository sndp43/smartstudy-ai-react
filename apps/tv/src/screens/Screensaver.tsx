// SmartStudy TV — Screensaver
// Activated after 60s of idle. Shows floating emoji letters and numbers
// drifting across the dark screen. Press any button to return.

import React, { useEffect, useRef } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';

const { width: W, height: H } = Dimensions.get('window');

const FLOAT_ITEMS = [
  'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
  '1', '2', '3', '4', '5', '6', '7', '8',
  'अ', 'आ', 'इ', 'ई', 'उ', 'ऊ',
  '🌟', '⭐', '📚', '🎯', '✨', '🌙',
];

interface FloatingItem {
  char: string;
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  size: number;
  speed: number;
}

interface ScreensaverProps {
  onWake: () => void;
}

export function Screensaver({ onWake }: ScreensaverProps) {
  const fadeIn = useRef(new Animated.Value(0)).current;
  const items = useRef<FloatingItem[]>(
    Array.from({ length: 20 }, (_, i) => ({
      char: FLOAT_ITEMS[i % FLOAT_ITEMS.length],
      x: new Animated.Value(Math.random() * W),
      y: new Animated.Value(Math.random() * H),
      opacity: new Animated.Value(0),
      size: 28 + Math.round(Math.random() * 36),
      speed: 8000 + Math.random() * 12000,
    })),
  ).current;

  useEffect(() => {
    // Fade in
    Animated.timing(fadeIn, { toValue: 1, duration: 800, useNativeDriver: true }).start();

    // Start each floating item
    items.forEach(item => startFloat(item));
  }, []);

  function startFloat(item: FloatingItem) {
    const startX = Math.random() * W;
    const startY = H + 80;
    const endY = -80;

    item.x.setValue(startX);
    item.y.setValue(startY);

    Animated.loop(
      Animated.parallel([
        Animated.timing(item.y, {
          toValue: endY,
          duration: item.speed,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(item.opacity, { toValue: 0.25 + Math.random() * 0.35, duration: 500, useNativeDriver: true }),
          Animated.timing(item.opacity, { toValue: 0, duration: 500, delay: item.speed - 1000, useNativeDriver: true }),
        ]),
      ]),
    ).start();
  }

  return (
    <TouchableOpacity
      style={styles.screen}
      onPress={onWake}
      activeOpacity={1}
    >
      <Animated.View style={[StyleSheet.absoluteFill, { opacity: fadeIn }]}>
        {items.map((item, i) => (
          <Animated.Text
            key={i}
            style={[
              styles.floatChar,
              {
                fontSize: item.size,
                transform: [
                  { translateX: item.x },
                  { translateY: item.y },
                ],
                opacity: item.opacity,
              },
            ]}
          >
            {item.char}
          </Animated.Text>
        ))}

        {/* Centre message */}
        <View style={styles.centre}>
          <Text style={styles.logoEmoji}>🎓</Text>
          <Text style={[typography.title, { color: colors.text, textAlign: 'center' }]}>
            SmartStudy AI
          </Text>
          <Text style={[typography.muted, { textAlign: 'center', marginTop: 12 }]}>
            Press any button to continue
          </Text>
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  floatChar: {
    position: 'absolute',
    color: colors.textMuted,
    fontFamily: 'Baloo2-Regular',
  },
  centre: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -160 }, { translateY: -80 }],
    width: 320,
    alignItems: 'center',
    gap: 12,
  },
  logoEmoji: {
    fontSize: 80,
    lineHeight: 96,
  },
});
