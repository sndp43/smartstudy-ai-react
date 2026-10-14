// SmartStudy TV — Deterministic TV Focus Manager
// Provides 100% reliable D-pad navigation across all TV screens and grids.
// Intercepts hardware TV remote key events and updates active focus states.

import { DeviceEventEmitter } from 'react-native';

export type FocusRegistration =
  | {
      type: 'grid';
      grid: string[][];
    }
  | {
      type: 'list';
      list: string[];
      orientation: 'horizontal' | 'vertical';
    };

let currentRegistration: FocusRegistration | null = null;
let currentFocusedKey: string | null = null;
const pressHandlers: Record<string, () => void> = {};
const backHandlers: Array<() => boolean> = [];
const listeners: Array<(focusedKey: string) => void> = [];

// Remote throttling timestamps to prevent double-skipping & auto-opening
let lastDirectionalTime = 0;
let lastActionTime = 0;
let lastRegisterTime = 0;
let lastPressTime = 0;

export const tvFocusManager = {
  register: (reg: FocusRegistration, initialFocusKey?: string) => {
    currentRegistration = reg;
    lastRegisterTime = Date.now();
    const targetKey =
      initialFocusKey ??
      (reg.type === 'grid' ? reg.grid[0]?.[0] : reg.list[0]);

    if (targetKey) {
      currentFocusedKey = targetKey;
      listeners.forEach((l) => l(targetKey));
    }
  },

  registerPressHandler: (key: string, handler: () => void) => {
    pressHandlers[key] = handler;
  },

  unregisterPressHandler: (key: string) => {
    delete pressHandlers[key];
  },

  triggerPress: (key?: string) => {
    const targetKey = key || currentFocusedKey;
    if (!targetKey) return;
    const now = Date.now();

    // Guard 1: Ignore presses during screen mount transition cooldown (prevents auto-opening)
    if (now - lastRegisterTime < 450) {
      console.log('[TVFocus] Ignored press during screen transition cooldown:', targetKey);
      return;
    }

    // Guard 2: Deduplicate rapid successive press triggers (remote select + TouchableOpacity)
    if (now - lastPressTime < 380) {
      console.log('[TVFocus] Debounced duplicate press for:', targetKey);
      return;
    }

    lastPressTime = now;
    lastActionTime = now;

    const handler = pressHandlers[targetKey];
    if (handler) {
      console.log('[TVFocus] Triggered press for:', targetKey);
      handler();
    }
  },

  registerBackHandler: (handler: () => boolean) => {
    backHandlers.unshift(handler);
    return () => {
      const idx = backHandlers.indexOf(handler);
      if (idx !== -1) backHandlers.splice(idx, 1);
    };
  },

  setFocused: (key: string) => {
    if (currentFocusedKey === key) return;
    currentFocusedKey = key;
    listeners.forEach((l) => l(key));
  },

  getCurrentFocus: () => currentFocusedKey,

  subscribe: (listener: (focusedKey: string) => void) => {
    listeners.push(listener);
    return () => {
      const idx = listeners.indexOf(listener);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  },

  handleKeyEvent: (
    eventType: 'up' | 'down' | 'left' | 'right' | 'select' | 'back' | 'playPause',
  ) => {
    const now = Date.now();

    // 1. Guard against auto-opening newly mounted screens on lingering select/enter
    if (eventType === 'select' && now - lastRegisterTime < 450) {
      console.log('[TVFocus] Ignored select during screen transition cooldown');
      return;
    }

    // 2. Throttle action buttons (select, back) — prevents double clicks & accidental launches
    if (eventType === 'select' || eventType === 'back') {
      if (now - lastActionTime < 380) {
        console.log('[TVFocus] Throttled action:', eventType, now - lastActionTime, 'ms');
        return;
      }
      lastActionTime = now;
    }

    // 3. Throttle directional keys (up, down, left, right) — 230ms safely eliminates emulator repeat bounces
    if (eventType === 'up' || eventType === 'down' || eventType === 'left' || eventType === 'right') {
      if (now - lastDirectionalTime < 230) {
        console.log('[TVFocus] Throttled directional:', eventType, now - lastDirectionalTime, 'ms');
        return;
      }
      lastDirectionalTime = now;
    }

    console.log('[TVFocus] Key:', eventType, 'Current:', currentFocusedKey);
    if (eventType === 'select') {
      tvFocusManager.triggerPress();
      return;
    }

    if (eventType === 'back') {
      for (const handler of backHandlers) {
        if (handler()) return;
      }
      return;
    }

    if (!currentRegistration || !currentFocusedKey) return;

    if (currentRegistration.type === 'list') {
      const { list, orientation } = currentRegistration;
      const idx = list.indexOf(currentFocusedKey);
      if (idx === -1) {
        if (list.length > 0) {
          tvFocusManager.setFocused(list[0]);
        }
        return;
      }

      if (orientation === 'horizontal') {
        if (eventType === 'left' && idx > 0) {
          tvFocusManager.setFocused(list[idx - 1]);
        } else if (eventType === 'right' && idx < list.length - 1) {
          tvFocusManager.setFocused(list[idx + 1]);
        }
      } else {
        if (eventType === 'up' && idx > 0) {
          tvFocusManager.setFocused(list[idx - 1]);
        } else if (eventType === 'down' && idx < list.length - 1) {
          tvFocusManager.setFocused(list[idx + 1]);
        }
      }
    } else if (currentRegistration.type === 'grid') {
      const { grid } = currentRegistration;
      let r = -1;
      let c = -1;
      for (let i = 0; i < grid.length; i++) {
        const colIdx = grid[i].indexOf(currentFocusedKey);
        if (colIdx !== -1) {
          r = i;
          c = colIdx;
          break;
        }
      }

      if (r === -1 || c === -1) {
        if (grid[0]?.[0]) {
          tvFocusManager.setFocused(grid[0][0]);
        }
        return;
      }

      if (eventType === 'up' && r > 0) {
        const targetRow = grid[r - 1];
        if (targetRow && targetRow.length > 0) {
          const targetCol = Math.min(c, targetRow.length - 1);
          tvFocusManager.setFocused(targetRow[targetCol]);
        }
      } else if (eventType === 'down' && r < grid.length - 1) {
        const targetRow = grid[r + 1];
        if (targetRow && targetRow.length > 0) {
          const targetCol = Math.min(c, targetRow.length - 1);
          tvFocusManager.setFocused(targetRow[targetCol]);
        }
      } else if (eventType === 'left' && c > 0 && grid[r]?.[c - 1]) {
        tvFocusManager.setFocused(grid[r][c - 1]);
      } else if (eventType === 'right' && c < grid[r].length - 1 && grid[r]?.[c + 1]) {
        tvFocusManager.setFocused(grid[r][c + 1]);
      }
    }
  },
};
