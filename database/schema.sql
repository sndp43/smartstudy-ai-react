CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE IF NOT EXISTS children (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  grade TEXT NOT NULL,
  board TEXT,
  medium TEXT NOT NULL DEFAULT 'English',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subjects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS topics (
  id UUID PRIMARY KEY,
  subject_id UUID NOT NULL REFERENCES subjects(id),
  name TEXT NOT NULL,
  description TEXT,
  parent_topic_id UUID REFERENCES topics(id)
);

CREATE TABLE IF NOT EXISTS skills (
  id UUID PRIMARY KEY,
  topic_id UUID NOT NULL REFERENCES topics(id),
  name TEXT NOT NULL,
  description TEXT,
  difficulty INTEGER NOT NULL DEFAULT 1,
  prerequisite_skill_id UUID REFERENCES skills(id)
);

CREATE TABLE IF NOT EXISTS learning_materials (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES children(id),
  type TEXT NOT NULL CHECK (type IN ('SYLLABUS','TEXTBOOK','WORKSHEET','ANSWER_SHEET')),
  title TEXT NOT NULL,
  file_path TEXT,
  extracted_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS material_questions (
  id UUID PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES learning_materials(id),
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL,
  skill_id UUID REFERENCES skills(id),
  difficulty INTEGER NOT NULL DEFAULT 1,
  metadata JSONB NOT NULL DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS school_patterns (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES children(id),
  subject_id UUID NOT NULL REFERENCES subjects(id),
  skill_id UUID REFERENCES skills(id),
  question_type TEXT NOT NULL,
  frequency INTEGER NOT NULL DEFAULT 1,
  difficulty_distribution JSONB NOT NULL DEFAULT '{}',
  examples JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY,
  skill_id UUID NOT NULL REFERENCES skills(id),
  question TEXT NOT NULL,
  question_type TEXT NOT NULL,
  difficulty INTEGER NOT NULL,
  options JSONB NOT NULL DEFAULT '[]',
  correct_answer TEXT NOT NULL,
  explanation TEXT NOT NULL,
  source_pattern_id UUID REFERENCES school_patterns(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS attempts (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES children(id),
  exercise_id UUID NOT NULL REFERENCES exercises(id),
  answer TEXT NOT NULL,
  correct BOOLEAN NOT NULL,
  time_taken_ms INTEGER,
  attempted_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS mistake_analysis (
  id UUID PRIMARY KEY,
  attempt_id UUID NOT NULL REFERENCES attempts(id),
  mistake_type TEXT NOT NULL,
  misconception TEXT,
  confidence NUMERIC(4,3) NOT NULL DEFAULT 0.5,
  evidence JSONB NOT NULL DEFAULT '[]'
);

CREATE TABLE IF NOT EXISTS skill_mastery (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES children(id),
  skill_id UUID NOT NULL REFERENCES skills(id),
  mastery_score NUMERIC(5,2) NOT NULL DEFAULT 0,
  confidence NUMERIC(5,2) NOT NULL DEFAULT 0,
  attempts INTEGER NOT NULL DEFAULT 0,
  correct_attempts INTEGER NOT NULL DEFAULT 0,
  consecutive_correct INTEGER NOT NULL DEFAULT 0,
  last_attempt_at TIMESTAMPTZ,
  next_review_at TIMESTAMPTZ,
  UNIQUE(child_id, skill_id)
);

CREATE TABLE IF NOT EXISTS teaching_interventions (
  id UUID PRIMARY KEY,
  child_id UUID NOT NULL REFERENCES children(id),
  skill_id UUID NOT NULL REFERENCES skills(id),
  misconception TEXT NOT NULL,
  strategy_type TEXT NOT NULL,
  content JSONB NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
