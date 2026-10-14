// SmartStudy TV — TVScrollView
// Universal auto-scrolling ScrollView for Android TV.
// Automatically scrolls any focused FocusTile into comfortable view across the entire app.

import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import {
  LayoutChangeEvent,
  LayoutRectangle,
  ScrollView,
  ScrollViewProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { tvFocusManager } from '../utils/tvFocusManager';

export interface TVScrollOffset {
  x: number;
  y: number;
}

export interface TVScrollContextValue {
  registerTileLayout: (
    key: string,
    layout: LayoutRectangle,
    parentOffsetX?: number,
    parentOffsetY?: number,
  ) => void;
  unregisterTileLayout: (key: string) => void;
}

export const TVScrollContext = createContext<TVScrollContextValue | null>(null);
export const TVScrollOffsetContext = createContext<TVScrollOffset>({ x: 0, y: 0 });

export function useTVScrollContext() {
  return useContext(TVScrollContext);
}

export function useTVScrollOffset() {
  return useContext(TVScrollOffsetContext);
}

/** Wrapper for sections/cards inside TVScrollView to properly propagate vertical & horizontal offsets to child FocusTiles */
export function TVScrollSection({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}) {
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const parentOffset = useContext(TVScrollOffsetContext);

  return (
    <View
      style={style}
      onLayout={(e) => {
        setOffset({
          x: e.nativeEvent.layout.x,
          y: e.nativeEvent.layout.y,
        });
      }}
    >
      <TVScrollOffsetContext.Provider
        value={{
          x: (parentOffset?.x ?? 0) + offset.x,
          y: (parentOffset?.y ?? 0) + offset.y,
        }}
      >
        {children}
      </TVScrollOffsetContext.Provider>
    </View>
  );
}

export interface TVScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  /** Center focused items in viewport (default true) */
  centerFocus?: boolean;
}

export const TVScrollView = forwardRef<ScrollView, TVScrollViewProps>(function TVScrollView(
  { children, horizontal = false, centerFocus = true, onLayout, ...rest },
  forwardedRef,
) {
  const scrollRef = useRef<ScrollView>(null);
  useImperativeHandle(forwardedRef, () => scrollRef.current as ScrollView);

  const tileLayouts = useRef<Record<string, { x: number; y: number; width: number; height: number }>>({});
  const viewportSize = useRef<{ width: number; height: number }>({ width: 1920, height: 1080 });

  const scrollToKey = React.useCallback(
    (key: string) => {
      const tile = tileLayouts.current[key];
      if (!tile || !scrollRef.current) return;

      if (horizontal) {
        const vw = viewportSize.current.width;
        const targetX = centerFocus
          ? Math.max(0, tile.x - Math.max(30, (vw - tile.width) / 2))
          : Math.max(0, tile.x - 40);
        scrollRef.current.scrollTo({ x: targetX, y: 0, animated: true });
      } else {
        const vh = viewportSize.current.height;
        const targetY = centerFocus
          ? Math.max(0, tile.y - Math.max(40, (vh - tile.height) / 2))
          : Math.max(0, tile.y - 40);
        scrollRef.current.scrollTo({ x: 0, y: targetY, animated: true });
      }
    },
    [horizontal, centerFocus],
  );

  const registerTileLayout = React.useCallback(
    (key: string, layout: LayoutRectangle, parentOffsetX = 0, parentOffsetY = 0) => {
      const finalX = layout.x + parentOffsetX;
      const finalY = layout.y + parentOffsetY;
      tileLayouts.current[key] = {
        x: finalX,
        y: finalY,
        width: layout.width,
        height: layout.height,
      };

      // If this tile is currently focused in tvFocusManager, scroll to it immediately!
      if (tvFocusManager.getCurrentFocus() === key) {
        scrollToKey(key);
      }
    },
    [scrollToKey],
  );

  const unregisterTileLayout = React.useCallback((key: string) => {
    delete tileLayouts.current[key];
  }, []);

  const contextValue = React.useMemo(() => ({
    registerTileLayout,
    unregisterTileLayout,
  }), [registerTileLayout, unregisterTileLayout]);

  // Auto-scroll when any child tile becomes focused via D-pad navigation
  useEffect(() => {
    const unsub = tvFocusManager.subscribe((activeKey) => {
      scrollToKey(activeKey);
    });

    return unsub;
  }, [scrollToKey]);

  const handleLayout = (e: LayoutChangeEvent) => {
    viewportSize.current = {
      width: e.nativeEvent.layout.width,
      height: e.nativeEvent.layout.height,
    };
    onLayout?.(e);
  };

  return (
    <TVScrollContext.Provider value={contextValue}>
      <ScrollView
        ref={scrollRef}
        horizontal={horizontal}
        onLayout={handleLayout}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        {...rest}
      >
        {children}
      </ScrollView>
    </TVScrollContext.Provider>
  );
});
