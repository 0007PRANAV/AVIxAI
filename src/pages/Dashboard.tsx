import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Zap, Flame, Briefcase, BookOpen, Target, ChevronRight, Clock, TrendingUp, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

const COURSES = [
  { id: "js-fundamentals", name: "JavaScript Fundamentals", icon: "🌐", cat: "Web Dev", lessons: 24, xpPer: "15-35", progress: 38, locked: false, xpGate: 0, price: "Free" },
  { id: "react-course", name: "React — Zero to Prod", icon: "⚛️", cat: "Frontend", lessons: 32, xpPer: "20-40", progress: 0, locked: true, xpGate: 2000, price: "₹499" },
  { id: "ai-prompts", name: "Prompt Engineering", icon: "🤖", cat: "AI/ML", lessons: 18, xpPer: "15-30", progress: 0, locked: false, xpGate: 0, price: "₹299" },
  { id: "python-data", name: "Python for Data Science", icon: "📊", cat: "Data", lessons: 28, xpPer: "25-50", progress: 0, locked: true, xpGate: 3500, price: "₹399" },
  { id: "figma-design", name: "UI/UX with Figma", icon: "🎨", cat: "Design", lessons: 22, xpPer: "20-35", progress: 0, locked: true, xpGate: 5000, price: "₹349" },
  { id: "social-growth", name: "Social Media Growth", icon: "📱", cat: "Marketing", lessons: 16, xpPer: "10-25", progress: 0, locked: false, xpGate: 0, price: "Free" },
];

const ACHIEVEMENTS = [
  { id: "on-fire", icon: "🔥", name: "On Fire", desc: "10-day streak", earned: true },
  { id: "quick-learner", icon: "⚡", name: "Quick Learner", desc: "5 lessons/day", earned: true },
  { id: "sharp-shooter", icon: "🎯", name: "Sharp Shooter", desc: "10 perfect quizzes", earned: true },
  { id: "hired", icon: "💼", name: "Hired", desc: "Get first job match", earned: false },
  { id: "graduate", icon: "🎓", name: "Graduate", desc: "Complete a course", earned: false },
  { id: "top-10", icon: "🏆", name: "Top 10", desc: "Reach leaderboard", earned: false },
  { id: "redeemer", icon: "🛒", name: "Redeemer", desc: "Buy from XP store", earned: false },
];

export default function Dashboard() {
  const { user } = useApp();
  const [greeting, setGreeting] = useState("Good morning");
  const [, setLocation] = useLocation();

  useEffect(() => {
    const h = new Date().getHours();
    if (h >= 12 && h < 18) setGreeting("Good afternoon");
    else if (h >= 18) setGreeting("Good evening");
  }, []);

  const activeMissions = user.missions.filter(m => !m.completed && m.type === "daily").slice(0, 3);

  function handleResumeLesson() {
    // Navigate to quizzes instead of giving XP
    setLocation("/quizzes");
  }

  return (
    <div>
      {/* Greeting */}
      <div className="mb-1">
        <h1 className="text-2xl font-black tracking-tight">
          {greeting}, <span className="gradient-text">{user.name}</span> 👋
        </h1>
      </div>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>
        Level {user.level} · {user.streak}-day streak · {(user.xp).toLocaleString()} XP total. Every lesson counts.
      </p>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        {[
          { icon: <Zap size={18} style={{ color: "var(--lq-blue)" }} />, value: user.xp.toLocaleString(), label: "Total XP", color: "var(--lq-blue)", bar: "blue" },
          { icon: <BookOpen size={18} style={{ color: "var(--lq-purple)" }} />, value: user.enrolledCourses.length.toString(), label: "Courses enrolled", color: "var(--lq-purple)", bar: "purple" },
          { icon: <Briefcase size={18} style={{ color: "var(--lq-green)" }} />, value: "8", label: "Job matches", color: "var(--lq-green)", bar: "green" },
          { icon: <Flame size={18} style={{ color: "var(--lq-orange)" }} />, value: user.streak.toString(), label: "Day streak", color: "var(--lq-orange)", bar: "orange" },
        ].map((stat, i) => (
          <div
            key={i}
            className="p-4 rounded-xl relative overflow-hidden transition-all hover:-translate-y-0.5 cursor-default"
            style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
            data-testid={`stat-card-${i}`}
          >
            <div className="absolute top-0 left-0 right-0 h-0.5" style={{ background: `linear-gradient(90deg, ${stat.color}, transparent)` }} />
            <div className="mb-2">{stat.icon}</div>
            <div className="text-2xl font-black mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-[11px] font-medium" style={{ color: "rgba(136,144,168,1)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* XP Info Banner */}
      <div className="flex items-center gap-4 p-4 rounded-xl mb-5" style={{ background: "rgba(255,209,102,.05)", border: "1px solid rgba(255,209,102,.15)" }}>
        <div className="text-3xl flex-shrink-0">📊</div>
        <div className="flex-1">
          <div className="text-sm font-bold mb-1">How XP works on AVIxAI</div>
          <div className="text-xs leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>
            XP is earned in small amounts per action — lessons give <strong style={{ color: "var(--lq-yellow)" }}>15–40 XP</strong>, quizzes give <strong style={{ color: "var(--lq-yellow)" }}>25–60 XP</strong>, challenges give <strong style={{ color: "var(--lq-yellow)" }}>50–100 XP</strong>. Unlock courses, jobs, and store items by reaching required XP milestones.
          </div>
        </div>
        <div className="text-right flex-shrink-0">
          <div className="text-xl font-black" style={{ color: "var(--lq-yellow)" }}>{user.xp.toLocaleString()}</div>
          <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>your XP</div>
        </div>
      </div>

      {/* Continue Where You Left Off */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2"><Clock size={16} style={{ color: "var(--lq-blue)" }} /> Continue where you left off</h2>
          <Link href="/courses"><span className="text-xs font-semibold cursor-pointer" style={{ color: "var(--lq-blue)" }}>Continue →</span></Link>
        </div>
        <div className="p-5 rounded-2xl grid grid-cols-1 md:grid-cols-[1fr_auto] gap-4 items-center relative overflow-hidden"
          style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
          <div className="absolute top-0 right-0 w-60 h-60 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(79,142,247,.04), transparent 70%)" }} />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold mb-3"
              style={{ background: "rgba(155,111,255,.1)", border: "1px solid rgba(155,111,255,.18)", color: "var(--lq-purple)" }}>
              🔵 Web Development
            </div>
            <h3 className="text-lg font-black mb-1">JavaScript Fundamentals</h3>
            <p className="text-sm mb-3" style={{ color: "rgba(136,144,168,1)" }}>
              Master the language of the web through 24 interactive challenges. Small XP per lesson — but they add up fast.
            </p>
            <div className="flex justify-between text-xs mb-1">
              <span style={{ color: "rgba(136,144,168,1)" }}>Module 3 of 8 — Functions & Scope</span>
              <span style={{ color: "var(--lq-blue)" }} className="font-bold">38%</span>
            </div>
            <div className="h-1.5 rounded-full overflow-hidden mb-3" style={{ background: "rgba(255,255,255,.06)" }}>
              <div className="h-full rounded-full xp-bar-fill" style={{ width: "38%", background: "linear-gradient(90deg, var(--lq-blue), var(--lq-purple))" }} />
            </div>
            <div className="flex gap-4 flex-wrap">
              <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>⚡ <strong style={{ color: "white" }}>+25 XP/lesson</strong> avg</span>
              <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>🏅 <strong style={{ color: "white" }}>Certificate</strong> at completion</span>
              <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>💼 <strong style={{ color: "white" }}>8 jobs</strong> unlocked after</span>
            </div>
          </div>
          <button
            className="gradient-bg text-white font-bold px-6 py-3 rounded-xl text-sm transition-transform hover:scale-105 whitespace-nowrap"
            onClick={handleResumeLesson}
            data-testid="resume-lesson-btn"
          >
            ▶ Resume
          </button>
        </div>
      </div>

      {/* Daily Missions */}
      {activeMissions.length > 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold flex items-center gap-2"><Target size={16} style={{ color: "var(--lq-orange)" }} /> Today's Missions</h2>
            <Link href="/quizzes"><span className="text-xs font-semibold cursor-pointer" style={{ color: "var(--lq-blue)" }}>See all →</span></Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {activeMissions.map(mission => (
              <div key={mission.id} className="p-3.5 rounded-xl"
                style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                data-testid={`mission-${mission.id}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xl">{mission.icon}</span>
                  <div>
                    <div className="text-xs font-bold">{mission.title}</div>
                    <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>{mission.desc}</div>
                  </div>
                  <div className="ml-auto text-xs font-bold" style={{ color: "var(--lq-yellow)" }}>+{mission.xp} XP</div>
                </div>
                <div className="flex justify-between text-[10px] mb-1">
                  <span style={{ color: "rgba(136,144,168,1)" }}>{mission.progress}/{mission.total} done</span>
                  <span style={{ color: "var(--lq-blue)" }}>{Math.round((mission.progress / mission.total) * 100)}%</span>
                </div>
                <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                  <div className="h-full rounded-full" style={{ width: `${(mission.progress / mission.total) * 100}%`, background: "linear-gradient(90deg, var(--lq-blue), var(--lq-purple))" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Achievements */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2"><Star size={16} style={{ color: "var(--lq-yellow)" }} /> Achievements</h2>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {ACHIEVEMENTS.map(ach => (
            <div
              key={ach.id}
              className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0 transition-all"
              style={{
                background: ach.earned ? "rgba(255,209,102,.04)" : "rgba(15,20,34,1)",
                border: ach.earned ? "1px solid rgba(255,209,102,.22)" : "1px solid rgba(255,255,255,0.07)",
                opacity: ach.earned ? 1 : 0.35,
                filter: ach.earned ? "none" : "grayscale(1)",
              }}
              data-testid={`achievement-${ach.id}`}
            >
              <span className="text-xl">{ach.icon}</span>
              <div>
                <div className="text-xs font-bold">{ach.name}</div>
                <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>{ach.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommended Courses */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold flex items-center gap-2"><TrendingUp size={16} style={{ color: "var(--lq-green)" }} /> Recommended for you</h2>
          <Link href="/courses"><span className="text-xs font-semibold cursor-pointer" style={{ color: "var(--lq-blue)" }}>See all →</span></Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {COURSES.filter(c => !c.locked).slice(0, 3).map(course => (
            <Link key={course.id} href="/courses">
              <div className="rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1"
                style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}
                data-testid={`course-card-${course.id}`}>
                <div className="h-24 flex items-center justify-center text-4xl"
                  style={{ background: "linear-gradient(135deg, #0D1F3C, #1A3A6B)" }}>
                  {course.icon}
                </div>
                <div className="p-3">
                  <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--lq-blue)" }}>{course.cat}</div>
                  <div className="text-sm font-bold mb-2">{course.name}</div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{course.lessons} lessons</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                      style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }}>
                      ✅ Unlocked
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
