// SmartStudy TV — FocusTile
// The fundamental focusable card primitive used everywhere in the TV app.
// Integrates with tvFocusManager and Norigin Spatial Navigation.

import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { useTVScrollContext, useTVScrollOffset } from './TVScrollView';

interface FocusTileProps {
  focusKey: string;
  onPress: () => void;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  focusedStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  onFocus?: () => void;
  onLayout?: (event: LayoutChangeEvent) => void;
}

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export function FocusTile({
  focusKey,
  onPress,
  children,
  style,
  focusedStyle,
  disabled = false,
  onFocus,
  onLayout,
}: FocusTileProps) {
  const [isManagerFocused, setIsManagerFocused] = useState(() => {
    return tvFocusManager.getCurrentFocus() === focusKey;
  });
  const [nativeFocused, setNativeFocused] = useState(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const scrollContext = useTVScrollContext();
  const scrollOffset = useTVScrollOffset();
  const scrollContextRef = useRef(scrollContext);
  scrollContextRef.current = scrollContext;
  const lastLayoutRef = useRef<LayoutChangeEvent['nativeEvent']['layout'] | null>(null);

  // Unregister layout with enclosing TVScrollView on unmount
  useEffect(() => {
    return () => {
      scrollContextRef.current?.unregisterTileLayout(focusKey);
    };
  }, [focusKey]);

  // Update registration if parent TVScrollSection offset changes
  useEffect(() => {
    if (lastLayoutRef.current && scrollContext) {
      scrollContext.registerTileLayout(
        focusKey,
        lastLayoutRef.current,
        scrollOffset?.x ?? 0,
        scrollOffset?.y ?? 0,
      );
    }
  }, [focusKey, scrollOffset?.x, scrollOffset?.y, scrollContext]);

  const handleLayout = (e: LayoutChangeEvent) => {
    lastLayoutRef.current = e.nativeEvent.layout;
    scrollContext?.registerTileLayout(
      focusKey,
      e.nativeEvent.layout,
      scrollOffset?.x ?? 0,
      scrollOffset?.y ?? 0,
    );
    onLayout?.(e);
  };

  // Register press handler with tvFocusManager
  useEffect(() => {
    if (!disabled) {
      tvFocusManager.registerPressHandler(focusKey, onPress);
    }
    return () => {
      tvFocusManager.unregisterPressHandler(focusKey);
    };
  }, [focusKey, onPress, disabled]);

  // Listen to focus changes from tvFocusManager
  useEffect(() => {
    const unsub = tvFocusManager.subscribe((activeKey) => {
      setIsManagerFocused(activeKey === focusKey);
    });
    return unsub;
  }, [focusKey]);

  const isFocused = isManagerFocused;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: isFocused ? 1.06 : 1,
      useNativeDriver: true,
      tension: 200,
      friction: 12,
    }).start();
  }, [isFocused, scaleAnim]);

  const handlePress = () => {
    if (disabled) return;
    tvFocusManager.setFocused(focusKey);
    tvFocusManager.triggerPress(focusKey);
  };

  return (
    <AnimatedTouchable
      activeOpacity={0.85}
      onPress={disabled ? undefined : handlePress}
      onLayout={handleLayout}
      style={[
        styles.tile,
        style,
        { transform: [{ scale: scaleAnim }] },
        isFocused && styles.focused,
        isFocused && focusedStyle,
        disabled && styles.disabled,
      ]}
      accessible={true}
      focusable={false}
    >
      {children}
    </AnimatedTouchable>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: spacing.radiusLg,
    borderWidth: spacing.focusBorderWidth,
    borderColor: 'transparent',
    overflow: 'hidden',
  },
  focused: {
    borderColor: colors.focusBorder,
    shadowColor: colors.focus,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.9,
    shadowRadius: 24,
    elevation: 20,
  },
  disabled: {
    opacity: 0.4,
  },
});
