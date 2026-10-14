// SmartStudy TV — Home Screen
// 4 large D-pad-navigable tiles: Today's Challenge, Learning Charts,
// Practice Mode, Trophy Room. Left sidebar shows child name, star count, clock.

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../components/FocusTile';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { api, Child, Dashboard } from '../hooks/useAPI';
import { useIdleTimer } from '../hooks/useIdleTimer';
import { useTVSpeech } from '../hooks/useTVSpeech';
import { Screensaver } from './Screensaver';

interface HomeTile {
  key: string;
  emoji: string;
  label: string;
  sub: string;
  bg: string;
  glow: string;
}

const TILES: HomeTile[] = [
  {
    key: 'challenge',
    emoji: '🌟',
    label: "Today's Challenge",
    sub: 'Practise your weakest skill',
    bg: '#2D1B69',
    glow: '#7C3AED',
  },
  {
    key: 'charts',
    emoji: '📚',
    label: 'Learning Charts',
    sub: 'Tables, Alphabets & Swar',
    bg: '#1E3A5F',
    glow: '#2563EB',
  },
  {
    key: 'practice',
    emoji: '🎯',
    label: 'Practice Mode',
    sub: 'Pick any skill to practise',
    bg: '#78350F',
    glow: '#D97706',
  },
  {
    key: 'trophy',
    emoji: '🏆',
    label: 'Trophy Room',
    sub: 'Stars earned & streaks',
    bg: '#1C2538',
    glow: '#B45309',
  },
];

interface HomeProps {
  child: Child;
  onNavigate: (destination: 'challenge' | 'charts' | 'practice' | 'trophy') => void;
  onBack?: () => void;
}

function LiveClock() {
  const [time, setTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const d = new Date();
      setTime(d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true }));
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return <Text style={[typography.caption, { color: colors.textDim }]}>🕐 {time}</Text>;
}

export function Home({ child, onNavigate, onBack }: HomeProps) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [showScreensaver, setShowScreensaver] = useState(false);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const { talkEnabled, toggleTalk } = useTVSpeech();

  useEffect(() => {
    if (onBack) {
      return tvFocusManager.registerBackHandler(() => {
        onBack();
        return true;
      });
    }
  }, [onBack]);

  useEffect(() => {
    tvFocusManager.register(
      {
        type: 'grid',
        grid: [
          ['btn-toggle-voice', 'tile-challenge', 'tile-charts'],
          ['btn-logout', 'tile-practice', 'tile-trophy'],
        ],
      },
      'tile-challenge',
    );
  }, []);

  // Load dashboard for star count
  useEffect(() => {
    api.getDashboard(child.id).then(setDashboard).catch(console.warn);
  }, [child.id]);

  // Gold pulse on star count
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.15, duration: 1200, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();
  }, [pulseAnim]);

  // Screensaver after 60s idle
  const { resetIdle } = useIdleTimer(
    () => setShowScreensaver(true),
    () => setShowScreensaver(false),
  );

  if (showScreensaver) {
    return <Screensaver onWake={() => setShowScreensaver(false)} />;
  }

  const stars = dashboard?.skills
    ? Math.round(dashboard.skills.reduce((acc: number, s: any) => acc + (s.mastery_score || 0), 0) / Math.max(dashboard.skills.length, 1))
    : 0;

  return (
    <SafeAreaView style={styles.screen}>
      {/* Star particles */}
      <View style={styles.particles} pointerEvents="none">
        {Array.from({ length: 40 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.particle,
              {
                left: `${(i * 47 + 13) % 100}%` as any,
                top: `${(i * 67 + 7) % 100}%` as any,
                width: i % 4 === 0 ? 5 : 2,
                height: i % 4 === 0 ? 5 : 2,
                opacity: 0.1 + (i % 6) * 0.06,
              },
            ]}
          />
        ))}
      </View>

      <View style={styles.layout}>
        {/* LEFT SIDEBAR */}
        <View style={styles.sidebar}>
          <Text style={styles.logo}>🎓</Text>
          <Text style={[typography.heading, { color: colors.text }]} numberOfLines={1}>
            SmartStudy
          </Text>
          <Text style={[typography.tiny, { color: colors.focusBorder }]}>AI</Text>

          <View style={styles.divider} />

          {/* Child name */}
          <Text style={[typography.muted, { textAlign: 'center' }]}>Hello,</Text>
          <Text style={[typography.heading, { textAlign: 'center', color: colors.gold }]} numberOfLines={1}>
            {child.name.split(' ')[0]}! 👋
          </Text>

          <View style={styles.divider} />

          {/* Star count */}
          <Animated.View style={[styles.starBadge, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.starEmoji}>⭐</Text>
            <Text style={[typography.heading, { color: colors.gold }]}>{stars}</Text>
          </Animated.View>
          <Text style={[typography.tiny, { color: colors.textDim }]}>Stars earned</Text>

          <View style={styles.spacer} />

          {/* Voice narration toggle */}
          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[
              styles.voiceToggle,
              talkEnabled && styles.voiceToggleOn,
            ]}
          >
            <Text style={[typography.caption, { color: talkEnabled ? colors.gold : colors.textMuted, fontWeight: '700' }]}>
              {talkEnabled ? '🔊 Voice: ON' : '🔇 Voice: OFF'}
            </Text>
          </FocusTile>

          {/* Clock */}
          <LiveClock />

          {/* Switch Profile / Logout */}
          <FocusTile
            focusKey="btn-logout"
            onPress={() => onBack?.()}
            style={styles.logoutBtn}
          >
            <Text style={[typography.caption, { color: colors.textMuted, fontSize: 13, fontWeight: '600' }]}>
              👤 Switch Kid / Logout
            </Text>
          </FocusTile>
        </View>

        {/* RIGHT — TILES 2x2 GRID */}
        <View style={styles.grid}>
          <View style={styles.gridRow}>
            {[TILES[0], TILES[1]].map((tile) => (
              <FocusTile
                key={tile.key}
                focusKey={`tile-${tile.key}`}
                onPress={() => onNavigate(tile.key as any)}
                style={[styles.tile, { backgroundColor: tile.bg }]}
              >
                <View style={[styles.tileGlow, { backgroundColor: tile.glow + '22' }]} />
                <Text style={styles.tileEmoji}>{tile.emoji}</Text>
                <Text style={[typography.title, styles.tileLabel]}>{tile.label}</Text>
                <Text style={[typography.caption, { textAlign: 'center' }]}>{tile.sub}</Text>
              </FocusTile>
            ))}
          </View>
          <View style={styles.gridRow}>
            {[TILES[2], TILES[3]].map((tile) => (
              <FocusTile
                key={tile.key}
                focusKey={`tile-${tile.key}`}
                onPress={() => onNavigate(tile.key as any)}
                style={[styles.tile, { backgroundColor: tile.bg }]}
              >
                <View style={[styles.tileGlow, { backgroundColor: tile.glow + '22' }]} />
                <Text style={styles.tileEmoji}>{tile.emoji}</Text>
                <Text style={[typography.title, styles.tileLabel]}>{tile.label}</Text>
                <Text style={[typography.caption, { textAlign: 'center' }]}>{tile.sub}</Text>
              </FocusTile>
            ))}
          </View>
        </View>
      </View>

      {/* Bottom hint */}
      <View style={styles.hintBar}>
        <Text style={[typography.tiny, { color: colors.textDim }]}>
          Use D-pad to navigate  •  OK to select  •  Toggle Voice in sidebar (←)
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
  particles: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
  },
  particle: {
    position: 'absolute',
    borderRadius: 50,
    backgroundColor: colors.gold,
  },
  layout: {
    flex: 1,
    flexDirection: 'row',
    paddingHorizontal: spacing.safeH,
    paddingTop: spacing.safeV,
    gap: spacing.lg,
    alignItems: 'center',
  },
  sidebar: {
    width: spacing.sidebarW,
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  logo: {
    fontSize: 32,
    lineHeight: 40,
  },
  divider: {
    width: '80%',
    height: 1,
    backgroundColor: colors.surfaceHigh,
    marginVertical: spacing.xs,
  },
  starBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  starEmoji: {
    fontSize: 22,
    lineHeight: 28,
  },
  spacer: { flex: 1 },
  voiceToggle: {
    backgroundColor: colors.surfaceCard,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    marginVertical: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  voiceToggleOn: {
    backgroundColor: 'rgba(124, 58, 237, 0.4)',
    borderColor: colors.gold,
  },
  logoutBtn: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: spacing.radiusSm,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  grid: {
    flex: 1,
    flexDirection: 'column',
    gap: spacing.md,
    justifyContent: 'center',
  },
  gridRow: {
    flex: 1,
    flexDirection: 'row',
    gap: spacing.md,
  },
  tile: {
    flex: 1,
    borderRadius: spacing.radiusLg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.xs,
    padding: spacing.md,
    overflow: 'hidden',
  },
  tileGlow: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: spacing.radiusLg,
  },
  tileEmoji: {
    fontSize: 40,
    lineHeight: 48,
  },
  tileLabel: {
    color: colors.text,
    textAlign: 'center',
  },
  hintBar: {
    alignItems: 'center',
    paddingBottom: spacing.xs,
  },
});
