import { useEffect, useRef, useState, type UIEvent } from "react";
import LearningChartsView, { LearningChart, ChartProgressData } from "./components/LearningChartsView";

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

type UserRole = "student" | "teacher";

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
  mastery_score: number;
};

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
  if (!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(message);
  const voices = window.speechSynthesis.getVoices();
  const preferred = voices.find((voice) =>
    /female|samantha|zira|karen|susan|victoria|google uk english female|microsoft.*female/i.test(
      `${voice.name} ${voice.voiceURI}`,
    ),
  );
  if (preferred) utterance.voice = preferred;
  utterance.rate = 0.88;
  utterance.pitch = 1.08;
  window.speechSynthesis.speak(utterance);
};

export default function App() {
  const [session, setSession] = useState<SavedAuth | null>(() => savedSession());
  const [loginRole, setLoginRole] = useState<UserRole>("student");
  const [teacherEmail, setTeacherEmail] = useState("teacher@smartstudy.ai");
  const [teacherPassword, setTeacherPassword] = useState("password123");
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);
  const [teacherPreview, setTeacherPreview] = useState(false);

  const [child, setChild] = useState<any>();
  const [children, setChildren] = useState<any[]>([]);
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
  const [parent, setParent] = useState(() => session?.role === "teacher");
  const [parentView, setParentView] = useState("skills");
  const [studentView, setStudentView] = useState<"adventure" | "charts">("adventure");
  const [activeChartSlug, setActiveChartSlug] = useState<string>("tables-2-10");
  const [selectedTable, setSelectedTable] = useState<number | "all">(2);
  const [alphabetFilter, setAlphabetFilter] = useState<"all" | "vowels" | "consonants">("all");
  const [recitingTable, setRecitingTable] = useState<number | null>(null);
  const [charts, setCharts] = useState<LearningChart[]>([]);
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
  });
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
    template: "standard",
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
    setNewSkill({ subject: "English", topic: "", name: "", description: "", difficulty: 1 });
  };

  const load = async () => {
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
    setChild(await childResponse.json());
    setSkills(await skillsResponse.json());
    const dashboard = await dashboardResponse.json();
    setDash(dashboard);
    setMisconceptionPage(1);
    setWorksheets(await worksheetsResponse.json());
    if (chartsResponse.ok) {
      setCharts(await chartsResponse.json());
    }
    if (chartProgressResponse.ok) {
      setChartProgress(await chartProgressResponse.json());
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

  useEffect(() => {
    fetch(`${API}/children`)
      .then((response) => response.json())
      .then(setChildren);
  }, []);
  useEffect(() => {
    if (session) {
      load();
    }
  }, [session, childId]);

  useEffect(() => {
    if (session) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }, [session]);

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
      setAuthError("Unable to connect to the server. Please check your network.");
    } finally {
      setAuthLoading(false);
    }
  };

  const handleTeacherLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await fetch(`${API}/auth/teacher/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: teacherEmail, password: teacherPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setAuthError(data.error || "Invalid email or password.");
        setAuthLoading(false);
        return;
      }
      const newSession: SavedAuth = {
        role: "teacher",
        user: data.user,
        activeChildId: childId || defaultChildId,
      };
      setSession(newSession);
      setParent(true);
      setParentView("skills");
      setTeacherPreview(false);
      showToast(`Signed in as ${data.user.name}`);
    } catch {
      setAuthError("Unable to connect to the server. Please check your network.");
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

  const start = async (selectedSkill: Skill) => {
    setSkill(selectedSkill);
    setIndex(0);
    setResult(undefined);
    // Reuse the questions already stored for this skill. This keeps practice
    // sessions stable and prevents duplicate rows in the edit modal.
    const existingResponse = await fetch(`${API}/skills/${selectedSkill.id}/exercises`);
    const existing = await existingResponse.json();
    if (existingResponse.ok && existing.length) {
      setExercises(existing.map((item: any) => ({
        ...item,
        skillId: item.skill_id,
        skillName: selectedSkill.name,
        questionType: item.question_type,
        correctAnswer: item.correct_answer,
        options: Array.isArray(item.options) ? item.options : JSON.parse(item.options || "[]"),
      })));
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

  const answer = async (answerValue: string) => {
    if (result) return;
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

  const next = () => {
    if (index < exercises.length - 1) {
      setIndex(index + 1);
      setResult(undefined);
    } else {
      setExercises([]);
      setSkill(undefined);
      load();
    }
  };

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
    setNewSkill({ ...newSkill, topic: "", name: "", description: "" });
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
    setNewSkill({
      subject: item.subject,
      topic: item.topic,
      name: item.name,
      description: item.description || "",
      difficulty: Number(item.difficulty) || 1,
    });
    fetch(`${API}/skills/${item.id}/exercises`)
      .then((response) => response.json())
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
          template: exercise.template || "standard",
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
      body: JSON.stringify({ ...newQuestion, options }),
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
      template: "standard",
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
    const response = await fetch(`${API}/children`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newChild),
    });
    const data = await response.json();
    if (!response.ok) {
      setChildMessage(data.message || data.error || "Unable to add child.");
      return;
    }
    setChildMessage(`${data.name} added. Username: ${data.username}`);
    setNewChild({ ...newChild, name: "" });
    const childrenResponse = await fetch(`${API}/children`);
    setChildren(await childrenResponse.json());
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
  const visibleMisconceptions = misconceptionSubject === "All"
    ? dash.mistakes
    : dash.mistakes.filter((item: any) => item.subject === misconceptionSubject);
  const filteredChildren = children.filter((item) =>
    `${item.name} ${item.username}`
      .toLowerCase()
      .includes(childSearch.toLowerCase()),
  );

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
              <span>🎒</span> Student Login
            </button>
            <button
              className={`login-role-tab ${loginRole === "teacher" ? "active" : ""}`}
              onClick={() => { setLoginRole("teacher"); setAuthError(null); }}
              role="tab"
              aria-selected={loginRole === "teacher"}
            >
              <span>👩‍🏫</span> Teacher Portal
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
                        <span className="avatar">{item.name.charAt(0)}</span>
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
                    <span className="avatar">{item.name.charAt(0)}</span>
                    <div style={{ flex: 1 }}>
                      <b>{item.name}</b>
                      <small>@{item.username} · Class {item.grade}</small>
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
            <form className="teacher-login-form" onSubmit={handleTeacherLogin}>
              <h1>Teacher &amp; Parent Portal</h1>
              <p>Sign in to manage curriculum, review reports, and analyze worksheets.</p>

              <div className="demo-hint-box">
                <div>
                  <strong>Demo credentials:</strong><br />
                  teacher@smartstudy.ai / password123
                </div>
                <button
                  type="button"
                  className="demo-fill-btn"
                  onClick={() => {
                    setTeacherEmail("teacher@smartstudy.ai");
                    setTeacherPassword("password123");
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
                  value={teacherEmail}
                  onChange={(e) => setTeacherEmail(e.target.value)}
                  placeholder="teacher@smartstudy.ai"
                  required
                />
              </label>

              <label>
                Password
                <input
                  type="password"
                  className="login-control"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </label>

              <button
                type="submit"
                className="login-continue"
                disabled={authLoading}
              >
                {authLoading ? "Signing in..." : "Sign in to Dashboard"}
              </button>
            </form>
          )}
        </div>
      </div>
    );

  return (
    <div className={`app-shell ${exerciseFullscreen ? "exercise-fullscreen" : ""}`}>
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
              >
                <span>◇</span> My Learning Adventure
              </button>
              <button
                className={studentView === "charts" ? "nav-item active" : "nav-item"}
                onClick={() => { setStudentView("charts"); setSkill(undefined); }}
              >
                <span>📊</span> Learning Charts
              </button>
            </>
          ) : (
            <>
              <button
                className={parentView === "skills" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("skills"); }}
              >
                <span>📚</span> Skills &amp; Curriculum
              </button>
              <button
                className={parentView === "children" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("children"); }}
              >
                <span>👥</span> Students &amp; Roster
              </button>
              <button
                className={parentView === "charts" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("charts"); }}
              >
                <span>📊</span> Charts &amp; Records
              </button>
              <button
                className={parentView === "worksheets" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("worksheets"); }}
              >
                <span>📝</span> School Worksheets
              </button>
              <button
                className={parentView === "misconceptions" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("misconceptions"); }}
              >
                <span>🔍</span> Misconceptions
              </button>
              <button
                className={parentView === "templates" && !teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(false); setParent(true); setParentView("templates"); }}
              >
                <span>📐</span> Screen Templates
              </button>
              <button
                className={teacherPreview ? "nav-item active" : "nav-item"}
                onClick={() => { setTeacherPreview(true); }}
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
                : "Teacher & Educator Workspace · Class 1"}
            </p>
          </div>
          <div className="session-controls">
            {session?.role === "student" ? (
              <>
                <span className="role-badge student">🎒 Student</span>
                <div className="session-profile">
                  <span className="avatar">{child?.name?.charAt(0) || "S"}</span>
                  <span><b>{child?.name || "Learner"}</b><small>@{child?.username || "learner"}</small></span>
                </div>
              </>
            ) : (
              <>
                <span className="role-badge teacher">👩‍🏫 Teacher</span>
                <div className="teacher-student-selector">
                  <small className="muted">Student:</small>
                  <select
                    value={childId}
                    onChange={(e) => setChildId(e.target.value)}
                    aria-label="Active student"
                  >
                    {children.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name} (@{c.username})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="session-profile">
                  <span className="avatar" style={{ background: "#147d78", color: "#fff" }}>
                    {session?.user?.name?.charAt(0) || "T"}
                  </span>
                  <span><b>{session?.user?.name || "Teacher"}</b><small>{session?.user?.email}</small></span>
                </div>
              </>
            )}
            <button className="session-exit" onClick={() => setShowSignOutConfirm(true)}>
              Sign out
            </button>
          </div>
        </header>
        {(session?.role === "student" || teacherPreview) ? (
          <>
            {teacherPreview && (
              <div className="preview-banner">
                <span>👁️ <b>Teacher Preview Mode:</b> Experiencing student practice screen for <b>{child?.name}</b></span>
                <button className="preview-exit-btn" onClick={() => setTeacherPreview(false)}>
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
                  {visibleSkills.map((item) => (
                    <button
                      className="skill"
                      onClick={() => start(item)}
                      key={item.id}
                    >
                      <b>{item.name}</b>
                      <small>
                        {item.topic} - {Math.round(item.mastery_score)}%
                        mastered
                      </small>
                    </button>
                  ))}
                </div>
              </section>
            ) : (
                <section className={`panel question template-${exercises[index]?.template || "standard"}`}>
                <button className="exercise-fullscreen-toggle" onClick={() => setExerciseFullscreen(!exerciseFullscreen)} aria-label={exerciseFullscreen ? "Exit full screen" : "View exercise full screen"} title={exerciseFullscreen ? "Exit full screen" : "View exercise full screen"}>
                  {exerciseFullscreen ? "×" : "⛶"}
                </button>
                <button className="question-nav question-nav-left" disabled={index === 0} onClick={() => { setIndex((current) => Math.max(0, current - 1)); setResult(undefined); }} aria-label="Previous question" title="Previous question">‹</button>
                <button className="question-nav question-nav-right" disabled={index >= exercises.length - 1} onClick={() => { setIndex((current) => Math.min(exercises.length - 1, current + 1)); setResult(undefined); }} aria-label="Next question" title="Next question">›</button>
                <span className="pill">{skill.name}</span>
                <div className="question-layout">
                  <h3 className={`layout-placeholder ${placeholderLayoutClass(templateLayouts, exercises[index]?.template || "standard", "Title")}`} data-placeholder="Title">{skill.name}</h3>
                  <h2 className={`layout-placeholder ${placeholderLayoutClass(templateLayouts, exercises[index]?.template || "standard", "Actual question")}`} data-placeholder="Actual question">{exercises[index]?.question}</h2>
                  {exercises[index]?.image_url && <img className={`question-image image-size-${templateLayouts[exercises[index]?.template || "standard"]?.imageSize || "medium"} layout-placeholder ${placeholderLayoutClass(templateLayouts, exercises[index]?.template || "standard", "Image")}`} data-placeholder="Image" src={exercises[index].image_url} alt="Question illustration" />}
                  {exercises[index]?.image_question && <p className={`image-question-text image-question-size-${templateLayouts[exercises[index]?.template || "standard"]?.imageQuestionSize || "medium"} layout-placeholder ${placeholderLayoutClass(templateLayouts, exercises[index]?.template || "standard", "Image question")}`} data-placeholder="Image question">{exercises[index].image_question}</p>}
                  <div className={`options layout-placeholder ${placeholderLayoutClass(templateLayouts, exercises[index]?.template || "standard", "Answer choices")}`} data-placeholder="Answer choices">
                  {exercises[index]?.options.map((option: string) => (
                    <button
                      disabled={!!result}
                      className={
                        result?.correct && result.correctAnswer === option
                          ? "good"
                          : ""
                      }
                      onClick={() => answer(option)}
                      key={option}
                    >
                      {option}
                    </button>
                  ))}
                  </div>
                </div>
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
                        <tr><td colSpan={7} className="muted">No skills found for this subject.</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            {parentView === "children" && (
              <>
                <div className="section-toolbar">
                  <div>
                    <h3>Manage children</h3>
                    <p>Learning profiles and their unique usernames.</p>
                  </div>
                  <button
                    className="next"
                    onClick={() => setShowAddChild(!showAddChild)}
                  >
                    {showAddChild ? "Close" : "Add child"}
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
                        <tr key={item.id}>
                          <td><b>{item.name}</b></td>
                          <td>@{item.username}</td>
                          <td>{item.grade}</td>
                          <td>{item.board || "-"}</td>
                          <td>{item.medium || "English"}</td>
                          <td>
                            <button
                              className="table-action"
                              onClick={() => {
                                setChildId(item.id);
                                setTeacherPreview(true);
                              }}
                            >
                              Practice Preview
                            </button>
                          </td>
                        </tr>
                      ))}
                      {!children.length && <tr><td colSpan={5} className="muted">No child profiles yet.</td></tr>}
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
                    <p>Choose how questions are presented in the child learning screen.</p>
                  </div>
                </div>
                <div className="template-catalog">
                  {[{ id: "standard", name: "Standard", title: "Standard question", description: "Clean, focused layout for everyday multiple-choice practice.", preview: "?", previewClass: "standard-preview" }, { id: "image_prompt", name: "Image prompt", title: "Image prompt", description: "Highlights a supporting picture before the question and answers.", preview: "▧", previewClass: "image-preview" }, { id: "story_card", name: "Story card", title: "Story card", description: "A warm, card-based format for contextual and story-led questions.", preview: "✦", previewClass: "story-preview" }, { id: "flashcard", name: "Flashcard", title: "Flashcard", description: "A focused reveal-style layout for memory and vocabulary practice.", preview: "▤", previewClass: "standard-preview" }, { id: "fill_blank", name: "Fill in the blank", title: "Fill in the blank", description: "Emphasizes the missing word or letter in a sentence.", preview: "_", previewClass: "image-preview" }, { id: "true_false", name: "True or false", title: "True or false", description: "Simple statement-based format for quick concept checks.", preview: "✓", previewClass: "story-preview" }].map((template) => (
                  <div className={`template-card ${template.id === "standard" ? "active" : ""}`} key={template.id}>
                    <div className={`template-preview ${template.previewClass}`}><span>{template.preview}</span></div>
                    <div className="template-live-preview">{placeholderNames.slice().filter((placeholder) => (templateLayouts[template.id]?.[placeholder] || placeholderDefault[placeholder]) !== "hidden").sort((a, b) => (["top", "middle", "bottom"].indexOf(templateLayouts[template.id]?.[a] || placeholderDefault[a]) - ["top", "middle", "bottom"].indexOf(templateLayouts[template.id]?.[b] || placeholderDefault[b]))).map((placeholder) => <span key={placeholder}>{placeholder}</span>)}</div>
                    <span className="template-badge">{template.name}</span><h4>{template.title}</h4><p>{template.description}</p>
                    <div className="template-placeholders"><b>Placeholders &amp; preview order</b>{placeholderNames.map((placeholder) => <label key={placeholder}>{placeholder}<select value={templateLayouts[template.id]?.[placeholder] || placeholderDefault[placeholder]} onChange={(event) => updateTemplateLayout(template.id, placeholder, event.target.value)}><option value="top">Top</option><option value="middle">Middle</option><option value="bottom">Bottom</option><option value="hidden">Empty</option></select></label>)}<label>Image size<select value={templateLayouts[template.id]?.imageSize || "medium"} onChange={(event) => updateTemplateLayout(template.id, "imageSize", event.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label><label>Image question text<select value={templateLayouts[template.id]?.imageQuestionSize || "medium"} onChange={(event) => updateTemplateLayout(template.id, "imageQuestionSize", event.target.value)}><option value="small">Small</option><option value="medium">Medium</option><option value="large">Large</option></select></label></div>
                  </div>
                  ))}
                </div>
                <p className="muted template-note">Select a template while creating or editing a question to apply it.</p>
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
                          Editing <strong>{newSkill.name}</strong> under {newSkill.subject}
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
                        <h3>Questions for this skill</h3>
                        {selectedExerciseIds.length > 0 && (
                          <button
                            className="table-action danger"
                            onClick={() => setPendingDeletion({ type: "questions", item: skillExercises.filter((item) => selectedExerciseIds.includes(item.id)) })}
                          >
                            Delete {selectedExerciseIds.length} selected
                          </button>
                        )}
                      </div>
                      {skillExercises.length ? (
                        <>
                        <div className="question-field-labels"><span>Question</span><span>Options</span><span>Correct answer</span><span>Explanation</span><span>Template and media</span></div>
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
                                <span className="template-badge">{{ standard: "Standard", image_prompt: "Image prompt", story_card: "Story card", flashcard: "Flashcard", fill_blank: "Fill in the blank", true_false: "True or false" }[exercise.template || "standard"]}</span>
                              </div>
                              <select
                                className="question-template-editor"
                                value={exercise.template || "standard"}
                                onChange={(event) => setSkillExercises((items) => items.map((item) => item.id === exercise.id ? { ...item, template: event.target.value } : item))}
                                aria-label="Question template"
                              >
                                <option value="standard">Standard</option><option value="image_prompt">Image prompt</option><option value="story_card">Story card</option><option value="flashcard">Flashcard</option><option value="fill_blank">Fill in the blank</option><option value="true_false">True or false</option>
                              </select>
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
                              {exercise.template === "image_prompt" && <><label className="question-image-editor">
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
                        <div className="composer-heading"><div><span className="eyebrow">QUESTION BUILDER</span><h4>Add a question</h4></div><span className="composer-hint">Multiple choice</span></div>
                        <label>Child screen template <select value={newQuestion.template} onChange={(event) => setNewQuestion({ ...newQuestion, template: event.target.value })}>
                          <option value="standard">Standard</option><option value="image_prompt">Image prompt</option><option value="story_card">Story card</option><option value="flashcard">Flashcard</option><option value="fill_blank">Fill in the blank</option><option value="true_false">True or false</option>
                        </select></label>
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
                        {newQuestion.template === "image_prompt" && <><label>Question image <input
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
      {toast && (
        <div className="success-toast" role="status" aria-live="polite">
          <span aria-hidden="true">✓</span>
          {toast}
        </div>
      )}
    </div>
  );
}
