import { useCallback, useEffect, useRef, useState, type UIEvent } from "react";
import LearningChartsView, { LearningChart, ChartProgressData } from "./components/LearningChartsView";
import ShapeGraphic from "./components/ShapeGraphic";
import { speak as universalSpeak, stopSpeech } from "./services/voiceService";
import { VoiceSettingsButton } from "./components/VoiceSettingsModal";

const API = "http://127.0.0.1:8000/api";
const defaultChildId = "00000000-0000-0000-0000-000000000099";
const SESSION_KEY = "smartstudy-session";
const placeholderNames = ["Title", "Actual question", "Image", "Image question", "Answer choices"];
const placeholderDefault: Record<string, string> = { Title: "top", "Actual question": "top", Image: "middle", "Image question": "middle", "Answer choices": "bottom" };
const placeholderPosition = (layouts: Record<string, Record<string, string>>, template: string, name: string) => layouts[template]?.[name] || placeholderDefault[name] || "middle";
const placeholderLayoutClass = (layouts: Record<string, Record<string, string>>, template: string, name: string) => {
  const position = placeholderPosition(layouts, template, name);
  const count = placeholderNames.filter((item) => placeholderPosition(layouts, template, item) === position).length;
  return `layout-${position} layout-${position}-count-${count}`;
};

const parseMathVisual = (question: string) => {
  if (!question) return null;
  const multMatch = question.match(/(\d+)\s*(?:x|\*|×|groups of)\s*(\d+)/i);
  if (multMatch) {
    const a = parseInt(multMatch[1], 10);
    const b = parseInt(multMatch[2], 10);
    if (a >= 1 && a <= 30 && b >= 1 && b <= 12) {
      return { type: "multiplication" as const, rows: a, cols: b, total: a * b };
    }
  }
  const addMatch = question.match(/(\d+)\s*\+\s*(\d+)/);
  if (addMatch) {
    const a = parseInt(addMatch[1], 10);
    const b = parseInt(addMatch[2], 10);
    if (a >= 1 && a <= 15 && b >= 1 && b <= 15) {
      return { type: "addition" as const, a, b, total: a + b };
    }
  }
  return null;
};

const CHART_METADATA: Record<string, { label: string; icon: string }> = {
  "body-parts": { label: "Body Parts (अवयव)", icon: "👦" },
  "animals": { label: "Animals (प्राणी)", icon: "🦁" },
  "vegetables": { label: "Vegetables (भाज्या)", icon: "🥕" },
  "birds": { label: "Birds (पक्षी)", icon: "🦜" },
  "emotions": { label: "Emotions (भावना)", icon: "😊" },
  "tables-2-30": { label: "Tables 2–30 (पाढे)", icon: "🔢" },
  "tables-2-10": { label: "Tables 2–10", icon: "🔢" },
  "marathi-swar": { label: "१४ स्वर (Swar)", icon: "🕉️" },
  "marathi-vyanjan": { label: "व्यंजन (Vyanjan)", icon: "🪷" },
  "english-alphabet": { label: "English A–Z", icon: "🔤" },
  "phonics": { label: "Phonics (CVC शब्द)", icon: "🗣️" },
  "phonic-stories": { label: "Phonics Stories (Grade 1)", icon: "📖" },
  "poems": { label: "Poems (कविता/Rhymes)", icon: "🎭" },
};

const DEFAULT_CHART_SUBMENUS = [
  { slug: "phonics", label: "Phonics (CVC शब्द)", icon: "🗣️" },
  { slug: "phonic-stories", label: "Phonics Stories (Grade 1)", icon: "📖" },
  { slug: "poems", label: "Poems (कविता/Rhymes)", icon: "🎭" },
  { slug: "body-parts", label: "Body Parts (अवयव)", icon: "👦" },
  { slug: "animals", label: "Animals (प्राणी)", icon: "🦁" },
  { slug: "vegetables", label: "Vegetables (भाज्या)", icon: "🥕" },
  { slug: "birds", label: "Birds (पक्षी)", icon: "🦜" },
  { slug: "emotions", label: "Emotions (भावना)", icon: "😊" },
  { slug: "tables-2-30", label: "Tables 2–30 (पाढे)", icon: "🔢" },
  { slug: "marathi-swar", label: "१४ स्वर (Swar)", icon: "🕉️" },
  { slug: "marathi-vyanjan", label: "व्यंजन (Vyanjan)", icon: "🪷" },
  { slug: "english-alphabet", label: "English A–Z", icon: "🔤" },
];

interface FillBlankParsed {
  hasBlank: boolean;
  title: string;
  prefix: string;
  suffix: string;
  word: string;
}

const parseFillBlank = (
  questionText: string,
  defaultTitle?: string,
  imageQuestion?: string | null
): FillBlankParsed => {
  if (!questionText) {
    return {
      hasBlank: false,
      title: imageQuestion || defaultTitle || "Fill in the blank",
      prefix: "",
      suffix: "",
      word: "",
    };
  }

  // Strip clues like "Fish picture: " or "Gate picture: " at the beginning if present
  let cleanText = questionText.replace(/^[A-Za-z0-9\s]+(?:\s+picture|\s+image|\s+photo)\s*:\s*/i, "").trim();

  const blankRegex = /_{1,}|\.{3,}|\[\s*\]|\(\s*\)/;

  let extractedTitle = imageQuestion || "";
  let targetWordOrSentence = cleanText;

  // Multiline check (\n)
  if (cleanText.includes("\n")) {
    const lines = cleanText.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    const blankLineIndex = lines.findIndex((l) => blankRegex.test(l));
    if (blankLineIndex !== -1) {
      targetWordOrSentence = lines[blankLineIndex];
      const otherLines = lines.filter((_, idx) => idx !== blankLineIndex);
      if (otherLines.length > 0 && !extractedTitle) {
        extractedTitle = otherLines.join(" ");
      }
    }
  } else {
    // Sentence or punctuation separation, e.g. "FI_H. Which letter is missing?" or "Which letter is missing? FI_H"
    const parts = cleanText.split(/(?<=[.?!])\s+/).map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      const blankIndex = parts.findIndex((s) => blankRegex.test(s));
      if (blankIndex !== -1) {
        targetWordOrSentence = parts[blankIndex];
        const otherParts = parts.filter((_, idx) => idx !== blankIndex);
        if (otherParts.length > 0 && !extractedTitle) {
          extractedTitle = otherParts.join(" ");
        }
      }
    }
  }

  const finalTitle = extractedTitle || defaultTitle || "Fill in the blank";
  const cleanWord = targetWordOrSentence.replace(/[.]+$/, "").trim();

  const match = cleanWord.match(blankRegex);
  if (match && match.index !== undefined) {
    return {
      hasBlank: true,
      title: finalTitle,
      prefix: cleanWord.slice(0, match.index),
      suffix: cleanWord.slice(match.index + match[0].length),
      word: cleanWord,
    };
  }

  return {
    hasBlank: false,
    title: finalTitle,
    prefix: cleanWord,
    suffix: "",
    word: cleanWord,
  };
};

function shuffleList<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const renderQuestionContent = (text: string) => {
  if (!text) return null;
  if (text.includes("\n")) {
    const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      return (
        <div className="quote-question-container">
          <div className="quote-question-instruction">{lines[0]}</div>
          <div className="quote-question-blank-prompt">{lines.slice(1).join(" ")}</div>
        </div>
      );
    }
  }
  return text;
};

type UserRole = "student" | "teacher" | "parent";

interface SavedAuth {
  role: UserRole;
  user: any;
  activeChildId?: string;
}

const savedSession = (): SavedAuth | null => {
  try {
    const value = localStorage.getItem(SESSION_KEY);
    if (!value) return null;
    const parsed = JSON.parse(value);
    if (parsed.role && parsed.user) return parsed;
    if (parsed.childId) {
      return {
        role: "student",
        user: { id: parsed.childId, name: "Learner" },
        activeChildId: parsed.childId,
      };
    }
    return null;
  } catch {
    return null;
  }
};

type Skill = {
  id: string;
  name: string;
  topic: string;
  subject: string;
  difficulty?: number;
  template?: string;
  table_range?: string;
  mastery_score: number;
};

const TEMPLATE_OPTIONS = [
  { id: "standard", name: "Standard", title: "Standard question", description: "Clean, focused layout for everyday multiple-choice practice.", preview: "?", previewClass: "standard-preview" },
  { id: "image_prompt", name: "Image prompt", title: "Image prompt", description: "Highlights a supporting picture before the question and answers.", preview: "▧", previewClass: "image-preview" },
  { id: "story_card", name: "Story card", title: "Story card", description: "A warm, card-based format for contextual and story-led questions.", preview: "✦", previewClass: "story-preview" },
  { id: "flashcard", name: "Flashcard", title: "Flashcard", description: "A focused reveal-style layout for memory and vocabulary practice.", preview: "▤", previewClass: "standard-preview" },
  { id: "fill_blank", name: "Fill in the blank", title: "Fill in the blank", description: "Emphasizes the missing word or letter in a sentence.", preview: "_", previewClass: "image-preview" },
  { id: "true_false", name: "True or false", title: "True or false", description: "Simple statement-based format for quick concept checks.", preview: "✓", previewClass: "story-preview" },
  { id: "rhyme_card", name: "Rhyme Card", title: "Rhyme card with collapsed answer", description: "Interactive rhyme builder where the answer and phonetic clue are in a collapsed state.", preview: "🎵", previewClass: "story-preview" },
  { id: "shape_card", name: "Shape Card", title: "Shape spelling with collapsed answer", description: "Interactive shape recognition and fill-in-the-blank spelling with hidden answers.", preview: "⬡", previewClass: "story-preview" },
  { id: "magic_words_card", name: "Magic Words Card", title: "Magic words with scenario clue", description: "Interactive manners & magic words challenge with situational clues and collapsible golden rules.", preview: "🪄", previewClass: "story-preview" },
];

const templateLabel = (templateId?: string) => {
  const match = TEMPLATE_OPTIONS.find((t) => t.id === templateId);
  return match?.name || "Standard";
};

interface CourseDefinition {
  id: string;
  code: string;
  name: string;
  subject: string;
  icon: string;
  description: string;
  defaultGrades: string[];
  defaultBoards: string[];
  topics: string[];
  recommendedMastery: number;
}

const DEFAULT_COURSES: CourseDefinition[] = [
  {
    id: "math-foundations",
    code: "MATH-101",
    name: "Mathematics Foundations & Operations",
    subject: "Mathematics",
    icon: "🔢",
    description: "Core addition, subtraction, arithmetic fluency, and multiplication tables (2–30).",
    defaultGrades: ["1", "2", "3", "4", "5"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Addition & Subtraction", "Multiplication Tables (2–10)", "Tables (11–30)", "Word Problems"],
    recommendedMastery: 80,
  },
  {
    id: "math-missing-numbers",
    code: "MATH-102",
    name: "Number Sequence & Missing Numbers",
    subject: "Mathematics",
    icon: "🎲",
    description: "Before, after, and missing numbers across ranges 100–500.",
    defaultGrades: ["1", "2", "3"],
    defaultBoards: ["CBSE", "ICSE", "State Board"],
    topics: ["Before & After Numbers", "Missing Numbers 100–200", "Missing Numbers 200–500"],
    recommendedMastery: 85,
  },
  {
    id: "geometry-shapes",
    code: "MATH-103",
    name: "2D & 3D Shapes & Spatial Geometry",
    subject: "Mathematics",
    icon: "📐",
    description: "Shape recognition, geometric properties, vertices, edges, and spelling challenges.",
    defaultGrades: ["UKG", "1", "2", "3"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["2D Shapes (Circle, Square, Triangle)", "3D Shapes (Cube, Sphere, Cylinder)", "Shape Spelling"],
    recommendedMastery: 75,
  },
  {
    id: "english-phonics",
    code: "ENG-101",
    name: "Phonics & CVC Short Vowels",
    subject: "English",
    icon: "🗣️",
    description: "Short vowel sounds, CVC sound blending (-at, -en, -ig, -ox, -ug), and auditory word recognition.",
    defaultGrades: ["Nursery", "LKG", "UKG", "1", "2"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Short A CVC", "Short E CVC", "Short I CVC", "Short O & U CVC", "Phonetic Blends"],
    recommendedMastery: 80,
  },
  {
    id: "english-spelling-500",
    code: "ENG-102",
    name: "500 High-Frequency English Words & Spelling",
    subject: "English",
    icon: "🔤",
    description: "Interactive fill-in-the-blank vocabulary spelling exercises with 500 common English words.",
    defaultGrades: ["1", "2", "3", "4", "5"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB"],
    topics: ["Missing First Letter", "Missing Middle Vowel", "Missing Final Letter", "Complex Blends"],
    recommendedMastery: 75,
  },
  {
    id: "english-rhymes",
    code: "ENG-103",
    name: "Rhyming Words & Sound Families (320+ Words)",
    subject: "English",
    icon: "🎵",
    description: "Word families, phonetic ending patterns, and auditory rhyme association.",
    defaultGrades: ["LKG", "UKG", "1", "2"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Short Vowel Rhymes", "Long Vowel Rhymes", "Consonant Blend Rhymes"],
    recommendedMastery: 80,
  },
  {
    id: "marathi-language",
    code: "MAR-101",
    name: "मराठी भाषा: स्वर, व्यंजन आणि बाराखडी",
    subject: "Marathi",
    icon: "🕉️",
    description: "१४ स्वर (Swar), व्यंजन (Vyanjan), उच्चार, आणि मूलभूत मराठी शब्दसंग्रह.",
    defaultGrades: ["1", "2", "3", "4", "5"],
    defaultBoards: ["State Board", "CBSE", "ICSE"],
    topics: ["१४ स्वर (Swar)", "व्यंजन (Vyanjan)", "चित्र व शब्द", "बाराखडी"],
    recommendedMastery: 70,
  },
  {
    id: "evs-discovery",
    code: "EVS-101",
    name: "Environmental Studies & Living World",
    subject: "Science / EVS",
    icon: "🦁",
    description: "Human body parts (अवयव), animals, vegetables, birds, and nature exploration.",
    defaultGrades: ["Nursery", "LKG", "UKG", "1", "2"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Body Parts & Functions", "Animals & Habitats", "Birds & Flight", "Vegetables & Plants"],
    recommendedMastery: 85,
  },
  {
    id: "social-magic-words",
    code: "SEL-101",
    name: "Manners, Magic Words & Social Etiquette",
    subject: "Social Skills",
    icon: "🪄",
    description: "Top magic words (Please, Thank You, Sorry, Excuse Me) through realistic social scenarios.",
    defaultGrades: ["Nursery", "LKG", "UKG", "1", "2"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Magic Words in Action", "Classroom Kindness", "Sharing & Respect"],
    recommendedMastery: 90,
  },
  {
    id: "grade1-phonics-stories",
    code: "STORY-101",
    name: "Grade 1 Decodable Phonics Stories",
    subject: "English Reading",
    icon: "📖",
    description: "Decodable phonics reading adventures for Grade 1: Short vowels A-E-I-O-U, sh-ch-th digraphs, consonant blends, and magic 'e' long vowels with comprehension quizzes.",
    defaultGrades: ["1", "2"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Short Vowels A-E-I-O-U Stories", "Digraphs (sh, ch, th)", "Consonant Blends (st, sp, fl)", "Magic 'e' Long Vowels", "Comprehension & Decoding Checks"],
    recommendedMastery: 85,
  },
  {
    id: "charts-recitation",
    code: "CHART-101",
    name: "Visual Charts & Daily Recitation",
    subject: "Visual Learning",
    icon: "📊",
    description: "Multi-sensory tables, bilingual vocabulary charts, interactive rhymes, and poems.",
    defaultGrades: ["1", "2", "3", "4", "5"],
    defaultBoards: ["CBSE", "ICSE", "State Board", "IB", "Cambridge"],
    topics: ["Tables 2–30 Recitation", "Illustrated Rhymes & Poems", "Bilingual Body & Animal Charts"],
    recommendedMastery: 80,
  },
];

type WorksheetResult = {
  status?: string;
  error?: string;
  questions?: {
    question: string;
    questionType: string;
    skill: string | null;
    difficulty: number;
  }[];
  patternsLearned?: number;
};

const speak = (message: string) => {
  universalSpeak(message);
};

export default function App() {
  const [session, setSession] = useState<SavedAuth | null>(() => savedSession());
  const [loginRole, setLoginRole] = useState<UserRole>("student");
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const [teacherEmail, setTeacherEmail] = useState("teacher@smartstudy.ai");
  const [teacherPassword, setTeacherPassword] = useState("password123");
  const [parentEmail, setParentEmail] = useState("parent@smartstudy.ai");
  const [parentPassword, setParentPassword] = useState("password123");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"parent" | "teacher">("parent");
  const [showAddStudentModal, setShowAddStudentModal] = useState(false);
  const [studentModalData, setStudentModalData] = useState({
    name: "",
    grade: "1",
    board: "CBSE",
    medium: "English",
    avatar: "👦",
  });
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [teacherPreview, setTeacherPreview] = useState(false);

  const [assignTargetGrade, setAssignTargetGrade] = useState("1");
  const [assignTargetBoard, setAssignTargetBoard] = useState("CBSE");
  const [assignMedium, setAssignMedium] = useState("English");
  const [courseAssignments, setCourseAssignments] = useState<Record<string, string[]>>(() => {
    try {
      return JSON.parse(localStorage.getItem("smartstudy-course-assignments") || "{}");
    } catch {
      return {};
    }
  });

  const getAssignmentKey = (grade: string, board: string) => `${grade}_${board}`;

  const isCourseAssigned = (courseId: string, grade: string, board: string) => {
    const key = getAssignmentKey(grade, board);
    const assigned = courseAssignments[key];
    if (assigned !== undefined) {
      return assigned.includes(courseId);
    }
    const course = DEFAULT_COURSES.find((c) => c.id === courseId);
    if (!course) return false;
    return course.defaultGrades.includes(grade) && course.defaultBoards.includes(board);
  };

  const toggleCourseAssignment = (courseId: string) => {
    const key = getAssignmentKey(assignTargetGrade, assignTargetBoard);
    const currentlyAssigned = isCourseAssigned(courseId, assignTargetGrade, assignTargetBoard);
    const existingList = courseAssignments[key] !== undefined
      ? courseAssignments[key]
      : DEFAULT_COURSES.filter((c) => c.defaultGrades.includes(assignTargetGrade) && c.defaultBoards.includes(assignTargetBoard)).map((c) => c.id);

    const nextList = currentlyAssigned
      ? existingList.filter((id) => id !== courseId)
      : [...existingList, courseId];

    const nextAssignments = { ...courseAssignments, [key]: nextList };
    setCourseAssignments(nextAssignments);
    localStorage.setItem("smartstudy-course-assignments", JSON.stringify(nextAssignments));
    showToast(currentlyAssigned ? `⭕ Unassigned course for Class ${assignTargetGrade} (${assignTargetBoard})` : `✅ Assigned course to Class ${assignTargetGrade} (${assignTargetBoard})`);
  };

  const assignAllCoreCourses = () => {
    const key = getAssignmentKey(assignTargetGrade, assignTargetBoard);
    const allIds = DEFAULT_COURSES.map((c) => c.id);
    const nextAssignments = { ...courseAssignments, [key]: allIds };
    setCourseAssignments(nextAssignments);
    localStorage.setItem("smartstudy-course-assignments", JSON.stringify(nextAssignments));
    showToast(`🌟 Assigned all ${allIds.length} courses to Class ${assignTargetGrade} (${assignTargetBoard})!`);
  };

  const clearCourseAssignments = () => {
    const key = getAssignmentKey(assignTargetGrade, assignTargetBoard);
    const nextAssignments = { ...courseAssignments, [key]: [] };
    setCourseAssignments(nextAssignments);
    localStorage.setItem("smartstudy-course-assignments", JSON.stringify(nextAssignments));
    showToast(`Cleared course assignments for Class ${assignTargetGrade} (${assignTargetBoard})`);
  };

  const [child, setChild] = useState<any>();
  const [children, setChildren] = useState<any[]>([]);
  const enrolledStudents = children.filter(
    (c) =>
      String(c.grade).toLowerCase() === String(assignTargetGrade).toLowerCase() &&
      (!c.board || c.board.toLowerCase() === assignTargetBoard.toLowerCase() || assignTargetBoard === "All")
  );
  const [childId, setChildId] = useState(() => (session?.role === "student" ? session.user.id : session?.activeChildId || defaultChildId));
  const [childSearch, setChildSearch] = useState("");
  const [selectedLoginChild, setSelectedLoginChild] = useState("");
  const [skills, setSkills] = useState<Skill[]>([]);
  const [dash, setDash] = useState<any>({ skills: [], mistakes: [] });
  const [misconceptionPage, setMisconceptionPage] = useState(1);
  const [loadingMoreMisconceptions, setLoadingMoreMisconceptions] = useState(false);
  const [worksheets, setWorksheets] = useState<any[]>([]);
  const [skill, setSkill] = useState<Skill>();
  const [exercises, setExercises] = useState<any[]>([]);
  const [index, setIndex] = useState(0);
  const [result, setResult] = useState<any>();
  const [flashcardFlipped, setFlashcardFlipped] = useState(false);
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [showVisualPrompt, setShowVisualPrompt] = useState(false);
  const [rhymeAnswerCollapsed, setRhymeAnswerCollapsed] = useState(true);
  const [shapeAnswerCollapsed, setShapeAnswerCollapsed] = useState(true);
  const [magicAnswerCollapsed, setMagicAnswerCollapsed] = useState(true);
  const [practiceCount, setPracticeCount] = useState<number | "all">(10);

  useEffect(() => {
    setFlashcardFlipped(false);
    setSelectedChoice(null);
    setShowVisualPrompt(false);
    setRhymeAnswerCollapsed(true);
    setShapeAnswerCollapsed(true);
    setMagicAnswerCollapsed(true);
  }, [index, skill]);
  const [parent, setParent] = useState(() => session?.role === "teacher" || session?.role === "parent");
  const [parentView, setParentView] = useState("skills");
  const [studentView, setStudentView] = useState<"adventure" | "charts">("adventure");
  const [activeChartSlug, setActiveChartSlug] = useState<string>("body-parts");
  const [chartsNavOpen, setChartsNavOpen] = useState(true);
  const [selectedTable, setSelectedTable] = useState<number | "all">(2);
  const [alphabetFilter, setAlphabetFilter] = useState<"all" | "vowels" | "consonants">("all");
  const [recitingTable, setRecitingTable] = useState<number | null>(null);
  const [charts, setCharts] = useState<LearningChart[]>([]);
  const availableChartSubmenus = (() => {
    const seen = new Set<string>();
    const list: Array<{ slug: string; label: string; icon: string }> = [];

    // Ensure all standard submenus in DEFAULT_CHART_SUBMENUS are always present
    for (const item of DEFAULT_CHART_SUBMENUS) {
      seen.add(item.slug);
      list.push(item);
    }

    // Append any extra dynamic charts returned from backend API
    for (const c of charts) {
      if (!seen.has(c.slug)) {
        seen.add(c.slug);
        list.push({
          slug: c.slug,
          label: CHART_METADATA[c.slug]?.label || c.title,
          icon: CHART_METADATA[c.slug]?.icon || "📊",
        });
      }
    }
    return list;
  })();
  const [chartProgress, setChartProgress] = useState<ChartProgressData>({ summary: {}, records: {} });
  const [savingChartItem, setSavingChartItem] = useState<string | null>(null);
  const [misconceptionSubject, setMisconceptionSubject] = useState("All");
  const [clearingMisconceptions, setClearingMisconceptions] = useState(false);
  const [newChild, setNewChild] = useState({
    name: "",
    grade: "1",
    board: "CBSE",
    medium: "English",
  });
  const [childMessage, setChildMessage] = useState("");
  const [worksheet, setWorksheet] = useState("");
  const [worksheetResult, setWorksheetResult] = useState<WorksheetResult>();
  const [subject, setSubject] = useState("All");
  const [skillManagementSubject, setSkillManagementSubject] = useState("All");
  const [newSkill, setNewSkill] = useState({
    subject: "English",
    topic: "",
    name: "",
    description: "",
    difficulty: 1,
    template: "standard",
    table_range: "2-10",
  });
  const [wizardExerciseRange, setWizardExerciseRange] = useState<string>("all");
  const [skillMessage, setSkillMessage] = useState("");
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [showAddChild, setShowAddChild] = useState(false);
  const [editingSkill, setEditingSkill] = useState<string | null>(null);
  const [skillExercises, setSkillExercises] = useState<any[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
  const [wizardStep, setWizardStep] = useState(1);
  const [newQuestion, setNewQuestion] = useState({
    question: "",
    options: "",
    correctAnswer: "",
    explanation: "",
    difficulty: 1,
    imageUrl: "",
    imageQuestion: "",
  });
  const [pendingDeletion, setPendingDeletion] = useState<
    | { type: "skill"; item: any }
    | { type: "question"; item: any }
    | { type: "questions"; item: any[] }
    | null
  >(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [showWizardScrollTop, setShowWizardScrollTop] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(() => localStorage.getItem("smartstudy-sidebar-collapsed") === "true");
  const [exerciseFullscreen, setExerciseFullscreen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [templateLayouts, setTemplateLayouts] = useState<Record<string, Record<string, string>>>(() => {
    try { return JSON.parse(localStorage.getItem("smartstudy-template-layouts") || "{}"); } catch { return {}; }
  });
  const toastTimer = useRef<number | undefined>(undefined);

  const showToast = (message: string) => {
    setToast(message);
    if (toastTimer.current) window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(null), 2800);
  };
  const updateTemplateLayout = (template: string, placeholder: string, position: string) => {
    setTemplateLayouts((current) => {
      const next = { ...current, [template]: { ...(current[template] || {}), [placeholder]: position } };
      localStorage.setItem("smartstudy-template-layouts", JSON.stringify(next));
      return next;
    });
  };
  const resetSkillForm = () => {
    setEditingSkill(null);
    setWizardStep(1);
    setSkillExercises([]);
    setSkillMessage("");
    setNewSkill({ subject: "English", topic: "", name: "", description: "", difficulty: 1, template: "standard" });
  };

  const load = async () => {
    if (!childId) return;
    try {
      const [
        childResponse,
        skillsResponse,
        dashboardResponse,
        worksheetsResponse,
        chartsResponse,
        chartProgressResponse,
      ] = await Promise.all([
        fetch(`${API}/children/${childId}`),
        fetch(`${API}/children/${childId}/skills`),
        fetch(`${API}/children/${childId}/dashboard`),
        fetch(`${API}/children/${childId}/worksheets`),
        fetch(`${API}/learning-charts`),
        fetch(`${API}/children/${childId}/chart-progress`),
      ]);
      if (childResponse.ok) setChild(await childResponse.json());
      if (skillsResponse.ok) setSkills(await skillsResponse.json());
      if (dashboardResponse.ok) {
        const dashboard = await dashboardResponse.json();
        setDash(dashboard);
        setMisconceptionPage(1);
      }
      if (worksheetsResponse.ok) setWorksheets(await worksheetsResponse.json());
      if (chartsResponse.ok) {
        setCharts(await chartsResponse.json());
      }
      if (chartProgressResponse.ok) {
        setChartProgress(await chartProgressResponse.json());
      }
    } catch (err) {
      console.error("Failed to load student data from API", err);
    }
  };

  const recordChartPractice = async (chartSlug: string, itemKey: string, itemName?: string) => {
    setSavingChartItem(itemKey);
    try {
      const res = await fetch(`${API}/children/${childId}/chart-progress`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ chart_slug: chartSlug, item_key: itemKey, item_name: itemName }),
      });
      if (res.ok) {
        const refreshRes = await fetch(`${API}/children/${childId}/chart-progress`);
        if (refreshRes.ok) {
          setChartProgress(await refreshRes.json());
        }
        setToast(`⭐ Practiced ${itemName || itemKey}!`);
        setTimeout(() => setToast(null), 2500);
      }
    } catch (err) {
      console.error("Failed to record chart practice", err);
    } finally {
      setSavingChartItem(null);
    }
  };

  const loadMoreMisconceptions = async (event: UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget;
    if (loadingMoreMisconceptions || !dash.mistakesHasMore || target.scrollTop + target.clientHeight < target.scrollHeight - 80) return;
    setLoadingMoreMisconceptions(true);
    const nextPage = misconceptionPage + 1;
    const response = await fetch(`${API}/children/${childId}/dashboard?mistakePage=${nextPage}`);
    const data = await response.json();
    if (response.ok) {
      setDash((current: any) => ({ ...current, mistakes: [...current.mistakes, ...(data.mistakes || [])], mistakesHasMore: data.mistakesHasMore }));
      setMisconceptionPage(nextPage);
    }
    setLoadingMoreMisconceptions(false);
  };

  const loadSavedChildren = () => {
    try {
      return JSON.parse(localStorage.getItem("smartstudy-custom-children") || "[]");
    } catch {
      return [];
    }
  };

  const loadSavedUsers = () => {
    try {
      return JSON.parse(localStorage.getItem("smartstudy-registered-users") || "[]");
    } catch {
      return [];
    }
  };

  const fetchChildren = async () => {
    try {
      const response = await fetch(`${API}/children`);
      if (response.ok) {
        const serverData = await response.json();
        const localData = loadSavedChildren();
        const map = new Map();
        serverData.forEach((c: any) => map.set(c.id, c));
        localData.forEach((c: any) => map.set(c.id, c));
        const merged = Array.from(map.values());
        setChildren(merged);
        return;
      }
    } catch {
      // offline fallback
    }
    const local = loadSavedChildren();
    if (local.length > 0) {
      setChildren(local);
    } else {
      setChildren([
        { id: defaultChildId, name: "Aarav", username: "aarav_1", grade: "1", board: "CBSE", medium: "English", avatar: "👦" },
        { id: "00000000-0000-0000-0000-000000000098", name: "Ananya", username: "ananya_2", grade: "2", board: "CBSE", medium: "English", avatar: "👧" },
      ]);
    }
  };

  useEffect(() => {
    fetchChildren();
  }, []);

  useEffect(() => {
    if (childId) {
      load();
    }
  }, [childId]);

  const createStudentProfile = async (profileData: {
    name: string;
    grade: string;
    board: string;
    medium: string;
    avatar?: string;
  }) => {
    if (!profileData.name.trim()) return;
    setAuthLoading(true);
    const localId = "child-" + Date.now();
    const baseUsername = profileData.name.toLowerCase().replace(/[^a-z0-9]/g, "_") || "student";
    const uniqueUsername = `${baseUsername}_${Math.floor(100 + Math.random() * 900)}`;
    const newChildObj: any = {
      id: localId,
      name: profileData.name.trim(),
      username: uniqueUsername,
      grade: profileData.grade,
      board: profileData.board || "CBSE",
      medium: profileData.medium || "English",
      avatar: profileData.avatar || "👦",
      parentId: session?.user?.id,
    };

    try {
      const response = await fetch(`${API}/children`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...profileData,
          parentId: session?.user?.id,
        }),
      });
      if (response.ok) {
        const saved = await response.json();
        if (saved?.id) {
          newChildObj.id = saved.id;
          newChildObj.username = saved.username || newChildObj.username;
        }
      }
    } catch (err) {
      console.warn("Saving student profile locally.", err);
    }

    const currentSaved = loadSavedChildren();
    const nextSaved = [...currentSaved.filter((c: any) => c.id !== newChildObj.id), newChildObj];
    localStorage.setItem("smartstudy-custom-children", JSON.stringify(nextSaved));

    setChildren((prev) => [...prev.filter((c: any) => c.id !== newChildObj.id), newChildObj]);
    setChildId(newChildObj.id);
    setChild(newChildObj);
    if (session) {
      const updatedSession = { ...session, activeChildId: newChildObj.id };
      setSession(updatedSession);
      localStorage.setItem(SESSION_KEY, JSON.stringify(updatedSession));
    }
    setAuthLoading(false);
    setShowAddStudentModal(false);
    setStudentModalData({ name: "", grade: "1", board: "CBSE", medium: "English", avatar: "👦" });
    showToast(`🌟 Profile created for ${newChildObj.name}! Switched to active student.`);
    return newChildObj;
  };

  const handleStudentLogin = async (selectedId: string) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API}/auth/student/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId: selectedId }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || "Could not log in as student.");
        setAuthLoading(false);
        return;
      }
      const newSession: SavedAuth = {
        role: "student",
        user: data.user,
        activeChildId: data.user.id,
      };
      setSession(newSession);
      setChild(data.user);
      setChildId(data.user.id);
      setParent(false);
      setTeacherPreview(false);
      showToast(`Welcome back, ${data.user.name}!`);
    } catch {
      // Local fallback for offline/demo environment
      const foundChild = children.find((c) => c.id === selectedId);
      if (foundChild) {
        const newSession: SavedAuth = {
          role: "student",
          user: foundChild,
          activeChildId: foundChild.id,
        };
        setSession(newSession);
        setChild(foundChild);
        setChildId(foundChild.id);
        setParent(false);
        setTeacherPreview(false);
        showToast(`Welcome back, ${foundChild.name}!`);
      } else {
        setAuthError("Unable to connect to the server. Please check your network.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleAdultLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    const targetRole = loginRole === "teacher" ? "teacher" : "parent";
    const emailToUse = targetRole === "teacher" ? teacherEmail : parentEmail;
    const passwordToUse = targetRole === "teacher" ? teacherPassword : parentPassword;
    const endpoint = targetRole === "teacher" ? `${API}/auth/teacher/login` : `${API}/auth/parent/login`;

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailToUse, password: passwordToUse }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Invalid email or password.");
      }
      const newSession: SavedAuth = {
        role: targetRole,
        user: data.user,
        activeChildId: childId || defaultChildId,
      };
      setSession(newSession);
      setParent(true);
      setParentView(targetRole === "teacher" ? "assign_courses" : "children");
      setTeacherPreview(false);
      showToast(`Signed in as ${data.user.name}`);
    } catch (err: any) {
      // Local verification fallback
      const registered = loadSavedUsers();
      const match = registered.find(
        (u: any) => u.email.toLowerCase() === emailToUse.toLowerCase() && u.password === passwordToUse && u.role === targetRole
      );
      const isDefaultParentDemo = targetRole === "parent" && emailToUse.toLowerCase() === "parent@smartstudy.ai" && passwordToUse === "password123";
      const isDefaultTeacherDemo = targetRole === "teacher" && emailToUse.toLowerCase() === "teacher@smartstudy.ai" && passwordToUse === "password123";

      if (match || isDefaultParentDemo || isDefaultTeacherDemo) {
        const userName = match?.name || (targetRole === "parent" ? "Family Parent" : "Classroom Teacher");
        const userObj = {
          id: match?.id || (targetRole === "parent" ? "parent-demo-1" : "teacher-demo-1"),
          name: userName,
          email: emailToUse,
          role: targetRole,
        };
        const newSession: SavedAuth = {
          role: targetRole,
          user: userObj,
          activeChildId: childId || defaultChildId,
        };
        setSession(newSession);
        setParent(true);
        setParentView(targetRole === "teacher" ? "assign_courses" : "children");
        setTeacherPreview(false);
        showToast(`Signed in as ${userName}`);
      } else {
        setAuthError(err?.message || "Invalid email or password. You can also click 'Use Demo' or register a new account.");
      }
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError("Please fill out all registration fields.");
      return;
    }
    setAuthLoading(true);
    setAuthError(null);
    try {
      const res = await fetch(`${API}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword,
          role: regRole,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAuthError(data.error || data.message || "Registration failed.");
        setAuthLoading(false);
        return;
      }
      const newSession: SavedAuth = {
        role: regRole,
        user: data.user,
        activeChildId: childId || defaultChildId,
      };
      setSession(newSession);
      setParent(true);
      setParentView("children");
      setTeacherPreview(false);
      showToast(`🎉 Account created! Welcome, ${data.user.name}.`);
    } catch {
      // Local fallback for offline/demo environment
      const localUser = {
        id: "usr-" + Date.now(),
        name: regName.trim(),
        email: regEmail.trim().toLowerCase(),
        password: regPassword,
        role: regRole,
      };
      const users = loadSavedUsers();
      users.push(localUser);
      localStorage.setItem("smartstudy-registered-users", JSON.stringify(users));

      const newSession: SavedAuth = {
        role: regRole,
        user: { id: localUser.id, name: localUser.name, email: localUser.email, role: localUser.role },
        activeChildId: childId || defaultChildId,
      };
      setSession(newSession);
      setParent(true);
      setParentView("children");
      setTeacherPreview(false);
      showToast(`🎉 Account created! Welcome, ${localUser.name}.`);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSignOut = () => {
    setSession(null);
    localStorage.removeItem(SESSION_KEY);
    setShowSignOutConfirm(false);
    setSkill(undefined);
    setExercises([]);
    setTeacherPreview(false);
    setSelectedLoginChild("");
    setChildSearch("");
    setAuthError(null);
    showToast("Signed out successfully");
  };

  const start = async (selectedSkill: Skill, customRange?: string, customCount?: number | "all") => {
    const isMultiplication = /multiplication|tables/i.test(selectedSkill.name);
    const isBeforeAfterNumbers = /(before|after|missing)\s*numbers/i.test(selectedSkill.name);
    const isRhymingWords = /rhyme|rhyming/i.test(selectedSkill.name);
    const isShapes = /shape/i.test(selectedSkill.name);
    const defaultRange = isMultiplication
      ? "2-10"
      : isBeforeAfterNumbers
      ? "100-500"
      : isRhymingWords || isShapes
      ? "all"
      : selectedSkill.table_range || undefined;
    const activeRange = customRange !== undefined ? (customRange || undefined) : defaultRange;
    const skillWithRange = { ...selectedSkill, table_range: activeRange };
    setSkill(skillWithRange);
    setIndex(0);
    setResult(undefined);
    setFlashcardFlipped(false);
    setSelectedChoice(null);
    setShowVisualPrompt(false);
    setRhymeAnswerCollapsed(true);
    setShapeAnswerCollapsed(true);
    setMagicAnswerCollapsed(true);

    const activeCount = customCount !== undefined ? customCount : practiceCount;

    // Reuse the questions already stored for this skill. This keeps practice
    // sessions stable and prevents duplicate rows in the edit modal.
    const rangeParam = skillWithRange.table_range ? `?range=${encodeURIComponent(skillWithRange.table_range)}&shuffle=1` : "?shuffle=1";
    const existingResponse = await fetch(`${API}/skills/${selectedSkill.id}/exercises${rangeParam}`);
    const existing = await existingResponse.json();
    if (existingResponse.ok && existing.length) {
      // True Fisher-Yates shuffle so child gets fresh random question order every time
      const shuffled = shuffleList(existing);
      const sessionQuestions = activeCount === "all" ? shuffled : shuffled.slice(0, activeCount);
      setExercises(sessionQuestions.map((item: any) => {
        const rawOptions = Array.isArray(item.options) ? item.options : JSON.parse(item.options || "[]");
        return {
          ...item,
          skillId: item.skill_id,
          skillName: selectedSkill.name,
          questionType: item.question_type,
          correctAnswer: item.correct_answer,
          options: shuffleList(rawOptions),
        };
      }));
      return;
    }
    const count = selectedSkill.mastery_score < 60 ? 7 : selectedSkill.mastery_score >= 80 ? 5 : 6;
    const response = await fetch(`${API}/exercises/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skillId: selectedSkill.id, count }),
    });
    setExercises((await response.json()).exercises || []);
  };

  const switchTableRange = async (newRange: string) => {
    if (!skill) return;
    await start(skill, newRange);
  };

  const answer = async (answerValue: string) => {
    if (result) return;
    setSelectedChoice(answerValue);
    const response = await fetch(`${API}/attempts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        childId,
        exerciseId: exercises[index].id,
        answer: answerValue,
      }),
    });
    const answerResult = await response.json();
    setResult(answerResult);
    speak(
      answerResult.correct
        ? "That is correct! Well done, you are doing beautifully."
        : `That is okay, let us try once more together. The correct answer is ${answerResult.correctAnswer}. ${answerResult.intervention?.title || "Let us try another way."}`,
    );
  };

  const skillRef = useRef(skill);
  skillRef.current = skill;
  const exercisesRef = useRef(exercises);
  exercisesRef.current = exercises;
  const indexRef = useRef(index);
  indexRef.current = index;
  const resultRef = useRef(result);
  resultRef.current = result;
  const editingSkillRef = useRef(editingSkill);
  editingSkillRef.current = editingSkill;

  const goToPrevQuestion = useCallback(() => {
    setIndex((current) => {
      if (current > 0) {
        setResult(undefined);
        setFlashcardFlipped(false);
        setSelectedChoice(null);
        setShowVisualPrompt(false);
        setRhymeAnswerCollapsed(true);
        return current - 1;
      }
      return current;
    });
  }, []);

  const goToNextQuestion = useCallback(() => {
    setIndex((current) => {
      const activeList = exercisesRef.current;
      if (current < activeList.length - 1) {
        setResult(undefined);
        setFlashcardFlipped(false);
        setSelectedChoice(null);
        setShowVisualPrompt(false);
        setRhymeAnswerCollapsed(true);
        return current + 1;
      }
      return current;
    });
  }, []);

  const next = useCallback(() => {
    setFlashcardFlipped(false);
    setSelectedChoice(null);
    setShowVisualPrompt(false);
    const currIndex = indexRef.current;
    const activeList = exercisesRef.current;
    if (currIndex < activeList.length - 1) {
      setIndex(currIndex + 1);
      setResult(undefined);
    } else {
      setExercises([]);
      setSkill(undefined);
      load();
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }

      const activeExercises = exercisesRef.current;
      const activeSkill = skillRef.current;
      if (!activeSkill || !activeExercises || activeExercises.length === 0 || editingSkillRef.current) {
        return;
      }

      if (e.key === "Escape" && exerciseFullscreen) {
        setExerciseFullscreen(false);
        if (document.fullscreenElement) {
          document.exitFullscreen().catch(() => {});
        }
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        e.preventDefault();
        if (resultRef.current) {
          next();
        } else {
          goToNextQuestion();
        }
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        e.preventDefault();
        goToPrevQuestion();
      } else if (e.key === "Enter" && resultRef.current) {
        e.preventDefault();
        next();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goToPrevQuestion, goToNextQuestion, next, exerciseFullscreen]);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement && exerciseFullscreen) {
        setExerciseFullscreen(false);
      }
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, [exerciseFullscreen]);

  const analyzeWorksheet = async () => {
    const response = await fetch(`${API}/materials/worksheet/analyze`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        extractedText: worksheet,
        title: "Parent worksheet",
      }),
    });
    setWorksheetResult(await response.json());
  };

  const addSkill = async () => {
    const response = await fetch(
      `${API}/skills${editingSkill ? `/${editingSkill}` : ""}`,
      {
        method: editingSkill ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSkill),
      },
    );
    const data = await response.json();
    if (!response.ok) {
      setSkillMessage(data.message || data.error || "Unable to add skill.");
      return;
    }
    setSkillMessage(
      `${data.name} ${editingSkill ? "updated" : "added"} ${editingSkill ? "successfully" : `to ${data.subject}`}.`,
    );
    if (!editingSkill) {
      setEditingSkill(data.id);
      setSkillExercises([]);
      setWizardStep(2);
    }
    setNewSkill({ ...newSkill, topic: "", name: "", description: "", table_range: "2-10" });
    load();
  };

  const saveSkillDetails = async () => {
    if (!editingSkill) return;
    const response = await fetch(`${API}/skills/${editingSkill}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newSkill),
    });
    const data = await response.json();
    if (!response.ok) {
      setSkillMessage(data.message || data.error || "Unable to update skill.");
      return;
    }
    setSkillMessage(`${data.name} updated successfully.`);
    load();
  };

  const beginEditSkill = (item: any) => {
    setEditingSkill(item.id);
    setSelectedExerciseIds([]);
    setShowAddSkill(true);
    setWizardStep(1);
    setWizardExerciseRange("all");
    setNewSkill({
      subject: item.subject,
      topic: item.topic,
      name: item.name,
      description: item.description || "",
      difficulty: Number(item.difficulty) || 1,
      template: item.template || "standard",
      table_range: item.table_range || "2-10",
    });
    fetch(`${API}/skills/${item.id}/exercises?range=all`)
      .then((response) => response.json())
      .then(setSkillExercises);
  };

  const filterWizardQuestions = (rangeKey: string) => {
    setWizardExerciseRange(rangeKey);
    if (!editingSkill) return;
    fetch(`${API}/skills/${editingSkill}/exercises?range=${rangeKey}`)
      .then((res) => res.json())
      .then(setSkillExercises);
  };

  const updateExercise = async (exercise: any) => {
    showToast("Saving question...");
    try {
      const options = Array.isArray(exercise.options)
        ? exercise.options
        : JSON.parse(exercise.options || "[]");
      const response = await fetch(`${API}/exercises/${exercise.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: exercise.question,
          options,
          correctAnswer: exercise.correct_answer ?? exercise.correctAnswer,
          explanation: exercise.explanation,
          difficulty: Number(exercise.difficulty),
          imageUrl: exercise.image_url || "",
          imageQuestion: exercise.image_question || "",
          template: newSkill.template || exercise.template || "standard",
        }),
      });
      const data = await response.json();
      setSkillMessage(response.ok ? "Question updated successfully." : data.message || data.error || "Unable to update question.");
      showToast(response.ok ? "Question saved successfully" : "Question could not be saved");
      if (response.ok) setSkillExercises((items) => items.map((item) => (item.id === data.id ? data : item)));
    } catch {
      setSkillMessage("Unable to save question. Check the question details and try again.");
      showToast("Question could not be saved");
    }
  };

  const deleteExercise = async (exercise: any) => {
    const response = await fetch(`${API}/exercises/${exercise.id}`, { method: "DELETE" });
    const data = await response.json();
    setSkillMessage(response.ok ? "Question removed." : data.error || "Unable to remove question.");
    if (response.ok) {
      setSkillExercises((items) => items.filter((item) => item.id !== exercise.id));
      showToast("Question removed successfully");
    }
  };

  const addExercise = async () => {
    if (!editingSkill) return;
    const options = newQuestion.options
      .split(",")
      .map((option) => option.trim())
      .filter(Boolean);
    const response = await fetch(`${API}/skills/${editingSkill}/exercises`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...newQuestion, options, template: newSkill.template || "standard" }),
    });
    const data = await response.json();
    if (!response.ok) {
      setSkillMessage(data.message || data.error || "Unable to add question.");
      return;
    }
    setSkillExercises((items) => [...items, data]);
    setNewQuestion({
      question: "",
      options: "",
      correctAnswer: "",
      explanation: "",
      difficulty: newSkill.difficulty,
      imageUrl: "",
      imageQuestion: "",
    });
    setSkillMessage("Question added.");
  };

  const deleteSkill = async (item: any) => {
    const response = await fetch(`${API}/skills/${item.id}`, {
      method: "DELETE",
    });
    const data = await response.json();
    setSkillMessage(
      response.ok
        ? `${item.name} deleted.`
        : data.error || "Unable to delete skill.",
    );
    if (response.ok) {
      showToast(`${item.name} deleted successfully`);
      load();
    }
  };

  const clearMisconceptions = async () => {
    setClearingMisconceptions(true);
    const response = await fetch(`${API}/children/${childId}/misconceptions?subject=${encodeURIComponent(misconceptionSubject)}`, { method: "DELETE" });
    const data = await response.json();
    setClearingMisconceptions(false);
    if (response.ok) {
      setSkillMessage(`${data.deleted || 0} misconception${data.deleted === 1 ? "" : "s"} cleared.`);
      showToast(`${misconceptionSubject} misconceptions cleared`);
      load();
    }
  };

  const confirmDeletion = async () => {
    if (!pendingDeletion) return;
    setIsDeleting(true);
    try {
      if (pendingDeletion.type === "skill") await deleteSkill(pendingDeletion.item);
      else if (pendingDeletion.type === "question") await deleteExercise(pendingDeletion.item);
      else {
        const ids = pendingDeletion.item.map((item) => item.id);
        const responses = await Promise.all(ids.map((id) => fetch(`${API}/exercises/${id}`, { method: "DELETE" })));
        if (responses.every((response) => response.ok)) {
          setSkillExercises((items) => items.filter((item) => !ids.includes(item.id)));
          setSelectedExerciseIds([]);
          setSkillMessage(`${ids.length} questions removed.`);
          showToast(`${ids.length} questions removed successfully`);
        } else setSkillMessage("Some questions could not be removed.");
      }
      setPendingDeletion(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const addChild = async () => {
    if (!newChild.name.trim()) return;
    const profile = await createStudentProfile(newChild);
    if (profile) {
      setChildMessage(`${profile.name} added. Username: @${profile.username}`);
      setNewChild({ ...newChild, name: "" });
    }
  };

  const feedback = result?.correct
    ? "Correct! Great work."
    : `Not quite. The correct answer is ${result?.correctAnswer}. ${result?.intervention?.title || "Let us try another way."}`;
  const subjects = [
    "All",
    ...Array.from(new Set(skills.map((item) => item.subject))),
  ];
  const visibleSkills =
    subject === "All"
      ? skills
      : skills.filter((item) => item.subject === subject);
  const currentSkillTemplate = skill?.template || exercises[index]?.template || "standard";
  const visibleMisconceptions = misconceptionSubject === "All"
    ? dash.mistakes
    : dash.mistakes.filter((item: any) => item.subject === misconceptionSubject);
  const filteredChildren = children.filter((item) =>
    `${item.name} ${item.username}`
      .toLowerCase()
      .includes(childSearch.toLowerCase()),
  );

  const renderFormattedQuestion = () => {
    if (!exercises.length || !exercises[index]) {
      return (
        <div className="question-loading-box">
          <div className="question-loading-spinner" />
          <p>Loading questions for {skill?.name}...</p>
        </div>
      );
    }

    const currentEx = exercises[index];

    // 1. Flashcard Layout
    if (currentSkillTemplate === "flashcard") {
      return (
        <div className="formatted-flashcard-stage">
          <div className="flashcard-deck-header">
            <span className="flashcard-deck-pill">🎴 Flashcard {index + 1} of {exercises.length}</span>
            <button
              className="flashcard-flip-action-btn"
              onClick={() => setFlashcardFlipped(!flashcardFlipped)}
              type="button"
            >
              {flashcardFlipped ? "↩ Show Question" : "🔄 Flip to Answer"}
            </button>
          </div>

          <div className={`flashcard-card-box ${flashcardFlipped ? "flipped" : ""}`}>
            {!flashcardFlipped ? (
              <div className="flashcard-card-face front-face">
                <span className="card-face-tag">QUESTION PROMPT</span>
                <h2 className="flashcard-prompt-text">{renderQuestionContent(currentEx.question)}</h2>
                {currentEx.image_url && (
                  <img className="flashcard-card-img" src={currentEx.image_url} alt="Flashcard visual" />
                )}
                <div className="flashcard-front-footer">
                  <p className="flashcard-instruction">🤔 Think of the answer, then flip to choose!</p>
                  <button
                    className="flashcard-large-flip-btn"
                    onClick={() => setFlashcardFlipped(true)}
                    type="button"
                  >
                    🔄 Flip to Reveal Choices
                  </button>
                </div>
              </div>
            ) : (
              <div className="flashcard-card-face back-face">
                <span className="card-face-tag">ANSWER CHOICES</span>
                <p className="flashcard-prompt-recap">“{currentEx.question}”</p>
                <div className="flashcard-choices-grid">
                  {currentEx.options.map((option: string) => {
                    const isSelected = selectedChoice === option;
                    const isCorrect = result?.correctAnswer === option;
                    let choiceClass = "";
                    if (result) {
                      if (isCorrect) choiceClass = "choice-good";
                      else if (isSelected) choiceClass = "choice-bad";
                      else choiceClass = "choice-muted";
                    }
                    return (
                      <button
                        key={option}
                        disabled={!!result}
                        className={`flashcard-choice-btn ${choiceClass}`}
                        onClick={() => {
                          setSelectedChoice(option);
                          answer(option);
                        }}
                        type="button"
                      >
                        <span className="choice-bullet">✦</span>
                        <span className="choice-text">{option}</span>
                      </button>
                    );
                  })}
                </div>
                <button
                  className="flashcard-back-flip-btn"
                  onClick={() => setFlashcardFlipped(false)}
                  type="button"
                >
                  ↩ Review Question
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // 2. Fill in the Blank Layout
    if (currentSkillTemplate === "fill_blank") {
      const imageUrl = currentEx.image_url || currentEx.imageUrl;
      const imageQuestion = currentEx.image_question || currentEx.imageQuestion;
      const { hasBlank, title, prefix, suffix, word } = parseFillBlank(
        currentEx.question,
        skill?.name || "Fill in the blank",
        imageQuestion
      );
      const filledValue = selectedChoice || (result ? result.correctAnswer : null);
      const isLetterBlank = Boolean(
        currentEx.correct_answer &&
        String(currentEx.correct_answer).length <= 2 &&
        !/^\d+$/.test(String(currentEx.correct_answer))
      );
      const slotPlaceholder = isLetterBlank ? "_" : "____";

      return (
        <div className="formatted-fill-blank-stage">
          {/* Title at the top format */}
          <div className="fill-blank-top-section">
            <div className="fill-blank-banner">
              <span className="fill-blank-tag">✏️ FILL IN THE BLANK</span>
              <button
                type="button"
                className="fill-blank-speak-btn"
                onClick={() => speak(title)}
                title="Hear question"
                aria-label="Hear question"
              >
                🔊
              </button>
              <span className="fill-blank-progress">
                Question {index + 1} of {exercises.length}
              </span>
            </div>
            <h2 className="fill-blank-title-heading">{title}</h2>
          </div>

          {/* Image and word side by side */}
          <div className="fill-blank-display-card">
            <div className={`fill-blank-side-by-side ${imageUrl ? "has-image" : "no-image"}`}>
              {imageUrl && (
                <div className="fill-blank-image-col">
                  <div className="fill-blank-image-frame">
                    <img
                      className="fill-blank-side-illustration"
                      src={imageUrl}
                      alt={title || "Question clue"}
                    />
                  </div>
                </div>
              )}

              <div className="fill-blank-word-col">
                <div className="fill-blank-word-box">
                  {hasBlank ? (
                    <div className="fill-blank-word-display">
                      {prefix && <span className="word-text-segment">{prefix}</span>}
                      <span className={`fill-blank-interactive-slot ${isLetterBlank ? "letter-slot" : "number-slot"} ${filledValue ? "filled" : "waiting"}`}>
                        {filledValue || slotPlaceholder}
                      </span>
                      {suffix && <span className="word-text-segment">{suffix}</span>}
                    </div>
                  ) : (
                    <div className="fill-blank-word-display">
                      <span className="word-text-segment">{word}</span>
                      <span className="fill-blank-arrow">➔</span>
                      <span className={`fill-blank-interactive-slot ${isLetterBlank ? "letter-slot" : "number-slot"} ${filledValue ? "filled" : "waiting"}`}>
                        {filledValue || slotPlaceholder}
                      </span>
                    </div>
                  )}
                </div>
                <span className="fill-blank-cue-label">
                  {filledValue ? "Answer selected" : "Tap an option below to fill the blank"}
                </span>
              </div>
            </div>
          </div>

          {/* Options at the bottom */}
          <div className="fill-blank-tray">
            <p className="tray-heading">👇 Choose the missing letter or word:</p>
            <div className="fill-blank-tokens-row">
              {currentEx.options.map((option: string) => {
                const isSelected = selectedChoice === option;
                const isCorrect = result?.correctAnswer === option;
                let tokenClass = "";
                if (result) {
                  if (isCorrect) tokenClass = "token-good";
                  else if (isSelected) tokenClass = "token-bad";
                  else tokenClass = "token-muted";
                } else if (isSelected) {
                  tokenClass = "token-active";
                }
                return (
                  <button
                    key={option}
                    disabled={!!result}
                    className={`fill-blank-token-btn ${tokenClass}`}
                    onClick={() => {
                      setSelectedChoice(option);
                      answer(option);
                    }}
                    type="button"
                  >
                    <span className="token-icon">📌</span>
                    <span className="token-value">{option}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 3. True or False Layout
    if (currentSkillTemplate === "true_false") {
      return (
        <div className="formatted-true-false-stage">
          <div className="true-false-badge-row">
            <span className="tf-badge">⚖️ STATEMENT CHECK</span>
            <span className="tf-step">Check {index + 1} of {exercises.length}</span>
          </div>

          <div className="true-false-card">
            <span className="tf-quote-icon">“</span>
            <h2 className="true-false-statement">{currentEx.question}</h2>
            <span className="tf-quote-icon right">”</span>
            {currentEx.image_url && (
              <img className="true-false-image" src={currentEx.image_url} alt="Statement clue" />
            )}
            <p className="tf-prompt-cue">Is this statement True or False?</p>
          </div>

          <div className="true-false-buttons-row">
            {currentEx.options.map((option: string) => {
              const lower = option.toLowerCase().trim();
              const isTrueVal = lower === "true" || lower === "yes" || lower === "correct" || lower === "right";
              const isFalseVal = lower === "false" || lower === "no" || lower === "incorrect" || lower === "wrong";
              const isSelected = selectedChoice === option;
              const isCorrect = result?.correctAnswer === option;
              let verdictClass = isTrueVal ? "verdict-true" : isFalseVal ? "verdict-false" : "verdict-custom";
              if (result) {
                if (isCorrect) verdictClass += " result-correct";
                else if (isSelected) verdictClass += " result-wrong";
                else verdictClass += " result-muted";
              }
              return (
                <button
                  key={option}
                  disabled={!!result}
                  className={`true-false-verdict-btn ${verdictClass}`}
                  onClick={() => {
                    setSelectedChoice(option);
                    answer(option);
                  }}
                  type="button"
                >
                  <span className="verdict-icon">
                    {isTrueVal ? "✓" : isFalseVal ? "✗" : "◆"}
                  </span>
                  <span className="verdict-text">{option}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 4. Story Card Layout
    if (currentSkillTemplate === "story_card") {
      return (
        <div className="formatted-story-stage">
          <div className="story-book-frame">
            <div className="story-ribbon-bar">
              <span className="story-ribbon-icon">📖</span>
              <span className="story-chapter-title">Adventure Clue · Story Card {index + 1}</span>
            </div>

            <div className="story-body-card">
              <div className="story-passage-box">
                <span className="story-large-quote">“</span>
                <h2 className="story-passage-text">{currentEx.question}</h2>
              </div>

              {currentEx.image_url && (
                <div className="story-illustration-wrap">
                  <img className="story-illustration-img" src={currentEx.image_url} alt="Story scene" />
                </div>
              )}

              <div className="story-prompt-divider">
                <span>✨ How does the story resolve? Choose the correct answer:</span>
              </div>

              <div className="story-options-list">
                {currentEx.options.map((option: string, optIndex: number) => {
                  const letter = String.fromCharCode(65 + optIndex);
                  const isSelected = selectedChoice === option;
                  const isCorrect = result?.correctAnswer === option;
                  let choiceClass = "";
                  if (result) {
                    if (isCorrect) choiceClass = "story-opt-good";
                    else if (isSelected) choiceClass = "story-opt-bad";
                    else choiceClass = "story-opt-muted";
                  }
                  return (
                    <button
                      key={option}
                      disabled={!!result}
                      className={`story-option-card ${choiceClass}`}
                      onClick={() => {
                        setSelectedChoice(option);
                        answer(option);
                      }}
                      type="button"
                    >
                      <span className="story-letter-badge">{letter}</span>
                      <span className="story-option-text">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      );
    }

    // 5. Image Prompt Layout
    if (currentSkillTemplate === "image_prompt") {
      const mathVisual = parseMathVisual(currentEx.question);

      return (
        <div className="formatted-image-stage">
          <div className="image-prompt-header-bar">
            <button
              type="button"
              className={`visual-investigation-toggle-btn ${showVisualPrompt ? "open" : "collapsed"}`}
              onClick={() => setShowVisualPrompt(!showVisualPrompt)}
              aria-expanded={showVisualPrompt}
              title={showVisualPrompt ? "Collapse visual clue" : "Expand visual clue"}
            >
              <span className="image-prompt-tag">🖼️ VISUAL INVESTIGATION</span>
              <span className="visual-toggle-hint">
                {showVisualPrompt ? "Hide visual clue ▴" : "Show visual clue ▾"}
              </span>
            </button>
            <span className="image-prompt-counter">Question {index + 1} of {exercises.length}</span>
          </div>

          {!showVisualPrompt ? (
            <button
              type="button"
              className="visual-investigation-teaser-card"
              onClick={() => setShowVisualPrompt(true)}
              title="Click to view visual clue"
            >
              <span className="teaser-icon">🔍</span>
              <span className="teaser-text">
                Visual clue &amp; model available — <strong>Click to expand</strong>
              </span>
              <span className="teaser-expand-pill">Show ▾</span>
            </button>
          ) : (
            <div className="image-prompt-canvas">
              <div className="image-prompt-canvas-top-bar">
                <span className="canvas-badge-info">Visual Model Active</span>
                <button
                  type="button"
                  className="canvas-collapse-btn"
                  onClick={() => setShowVisualPrompt(false)}
                >
                  Collapse ▴
                </button>
              </div>
              {currentEx.image_url ? (
                <div className="image-prompt-framed-photo">
                  <img src={currentEx.image_url} alt="Question visual" className="image-prompt-main-pic" />
                  {currentEx.image_question && (
                    <div className="image-prompt-caption-box">
                      <span className="caption-star">🔎</span>
                      <span className="caption-text">{currentEx.image_question}</span>
                    </div>
                  )}
                </div>
              ) : mathVisual ? (
                <div className="image-prompt-math-box">
                  <div className="math-visual-banner">
                    <span className="math-model-pill">Visual Counting Model</span>
                    <span className="math-formula-tag">{currentEx.question}</span>
                  </div>

                  {mathVisual.type === "multiplication" ? (
                    <div className="math-array-container">
                      <div className="array-info-label">
                        <strong>{mathVisual.rows} rows</strong> with <strong>{mathVisual.cols} counters</strong> in each row:
                      </div>
                      <div className="math-array-rows">
                        {Array.from({ length: mathVisual.rows }).map((_, rIdx) => (
                          <div key={rIdx} className="array-row-line">
                            <span className="array-row-badge">Row {rIdx + 1}</span>
                            <div className="array-row-counters">
                              {Array.from({ length: mathVisual.cols }).map((_, cIdx) => (
                                <span key={cIdx} className="array-star-item" title={`Item ${rIdx * mathVisual.cols + cIdx + 1}`}>⭐</span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="math-array-footer-hint">
                        Count the stars: {mathVisual.rows} × {mathVisual.cols} = ?
                      </div>
                    </div>
                  ) : (
                    <div className="math-addition-container">
                      <div className="math-add-group">
                        <span className="add-group-pill">{mathVisual.a} items</span>
                        <div className="add-group-items">
                          {Array.from({ length: mathVisual.a }).map((_, i) => (
                            <span key={i} className="add-token">🍎</span>
                          ))}
                        </div>
                      </div>
                      <span className="math-plus-symbol">+</span>
                      <div className="math-add-group">
                        <span className="add-group-pill">{mathVisual.b} items</span>
                        <div className="add-group-items">
                          {Array.from({ length: mathVisual.b }).map((_, i) => (
                            <span key={i} className="add-token">🍏</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="image-prompt-subject-badge-card">
                  <div className="subject-big-icon">
                    {skill?.subject === "Mathematics" ? "🔢" : skill?.subject === "English" ? "🔤" : "🔬"}
                  </div>
                  <div className="subject-badge-content">
                    <span className="subject-pill">{skill?.subject} · {skill?.topic}</span>
                    <h4 className="subject-badge-title">Visual Observation</h4>
                    <p className="subject-badge-desc">Look at the challenge and select the correct answer below.</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="image-prompt-question-bar">
            <span className="q-mark-bubble">?</span>
            <h2 className="image-prompt-question-text">{currentEx.question}</h2>
          </div>

          <div className="image-prompt-options-grid">
            {currentEx.options.map((option: string) => {
              const isSelected = selectedChoice === option;
              const isCorrect = result?.correctAnswer === option;
              let optClass = "";
              if (result) {
                if (isCorrect) optClass = "good";
                else if (isSelected) optClass = "bad";
                else optClass = "muted";
              }
              return (
                <button
                  key={option}
                  disabled={!!result}
                  className={`image-prompt-btn ${optClass}`}
                  onClick={() => {
                    setSelectedChoice(option);
                    answer(option);
                  }}
                  type="button"
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 6. Rhyme Card Layout (with Collapsible Answer State)
    if (currentSkillTemplate === "rhyme_card" || /rhyme/i.test(skill?.name || "")) {
      const targetWordMatch = currentEx.question.match(/(?:rhymes with|rhyming pair for|rhyming match for|words for|sound of)\s+([A-Za-z]+)/i);
      const targetWord = targetWordMatch ? targetWordMatch[1] : (currentEx.question.split(" ").pop()?.replace(/[^a-zA-Z]/g, "") || "Word");
      const familyClue = currentEx.image_question || "Rhyming Sound Family";
      const correctRaw = currentEx.correct_answer || currentEx.correctAnswer || "";
      const trioWords = String(correctRaw).split(",").map((w) => w.trim()).filter(Boolean);

      return (
        <div className="formatted-rhyme-stage">
          {/* Header Bar */}
          <div className="rhyme-stage-header">
            <span className="rhyme-badge">🎵 RHYME TRIO CHALLENGE</span>
            <div className="rhyme-header-actions">
              <button
                type="button"
                className="rhyme-speaker-btn"
                onClick={() => speak(`${currentEx.question}. Find 3 words that rhyme with ${targetWord}.`)}
                title="Hear question"
                aria-label="Hear question"
              >
                🔊 Listen
              </button>
              <span className="rhyme-counter">Question {index + 1} of {exercises.length}</span>
            </div>
          </div>

          {/* Hero Target Word Card */}
          <div className="rhyme-hero-box">
            <div className="rhyme-music-notes" aria-hidden="true">
              <span>🎶</span>
              <span>✨</span>
              <span>🎵</span>
            </div>
            <p className="rhyme-prompt-subtitle">{currentEx.question}</p>
            <div className="rhyme-target-word-display">
              <span className="rhyme-sparkle-left">✨</span>
              <span className="rhyme-target-word">{targetWord}</span>
              <span className="rhyme-sparkle-right">✨</span>
            </div>
            <p className="rhyme-instruction-hint">
              Find <strong>3 words</strong> that rhyme with <strong>{targetWord}</strong>!
            </p>
          </div>

          {/* Collapsible Answer State Drawer */}
          <div className="rhyme-collapse-wrapper">
            <div className="rhyme-collapse-bar">
              <button
                type="button"
                className={`rhyme-collapse-toggle-btn ${rhymeAnswerCollapsed && !result ? "collapsed" : "expanded"}`}
                onClick={() => setRhymeAnswerCollapsed(!rhymeAnswerCollapsed)}
                aria-expanded={!rhymeAnswerCollapsed || !!result}
                title={rhymeAnswerCollapsed && !result ? "Expand to peek 3 rhyming words & clue" : "Collapse answer drawer"}
              >
                <span className="toggle-icon">{rhymeAnswerCollapsed && !result ? "👁️" : "🙈"}</span>
                <span className="toggle-label">
                  {rhymeAnswerCollapsed && !result
                    ? "Peek 3 Rhyming Words & Clue ▾"
                    : "Hide 3 Rhyming Words ▴"}
                </span>
                <span className="toggle-state-pill">
                  {rhymeAnswerCollapsed && !result ? "Hidden (Collapsed)" : "Revealed"}
                </span>
              </button>
            </div>

            {(!rhymeAnswerCollapsed || !!result) && (
              <div className="rhyme-revealed-card animate-fade-in">
                <div className="rhyme-revealed-header">
                  <span className="revealed-badge-icon">💡</span>
                  <div>
                    <h4 className="revealed-title">3 Rhyming Words Solution &amp; Phonics Clue</h4>
                    <p className="revealed-subtitle">{familyClue}</p>
                  </div>
                </div>

                <div className="rhyme-pair-spotlight trio-spotlight">
                  <div className="rhyme-spotlight-item target">
                    <span className="spotlight-tag">Prompt Word</span>
                    <span className="spotlight-word">{targetWord}</span>
                  </div>
                  <span className="rhyme-spotlight-connector">➔ 3 Rhyming Words ➔</span>
                  <div className="rhyme-trio-chips">
                    {trioWords.map((word: string, wIdx: number) => (
                      <span key={wIdx} className="rhyme-trio-chip">
                        <span className="chip-badge">#{wIdx + 1}</span>
                        <strong className="chip-word">{word}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="rhyme-explanation-box">
                  <p className="rhyme-explanation-text">
                    💬 {currentEx.explanation || `${targetWord} rhymes with ${trioWords.join(', ')}! All three words share the same ending sound.`}
                  </p>
                  <button
                    type="button"
                    className="rhyme-recite-pair-btn"
                    onClick={() => speak(`${targetWord} rhymes with ${trioWords.join(', ')}! All three words share the same sound family.`)}
                  >
                    🔊 Hear All 3 Rhymes
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Answer Options Grid */}
          <div className="rhyme-options-section">
            <p className="rhyme-options-heading">👇 Choose the 3 words that rhyme with <strong>{targetWord}</strong>:</p>
            <div className="rhyme-options-grid">
              {currentEx.options.map((option: string, optIdx: number) => {
                const isSelected = selectedChoice === option;
                const isCorrect = (result?.correctAnswer || currentEx.correct_answer) === option;
                let optClass = "";
                if (result) {
                  if (isCorrect) optClass = "rhyme-opt-good";
                  else if (isSelected) optClass = "rhyme-opt-bad";
                  else optClass = "rhyme-opt-muted";
                } else if (isSelected) {
                  optClass = "rhyme-opt-active";
                }

                const wordsInOption = option.split(",").map((w) => w.trim());

                return (
                  <button
                    key={option}
                    disabled={!!result}
                    className={`rhyme-option-btn ${optClass}`}
                    onClick={() => {
                      setSelectedChoice(option);
                      setRhymeAnswerCollapsed(false);
                      answer(option);
                    }}
                    type="button"
                  >
                    <span className="rhyme-opt-bullet">{String.fromCharCode(65 + optIdx)}</span>
                    <div className="rhyme-opt-words-row">
                      {wordsInOption.map((wPart: string, pIdx: number) => (
                        <span key={pIdx} className="rhyme-word-pill">
                          {wPart}
                        </span>
                      ))}
                    </div>
                    {result && isCorrect && <span className="rhyme-opt-check">✓ 3 Rhymes!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 7. Shape Card Layout (Recognition, Visual Image Beside Question, & Collapsible Answer State)
    if (currentSkillTemplate === "shape_card" || /shape/i.test(skill?.name || "")) {
      let shapeMeta: any = {};
      try {
        if (currentEx.image_question && typeof currentEx.image_question === "string" && currentEx.image_question.trim().startsWith("{")) {
          shapeMeta = JSON.parse(currentEx.image_question);
        }
      } catch {
        shapeMeta = {};
      }

      const shapeName = shapeMeta.shape || currentEx.explanation?.match(/The shape is a ([A-Za-z]+)/i)?.[1] || "Shape";
      const shapeSymbol = shapeMeta.symbol || (
        /circle/i.test(shapeName) ? "⭕" :
        /square/i.test(shapeName) ? "⬛" :
        /triangle/i.test(shapeName) ? "🔺" :
        /rectangle/i.test(shapeName) ? "▭" :
        /oval/i.test(shapeName) ? "🥚" :
        /star/i.test(shapeName) ? "⭐" :
        /heart/i.test(shapeName) ? "❤️" :
        /diamond|rhombus/i.test(shapeName) ? "🔶" :
        /hexagon/i.test(shapeName) ? "⬡" :
        /octagon/i.test(shapeName) ? "🛑" :
        /pentagon/i.test(shapeName) ? "⬟" :
        /cylinder/i.test(shapeName) ? "🥫" :
        /sphere/i.test(shapeName) ? "⚽" :
        /cube/i.test(shapeName) ? "🎲" :
        /cone/i.test(shapeName) ? "🍦" :
        /pyramid/i.test(shapeName) ? "⛺" :
        /trapezoid/i.test(shapeName) ? "⏢" :
        /crescent/i.test(shapeName) ? "🌙" :
        /semicircle/i.test(shapeName) ? "🔲" : "📐"
      );
      const shapeType = shapeMeta.type || (/sphere|cube|cylinder|cone|pyramid/i.test(shapeName) ? "3D Solid" : "2D Shape");
      const shapeSides = shapeMeta.sides || "Geometric Shape";
      const shapeRiddle = shapeMeta.riddle || currentEx.question;
      const shapeWord = (shapeMeta.word || shapeName).toUpperCase();
      const rawBlank = shapeMeta.blank || currentEx.question.match(/:\s*([A-Z_\s]+)/i)?.[1]?.trim() || shapeWord.replace(/[AEIOU]/g, "_");
      const correctAnswer = currentEx.correct_answer || currentEx.correctAnswer || shapeMeta.missing || "";
      const funFact = shapeMeta.fun_fact || currentEx.explanation || "";

      // Parse blank letter tokens
      const blankTokens = rawBlank.includes(" ")
        ? rawBlank.split(/\s+/).filter(Boolean)
        : rawBlank.split("");

      const activeLetters = (selectedChoice || (result ? result.correctAnswer : "")).split(/[\s,]+/).filter(Boolean);
      let blankCounter = 0;

      return (
        <div className="formatted-shape-stage">
          {/* Header Bar */}
          <div className="shape-stage-header">
            <div className="shape-badge-group">
              <span className="shape-badge">📐 SHAPE DETECTIVE</span>
              <span className="shape-type-pill">{shapeType}</span>
            </div>
            <div className="shape-header-actions">
              <button
                type="button"
                className="shape-speaker-btn"
                onClick={() => speak(`What shape is this? ${shapeSides}. ${shapeRiddle}`)}
                title="Hear shape clues aloud"
                aria-label="Hear shape clues aloud"
              >
                🔊 Listen
              </button>
              <span className="shape-counter">Question {index + 1} of {exercises.length}</span>
            </div>
          </div>

          {/* Hero Row: Shape Image BESIDE Question & Spelling */}
          <div className="shape-hero-side-by-side">
            {/* Left Column: Shape Illustration */}
            <div className="shape-visual-column">
              <div className="shape-illustration-card">
                <div className="shape-art-stage">
                  <ShapeGraphic shape={shapeName} size={190} showVertices={true} />
                </div>
                <div className="shape-visual-footer">
                  <span className="visual-cue-icon">🔍</span>
                  <span className="visual-cue-text">Count sides &amp; corners!</span>
                </div>
              </div>
            </div>

            {/* Right Column: Properties, Riddle & Fill-in-the-Blank Spelling */}
            <div className="shape-content-column">
              {/* Properties Chip */}
              <div className="shape-property-chip">
                <span className="chip-icon">📏</span>
                <span className="chip-text"><strong>Sides &amp; Corners:</strong> {shapeSides}</span>
              </div>

              {/* Real-World Riddle */}
              <div className="shape-riddle-box">
                <span className="riddle-quote">“</span>
                <p className="riddle-text">{shapeRiddle}</p>
              </div>

              {/* Fill-in-the-Blank Monospaced Box */}
              <div className="shape-spelling-interactive-box">
                <span className="spelling-label">🔤 Fill in the missing letters:</span>
                <div className="shape-letter-slots-row">
                  {blankTokens.map((token: string, tIdx: number) => {
                    const isBlank = token === "_" || token === "—";
                    if (isBlank) {
                      const filledChar = activeLetters[blankCounter];
                      blankCounter++;
                      return (
                        <span
                          key={tIdx}
                          className={`shape-slot ${filledChar ? "slot-filled" : "slot-waiting"}`}
                        >
                          {filledChar || "_"}
                        </span>
                      );
                    }
                    return (
                      <span key={tIdx} className="shape-letter-fixed">
                        {token}
                      </span>
                    );
                  })}
                </div>
                <span className="spelling-subhint">
                  {selectedChoice
                    ? `Selected: ${selectedChoice}`
                    : "Look at the shape image on the left and pick the missing letters below!"}
                </span>
              </div>
            </div>
          </div>

          {/* Collapsible Answer State Drawer (strictly hidden by default) */}
          <div className="shape-collapse-wrapper">
            <div className="shape-collapse-bar">
              <button
                type="button"
                className={`shape-collapse-toggle-btn ${shapeAnswerCollapsed && !result ? "collapsed" : "expanded"}`}
                onClick={() => setShapeAnswerCollapsed(!shapeAnswerCollapsed)}
                aria-expanded={!shapeAnswerCollapsed || !!result}
                title={shapeAnswerCollapsed && !result ? "Peek shape solution & properties" : "Collapse solution drawer"}
              >
                <span className="toggle-icon">{shapeAnswerCollapsed && !result ? "👁️" : "🙈"}</span>
                <span className="toggle-label">
                  {shapeAnswerCollapsed && !result
                    ? "Peek Shape Solution & Fun Fact ▾"
                    : "Hide Solution Drawer ▴"}
                </span>
                <span className="toggle-state-pill">
                  {shapeAnswerCollapsed && !result ? "Hidden (Collapsed)" : "Revealed"}
                </span>
              </button>
            </div>

            {(!shapeAnswerCollapsed || !!result) && (
              <div className="shape-revealed-card animate-fade-in">
                <div className="shape-revealed-header">
                  <span className="revealed-badge-icon">{shapeSymbol}</span>
                  <div>
                    <h4 className="revealed-title">{shapeWord} ({shapeType})</h4>
                    <p className="revealed-subtitle">{shapeSides}</p>
                  </div>
                </div>

                <div className="shape-solution-spotlight">
                  <div className="shape-full-word-banner">
                    <span className="banner-label">Full Shape Name:</span>
                    <span className="banner-word">{shapeWord}</span>
                  </div>
                  <div className="shape-missing-revealed">
                    <span className="missing-tag">Missing Letters:</span>
                    <strong className="missing-value">{correctAnswer}</strong>
                  </div>
                </div>

                {funFact && (
                  <div className="shape-fun-fact-box">
                    <span className="fact-icon">🌟</span>
                    <p className="fact-text">{funFact}</p>
                  </div>
                )}

                <button
                  type="button"
                  className="shape-hear-solution-btn"
                  onClick={() => speak(`The shape is a ${shapeName}! It is spelled ${shapeWord.split('').join(' ')}. ${shapeSides}.`)}
                >
                  🔊 Hear Shape Name &amp; Spelling Aloud
                </button>
              </div>
            )}
          </div>

          {/* Options Grid */}
          <div className="shape-options-section">
            <p className="shape-options-heading">
              👇 Choose the missing letters to spell <strong>{result ? shapeName : "this shape"}</strong>:
            </p>
            <div className="shape-options-grid">
              {currentEx.options.map((option: string, optIdx: number) => {
                const isSelected = selectedChoice === option;
                const isCorrect = (result?.correctAnswer || currentEx.correct_answer) === option;
                let optClass = "";
                if (result) {
                  if (isCorrect) optClass = "shape-opt-good";
                  else if (isSelected) optClass = "shape-opt-bad";
                  else optClass = "shape-opt-muted";
                } else if (isSelected) {
                  optClass = "shape-opt-active";
                }

                return (
                  <button
                    key={option}
                    disabled={!!result}
                    className={`shape-option-btn ${optClass}`}
                    onClick={() => {
                      setSelectedChoice(option);
                      setShapeAnswerCollapsed(false);
                      answer(option);
                    }}
                    type="button"
                  >
                    <span className="shape-opt-bullet">{String.fromCharCode(65 + optIdx)}</span>
                    <span className="shape-opt-text">{option}</span>
                    {result && isCorrect && <span className="shape-opt-check">✓ Correct!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 8. Magic Words Card Layout (Situational Manners, Audio Voice, & Collapsible Golden Rule)
    if (currentSkillTemplate === "magic_words_card" || /magic word/i.test(skill?.name || "")) {
      let magicMeta: any = {};
      try {
        if (currentEx.image_question && typeof currentEx.image_question === "string" && currentEx.image_question.trim().startsWith("{")) {
          magicMeta = JSON.parse(currentEx.image_question);
        }
      } catch {
        magicMeta = {};
      }

      const scenarioTitle = magicMeta.title || "Daily Manners Challenge";
      const category = magicMeta.category || "Social Skills & Etiquette";
      const categoryIcon = magicMeta.category_icon || "🏫";
      const sceneEmoji = magicMeta.emoji || "🪄";
      const situationText = magicMeta.situation || currentEx.question;
      const targetMagicWord = magicMeta.magic_word || currentEx.correct_answer || currentEx.correctAnswer || "Magic Word";
      const marathiTranslation = magicMeta.marathi || "";
      const goldenRule = magicMeta.golden_rule || currentEx.explanation || "Magic words show kindness and make hearts happy!";
      const exampleDialogue = magicMeta.dialogue || "";
      const correctAnswer = currentEx.correct_answer || currentEx.correctAnswer || "";

      return (
        <div className="formatted-magic-stage">
          {/* Header Bar */}
          <div className="magic-stage-header">
            <div className="magic-badge-group">
              <span className="magic-badge">🪄 MAGIC WORDS DETECTIVE</span>
              <span className="magic-category-pill">{categoryIcon} {category}</span>
            </div>
            <div className="magic-header-actions">
              <button
                type="button"
                className="magic-speaker-btn"
                onClick={() => speak(`${situationText}. What magic word should you say?`)}
                title="Hear scenario aloud"
                aria-label="Hear scenario aloud"
              >
                🔊 Listen
              </button>
              <span className="magic-counter">Question {index + 1} of {exercises.length}</span>
            </div>
          </div>

          {/* Hero Row: Scene Badge & Situation Story */}
          <div className="magic-hero-card">
            <div className="magic-hero-top">
              <span className="magic-scene-avatar" aria-hidden="true">{sceneEmoji}</span>
              <div className="magic-hero-titles">
                <span className="magic-scene-tag">{category}</span>
                <h3 className="magic-scenario-title">{scenarioTitle}</h3>
              </div>
            </div>

            {/* Situation Story Bubble */}
            <div className="magic-story-bubble">
              <span className="magic-quote-mark">“</span>
              <p className="magic-situation-text">{situationText}</p>
            </div>

            {/* Interactive Question Prompt */}
            <div className="magic-prompt-banner">
              <span className="magic-wand-sparkle">✨</span>
              <span className="magic-prompt-text">What magic word should you say?</span>
              <span className="magic-wand-sparkle">✨</span>
            </div>
          </div>

          {/* Collapsible Answer State & Golden Rule Drawer */}
          <div className="magic-collapse-wrapper">
            <div className="magic-collapse-bar">
              <button
                type="button"
                className={`magic-collapse-toggle-btn ${magicAnswerCollapsed && !result ? "collapsed" : "expanded"}`}
                onClick={() => setMagicAnswerCollapsed(!magicAnswerCollapsed)}
                aria-expanded={!magicAnswerCollapsed || !!result}
                title={magicAnswerCollapsed && !result ? "Peek magic word solution & golden rule" : "Collapse solution drawer"}
              >
                <span className="toggle-icon">{magicAnswerCollapsed && !result ? "👁️" : "🙈"}</span>
                <span className="toggle-label">
                  {magicAnswerCollapsed && !result
                    ? "Peek Magic Word & Golden Rule ▾"
                    : "Hide Solution Drawer ▴"}
                </span>
                <span className="toggle-state-pill">
                  {magicAnswerCollapsed && !result ? "Hidden (Collapsed)" : "Revealed"}
                </span>
              </button>
            </div>

            {(!magicAnswerCollapsed || !!result) && (
              <div className="magic-revealed-card animate-fade-in">
                <div className="magic-revealed-header">
                  <span className="revealed-badge-icon">🌟</span>
                  <div>
                    <h4 className="revealed-title">Magic Word: {targetMagicWord} {marathiTranslation && `(${marathiTranslation})`}</h4>
                    <p className="revealed-subtitle">{scenarioTitle} • {category}</p>
                  </div>
                </div>

                <div className="magic-solution-spotlight">
                  <div className="magic-rule-box">
                    <span className="rule-badge">⭐ Golden Rule:</span>
                    <p className="rule-text">{goldenRule}</p>
                  </div>
                  {exampleDialogue && (
                    <div className="magic-dialogue-box">
                      <span className="dialogue-badge">💬 Say it politely:</span>
                      <p className="dialogue-text">“{exampleDialogue}”</p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  className="magic-hear-solution-btn"
                  onClick={() => speak(`The magic word is ${targetMagicWord}! ${goldenRule} For example: ${exampleDialogue}`)}
                >
                  🔊 Hear Golden Rule &amp; Dialogue Aloud
                </button>
              </div>
            )}
          </div>

          {/* Answer Options Grid */}
          <div className="magic-options-section">
            <p className="magic-options-heading">
              👇 Choose the right magic word to spread kindness:
            </p>
            <div className="magic-options-grid">
              {currentEx.options.map((option: string, optIdx: number) => {
                const isSelected = selectedChoice === option;
                const isCorrect = (result?.correctAnswer || correctAnswer) === option;
                let optClass = "";
                if (result) {
                  if (isCorrect) optClass = "magic-opt-good";
                  else if (isSelected) optClass = "magic-opt-bad";
                  else optClass = "magic-opt-muted";
                } else if (isSelected) {
                  optClass = "magic-opt-active";
                }

                // Extract English and Marathi parts if formatted like "Please (कृपया)"
                const marathiMatch = option.match(/^(.*?)\s*\((.*?)\)$/);
                const engText = marathiMatch ? marathiMatch[1] : option;
                const marathiText = marathiMatch ? marathiMatch[2] : null;

                return (
                  <button
                    key={option}
                    disabled={!!result}
                    className={`magic-option-btn ${optClass}`}
                    onClick={() => {
                      setSelectedChoice(option);
                      setMagicAnswerCollapsed(false);
                      speak(option);
                      answer(option);
                    }}
                    type="button"
                  >
                    <span className="magic-opt-bullet">{String.fromCharCode(65 + optIdx)}</span>
                    <div className="magic-opt-content">
                      <span className="magic-opt-eng">{engText}</span>
                      {marathiText && <span className="magic-opt-marathi">{marathiText}</span>}
                    </div>
                    {result && isCorrect && <span className="magic-opt-check">✓ Magic Word!</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      );
    }

    // 9. Standard Layout (Default)
    return (
      <div className="standard-quiz-box">
        <div className="standard-quiz-header">
          <span className="standard-q-pill">Question {index + 1} of {exercises.length}</span>
          <h2 className="standard-question-heading">{renderQuestionContent(currentEx.question)}</h2>
        </div>
        {currentEx.image_url && (
          <img className="question-image" src={currentEx.image_url} alt="Question illustration" />
        )}
        {currentEx.image_question && (
          <p className="image-question-text">{currentEx.image_question}</p>
        )}
        <div className="options">
          {currentEx.options.map((option: string) => {
            const isSelected = selectedChoice === option;
            const isCorrect = result?.correctAnswer === option;
            let optClass = "";
            if (result) {
              if (isCorrect) optClass = "good";
              else if (isSelected) optClass = "bad";
              else optClass = "muted";
            }
            return (
              <button
                key={option}
                disabled={!!result}
                className={optClass}
                onClick={() => {
                  setSelectedChoice(option);
                  answer(option);
                }}
                type="button"
              >
                {option}
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  if (!session)
    return (
      <div className="login-screen">
        <div className="login-box">
          <div className="brand login-brand">
            <span className="brand-mark">S</span>
            <div>
              <strong>SmartStudy</strong>
              <small>Adaptive Learning Platform</small>
            </div>
          </div>

          <div className="login-role-tabs" role="tablist">
            <button
              className={`login-role-tab ${loginRole === "student" ? "active" : ""}`}
              onClick={() => { setLoginRole("student"); setAuthError(null); }}
              role="tab"
              aria-selected={loginRole === "student"}
            >
              <span>🎒</span> Student
            </button>
            <button
              className={`login-role-tab ${loginRole === "parent" ? "active" : ""}`}
              onClick={() => { setLoginRole("parent"); setRegRole("parent"); setAuthError(null); }}
              role="tab"
              aria-selected={loginRole === "parent"}
            >
              <span>👨‍👩‍👧</span> Parent Portal
            </button>
            <button
              className={`login-role-tab ${loginRole === "teacher" ? "active" : ""}`}
              onClick={() => { setLoginRole("teacher"); setRegRole("teacher"); setAuthError(null); }}
              role="tab"
              aria-selected={loginRole === "teacher"}
            >
              <span>👩‍🏫</span> Teacher
            </button>
          </div>

          {authError && <div className="auth-error-banner">{authError}</div>}

          {loginRole === "student" ? (
            <div className="student-login-panel">
              <h1>Welcome, Learner!</h1>
              <p>Search or choose your profile below to start learning.</p>
              <div className="autocomplete">
                <input
                  className="child-search login-control"
                  value={childSearch}
                  onChange={(event) => {
                    setChildSearch(event.target.value);
                    setSelectedLoginChild("");
                  }}
                  placeholder="Type your name or username..."
                  aria-label="Search children"
                  autoComplete="off"
                />
                {childSearch && !selectedLoginChild && (
                  <div className="suggestions" role="listbox">
                    {filteredChildren.map((item) => (
                      <button
                        className="suggestion"
                        key={item.id}
                        onClick={() => {
                          setChildSearch(`${item.name} (@${item.username})`);
                          setSelectedLoginChild(item.id);
                        }}
                        role="option"
                      >
                        <span className="avatar">{item.avatar || item.name.charAt(0)}</span>
                        <span>
                          <b>{item.name}</b>
                          <small>@{item.username} · Class {item.grade}</small>
                        </span>
                      </button>
                    ))}
                    {!filteredChildren.length && (
                      <p className="muted">No learner found with that name.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="student-quick-grid">
                {children.map((item) => (
                  <button
                    key={item.id}
                    className={`student-quick-card ${selectedLoginChild === item.id ? "selected" : ""}`}
                    onClick={() => {
                      setSelectedLoginChild(item.id);
                      setChildSearch(`${item.name} (@${item.username})`);
                    }}
                  >
                    <span className="avatar">{item.avatar || item.name.charAt(0)}</span>
                    <div style={{ flex: 1 }}>
                      <b>{item.name}</b>
                      <small>@{item.username} · Class {item.grade} · {item.board || "CBSE"}</small>
                    </div>
                    <span className="arrow">›</span>
                  </button>
                ))}
              </div>

              <button
                style={{ marginTop: "16px" }}
                className="login-continue"
                disabled={!selectedLoginChild || authLoading}
                onClick={() => handleStudentLogin(selectedLoginChild)}
              >
                {authLoading ? "Entering learning space..." : "Start Learning 🚀"}
              </button>
              {!children.length && <p className="muted">Loading learners...</p>}
            </div>
          ) : (
            <div className="adult-auth-panel">
              <div className="auth-mode-toggle">
                <button
                  type="button"
                  className={`auth-mode-btn ${authMode === "login" ? "active" : ""}`}
                  onClick={() => { setAuthMode("login"); setAuthError(null); }}
                >
                  🔑 Sign In
                </button>
                <button
                  type="button"
                  className={`auth-mode-btn ${authMode === "register" ? "active" : ""}`}
                  onClick={() => { setAuthMode("register"); setAuthError(null); }}
                >
                  ✨ Register / Sign Up
                </button>
              </div>

              {authMode === "login" ? (
                <form className="teacher-login-form" onSubmit={handleAdultLogin}>
                  <h1>{loginRole === "parent" ? "Parent & Family Portal" : "Teacher Portal"}</h1>
                  <p>
                    {loginRole === "parent"
                      ? "Sign in to manage your kids' learning profiles, review reports, and track milestones."
                      : "Sign in to manage curriculum, review reports, and customize practice questions."}
                  </p>

                  <div className="demo-hint-box">
                    <div>
                      <strong>Demo credentials:</strong><br />
                      {loginRole === "parent" ? "parent@smartstudy.ai" : "teacher@smartstudy.ai"} / password123
                    </div>
                    <button
                      type="button"
                      className="demo-fill-btn"
                      onClick={() => {
                        if (loginRole === "parent") {
                          setParentEmail("parent@smartstudy.ai");
                          setParentPassword("password123");
                        } else {
                          setTeacherEmail("teacher@smartstudy.ai");
                          setTeacherPassword("password123");
                        }
                      }}
                    >
                      Use Demo
                    </button>
                  </div>

                  <label>
                    Email Address
                    <input
                      type="email"
                      className="login-control"
                      value={loginRole === "parent" ? parentEmail : teacherEmail}
                      onChange={(e) =>
                        loginRole === "parent" ? setParentEmail(e.target.value) : setTeacherEmail(e.target.value)
                      }
                      placeholder={loginRole === "parent" ? "parent@smartstudy.ai" : "teacher@smartstudy.ai"}
                      required
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      className="login-control"
                      value={loginRole === "parent" ? parentPassword : teacherPassword}
                      onChange={(e) =>
                        loginRole === "parent" ? setParentPassword(e.target.value) : setTeacherPassword(e.target.value)
                      }
                      placeholder="Enter your password"
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    className="login-continue"
                    disabled={authLoading}
                  >
                    {authLoading ? "Signing in..." : `Sign in as ${loginRole === "parent" ? "Parent" : "Teacher"}`}
                  </button>

                  <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
                    Don't have an account?{" "}
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => { setAuthMode("register"); setRegRole(loginRole as "parent" | "teacher"); }}
                    >
                      Create account here
                    </button>
                  </div>
                </form>
              ) : (
                <form className="teacher-login-form" onSubmit={handleRegister}>
                  <h1>Create {loginRole === "parent" ? "Parent" : "Teacher"} Account</h1>
                  <p>Register once to create and manage multiple student profiles.</p>

                  <label>
                    Full Name
                    <input
                      type="text"
                      className="login-control"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Priya Sharma"
                      required
                    />
                  </label>

                  <label>
                    Email Address
                    <input
                      type="email"
                      className="login-control"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      placeholder="e.g. parent@example.com"
                      required
                    />
                  </label>

                  <label>
                    Password
                    <input
                      type="password"
                      className="login-control"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="Create a strong password"
                      required
                      minLength={6}
                    />
                  </label>

                  <label>
                    Account Type
                    <select
                      className="login-control"
                      value={regRole}
                      onChange={(e) => setRegRole(e.target.value as "parent" | "teacher")}
                    >
                      <option value="parent">Parent (Family &amp; Kids Management)</option>
                      <option value="teacher">Teacher (Classroom &amp; Educator)</option>
                    </select>
                  </label>

                  <button
                    type="submit"
                    className="login-continue"
                    disabled={authLoading}
                  >
                    {authLoading ? "Creating account..." : `Create ${regRole === "parent" ? "Parent" : "Teacher"} Account 🎉`}
                  </button>

                  <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "var(--muted)" }}>
                    Already have an account?{" "}
                    <button
                      type="button"
                      style={{ background: "none", border: "none", color: "var(--teal)", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => setAuthMode("login")}
                    >
                      Sign in here
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}
        </div>
      </div>
    );

  return (
    <div className={`app-shell ${sidebarCollapsed ? "sidebar-collapsed" : ""} ${exerciseFullscreen ? "exercise-fullscreen" : ""}`}>
      <aside className={`sidebar ${sidebarCollapsed ? "sidebar-collapsed" : ""}`}>
        <div className="brand">
          <span className="brand-mark">S</span>
          <div>
            <strong>SmartStudy</strong>
            <small>Learning companion</small>
          </div>
          <button className="sidebar-toggle" onClick={() => { const next = !sidebarCollapsed; setSidebarCollapsed(next); localStorage.setItem("smartstudy-sidebar-collapsed", String(next)); }} aria-label={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"} title={sidebarCollapsed ? "Expand navigation" : "Collapse navigation"}>
            {sidebarCollapsed ? "›" : "‹"}
          </button>
        </div>
        <nav className="side-nav" aria-label="Main navigation">
          {session?.role === "student" ? (
            <>
              <button
                className={studentView === "adventure" ? "nav-item active" : "nav-item"}
                onClick={() => { setStudentView("adventure"); setSkill(undefined); }}
                title="My Learning Adventure"
              >
                <span>◇</span> My Learning Adventure
              </button>
              <div className="nav-group">
                <button
                  className={`nav-item nav-parent ${studentView === "charts" ? "active" : ""}`}
                  onClick={() => {
                    if (studentView !== "charts") {
                      setStudentView("charts");
                      setSkill(undefined);
                      setChartsNavOpen(true);
                    } else {
                      setChartsNavOpen((prev) => !prev);
                    }
                  }}
                  title="Learning Charts"
                >
                  <div className="nav-parent-title">
                    <span>📊</span> Learning Charts
                  </div>
                  <span
                    className={`nav-chevron ${chartsNavOpen ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChartsNavOpen((prev) => !prev);
                    }}
                    title={chartsNavOpen ? "Collapse submenus" : "Expand submenus"}
                  >
                    ▶
                  </span>
                </button>
                {chartsNavOpen && (
                  <div className="nav-submenu" role="menu" aria-label="Learning charts submenus">
                    {availableChartSubmenus.map((chartItem) => {
                      const isSubActive = studentView === "charts" && activeChartSlug === chartItem.slug;
                      return (
                        <button
                          key={chartItem.slug}
                          className={`nav-sub-item ${isSubActive ? "active" : ""}`}
                          onClick={() => {
                            setStudentView("charts");
                            setSkill(undefined);
                            setActiveChartSlug(chartItem.slug);
                          }}
                          title={chartItem.label}
                        >
                          <span className="sub-icon">{chartItem.icon}</span>
                          <span className="sub-label">{chartItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              {session?.role === "teacher" && (
                <button
                  className={parentView === "assign_courses" && !teacherPreview ? "nav-item active" : "nav-item"}
                  onClick={() => { setTeacherPreview(false); setParent(true); setParentView("assign_courses"); }}
                  title="Assign Courses (Class & Board)"
                >
                  <span>📋</span> Assign Courses
                </button>
              )}
              <button
                className={parentView === "skills" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("skills"); }}
                title="Skills & Curriculum"
              >
                <span>📚</span> Skills &amp; Curriculum
              </button>
              <button
                className={parentView === "children" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("children"); }}
                title={session?.role === "parent" ? "My Kids Profiles" : "Students & Roster"}
              >
                <span>{session?.role === "parent" ? "👨‍👩‍👧" : "👥"}</span> {session?.role === "parent" ? "My Kids Profiles" : "Students & Roster"}
              </button>
              <div className="nav-group">
                <button
                  className={`nav-item nav-parent ${parentView === "charts" && !teacherPreview ? "active" : ""}`}
                  onClick={() => {
                    if (parentView !== "charts" || teacherPreview) {
                      setTeacherPreview(false);
                      setParent(true);
                      setParentView("charts");
                      setChartsNavOpen(true);
                    } else {
                      setChartsNavOpen((prev) => !prev);
                    }
                  }}
                  title="Charts & Records"
                >
                  <div className="nav-parent-title">
                    <span>📊</span> Charts &amp; Records
                  </div>
                  <span
                    className={`nav-chevron ${chartsNavOpen ? "open" : ""}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setChartsNavOpen((prev) => !prev);
                    }}
                    title={chartsNavOpen ? "Collapse submenus" : "Expand submenus"}
                  >
                    ▶
                  </span>
                </button>
                {chartsNavOpen && (
                  <div className="nav-submenu" role="menu" aria-label="Charts & records submenus">
                    {availableChartSubmenus.map((chartItem) => {
                      const isSubActive = parentView === "charts" && !teacherPreview && activeChartSlug === chartItem.slug;
                      return (
                        <button
                          key={chartItem.slug}
                          className={`nav-sub-item ${isSubActive ? "active" : ""}`}
                          onClick={() => {
                            setTeacherPreview(false);
                            setParent(true);
                            setParentView("charts");
                            setActiveChartSlug(chartItem.slug);
                          }}
                          title={chartItem.label}
                        >
                          <span className="sub-icon">{chartItem.icon}</span>
                          <span className="sub-label">{chartItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
              <button
                className={parentView === "worksheets" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("worksheets"); }}
                title="School Worksheets"
              >
                <span>📝</span> School Worksheets
              </button>
              <button
                className={parentView === "misconceptions" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("misconceptions"); }}
                title="Misconceptions"
              >
                <span>🔍</span> Misconceptions
              </button>
              <button
                className={parentView === "templates" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("templates"); }}
                title="Screen Templates"
              >
                <span>📐</span> Screen Templates
              </button>
              <button
                className={teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => {
                  setTeacherPreview(true);
                  setStudentView("adventure");
                  setSkill(undefined);
                  setSubject("All");
                }}
                title="Preview Practice"
              >
                <span>✨</span> Preview Practice
              </button>
            </>
          )}
        </nav>
        <div className="sidebar-footer">
          <span className="status-dot" /> Learning space ready
        </div>
      </aside>
      <main className="workspace">
        <header>
          <div>
            <h1>SmartStudy</h1>
            <p>
              {session?.role === "student"
                ? `${child?.name || "Learner"} · Class ${child?.grade || "1"} · ${child?.board || "CBSE"}`
                : session?.role === "parent"
                ? `Parent & Family Workspace · Active: ${child?.name || "Learner"}`
                : "Teacher & Educator Workspace · Class 1"}
            </p>
          </div>
          <div className="session-controls">
            {session?.role === "student" ? (
              <>
                <span className="role-badge student">🎒 Student</span>
                <div className="session-profile">
                  <span className="avatar">{child?.avatar || child?.name?.charAt(0) || "S"}</span>
                  <span><b>{child?.name || "Learner"}</b><small>@{child?.username || "learner"}</small></span>
                </div>
              </>
            ) : (
              <>
                <span className={`role-badge ${session?.role === "parent" ? "parent" : "teacher"}`}>
                  {session?.role === "parent" ? "👨‍👩‍👧 Parent" : "👩‍🏫 Teacher"}
                </span>
                <div className="teacher-student-selector">
                  <small className="muted">{session?.role === "parent" ? "Child:" : "Student:"}</small>
                  <select
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                    aria-label="Active student"
                  >
                    {children.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.avatar ? `${c.avatar} ` : ""}{c.name} (@{c.username})
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="add-student-header-btn"
                    onClick={() => setShowAddStudentModal(true)}
                    title="Add a new student profile"
                  >
                    ➕ Add Student
                  </button>
                </div>
                <div className="session-profile">
                  <span className="avatar" style={{ background: session?.role === "parent" ? "#4f46e5" : "#147d78", color: "#fff" }}>
                    {session?.user?.name?.charAt(0) || (session?.role === "parent" ? "P" : "T")}
                  </span>
                  <span><b>{session?.user?.name || (session?.role === "parent" ? "Parent" : "Teacher")}</b><small>{session?.user?.email}</small></span>
                </div>
              </>
            )}
            <VoiceSettingsButton />
            <button className="session-exit" onClick={() => setShowSignOutConfirm(true)}>
              Sign out
            </button>
          </div>
        </header>
        {(session?.role === "student" || teacherPreview) ? (
          <>
            {teacherPreview && (
              <div className="preview-banner">
                <span>👁️ <b>Teacher Preview Mode:</b> Experiencing student practice screen for <b>{child?.name || "Learner"}</b></span>
                <button className="preview-exit-btn" onClick={() => { setTeacherPreview(false); setSkill(undefined); }}>
                  Exit Preview
                </button>
              </div>
            )}
            {studentView === "charts" ? (
              <LearningChartsView
                charts={charts}
                activeChartSlug={activeChartSlug}
                setActiveChartSlug={setActiveChartSlug}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                alphabetFilter={alphabetFilter}
                setAlphabetFilter={setAlphabetFilter}
                recitingTable={recitingTable}
                setRecitingTable={setRecitingTable}
                chartProgress={chartProgress}
                onRecordPractice={recordChartPractice}
                savingChartItem={savingChartItem}
                childName={child?.name || "Learner"}
                isTeacher={false}
                apiUrl={API}
              />
            ) : !skill ? (
              <section className="panel">
                <h2>Hi {child?.name}!</h2>
                <p>Choose today's learning adventure.</p>
                <div className="subjects" role="tablist" aria-label="Subjects">
                  {subjects.map((item) => (
                    <button
                      className={
                        subject === item ? "subject active" : "subject"
                      }
                      onClick={() => setSubject(item)}
                      key={item}
                      role="tab"
                      aria-selected={subject === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="grid">
                  {visibleSkills.length === 0 ? (
                    <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px 20px", color: "var(--muted, #64748b)" }}>
                      <p style={{ fontSize: "1.1rem", marginBottom: 8 }}>No skills available for <b>{subject}</b>.</p>
                      {subject !== "All" && (
                        <button className="primary-btn" onClick={() => setSubject("All")} style={{ marginTop: 8 }}>
                          View All Skills
                        </button>
                      )}
                    </div>
                  ) : (
                    visibleSkills.map((item) => (
                      <button
                        className="skill"
                        onClick={() => start(item)}
                        key={item.id}
                      >
                        <div className="skill-badge-row">
                          <b>{item.name}</b>
                          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                            {item.table_range && /multiplication|tables/i.test(item.name) && (
                              <span className="range-badge">Tables {item.table_range}</span>
                            )}
                            {item.table_range && /(before|after|missing)\s*numbers/i.test(item.name) && (
                              <span className="range-badge">Range {item.table_range}</span>
                            )}
                            {/missing\s*letters/i.test(item.name) && (
                              <span className="range-badge">500 Illustrated Words</span>
                            )}
                            <span className="template-badge">{templateLabel(item.template)}</span>
                          </div>
                        </div>
                        <small>
                          {item.topic} - {Math.round(item.mastery_score)}%
                          mastered
                        </small>
                      </button>
                    ))
                  )}
                </div>
              </section>
            ) : (
                <section className={`panel question template-${currentSkillTemplate}`}>
                <div className="question-header-bar">
                  <button className="question-back-btn" onClick={() => { setSkill(undefined); setExercises([]); }} title="Back to skills">
                    ← Back to skills
                  </button>
                  <div className="question-tags">
                    <span className="pill">{skill.name}</span>
                    {skill.table_range && /multiplication|tables/i.test(skill.name) && (
                      <span className="range-badge">
                        🎯 Tables {skill.table_range} Active
                      </span>
                    )}
                    {skill.table_range && /(before|after|missing)\s*numbers/i.test(skill.name) && (
                      <span className="range-badge">
                        🎯 Numbers {skill.table_range} Active
                      </span>
                    )}
                    {/missing\s*letters/i.test(skill.name) && (
                      <span className="range-badge">
                        📚 500 Illustrated Words Active
                      </span>
                    )}
                    <span className="template-badge practice-template-badge">
                      🎨 {templateLabel(currentSkillTemplate)} Layout
                    </span>
                    <span className="keyboard-nav-hint" title="Use Arrow keys on keyboard (← → ↑ ↓) to navigate between questions">
                      <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> Navigate
                    </span>
                  </div>
                </div>
                {/multiplication|tables/i.test(skill.name) && (
                  <div className="range-filter-bar">
                    <span className="range-filter-label">🎯 Table Range:</span>
                    {[
                      ...(skill.table_range && !["2-10", "2-20", "2-30"].includes(skill.table_range) ? [{ id: skill.table_range, label: `Custom (Tables ${skill.table_range})` }] : []),
                      { id: "2-10", label: "Tables 2–10" },
                      { id: "2-20", label: "Tables 2–20" },
                      { id: "2-30", label: "Tables 2–30" },
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        type="button"
                        className={`range-filter-pill ${(skill.table_range || "2-10") === tab.id ? "active" : ""}`}
                        onClick={() => switchTableRange(tab.id)}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
                {/(before|after|missing)\s*numbers/i.test(skill.name) && (
                  <>
                    <div className="range-filter-bar">
                      <span className="range-filter-label">🔢 Number Range:</span>
                      {[
                        { id: "100-500", label: "100–500 (All)" },
                        { id: "100-200", label: "100–200" },
                        { id: "200-300", label: "200–300" },
                        { id: "300-400", label: "300–400" },
                        { id: "400-500", label: "400–500" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`range-filter-pill ${(skill.table_range || "100-500") === tab.id ? "active" : ""}`}
                          onClick={() => switchTableRange(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="range-filter-bar" style={{ marginTop: 6 }}>
                      <span className="range-filter-label">🎲 Session:</span>
                      {[
                        { id: 10, label: "10 Random" },
                        { id: 20, label: "20 Random" },
                        { id: "all", label: "All in Range" },
                      ].map((tab) => (
                        <button
                          key={String(tab.id)}
                          type="button"
                          className={`range-filter-pill ${practiceCount === tab.id ? "active" : ""}`}
                          onClick={() => {
                            setPracticeCount(tab.id as any);
                            start(skill, skill.table_range, tab.id as any);
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                {/missing\s*letters/i.test(skill.name) && (
                  <div className="range-filter-bar">
                    <span className="range-filter-label">🎲 Session:</span>
                    {[
                      { id: 10, label: "10 Random Words" },
                      { id: 25, label: "25 Random Words" },
                      { id: 50, label: "50 Random Words" },
                      { id: "all", label: "All 500 Words" },
                    ].map((tab) => (
                      <button
                        key={String(tab.id)}
                        type="button"
                        className={`range-filter-pill ${practiceCount === tab.id ? "active" : ""}`}
                        onClick={() => {
                          setPracticeCount(tab.id as any);
                          start(skill, skill.table_range, tab.id as any);
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                )}
                {/rhyme|rhyming/i.test(skill.name) && (
                  <>
                    <div className="range-filter-bar">
                      <span className="range-filter-label">🎵 Sound Family:</span>
                      {[
                        { id: "all", label: "All Families (320+)" },
                        { id: "short-a", label: "Short A (-at, -an...)" },
                        { id: "short-e", label: "Short E (-ed, -en...)" },
                        { id: "short-i", label: "Short I (-ig, -in...)" },
                        { id: "short-o-u", label: "Short O & U (-og, -un...)" },
                        { id: "long-vowels", label: "Long Vowels (-ake, -ight...)" },
                      ].map((tab) => (
                        <button
                          key={tab.id}
                          type="button"
                          className={`range-filter-pill ${(skill.table_range || "all") === tab.id ? "active" : ""}`}
                          onClick={() => switchTableRange(tab.id)}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                    <div className="range-filter-bar" style={{ marginTop: 6 }}>
                      <span className="range-filter-label">🎲 Session:</span>
                      {[
                        { id: 10, label: "10 Random" },
                        { id: 25, label: "25 Random" },
                        { id: 50, label: "50 Random" },
                        { id: "all", label: "All in Family" },
                      ].map((tab) => (
                        <button
                          key={String(tab.id)}
                          type="button"
                          className={`range-filter-pill ${practiceCount === tab.id ? "active" : ""}`}
                          onClick={() => {
                            setPracticeCount(tab.id as any);
                            start(skill, skill.table_range, tab.id as any);
                          }}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </>
                )}
                <button
                  className="exercise-fullscreen-toggle"
                  onClick={() => {
                    const next = !exerciseFullscreen;
                    setExerciseFullscreen(next);
                    if (next) {
                      if (document.documentElement.requestFullscreen) {
                        document.documentElement.requestFullscreen().catch(() => {});
                      }
                    } else {
                      if (document.fullscreenElement) {
                        document.exitFullscreen().catch(() => {});
                      }
                    }
                  }}
                  aria-label={exerciseFullscreen ? "Exit full screen (Esc)" : "View exercise full screen"}
                  title={exerciseFullscreen ? "Exit full screen (Esc)" : "View exercise full screen"}
                >
                  {exerciseFullscreen ? "×" : "⛶"}
                </button>
                <button className="question-nav question-nav-left" disabled={index === 0} onClick={goToPrevQuestion} aria-label="Previous question" title="Previous question (← or ↑ Arrow Key)">‹</button>
                <button className="question-nav question-nav-right" disabled={index >= exercises.length - 1} onClick={goToNextQuestion} aria-label="Next question" title="Next question (→ or ↓ Arrow Key)">›</button>
                {renderFormattedQuestion()}
                {!result && exercises.length > 1 && (
                  <div className="question-bottom-nav-bar">
                    <button
                      type="button"
                      className="question-bar-nav-btn prev"
                      disabled={index === 0}
                      onClick={goToPrevQuestion}
                      title="Previous question (← or ↑ Arrow Key)"
                    >
                      <span className="nav-btn-icon">←</span> Previous
                    </button>
                    <div className="question-bar-progress-pill">
                      <span className="nav-progress-text">Question {index + 1} of {exercises.length}</span>
                      <span className="nav-keys-subtext">Use <kbd>←</kbd> <kbd>→</kbd> <kbd>↑</kbd> <kbd>↓</kbd> keys</span>
                    </div>
                    <button
                      type="button"
                      className="question-bar-nav-btn next"
                      disabled={index >= exercises.length - 1}
                      onClick={goToNextQuestion}
                      title="Next question (→ or ↓ Arrow Key)"
                    >
                      Next <span className="nav-btn-icon">→</span>
                    </button>
                  </div>
                )}
                {result && (
                  <div
                    className={result.correct ? "feedback goodbox" : "feedback"}
                  >
                    <h3>
                      {result.correct ? "Fantastic!" : "Let us understand it."}
                    </h3>
                    {result.correct ? (
                      <p>
                        Great work! Mastery is now {result.mastery.masteryScore}
                        %.
                      </p>
                    ) : (
                      <>
                        <p>
                          <b>What we noticed:</b>{" "}
                          {result.analysis?.misconception}
                        </p>
                        <p>
                          <b>Try this:</b> {result.intervention?.title}
                        </p>
                        <ol>
                          {result.intervention?.steps?.map((step: string) => (
                            <li key={step}>{step}</li>
                          ))}
                        </ol>
                      </>
                    )}
                    <button className="audio" onClick={() => speak(feedback)}>
                      Hear feedback
                    </button>
                    <button className="next" onClick={next}>
                      {index < exercises.length - 1
                        ? "Next challenge"
                        : "Finish"}
                    </button>
                  </div>
                )}
              </section>
            )}
          </>
        ) : (
          <section className="panel parent-content" key={parentView}>
            <h2>Teacher &amp; Parent Dashboard</h2>
            {parentView === "skills" && (
              <>
                <div className="cards">
                  <div>
                    <small>Skills tracked</small>
                    <strong>{dash.skills.length}</strong>
                  </div>
                  <div>
                    <small>Needs attention</small>
                    <strong>
                      {
                        dash.skills.filter(
                          (item: any) => item.mastery_score < 60,
                        ).length
                      }
                    </strong>
                  </div>
                  <div>
                    <small>Strong</small>
                    <strong>
                      {
                        dash.skills.filter(
                          (item: any) => item.mastery_score >= 80,
                        ).length
                      }
                    </strong>
                  </div>
                </div>
                <div className="section-toolbar">
                  <div>
                    <h3>Manage skills</h3>
                    <p>All skills currently available in the database.</p>
                  </div>
                  <button
                    className="next"
                    onClick={() => {
                      if (!showAddSkill) resetSkillForm();
                      setShowAddSkill(!showAddSkill);
                    }}
                  >
                    {showAddSkill ? "Close" : "Add skill"}
                  </button>
                </div>
                <div className="subjects management-subjects" role="tablist" aria-label="Filter skills by subject">
                  {["All", ...Array.from(new Set(dash.skills.map((item: any) => item.subject)))].map((item) => (
                    <button
                      className={skillManagementSubject === item ? "subject active" : "subject"}
                      onClick={() => setSkillManagementSubject(item)}
                      key={item}
                      role="tab"
                      aria-selected={skillManagementSubject === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                <div className="skills-table-wrap">
                  <table className="skills-table">
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Subject</th>
                        <th>Topic</th>
                        <th>Template</th>
                        <th>Difficulty</th>
                        <th>Mastery</th>
                        <th>Attempts</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dash.skills.filter((item: any) => skillManagementSubject === "All" || item.subject === skillManagementSubject).map((item: any) => (
                        <tr key={item.id}>
                          <td>
                            <b>{item.name}</b>
                          </td>
                          <td>{item.subject}</td>
                          <td>{item.topic}</td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                              <span className="template-badge">{templateLabel(item.template)}</span>
                              {item.table_range && /multiplication|tables/i.test(item.name) && (
                                <span className="range-badge">Tables {item.table_range}</span>
                              )}
                            </div>
                          </td>
                          <td>{item.difficulty || "-"}</td>
                          <td>
                            <strong>{Math.round(item.mastery_score)}%</strong>
                            <div className="table-bar">
                              <i
                                style={{
                                  width: `${Math.min(100, item.mastery_score)}%`,
                                }}
                              />
                            </div>
                          </td>
                          <td>{item.attempts}</td>
                          <td>
                            <button
                              className="table-action"
                              onClick={() => beginEditSkill(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="table-action danger"
                              onClick={() =>
                                setPendingDeletion({ type: "skill", item })
                              }
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!dash.skills.some((item: any) => skillManagementSubject === "All" || item.subject === skillManagementSubject) && (
                        <tr><td colSpan={8} className="muted">No skills found for this subject.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {parentView === "assign_courses" && (
              <div className="assign-container">
                <div className="assign-header-bar">
                  <div>
                    <span className="eyebrow">TEACHER PORTAL · CURRICULUM MANAGEMENT</span>
                    <h3 style={{ margin: "4px 0 0", fontSize: "20px", color: "var(--ink)" }}>
                      📋 Assign Courses by Class &amp; School Board
                    </h3>
                    <p style={{ margin: "4px 0 0", fontSize: "13px", color: "var(--muted)" }}>
                      Configure curriculum courses, assign learning modules, and align skill tracks based on learner grade and education board standards.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      type="button"
                      className="assign-pill active"
                      style={{ background: "var(--teal)", color: "#fff", display: "flex", alignItems: "center", gap: "6px" }}
                      onClick={assignAllCoreCourses}
                    >
                      <span>✨</span> Assign All Courses
                    </button>
                    <button
                      type="button"
                      className="assign-pill"
                      style={{ color: "var(--danger, #e11d48)", borderColor: "#fecdd3" }}
                      onClick={clearCourseAssignments}
                    >
                      <span>⭕</span> Clear All
                    </button>
                  </div>
                </div>

                {/* Filter / Selector Card */}
                <div className="assign-filters-card">
                  <div className="assign-filter-row">
                    <span className="assign-filter-label">Target Class:</span>
                    <div className="assign-pills-group" role="radiogroup" aria-label="Select Target Class">
                      {["Nursery", "LKG", "UKG", "1", "2", "3", "4", "5"].map((grade) => (
                        <button
                          key={grade}
                          type="button"
                          className={`assign-pill ${assignTargetGrade === grade ? "active" : ""}`}
                          onClick={() => setAssignTargetGrade(grade)}
                        >
                          {grade.startsWith("Class") || grade === "Nursery" || grade === "LKG" || grade === "UKG" ? grade : `Class ${grade}`}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="assign-filter-row">
                    <span className="assign-filter-label">School Board:</span>
                    <div className="assign-pills-group" role="radiogroup" aria-label="Select School Board">
                      {["CBSE", "ICSE", "State Board", "IB", "Cambridge"].map((board) => (
                        <button
                          key={board}
                          type="button"
                          className={`assign-pill ${assignTargetBoard === board ? "active" : ""}`}
                          onClick={() => setAssignTargetBoard(board)}
                        >
                          {board}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="assign-filter-row">
                    <span className="assign-filter-label">Medium:</span>
                    <div className="assign-pills-group" role="radiogroup" aria-label="Select Learning Medium">
                      {["English", "Marathi", "Hindi"].map((med) => (
                        <button
                          key={med}
                          type="button"
                          className={`assign-pill ${assignMedium === med ? "active" : ""}`}
                          onClick={() => setAssignMedium(med)}
                        >
                          {med} Medium
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Enrolled Students Card */}
                <div className="enrolled-students-card">
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "24px" }}>🎒</span>
                    <div>
                      <strong style={{ fontSize: "13px", color: "var(--teal-dark)" }}>
                        Enrolled Students in {assignTargetGrade.length > 2 ? assignTargetGrade : `Class ${assignTargetGrade}`} ({assignTargetBoard}):
                      </strong>
                      <span style={{ marginLeft: "8px", fontSize: "12px", color: "var(--ink)", fontWeight: 600 }}>
                        {enrolledStudents.length} {enrolledStudents.length === 1 ? "student" : "students"}
                      </span>
                    </div>
                  </div>
                  <div className="enrolled-badges">
                    {enrolledStudents.length > 0 ? (
                      enrolledStudents.map((st) => (
                        <span key={st.id} className="enrolled-student-chip">
                          <span>{st.avatar || "👦"}</span>
                          <b>{st.name}</b>
                          <small style={{ color: "var(--muted)", fontSize: "11px" }}>@{st.username}</small>
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: "12px", color: "var(--muted)", fontStyle: "italic" }}>
                        No students enrolled in this grade & board yet. Newly registered kids will receive assigned courses automatically!
                      </span>
                    )}
                  </div>
                </div>

                {/* Grid of Courses */}
                <div className="courses-grid-view">
                  {DEFAULT_COURSES.map((course) => {
                    const assigned = isCourseAssigned(course.id, assignTargetGrade, assignTargetBoard);
                    return (
                      <div key={course.id} className={`course-card ${assigned ? "assigned" : ""}`}>
                        <div className="course-card-top">
                          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <span className="course-icon-badge">{course.icon}</span>
                            <div>
                              <span className="course-code-pill">{course.code}</span>
                              <h4 style={{ margin: "4px 0 0", fontSize: "14px", color: "var(--ink)" }}>{course.name}</h4>
                            </div>
                          </div>
                          <span className={`course-status-badge ${assigned ? "assigned" : "unassigned"}`}>
                            {assigned ? "✅ Assigned" : "⭕ Available"}
                          </span>
                        </div>

                        <div className="course-card-body" style={{ margin: "8px 0" }}>
                          <p style={{ fontSize: "12px", color: "var(--ink-secondary, #4b5563)", margin: "0 0 8px", lineHeight: "1.4" }}>
                            {course.description}
                          </p>
                          <div style={{ fontSize: "11px", fontWeight: 700, color: "var(--muted)", marginBottom: "4px" }}>
                            TOPICS COVERED:
                          </div>
                          <div className="course-topics-tags">
                            {course.topics.map((t) => (
                              <span key={t} className="course-topic-tag" style={{ background: "#f1f5f9", padding: "2px 7px", borderRadius: "10px", fontSize: "11px", color: "#334155" }}>
                                {t}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="course-card-footer" style={{ borderTop: "1px solid var(--line)", paddingTop: "10px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <span style={{ fontSize: "11px", color: "var(--muted)" }}>
                            Subject: <b>{course.subject}</b>
                          </span>
                          <button
                            type="button"
                            className="course-action-btn"
                            style={{
                              padding: "6px 14px",
                              borderRadius: "6px",
                              fontSize: "12px",
                              fontWeight: 700,
                              cursor: "pointer",
                              border: assigned ? "1px solid #fca5a5" : "1px solid var(--teal)",
                              background: assigned ? "#fff1f2" : "var(--teal)",
                              color: assigned ? "#e11d48" : "#fff",
                              transition: "all 0.15s ease",
                            }}
                            onClick={() => toggleCourseAssignment(course.id)}
                          >
                            {assigned ? "Remove Course" : "Assign to Class +"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {parentView === "children" && (
              <>
                <div className="section-toolbar">
                  <div>
                    <h3>{session?.role === "parent" ? "My Kids Profiles" : "Manage Students"}</h3>
                    <p>Learning profiles, grade levels, and personalized study records.</p>
                  </div>
                  <button
                    className="next"
                    onClick={() => setShowAddStudentModal(true)}
                  >
                    ➕ Add Student Profile
                  </button>
                </div>
                <div className="skills-table-wrap">
                  <table className="skills-table children-table">
                    <thead>
                      <tr>
                        <th>Child</th>
                        <th>Username</th>
                        <th>Class</th>
                        <th>Board</th>
                        <th>Medium</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {children.map((item) => (
                        <tr key={item.id} style={childId === item.id ? { background: "#f0fdf4" } : undefined}>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              <span style={{ fontSize: "20px" }}>{item.avatar || "👦"}</span>
                              <div>
                                <b>{item.name}</b>
                                {childId === item.id && (
                                  <span style={{ marginLeft: "6px", fontSize: "10px", background: "#10b981", color: "#fff", padding: "2px 6px", borderRadius: "10px", fontWeight: 700 }}>
                                    ACTIVE
                                  </span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td>@{item.username}</td>
                          <td>Class {item.grade}</td>
                          <td>{item.board || "CBSE"}</td>
                          <td>{item.medium || "English"}</td>
                          <td>
                            <div style={{ display: "flex", gap: "6px" }}>
                              {childId !== item.id && (
                                <button
                                  className="table-action"
                                  style={{ background: "var(--mint)", color: "var(--teal-dark)", borderColor: "var(--teal)" }}
                                  onClick={() => {
                                    setChildId(item.id);
                                    setChild(item);
                                    showToast(`Switched active profile to ${item.name}`);
                                  }}
                                >
                                  Select Active
                                </button>
                              )}
                              <button
                                className="table-action"
                                onClick={() => {
                                  setChildId(item.id);
                                  setChild(item);
                                  setTeacherPreview(true);
                                }}
                              >
                                Practice Preview
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {!children.length && <tr><td colSpan={6} className="muted">No child profiles yet. Click 'Add Student Profile' above to create one!</td></tr>}
                    </tbody>
                  </table>
                </div>
                {showAddChild && <div className="child-create-panel">
                  <div className="composer-heading">
                    <div><span className="eyebrow">NEW LEARNER</span><h4>Create a child profile</h4></div>
                    <span className="composer-hint">Username generated automatically</span>
                  </div>
                  <div className="skill-form">
                  <input
                    value={newChild.name}
                    onChange={(event) =>
                      setNewChild({ ...newChild, name: event.target.value })
                    }
                    placeholder="Child name"
                  />
                  <select
                    value={newChild.grade}
                    onChange={(event) =>
                      setNewChild({ ...newChild, grade: event.target.value })
                    }
                  >
                    <option>1</option>
                    <option>2</option>
                    <option>3</option>
                    <option>4</option>
                    <option>5</option>
                  </select>
                  <input
                    value={newChild.board}
                    onChange={(event) =>
                      setNewChild({ ...newChild, board: event.target.value })
                    }
                    placeholder="School board"
                  />
                  <select
                    value={newChild.medium}
                    onChange={(event) =>
                      setNewChild({ ...newChild, medium: event.target.value })
                    }
                  >
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Marathi</option>
                  </select>
                  <button
                    className="next"
                    onClick={addChild}
                    disabled={!newChild.name.trim()}
                  >
                    Add child
                  </button>
                  </div>
                  {childMessage && <p className="muted">{childMessage}</p>}
                </div>}
              </>
            )}
            {parentView === "worksheets" && (
              <>
                <h3>Worksheets</h3>
                <p>Worksheets analyzed for {child?.name}.</p>
                <div className="entity-list">
                  {worksheets.length ? (
                    worksheets.map((item) => (
                      <div className="entity-row worksheet-row" key={item.id}>
                        <span className="entity-icon">W</span>
                        <span>
                          <b>{item.title}</b>
                          <small>
                            {item.type} -{" "}
                            {new Date(item.created_at).toLocaleDateString()}
                          </small>
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="muted">No worksheets analyzed yet.</p>
                  )}
                </div>
                <h3>Analyse a worksheet</h3>
              </>
            )}
            {parentView === "templates" && (
              <>
                <div className="section-toolbar">
                  <div>
                    <h3>Manage templates</h3>
                    <p>Choose how questions are presented for each skill.</p>
                  </div>
                </div>
                <div className="template-catalog">
                  {TEMPLATE_OPTIONS.map((template) => {
                    const skillCount = skills.filter((s) => (s.template || "standard") === template.id).length;
                    return (
                      <div className={`template-card ${template.id === "standard" ? "active" : ""}`} key={template.id}>
                        <div className={`template-preview ${template.previewClass}`}><span>{template.preview}</span></div>
                        <div className="template-live-preview">{placeholderNames.slice().filter((placeholder) => (templateLayouts[template.id]?.[placeholder] || placeholderDefault[placeholder]) !== "hidden").sort((a, b) => (["top", "middle", "bottom"].indexOf(templateLayouts[template.id]?.[a] || placeholderDefault[a]) - ["top", "middle", "bottom"].indexOf(templateLayouts[template.id]?.[b] || placeholderDefault[b]))).map((placeholder) => <span key={placeholder}>{placeholder}</span>)}</div>
                        <div className="template-header-badges">
                          <span className="template-badge">{template.name}</span>
                          <span className="template-count-badge">{skillCount} {skillCount === 1 ? "skill" : "skills"}</span>
                        </div>
                        <h4>{template.title}</h4><p>{template.description}</p>
                        <div className="template-placeholders"><b>Placeholders &amp; preview order</b>{placeholderNames.map((placeholder) => <label key={placeholder}>{placeholder}<select value={templateLayouts[template.id]?.[placeholder] || placeholderDefault[placeholder]} onChange={(event) => updateTemplateLayout(template.id, placeholder, event.target.value)}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option><option value="hidden">Empty</option></select></label>)}<label>Image size<select value={templateLayouts[template.id]?.imageSize || "medium"} onChange={(event) => updateTemplateLayout(template.id, "imageSize", event.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label><label>Image question text<select value={templateLayouts[template.id]?.imageQuestionSize || "medium"} onChange={(event) => updateTemplateLayout(template.id, "imageQuestionSize", event.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label></div>
                      </div>
                    );
                  })}
                </div>
                <p className="muted template-note">Templates are configured per skill. All practice questions in a skill automatically follow that skill's template.</p>
              </>
            )}
            {parentView === "skills" && showAddSkill && (
              <div
                className="modal-backdrop"
                style={{
                  position: "fixed",
                  inset: 0,
                  zIndex: 10,
                  display: "grid",
                  placeItems: "center",
                  padding: 24,
                  background: "#123b3ab8",
                  backdropFilter: "blur(3px)",
                }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget)
                    setShowAddSkill(false);
                }}
              >
                <div
                  className="skill-wizard"
                  style={{
                    width: "min(940px, 100%)",
                    maxHeight: "calc(100vh - 48px)",
                    overflow: "auto",
                    margin: 0,
                  }}
                  onScroll={(event) => setShowWizardScrollTop(event.currentTarget.scrollTop > 180)}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="skill-wizard-title"
                >
                  <div className="wizard-heading">
                    <div>
                      <span className="eyebrow">
                        {editingSkill ? "EDIT SKILL" : "NEW SKILL"}
                      </span>
                      <h3 id="skill-wizard-title">
                        {editingSkill ? "Edit skill" : "Add a skill"}
                      </h3>
                      {editingSkill && (
                        <p className="wizard-context">
                          Editing <strong>{newSkill.name}</strong> under {newSkill.subject} • <span className="template-badge">{templateLabel(newSkill.template)}</span>
                        </p>
                      )}
                    </div>
                    <div className="wizard-heading-actions">
                      <span className="wizard-count">
                        Step {wizardStep} of 2
                      </span>
                      <button
                        className="modal-close"
                        style={{
                          width: 30,
                          height: 30,
                          border: "1px solid #e5eaed",
                          borderRadius: 7,
                          background: "#fff",
                          color: "#71808b",
                          fontSize: 20,
                          lineHeight: 1,
                        }}
                        onClick={() => setShowAddSkill(false)}
                        aria-label="Close skill wizard"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <div className="wizard-steps">
                    <span
                      className={
                        wizardStep >= 1 ? "wizard-step active" : "wizard-step"
                      }
                    >
                      1 <b>Skill details</b>
                    </span>
                    <i />
                    <span
                      className={
                        wizardStep >= 2 ? "wizard-step active" : "wizard-step"
                      }
                    >
                      2 <b>Questions</b>
                    </span>
                  </div>
                  {editingSkill && wizardStep === 2 && (
                    <div className="wizard-question-actions">
                      <button
                        className="wizard-top-back"
                        onClick={() => {
                          setWizardStep(1);
                          document.querySelector(".skill-wizard")?.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                      >
                        <span aria-hidden="true">←</span> Back to details
                      </button>
                      <button
                        className="wizard-top-add"
                        onClick={() => document.querySelector(".new-question-form")?.scrollIntoView({ behavior: "smooth", block: "start" })}
                      >
                        <span aria-hidden="true">＋</span> Add new question
                      </button>
                    </div>
                  )}
                  {wizardStep === 1 && (
                    <>
                      <div className="skill-form">
                        <select
                          value={newSkill.subject}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              subject: event.target.value,
                            })
                          }
                        >
                          {subjects
                            .filter((item) => item !== "All")
                            .map((item) => (
                              <option key={item}>{item}</option>
                            ))}
                        </select>
                        <input
                          className="unicode-input"
                          value={newSkill.topic}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              topic: event.target.value,
                            })
                          }
                          placeholder="Topic / विषय / विषय"
                        />
                        <input
                          className="unicode-input"
                          value={newSkill.name}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              name: event.target.value,
                            })
                          }
                          placeholder="Skill name / कौशल का नाम"
                        />
                        <input
                          className="unicode-input"
                          value={newSkill.description}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              description: event.target.value,
                            })
                          }
                          placeholder="Description (optional)"
                        />
                        <select
                          value={newSkill.difficulty}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              difficulty: Number(event.target.value),
                            })
                          }
                        >
                          <option value={1}>Easy</option>
                          <option value={2}>Medium</option>
                          <option value={3}>Hard</option>
                        </select>
                        <select
                          value={newSkill.template}
                          onChange={(event) =>
                            setNewSkill({
                              ...newSkill,
                              template: event.target.value,
                            })
                          }
                          aria-label="Skill layout template"
                        >
                          <option value="standard">Template: Standard</option>
                          <option value="image_prompt">Template: Image prompt</option>
                          <option value="story_card">Template: Story card</option>
                          <option value="flashcard">Template: Flashcard</option>
                          <option value="fill_blank">Template: Fill in the blank</option>
                          <option value="true_false">Template: True or false</option>
                          <option value="rhyme_card">Template: Rhyme card (Collapsed answer)</option>
                          <option value="shape_card">Template: Shape card (Recognition & spelling)</option>
                          <option value="magic_words_card">Template: Magic words card (Manners & Scenarios)</option>
                        </select>
                        <div className="skill-template-callout" style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#e8f3f1", borderRadius: 8, fontSize: 11, color: "var(--teal)" }}>
                          <span className="template-badge">{templateLabel(newSkill.template)}</span>
                          <span>Layout applied to this skill: <strong>{TEMPLATE_OPTIONS.find(t => t.id === newSkill.template)?.description}</strong></span>
                        </div>
                        {/multiplication|tables/i.test(`${newSkill.name} ${newSkill.topic}`) && (() => {
                          const currentRangeMatch = (newSkill.table_range || "2-10").match(/^(\d+)\s*-\s*(\d+)$/);
                          const fromVal = currentRangeMatch ? parseInt(currentRangeMatch[1], 10) : 2;
                          const toVal = currentRangeMatch ? parseInt(currentRangeMatch[2], 10) : 10;
                          const minTable = Math.min(fromVal, toVal);
                          const maxTable = Math.max(fromVal, toVal);
                          const tableCount = maxTable - minTable + 1;
                          const questionCount = tableCount * 10;

                          const handleRangeChange = (newFrom: number, newTo: number) => {
                            const validFrom = Math.max(2, Math.min(30, newFrom));
                            const validTo = Math.max(2, Math.min(30, newTo));
                            setNewSkill({
                              ...newSkill,
                              table_range: `${validFrom}-${validTo}`,
                            });
                          };

                          return (
                            <div className="table-range-selector-row">
                              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
                                <label className="table-range-label">
                                  <span className="table-range-icon">🎯</span> Select Multiplication Tables (Between 2 and 30):
                                </label>
                                <div className="table-range-calc-summary">
                                  <span className="table-range-highlight-badge">
                                    {minTable === maxTable ? `Table ${minTable}` : `Tables ${minTable} to ${maxTable}`}
                                  </span>
                                  <span style={{ fontSize: "12px", color: "var(--teal)", fontWeight: 700 }}>
                                    ({tableCount} table{tableCount > 1 ? "s" : ""} · {questionCount} questions)
                                  </span>
                                </div>
                              </div>

                              {/* Manual From & To Number Pickers */}
                              <div className="table-range-manual-inputs-box">
                                <div className="range-picker-group">
                                  <label htmlFor="range-from-select" className="range-picker-label">From Table:</label>
                                  <div className="range-picker-control-wrap">
                                    <span className="range-picker-prefix">Table</span>
                                    <select
                                      id="range-from-select"
                                      className="range-number-select"
                                      value={fromVal}
                                      onChange={(e) => handleRangeChange(parseInt(e.target.value, 10), toVal)}
                                    >
                                      {Array.from({ length: 29 }, (_, i) => i + 2).map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="range-picker-arrow" aria-hidden="true">➔</div>

                                <div className="range-picker-group">
                                  <label htmlFor="range-to-select" className="range-picker-label">To Table:</label>
                                  <div className="range-picker-control-wrap">
                                    <span className="range-picker-prefix">Table</span>
                                    <select
                                      id="range-to-select"
                                      className="range-number-select"
                                      value={toVal}
                                      onChange={(e) => handleRangeChange(fromVal, parseInt(e.target.value, 10))}
                                    >
                                      {Array.from({ length: 29 }, (_, i) => i + 2).map((num) => (
                                        <option key={num} value={num}>{num}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div className="range-quick-presets">
                                  <span style={{ fontSize: "11px", fontWeight: 700, color: "#64748b" }}>Quick Presets:</span>
                                  {[
                                    { label: "2 to 10", from: 2, to: 10 },
                                    { label: "3 to 10", from: 3, to: 10 },
                                    { label: "2 to 20", from: 2, to: 20 },
                                    { label: "11 to 20", from: 11, to: 20 },
                                    { label: "20 to 30", from: 20, to: 30 },
                                    { label: "2 to 30", from: 2, to: 30 },
                                  ].map((preset) => {
                                    const isSelected = fromVal === preset.from && toVal === preset.to;
                                    return (
                                      <button
                                        key={preset.label}
                                        type="button"
                                        className={`range-preset-pill ${isSelected ? "active" : ""}`}
                                        onClick={() => handleRangeChange(preset.from, preset.to)}
                                      >
                                        {preset.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>

                              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>
                                💡 Child will only be tested on combinations between Table <strong>{minTable}</strong> and Table <strong>{maxTable}</strong> (e.g. {minTable}×1 to {maxTable}×10). Questions shuffle every session.
                              </p>
                            </div>
                          );
                        })()}
                        <button
                          className="next"
                          onClick={() =>
                            editingSkill
                              ? saveSkillDetails().then(() => setWizardStep(2))
                              : addSkill()
                          }
                          disabled={
                            !newSkill.topic.trim() || !newSkill.name.trim()
                          }
                        >
                          {editingSkill ? "Next: questions" : "Add skill"}
                        </button>
                      </div>
                      {skillMessage && <p className="muted">{skillMessage}</p>}
                    </>
                  )}
                  {editingSkill && wizardStep === 2 && (
                    <div className="question-editor">
                      <div className="question-list-heading">
                        <div className="question-list-title-wrap">
                          <h3>Questions for this skill</h3>
                          <span className="template-badge">{templateLabel(newSkill.template)} template</span>
                        </div>
                        {selectedExerciseIds.length > 0 && (
                          <button
                            className="table-action danger"
                            onClick={() => setPendingDeletion({ type: "questions", item: skillExercises.filter((item) => selectedExerciseIds.includes(item.id)) })}
                          >
                            Delete {selectedExerciseIds.length} selected
                          </button>
                        )}
                      </div>
                      {/multiplication|tables/i.test(`${newSkill.name} ${newSkill.topic}`) && (
                        <div className="wizard-range-filter-bar">
                          <span className="wizard-range-filter-label">Filter Questions:</span>
                          {[
                            { id: "all", label: "All Tables (290)" },
                            ...(newSkill.table_range && !["all", "2-30"].includes(newSkill.table_range) ? [{ id: newSkill.table_range, label: `Active (${newSkill.table_range})` }] : []),
                            { id: "2-10", label: "Tables 2–10 (90)" },
                            { id: "11-20", label: "Tables 11–20 (100)" },
                            { id: "20-30", label: "Tables 20–30 (110)" },
                            { id: "2-30", label: "Tables 2–30 (290)" },
                          ].map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              className={`range-filter-pill ${wizardExerciseRange === r.id ? "active" : ""}`}
                              onClick={() => filterWizardQuestions(r.id)}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {/rhyme|rhyming/i.test(`${newSkill.name} ${newSkill.topic}`) && (
                        <div className="wizard-range-filter-bar">
                          <span className="wizard-range-filter-label">Filter Families:</span>
                          {[
                            { id: "all", label: "All Families (320+)" },
                            { id: "short-a", label: "Short A (-at, -an...)" },
                            { id: "short-e", label: "Short E (-ed, -en...)" },
                            { id: "short-i", label: "Short I (-ig, -in...)" },
                            { id: "short-o-u", label: "Short O & U (-og, -un...)" },
                            { id: "long-vowels", label: "Long Vowels (-ake, -ight...)" },
                          ].map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              className={`range-filter-pill ${wizardExerciseRange === r.id ? "active" : ""}`}
                              onClick={() => filterWizardQuestions(r.id)}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      )}
                      {skillExercises.length ? (
                        <>
                        <div className="question-field-labels"><span>Question</span><span>Options</span><span>Correct answer</span><span>Explanation</span></div>
                        {skillExercises.map(
                          (exercise: any, exerciseIndex: number) => (
                            <div
                              className="question-edit-row"
                              key={exercise.id}
                            >
                              <div className="question-row-label">
                                <input
                                  type="checkbox"
                                  checked={selectedExerciseIds.includes(exercise.id)}
                                  onChange={() => setSelectedExerciseIds((ids) => ids.includes(exercise.id) ? ids.filter((id) => id !== exercise.id) : [...ids, exercise.id])}
                                  aria-label={`Select question ${exerciseIndex + 1}`}
                                />
                                <strong>Question {exerciseIndex + 1}</strong>
                              </div>
                              <fieldset className="edit-field"><legend>Question</legend><input
                                className="unicode-input"
                                value={exercise.question}
                                onChange={(event) =>
                                  setSkillExercises((items) =>
                                    items.map((item) =>
                                      item.id === exercise.id
                                        ? {
                                            ...item,
                                            question: event.target.value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Question"
                              /></fieldset>
                              <fieldset className="edit-field"><legend>Options</legend><input
                                className="unicode-input"
                                value={(exercise.options || []).join(", ")}
                                onChange={(event) =>
                                  setSkillExercises((items) =>
                                    items.map((item) =>
                                      item.id === exercise.id
                                        ? {
                                            ...item,
                                            options: event.target.value
                                              .split(",")
                                              .map((option: string) =>
                                                option.trim(),
                                              )
                                              .filter(Boolean),
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Options separated by commas"
                              /></fieldset>
                              <fieldset className="edit-field"><legend>Correct answer</legend><input
                                className="unicode-input"
                                value={exercise.correct_answer}
                                onChange={(event) =>
                                  setSkillExercises((items) =>
                                    items.map((item) =>
                                      item.id === exercise.id
                                        ? {
                                            ...item,
                                            correct_answer: event.target.value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Correct answer"
                              /></fieldset>
                              <fieldset className="edit-field"><legend>Explanation</legend><input
                                className="unicode-input"
                                value={exercise.explanation}
                                onChange={(event) =>
                                  setSkillExercises((items) =>
                                    items.map((item) =>
                                      item.id === exercise.id
                                        ? {
                                            ...item,
                                            explanation: event.target.value,
                                          }
                                        : item,
                                    ),
                                  )
                                }
                                placeholder="Explanation"
                              /></fieldset>
                              {(newSkill.template === "image_prompt" || exercise.image_url) && <><label className="question-image-editor">
                                <span>Image</span>
                                <input
                                  type="file"
                                  accept="image/png,image/jpeg,image/webp"
                                  onChange={(event) => {
                                    const file = event.target.files?.[0];
                                    if (!file || file.size > 3 * 1024 * 1024) return;
                                    const reader = new FileReader();
                                    reader.onload = () => setSkillExercises((items) => items.map((item) => item.id === exercise.id ? { ...item, image_url: String(reader.result) } : item));
                                    reader.readAsDataURL(file);
                                  }}
                                />
                                {exercise.image_url && <img src={exercise.image_url} alt="Question preview" />}
                              </label><input className="question-image-question-editor" value={exercise.image_question || ""} onChange={(event) => setSkillExercises((items) => items.map((item) => item.id === exercise.id ? { ...item, image_question: event.target.value } : item))} placeholder="Question on image (optional)" /></>}
                              <div className="question-actions">
                              <button
                                type="button"
                                className="table-action question-icon-action"
                                aria-label="Save question"
                                title="Save question"
                                onClick={() => updateExercise(exercise)}
                              >
                                ✓
                              </button>
                              <button
                                type="button"
                                className="table-action danger question-icon-action"
                                aria-label="Remove question"
                                title="Remove question"
                                onClick={() =>
                                  setPendingDeletion({
                                    type: "question",
                                    item: exercise,
                                  })
                                }
                              >
                                ×
                              </button>
                              </div>
                            </div>
                          ),
                        )}
                        </>
                      ) : (
                        <p className="muted">
                          No generated questions exist for this skill yet. Start
                          a practice session to create them.
                        </p>
                      )}
                      <div className="new-question-form">
                        <div className="composer-heading"><div><span className="eyebrow">QUESTION BUILDER</span><h4>Add a question</h4></div><span className="template-badge">{templateLabel(newSkill.template)} template</span></div>
                        <label>Question text<textarea
                          className="unicode-input"
                          value={newQuestion.question}
                          onChange={(event) =>
                            setNewQuestion({
                              ...newQuestion,
                              question: event.target.value,
                            })
                          }
                          placeholder="Type the question, including Hindi or Marathi text if needed"
                          rows={3}
                        /></label>
                        {newSkill.template === "image_prompt" && <><label>Question image <input
                          className="unicode-input"
                          type="file"
                          accept="image/png,image/jpeg,image/webp"
                          onChange={(event) => {
                            const file = event.target.files?.[0];
                            if (!file) return;
                            if (file.size > 3 * 1024 * 1024) { setSkillMessage("Please choose an image smaller than 3 MB."); return; }
                            const reader = new FileReader();
                            reader.onload = () => setNewQuestion((current) => ({ ...current, imageUrl: String(reader.result) }));
                            reader.readAsDataURL(file);
                          }}
                        /></label>
                        {newQuestion.imageUrl && <img className="question-image builder-image" src={newQuestion.imageUrl} alt="Question preview" />}
                        <label>Question on image <input className="unicode-input" value={newQuestion.imageQuestion} onChange={(event) => setNewQuestion({ ...newQuestion, imageQuestion: event.target.value })} placeholder="e.g. What do you see in the gate picture?" /></label></>}
                        <label>Answer options <input
                          className="unicode-input"
                          value={newQuestion.options}
                          onChange={(event) =>
                            setNewQuestion({
                              ...newQuestion,
                              options: event.target.value,
                            })
                          }
                          placeholder="Options separated by commas"
                        /></label>
                        <div className="composer-grid"><label>Correct answer <input
                          className="unicode-input"
                          value={newQuestion.correctAnswer}
                          onChange={(event) =>
                            setNewQuestion({
                              ...newQuestion,
                              correctAnswer: event.target.value,
                            })
                          }
                          placeholder="Correct answer"
                        /></label><label>Difficulty <select value={newQuestion.difficulty} onChange={(event) => setNewQuestion({ ...newQuestion, difficulty: Number(event.target.value) })}><option value={1}>Easy</option><option value={2}>Medium</option><option value={3}>Hard</option></select></label></div>
                        <label>Explanation <input
                          className="unicode-input"
                          value={newQuestion.explanation}
                          onChange={(event) =>
                            setNewQuestion({
                              ...newQuestion,
                              explanation: event.target.value,
                            })
                          }
                          placeholder="Explanation"
                        /></label>
                        <button
                          className="next"
                          onClick={addExercise}
                          disabled={
                            !newQuestion.question.trim() ||
                            !newQuestion.options.trim() ||
                            !newQuestion.correctAnswer.trim() ||
                            !newQuestion.explanation.trim()
                          }
                        >
                          Add question
                        </button>
                      </div>
                    </div>
                  )}
                  {editingSkill && wizardStep === 2 && (
                    <button
                      className="wizard-back"
                      onClick={() => setWizardStep(1)}
                    >
                      Back to details
                    </button>
                  )}
                  {showWizardScrollTop && (
                    <button
                      className="wizard-scroll-top"
                      aria-label="Scroll to top of skill editor"
                      onClick={() => document.querySelector(".skill-wizard")?.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      ↑
                    </button>
                  )}
                </div>
              </div>
            )}
            {parentView === "worksheets" && (
              <>
                <h3>Learn from a worksheet</h3>
                <p>
                  Paste one question per line to learn the school's patterns.
                </p>
                <textarea
                  value={worksheet}
                  onChange={(event) => setWorksheet(event.target.value)}
                  placeholder="1 + 2 = ?&#10;Which number is greater: 4 or 7?"
                  rows={5}
                />
                <button
                  className="next"
                  onClick={analyzeWorksheet}
                  disabled={!worksheet.trim()}
                >
                  Analyze worksheet
                </button>
                {worksheetResult && (
                  <div className="feedback goodbox">
                    <b>
                      {worksheetResult.error ||
                        `Worksheet ${worksheetResult.status?.toLowerCase()}.`}
                    </b>
                    {worksheetResult.questions && (
                      <p>
                        {worksheetResult.questions.length} questions identified
                        and {worksheetResult.patternsLearned} school patterns
                        learned.
                      </p>
                    )}
                  </div>
                )}
              </>
            )}
            {parentView === "misconceptions" && (
              <>
                <h3>Recent misconceptions</h3>
                <div
                  className="subjects"
                  role="tablist"
                  aria-label="Filter misconceptions by subject"
                >
                  {subjects.map((item) => (
                    <button
                      className={
                        misconceptionSubject === item
                          ? "subject active"
                          : "subject"
                      }
                      onClick={() => setMisconceptionSubject(item)}
                      key={item}
                      role="tab"
                      aria-selected={misconceptionSubject === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
                {dash.mistakes.length > 0 && (
                  <div className="misconception-toolbar">
                    <span className="muted">{visibleMisconceptions.length} {misconceptionSubject === "All" ? "recent misconceptions" : `${misconceptionSubject} misconceptions`}</span>
                    <button className="table-action danger" disabled={clearingMisconceptions} onClick={clearMisconceptions}>
                      {clearingMisconceptions ? "Clearing..." : `Clear ${misconceptionSubject}`}
                    </button>
                  </div>
                )}
                {visibleMisconceptions.length ? (
                  <div className="misconception-timeline" onScroll={loadMoreMisconceptions}>
                    {visibleMisconceptions.map((mistake: any) => (
                    <div className="mistake timeline-item" key={`${mistake.attempted_at}-${mistake.subject}-${mistake.skill}-${mistake.question}`}>
                      <time>{mistake.attempted_at ? new Date(mistake.attempted_at).toLocaleString() : "Date unavailable"}</time>
                      <b>
                        {mistake.subject} - {mistake.skill} -{" "}
                        {mistake.mistake_type}
                      </b>
                      <p>{mistake.misconception}</p>
                      <small>{mistake.question}</small>
                    </div>
                    ))}
                    {loadingMoreMisconceptions && <p className="timeline-loading">Loading older misconceptions...</p>}
                  </div>
                ) : (
                  <p className="muted">
                    Complete exercises to see why mistakes happen.
                  </p>
                )}
              </>
            )}
            {parentView === "charts" && (
              <LearningChartsView
                charts={charts}
                activeChartSlug={activeChartSlug}
                setActiveChartSlug={setActiveChartSlug}
                selectedTable={selectedTable}
                setSelectedTable={setSelectedTable}
                alphabetFilter={alphabetFilter}
                setAlphabetFilter={setAlphabetFilter}
                recitingTable={recitingTable}
                setRecitingTable={setRecitingTable}
                chartProgress={chartProgress}
                onRecordPractice={recordChartPractice}
                savingChartItem={savingChartItem}
                childName={child?.name || "Selected Student"}
                isTeacher={true}
                apiUrl={API}
              />
            )}
          </section>
        )}
      </main>
      {pendingDeletion && (
        <div
          className="confirm-overlay"
          role="presentation"
          onMouseDown={() => !isDeleting && setPendingDeletion(null)}
        >
          <section
            className="confirm-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-confirmation-title"
            aria-describedby="delete-confirmation-description"
            onMouseDown={(event) => event.stopPropagation()}
          >
            <span className="confirm-icon" aria-hidden="true">!</span>
            <p className="eyebrow">CONFIRM DELETION</p>
            <h2 id="delete-confirmation-title">
              Delete {pendingDeletion.type === "skill" ? "this skill" : pendingDeletion.type === "questions" ? `${pendingDeletion.item.length} selected questions` : "this question"}?
            </h2>
            <p id="delete-confirmation-description">
              {pendingDeletion.type === "skill"
                ? <><b>{pendingDeletion.item.name}</b>, its questions, and all associated practice history will be permanently removed.</>
                : pendingDeletion.type === "questions"
                  ? <>The selected questions and their associated answer history will be permanently removed.</>
                  : <>This question and its associated answer history will be permanently removed.</>}
            </p>
            <div className="confirm-actions">
              <button
                className="confirm-cancel"
                disabled={isDeleting}
                onClick={() => setPendingDeletion(null)}
              >
                Cancel
              </button>
              <button
                className="confirm-delete"
                disabled={isDeleting}
                onClick={confirmDeletion}
              >
                {isDeleting ? "Deleting..." : "Delete permanently"}
              </button>
            </div>
          </section>
        </div>
      )}
      {showSignOutConfirm && (
        <div className="confirm-overlay" role="presentation" onMouseDown={() => setShowSignOutConfirm(false)}>
          <section className="confirm-modal session-modal" role="dialog" aria-modal="true" aria-labelledby="signout-title" onMouseDown={(event) => event.stopPropagation()}>
            <span className="confirm-icon session-icon" aria-hidden="true">↪</span>
            <p className="eyebrow">SESSION MANAGEMENT</p>
            <h2 id="signout-title">Sign out of SmartStudy?</h2>
            <p>
              {session?.role === "student"
                ? <>Your learning progress is saved. You can sign back in as <b>{child?.name}</b> any time.</>
                : <>Sign out of the Teacher &amp; Educator Workspace?</>}
            </p>
            <div className="confirm-actions">
              <button className="confirm-cancel" onClick={() => setShowSignOutConfirm(false)}>Stay signed in</button>
              <button className="confirm-delete" onClick={handleSignOut}>Sign out</button>
            </div>
          </section>
        </div>
      )}
      {showAddStudentModal && (
        <div
          className="student-modal-backdrop"
          role="presentation"
          onMouseDown={() => setShowAddStudentModal(false)}
        >
          <div
            className="student-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="student-modal-title"
            onMouseDown={(e) => e.stopPropagation()}
          >
            <div className="student-modal-header">
              <h3 id="student-modal-title">👶 Create Student Profile</h3>
              <button
                type="button"
                className="close-btn"
                style={{ background: "transparent", border: "none", fontSize: "18px", cursor: "pointer", color: "var(--muted)" }}
                onClick={() => setShowAddStudentModal(false)}
                aria-label="Close modal"
              >
                ✕
              </button>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createStudentProfile(studentModalData);
              }}
            >
              <div className="student-modal-body">
                <label>
                  Learner Name *
                  <input
                    type="text"
                    required
                    placeholder="e.g. Aarav, Ananya, Kabir"
                    value={studentModalData.name}
                    onChange={(e) => setStudentModalData({ ...studentModalData, name: e.target.value })}
                    className="login-control"
                    autoFocus
                  />
                </label>

                <label>
                  Pick an Avatar
                  <div className="avatar-picker" role="radiogroup" aria-label="Select avatar">
                    {["👦", "👧", "🦁", "🐼", "🚀", "🦄", "🌟", "🎨", "🐶", "🐱"].map((emoji) => (
                      <button
                        type="button"
                        key={emoji}
                        className={`avatar-choice-btn ${studentModalData.avatar === emoji ? "selected" : ""}`}
                        onClick={() => setStudentModalData({ ...studentModalData, avatar: emoji })}
                        aria-label={`Avatar ${emoji}`}
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </label>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                  <label>
                    Class / Grade
                    <select
                      value={studentModalData.grade}
                      onChange={(e) => setStudentModalData({ ...studentModalData, grade: e.target.value })}
                      className="login-control"
                    >
                      <option value="Nursery">Nursery</option>
                      <option value="LKG">LKG</option>
                      <option value="UKG">UKG</option>
                      <option value="1">Class 1</option>
                      <option value="2">Class 2</option>
                      <option value="3">Class 3</option>
                      <option value="4">Class 4</option>
                      <option value="5">Class 5</option>
                    </select>
                  </label>

                  <label>
                    School Board
                    <select
                      value={studentModalData.board}
                      onChange={(e) => setStudentModalData({ ...studentModalData, board: e.target.value })}
                      className="login-control"
                    >
                      <option value="CBSE">CBSE</option>
                      <option value="ICSE">ICSE</option>
                      <option value="State Board">State Board</option>
                      <option value="IB">IB</option>
                      <option value="Cambridge">Cambridge</option>
                    </select>
                  </label>
                </div>

                <label>
                  Learning Medium
                  <select
                    value={studentModalData.medium}
                    onChange={(e) => setStudentModalData({ ...studentModalData, medium: e.target.value })}
                    className="login-control"
                  >
                    <option value="English">English Medium</option>
                    <option value="Marathi">Marathi Medium (मराठी)</option>
                    <option value="Hindi">Hindi Medium (हिंदी)</option>
                  </select>
                </label>
              </div>

              <div className="student-modal-footer">
                <button
                  type="button"
                  className="confirm-cancel"
                  onClick={() => setShowAddStudentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="login-continue"
                  style={{ width: "auto", margin: 0, padding: "8px 20px" }}
                  disabled={!studentModalData.name.trim() || authLoading}
                >
                  {authLoading ? "Saving..." : "Create Profile ✨"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {toast && (
        <div className="success-toast" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}
