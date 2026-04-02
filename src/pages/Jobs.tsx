import { useState } from "react";
import { Briefcase, Search, MapPin, Clock, DollarSign, Bookmark, BookmarkCheck, X, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";
import { Link } from "wouter";

const JOBS = [
  { id: "j1", title: "Junior Frontend Developer", company: "TechStartup India", location: "Bangalore (Remote)", salary: "₹4–6L/yr", type: "Full-time", skills: ["JavaScript", "React", "CSS"], posted: "2h ago", match: 92, logo: "T", color: "#4F8EF7" },
  { id: "j2", title: "React Developer", company: "DigitalOcean Corp", location: "Mumbai", salary: "₹6–9L/yr", type: "Full-time", skills: ["React", "Node.js", "TypeScript"], posted: "1d ago", match: 85, logo: "D", color: "#9B6FFF" },
  { id: "j3", title: "Web Developer (Intern)", company: "Freelancer Platform", location: "Remote", salary: "₹15K/mo", type: "Internship", skills: ["HTML", "CSS", "JavaScript"], posted: "3h ago", match: 98, logo: "F", color: "#2ECC8E" },
  { id: "j4", title: "UI/UX Developer", company: "Design Studio Co", location: "Delhi", salary: "₹5–8L/yr", type: "Full-time", skills: ["Figma", "React", "CSS"], posted: "2d ago", match: 78, logo: "U", color: "#FF8C42" },
  { id: "j5", title: "JavaScript Engineer", company: "Startup XY", location: "Hyderabad", salary: "₹7–11L/yr", type: "Full-time", skills: ["JavaScript", "Node.js", "MongoDB"], posted: "5h ago", match: 88, logo: "X", color: "#FF5FA0" },
  { id: "j6", title: "Frontend Developer", company: "EdTech Platform", location: "Remote", salary: "₹5–8L/yr", type: "Full-time", skills: ["React", "JavaScript", "Redux"], posted: "1d ago", match: 90, logo: "E", color: "#2EC4B6" },
  { id: "j7", title: "Python Data Analyst", company: "Analytics Corp", location: "Bangalore", salary: "₹5–8L/yr", type: "Full-time", skills: ["Python", "Pandas", "SQL"], posted: "4d ago", match: 65, logo: "A", color: "#FFD166", locked: true, xpRequired: 3500 },
  { id: "j8", title: "ML Engineer Jr.", company: "AI Ventures", location: "Pune", salary: "₹8–14L/yr", type: "Full-time", skills: ["Python", "TensorFlow", "ML"], posted: "3d ago", match: 60, logo: "M", color: "#9B6FFF", locked: true, xpRequired: 5000 },
];

interface ApplicationForm {
  name: string;
  email: string;
  phone: string;
  linkedin: string;
  github: string;
  coverLetter: string;
  experience: string;
  salary: string;
}

export default function Jobs() {
  const { user, toggleSaveJob } = useApp();
  const [search, setSearch] = useState("");
  const [jobType, setJobType] = useState("all");
  const [applied, setApplied] = useState<Set<string>>(new Set());
  const [applyingTo, setApplyingTo] = useState<typeof JOBS[0] | null>(null);
  const [appForm, setAppForm] = useState<ApplicationForm>({
    name: user.name, email: user.profile?.email || "", phone: user.profile?.phone || "",
    linkedin: user.profile?.linkedin || "", github: user.profile?.github || "",
    coverLetter: "", experience: "", salary: "",
  });
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const profileIncomplete = user.profileCompletion < 70;

  const filtered = JOBS.filter(j => {
    const matchesSearch = !search || j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.company.toLowerCase().includes(search.toLowerCase()) ||
      j.skills.some(s => s.toLowerCase().includes(search.toLowerCase()));
    const matchesType = jobType === "all" || j.type.toLowerCase().includes(jobType.toLowerCase());
    return matchesSearch && matchesType;
  });

  function openApply(job: typeof JOBS[0]) {
    if (job.locked && user.xp < (job.xpRequired || 0)) {
      showXPToast("🔒", `Need ${job.xpRequired?.toLocaleString()} XP to apply for this role`, "#FF4D4D");
      return;
    }
    setAppForm({
      name: user.name, email: user.profile?.email || "", phone: user.profile?.phone || "",
      linkedin: user.profile?.linkedin || "", github: user.profile?.github || "",
      coverLetter: "", experience: "", salary: "",
    });
    setFormErrors({});
    setSubmitted(false);
    setApplyingTo(job);
  }

  function validateApp() {
    const errors: Record<string, string> = {};
    if (!appForm.name.trim()) errors.name = "Full name is required";
    if (!appForm.email.trim() || !appForm.email.includes("@")) errors.email = "Valid email is required";
    if (!appForm.phone.trim()) errors.phone = "Phone number is required";
    if (!appForm.coverLetter.trim()) errors.coverLetter = "Cover letter is required";
    return errors;
  }

  function submitApplication() {
    const errors = validateApp();
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    const newApplied = new Set(applied);
    newApplied.add(applyingTo!.id);
    setApplied(newApplied);
    setSubmitted(true);
    setTimeout(() => {
      setApplyingTo(null);
      showXPToast("🚀", `Applied to ${applyingTo?.title} at ${applyingTo?.company}!`, "#2ECC8E");
    }, 1800);
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Briefcase size={22} style={{ color: "var(--lq-green)" }} /> Find Jobs
      </h1>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        AI-matched jobs based on your skills and XP level. Higher XP unlocks premium roles.
      </p>

      {/* Profile Incomplete Warning */}
      {profileIncomplete && (
        <div className="flex items-start gap-3 p-3.5 rounded-xl mb-4"
          style={{ background: "rgba(255,140,66,.07)", border: "1px solid rgba(255,140,66,.25)" }}>
          <AlertTriangle size={15} style={{ color: "var(--lq-orange)", flexShrink: 0, marginTop: 1 }} />
          <div className="flex-1 text-xs leading-relaxed" style={{ color: "rgba(200,180,140,1)" }}>
            <strong style={{ color: "var(--lq-orange)" }}>Your profile is {user.profileCompletion}% complete.</strong> Incomplete profiles are ranked lower in employer searches. Add your phone, email, LinkedIn, and GitHub to improve visibility.
          </div>
          <Link href="/settings">
            <button className="text-xs font-bold px-2.5 py-1.5 rounded-lg whitespace-nowrap"
              style={{ background: "rgba(255,140,66,.15)", color: "var(--lq-orange)", border: "1px solid rgba(255,140,66,.3)" }}>
              Fix Now →
            </button>
          </Link>
        </div>
      )}

      {/* Search & Filters */}
      <div className="flex gap-3 mb-4">
        <div className="flex-1 relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(90,96,122,1)" }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search jobs, skills, companies..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.13)", color: "white" }} />
        </div>
        <select value={jobType} onChange={e => setJobType(e.target.value)}
          className="px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer"
          style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.13)", color: "white" }}>
          <option value="all">All types</option>
          <option value="full-time">Full-time</option>
          <option value="internship">Internship</option>
          <option value="remote">Remote</option>
        </select>
      </div>

      <div className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
        Showing <strong style={{ color: "white" }}>{filtered.length}</strong> matches
      </div>

      <div className="space-y-3">
        {filtered.map(job => {
          const isSaved = user.savedJobs.includes(job.id);
          const isApplied = applied.has(job.id);
          const isLocked = job.locked && user.xp < (job.xpRequired || 0);
          return (
            <div key={job.id} className="p-4 rounded-2xl transition-all hover:-translate-y-0.5 relative overflow-hidden"
              style={{ background: "rgba(15,20,34,1)", border: `1px solid ${isLocked ? "rgba(255,255,255,.04)" : "rgba(255,255,255,0.07)"}`, opacity: isLocked ? 0.7 : 1 }}>
              {isLocked && (
                <div className="absolute top-2 right-2 text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)", border: "1px solid rgba(255,77,77,.2)" }}>
                  🔒 Needs {job.xpRequired?.toLocaleString()} XP
                </div>
              )}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-black flex-shrink-0"
                  style={{ background: `${job.color}20`, color: job.color, border: `1px solid ${job.color}30` }}>
                  {job.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h3 className="text-sm font-bold">{job.title}</h3>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{job.company}</div>
                    </div>
                    <div className="text-lg font-black flex-shrink-0"
                      style={{ color: job.match >= 90 ? "var(--lq-green)" : job.match >= 75 ? "var(--lq-yellow)" : "var(--lq-orange)" }}>
                      {job.match}%
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs mb-2" style={{ color: "rgba(136,144,168,1)" }}>
                    <span className="flex items-center gap-1"><MapPin size={11} /> {job.location}</span>
                    <span className="flex items-center gap-1"><DollarSign size={11} /> {job.salary}</span>
                    <span className="flex items-center gap-1"><Clock size={11} /> {job.posted}</span>
                    <span className="flex items-center gap-1 font-bold" style={{ color: "rgba(79,142,247,1)" }}>{job.type}</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {job.skills.map(s => (
                      <span key={s} className="px-2 py-0.5 rounded-md text-[10px] font-bold"
                        style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.07)" }}>{s}</span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => !isApplied && openApply(job)}
                      disabled={isApplied || isLocked}
                      className="flex-1 py-2 rounded-xl text-xs font-bold transition-all hover:scale-[1.02]"
                      style={isApplied
                        ? { background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }
                        : isLocked
                        ? { background: "rgba(255,255,255,.04)", color: "rgba(90,96,122,1)", border: "1px solid rgba(255,255,255,.07)", cursor: "not-allowed" }
                        : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", border: "none" }
                      }>
                      {isApplied ? "✓ Applied" : isLocked ? "🔒 Locked" : "Apply Now →"}
                    </button>
                    <button
                      onClick={() => { toggleSaveJob(job.id); showXPToast(isSaved ? "🗑️" : "🔖", isSaved ? "Job removed" : "Job saved!", isSaved ? "#FF4D4D" : "#4F8EF7"); }}
                      className="w-10 h-9 rounded-xl flex items-center justify-center transition-all"
                      style={{ background: isSaved ? "rgba(79,142,247,.1)" : "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)" }}>
                      {isSaved ? <BookmarkCheck size={15} style={{ color: "var(--lq-blue)" }} /> : <Bookmark size={15} style={{ color: "rgba(90,96,122,1)" }} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Application Modal */}
      {applyingTo && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl" style={{ background: "rgba(10,14,28,1)", border: "1px solid rgba(79,142,247,.25)" }}>
            {submitted ? (
              <div className="p-8 text-center">
                <div className="text-5xl mb-4 pop-in">🎉</div>
                <h2 className="text-xl font-black mb-2 gradient-text">Application Submitted!</h2>
                <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
                  Your application to <strong style={{ color: "white" }}>{applyingTo.title}</strong> at <strong style={{ color: "white" }}>{applyingTo.company}</strong> has been sent.
                </p>
                <p className="text-xs" style={{ color: "rgba(90,96,122,1)" }}>The employer will contact you at {appForm.email}</p>
              </div>
            ) : (
              <>
                <div className="sticky top-0 flex items-center justify-between p-5 pb-3" style={{ background: "rgba(10,14,28,.95)", borderBottom: "1px solid rgba(255,255,255,.06)" }}>
                  <div>
                    <h2 className="text-base font-black">Apply: {applyingTo.title}</h2>
                    <p className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{applyingTo.company} · {applyingTo.location}</p>
                  </div>
                  <button onClick={() => setApplyingTo(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                    <X size={18} style={{ color: "rgba(136,144,168,1)" }} />
                  </button>
                </div>
                <div className="p-5 space-y-4">
                  {profileIncomplete && (
                    <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                      style={{ background: "rgba(255,140,66,.07)", border: "1px solid rgba(255,140,66,.2)", color: "rgba(200,180,140,1)" }}>
                      <AlertTriangle size={13} style={{ color: "var(--lq-orange)", flexShrink: 0, marginTop: 1 }} />
                      Your profile is {user.profileCompletion}% complete. A complete profile improves your chances.
                    </div>
                  )}

                  {[
                    { key: "name", label: "Full Name *", placeholder: "Your full name", type: "text" },
                    { key: "email", label: "Email Address *", placeholder: "your@email.com", type: "email" },
                    { key: "phone", label: "Phone Number *", placeholder: "+91 98765 43210", type: "tel" },
                    { key: "linkedin", label: "LinkedIn Profile", placeholder: "https://linkedin.com/in/yourname", type: "url" },
                    { key: "github", label: "GitHub Profile", placeholder: "https://github.com/yourname", type: "url" },
                    { key: "experience", label: "Years of Experience", placeholder: "e.g. 0–1 year (fresher), 2 years...", type: "text" },
                    { key: "salary", label: "Expected Salary", placeholder: "e.g. ₹4–6L/year", type: "text" },
                  ].map(field => (
                    <div key={field.key}>
                      <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>{field.label}</label>
                      <input
                        type={field.type}
                        value={(appForm as any)[field.key]}
                        onChange={e => setAppForm(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                        style={{ background: "rgba(22,27,46,1)", border: `1px solid ${(formErrors as any)[field.key] ? "rgba(255,77,77,.5)" : "rgba(255,255,255,.1)"}`, color: "white" }}
                      />
                      {(formErrors as any)[field.key] && <p className="text-xs mt-1" style={{ color: "var(--lq-red)" }}>{(formErrors as any)[field.key]}</p>}
                    </div>
                  ))}

                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Cover Letter *</label>
                    <textarea
                      value={appForm.coverLetter}
                      onChange={e => setAppForm(p => ({ ...p, coverLetter: e.target.value }))}
                      placeholder="Why are you a great fit for this role? What have you built? What are your goals?"
                      rows={4}
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                      style={{ background: "rgba(22,27,46,1)", border: `1px solid ${formErrors.coverLetter ? "rgba(255,77,77,.5)" : "rgba(255,255,255,.1)"}`, color: "white" }}
                    />
                    {formErrors.coverLetter && <p className="text-xs mt-1" style={{ color: "var(--lq-red)" }}>{formErrors.coverLetter}</p>}
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setApplyingTo(null)}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                      style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.08)" }}>
                      Cancel
                    </button>
                    <button onClick={submitApplication}
                      className="flex-1 py-2.5 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-[1.02]">
                      Submit Application →
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
