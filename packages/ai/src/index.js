export function buildWorksheetAnalysisPrompt(text) {
  return `Analyze this Class 1 school worksheet. Extract each question, classify its topic/skill/question type/difficulty, identify repeated teacher patterns, and return strict JSON. Do not invent questions.\n\nWORKSHEET:\n${text}`;
}

export function buildTeachingPrompt({ skill, misconception, age = 6 }) {
  return `Create a short, child-friendly Class 1 intervention for skill "${skill}" and misconception "${misconception}". Use concrete objects, simple language, one idea at a time, then 3 diagnostic practice questions. Child age: ${age}.`;
}
