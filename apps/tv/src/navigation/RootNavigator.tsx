// SmartStudy TV — Root Navigator
// Simple state-machine navigation (no stack animation needed on TV).
// Manages which screen is visible and passes props down.

import React, { useState } from 'react';
import { ProfileSelect } from '../screens/ProfileSelect';
import { Home } from '../screens/Home';
import { LearningCharts } from '../screens/LearningCharts';
import { ChartView } from '../screens/ChartView';
import { PracticePicker } from '../screens/PracticePicker';
import { PracticeEpisode } from '../screens/PracticeEpisode';
import { EpisodeComplete } from '../screens/EpisodeComplete';
import { Child, Skill } from '../hooks/useAPI';

type Screen =
  | 'profile'
  | 'home'
  | 'charts'
  | 'chart-view'
  | 'practice-pick'
  | 'practice-episode'
  | 'episode-complete';

export function RootNavigator() {
  const [screen, setScreen] = useState<Screen>('profile');
  const [child, setChild] = useState<Child | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [selectedChartSlug, setSelectedChartSlug] = useState<string | null>(null);
  const [episodeScore, setEpisodeScore] = useState<{ score: number; total: number } | null>(null);

  const go = (s: Screen) => setScreen(s);

  if (screen === 'profile') {
    return (
      <ProfileSelect
        onSelect={(c) => {
          setChild(c);
          go('home');
        }}
      />
    );
  }

  if (!child) return null;

  if (screen === 'home') {
    return (
      <Home
        child={child}
        onBack={() => go('profile')}
        onNavigate={(dest) => {
          if (dest === 'charts') go('charts');
          else if (dest === 'practice') go('practice-pick');
          else if (dest === 'challenge') {
            // Challenge will auto-pick the weakest skill — navigate to practice picker
            // (in Phase 2 we'll auto-select; for now go to picker)
            go('practice-pick');
          } else if (dest === 'trophy') {
            // Trophy Room — Phase 4; for now return home
          }
        }}
      />
    );
  }

  if (screen === 'charts') {
    return (
      <LearningCharts
        childId={child.id}
        onSelectChart={(slug) => {
          setSelectedChartSlug(slug);
          go('chart-view');
        }}
        onBack={() => go('home')}
      />
    );
  }

  if (screen === 'chart-view' && selectedChartSlug) {
    return (
      <ChartView
        slug={selectedChartSlug}
        childId={child.id}
        onBack={() => {
          setSelectedChartSlug(null);
          go('charts');
        }}
      />
    );
  }

  if (screen === 'practice-pick') {
    return (
      <PracticePicker
        child={child}
        onSelectSkill={(skill) => {
          setSelectedSkill(skill);
          go('practice-episode');
        }}
        onBack={() => go('home')}
      />
    );
  }

  if (screen === 'practice-episode' && selectedSkill) {
    return (
      <PracticeEpisode
        child={child}
        skill={selectedSkill}
        onEpisodeComplete={(score, total) => {
          setEpisodeScore({ score, total });
          go('episode-complete');
        }}
        onBack={() => go('practice-pick')}
      />
    );
  }

  if (screen === 'episode-complete' && episodeScore) {
    return (
      <EpisodeComplete
        score={episodeScore.score}
        total={episodeScore.total}
        childName={child.name}
        onPlayAgain={() => {
          if (selectedSkill) go('practice-episode');
        }}
        onHome={() => go('home')}
      />
    );
  }

  return null;
}
