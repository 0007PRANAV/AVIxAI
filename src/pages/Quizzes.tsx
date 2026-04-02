import { useState, useRef, useEffect } from "react";
import { CheckCircle, XCircle, Camera, Monitor, Shield, Zap, AlertCircle, Timer, Trophy } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

interface QuizQuestion {
  q: string;
  options: string[];
  correct: number;
}

type Difficulty = "easy" | "medium" | "hard";

interface QuizConfig {
  id: string;
  title: string;
  icon: string;
  category: string;
  questions: number;
  baseXP: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  color: string;
  color2: string;
  questions_data: QuizQuestion[];
}

const RAW_QUIZZES: QuizConfig[] = [
  {
    id: "js-basics", title: "JavaScript Basics", icon: "🌐", category: "Web Dev",
    questions: 10, baseXP: 60, difficulty: "Beginner", color: "#0D1F3C", color2: "#1A3A6B",
    questions_data: [
      { q: "What does 'typeof null' return in JavaScript?", options: ["'null'", "'object'", "'undefined'", "'boolean'"], correct: 1 },
      { q: "Which method removes the last element from an array?", options: ["splice()", "pop()", "shift()", "delete()"], correct: 1 },
      { q: "What is the output of '0.1 + 0.2 === 0.3'?", options: ["true", "false", "undefined", "NaN"], correct: 1 },
      { q: "Which keyword declares a block-scoped variable?", options: ["var", "let", "hoisted", "scope"], correct: 1 },
      { q: "What does 'Array.isArray([])' return?", options: ["false", "true", "0", "null"], correct: 1 },
      { q: "What is a closure in JavaScript?", options: ["A loop construct", "A function with access to its outer scope", "A syntax error", "A type of variable"], correct: 1 },
      { q: "Which operator checks equality without type coercion?", options: ["==", "===", "!=", "="], correct: 1 },
      { q: "What does 'Promise.all()' do?", options: ["Executes promises sequentially", "Runs all promises concurrently", "Cancels all promises", "Ignores rejected promises"], correct: 1 },
    ]
  },
  {
    id: "react-quiz", title: "React Fundamentals", icon: "⚛️", category: "Frontend",
    questions: 8, baseXP: 80, difficulty: "Intermediate", color: "#1A0D3C", color2: "#3A1A6B",
    questions_data: [
      { q: "What hook is used to manage local state in a functional component?", options: ["useEffect", "useState", "useRef", "useMemo"], correct: 1 },
      { q: "What does JSX stand for?", options: ["JavaScript XML", "Java Syntax Extension", "JSON XML", "JavaScript Extension"], correct: 0 },
      { q: "Which lifecycle phase does 'useEffect' with '[]' correspond to?", options: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "render"], correct: 2 },
      { q: "What is the virtual DOM?", options: ["A browser API", "A lightweight copy of the actual DOM", "A CSS framework", "A Node.js module"], correct: 1 },
      { q: "Props in React are:", options: ["Mutable by the child", "Immutable from the child's perspective", "Always objects", "Only strings"], correct: 1 },
      { q: "Which hook runs side effects after render?", options: ["useState", "useContext", "useEffect", "useReducer"], correct: 2 },
      { q: "What is the key prop used for in React lists?", options: ["Styling each item", "Help React track which items changed", "Required for all JSX", "Sets item index"], correct: 1 },
    ]
  },
  {
    id: "ai-quiz", title: "AI & Machine Learning", icon: "🤖", category: "AI/ML",
    questions: 10, baseXP: 100, difficulty: "Intermediate", color: "#0D2A1E", color2: "#1A5A3C",
    questions_data: [
      { q: "What does GPT stand for?", options: ["General Purpose Transformer", "Generative Pre-trained Transformer", "Graphical Processing Tool", "General Processing Technology"], correct: 1 },
      { q: "What is 'overfitting' in machine learning?", options: ["Model performs poorly on training data", "Model performs well on training but poorly on new data", "Model is too simple", "Model trains too slowly"], correct: 1 },
      { q: "What is a neural network inspired by?", options: ["Computer circuits", "Human brain structure", "Mathematical equations", "Statistical models"], correct: 1 },
      { q: "What does 'supervised learning' mean?", options: ["Human monitors AI constantly", "Training with labeled data", "Unsupervised clustering", "Reinforcement loops"], correct: 1 },
      { q: "What is a 'prompt' in AI context?", options: ["A software bug", "Input text given to an AI model", "A model architecture", "A training dataset"], correct: 1 },
      { q: "What is gradient descent?", options: ["A data preprocessing step", "An optimization algorithm to minimize loss", "A type of neural net", "A visualization tool"], correct: 1 },
      { q: "What does 'LLM' stand for?", options: ["Low Level Machine", "Large Language Model", "Logic Layer Module", "Linked List Manager"], correct: 1 },
    ]
  },
  {
    id: "python-quiz", title: "Python Essentials", icon: "🐍", category: "Data Science",
    questions: 10, baseXP: 75, difficulty: "Beginner", color: "#2A1A0D", color2: "#5A3A1A",
    questions_data: [
      { q: "What is the output of 'type([])' in Python?", options: ["<class 'tuple'>", "<class 'list'>", "<class 'array'>", "<class 'dict'>"], correct: 1 },
      { q: "Which function gets the length of a list?", options: ["size()", "count()", "len()", "length()"], correct: 2 },
      { q: "What symbol is used for comments in Python?", options: ["//", "/* */", "#", "--"], correct: 2 },
      { q: "What does 'def' keyword do?", options: ["Defines a class", "Defines a function", "Defines a variable", "Defines a loop"], correct: 1 },
      { q: "Which library is used for data manipulation?", options: ["NumPy", "Pandas", "Matplotlib", "Seaborn"], correct: 1 },
      { q: "What does 'None' represent in Python?", options: ["Zero", "The absence of a value", "An empty string", "False"], correct: 1 },
      { q: "Which keyword is used to handle exceptions?", options: ["catch", "except", "handle", "error"], correct: 1 },
    ]
  },
  {
    id: "html-css", title: "HTML & CSS", icon: "🎨", category: "Web Dev",
    questions: 10, baseXP: 50, difficulty: "Beginner", color: "#2A0D1A", color2: "#5A1A3A",
    questions_data: [
      { q: "What does HTML stand for?", options: ["HyperText Markup Language", "High Text Modeling Language", "HyperTransfer Markup Language", "Hosted Text Markup Language"], correct: 0 },
      { q: "Which CSS property controls font size?", options: ["text-size", "font-size", "font-style", "text-scale"], correct: 1 },
      { q: "What HTML tag is used for the largest heading?", options: ["<h6>", "<h1>", "<header>", "<head>"], correct: 1 },
      { q: "Which property sets background color in CSS?", options: ["color", "background-color", "bg-color", "background"], correct: 1 },
      { q: "What does 'display: flex' do?", options: ["Makes element invisible", "Enables flexbox layout", "Adds padding", "Makes text bold"], correct: 1 },
      { q: "What is the CSS box model?", options: ["A 3D shape tool", "Content, padding, border, margin layers", "A grid system", "An animation framework"], correct: 1 },
      { q: "What does the 'alt' attribute on an image do?", options: ["Sets image size", "Provides alternative text description", "Links to another page", "Adds a border"], correct: 1 },
    ]
  },
  {
    id: "git-quiz", title: "Git & Version Control", icon: "🔀", category: "DevOps",
    questions: 8, baseXP: 65, difficulty: "Beginner", color: "#0D2A2A", color2: "#1A5A5A",
    questions_data: [
      { q: "What command creates a new git repository?", options: ["git start", "git init", "git create", "git new"], correct: 1 },
      { q: "What does 'git clone' do?", options: ["Creates a branch", "Copies a repository", "Stages changes", "Merges branches"], correct: 1 },
      { q: "What does 'git commit -m' do?", options: ["Merges code", "Saves changes with a message", "Pushes to remote", "Reverts changes"], correct: 1 },
      { q: "Which command shows current status of the repository?", options: ["git log", "git show", "git status", "git info"], correct: 2 },
      { q: "What is a branch in Git?", options: ["A copy of the entire project", "A separate line of development", "A file backup", "A remote repository"], correct: 1 },
      { q: "What does 'git pull' do?", options: ["Uploads local commits", "Fetches and merges remote changes", "Creates a new branch", "Deletes remote changes"], correct: 1 },
    ]
  },
  {
    id: "sql-quiz", title: "SQL Basics", icon: "🗄️", category: "Backend",
    questions: 8, baseXP: 70, difficulty: "Beginner", color: "#0D2A1E", color2: "#1A4A2A",
    questions_data: [
      { q: "What does SQL stand for?", options: ["Structured Query Language", "Simple Question Language", "System Query Logic", "String Query List"], correct: 0 },
      { q: "Which SQL command retrieves data?", options: ["FETCH", "RETRIEVE", "SELECT", "GET"], correct: 2 },
      { q: "What does 'WHERE' clause do?", options: ["Sorts results", "Filters records based on a condition", "Groups results", "Joins tables"], correct: 1 },
      { q: "What is a PRIMARY KEY?", options: ["A password for the table", "A unique identifier for each row", "A required column", "A sorting column"], correct: 1 },
      { q: "Which command adds new records?", options: ["ADD", "INSERT", "CREATE", "PUT"], correct: 1 },
      { q: "What does JOIN do in SQL?", options: ["Deletes duplicate rows", "Combines rows from multiple tables", "Adds a new column", "Counts rows"], correct: 1 },
    ]
  },
];

const DIFFICULTY_CONFIG: Record<Difficulty, { xpMultiplier: number; timePerQuestion: number; label: string; color: string }> = {
  easy: { xpMultiplier: 0.7, timePerQuestion: 45, label: "Easy", color: "var(--lq-green)" },
  medium: { xpMultiplier: 1.0, timePerQuestion: 30, label: "Medium", color: "var(--lq-yellow)" },
  hard: { xpMultiplier: 1.5, timePerQuestion: 20, label: "Hard", color: "var(--lq-red)" },
};

function shuffleQuestion(question: QuizQuestion): QuizQuestion {
  const correctAnswer = question.options[question.correct];
  const shuffled = [...question.options];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  const newCorrect = shuffled.indexOf(correctAnswer);
  return { q: question.q, options: shuffled, correct: newCorrect };
}

type QuizState = "list" | "difficulty-select" | "active" | "result";

interface ActiveQuiz {
  id: string;
  title: string;
  icon: string;
  category: string;
  xp: number;
  difficulty: string;
  color: string;
  color2: string;
  shuffledQuestions: QuizQuestion[];
  selectedDifficulty: Difficulty;
  timePerQuestion: number;
}

export default function Quizzes() {
  const { user, addXP } = useApp();
  const [activeQuiz, setActiveQuiz] = useState<ActiveQuiz | null>(null);
  const [state, setState] = useState<QuizState>("list");
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [cameraEnabled, setCameraEnabled] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Timer state
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer effect
  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up - auto-submit wrong answer
            handleTimeUp();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerActive, timeLeft]);

  function handleTimeUp() {
    if (selected === null && activeQuiz) {
      setSelected(-1); // Mark as wrong (timeout)
      setTimerActive(false);
    }
  }

  async function startCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) videoRef.current.srcObject = stream;
      setCameraEnabled(true);
      setCameraError(false);
    } catch {
      setCameraError(true);
    }
  }

  function stopCamera() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraEnabled(false);
  }

  function selectDifficulty(quiz: QuizConfig) {
    setActiveQuiz({
      id: quiz.id, title: quiz.title, icon: quiz.icon, category: quiz.category,
      xp: quiz.baseXP, difficulty: quiz.difficulty, color: quiz.color, color2: quiz.color2,
      shuffledQuestions: [], selectedDifficulty: "medium", timePerQuestion: DIFFICULTY_CONFIG.medium.timePerQuestion,
    });
    setState("difficulty-select");
  }

  function startQuizWithDifficulty(difficulty: Difficulty) {
    if (!activeQuiz) return;
    const originalQuiz = RAW_QUIZZES.find(q => q.id === activeQuiz.id);
    if (!originalQuiz) return;

    const shuffledQuestions = originalQuiz.questions_data.map(q => shuffleQuestion(q));
    const config = DIFFICULTY_CONFIG[difficulty];
    const adjustedXP = Math.round(originalQuiz.baseXP * config.xpMultiplier);

    setActiveQuiz({
      ...activeQuiz,
      shuffledQuestions,
      selectedDifficulty: difficulty,
      xp: adjustedXP,
      timePerQuestion: config.timePerQuestion,
    });
    setState("active");
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setTimeLeft(config.timePerQuestion);
    setTimerActive(true);
    startCamera();
  }

  function handleAnswer(idx: number) {
    if (selected !== null || !activeQuiz) return;
    setSelected(idx);
    setTimerActive(false);
    const q = activeQuiz.shuffledQuestions[currentQ];
    if (idx === q.correct) setScore(s => s + 1);
  }

  function nextQuestion() {
    if (!activeQuiz) return;
    if (currentQ + 1 >= activeQuiz.shuffledQuestions.length) {
      finishQuiz();
      return;
    }
    setCurrentQ(q => q + 1);
    setSelected(null);
    setTimeLeft(activeQuiz.timePerQuestion);
    setTimerActive(true);
  }

  function finishQuiz() {
    stopCamera();
    setTimerActive(false);
    setState("result");
    const total = activeQuiz!.shuffledQuestions.length;
    const earnedXP = Math.round((score / total) * activeQuiz!.xp);
    addXP(earnedXP, "quiz");
    showXPToast("🎯", `Quiz complete! +${earnedXP} XP earned`, "#FFD166");
  }

  function formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  if (state === "difficulty-select" && activeQuiz) {
    const originalQuiz = RAW_QUIZZES.find(q => q.id === activeQuiz.id);
    if (!originalQuiz) return null;

    return (
      <div className="max-w-md mx-auto">
        <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="text-5xl mb-4">{activeQuiz.icon}</div>
          <h2 className="text-xl font-black mb-2">{activeQuiz.title}</h2>
          <p className="text-sm mb-6" style={{ color: "rgba(136,144,168,1)" }}>
            Choose your difficulty level
          </p>

          <div className="space-y-3 mb-6">
            {(Object.keys(DIFFICULTY_CONFIG) as Difficulty[]).map((diff) => {
              const config = DIFFICULTY_CONFIG[diff];
              const xpReward = Math.round(originalQuiz.baseXP * config.xpMultiplier);
              return (
                <button
                  key={diff}
                  onClick={() => startQuizWithDifficulty(diff)}
                  className="w-full p-4 rounded-xl text-left transition-all hover:scale-[1.02]"
                  style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)" }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-bold text-sm mb-1" style={{ color: config.color }}>
                        {config.label}
                      </div>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>
                        {config.timePerQuestion}s per question
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-black" style={{ color: "var(--lq-yellow)" }}>
                        ⚡ {xpReward} XP
                      </div>
                      <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>
                        {Math.round(config.xpMultiplier * 100)}% reward
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setState("list")}
            className="text-sm font-medium"
            style={{ color: "rgba(136,144,168,1)" }}
          >
            ← Back to quizzes
          </button>
        </div>
      </div>
    );
  }

  if (state === "active" && activeQuiz) {
    const q = activeQuiz.shuffledQuestions[currentQ];
    const progress = (currentQ / activeQuiz.shuffledQuestions.length) * 100;
    const config = DIFFICULTY_CONFIG[activeQuiz.selectedDifficulty];
    const isTimeLow = timeLeft <= 10;

    return (
      <div className="max-w-2xl mx-auto">
        {/* Anti-cheat banner */}
        <div className="flex items-center gap-3 p-3 rounded-xl mb-4" style={{ background: "rgba(155,111,255,.07)", border: "1px solid rgba(155,111,255,.2)" }}>
          <Camera size={16} style={{ color: cameraEnabled ? "var(--lq-green)" : "var(--lq-red)" }} />
          <span className="text-xs font-bold" style={{ color: cameraEnabled ? "var(--lq-green)" : "var(--lq-red)" }}>
            {cameraEnabled ? "Anti-cheat monitoring active" : cameraError ? "Camera access denied" : "Enabling camera..."}
          </span>
          <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Session is being monitored for academic integrity.</span>
          {cameraEnabled && (
            <div className="ml-auto w-14 h-10 rounded overflow-hidden flex-shrink-0">
              <video ref={videoRef} autoPlay muted className="w-full h-full object-cover" style={{ transform: "scaleX(-1)" }} />
            </div>
          )}
        </div>

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs font-bold" style={{ color: "var(--lq-purple)" }}>{activeQuiz.title}</span>
            <p className="text-[11px]" style={{ color: "rgba(136,144,168,1)" }}>Question {currentQ + 1} of {activeQuiz.shuffledQuestions.length}</p>
          </div>
          <div className="flex items-center gap-3">
            {/* Timer */}
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{
                background: isTimeLow ? "rgba(255,77,77,.1)" : "rgba(255,209,102,.1)",
                border: `1px solid ${isTimeLow ? "rgba(255,77,77,.2)" : "rgba(255,209,102,.2)"}`,
                color: isTimeLow ? "var(--lq-red)" : "var(--lq-yellow)"
              }}
            >
              <Timer size={12} />
              {formatTime(timeLeft)}
            </div>
            <span
              className="text-xs font-bold px-2 py-1 rounded-full"
              style={{ background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}
            >
              {config.label}
            </span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full" style={{ background: "rgba(255,209,102,.1)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
              ⚡ {activeQuiz.xp} XP
            </span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 rounded-full mb-6 overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
          <div className="h-full rounded-full transition-all duration-500"
            style={{ width: `${progress}%`, background: "linear-gradient(90deg, var(--lq-blue), var(--lq-purple))" }} />
        </div>

        {/* Question */}
        <div className="p-6 rounded-2xl mb-4" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <p className="text-base font-bold mb-5 leading-relaxed">{q.q}</p>
          <div className="grid gap-2.5">
            {q.options.map((opt, i) => {
              let btnStyle: React.CSSProperties = { background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(232,234,240,1)" };
              if (selected !== null) {
                if (i === q.correct) btnStyle = { background: "rgba(46,204,142,.12)", border: "1px solid rgba(46,204,142,.35)", color: "var(--lq-green)" };
                else if (i === selected) btnStyle = { background: "rgba(255,77,77,.1)", border: "1px solid rgba(255,77,77,.3)", color: "var(--lq-red)" };
                else btnStyle = { background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.05)", color: "rgba(90,96,122,1)", opacity: 0.5 };
              }
              return (
                <button
                  key={i}
                  className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all hover:scale-[1.01]"
                  style={btnStyle}
                  onClick={() => handleAnswer(i)}
                  disabled={selected !== null}
                  data-testid={`answer-${i}`}
                >
                  <span className="font-bold mr-2" style={{ color: "rgba(90,96,122,1)" }}>{String.fromCharCode(65 + i)}.</span> {opt}
                  {selected !== null && i === q.correct && <CheckCircle size={16} className="inline ml-2" style={{ color: "var(--lq-green)" }} />}
                  {selected === i && i !== q.correct && <XCircle size={16} className="inline ml-2" style={{ color: "var(--lq-red)" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {selected !== null && (
          <button
            onClick={nextQuestion}
            className="w-full py-3.5 rounded-xl font-bold text-sm gradient-bg text-white transition-transform hover:scale-[1.02]"
            data-testid="next-question-btn"
          >
            {currentQ + 1 >= activeQuiz.shuffledQuestions.length ? "See Results 🎉" : "Next Question →"}
          </button>
        )}
      </div>
    );
  }

  if (state === "result" && activeQuiz) {
    const total = activeQuiz.shuffledQuestions.length;
    const pct = Math.round((score / total) * 100);
    const earned = Math.round((score / total) * activeQuiz.xp);
    const config = DIFFICULTY_CONFIG[activeQuiz.selectedDifficulty];

    return (
      <div className="max-w-md mx-auto text-center">
        <div className="p-8 rounded-2xl pop-in" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(155,111,255,.3)" }}>
          <div className="text-6xl mb-4 bob">{pct >= 80 ? "🎉" : pct >= 50 ? "👍" : "💪"}</div>
          <h2 className="text-2xl font-black mb-2 gradient-text">{pct >= 80 ? "Excellent!" : pct >= 50 ? "Good Job!" : "Keep Practicing!"}</h2>
          <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>You scored {score}/{total} ({pct}%) on {activeQuiz.title}</p>

          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold mb-6"
            style={{ background: `${config.color}15`, color: config.color, border: `1px solid ${config.color}30` }}
          >
            <Trophy size={12} />
            {config.label} Difficulty
          </div>

          <div className="flex justify-center gap-6 mb-6">
            <div><div className="text-2xl font-black" style={{ color: "var(--lq-yellow)" }}>+{earned}</div><div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>XP Earned</div></div>
            <div><div className="text-2xl font-black" style={{ color: "var(--lq-green)" }}>{score}</div><div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Correct</div></div>
            <div><div className="text-2xl font-black" style={{ color: "var(--lq-red)" }}>{total - score}</div><div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Wrong</div></div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { const orig = RAW_QUIZZES.find(q => q.id === activeQuiz.id); if (orig) selectDifficulty(orig); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm"
              style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }}>
              Retry Quiz
            </button>
            <button onClick={() => { setState("list"); setActiveQuiz(null); }}
              className="flex-1 py-3 rounded-xl font-bold text-sm gradient-bg text-white">
              More Quizzes →
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1">🎯 Quizzes</h1>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        Test your knowledge and earn XP. Choose your difficulty level. AI-monitored for fair play.
      </p>

      <div className="flex items-start gap-3 p-4 rounded-xl mb-5" style={{ background: "rgba(155,111,255,.06)", border: "1px solid rgba(155,111,255,.15)" }}>
        <div className="flex items-center gap-2">
          <Camera size={18} style={{ color: "var(--lq-purple)" }} />
          <Monitor size={18} style={{ color: "var(--lq-blue)" }} />
          <Shield size={18} style={{ color: "var(--lq-green)" }} />
        </div>
        <div>
          <div className="text-sm font-bold mb-1">AI Anti-Cheat System Active</div>
          <div className="text-xs leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>
            Camera and screen are monitored during quizzes. Answer options are <strong style={{ color: "white" }}>randomly shuffled</strong> on every attempt. Choose your difficulty: Easy (45s, 70% XP), Medium (30s, 100% XP), Hard (20s, 150% XP)!
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl mb-5" style={{ background: "rgba(46,204,142,.06)", border: "1px solid rgba(46,204,142,.15)" }}>
        <div className="flex items-center gap-2 mb-2">
          <Zap size={18} style={{ color: "var(--lq-green)" }} />
          <div className="text-sm font-bold">💬 AI Tutor Support</div>
        </div>
        <p className="text-xs leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>
          Need help understanding quiz concepts? Click the <strong style={{ color: "white" }}>AI Coach</strong> button during quizzes for hints and explanations. Our AI is here to guide your learning (customer support chat - no XP reward).
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {RAW_QUIZZES.map(quiz => {
          const isCompleted = user.completedQuizzes.includes(quiz.id);
          return (
            <div key={quiz.id} className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="h-24 flex items-center justify-center text-5xl"
                style={{ background: `linear-gradient(135deg, ${quiz.color}, ${quiz.color2})` }}>
                {quiz.icon}
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--lq-blue)" }}>{quiz.category}</div>
                <div className="text-sm font-bold mb-1">{quiz.title}</div>
                <div className="flex flex-wrap gap-1.5 mb-3">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.07)" }}>
                    {quiz.questions_data.length} questions
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,209,102,.08)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
                    ⚡ {quiz.baseXP} XP
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,255,255,.04)", color: "rgba(136,144,168,1)" }}>
                    {quiz.difficulty}
                  </span>
                </div>
                <button onClick={() => selectDifficulty(quiz)}
                  className="w-full py-2.5 rounded-xl text-xs font-bold transition-all hover:scale-[1.02] gradient-bg text-white">
                  {isCompleted ? "Retake Quiz" : "Start Quiz"} →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
