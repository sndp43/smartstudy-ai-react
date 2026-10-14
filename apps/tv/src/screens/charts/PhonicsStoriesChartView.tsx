// SmartStudy TV — Phonics Stories & Decodable Readers Screen
// Designed for Android TV (10-foot experience) with D-pad navigation,
// large Grade 1 typography, voice narration, decodable word sounding,
// and interactive comprehension check.

import React, { useEffect, useRef, useState } from 'react';
import {
  BackHandler,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { FocusTile } from '../../components/FocusTile';
import { TVScrollView, TVScrollSection } from '../../components/TVScrollView';
import { colors } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing } from '../../theme/spacing';
import { tvFocusManager } from '../../utils/tvFocusManager';
import { useTVSpeech } from '../../hooks/useTVSpeech';
import {
  GRADE1_PHONICS_STORIES,
  PHONICS_PAGE_IMAGES,
  PHONICS_STORY_IMAGES,
  PhonicsStoryItem,
} from '../../data/phonicsStoriesData';

interface PhonicsStoriesChartViewProps {
  childId: string;
  onBack: () => void;
}

export function PhonicsStoriesChartView({ childId, onBack }: PhonicsStoriesChartViewProps) {
  const { talkEnabled, toggleTalk, speak, stop } = useTVSpeech();

  const [selectedStoryId, setSelectedStoryId] = useState<string>('pat-the-cat');
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const [showMarathi, setShowMarathi] = useState<boolean>(true);
  const [isReadingAloud, setIsReadingAloud] = useState<boolean>(false);
  const [quizAnswers, setQuizAnswers] = useState<Record<string, string>>({});

  const reciteTimerRef = useRef<any>(null);

  const currentStory: PhonicsStoryItem =
    GRADE1_PHONICS_STORIES.find((s) => s.id === selectedStoryId) || GRADE1_PHONICS_STORIES[0];

  const currentPage = currentStory.pages[currentPageIndex] || currentStory.pages[0];

  // Hardware Back Handler
  useEffect(() => {
    const unregister = tvFocusManager.registerBackHandler(() => {
      stop();
      onBack();
      return true;
    });
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      stop();
      onBack();
      return true;
    });
    return () => {
      unregister();
      sub.remove();
      stop();
    };
  }, [onBack, stop]);

  // Reset page when story changes
  useEffect(() => {
    setCurrentPageIndex(0);
    setQuizAnswers({});
    stop();
    setIsReadingAloud(false);
  }, [selectedStoryId, stop]);

  // Register TV Focus Grid
  useEffect(() => {
    const grid: string[][] = [];

    // Row 0: Header controls
    grid.push(['btn-toggle-voice', 'btn-toggle-marathi', 'btn-back']);

    // Row 1: Story shelf tabs
    grid.push(GRADE1_PHONICS_STORIES.map((_, idx) => `story-tab-${idx}`));

    // Row 2: Sound-out words
    if (currentStory.decodableWords.length > 0) {
      grid.push(currentStory.decodableWords.map((_, idx) => `btn-sound-${idx}`));
    }

    // Row 3: Read aloud page
    grid.push(['btn-read-page']);

    // Row 4: Page navigation buttons
    grid.push(['btn-page-prev', 'btn-page-next']);

    // Rows 5+: Quiz questions
    currentStory.quiz.forEach((q, qIdx) => {
      grid.push(q.options.map((_, optIdx) => `btn-quiz-${qIdx}-${optIdx}`));
    });

    const activeStoryIdx = GRADE1_PHONICS_STORIES.findIndex((s) => s.id === currentStory.id);
    const initialKey = activeStoryIdx >= 0 ? `story-tab-${activeStoryIdx}` : 'story-tab-0';
    tvFocusManager.register({ type: 'grid', grid }, initialKey);
  }, [currentStory, currentPageIndex]);

  const handleReadPage = () => {
    setIsReadingAloud(true);
    speak(currentPage.text);
    setTimeout(() => {
      setIsReadingAloud(false);
    }, Math.max(3000, currentPage.text.length * 85));
  };

  const handleSoundWord = (word: string) => {
    speak(word);
  };

  const handleSelectAnswer = (qId: string, choice: string, correct: string) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: choice }));
    if (choice === correct) {
      speak('Correct! Wonderful job sounding out the word!');
    } else {
      speak('Not quite. Sound out the letters and try again!');
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      {/* ── TOP HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={typography.title}>📖 Grade 1 Phonics Stories</Text>
          <Text style={[typography.muted, { marginTop: 2 }]}>
            Decodable reading adventures with sound-out practice &amp; comprehension
          </Text>
        </View>

        <View style={styles.headerControls}>
          <FocusTile
            focusKey="btn-toggle-voice"
            onPress={toggleTalk}
            style={[styles.ctrlBtn, talkEnabled ? styles.ctrlBtnActive : styles.ctrlBtnOff]}
          >
            <Text style={[typography.caption, { fontWeight: '700', color: talkEnabled ? '#000' : colors.textMuted }]}>
              {talkEnabled ? '🔊 Voice: ON' : '🔇 Voice: OFF'}
            </Text>
          </FocusTile>

          <FocusTile
            focusKey="btn-toggle-marathi"
            onPress={() => setShowMarathi((prev) => !prev)}
            style={styles.ctrlBtn}
          >
            <Text style={[typography.caption, { fontWeight: '700', color: '#fff' }]}>
              {showMarathi ? 'मराठी ON' : 'मराठी OFF'}
            </Text>
          </FocusTile>

          <FocusTile
            focusKey="btn-back"
            onPress={onBack}
            style={[styles.ctrlBtn, { backgroundColor: 'rgba(255,255,255,0.12)' }]}
          >
            <Text style={[typography.caption, { color: '#fff', fontWeight: '700' }]}>
              ← Back
            </Text>
          </FocusTile>
        </View>
      </View>

      <TVScrollView style={styles.scrollContent}>
        {/* ── STORY SHELF ROW ── */}
        <TVScrollSection style={styles.shelfSection}>
          <Text style={[typography.heading, { color: colors.gold, marginBottom: spacing.sm }]}>
            📚 Choose a Decodable Story:
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.shelfRow}>
            {GRADE1_PHONICS_STORIES.map((story, sIdx) => {
              const isSelected = story.id === currentStory.id;
              return (
                <FocusTile
                  key={story.id}
                  focusKey={`story-tab-${sIdx}`}
                  onPress={() => setSelectedStoryId(story.id)}
                  style={[
                    styles.storyTile,
                    isSelected && { borderColor: colors.focus, backgroundColor: 'rgba(76, 29, 149, 0.45)' },
                  ]}
                >
                  <Image
                    source={PHONICS_STORY_IMAGES[story.id] || PHONICS_STORY_IMAGES['pat-the-cat']}
                    style={styles.shelfStoryImage}
                    resizeMode="cover"
                  />
                  <Text style={[typography.body, { fontWeight: '800', color: '#fff' }]} numberOfLines={1}>
                    {story.title}
                  </Text>
                  <Text style={[typography.tiny, { color: colors.gold, fontWeight: '700' }]}>
                    {story.targetVowel}
                  </Text>
                  <Text style={[typography.tiny, { color: colors.textMuted }]} numberOfLines={1}>
                    {story.marathiTitle}
                  </Text>
                </FocusTile>
              );
            })}
          </ScrollView>
        </TVScrollSection>

        {/* ── ACTIVE STORY STAGE ── */}
        <TVScrollSection style={[styles.stageCard, { borderLeftColor: currentStory.color }]}>
          {/* Story Meta Header */}
          <View style={styles.storyMetaRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <Text style={{ fontSize: 38 }}>{currentStory.icon}</Text>
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[typography.heading, { color: '#fff', fontSize: 24 }]}>
                    {currentStory.title}
                  </Text>
                  <View style={styles.badgePill}>
                    <Text style={[typography.tiny, { color: '#000', fontWeight: '800' }]}>
                      {currentStory.phonicsFocus}
                    </Text>
                  </View>
                </View>
                {showMarathi && (
                  <Text style={[typography.caption, { color: colors.textMuted, marginTop: 2 }]}>
                    {currentStory.marathiTitle}
                  </Text>
                )}
              </View>
            </View>

            {/* Page Count */}
            <Text style={[typography.caption, { color: colors.gold, fontWeight: '700' }]}>
              Page {currentPageIndex + 1} of {currentStory.pages.length}
            </Text>
          </View>

          {/* Interactive Decodable Words Bar */}
          <View style={styles.wordsBar}>
            <Text style={[typography.caption, { color: colors.gold, fontWeight: '800' }]}>
              🎯 Sound-Out Words:
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {currentStory.decodableWords.map((word, wIdx) => (
                <FocusTile
                  key={word}
                  focusKey={`btn-sound-${wIdx}`}
                  onPress={() => handleSoundWord(word)}
                  style={styles.wordPill}
                >
                  <Text style={[typography.caption, { color: '#fff', fontWeight: '700' }]}>
                    🔊 {word}
                  </Text>
                </FocusTile>
              ))}
            </ScrollView>
          </View>

          {/* Main Page Reader Box */}
          <View style={styles.pageDisplayBox}>
            {/* Illustrated Storybook Hero Banner */}
            <View style={styles.heroIllustrationContainer}>
              {currentPage.imageKey && PHONICS_PAGE_IMAGES[currentPage.imageKey] ? (
                <>
                  <Image
                    source={PHONICS_PAGE_IMAGES[currentPage.imageKey]}
                    style={styles.heroStoryImageBg}
                    blurRadius={16}
                    resizeMode="cover"
                  />
                  <Image
                    source={PHONICS_PAGE_IMAGES[currentPage.imageKey]}
                    style={styles.heroStoryImage}
                    resizeMode="contain"
                  />
                </>
              ) : (
                <View style={styles.heroCardFallback}>
                  <Text style={{ fontSize: 50, marginBottom: 6 }}>{currentPage.illustrationIcon}</Text>
                  <Text style={[typography.body, { color: '#fff', fontWeight: '800' }]}>
                    {currentStory.title} • Page {currentPageIndex + 1}
                  </Text>
                  <View style={styles.heroFallbackChips}>
                    {currentPage.focusWords.map((fw) => (
                      <View key={fw} style={styles.heroFallbackChip}>
                        <Text style={{ color: '#0F172A', fontWeight: '800', fontSize: 13 }}>{fw}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              )}
              <View style={styles.heroBadge}>
                <Text style={[typography.caption, { color: '#fff', fontWeight: '800' }]}>
                  {currentPage.illustrationIcon} • Page {currentPageIndex + 1} of {currentStory.pages.length}
                </Text>
              </View>
            </View>

            {/* English Sentence */}
            <Text style={styles.pageStoryText}>
              {currentPage.text}
            </Text>

            {/* Marathi Translation */}
            {showMarathi && (
              <Text style={styles.pageMarathiText}>
                {currentPage.marathiText}
              </Text>
            )}

            {/* Read Aloud Trigger */}
            <FocusTile
              focusKey="btn-read-page"
              onPress={handleReadPage}
              style={[styles.readAloudBtn, isReadingAloud && { backgroundColor: colors.correct }]}
            >
              <Text style={[typography.body, { color: '#000', fontWeight: '800' }]}>
                {isReadingAloud ? '🔊 Reading Aloud...' : '▶ Read This Page Aloud'}
              </Text>
            </FocusTile>
          </View>

          {/* Page Navigation Controls */}
          <View style={styles.pageNavRow}>
            <FocusTile
              focusKey="btn-page-prev"
              onPress={() => setCurrentPageIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentPageIndex === 0}
              style={[styles.pageNavBtn, currentPageIndex === 0 && styles.pageNavBtnDisabled]}
            >
              <Text style={[typography.body, { color: currentPageIndex === 0 ? colors.textMuted : '#fff', fontWeight: '700' }]}>
                ← Previous Page
              </Text>
            </FocusTile>

            {/* Dots */}
            <View style={{ flexDirection: 'row', gap: 6, alignItems: 'center' }}>
              {currentStory.pages.map((p, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.pageDot,
                    idx === currentPageIndex && { backgroundColor: colors.gold, width: 22 },
                  ]}
                />
              ))}
            </View>

            <FocusTile
              focusKey="btn-page-next"
              onPress={() => setCurrentPageIndex((prev) => Math.min(currentStory.pages.length - 1, prev + 1))}
              disabled={currentPageIndex === currentStory.pages.length - 1}
              style={[styles.pageNavBtn, currentPageIndex === currentStory.pages.length - 1 && styles.pageNavBtnDisabled]}
            >
              <Text style={[typography.body, { color: currentPageIndex === currentStory.pages.length - 1 ? colors.textMuted : '#fff', fontWeight: '700' }]}>
                Next Page →
              </Text>
            </FocusTile>
          </View>
        </TVScrollSection>

        {/* ── COMPREHENSION & PHONICS QUIZ ── */}
        <TVScrollSection style={styles.quizSection}>
          <Text style={[typography.heading, { color: colors.gold, marginBottom: 4 }]}>
            🧩 Phonics &amp; Comprehension Check:
          </Text>
          <Text style={[typography.caption, { color: colors.textMuted, marginBottom: spacing.md }]}>
            Use the TV remote to answer questions about {currentStory.title}
          </Text>

          {currentStory.quiz.map((q, qIdx) => {
            const userAnswer = quizAnswers[q.id];
            const isAnswered = userAnswer !== undefined;
            const isCorrect = userAnswer === q.correctAnswer;

            return (
              <View key={q.id} style={styles.quizCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 }}>
                  <View style={styles.quizNumBadge}>
                    <Text style={{ color: '#000', fontWeight: '800', fontSize: 16 }}>
                      {qIdx + 1}
                    </Text>
                  </View>
                  <Text style={[typography.heading, { color: '#fff', fontWeight: '800', fontSize: 22, flex: 1, lineHeight: 30 }]}>
                    {q.question}
                  </Text>
                </View>

                {/* Options */}
                <View style={{ flexDirection: 'row', gap: 14, flexWrap: 'wrap', paddingLeft: 42 }}>
                  {q.options.map((opt, optIdx) => {
                    const isSelected = userAnswer === opt;
                    const optIsCorrect = opt === q.correctAnswer;

                    return (
                      <FocusTile
                        key={opt}
                        focusKey={`btn-quiz-${qIdx}-${optIdx}`}
                        onPress={() => handleSelectAnswer(q.id, opt, q.correctAnswer)}
                        style={[
                          styles.quizOptionTile,
                          isSelected && (optIsCorrect ? styles.quizOptionCorrect : styles.quizOptionWrong),
                        ]}
                      >
                        <Text style={{ color: isSelected ? '#000' : '#fff', fontWeight: '800', fontSize: 18 }}>
                          {opt}
                        </Text>
                      </FocusTile>
                    );
                  })}
                </View>

                {isAnswered && (
                  <View style={{ marginTop: 12, paddingLeft: 42 }}>
                    <Text style={{ color: isCorrect ? colors.correct : colors.wrong, fontWeight: '800', fontSize: 17, lineHeight: 24 }}>
                      {isCorrect ? '✅ Correct! ' : '❌ Try again! '}
                      {q.explanation}
                    </Text>
                    <Text style={{ color: colors.gold, fontStyle: 'italic', marginTop: 4, fontSize: 14 }}>
                      Phonics Clue: {q.phonicsClue}
                    </Text>
                  </View>
                )}
              </View>
            );
          })}
        </TVScrollSection>
      </TVScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.08)',
    backgroundColor: '#0F172A',
  },
  headerLeft: {
    flex: 1,
  },
  headerControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  ctrlBtn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ctrlBtnActive: {
    backgroundColor: colors.gold,
  },
  ctrlBtnOff: {
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  scrollContent: {
    flex: 1,
    padding: spacing.lg,
  },
  shelfSection: {
    marginBottom: spacing.lg,
  },
  shelfRow: {
    flexDirection: 'row',
    gap: 12,
    paddingVertical: 4,
  },
  storyTile: {
    width: 220,
    backgroundColor: '#1E293B',
    borderRadius: 12,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    gap: 4,
  },
  shelfStoryImage: {
    width: '100%',
    height: 76,
    borderRadius: 8,
    marginBottom: 6,
  },
  heroIllustrationContainer: {
    width: '100%',
    height: 320,
    borderRadius: 14,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: spacing.md,
    backgroundColor: '#0F172A',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroStoryImageBg: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    opacity: 0.65,
  },
  heroStoryImage: {
    width: '100%',
    height: '100%',
  },
  heroCardFallback: {
    width: '100%',
    height: '100%',
    backgroundColor: '#1E293B',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing.md,
  },
  heroFallbackChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 10,
    justifyContent: 'center',
  },
  heroFallbackChip: {
    backgroundColor: 'rgba(255,255,255,0.92)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  heroBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    backgroundColor: 'rgba(0,0,0,0.65)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 14,
  },
  storyTileIcon: {
    fontSize: 28,
    marginBottom: 4,
  },
  stageCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: spacing.lg,
    borderLeftWidth: 6,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    marginBottom: spacing.xl,
  },
  storyMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  badgePill: {
    backgroundColor: colors.gold,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  wordsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(0,0,0,0.25)',
    padding: 10,
    borderRadius: 10,
    marginBottom: spacing.md,
  },
  wordPill: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 14,
  },
  pageDisplayBox: {
    backgroundColor: '#0F172A',
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 180,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  illustrationText: {
    fontSize: 48,
  },
  pageStoryText: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    textAlign: 'center',
    lineHeight: 40,
    maxWidth: 780,
    width: '100%',
    flexWrap: 'wrap',
  },
  pageMarathiText: {
    fontSize: 20,
    color: colors.gold,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 10,
    maxWidth: 740,
    lineHeight: 30,
    flexWrap: 'wrap',
  },
  readAloudBtn: {
    backgroundColor: colors.gold,
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 4,
  },
  pageNavRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.md,
  },
  pageNavBtn: {
    backgroundColor: '#334155',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  pageNavBtnDisabled: {
    backgroundColor: 'rgba(255,255,255,0.05)',
  },
  pageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#475569',
  },
  quizSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
  },
  quizCard: {
    backgroundColor: '#0F172A',
    borderRadius: 12,
    padding: spacing.lg,
    marginBottom: spacing.md,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  quizNumBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  quizOptionTile: {
    backgroundColor: '#334155',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
  },
  quizOptionCorrect: {
    backgroundColor: colors.correct,
  },
  quizOptionWrong: {
    backgroundColor: colors.wrong,
  },
});
