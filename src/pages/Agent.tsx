import { useState, useRef, useEffect } from "react";
import { Send, Bot, Zap, Briefcase, BookOpen, BarChart, Target } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

interface Message {
  id: string;
  role: "bot" | "user";
  text: string;
  time: string;
}

const RESPONSE_POOL: Record<string, string[]> = {
  skill: [
    "Looking at your progress, your **JavaScript** fundamentals are solid — you're in the top 20% for beginners at your level. Your next power move? Dive into **React.js**. Once you finish that, your skill graph becomes genuinely hireable. Companies like to see React + JS together.",
    "Your skill profile is taking shape! Based on quiz scores, you're strongest in **HTML & CSS** (85%) and growing fast in **JavaScript** (68%). That gap between JS and React is actually your biggest opportunity right now. Closing it could double your job match count overnight.",
    "I ran your profile against 500+ job listings — here's what stands out. You have strong **foundations** but hirers want to see one more layer. **React** or **Node.js** would make you stand out. Honestly, React first — it's mentioned in 73% of the roles you qualify for.",
    "Your skill trajectory is impressive for someone at Level 4. The data shows you're consistent — that matters more than raw scores. Right now your **JavaScript** is your hero skill. Level it up with a project and put it on your portfolio. That's what turns 'maybe' to 'yes' for recruiters.",
    "Quick skill audit: ⚡ JavaScript (68%), 🎨 HTML/CSS (85%), ⚛️ React (35%), 🔀 Git (72%). The React score is the outlier. If you completed just 3 more modules in the React course, that number would jump to ~55% — enough to apply for junior frontend roles with confidence.",
  ],
  job: [
    "You have **8 confirmed job matches** right now! The strongest one is the Web Developer internship at Freelancer Platform — 98% match, fully remote. You could apply today and have a solid shot. Want me to walk you through the best way to frame your AVIxAI progress in the application?",
    "Fresh intel on the job market for your profile: Junior Frontend Developer roles in Bangalore are booming right now. The average salary for someone at your skill level is ₹4–6L, but if you land React before applying, that jumps to ₹6–9L. That's a significant delta for one course.",
    "Your top match right now is the **Web Dev Intern** role at Freelancer Platform. 98% match, ₹15K/month, and fully remote. It's a great first job because remote work forces you to communicate in writing — a skill that compounds forever. Shall I break down exactly what they're looking for?",
    "I looked at your job matches and I want to flag something: **3 of your 8 matches** are at companies that specifically list 'AVIxAI-certified' as a preferred qualification. That means your certificate from this platform has real weight in the market right now.",
    "Based on your skills today, the sweet spot is **Junior Frontend** or **Web Developer Intern** roles. 6 companies are actively hiring and your match scores are strong. Here's the thing — 2 of those companies are also on the 'Hire Talent' tab, which means they're actively scouting LearnQuest learners.",
  ],
  resume: [
    "Your resume is estimated to be **72% optimized** based on your profile completion. Three quick wins: 1) Add your AVIxAI certificate once you finish JavaScript Fundamentals, 2) List your quiz percentile score (top 20%), 3) Include the GitHub link from your portfolio. Each of these takes 5 minutes and meaningfully improves callbacks.",
    "One pattern I see in resumes that get callbacks vs. those that don't: **specificity**. Instead of 'knows JavaScript', write 'Built a React to-do app using useState and localStorage (GitHub link)'. Your LearnQuest XP and certificates give you specific, verifiable proof — use them!",
    "Resume tip that most people overlook: your **AVIxAI streak** is a soft-skills signal. Saying 'maintained a 12-day learning streak while working on JS fundamentals' shows discipline. Recruiters at startups love this kind of self-motivation proof.",
    "Let me be direct — your resume is good for where you are, but it has one critical gap: **no projects listed**. Portfolio projects are the #1 thing that separates hired from rejected for junior dev roles. Even a simple to-do app or weather widget on GitHub is enough. Want tips on building one fast?",
    "Good news: the LearnQuest certificate you'll earn is recognized by **23 companies** in our hiring network. Bad news: your contact section needs updating — no LinkedIn or GitHub means recruiters can't reach you easily. Fill those in your profile settings today — it's a 2-minute change with real impact.",
  ],
  salary: [
    "Based on your current skills and your local market (India), here's the honest picture: **₹3.5–5L/year** as a fresher with HTML/CSS + JavaScript. Add React and that moves to **₹5.5–8L**. Add Node.js and you're looking at **₹7–12L** for full-stack roles. Each skill you add is worth real money.",
    "Salary reality check: the market is paying a premium right now for React devs. A developer with React + JavaScript + a portfolio project is commanding **₹6–9L** in Tier 1 cities. Remote roles from international companies can go even higher. Your current path is heading there — you're 1-2 courses away.",
    "Your current skill set puts you in the **₹3.5–6L bracket** for India. But here's something most people don't know: companies in the EdTech and SaaS sectors pay 20–30% more than traditional IT companies for frontend roles. And they actively recruit from platforms like LearnQuest.",
    "Let me give you the progression map: **Now** (JS + HTML/CSS) → ₹3.5–5L. **3 months** (add React) → ₹5.5–8L. **6 months** (add Node.js + portfolio) → ₹8–13L. **1 year** (full-stack + 1 year experience) → ₹12–20L. The XP you're earning here maps directly to salary bands.",
    "Honestly? The salary conversation is early for your current level — but in a good way. You're building a foundation that will make that negotiation much stronger. One thing I'd add: **freelancing** while learning can earn you ₹500–2000/hour even at your current level. It's faster than waiting for a full-time offer.",
  ],
  interview: [
    "Interview prep for your target roles — the questions that almost always come up: 1) **'What is the difference between var, let, and const?'** 2) **'Explain the event loop in JavaScript'** 3) **'What are React hooks and why were they introduced?'** 4) **'How does CSS specificity work?'** Your quiz scores show gaps in #2 and #3 — let's drill those.",
    "For junior frontend interviews, technical rounds have one secret: they're not testing if you know the answer. They're testing if you can **think out loud clearly**. Saying 'I'm not sure, but I'd approach it by...' and reasoning through it is often better than a memorized answer. Your communication matters as much as your code.",
    "Based on your skill level, here are the 3 most likely interview scenarios you'll face: 1) **Live coding** (usually FizzBuzz or array manipulation — you can handle this), 2) **Conceptual Q&A** (closures, async/await — study these), 3) **Portfolio walkthrough** (you need something on GitHub). Which of these do you want to prep for first?",
    "Real talk about your upcoming interviews: The companies in your match list are mostly startups and EdTech firms. They usually care less about CS theory and more about **'can you build stuff quickly?'** Having a deployed project — even a simple one — will carry more weight than being able to explain Big O notation.",
    "Interview mindset shift: most developers fail not because of technical gaps, but because they **freeze under pressure**. Here's what actually helps: do 1 LeetCode Easy per day, practice explaining your code out loud to yourself or a friend, and prepare 3 stories about projects you've worked on (even small ones). That's 80% of what's needed.",
  ],
  learn: [
    "Looking at your current pace, you're averaging about **3 lessons per week** — that's consistent, but here's how to accelerate: block 25 minutes every morning before checking your phone. Morning learning has been shown to have 40% better retention than evening sessions. Your streak is proof you can maintain it.",
    "Your fastest path to job-ready: **JavaScript → React → 1 project → apply**. Don't skip to advanced topics yet. The learners who get hired fastest are the ones who go deep on fundamentals, not wide across many languages. You're on the right track — keep the depth.",
    "Here's a learning hack that works for technical skills: after each lesson, write one sentence explaining what you learned as if you're explaining it to a friend. This 'Feynman Technique' dramatically improves retention. Your quiz scores would likely jump 15–20% if you tried this for just one week.",
    "You're at a pivotal point in your learning curve. Level 4 is where most learners plateau — not because they're stuck, but because the easy wins are done. Push through the React course this week even if it feels hard. The difficulty spike is temporary; the skill gain is permanent.",
    "I analyzed 1,000+ learner paths on LearnQuest. The ones who land jobs in under 6 months share one thing: they build something while learning, not after. Even a rough first project while doing the React course beats a polished project 3 months later. Start messy — ship something!",
  ],
  default: [
    "Great question — that's the kind of thinking that separates learners who grow from those who plateau. Let me help you think through it. You can ask me about your **skills** analysis, **job** matches, **resume** optimization, **salary** expectations, **interview** prep, or **learning** strategy. What's most pressing for you right now?",
    "I'm tuned to help with your career growth on LearnQuest. You can ask me about **skills** (what to build next), **jobs** (what matches you), **resume** (how to optimize yours), **salary** (realistic expectations), **interview** tips, or **learning** path guidance. Each one of these is an area where I have your data and can give you personalized advice.",
    "That's something I'd love to dig into with you! For the most helpful answer, try being specific — for example: 'What skills should I focus on for a frontend role?' or 'How do I prepare for a React interview?' or 'What's my realistic salary range?' The more context, the sharper my advice.",
    "Interesting point! As your AI coach, I can give you the most value when we stay focused on your career path. Ask me about your **skill gaps**, **job market** situation, **resume** improvements, **salary data**, or **interview prep**. I've analyzed your profile and have specific, actionable things to share on each of these.",
    "You've got the right instinct to seek advice — most learners just wing it. I can help with data-backed career guidance. Try asking: 'What job should I target with my current skills?' or 'Is my profile ready to apply?' or 'What should I study next month?' I'll give you a direct, honest answer.",
  ],
  career: [
    "Your career roadmap from where you are today: **Month 1** — Finish JS Fundamentals + start React. **Month 2** — Complete React + build 1 project. **Month 3** — Apply to 10 junior roles + freelance 1 small project. **Month 4–6** — Interview loops + negotiate offer. This is a realistic, achievable path based on your current pace.",
    "Looking at your learning data, you're **2–3 months** away from a hireable profile if you maintain current momentum. The gap isn't skills — it's proof. Build one real project, put it on GitHub, and your application conversion rate will jump from ~5% to ~25%. That's the single most impactful thing you can do.",
    "Career advice that most people get wrong: don't wait until you 'feel ready' to apply. Start applying at 70% ready. Interviews are the best learning tool there is — you'll learn more about what employers want in 3 interviews than in 3 months of solo studying.",
    "Your career trajectory is strong for your level. The one thing I'd change: **network more actively**. The LearnQuest community has people who are 1–2 years ahead of you and can refer you to roles. Post in Community, share your progress publicly, and DM people at companies you want to work at. Referrals convert 5x better than cold applications.",
    "Here's the career truth no one tells you: your first job doesn't need to be perfect. It needs to be **real**. Get any legitimate dev job in the next 6 months — even if it's not exactly what you dreamed of. From there, the second job is 10x easier to get and usually 2x the pay. Step on the ladder first.",
  ],
};

const QUICK_TOPICS = [
  { label: "📊 Skill Analysis", key: "skill" },
  { label: "💼 Job Matches", key: "job" },
  { label: "📄 Resume Tips", key: "resume" },
  { label: "💰 Salary Guide", key: "salary" },
  { label: "🎤 Interview Prep", key: "interview" },
];

const AGENT_CATEGORIES = [
  { label: "Career Planning", topics: ["Career roadmap", "Goal setting", "Timeline planning"] },
  { label: "Job Hunt", topics: ["Job search tips", "Application strategy", "Networking"] },
  { label: "Learning Path", topics: ["What to study", "Course order", "Time management"] },
  { label: "Skills & Certs", topics: ["Skill gaps", "Certificates value", "Portfolio building"] },
];

const responseCounters: Record<string, number> = {};

function getResponse(text: string): string {
  const lower = text.toLowerCase();
  let matchedKey = "default";
  const keywordMap: Record<string, string> = {
    skill: "skill", ability: "skill", strength: "skill", proficiency: "skill", competency: "skill",
    job: "job", work: "job", position: "job", role: "job", opportunity: "job", career: "career",
    resume: "resume", cv: "resume", portfolio: "resume", application: "resume",
    salary: "salary", pay: "salary", wage: "salary", money: "salary", earn: "salary", income: "salary",
    interview: "interview", prep: "interview", question: "interview", practice: "interview",
    learn: "learn", study: "learn", course: "learn", lesson: "learn", path: "learn",
  };
  for (const [keyword, key] of Object.entries(keywordMap)) {
    if (lower.includes(keyword)) { matchedKey = key; break; }
  }
  const pool = RESPONSE_POOL[matchedKey] || RESPONSE_POOL.default;
  const counter = responseCounters[matchedKey] || 0;
  const idx = (counter + Math.floor(Math.random() * pool.length)) % pool.length;
  responseCounters[matchedKey] = (counter + 1) % pool.length;
  return pool[idx];
}

function getTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

const INITIAL_MESSAGES: Message[] = [
  {
    id: "1",
    role: "bot",
    text: "Hey Pranav! 👋 I'm **Aria**, your personal AI Career Coach.\n\nI've analyzed your learning data — you're at Level 4 with a 12-day streak and 1,240 XP. That's real momentum.\n\nI can help with skill analysis, job matching, resume optimization, salary insights, interview prep, and career planning. What's on your mind today?",
    time: getTime(),
  },
];

export default function Agent() {
  const { user, addXP } = useApp();
  const [messages, setMessages] = useState<Message[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [selectedCat, setSelectedCat] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  function sendMessage(text?: string) {
    const msg = text || input.trim();
    if (!msg) return;
    setInput("");
    const userMsg: Message = { id: Date.now().toString(), role: "user", text: msg, time: getTime() };
    setMessages(prev => [...prev, userMsg]);
    setTyping(true);
    const delay = 1000 + Math.random() * 1200;
    setTimeout(() => {
      const response = getResponse(msg);
      const botMsg: Message = { id: (Date.now() + 1).toString(), role: "bot", text: response, time: getTime() };
      setMessages(prev => [...prev, botMsg]);
      setTyping(false);
    }, delay);
  }

  function renderText(text: string) {
    return text.split("\n").map((line, i) => {
      const parts = line.split(/(\*\*[^*]+\*\*)/g);
      return (
        <p key={i} style={{ marginBottom: "0.3rem" }}>
          {parts.map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return <strong key={j} style={{ color: "var(--lq-blue)" }}>{part.slice(2, -2)}</strong>;
            }
            return part;
          })}
        </p>
      );
    });
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Bot size={22} style={{ color: "var(--lq-purple)" }} /> AI Career Agent
      </h1>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        Personalized career guidance powered by AI. Aria analyzes your XP, skills, and market data to help you grow.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr] gap-4 lg:h-[calc(100vh-200px)] lg:min-h-[500px]" style={{ minHeight: "500px" }}>
        {/* Agent Sidebar */}
        <div className="hidden lg:flex flex-col gap-3 overflow-y-auto">
          <div className="p-4 rounded-2xl text-center" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 agent-glow"
              style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))", border: "3px solid rgba(155,111,255,.3)" }}>
              🤖
            </div>
            <div className="text-base font-black mb-0.5">Aria</div>
            <div className="text-xs mb-2" style={{ color: "rgba(136,144,168,1)" }}>AI Career Coach</div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold"
              style={{ background: "rgba(46,204,142,.1)", border: "1px solid rgba(46,204,142,.2)", color: "var(--lq-green)" }}>
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lq-green)", animation: "urgentPulse 1.5s infinite" }} />
              Online 24/7
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {[
              { icon: <Zap size={14} style={{ color: "var(--lq-blue)" }} />, value: user.xp.toLocaleString(), label: "Your XP" },
              { icon: <BookOpen size={14} style={{ color: "var(--lq-purple)" }} />, value: user.enrolledCourses.length.toString(), label: "Courses" },
              { icon: <Briefcase size={14} style={{ color: "var(--lq-green)" }} />, value: "8", label: "Job matches" },
              { icon: <BarChart size={14} style={{ color: "var(--lq-orange)" }} />, value: "Top 15%", label: "Quiz score" },
            ].map((stat, i) => (
              <div key={i} className="p-2 rounded-xl text-center" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)" }}>
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <div className="text-sm font-black">{stat.value}</div>
                <div className="text-[9px]" style={{ color: "rgba(90,96,122,1)" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="p-3 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(90,96,122,1)" }}>Topics</div>
            <div className="space-y-1">
              {AGENT_CATEGORIES.map(cat => (
                <div key={cat.label}>
                  <button
                    onClick={() => setSelectedCat(selectedCat === cat.label ? null : cat.label)}
                    className="w-full text-left px-2.5 py-2 rounded-lg text-xs font-medium transition-all"
                    style={selectedCat === cat.label
                      ? { background: "rgba(155,111,255,.1)", border: "1px solid rgba(155,111,255,.25)", color: "var(--lq-purple)" }
                      : { background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(136,144,168,1)" }
                    }
                  >
                    {cat.label}
                  </button>
                  {selectedCat === cat.label && (
                    <div className="mt-1 ml-2 space-y-0.5">
                      {cat.topics.map(t => (
                        <button
                          key={t}
                          onClick={() => sendMessage(t)}
                          className="w-full text-left px-2 py-1 rounded text-[10px] transition-colors hover:text-white"
                          style={{ color: "rgba(90,96,122,1)" }}
                        >
                          → {t}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex flex-col rounded-2xl overflow-hidden" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg"
              style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }}>
              🤖
            </div>
            <div>
              <div className="text-sm font-bold">Aria — AI Career Coach</div>
              <div className="text-xs" style={{ color: "var(--lq-green)" }}>Online · Analyzing your profile...</div>
            </div>
            <div className="ml-auto text-xs font-bold px-2.5 py-1 rounded-full"
              style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }}>
              Online
            </div>
          </div>

          <div className="flex gap-2 px-4 pt-2 flex-wrap" style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
            {QUICK_TOPICS.map(t => (
              <button
                key={t.key}
                onClick={() => sendMessage(t.label.replace(/^[^\s]+\s/, ""))}
                className="px-2.5 py-1.5 rounded-full text-xs font-medium transition-all mb-2 hover:border-purple-400/50"
                style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "rgba(136,144,168,1)" }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3" style={{ maxHeight: "calc(100% - 160px)" }}>
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2.5 items-start ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 font-bold"
                  style={msg.role === "bot"
                    ? { background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }
                    : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-teal))" }
                  }>
                  {msg.role === "bot" ? "🤖" : user.name[0]}
                </div>
                <div style={{ maxWidth: "75%" }}>
                  <div
                    className="px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed"
                    style={msg.role === "bot"
                      ? { background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)", borderTopLeftRadius: "4px" }
                      : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", borderTopRightRadius: "4px" }
                    }
                  >
                    {renderText(msg.text)}
                  </div>
                  <div className="text-[9px] mt-1 px-1" style={{ color: "rgba(90,96,122,1)", textAlign: msg.role === "user" ? "right" : "left" }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex gap-2.5 items-start">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm"
                  style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }}>🤖</div>
                <div className="px-4 py-3 rounded-2xl" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)", borderTopLeftRadius: "4px" }}>
                  <div className="flex gap-1.5">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 rounded-full"
                        style={{ background: "rgba(90,96,122,1)", animation: `typingBounce 1.2s infinite ${i * 0.2}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="flex gap-2 px-4 py-3" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask Aria anything about your career..."
              className="flex-1 px-3.5 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.13)", color: "white" }}
            />
            <button
              onClick={() => sendMessage()}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform hover:scale-105 gradient-bg"
            >
              <Send size={16} style={{ color: "white" }} />
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes typingBounce { 0%,60%,100% { transform: translateY(0); } 30% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
