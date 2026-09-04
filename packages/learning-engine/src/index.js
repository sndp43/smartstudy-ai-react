export function analyzeMistake({ question, answer, correctAnswer, skillName, history = [] }) {
  if (answer === correctAnswer) return null;
  const numeric = (value) => Number(String(value).replace(/[^0-9.-]/g, ''));
  const q = question.match(/(\d+)\s*\+\s*(\d+)/);
  let misconception = 'The child may need another explanation of this skill.';
  let type = 'CONCEPTUAL_ERROR';
  let confidence = 0.55;

  if (q && skillName.toLowerCase().includes('addition')) {
    const a = numeric(q[1]), b = numeric(q[2]), given = numeric(answer), expected = a + b;
    if (expected >= 10 && given === expected - 1) {
      type = 'COUNTING_ERROR';
      misconception = 'The child may be stopping one count early while counting forward across 10.';
      confidence = 0.86;
    } else if (given === a + b - 2 || given === a + b + 1) {
      type = 'PROCEDURAL_ERROR';
      misconception = 'The child may be losing track of the number of jumps when counting forward.';
      confidence = 0.72;
    }
  }

  const recentWrong = history.filter(x => !x.correct).length;
  if (recentWrong >= 2) confidence = Math.min(0.96, confidence + 0.08);

  return {
    mistakeType: type,
    misconception,
    confidence,
    evidence: [`Question: ${question}`, `Child answer: ${answer}`, `Correct answer: ${correctAnswer}`]
  };
}

export function calculateMastery({ previous = null, correct }) {
  const p = previous || { masteryScore: 0, attempts: 0, correctAttempts: 0, consecutiveCorrect: 0 };
  const attempts = p.attempts + 1;
  const correctAttempts = p.correctAttempts + (correct ? 1 : 0);
  const consecutiveCorrect = correct ? p.consecutiveCorrect + 1 : 0;
  const accuracy = correctAttempts / attempts;
  const streakBonus = Math.min(15, consecutiveCorrect * 3);
  const masteryScore = Math.round(Math.min(100, accuracy * 85 + streakBonus));
  return {
    masteryScore,
    confidence: Math.round(Math.min(100, attempts * 12 + (correct ? 15 : 0))),
    attempts,
    correctAttempts,
    consecutiveCorrect
  };
}

export function chooseTeachingStrategy(mistake) {
  if (!mistake) return null;
  if (mistake.mistakeType === 'COUNTING_ERROR') return {
    strategyType: 'NUMBER_LINE',
    title: 'Let’s walk on the number road',
    steps: [
      'Start at the first number.',
      'Make one jump for each number you add.',
      'Say every number aloud as you jump.',
      'Stop after exactly the required number of jumps.'
    ]
  };
  if (mistake.mistakeType === 'PROCEDURAL_ERROR') return {
    strategyType: 'OBJECTS',
    title: 'Let’s use objects',
    steps: [
      'Make a group for the first number.',
      'Add the second group.',
      'Count all objects slowly.',
      'Say the answer only after counting.'
    ]
  };
  return {
    strategyType: 'VISUAL',
    title: 'Let’s see it another way',
    steps: ['Use pictures or objects.', 'Explain the answer aloud.', 'Try one easier example.', 'Try the original type again.']
  };
}
