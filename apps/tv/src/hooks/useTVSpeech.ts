// SmartStudy TV — TTS (Text-to-Speech) Hook
// Configurable voice narration across the app.
// Default: NO TALK (disabled). Persistent via AsyncStorage.

import { useCallback, useEffect, useState } from 'react';
import { NativeModules } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TALK_STORAGE_KEY = 'smartstudy_tv_talk_enabled';

let ttsReady = false;
let Tts: any = null;

// Default: NO TALK (false)
let globalTalkEnabled = false;
const talkListeners: Set<(enabled: boolean) => void> = new Set();

// Load persistent preference from AsyncStorage
AsyncStorage.getItem(TALK_STORAGE_KEY)
  .then((val) => {
    if (val !== null) {
      globalTalkEnabled = val === 'true';
      talkListeners.forEach((l) => l(globalTalkEnabled));
    }
  })
  .catch(() => {});

try {
  if (NativeModules.TextToSpeech) {
    const ttsModule = require('react-native-tts');
    Tts = ttsModule.default || ttsModule;
    if (Tts && typeof Tts.getInitStatus === 'function') {
      Tts.getInitStatus()
        .then(() => {
          ttsReady = true;
          Tts.setDefaultRate(0.48, true);   // Slightly slower for kids
          Tts.setDefaultPitch(1.1);          // Slightly higher pitch, warmer
          // Prefer en-IN for Indian English accent if available
          Tts.setDefaultLanguage('en-IN').catch(() =>
            Tts.setDefaultLanguage('en-US'),
          );
        })
        .catch(() => {
          ttsReady = false;
        });
    }
  }
} catch (e) {
  console.warn('TTS native module not available:', e);
  ttsReady = false;
}

export function isTalkEnabled(): boolean {
  return globalTalkEnabled;
}

export function setTalkEnabled(enabled: boolean) {
  globalTalkEnabled = enabled;
  AsyncStorage.setItem(TALK_STORAGE_KEY, enabled ? 'true' : 'false').catch(() => {});
  talkListeners.forEach((l) => l(enabled));
  if (!enabled && ttsReady && Tts && typeof Tts.stop === 'function') {
    try {
      Tts.stop();
    } catch (e) {}
  }
}

export function toggleTalk(): boolean {
  const next = !globalTalkEnabled;
  setTalkEnabled(next);
  return next;
}

export function useTVSpeech() {
  const [talkEnabled, setTalkState] = useState(globalTalkEnabled);

  useEffect(() => {
    const listener = (val: boolean) => setTalkState(val);
    talkListeners.add(listener);
    return () => {
      talkListeners.delete(listener);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (ttsReady && Tts && typeof Tts.stop === 'function') {
        try {
          Tts.stop();
        } catch (e) {}
      }
    };
  }, []);

  const speak = useCallback((text: string, force = false) => {
    // If talk is disabled and force is false, stay quiet!
    if ((!globalTalkEnabled && !force) || !ttsReady || !text || !Tts) return;
    try {
      Tts.stop();
      Tts.speak(text);
    } catch (e) {}
  }, []);

  const stop = useCallback(() => {
    if (ttsReady && Tts && typeof Tts.stop === 'function') {
      try {
        Tts.stop();
      } catch (e) {}
    }
  }, []);

  const speakCorrect = useCallback((childName?: string) => {
    if (!globalTalkEnabled) return;
    const messages = [
      `That is correct! Well done${childName ? ', ' + childName : ''}!`,
      'Excellent! You got it right!',
      'Amazing! You are doing so well!',
      'Correct! You are a star!',
    ];
    speak(messages[Math.floor(Math.random() * messages.length)]);
  }, [speak]);

  const speakWrong = useCallback((correctAnswer: string) => {
    if (!globalTalkEnabled) return;
    speak(
      `Not quite, but that is okay! The correct answer is ${correctAnswer}. Let us try another one!`,
    );
  }, [speak]);

  const speakQuestion = useCallback((question: string, force = false) => {
    if (!globalTalkEnabled && !force) return;
    speak(question, force);
  }, [speak]);

  return {
    talkEnabled,
    setTalkEnabled,
    toggleTalk,
    speak,
    stop,
    speakCorrect,
    speakWrong,
    speakQuestion,
  };
}
