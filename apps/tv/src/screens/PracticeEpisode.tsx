// SmartStudy TV — Practice Episode Screen
// Game-show style Q&A: fetches exercises for a skill, shows them one by one,
// tracks score, plays TTS, and shows StarBurst on correct answers.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  BackHandler,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { FocusTile } from '../components/FocusTile';
import { TVScrollView, TVScrollSection } from '../components/TVScrollView';
import { AnswerGrid, AnswerOption } from '../components/AnswerGrid';
import { StarBurst } from '../components/StarBurst';
import { colors } from '../theme/colors';
import { typography } from '../theme/typography';
import { spacing } from '../theme/spacing';
import { tvFocusManager } from '../utils/tvFocusManager';
import { api, Child, Exercise, Skill } from '../hooks/useAPI';
import { useTVSpeech } from '../hooks/useTVSpeech';
import { useOfflineCache } from '../hooks/useOfflineCache';

const EPISODE_SIZE = 10;

interface PracticeEpisodeProps {
  child: Child;
  skill: Skill;
  onEpisodeComplete: (score: number, total: number) => void;
  onBack: () => void;
}

function shuffleArray<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function PracticeEpisode({ child, skill, onEpisodeComplete, onBack }: PracticeEpisodeProps) {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [index, setIndex] = useState(0);
  const [selectedValue, setSelectedValue] = useState<string | null>(null);
  const [correctValue, setCorrectValue] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showBurst, setShowBurst] = useState(false);
  const { talkEnabled, toggleTalk, speakCorrect, speakWrong, speakQuestion } = useTVSpeech();
  const { fetchWithCache } = useOfflineCache();
  const resultShown = useRef(false);

  // Load exercises
  useEffect(() => {
    fetchWithCache(
      `exercises-${skill.id}`,
      () => api.getExercises(skill.id, skill.table_range),
      (data) => {
        const shuffled = shuffleArray(data).slice(0, EPISODE_SIZE);
        const mapped: Exercise[] = (shuffled as any[]).map(ex => ({
          id: String(ex.id),
          skillId: String(ex.skill_id ?? ex.skillId ?? skill.id),
          skillName: String(ex.skill_name ?? ex.skillName ?? skill.name),
          question: String(ex.question ?? ''),
          question_type: String(ex.question_type ?? ex.questionType ?? 'multiple_choice'),
          questionType: String(ex.question_type ?? ex.questionType ?? 'multiple_choice'),
          correct_answer: String(ex.correct_answer ?? ex.correctAnswer ?? ''),
          correctAnswer: String(ex.correct_answer ?? ex.correctAnswer ?? ''),
          explanation: ex.explanation,
          image_url: ex.image_url,
          image_question: ex.image_question,
          options: shuffleArray(
            Array.isArray(ex.options)
              ? ex.options.map((o: any) => String(o))
              : typeof ex.options === 'string'
              ? JSON.parse(ex.options).map((o: any) => String(o))
              : []
          ),
        }));
        setExercises(mapped);
        setLoading(false);
        setTimeout(() => tvFocusManager.setFocused('ANSWER_GRID-answer-0'), 300);
        if (mapped[0]) speakQuestion(mapped[0].question);
      },
    ).catch(() => setLoading(false));
  }, [skill.id]);

  // Hardware back button
  useEffect(() => {
    const unregister = tvFocusManager.registerBackHandler(() => {
      onBack();
      return true;
    });
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      onBack();
      return true;
    });
    return () => {
      unregister();
      sub.remove();
    };
  }, [onBack]);

  const current = exercises[index];

  // Register combined focus grid including top bar controls
  useEffect(() => {
    if (!current || !current.options.length) return;
    if (current.options.length === 4) {
      tvFocusManager.register(
        {
          type: 'grid',
          grid: [
            ['btn-toggle-voice', 'btn-read-aloud'],
            ['ANSWER_GRID-answer-0', 'ANSWER_GRID-answer-1'],
            ['ANSWER_GRID-answer-2', 'ANSWER_GRID-answer-3'],
          ],
        },
        'ANSWER_GRID-answer-0',
      );
    } else {
      tvFocusManager.register(
        {
          type: 'grid',
          grid: [
            ['btn-toggle-voice', 'btn-read-aloud'],
            current.options.map((_, i) => `ANSWER_GRID-answer-${i}`),
          ],
        },
        'ANSWER_GRID-answer-0',
      );
    }
  }, [current, index]);

  const handleAnswer = useCallback(async (value: string) => {
    if (resultShown.current || !current) return;
    resultShown.current = true;
    setSelectedValue(value);

    // Ground truth correct answer from exercise
    const expectedAnswer = String(current.correctAnswer || current.correct_answer || '').trim();
    const isLocallyCorrect = expectedAnswer
      ? value.trim().toLowerCase() === expectedAnswer.toLowerCase()
      : false;

    // Reveal correct answer so AnswerGrid shows ✅ on expectedAnswer and ❌ on selectedValue (if wrong)
    setCorrectValue(expectedAnswer);

    let isCorrect = isLocallyCorrect;

    try {
      const result = await api.submitAttempt(child.id, current.id, value);
      if (result && typeof result.correct === 'boolean') {
        isCorrect = result.correct;
      }
    } catch {
      // Offline fallback: rely on isLocallyCorrect
    }

    if (isCorrect) {
      setScore(s => s + 1);
      setShowBurst(true);
      speakCorrect(child.name.split(' ')[0]);
    } else {
      setShowBurst(false);
      speakWrong(expectedAnswer);
    }

    // Advance after 2.5s
    setTimeout(() => {
      resultShown.current = false;
      setShowBurst(false);
      if (index + 1 >= exercises.length) {
        onEpisodeComplete(score + (isCorrect ? 1 : 0), exercises.length);
      } else {
        const next = exercises[index + 1];
        setIndex(i => i + 1);
        setSelectedValue(null);
        setCorrectValue(null);
        setTimeout(() => tvFocusManager.setFocused('ANSWER_GRID-answer-0'), 100);
        if (next) speakQuestion(next.question);
      }
    }, 2500);
  }, [current, index, exercises, score, child, speakCorrect, speakWrong, onEpisodeComplete]);

  if (loading || !current) {
    return (
      <View style={styles.center}>
        <Text style={typography.heading}>Loading questions…</Text>
      </View>
    );
  }

  const options: AnswerOption[] = current.options.map((opt: string) => ({
    label: opt,
    value: opt,
  }));

  const progressPct = ((index) / exercises.length) * 100;

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <View style={styles.starPill}>
          <Text style={styles.starEmoji}>⭐</Text>
          <Text style={[typography.body, { color: colors.gold }]}>{score} Stars</Text>
        </View>

        <View style={styles.progressWrapper}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPct}%` as any }]} />
          </View>
          <Text style={[typography.caption, { color: colors.textMuted }]}>
            Question {index + 1} of {exercises.length}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: spacing.sm, alignItems: 'center' }}>
          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[styles.voiceBtn, talkEnabled && styles.voiceBtnActive]}
          >
            <Text
              style={[
                typography.caption,
                { color: talkEnabled ? colors.gold : colors.textMuted, fontWeight: '700' },
              ]}
            >
              {talkEnabled ? '🔊 Voice: ON' : '🔇 Voice: OFF'}
            </Text>
          </FocusTile>

          <FocusTile
            focusKey="btn-read-aloud"
            onPress={() => speakQuestion(current.question, true)}
            style={styles.speakBtn}
          >
            <Text style={styles.speakEmoji}>🔊</Text>
            <Text style={[typography.caption, { color: colors.focusBorder }]}>Read Aloud</Text>
          </FocusTile>
        </View>
      </View>

      <TVScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* ── QUESTION ── */}
        <TVScrollSection style={styles.questionArea}>
          <Text style={[typography.title, styles.questionText]} numberOfLines={4}>
            {current.question}
          </Text>
        </TVScrollSection>

        {/* ── ANSWERS ── */}
        <TVScrollSection style={styles.answerArea}>
          <AnswerGrid
            focusKey="ANSWER_GRID"
            options={options}
            selectedValue={selectedValue}
            correctValue={correctValue}
            onSelect={handleAnswer}
            disabled={!!correctValue}
            skipRegister={true}
          />
        </TVScrollSection>
      </TVScrollView>

      {/* ── HINT ── */}
      <View style={styles.hintBar}>
        <Text style={[typography.tiny, { color: colors.textDim }]}>
          D-pad to select  •  OK to answer  •  🔊 to hear question
        </Text>
      </View>

      {/* ── STAR BURST ── */}
      <StarBurst visible={showBurst} onComplete={() => setShowBurst(false)} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  center: {
    flex: 1,
    backgroundColor: colors.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.safeH,
    paddingTop: spacing.safeV,
    paddingBottom: spacing.sm,
  },
  starPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    backgroundColor: colors.surfaceCard,
    borderRadius: 40,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },
  starEmoji: { fontSize: 28, lineHeight: 36 },
  progressWrapper: {
    flex: 1,
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.lg,
  },
  progressTrack: {
    width: '80%',
    height: 8,
    backgroundColor: colors.surfaceHigh,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.focus,
    borderRadius: 4,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: spacing.md,
  },
  voiceBtn: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surfaceCard,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtnActive: {
    borderColor: colors.gold,
    backgroundColor: 'rgba(255, 215, 0, 0.12)',
  },
  speakBtn: {
    alignItems: 'center',
    gap: 4,
    padding: spacing.sm,
    borderRadius: spacing.radiusMd,
    backgroundColor: colors.surfaceCard,
  },
  speakEmoji: { fontSize: 28, lineHeight: 36 },
  questionArea: {
    minHeight: 120,
    paddingHorizontal: spacing.safeH,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  questionText: {
    textAlign: 'center',
    color: colors.text,
  },
  answerArea: {
    paddingBottom: spacing.lg,
  },
  hintBar: {
    alignItems: 'center',
    paddingBottom: spacing.sm,
  },
});
