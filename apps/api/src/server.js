import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import pg from 'pg';
import { generateExercises } from '../../../packages/exercise-engine/src/index.js';
import { analyzeMistake, calculateMastery, chooseTeachingStrategy } from '../../../packages/learning-engine/src/index.js';

const { Pool } = pg;
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const DEMO_CHILD = '00000000-0000-0000-0000-000000000099';

app.get('/api/health', (_, res) => res.json({ ok: true, service: 'smartstudy-api' }));

app.get('/api/children/:childId', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM children WHERE id=$1', [req.params.childId]);
  res.json(rows[0] || null);
});

app.get('/api/children/:childId/skills', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT s.id, s.name, s.description, s.difficulty, t.name AS topic, sub.name AS subject,
           COALESCE(m.mastery_score,0) mastery_score,
           COALESCE(m.attempts,0) attempts,
           COALESCE(m.correct_attempts,0) correct_attempts
    FROM skills s
    JOIN topics t ON t.id=s.topic_id
    JOIN subjects sub ON sub.id=t.subject_id
    LEFT JOIN skill_mastery m ON m.skill_id=s.id AND m.child_id=$1
    ORDER BY sub.name,t.name,s.difficulty,s.name`, [req.params.childId]);
  res.json(rows);
});

app.post('/api/exercises/generate', async (req, res) => {
  const childId = req.body.childId || DEMO_CHILD;
  const skillId = req.body.skillId;
  const count = Math.min(Number(req.body.count || 10), 20);
  const { rows } = await pool.query(`
    SELECT s.*, t.name AS topic
    FROM skills s JOIN topics t ON t.id=s.topic_id
    WHERE s.id=$1`, [skillId]);
  if (!rows[0]) return res.status(404).json({ error: 'Skill not found' });
  const generated = generateExercises(rows[0], count);
  for (const e of generated) {
    await pool.query(`INSERT INTO exercises
      (id,skill_id,question,question_type,difficulty,options,correct_answer,explanation)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8)`,
      [e.id,e.skillId,e.question,e.questionType,e.difficulty,JSON.stringify(e.options),e.correctAnswer,e.explanation]);
  }
  res.json({ childId, skill: rows[0], exercises: generated });
});

app.post('/api/attempts', async (req, res) => {
  const { childId = DEMO_CHILD, exerciseId, answer, timeTakenMs = null } = req.body;
  const ex = (await pool.query('SELECT e.*, s.name skill_name FROM exercises e JOIN skills s ON s.id=e.skill_id WHERE e.id=$1',[exerciseId])).rows[0];
  if (!ex) return res.status(404).json({ error: 'Exercise not found' });

  const correct = String(answer).trim() === String(ex.correct_answer).trim();
  const attemptId = crypto.randomUUID();
  await pool.query(`INSERT INTO attempts(id,child_id,exercise_id,answer,correct,time_taken_ms)
                    VALUES($1,$2,$3,$4,$5,$6)`,
    [attemptId,childId,exerciseId,String(answer),correct,timeTakenMs]);

  const previous = (await pool.query(`SELECT * FROM skill_mastery WHERE child_id=$1 AND skill_id=$2`,
    [childId,ex.skill_id])).rows[0];
  const mastery = calculateMastery({
    previous: previous ? {
      masteryScore:Number(previous.mastery_score), attempts:previous.attempts,
      correctAttempts:previous.correct_attempts, consecutiveCorrect:previous.consecutive_correct
    } : null,
    correct
  });

  await pool.query(`INSERT INTO skill_mastery(id,child_id,skill_id,mastery_score,confidence,attempts,correct_attempts,consecutive_correct,last_attempt_at,next_review_at)
    VALUES($1,$2,$3,$4,$5,$6,$7,$8,NOW(),NOW()+INTERVAL '1 day')
    ON CONFLICT(child_id,skill_id) DO UPDATE SET
      mastery_score=EXCLUDED.mastery_score, confidence=EXCLUDED.confidence,
      attempts=EXCLUDED.attempts, correct_attempts=EXCLUDED.correct_attempts,
      consecutive_correct=EXCLUDED.consecutive_correct,last_attempt_at=NOW(),next_review_at=EXCLUDED.next_review_at`,
    [crypto.randomUUID(),childId,ex.skill_id,mastery.masteryScore,mastery.confidence,mastery.attempts,mastery.correctAttempts,mastery.consecutiveCorrect]);

  let analysis = null, intervention = null;
  if (!correct) {
    const history = (await pool.query(`SELECT a.correct FROM attempts a JOIN exercises e ON e.id=a.exercise_id
      WHERE a.child_id=$1 AND e.skill_id=$2 ORDER BY a.attempted_at DESC LIMIT 5`, [childId,ex.skill_id])).rows;
    analysis = analyzeMistake({ question:ex.question, answer, correctAnswer:ex.correct_answer, skillName:ex.skill_name, history });
    intervention = chooseTeachingStrategy(analysis);
    await pool.query(`INSERT INTO mistake_analysis(id,attempt_id,mistake_type,misconception,confidence,evidence)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [crypto.randomUUID(),attemptId,analysis.mistakeType,analysis.misconception,analysis.confidence,JSON.stringify(analysis.evidence)]);
    await pool.query(`INSERT INTO teaching_interventions(id,child_id,skill_id,misconception,strategy_type,content)
      VALUES($1,$2,$3,$4,$5,$6)`,
      [crypto.randomUUID(),childId,ex.skill_id,analysis.misconception,intervention.strategyType,JSON.stringify(intervention)]);
  }

  res.json({ correct, correctAnswer:ex.correct_answer, mastery, analysis, intervention });
});

app.post('/api/materials/worksheet/analyze', async (req,res) => {
  // Production adapter: send extracted text/image to a vision-capable model.
  // This endpoint intentionally returns a structured contract for the frontend.
  const { childId = DEMO_CHILD, title = 'Uploaded worksheet', extractedText = '' } = req.body;
  const id = crypto.randomUUID();
  await pool.query(`INSERT INTO learning_materials(id,child_id,type,title,extracted_text)
    VALUES($1,$2,'WORKSHEET',$3,$4)`, [id,childId,title,extractedText]);
  res.json({
    materialId:id,
    status:'RECEIVED',
    nextStep:'Connect this endpoint to the vision/LLM adapter to classify questions and learn school patterns.'
  });
});

app.get('/api/children/:childId/dashboard', async (req,res) => {
  const skills = (await pool.query(`
    SELECT s.id,s.name,t.name topic,sub.name subject,
           COALESCE(m.mastery_score,0) mastery_score,
           COALESCE(m.attempts,0) attempts
    FROM skills s JOIN topics t ON t.id=s.topic_id JOIN subjects sub ON sub.id=t.subject_id
    LEFT JOIN skill_mastery m ON m.skill_id=s.id AND m.child_id=$1
    ORDER BY mastery_score ASC`,[req.params.childId])).rows;
  const mistakes = (await pool.query(`
    SELECT ma.mistake_type,ma.misconception,ma.confidence,e.question
    FROM mistake_analysis ma JOIN attempts a ON a.id=ma.attempt_id
    JOIN exercises e ON e.id=a.exercise_id
    WHERE a.child_id=$1 ORDER BY a.attempted_at DESC LIMIT 10`,[req.params.childId])).rows;
  res.json({ skills, mistakes });
});

app.listen(process.env.PORT || 3000, () => console.log(`SmartStudy API running on ${process.env.PORT || 3000}`));
