function id() { return crypto.randomUUID(); }

export function generateExercises(skill, count = 10) {
  const out = [];
  for (let i = 0; i < count; i++) {
    let question, answer, options;
    if (skill.name === 'Number sequencing') {
      const start = 1 + (i % 10);
      question = `${start}, ${start + 1}, __, ${start + 3}`;
      answer = String(start + 2);
      options = [answer, String(start + 1), String(start + 4)].sort();
    } else if (skill.name === 'Compare numbers') {
      const a = 2 + (i % 8), b = 1 + ((i * 3) % 8);
      question = `Which number is greater: ${a} or ${b}?`;
      answer = String(Math.max(a,b));
      options = [String(a), String(b)];
    } else if (skill.name === 'Addition within 10') {
      const a = 1 + (i % 5), b = 1 + ((i * 2) % 5);
      question = `${a} + ${b} = ?`;
      answer = String(a+b);
      options = [answer, String(a+b-1), String(a+b+1)].filter((v,j,a)=>a.indexOf(v)===j).sort();
    } else if (skill.name === 'Addition across 10') {
      const a = 6 + (i % 4), b = 4 + (i % 4);
      question = `${a} + ${b} = ?`;
      answer = String(a+b);
      options = [answer, String(a+b-1), String(a+b-2)].sort();
    } else {
      const a = 5 + (i % 5), b = 1 + (i % 4);
      question = `${a} - ${b} = ?`;
      answer = String(a-b);
      options = [answer, String(a-b+1), String(a-b-1)].sort();
    }
    out.push({
      id: id(), skillId: skill.id, skillName: skill.name, question,
      questionType: 'MCQ', difficulty: skill.difficulty,
      options, correctAnswer: answer,
      explanation: `The answer is ${answer}.`
    });
  }
  return out;
}
