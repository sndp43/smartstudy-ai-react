# 📺 SmartStudy AI — Android TV App

> **A 10-Foot Living Room Learning Experience for Kids**  
> Companion TV app for the SmartStudy AI platform, designed for D-pad remote navigation, high-contrast big-screen readability, audio praise/TTS, and offline resilience.

---

## 🌟 Key Highlights

- **10-Foot UI/UX Paradigm**: 
  - 5% safe-zone margins (`spacing.safeH = 64px`, `spacing.safeV = 48px`) preventing overscan clipping on TVs.
  - Large font hierarchy (72px titles, 38px questions, 28px answer labels) readable from 10 feet away.
  - Glowing violet focus rings (`#8B5CF6`) and spring-scaling animations (`1.06x`) for clear visual focus.
- **D-Pad Spatial Navigation**: Full remote control navigation powered by `@noriginmedia/norigin-spatial-navigation` with automatic 2D directional physics (Up / Down / Left / Right / OK / Back).
- **Audio & TTS Feedback**: Integrated Text-to-Speech (`react-native-tts`) to read questions aloud and speak positive praise ("*Awesome job, Anya!*", "*Super star!*") and corrective hints.
- **Celebration VFX**: Physics-based `StarBurst` particle animations bursting emoji stars across the screen on correct answers and episode milestones.
- **Offline Resilient**: Local storage caching (`@react-native-async-storage/async-storage`) with stale-while-revalidate pattern so children can practice even when the internet drops.
- **Idle Screensaver**: Auto-activates after 60 seconds of inactivity with soothing floating emoji and letters, waking instantly on any remote keypress.

---

## 📁 Project Architecture

```
apps/tv/
├── android/                   # Native Android TV build files
│   └── app/src/main/
│       └── AndroidManifest.xml # Declares LEANBACK_LAUNCHER, TV banner & removes touch requirement
├── src/
│   ├── components/            # TV-specific interactive primitives
│   │   ├── AnswerGrid.tsx     # 2×2 / 2×1 D-pad navigable answer choices with feedback
│   │   ├── FocusTile.tsx      # Core focusable card wrapper (spring scale + glow border)
│   │   └── StarBurst.tsx      # Full-screen star celebration animation
│   ├── hooks/                 # Business logic & hardware integrations
│   │   ├── useAPI.ts          # Connects to Laravel API (same endpoints as web)
│   │   ├── useIdleTimer.ts    # 60s inactivity detector for screensaver
│   │   ├── useOfflineCache.ts # AsyncStorage caching with stale-while-revalidate
│   │   └── useTVSpeech.ts     # Speech synthesis & randomized praise engine
│   ├── navigation/
│   │   └── RootNavigator.tsx  # TV state-machine router (Profile -> Home -> Practice -> etc.)
│   ├── screens/               # TV screens
│   │   ├── ProfileSelect.tsx  # Kid profile picker with avatar tiles
│   │   ├── Home.tsx           # 4-tile dashboard (Today's Challenge, Charts, Practice, Trophies)
│   │   ├── PracticePicker.tsx # Skill browser sorted by mastery score
│   │   ├── PracticeEpisode.tsx# Game-show style 10-question practice run
│   │   ├── EpisodeComplete.tsx# Episode score breakdown & star reward screen
│   │   ├── LearningCharts.tsx # Interactive learning chart browser
│   │   └── Screensaver.tsx    # Floating letters & numbers idle animation
│   └── theme/
│       ├── colors.ts          # Dark slate & high-contrast TV palette
│       ├── spacing.ts         # 10-foot overscan-safe margins & tile dimensions
│       └── typography.ts      # 1080p-optimized font sizes
├── App.tsx                    # Root wrapper with SafeAreaProvider & status bar hidden
└── babel.config.js            # Reanimated plugin configuration
```

---

## 🎮 Remote Control Key Mapping

| Remote Button | Android Keycode | TV App Behavior |
|---|---|---|
| **D-Pad Up / Down / Left / Right** | `DPAD_UP / DOWN / LEFT / RIGHT` | Moves active focus tile with glowing violet border |
| **Center / OK / Select** | `DPAD_CENTER` / `ENTER` | Selects option / Submits answer / Confirms action |
| **Back Button** | `BACK` (`KEYCODE_BACK`) | Returns to previous screen / Wakes screensaver |
| **Play / Pause / Any Key** | Any | Wakes from idle screensaver |

---

## 🚀 Running the TV App

### Prerequisites
- Node.js 18+
- Android SDK (API 33+) & Android TV Emulator (or physical Android TV / Fire TV device)
- React Native environment configured

### 1. Start Metro Bundler
From workspace root:
```bash
npm run tv:start
```

### 2. Run on Android TV Device / Emulator
Ensure your Android TV emulator or physical device is connected via ADB:
```bash
# Check ADB connection
adb devices

# Launch on Android TV
npm run tv:android
```

### 3. Connect via WiFi to Physical Android TV (e.g. Sony, Mi TV, OnePlus TV, Fire TV)
1. Enable **Developer Options** and **USB / Network Debugging** on the TV.
2. Find the TV's IP address (e.g. `192.168.1.50`).
3. Connect your computer to the TV:
   ```bash
   adb connect 192.168.1.50:5555
   npm run tv:android
   ```

### 4. Build Release APK for Sideloading
```bash
npm run tv:android-release
```
The resulting APK will be generated at `apps/tv/android/app/build/outputs/apk/release/app-release.apk`.
