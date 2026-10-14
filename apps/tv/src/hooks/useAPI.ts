// SmartStudy TV — API Hook
// Wraps fetch calls to the same Laravel API used by the web app.
// Handles base URL, JSON headers, and error normalisation.

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE = Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://127.0.0.1:8000/api';

export interface Child {
  id: string;
  name: string;
  grade: string;
  board: string;
  medium: string;
  parentId?: string;
  avatar?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: 'parent';
}

export interface Skill {
  id: string;
  name: string;
  topic: string;
  subject: string;
  difficulty?: number;
  template?: string;
  table_range?: string;
  mastery_score: number;
}

export interface Exercise {
  id: string;
  skillId: string;
  skillName: string;
  question: string;
  question_type: string;
  questionType: string;
  options: string[];
  correct_answer: string;
  correctAnswer: string;
  explanation?: string;
  image_url?: string;
  image_question?: string;
}

export interface AttemptResult {
  correct: boolean;
  correctAnswer: string;
  intervention?: { title: string; suggestion: string };
}

export interface Dashboard {
  skills: Skill[];
  mistakes: any[];
  masteryAverage?: number;
}

export interface LearningChart {
  slug: string;
  title: string;
  items: any[];
}

export interface ChartProgress {
  summary: Record<string, number>;
  records: Record<string, string[]>;
}

// Fallback Demo Data for offline / initial boot
const DEMO_CHILDREN: Child[] = [
  { id: 'child-1', name: 'Aarav 🦁', grade: '2', board: 'CBSE', medium: 'English' },
  { id: 'child-2', name: 'Ananya 🦋', grade: '4', board: 'ICSE', medium: 'English' },
  { id: 'child-3', name: 'Rohan 🚀', grade: '1', board: 'State Board', medium: 'English' },
];

const CUSTOM_CHILDREN_STORAGE_KEY = 'smartstudy_tv_custom_children';
const USER_SESSION_STORAGE_KEY = 'smartstudy_tv_user_session';

const DEMO_SKILLS: Skill[] = [
  { id: 'skill-tables', name: 'Multiplication Tables (2–5)', topic: 'Maths', subject: 'Mathematics', mastery_score: 85, table_range: '2 to 5' },
  { id: 'skill-addition', name: 'Speed Addition (1-20)', topic: 'Maths', subject: 'Mathematics', mastery_score: 92 },
  { id: 'skill-shapes', name: '2D & 3D Shapes Master', topic: 'Geometry', subject: 'Mathematics', mastery_score: 78 },
  { id: 'skill-rhymes', name: 'Rhyming Words & Phonics', topic: 'English', subject: 'English', mastery_score: 95 },
  { id: 'skill-manners', name: 'Magic Words & Good Manners', topic: 'Life Skills', subject: 'Moral Science', mastery_score: 100 },
];

const DEMO_EXERCISES: Record<string, Exercise[]> = {
  'skill-tables': [
    { id: 'ex-1', skillId: 'skill-tables', skillName: 'Multiplication Tables', question: 'What is 3 × 4 ?', question_type: 'mcq', questionType: 'mcq', options: ['10', '12', '14', '9'], correct_answer: '12', correctAnswer: '12', explanation: '3 groups of 4 make 12!' },
    { id: 'ex-2', skillId: 'skill-tables', skillName: 'Multiplication Tables', question: 'What is 5 × 5 ?', question_type: 'mcq', questionType: 'mcq', options: ['20', '25', '30', '15'], correct_answer: '25', correctAnswer: '25', explanation: '5 times 5 equals 25!' },
    { id: 'ex-3', skillId: 'skill-tables', skillName: 'Multiplication Tables', question: 'What is 4 × 6 ?', question_type: 'mcq', questionType: 'mcq', options: ['20', '22', '24', '26'], correct_answer: '24', correctAnswer: '24', explanation: '4 × 6 = 24!' },
    { id: 'ex-4', skillId: 'skill-tables', skillName: 'Multiplication Tables', question: 'What is 2 × 8 ?', question_type: 'mcq', questionType: 'mcq', options: ['16', '18', '14', '12'], correct_answer: '16', correctAnswer: '16', explanation: '2 × 8 = 16!' },
    { id: 'ex-5', skillId: 'skill-tables', skillName: 'Multiplication Tables', question: 'What is 3 × 7 ?', question_type: 'mcq', questionType: 'mcq', options: ['20', '21', '24', '28'], correct_answer: '21', correctAnswer: '21', explanation: '3 × 7 = 21!' },
  ],
  'skill-addition': [
    { id: 'ex-6', skillId: 'skill-addition', skillName: 'Speed Addition', question: 'What is 7 + 8 ?', question_type: 'mcq', questionType: 'mcq', options: ['14', '15', '16', '13'], correct_answer: '15', correctAnswer: '15', explanation: '7 plus 8 equals 15!' },
    { id: 'ex-7', skillId: 'skill-addition', skillName: 'Speed Addition', question: 'What is 12 + 6 ?', question_type: 'mcq', questionType: 'mcq', options: ['17', '18', '19', '16'], correct_answer: '18', correctAnswer: '18', explanation: '12 + 6 = 18!' },
  ],
  'skill-shapes': [
    { id: 'ex-8', skillId: 'skill-shapes', skillName: '2D & 3D Shapes', question: 'Which shape has 3 sides and 3 corners?', question_type: 'mcq', questionType: 'mcq', options: ['Square', 'Triangle', 'Circle', 'Rectangle'], correct_answer: 'Triangle', correctAnswer: 'Triangle', explanation: 'A triangle always has 3 straight sides!' },
    { id: 'ex-9', skillId: 'skill-shapes', skillName: '2D & 3D Shapes', question: 'Which 3D shape is like a football?', question_type: 'mcq', questionType: 'mcq', options: ['Cube', 'Sphere', 'Cylinder', 'Cone'], correct_answer: 'Sphere', correctAnswer: 'Sphere', explanation: 'A round ball shape is a sphere!' },
  ],
  'skill-rhymes': [
    { id: 'ex-10', skillId: 'skill-rhymes', skillName: 'Rhyming Words', question: 'Which word rhymes with "STAR"?', question_type: 'mcq', questionType: 'mcq', options: ['CAR', 'SUN', 'MOON', 'SKY'], correct_answer: 'CAR', correctAnswer: 'CAR', explanation: '"Star" and "Car" end with the -AR sound!' },
  ],
  'skill-manners': [
    { id: 'ex-11', skillId: 'skill-manners', skillName: 'Magic Words', question: 'What magic word do you say when you ask for something?', question_type: 'mcq', questionType: 'mcq', options: ['Thank You', 'Please', 'Sorry', 'Excuse Me'], correct_answer: 'Please', correctAnswer: 'Please', explanation: 'Always say "Please" when making a polite request!' },
  ],
};

async function getStoredCustomChildren(): Promise<Child[]> {
  try {
    const raw = await AsyncStorage.getItem(CUSTOM_CHILDREN_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 2500);
    const response = await fetch(`${API_BASE}${path}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      signal: controller.signal,
      ...options,
    });
    clearTimeout(timeout);
    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      throw new Error(err.error || `API error ${response.status}`);
    }
    return await response.json();
  } catch {
    // Graceful fallback to rich demo data with offline storage
    if (path.startsWith('/children/') && path.endsWith('/skills')) return DEMO_SKILLS as any;
    if (path.startsWith('/children/') && path.endsWith('/dashboard')) {
      return { skills: DEMO_SKILLS, mistakes: [], masteryAverage: 90 } as any;
    }
    if (path.startsWith('/skills/') && path.includes('/exercises')) {
      const skillId = path.split('/')[2];
      return (DEMO_EXERCISES[skillId] || DEMO_EXERCISES['skill-tables']) as any;
    }
    if (path === '/children') {
      const custom = await getStoredCustomChildren();
      const combined = [...DEMO_CHILDREN, ...custom];
      return combined as any;
    }
    if (path.startsWith('/children/')) return DEMO_CHILDREN[0] as any;
    if (path === '/attempts') {
      const parsedBody = options?.body ? JSON.parse(options.body as string) : {};
      let foundAnswer = '';
      for (const list of Object.values(DEMO_EXERCISES)) {
        const ex = list.find(e => String(e.id) === String(parsedBody.exerciseId));
        if (ex) {
          foundAnswer = ex.correctAnswer || ex.correct_answer || '';
          break;
        }
      }
      const isCorrect = foundAnswer
        ? String(parsedBody.answer ?? '').trim().toLowerCase() === foundAnswer.trim().toLowerCase()
        : false;
      return { correct: isCorrect, correctAnswer: foundAnswer } as any;
    }
    if (path === '/auth/register' || path === '/auth/parent/register') {
      const parsedBody = options?.body ? JSON.parse(options.body as string) : {};
      const newUser: UserAccount = {
        id: 'parent-' + Date.now(),
        name: parsedBody.name || 'Parent User',
        email: parsedBody.email || 'parent@smartstudy.ai',
        role: parsedBody.role || 'parent',
      };
      await AsyncStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(newUser)).catch(() => {});
      return { ok: true, role: newUser.role, user: newUser, token: 'mock-token-' + Date.now() } as any;
    }
    if (path === '/auth/parent/login') {
      const parsedBody = options?.body ? JSON.parse(options.body as string) : {};
      const user: UserAccount = {
        id: 'parent-1',
        name: parsedBody.email ? parsedBody.email.split('@')[0] : 'Parent User',
        email: parsedBody.email || 'parent@smartstudy.ai',
        role: 'parent',
      };
      await AsyncStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(user)).catch(() => {});
      return { ok: true, role: user.role, user, token: 'mock-token-' + Date.now() } as any;
    }
    if (path === '/auth/logout') {
      await AsyncStorage.removeItem(USER_SESSION_STORAGE_KEY).catch(() => {});
      return { ok: true } as any;
    }
    if (path === '/learning-charts') {
      return [
        { slug: 'tables-2-30', title: 'Tables 2–30' },
        { slug: 'english-alphabet', title: 'English A–Z' },
        { slug: 'marathi-swar', title: 'Marathi Swar' },
        { slug: 'marathi-vyanjan', title: 'Marathi Vyanjan' },
        { slug: 'animals', title: 'Animals' },
        { slug: 'body-parts', title: 'Body Parts' },
      ] as any;
    }
    if (path.includes('/chart-progress')) return { summary: {}, records: {} } as any;
    throw new Error('Endpoint not available');
  }
}

export const api = {
  // Auth (Parent only on TV)
  register: async (name: string, email: string, password: string) => {
    const res = await apiFetch<{ ok: boolean; role: string; user: UserAccount; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password, role: 'parent' }),
    });
    if (res.user) {
      await AsyncStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(res.user)).catch(() => {});
    }
    return res;
  },

  login: async (email: string, password: string) => {
    const res = await apiFetch<{ ok: boolean; role: string; user: UserAccount; token: string }>('/auth/parent/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (res.user) {
      await AsyncStorage.setItem(USER_SESSION_STORAGE_KEY, JSON.stringify(res.user)).catch(() => {});
    }
    return res;
  },

  logout: async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // offline fallback
    }
    await AsyncStorage.removeItem(USER_SESSION_STORAGE_KEY).catch(() => {});
  },

  getCurrentUser: async (): Promise<UserAccount | null> => {
    try {
      const raw = await AsyncStorage.getItem(USER_SESSION_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },

  // Children
  getChildren: async () => {
    try {
      const fetched = await apiFetch<Child[]>('/children');
      const custom = await getStoredCustomChildren();
      const map = new Map<string, Child>();
      fetched.forEach(c => map.set(c.id, c));
      custom.forEach(c => map.set(c.id, c));
      return Array.from(map.values());
    } catch {
      const custom = await getStoredCustomChildren();
      return [...DEMO_CHILDREN, ...custom];
    }
  },

  createChild: async (data: { name: string; grade: string; board?: string; medium?: string; parentId?: string; avatar?: string }) => {
    const newChild: Child = {
      id: 'child-' + Date.now(),
      name: data.avatar ? `${data.name} ${data.avatar}` : data.name,
      grade: data.grade,
      board: data.board || 'CBSE',
      medium: data.medium || 'English',
      parentId: data.parentId,
      avatar: data.avatar,
    };

    // Save locally
    const existing = await getStoredCustomChildren();
    existing.push(newChild);
    await AsyncStorage.setItem(CUSTOM_CHILDREN_STORAGE_KEY, JSON.stringify(existing)).catch(() => {});

    // Also attempt remote API
    try {
      await apiFetch<Child>('/children', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    } catch {
      // handled locally
    }

    return newChild;
  },

  getChild: (id: string) => apiFetch<Child>(`/children/${id}`),

  // Skills & exercises
  getSkills: (childId: string) => apiFetch<Skill[]>(`/children/${childId}/skills`),
  getExercises: (skillId: string, range?: string) =>
    apiFetch<Exercise[]>(`/skills/${skillId}/exercises?shuffle=1${range ? `&range=${encodeURIComponent(range)}` : ''}`),

  // Attempts
  submitAttempt: (childId: string, exerciseId: string, answer: string) =>
    apiFetch<AttemptResult>('/attempts', {
      method: 'POST',
      body: JSON.stringify({ childId, exerciseId, answer }),
    }),

  // Dashboard
  getDashboard: (childId: string) => apiFetch<Dashboard>(`/children/${childId}/dashboard`),

  // Learning charts
  getCharts: () => apiFetch<LearningChart[]>('/learning-charts'),
  getChartProgress: (childId: string) =>
    apiFetch<ChartProgress>(`/children/${childId}/chart-progress`),
  recordChartPractice: (childId: string, chartSlug: string, itemKey: string, itemName?: string) =>
    apiFetch(`/children/${childId}/chart-progress`, {
      method: 'POST',
      body: JSON.stringify({ chart_slug: chartSlug, item_key: itemKey, item_name: itemName }),
    }),
};

