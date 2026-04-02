import { useState } from "react";
import { Trophy, Flame, Zap, X, Github, Linkedin, Twitter, MapPin, Briefcase, Code, ExternalLink } from "lucide-react";
import { useApp } from "@/context/AppContext";

const LEADER_PROFILES = {
  "Arjun K.": {
    full: "Arjun Kumar", location: "Bangalore, India", title: "Full Stack Developer",
    bio: "Building the future, one component at a time. Passionate about React, Node.js, and open source. 3+ years of self-taught development.",
    skills: ["React", "Node.js", "TypeScript", "MongoDB", "AWS", "Python"],
    experience: [
      { role: "Freelance Full Stack Developer", company: "Self-employed", period: "2023–Present", desc: "Built 12+ client projects using React and Node.js." },
      { role: "Junior Frontend Dev", company: "Startup XY", period: "2022–2023", desc: "Worked on dashboard UI components and API integrations." },
    ],
    projects: [
      { name: "TaskFlow — Project Manager", tech: ["React", "Node.js", "MongoDB"], link: "#" },
      { name: "CryptoTrack Dashboard", tech: ["React", "Chart.js", "CoinGecko API"], link: "#" },
      { name: "LearnBuddy AI", tech: ["Python", "OpenAI", "FastAPI"], link: "#" },
    ],
    linkedin: "https://linkedin.com/in/arjunkumar", github: "https://github.com/arjunkumar", twitter: "@arjun_builds",
    certificates: ["React — Zero to Prod", "JavaScript Fundamentals", "Node.js Backend Dev"],
  },
  "Priya M.": {
    full: "Priya Mehta", location: "Mumbai, India", title: "UI/UX Developer",
    bio: "Designing experiences that users love. I bridge the gap between design and code. Figma enthusiast and React developer.",
    skills: ["Figma", "React", "CSS", "Animation", "User Research", "Prototyping"],
    experience: [
      { role: "UI/UX Developer", company: "DesignCo", period: "2023–Present", desc: "Led redesign of main product used by 50K+ users." },
    ],
    projects: [
      { name: "UI Component Library", tech: ["React", "Storybook", "CSS"], link: "#" },
      { name: "Travel App Redesign", tech: ["Figma", "React Native"], link: "#" },
    ],
    linkedin: "https://linkedin.com/in/priyamehta", github: "https://github.com/priyam", twitter: "@priya_designs",
    certificates: ["UI/UX with Figma", "React — Zero to Prod"],
  },
  "Ravi S.": {
    full: "Ravi Sharma", location: "Pune, India", title: "Python Data Scientist",
    bio: "Data tells stories — I just help people listen. ML engineer passionate about NLP and computer vision.",
    skills: ["Python", "TensorFlow", "Pandas", "SQL", "scikit-learn", "Tableau"],
    experience: [
      { role: "Data Analyst", company: "Analytics Corp", period: "2022–Present", desc: "Built ML models to predict customer churn with 89% accuracy." },
    ],
    projects: [
      { name: "Sentiment Analyzer", tech: ["Python", "NLP", "Flask"], link: "#" },
      { name: "Sales Forecasting Model", tech: ["Python", "scikit-learn", "Pandas"], link: "#" },
    ],
    linkedin: "https://linkedin.com/in/ravisharma", github: "https://github.com/ravisharma", twitter: "",
    certificates: ["Python for Data Science", "Machine Learning Basics"],
  },
  "Anita D.": {
    full: "Anita Desai", location: "Delhi, India", title: "Frontend Developer",
    bio: "Frontend developer with a love for clean, accessible code. Vue.js and React specialist. Open source contributor.",
    skills: ["React", "Vue.js", "JavaScript", "CSS", "Accessibility", "Testing"],
    experience: [
      { role: "Frontend Developer", company: "WebAgency", period: "2021–Present", desc: "Developed 30+ landing pages and web apps for clients." },
    ],
    projects: [
      { name: "Accessibility Checker Tool", tech: ["React", "axe-core"], link: "#" },
      { name: "Recipe App", tech: ["Vue.js", "Firebase"], link: "#" },
    ],
    linkedin: "https://linkedin.com/in/anitadesai", github: "https://github.com/anitad", twitter: "@anita_frontend",
    certificates: ["JavaScript Fundamentals", "React — Zero to Prod"],
  },
  "Vikram P.": {
    full: "Vikram Patel", location: "Hyderabad, India", title: "DevOps Engineer",
    bio: "Infrastructure is code. Automating everything so developers can focus on building. AWS certified.",
    skills: ["Docker", "Kubernetes", "AWS", "Terraform", "Linux", "CI/CD"],
    experience: [
      { role: "DevOps Engineer", company: "CloudFirst", period: "2022–Present", desc: "Reduced deployment time by 70% through CI/CD pipeline optimization." },
    ],
    projects: [
      { name: "K8s Auto-scaling Cluster", tech: ["Kubernetes", "AWS", "Terraform"], link: "#" },
      { name: "Zero-downtime Deploy Pipeline", tech: ["GitHub Actions", "Docker", "AWS"], link: "#" },
    ],
    linkedin: "https://linkedin.com/in/vikrampatel", github: "https://github.com/vikramp", twitter: "",
    certificates: ["Docker & DevOps", "Cloud with AWS"],
  },
};

const WEEKLY_LEADERS = [
  { rank: 1, name: "Arjun K.", xp: 3240, streak: 28, level: 7, avatar: "A", badge: "🏆" },
  { rank: 2, name: "Priya M.", xp: 2980, streak: 21, level: 6, avatar: "P", badge: "🥈" },
  { rank: 3, name: "Ravi S.", xp: 2750, streak: 19, level: 6, avatar: "R", badge: "🥉" },
  { rank: 4, name: "Anita D.", xp: 2340, streak: 15, level: 5, avatar: "A", badge: "" },
  { rank: 5, name: "Vikram P.", xp: 2100, streak: 12, level: 5, avatar: "V", badge: "" },
  { rank: 6, name: "Meera J.", xp: 1890, streak: 10, level: 4, avatar: "M", badge: "" },
  { rank: 7, name: "Karan T.", xp: 1720, streak: 9, level: 4, avatar: "K", badge: "" },
  { rank: 8, name: "Sunita L.", xp: 1560, streak: 8, level: 4, avatar: "S", badge: "" },
  { rank: 9, name: "Dev B.", xp: 1380, streak: 7, level: 3, avatar: "D", badge: "" },
  { rank: 10, name: "Neha C.", xp: 1290, streak: 6, level: 3, avatar: "N", badge: "" },
];

const MONTHLY_LEADERS = [
  { rank: 1, name: "Arjun K.", xp: 12480, streak: 28, level: 8, avatar: "A", badge: "🏆" },
  { rank: 2, name: "Ravi S.", xp: 11200, streak: 25, level: 7, avatar: "R", badge: "🥈" },
  { rank: 3, name: "Priya M.", xp: 10750, streak: 22, level: 7, avatar: "P", badge: "🥉" },
  { rank: 4, name: "Vikram P.", xp: 9400, streak: 20, level: 6, avatar: "V", badge: "" },
  { rank: 5, name: "Anita D.", xp: 8900, streak: 18, level: 6, avatar: "A", badge: "" },
  { rank: 6, name: "You 🔥", xp: 1240, streak: 12, level: 4, avatar: "Y", badge: "" },
];

const AVATAR_COLORS: Record<string, string> = {
  "Arjun K.": "#4F8EF7", "Priya M.": "#9B6FFF", "Ravi S.": "#2ECC8E",
  "Anita D.": "#FF8C42", "Vikram P.": "#FF5FA0", "Meera J.": "#2EC4B6",
  "Karan T.": "#FFD166", "Sunita L.": "#FF8C42", "Dev B.": "#4F8EF7", "Neha C.": "#9B6FFF",
};

export default function Leaderboard() {
  const { user } = useApp();
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [viewingProfile, setViewingProfile] = useState<string | null>(null);

  const leaders = tab === "weekly" ? WEEKLY_LEADERS : MONTHLY_LEADERS;
  const userRank = tab === "weekly" ? 14 : 6;

  const podiumColors: Record<number, string> = { 1: "var(--lq-yellow)", 2: "#C0C0C0", 3: "#CD7F32" };
  const profile = viewingProfile ? LEADER_PROFILES[viewingProfile as keyof typeof LEADER_PROFILES] : null;

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Trophy size={22} style={{ color: "var(--lq-yellow)" }} /> Leaderboard
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>
        Compete with learners worldwide. Click any learner's name to view their full profile.
      </p>

      {/* Tab Switcher */}
      <div className="flex gap-2 mb-5">
        {(["weekly", "monthly"] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className="px-4 py-2 rounded-xl text-sm font-bold capitalize transition-all"
            style={tab === t
              ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }
              : { color: "rgba(136,144,168,1)", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.06)" }
            }>
            {t === "weekly" ? "📅 This Week" : "📆 This Month"}
          </button>
        ))}
      </div>

      {/* Podium */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {leaders.slice(0, 3).map((_, i) => {
          const order = [1, 0, 2][i];
          const l = leaders[order];
          return (
            <div key={l.rank}
              className={`p-4 rounded-2xl text-center transition-all hover:-translate-y-0.5 cursor-pointer ${order === 0 ? "mt-0" : "mt-4"}`}
              style={{
                background: order === 0 ? "linear-gradient(135deg, rgba(255,209,102,.1), rgba(255,140,66,.1))" : "rgba(15,20,34,1)",
                border: `1px solid ${order === 0 ? "rgba(255,209,102,.3)" : "rgba(255,255,255,.07)"}`,
              }}
              onClick={() => LEADER_PROFILES[l.name as keyof typeof LEADER_PROFILES] && setViewingProfile(l.name)}
            >
              <div className="text-2xl mb-1">{l.badge || `#${l.rank}`}</div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black mx-auto mb-2"
                style={{ background: `${AVATAR_COLORS[l.name] || "var(--lq-blue)"}30`, color: AVATAR_COLORS[l.name] || "var(--lq-blue)", border: `3px solid ${podiumColors[l.rank] || "rgba(255,255,255,.1)"}` }}>
                {l.avatar}
              </div>
              <div className="text-sm font-bold mb-0.5 hover:underline">{l.name}</div>
              <div className="text-xs font-black mb-1" style={{ color: podiumColors[l.rank] || "rgba(136,144,168,1)" }}>
                {l.xp.toLocaleString()} XP
              </div>
              <div className="text-[10px] flex items-center justify-center gap-1" style={{ color: "rgba(136,144,168,1)" }}>
                <Flame size={10} style={{ color: "var(--lq-orange)" }} /> {l.streak}d
              </div>
            </div>
          );
        })}
      </div>

      {/* Rankings table */}
      <div className="rounded-2xl overflow-hidden mb-4" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <div className="px-4 py-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,.05)", background: "rgba(22,27,46,.5)" }}>
          <div className="grid grid-cols-[40px_1fr_100px_80px_60px] gap-2 text-[10px] font-bold uppercase tracking-wider" style={{ color: "rgba(90,96,122,1)" }}>
            <span>Rank</span><span>Learner</span><span>XP</span><span>Streak</span><span>Level</span>
          </div>
        </div>
        {leaders.map(leader => (
          <div key={leader.rank}
            className="grid grid-cols-[40px_1fr_100px_80px_60px] gap-2 px-4 py-3 items-center transition-all hover:bg-white/[0.02]"
            style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}
          >
            <span className="text-sm font-black" style={{ color: leader.rank <= 3 ? podiumColors[leader.rank] : "rgba(90,96,122,1)" }}>
              {leader.rank <= 3 ? leader.badge : `#${leader.rank}`}
            </span>
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0"
                style={{ background: `${AVATAR_COLORS[leader.name] || "var(--lq-blue)"}25`, color: AVATAR_COLORS[leader.name] || "var(--lq-blue)" }}>
                {leader.avatar}
              </div>
              <button
                className="text-sm font-medium truncate text-left hover:underline transition-colors"
                style={{ color: LEADER_PROFILES[leader.name as keyof typeof LEADER_PROFILES] ? "var(--lq-blue)" : "rgba(232,234,240,1)" }}
                onClick={() => LEADER_PROFILES[leader.name as keyof typeof LEADER_PROFILES] && setViewingProfile(leader.name)}
              >
                {leader.name}
              </button>
            </div>
            <span className="text-xs font-bold" style={{ color: "var(--lq-yellow)" }}>⚡ {leader.xp.toLocaleString()}</span>
            <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>🔥 {leader.streak}d</span>
            <span className="text-xs font-bold" style={{ color: "var(--lq-purple)" }}>Lv.{leader.level}</span>
          </div>
        ))}
      </div>

      {/* Your position */}
      <div className="p-4 rounded-xl flex items-center gap-4"
        style={{ background: "linear-gradient(135deg, rgba(79,142,247,.08), rgba(155,111,255,.08))", border: "1px solid rgba(79,142,247,.2)" }}>
        <div className="text-2xl font-black" style={{ color: "var(--lq-blue)" }}>#{userRank}</div>
        <div>
          <div className="text-sm font-bold">Your Position</div>
          <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>
            You have <strong style={{ color: "white" }}>{user.xp.toLocaleString()} XP</strong>. Keep earning to climb the ranks!
          </div>
        </div>
        <div className="ml-auto text-right">
          <div className="text-xl font-black" style={{ color: "var(--lq-yellow)" }}>{user.xp.toLocaleString()}</div>
          <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>your XP</div>
        </div>
      </div>

      {/* Profile Drawer */}
      {viewingProfile && profile && (
        <div className="fixed inset-0 z-[400] flex items-end md:items-center justify-center p-4" style={{ background: "rgba(0,0,0,.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: "rgba(10,14,28,1)", border: "1px solid rgba(255,255,255,.1)" }}>
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-5 pb-3" style={{ background: "rgba(10,14,28,.95)", backdropFilter: "blur(8px)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black"
                  style={{ background: `${AVATAR_COLORS[viewingProfile] || "var(--lq-blue)"}25`, color: AVATAR_COLORS[viewingProfile] || "var(--lq-blue)", border: `2px solid ${AVATAR_COLORS[viewingProfile] || "var(--lq-blue)"}40` }}>
                  {viewingProfile[0]}
                </div>
                <div>
                  <h2 className="text-lg font-black">{profile.full}</h2>
                  <div className="text-sm" style={{ color: "rgba(136,144,168,1)" }}>{profile.title}</div>
                  <div className="flex items-center gap-1 text-xs mt-0.5" style={{ color: "rgba(90,96,122,1)" }}>
                    <MapPin size={11} /> {profile.location}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingProfile(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} style={{ color: "rgba(136,144,168,1)" }} />
              </button>
            </div>

            <div className="p-5 space-y-5">
              {/* Bio */}
              <p className="text-sm leading-relaxed" style={{ color: "rgba(200,204,220,1)" }}>{profile.bio}</p>

              {/* Social Links */}
              <div className="flex gap-2 flex-wrap">
                {profile.linkedin && (
                  <a href={profile.linkedin} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(10,102,194,.12)", color: "#0A66C2", border: "1px solid rgba(10,102,194,.25)" }}>
                    <Linkedin size={13} /> LinkedIn
                  </a>
                )}
                {profile.github && (
                  <a href={profile.github} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(255,255,255,.06)", color: "white", border: "1px solid rgba(255,255,255,.12)" }}>
                    <Github size={13} /> GitHub
                  </a>
                )}
                {profile.twitter && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold"
                    style={{ background: "rgba(29,161,242,.1)", color: "#1DA1F2", border: "1px solid rgba(29,161,242,.25)" }}>
                    <Twitter size={13} /> {profile.twitter}
                  </span>
                )}
              </div>

              {/* Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "rgba(90,96,122,1)" }}>Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                  {profile.skills.map(s => (
                    <span key={s} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }}>
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: "rgba(90,96,122,1)" }}>
                  <Briefcase size={12} /> Experience
                </h3>
                <div className="space-y-3">
                  {profile.experience.map((exp, i) => (
                    <div key={i} className="p-3 rounded-xl" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)" }}>
                      <div className="text-sm font-bold">{exp.role}</div>
                      <div className="text-xs mb-1" style={{ color: "var(--lq-blue)" }}>{exp.company} · {exp.period}</div>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{exp.desc}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Projects */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5 flex items-center gap-1.5" style={{ color: "rgba(90,96,122,1)" }}>
                  <Code size={12} /> Projects
                </h3>
                <div className="space-y-2">
                  {profile.projects.map((proj, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)" }}>
                      <div>
                        <div className="text-xs font-bold">{proj.name}</div>
                        <div className="flex gap-1 mt-1 flex-wrap">
                          {proj.tech.map(t => (
                            <span key={t} className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)" }}>{t}</span>
                          ))}
                        </div>
                      </div>
                      <a href={proj.link} className="p-1.5 rounded-lg" style={{ background: "rgba(79,142,247,.1)" }}>
                        <ExternalLink size={12} style={{ color: "var(--lq-blue)" }} />
                      </a>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certificates */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "rgba(90,96,122,1)" }}>🎓 Certificates</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.certificates.map(c => (
                    <span key={c} className="px-2.5 py-1 rounded-lg text-xs font-bold"
                      style={{ background: "rgba(255,209,102,.08)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
