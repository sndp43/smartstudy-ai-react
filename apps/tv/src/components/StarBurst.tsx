// SmartStudy TV — StarBurst
// Full-screen celebration animation shown after a correct answer or episode complete.
// Uses React Native Animated to burst 20 stars from centre, then fade out.

import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, StyleSheet, Text, View } from 'react-native';

const { width: W, height: H } = Dimensions.get('window');

const STARS = ['⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨', '💫', '⭐', '🌟',
               '⭐', '🌟', '✨', '💫', '⭐', '🌟', '✨', '💫', '⭐', '🌟'];
const STAR_COUNT = STARS.length;

interface StarParticle {
  x: Animated.Value;
  y: Animated.Value;
  opacity: Animated.Value;
  scale: Animated.Value;
  rotation: Animated.Value;
}

interface StarBurstProps {
  visible: boolean;
  onComplete?: () => void;
}

export function StarBurst({ visible, onComplete }: StarBurstProps) {
  const particles = useRef<StarParticle[]>(
    Array.from({ length: STAR_COUNT }, () => ({
      x: new Animated.Value(0),
      y: new Animated.Value(0),
      opacity: new Animated.Value(0),
      scale: new Animated.Value(0),
      rotation: new Animated.Value(0),
    })),
  ).current;

  const containerOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      containerOpacity.setValue(0);
      particles.forEach(p => {
        p.opacity.setValue(0);
        p.x.setValue(0);
        p.y.setValue(0);
        p.scale.setValue(0);
      });
      return;
    }

    containerOpacity.setValue(1);

    const anims = particles.map((p, i) => {
      const angle = (i / STAR_COUNT) * 2 * Math.PI;
      const radius = 200 + Math.random() * 300;
      const targetX = Math.cos(angle) * radius;
      const targetY = Math.sin(angle) * radius;
      const delay = Math.random() * 150;

      p.x.setValue(0);
      p.y.setValue(0);
      p.opacity.setValue(0);
      p.scale.setValue(0);
      p.rotation.setValue(0);

      return Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.spring(p.x, { toValue: targetX, useNativeDriver: true, tension: 40, friction: 8 }),
          Animated.spring(p.y, { toValue: targetY, useNativeDriver: true, tension: 40, friction: 8 }),
          Animated.sequence([
            Animated.timing(p.opacity, { toValue: 1, duration: 100, useNativeDriver: true }),
            Animated.timing(p.opacity, { toValue: 0, duration: 600, delay: 400, useNativeDriver: true }),
          ]),
          Animated.spring(p.scale, { toValue: 1 + Math.random() * 0.8, useNativeDriver: true, tension: 60, friction: 6 }),
          Animated.timing(p.rotation, { toValue: 360 * (Math.random() > 0.5 ? 1 : -1), duration: 800, useNativeDriver: true }),
        ]),
      ]);
    });

    Animated.parallel(anims).start(() => {
      containerOpacity.setValue(0);
      onComplete?.();
    });
  }, [visible]);

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, { opacity: containerOpacity }]} pointerEvents="none">
      {particles.map((p, i) => {
        const rotate = p.rotation.interpolate({ inputRange: [0, 360], outputRange: ['0deg', '360deg'] });
        return (
          <Animated.Text
            key={i}
            style={[
              styles.star,
              {
                transform: [
                  { translateX: p.x },
                  { translateY: p.y },
                  { scale: p.scale },
                  { rotate },
                ],
                opacity: p.opacity,
              },
            ]}
          >
            {STARS[i]}
          </Animated.Text>
        );
      })}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    pointerEvents: 'none',
  },
  star: {
    position: 'absolute',
    fontSize: 48,
  },
});
