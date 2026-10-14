// SmartStudy TV — Idle Timer Hook
// Fires a callback after the user hasn't pressed any remote button
// for IDLE_TIMEOUT_MS (default 60s), triggering the screensaver.

import { useCallback, useEffect, useRef } from 'react';
import { BackHandler } from 'react-native';

const IDLE_TIMEOUT_MS = 60_000; // 60 seconds

export function useIdleTimer(onIdle: () => void, onActive?: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isIdleRef = useRef(false);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);

    if (isIdleRef.current) {
      // User came back from idle
      isIdleRef.current = false;
      onActive?.();
    }

    timerRef.current = setTimeout(() => {
      isIdleRef.current = true;
      onIdle();
    }, IDLE_TIMEOUT_MS);
  }, [onIdle, onActive]);

  useEffect(() => {
    // Start the initial timer
    reset();

    // Listen to TV remote events if available
    let tvHandler: any = null;
    try {
      const ReactNative = require('react-native');
      const TVEventHandler = ReactNative.TVEventHandler || ReactNative.useTVEventHandler;
      if (TVEventHandler && typeof TVEventHandler === 'function') {
        tvHandler = new TVEventHandler();
        if (tvHandler.enable) {
          tvHandler.enable(null, (_: any, event: any) => {
            if (event?.eventType) reset();
          });
        }
      }
    } catch {
      // Non-TV / dev environment fallback
    }

    const backSub = BackHandler.addEventListener('hardwareBackPress', () => {
      reset();
      return false;
    });

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (tvHandler?.disable) tvHandler.disable();
      backSub.remove();
    };
  }, [reset]);

  return { resetIdle: reset };
}
