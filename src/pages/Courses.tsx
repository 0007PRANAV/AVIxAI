import { useState } from "react";
import { Link } from "wouter";
import { BookOpen, Lock, CheckCircle, Play, Bot, X, Send, Lightbulb, HelpCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

const COURSES = [
  { id: "js-fundamentals", name: "JavaScript Fundamentals", icon: "🌐", cat: "Web Dev", lessons: 24, xpPer: "15–35", desc: "Master the language of the web through 24 interactive challenges and real coding exercises.", progress: 38, locked: false, xpGate: 0, price: "Free", color: "#0D1F3C", color2: "#1A3A6B" },
  { id: "react-course", name: "React — Zero to Prod", icon: "⚛️", cat: "Frontend", lessons: 32, xpPer: "20–40", desc: "Build production-ready React apps. Hooks, Context, Redux, and real-world projects.", progress: 0, locked: true, xpGate: 2000, price: "₹499", color: "#1A0D3C", color2: "#3A1A6B" },
  { id: "ai-prompts", name: "Prompt Engineering", icon: "🤖", cat: "AI/ML", lessons: 18, xpPer: "15–30", desc: "Learn to communicate with AI models effectively. Build AI-powered apps and workflows.", progress: 0, locked: false, xpGate: 0, price: "₹299", color: "#0D2A1E", color2: "#1A5A3C" },
  { id: "python-data", name: "Python for Data Science", icon: "📊", cat: "Data Science", lessons: 28, xpPer: "25–50", desc: "NumPy, Pandas, Matplotlib, and real datasets. Go from zero to data analyst.", progress: 0, locked: true, xpGate: 3500, price: "₹399", color: "#2A1A0D", color2: "#5A3A1A" },
  { id: "figma-design", name: "UI/UX with Figma", icon: "🎨", cat: "Design", lessons: 22, xpPer: "20–35", desc: "Design beautiful, user-first interfaces. Prototyping, auto-layout, and design systems.", progress: 0, locked: true, xpGate: 5000, price: "₹349", color: "#2A0D1A", color2: "#5A1A3A" },
  { id: "social-growth", name: "Social Media Growth", icon: "📱", cat: "Marketing", lessons: 16, xpPer: "10–25", desc: "Algorithms, content strategy, analytics, and building a personal brand from scratch.", progress: 0, locked: false, xpGate: 0, price: "Free", color: "#0D2A2A", color2: "#1A5A5A" },
  { id: "node-backend", name: "Node.js Backend Dev", icon: "⚙️", cat: "Backend", lessons: 30, xpPer: "25–45", desc: "REST APIs, Express, authentication, databases, and deploying Node.js applications.", progress: 0, locked: true, xpGate: 2500, price: "₹449", color: "#0D1F3C", color2: "#1A2A5A" },
  { id: "ml-basics", name: "Machine Learning Basics", icon: "🧠", cat: "AI/ML", lessons: 24, xpPer: "30–60", desc: "Supervised, unsupervised learning, neural nets — with Python and real models you build.", progress: 0, locked: true, xpGate: 4000, price: "₹549", color: "#1A0D3C", color2: "#2A1A5A" },
  { id: "docker-devops", name: "Docker & DevOps", icon: "🐳", cat: "DevOps", lessons: 20, xpPer: "20–40", desc: "Containers, CI/CD pipelines, GitHub Actions, and deploying apps to the cloud.", progress: 0, locked: true, xpGate: 6000, price: "₹499", color: "#0D2A2A", color2: "#0D3A4A" },
  { id: "typescript", name: "TypeScript Mastery", icon: "💙", cat: "Frontend", lessons: 20, xpPer: "20–40", desc: "Type safety, interfaces, generics, and using TypeScript in real React + Node.js projects.", progress: 0, locked: true, xpGate: 2200, price: "₹399", color: "#0D1A3C", color2: "#1A2A6B" },
  { id: "nextjs", name: "Next.js Full Stack", icon: "▲", cat: "Frontend", lessons: 28, xpPer: "25–50", desc: "SSR, SSG, API routes, and deploying full-stack apps on Vercel. The modern web stack.", progress: 0, locked: true, xpGate: 3000, price: "₹549", color: "#161616", color2: "#2A2A2A" },
  { id: "sql-databases", name: "SQL & Databases", icon: "🗄️", cat: "Backend", lessons: 22, xpPer: "20–40", desc: "Relational databases, SQL queries, joins, indexes, and PostgreSQL in real projects.", progress: 0, locked: false, xpGate: 0, price: "₹299", color: "#0D2A1E", color2: "#1A4A2A" },
  { id: "cybersecurity", name: "Cybersecurity Basics", icon: "🔒", cat: "Security", lessons: 18, xpPer: "25–50", desc: "OWASP Top 10, ethical hacking concepts, secure coding practices, and CTF challenges.", progress: 0, locked: true, xpGate: 3500, price: "₹449", color: "#1A0D0D", color2: "#3A1A1A" },
  { id: "cloud-aws", name: "Cloud with AWS", icon: "☁️", cat: "DevOps", lessons: 26, xpPer: "30–60", desc: "EC2, S3, Lambda, RDS, and building scalable apps on Amazon Web Services.", progress: 0, locked: true, xpGate: 5500, price: "₹599", color: "#1A1A0D", color2: "#3A3A1A" },
  { id: "graphql", name: "GraphQL APIs", icon: "⬡", cat: "Backend", lessons: 16, xpPer: "20–40", desc: "Schema design, resolvers, queries, mutations, and integrating GraphQL with React.", progress: 0, locked: true, xpGate: 3200, price: "₹349", color: "#1A0D2A", color2: "#2A1A3C" },
];

// AI Tutor Responses - Hints and guidance without direct answers
const AI_TUTOR_RESPONSES: Record<string, string[]> = {
  "js-fundamentals": [
    "Think of JavaScript variables as containers for storing data values. Consider what type of data you're working with.",
    "Remember: functions are first-class citizens in JavaScript. How can you use functions to organize your code better?",
    "For loops - consider the three parts: initialization, condition, and increment. What's your starting point and end goal?",
    "Arrays have powerful built-in methods. Methods like map(), filter(), and reduce() can simplify your code significantly.",
    "Objects in JavaScript are collections of key-value pairs. Think about what properties best describe your data.",
    "Closure is about scope and function bundling. Ask yourself: what variables does this function have access to?",
  ],
  "react-course": [
    "State in React should be minimal and essential. Ask: 'Is this data changing over time? Does it affect the UI?'",
    "useEffect handles side effects. Consider what dependencies your effect relies on to avoid unnecessary re-renders.",
    "Props flow down (unidirectional data flow). If a child needs to modify parent data, callbacks passed via props are the way.",
    "Keys in lists help React identify items. Use stable, unique identifiers rather than array indices when possible.",
    "Context API shines when you have deeply nested components needing the same data. Avoid prop drilling where it hurts readability.",
    "Hooks must follow rules: only call at top level, only from React functions. Think about why these rules exist.",
  ],
  "python-data": [
    "Pandas DataFrames are powerful for data manipulation. Remember: rows are observations, columns are variables.",
    "NumPy arrays are more memory-efficient than Python lists. Consider when you need vectorized operations.",
    "Data cleaning is often 80% of the work. Look for missing values, duplicates, and type inconsistencies first.",
    "Matplotlib and Seaborn are your visualization friends. The right chart reveals insights that tables hide.",
    "Correlation doesn't imply causation. Always ask: what's the story behind the statistical relationship?",
    "Machine learning models need clean, prepared data. Feature engineering often matters more than algorithm choice.",
  ],
  "ai-prompts": [
    "Prompt engineering is about clear communication. Be specific about what you want, how you want it, and why.",
    "Context matters. Give the AI enough background to understand your domain and constraints.",
    "Chain-of-thought prompting helps with complex tasks. Break down multi-step problems into clear stages.",
    "Temperature and top-p control creativity vs determinism. Higher values = more creative, lower = more focused.",
    "Few-shot learning via examples in prompts can dramatically improve output quality.",
    "System prompts set the behavior and constraints. Think of them as the AI's operating instructions.",
  ],
  "node-backend": [
    "Express middleware processes requests in order. Consider: what needs to happen before your route handler?",
    "REST API design follows HTTP semantics. GET for retrieval, POST for creation, PUT/PATCH for updates, DELETE for removal.",
    "Async/await makes asynchronous code readable. Remember to handle errors with try/catch blocks.",
    "Database connections should be managed carefully. Connection pooling prevents resource exhaustion.",
    "Environment variables store sensitive config. Never commit secrets to your repository.",
    "JWT tokens carry authentication state. Keep payloads small and expiry times reasonable.",
  ],
  default: [
    "Break down complex problems into smaller, manageable steps. What's the first thing you need to figure out?",
    "Think about the fundamental concepts involved here. Review the core principles from the lesson material.",
    "Sometimes walking away and coming back with fresh eyes helps. Your brain continues processing in the background.",
    "Consider edge cases and boundary conditions. What happens at the extremes of your input or situation?",
    "Documentation is your friend. Official docs often have examples that illuminate common use cases.",
    "Practice makes permanent. Consider building a small project to apply these concepts in a real context.",
  ],
};

interface AITutorMessage {
  id: string;
  role: "ai" | "user";
  text: string;
  time: string;
}

function getCourseTutorResponse(courseId: string, question: string): string {
  const responses = AI_TUTOR_RESPONSES[courseId] || AI_TUTOR_RESPONSES.default;
  const lowerQ = question.toLowerCase();

  // Try to give contextually relevant hint
  if (lowerQ.includes("loop") || lowerQ.includes("for") || lowerQ.includes("while")) {
    return "When working with loops, think about: 1) Where do you start? 2) When do you stop? 3) How do you move forward? Break it down step by step.";
  }
  if (lowerQ.includes("function") || lowerQ.includes("call")) {
    return "Functions encapsulate reusable logic. Consider: What input does it need? What output should it produce? What's its single responsibility?";
  }
  if (lowerQ.includes("error") || lowerQ.includes("bug") || lowerQ.includes("not working")) {
    return "Debugging is systematic. Check: 1) Syntax errors first, 2) Variable values at each step, 3) Expected vs actual behavior. Use console.log() strategically.";
  }
  if (lowerQ.includes("state") || lowerQ.includes("react")) {
    return "State represents data that changes over time. Ask yourself: Does this data need to persist between renders? Who should own this state?";
  }
  if (lowerQ.includes("api") || lowerQ.includes("fetch") || lowerQ.includes("request")) {
    return "APIs are conversations. Check: 1) Is your endpoint correct? 2) Are headers properly set? 3) Handle both success and error responses gracefully.";
  }
  if (lowerQ.includes("css") || lowerQ.includes("style") || lowerQ.includes("layout")) {
    return "CSS issues? 1) Check the element exists, 2) Verify selectors match, 3) Inspect computed styles in DevTools, 4) Watch for specificity conflicts.";
  }
  if (lowerQ.includes("help") || lowerQ.includes("stuck") || lowerQ.includes("understand")) {
    return "I'm here to guide, not give answers. Let's break this down: What specific concept is confusing? What have you tried? What did you expect vs what happened?";
  }

  // Random but consistent response based on question length
  const idx = question.length % responses.length;
  return responses[idx];
}

export default function Courses() {
  const { user, enrollCourse, addXP } = useApp();
  const [filter, setFilter] = useState<"all" | "enrolled" | "unlocked" | "locked">("all");
  const [aiTutorOpen, setAiTutorOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof COURSES[0] | null>(null);
  const [aiMessages, setAiMessages] = useState<AITutorMessage[]>([]);
  const [aiInput, setAiInput] = useState("");

  const filtered = COURSES.filter(c => {
    if (filter === "enrolled") return user.enrolledCourses.includes(c.id);
    if (filter === "unlocked") return !c.locked || user.xp >= c.xpGate;
    if (filter === "locked") return c.locked && user.xp < c.xpGate;
    return true;
  });

  function handleEnroll(course: typeof COURSES[0]) {
    if (course.locked && user.xp < course.xpGate) {
      showXPToast("🔒", `Need ${course.xpGate.toLocaleString()} XP to unlock this course`, "#FF4D4D");
      return;
    }
    if (user.enrolledCourses.includes(course.id)) {
      showXPToast("✅", "You are already enrolled in this course!", "#2ECC8E");
      return;
    }
    enrollCourse(course.id);
    showXPToast("🎉", `Enrolled in ${course.name}! +30 XP`, "#2ECC8E");
  }

  function openAITutor(course: typeof COURSES[0]) {
    setSelectedCourse(course);
    setAiTutorOpen(true);
    if (aiMessages.length === 0) {
      const welcomeMsg: AITutorMessage = {
        id: `welcome-${Date.now()}`,
        role: "ai",
        text: `Hi! I'm your AI tutor for ${course.name}. I can provide hints, explain concepts, and guide your thinking without giving direct answers. What would you like help with?`,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setAiMessages([welcomeMsg]);
    }
  }

  function sendAIMessage() {
    if (!aiInput.trim() || !selectedCourse) return;

    const userMsg: AITutorMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: aiInput,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setAiMessages(prev => [...prev, userMsg]);
    const question = aiInput;
    setAiInput("");

    // Simulate AI thinking and responding
    setTimeout(() => {
      const response = getCourseTutorResponse(selectedCourse.id, question);
      const aiResponse: AITutorMessage = {
        id: `ai-${Date.now()}`,
        role: "ai",
        text: response,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setAiMessages(prev => [...prev, aiResponse]);
      // AI tutor support - no XP reward
    }, 800);
  }

  return (
    <div>
      <div className="mb-1">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <BookOpen size={22} style={{ color: "var(--lq-blue)" }} /> All Courses
        </h1>
      </div>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        {COURSES.length} courses across Web Dev, AI/ML, Data Science, DevOps, and more. XP gates unlock as you progress. Each course has an AI tutor to guide your learning!
      </p>

      {/* Your XP Banner */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl mb-5 text-sm"
        style={{ background: "rgba(255,209,102,.05)", border: "1px solid rgba(255,209,102,.12)" }}>
        💡 <strong style={{ color: "var(--lq-yellow)" }}>Your XP: {user.xp.toLocaleString()}</strong>
        <span style={{ color: "rgba(136,144,168,1)" }}>
          — {user.xp < 2000 ? `Earn ${(2000 - user.xp).toLocaleString()} more XP to unlock React.` : user.xp < 3500 ? `Earn ${(3500 - user.xp).toLocaleString()} more to unlock Python.` : "Great progress! Many courses are now available."}
        </span>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {(["all", "enrolled", "unlocked", "locked"] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
            style={filter === f
              ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }
              : { color: "rgba(136,144,168,1)", background: "rgba(255,255,255,.03)" }
            }
          >
            {f} {f === "all" ? `(${COURSES.length})` : f === "enrolled" ? `(${user.enrolledCourses.length})` : ""}
          </button>
        ))}
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(course => {
          const isEnrolled = user.enrolledCourses.includes(course.id);
          const isLocked = course.locked && user.xp < course.xpGate;

          return (
            <div
              key={course.id}
              className="rounded-2xl overflow-hidden transition-all hover:-translate-y-1"
              style={{ background: "rgba(15,20,34,1)", border: `1px solid ${isLocked ? "rgba(255,255,255,0.07)" : isEnrolled ? "rgba(46,204,142,.2)" : "rgba(79,142,247,.15)"}` }}
            >
              {/* Banner */}
              <div className="h-28 flex items-center justify-center text-5xl relative"
                style={{ background: `linear-gradient(135deg, ${course.color}, ${course.color2})` }}>
                {course.icon}
                {isLocked && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-1"
                    style={{ background: "rgba(8,11,20,.7)", backdropFilter: "blur(2px)" }}>
                    <Lock size={28} style={{ color: "rgba(136,144,168,1)" }} />
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,209,102,.1)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
                      {course.xpGate.toLocaleString()} XP needed
                    </span>
                  </div>
                )}

                {/* AI Tutor Button */}
                <button
                  onClick={() => openAITutor(course)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center transition-transform hover:scale-110"
                  style={{ background: "rgba(255,255,255,.15)", backdropFilter: "blur(4px)" }}
                  title="Ask AI Tutor"
                >
                  <Bot size={16} style={{ color: "white" }} />
                </button>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--lq-blue)" }}>{course.cat}</div>
                <div className="text-sm font-bold mb-1">{course.name}</div>
                <div className="text-xs mb-2 leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>{course.desc}</div>
                <div className="text-xs mb-2" style={{ color: "rgba(90,96,122,1)" }}>{course.lessons} lessons · ⚡ {course.xpPer} XP each</div>

                {/* Status badge */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {isEnrolled ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(46,204,142,.08)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }}>
                      ✅ In progress
                    </span>
                  ) : isLocked ? (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(255,209,102,.08)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
                      🔒 {course.xpGate.toLocaleString()} XP needed
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(46,204,142,.08)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }}>
                      ✅ Unlocked
                    </span>
                  )}
                </div>

                {/* Progress bar (if enrolled) */}
                {isEnrolled && course.progress > 0 && (
                  <div className="mb-3">
                    <div className="flex justify-between text-[10px] mb-1">
                      <span style={{ color: "rgba(136,144,168,1)" }}>Progress</span>
                      <span style={{ color: "var(--lq-blue)" }}>{course.progress}%</span>
                    </div>
                    <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                      <div className="h-full rounded-full" style={{ width: `${course.progress}%`, background: "linear-gradient(90deg, var(--lq-blue), var(--lq-purple))" }} />
                    </div>
                  </div>
                )}

                {/* AI Tutor mini-button for enrolled courses */}
                {isEnrolled && (
                  <button
                    onClick={() => openAITutor(course)}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold mb-2 transition-all"
                    style={{ background: "rgba(155,111,255,.08)", color: "var(--lq-purple)", border: "1px solid rgba(155,111,255,.2)" }}
                  >
                    <Bot size={10} /> Ask AI Tutor
                  </button>
                )}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
                <span className="text-sm font-bold" style={{ color: course.price === "Free" ? "var(--lq-green)" : "rgba(136,144,168,1)" }}>
                  {isEnrolled ? "✓ Enrolled" : course.price}
                </span>
                {isEnrolled ? (
                  <div className="flex gap-2">
                    <button
                      onClick={() => openAITutor(course)}
                      className="flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[10px] font-bold transition-all"
                      style={{ background: "rgba(155,111,255,.1)", color: "var(--lq-purple)", border: "1px solid rgba(155,111,255,.2)" }}
                    >
                      <HelpCircle size={10} /> Tutor
                    </button>
                    <Link href="/quizzes">
                      <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }}>
                        <Play size={11} /> Continue
                      </button>
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={() => handleEnroll(course)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
                    style={isLocked
                      ? { background: "rgba(255,255,255,.04)", color: "rgba(90,96,122,1)", border: "1px solid rgba(255,255,255,0.07)", cursor: "not-allowed" }
                      : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "white", border: "none" }
                    }
                  >
                    {isLocked ? "Locked" : "Enroll Now"}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* AI Tutor Modal */}
      {aiTutorOpen && selectedCourse && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center md:justify-center"
          onClick={() => setAiTutorOpen(false)}
        >
          <div className="w-full md:w-[500px] h-[500px] md:h-[550px] rounded-t-2xl md:rounded-2xl flex flex-col overflow-hidden"
            style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.1)" }}
            onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="flex items-center justify-between p-4" style={{ background: "linear-gradient(135deg, rgba(155,111,255,.15), rgba(79,142,247,.15))", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg"
                  style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }}>
                  🤖
                </div>
                <div>
                  <div className="text-sm font-bold">AI Tutor</div>
                  <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{selectedCourse.name}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-1 rounded-full"
                  style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }}>
                  <Lightbulb size={10} className="inline mr-1" />Hint Mode
                </span>
                <button onClick={() => setAiTutorOpen(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "380px" }}>
              <div className="p-3 rounded-lg text-xs" style={{ background: "rgba(255,209,102,.08)", border: "1px solid rgba(255,209,102,.15)", color: "rgba(255,209,102,1)" }}>
                💡 <strong>Hint Mode Active:</strong> I provide guidance and explain concepts to help you learn, but won't give direct answers. Try solving it yourself first!
              </div>

              {aiMessages.map(msg => (
                <div key={msg.id} className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold"
                    style={msg.role === "ai"
                      ? { background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }
                      : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-teal))" }
                    }>
                    {msg.role === "ai" ? "🤖" : user.name[0]}
                  </div>
                  <div style={{ maxWidth: "75%" }}>
                    <div
                      className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                      style={msg.role === "ai"
                        ? { background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)", borderTopLeftRadius: "4px" }
                        : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", borderTopRightRadius: "4px" }
                      }
                    >
                      {msg.text}
                    </div>
                    <div className="text-[9px] mt-1 px-1" style={{ color: "rgba(90,96,122,1)", textAlign: msg.role === "user" ? "right" : "left" }}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input */}
            <div className="flex gap-2 p-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendAIMessage()}
                placeholder="Ask for hints or concept explanations..."
                className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
                style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.13)", color: "white" }}
              />
              <button
                onClick={sendAIMessage}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 gradient-bg"
              >
                <Send size={16} style={{ color: "white" }} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
