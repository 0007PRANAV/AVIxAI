import { useState } from "react";
import { GraduationCap, Award, Code, ExternalLink, Download, Share2, Plus, X, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";
import { Link } from "wouter";

const CERTIFICATES = [
  { id: "cert-1", course: "JavaScript Fundamentals", completedAt: "In Progress", level: "Beginner", xp: 480, inProgress: true },
  { id: "cert-2", course: "Social Media Growth", completedAt: "March 15, 2025", level: "Beginner", xp: 280, inProgress: false },
];

const SKILLS_PROFILE = [
  { name: "JavaScript", level: 68, color: "#FFD166" },
  { name: "HTML & CSS", level: 85, color: "#4F8EF7" },
  { name: "React", level: 35, color: "#9B6FFF" },
  { name: "Git", level: 72, color: "#FF8C42" },
  { name: "Python", level: 20, color: "#2ECC8E" },
];

interface Project {
  id: string;
  title: string;
  tech: string[];
  desc: string;
  link: string;
  xp: number;
}

const INITIAL_PROJECTS: Project[] = [
  { id: "proj-1", title: "Personal Portfolio Site", tech: ["HTML", "CSS", "JavaScript"], desc: "A responsive personal portfolio showcasing my journey from learner to developer.", link: "#", xp: 120 },
  { id: "proj-2", title: "To-Do App with React", tech: ["React", "useState", "LocalStorage"], desc: "Full CRUD to-do application built as part of the React course project.", link: "#", xp: 150 },
];

export default function Portfolio() {
  const { user, addXP } = useApp();
  const [activeTab, setActiveTab] = useState<"overview" | "certificates" | "projects" | "skills">("overview");
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [showAddProject, setShowAddProject] = useState(false);
  const [form, setForm] = useState({ title: "", desc: "", tech: "", link: "" });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const certId = `LQ-2025-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  const profileIncomplete = user.profileCompletion < 70;

  function sharePortfolio() {
    showXPToast("🔗", "Portfolio link copied! +5 XP", "#4F8EF7");
    addXP(5, "share");
  }

  function validateForm() {
    const errors: Record<string, string> = {};
    if (!form.title.trim()) errors.title = "Project title is required";
    if (!form.desc.trim()) errors.desc = "Description is required";
    if (!form.tech.trim()) errors.tech = "At least one technology is required";
    return errors;
  }

  function handleAddProject() {
    const errors = validateForm();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const newProject: Project = {
      id: `proj-${Date.now()}`,
      title: form.title.trim(),
      desc: form.desc.trim(),
      tech: form.tech.split(",").map(t => t.trim()).filter(Boolean),
      link: form.link.trim() || "#",
      xp: 100,
    };
    setProjects(prev => [...prev, newProject]);
    setForm({ title: "", desc: "", tech: "", link: "" });
    setFormErrors({});
    setShowAddProject(false);
    addXP(50, "add-project");
    showXPToast("🚀", "+50 XP! Project added to your portfolio!", "#9B6FFF");
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h1 className="text-2xl font-black tracking-tight flex items-center gap-2">
          <GraduationCap size={22} style={{ color: "var(--lq-yellow)" }} /> My Portfolio
        </h1>
        <button
          onClick={sharePortfolio}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all hover:scale-105"
          style={{ background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.2)" }}
        >
          <Share2 size={13} /> Share Portfolio
        </button>
      </div>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        Your public learning profile. Share it with employers and on LinkedIn.
      </p>

      {/* Profile Incomplete Warning */}
      {profileIncomplete && (
        <div className="flex items-start gap-3 p-4 rounded-xl mb-4"
          style={{ background: "rgba(255,140,66,.07)", border: "1px solid rgba(255,140,66,.25)" }}>
          <AlertTriangle size={16} style={{ color: "var(--lq-orange)", flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1">
            <div className="text-sm font-bold mb-0.5" style={{ color: "var(--lq-orange)" }}>
              Your profile is only {user.profileCompletion}% complete
            </div>
            <div className="text-xs leading-relaxed" style={{ color: "rgba(200,180,140,1)" }}>
              Hirers and recruiters may skip incomplete profiles. Fill in your phone, email, LinkedIn, GitHub, bio, and location to become fully visible.
            </div>
          </div>
          <Link href="/settings">
            <button className="text-xs font-bold px-3 py-1.5 rounded-lg whitespace-nowrap"
              style={{ background: "rgba(255,140,66,.15)", color: "var(--lq-orange)", border: "1px solid rgba(255,140,66,.3)" }}>
              Complete Profile →
            </button>
          </Link>
        </div>
      )}

      {/* Profile Card */}
      <div className="p-5 rounded-2xl mb-5" style={{ background: "linear-gradient(135deg, rgba(79,142,247,.08), rgba(155,111,255,.08))", border: "1px solid rgba(155,111,255,.2)" }}>
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-black"
            style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", border: "3px solid rgba(155,111,255,.3)" }}>
            {user.name[0]}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black mb-0.5">{user.name}</h2>
            <div className="text-sm mb-2" style={{ color: "rgba(136,144,168,1)" }}>
              {user.profile?.bio || "Aspiring Web Developer"} · AVIxAI Level {user.level}
            </div>
            {user.profile?.location && (
              <div className="text-xs mb-2" style={{ color: "rgba(136,144,168,1)" }}>📍 {user.profile.location}</div>
            )}
            <div className="flex flex-wrap gap-2">
              {[
                { icon: "⚡", value: `${user.xp.toLocaleString()} XP`, color: "var(--lq-yellow)" },
                { icon: "🔥", value: `${user.streak} streak`, color: "var(--lq-orange)" },
                { icon: "🎓", value: `${CERTIFICATES.filter(c => !c.inProgress).length} certs`, color: "var(--lq-green)" },
                { icon: "💼", value: "8 job matches", color: "var(--lq-blue)" },
              ].map((item, i) => (
                <span key={i} className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                  style={{ background: "rgba(255,255,255,.06)", border: "1px solid rgba(255,255,255,.08)", color: item.color }}>
                  {item.icon} {item.value}
                </span>
              ))}
            </div>
            {/* Social Links */}
            <div className="flex gap-2 mt-2 flex-wrap">
              {user.profile?.linkedin && (
                <a href={user.profile.linkedin} className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(10,102,194,.15)", color: "#0A66C2" }}>💼 LinkedIn</a>
              )}
              {user.profile?.github && (
                <a href={user.profile.github} className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(255,255,255,.08)", color: "white" }}>🐙 GitHub</a>
              )}
              {user.profile?.twitter && (
                <a href={user.profile.twitter} className="text-[10px] px-2 py-0.5 rounded font-bold" style={{ background: "rgba(29,161,242,.15)", color: "#1DA1F2" }}>🐦 Twitter</a>
              )}
            </div>
          </div>
          {/* Profile Completion Circle */}
          <div className="text-center flex-shrink-0">
            <div className="relative w-16 h-16">
              <svg className="w-full h-full" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="2.5" />
                <circle cx="18" cy="18" r="15.9" fill="none"
                  stroke={user.profileCompletion >= 70 ? "var(--lq-green)" : user.profileCompletion >= 40 ? "var(--lq-yellow)" : "var(--lq-orange)"}
                  strokeWidth="2.5"
                  strokeDasharray={`${user.profileCompletion} ${100 - user.profileCompletion}`}
                  strokeLinecap="round" transform="rotate(-90 18 18)" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center text-sm font-black">{user.profileCompletion}%</div>
            </div>
            <div className="text-[9px] mt-1" style={{ color: "rgba(90,96,122,1)" }}>Profile done</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-5">
        {(["overview", "certificates", "projects", "skills"] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
            style={activeTab === tab
              ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }
              : { color: "rgba(136,144,168,1)", background: "rgba(255,255,255,.03)" }
            }
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Overview */}
      {activeTab === "overview" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Award size={14} style={{ color: "var(--lq-yellow)" }} /> Certificates ({CERTIFICATES.filter(c => !c.inProgress).length})</h3>
            {CERTIFICATES.map(cert => (
              <div key={cert.id} className="flex items-center gap-2 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                <span className="text-lg">{cert.inProgress ? "⏳" : "🎓"}</span>
                <div className="flex-1">
                  <div className="text-xs font-bold">{cert.course}</div>
                  <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>{cert.inProgress ? "In progress" : cert.completedAt}</div>
                </div>
                <span className="text-[10px] font-bold" style={{ color: "var(--lq-yellow)" }}>⚡{cert.xp} XP</span>
              </div>
            ))}
          </div>
          <div className="p-4 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Code size={14} style={{ color: "var(--lq-blue)" }} /> Top Skills</h3>
            <div className="space-y-2.5">
              {SKILLS_PROFILE.slice(0, 4).map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                    <span style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                    <div className="h-full rounded-full" style={{ width: `${skill.level}%`, background: skill.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Certificates */}
      {activeTab === "certificates" && (
        <div className="space-y-4">
          {CERTIFICATES.filter(c => !c.inProgress).map(cert => (
            <div key={cert.id} className="max-w-2xl">
              <div className="p-8 rounded-2xl text-center relative overflow-hidden"
                style={{ background: "linear-gradient(135deg, #0D1422, #161B2E)", border: "1px solid rgba(155,111,255,.22)" }}>
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-80 rounded-full pointer-events-none"
                  style={{ background: "radial-gradient(circle, rgba(155,111,255,.07), transparent 70%)" }} />
                <div className="relative z-10">
                  <div className="text-2xl font-black mb-0.5">Learn<span style={{ color: "var(--lq-blue)" }}>Quest</span></div>
                  <div className="text-[10px] uppercase tracking-widest mb-6" style={{ color: "rgba(136,144,168,1)" }}>Certificate of Completion</div>
                  <div className="text-2xl font-black mb-1 gradient-text">{user.name}</div>
                  <div className="text-base font-bold mb-6" style={{ color: "var(--lq-yellow)" }}>{cert.course}</div>
                  <div className="flex justify-center gap-6 mb-4">
                    <div><div className="text-lg font-black" style={{ color: "var(--lq-yellow)" }}>{cert.completedAt}</div><div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>Completed</div></div>
                    <div><div className="text-lg font-black" style={{ color: "var(--lq-green)" }}>⚡{cert.xp} XP</div><div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>Earned</div></div>
                  </div>
                  <div className="text-[10px] font-mono px-3 py-1 rounded-full inline-block"
                    style={{ background: "rgba(255,255,255,.04)", color: "rgba(90,96,122,1)" }}>{certId}</div>
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold gradient-bg text-white"
                  onClick={() => showXPToast("📥", "Certificate downloading...", "#4F8EF7")}>
                  <Download size={13} /> Download PDF
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-bold"
                  style={{ background: "rgba(22,27,46,1)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.07)" }}
                  onClick={() => showXPToast("💼", "Certificate shared to LinkedIn!", "#0A66C2")}>
                  <ExternalLink size={13} /> Share to LinkedIn
                </button>
              </div>
            </div>
          ))}
          {CERTIFICATES.filter(c => c.inProgress).map(cert => (
            <div key={cert.id} className="p-4 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)", opacity: 0.7 }}>
              <div className="flex items-center gap-3">
                <span className="text-3xl">⏳</span>
                <div>
                  <div className="text-sm font-bold">{cert.course}</div>
                  <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>In progress — complete the course to earn this certificate</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Projects */}
      {activeTab === "projects" && (
        <div className="space-y-3">
          {projects.map(project => (
            <div key={project.id} className="p-4 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
              <div className="flex items-start justify-between gap-2 mb-2">
                <h3 className="text-sm font-bold">{project.title}</h3>
                {project.link !== "#" && (
                  <a href={project.link} target="_blank" rel="noopener noreferrer" className="p-1.5 rounded-lg" style={{ background: "rgba(79,142,247,.1)" }}>
                    <ExternalLink size={13} style={{ color: "var(--lq-blue)" }} />
                  </a>
                )}
              </div>
              <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>{project.desc}</p>
              <div className="flex flex-wrap gap-1.5">
                {project.tech.map(t => (
                  <span key={t} className="px-2 py-0.5 rounded text-[9px] font-bold"
                    style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)" }}>{t}</span>
                ))}
                <span className="ml-auto text-[10px] font-bold" style={{ color: "var(--lq-yellow)" }}>⚡ +{project.xp} XP</span>
              </div>
            </div>
          ))}

          {/* Add Project Button */}
          <button
            className="w-full py-3 rounded-2xl flex items-center justify-center gap-2 text-sm font-bold transition-all hover:bg-white/[0.04]"
            style={{ background: "rgba(15,20,34,1)", border: "2px dashed rgba(255,255,255,.1)", color: "rgba(90,96,122,1)" }}
            onClick={() => setShowAddProject(true)}
          >
            <Plus size={16} /> Add New Project (+50 XP)
          </button>
        </div>
      )}

      {/* Skills */}
      {activeTab === "skills" && (
        <div className="space-y-3">
          <div className="p-4 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
            <h3 className="text-sm font-bold mb-4">Technical Skills (from quiz performance)</h3>
            <div className="space-y-3">
              {SKILLS_PROFILE.map(skill => (
                <div key={skill.name}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{skill.name}</span>
                    <span style={{ color: skill.color }}>{skill.level}%</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ width: `${skill.level}%`, background: skill.color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {showAddProject && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.7)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg rounded-2xl p-6" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(155,111,255,.25)" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-black flex items-center gap-2">
                <Plus size={18} style={{ color: "var(--lq-purple)" }} /> Add Project
              </h2>
              <button onClick={() => { setShowAddProject(false); setFormErrors({}); }} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} style={{ color: "rgba(136,144,168,1)" }} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Project Title *</label>
                <input
                  value={form.title}
                  onChange={e => setForm(p => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Weather App, E-commerce Site..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(22,27,46,1)", border: `1px solid ${formErrors.title ? "rgba(255,77,77,.5)" : "rgba(255,255,255,.1)"}`, color: "white" }}
                />
                {formErrors.title && <p className="text-xs mt-1" style={{ color: "var(--lq-red)" }}>{formErrors.title}</p>}
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Description *</label>
                <textarea
                  value={form.desc}
                  onChange={e => setForm(p => ({ ...p, desc: e.target.value }))}
                  placeholder="What does this project do? What did you build and learn?"
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                  style={{ background: "rgba(22,27,46,1)", border: `1px solid ${formErrors.desc ? "rgba(255,77,77,.5)" : "rgba(255,255,255,.1)"}`, color: "white" }}
                />
                {formErrors.desc && <p className="text-xs mt-1" style={{ color: "var(--lq-red)" }}>{formErrors.desc}</p>}
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Technologies Used * <span style={{ color: "rgba(90,96,122,1)" }}>(comma-separated)</span></label>
                <input
                  value={form.tech}
                  onChange={e => setForm(p => ({ ...p, tech: e.target.value }))}
                  placeholder="React, Node.js, MongoDB, CSS..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(22,27,46,1)", border: `1px solid ${formErrors.tech ? "rgba(255,77,77,.5)" : "rgba(255,255,255,.1)"}`, color: "white" }}
                />
                {formErrors.tech && <p className="text-xs mt-1" style={{ color: "var(--lq-red)" }}>{formErrors.tech}</p>}
              </div>
              <div>
                <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Live Link / GitHub <span style={{ color: "rgba(90,96,122,1)" }}>(optional)</span></label>
                <input
                  value={form.link}
                  onChange={e => setForm(p => ({ ...p, link: e.target.value }))}
                  placeholder="https://github.com/you/project"
                  className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                  style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
                />
              </div>
              <div className="flex gap-3 pt-1">
                <button
                  onClick={() => { setShowAddProject(false); setFormErrors({}); }}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.08)" }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddProject}
                  className="flex-1 py-2.5 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-[1.02]"
                >
                  Add Project (+50 XP)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
