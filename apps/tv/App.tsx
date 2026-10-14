/**
 * SmartStudy AI — TV App
 * Root component. Wraps the navigator in a safe area provider and
 * applies the global background colour.
 */
import React, { useEffect } from 'react';
import { DeviceEventEmitter, StatusBar, StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation/RootNavigator';
import { colors } from './src/theme/colors';
import { tvFocusManager } from './src/utils/tvFocusManager';

export default function App() {
  useEffect(() => {
    const sub = DeviceEventEmitter.addListener('onHWKeyEvent', (evt: any) => {
      if (evt && evt.eventType) {
        tvFocusManager.handleKeyEvent(evt.eventType);
      }
    });

    return () => {
      sub.remove();
    };
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar hidden />
      <View style={styles.root}>
        <RootNavigator />
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.bg,
  },
});
