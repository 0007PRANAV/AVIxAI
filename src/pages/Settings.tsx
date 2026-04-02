import { useState } from "react";
import { Settings, Info, HelpCircle, Palette, Bell, Shield, Star, ChevronRight, Mail, Phone, Bot, ExternalLink, User, AlertTriangle, CheckCircle, LogOut, MessageSquare } from "lucide-react";
import { useApp, type ColorTheme } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

const APP_VERSION = "2.0.0";
const APP_NAME = "AVIxAI";

const THEMES: { id: ColorTheme; name: string; primary: string; secondary: string }[] = [
  { id: "blue", name: "Ocean Blue", primary: "#4F8EF7", secondary: "#9B6FFF" },
  { id: "purple", name: "Royal Purple", primary: "#A855F7", secondary: "#D946EF" },
  { id: "green", name: "Emerald", primary: "#10B981", secondary: "#2EC4B6" },
  { id: "orange", name: "Sunset", primary: "#F97316", secondary: "#EF4444" },
  { id: "pink", name: "Cherry Blossom", primary: "#EC4899", secondary: "#F43F5E" },
];

type SettingsSection = "about" | "help" | "theme" | "notifications" | "privacy" | "account" | "feedback";

export default function SettingsPage() {
  const { user, setColorTheme, updateProfile } = useApp();
  const [activeSection, setActiveSection] = useState<SettingsSection>("about");
  const [notifSettings, setNotifSettings] = useState({ streakReminder: true, xpUpdates: true, weeklyReport: false, jobAlerts: true });
  const [profileForm, setProfileForm] = useState({
    name: user.name,
    phone: user.profile?.phone || "",
    email: user.profile?.email || "",
    linkedin: user.profile?.linkedin || "",
    github: user.profile?.github || "",
    twitter: user.profile?.twitter || "",
    bio: user.profile?.bio || "",
    location: user.profile?.location || "",
    website: user.profile?.website || "",
  });
  const [profileSaved, setProfileSaved] = useState(false);
  const [feedbackForm, setFeedbackForm] = useState({ subject: "", message: "", rating: 5 });
  const [feedbackSent, setFeedbackSent] = useState(false);

  const MENU_ITEMS: { id: SettingsSection; label: string; icon: React.ReactNode; desc: string }[] = [
    { id: "about", label: "About AVIxAI", icon: <Info size={16} />, desc: "App info and version" },
    { id: "help", label: "Get Help", icon: <HelpCircle size={16} />, desc: "Contact support, AI agent" },
    { id: "theme", label: "Color Theme", icon: <Palette size={16} />, desc: "Customize your experience" },
    { id: "notifications", label: "Notifications", icon: <Bell size={16} />, desc: "Manage alerts and reminders" },
    { id: "privacy", label: "Privacy & Security", icon: <Shield size={16} />, desc: "Data and account security" },
    { id: "account", label: "Edit Profile", icon: <User size={16} />, desc: "Name, contact, social links" },
    { id: "feedback", label: "Send Feedback", icon: <MessageSquare size={16} />, desc: "Help us improve AVIxAI" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Settings size={22} style={{ color: "var(--lq-blue)" }} /> Settings
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>Customize your AVIxAI experience.</p>

      <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-4">
        {/* Menu */}
        <div className="flex flex-col gap-1 md:sticky md:top-20 md:self-start">
          {MENU_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left"
              style={activeSection === item.id
                ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.15)" }
                : { color: "rgba(136,144,168,1)", border: "1px solid transparent" }
              }
              data-testid={`settings-nav-${item.id}`}
            >
              <span>{item.icon}</span>
              <div>
                <div>{item.label}</div>
                <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>{item.desc}</div>
              </div>
              <ChevronRight size={13} className="ml-auto opacity-50" />
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="p-5 rounded-2xl" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
          {activeSection === "about" && (
            <div>
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><Info size={18} style={{ color: "var(--lq-blue)" }} /> About {APP_NAME}</h2>
              <div className="text-center mb-6">
                <div className="text-5xl font-black mb-2">Learn<span style={{ color: "var(--lq-blue)" }}>Quest</span></div>
                <div className="text-sm font-bold mb-1" style={{ color: "var(--lq-purple)" }}>v{APP_VERSION}</div>
                <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Learn. Certify. Get Hired.</div>
              </div>
              <div className="space-y-3">
                {[
                  { label: "App Version", value: `v${APP_VERSION}` },
                  { label: "Platform", value: "AVIxAI Web" },
                  { label: "Build", value: "Production" },
                  { label: "Mission", value: "Democratizing quality tech education" },
                  { label: "Headquarters", value: "India 🇮🇳" },
                  { label: "Learners", value: "50,000+" },
                  { label: "Courses", value: "9 active + more coming" },
                  { label: "XP System", value: "Gamified with real rewards" },
                ].map(row => (
                  <div key={row.label} className="flex justify-between items-center py-2" style={{ borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <span className="text-sm" style={{ color: "rgba(136,144,168,1)" }}>{row.label}</span>
                    <span className="text-sm font-bold">{row.value}</span>
                  </div>
                ))}
              </div>
              <div className="mt-5 p-4 rounded-xl text-sm leading-relaxed" style={{ background: "rgba(79,142,247,.05)", border: "1px solid rgba(79,142,247,.1)", color: "rgba(136,144,168,1)" }}>
                AVIxAI is an AI-powered gamified learning platform designed to help individuals learn tech skills, prove their abilities, and get hired. Our XP-based system, streak tracking, and real rewards make learning addictive in the best way possible.
              </div>
            </div>
          )}

          {activeSection === "help" && (
            <div>
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><HelpCircle size={18} style={{ color: "var(--lq-purple)" }} /> Get Help</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-5">
                {[
                  { icon: <Mail size={20} style={{ color: "var(--lq-blue)" }} />, title: "Email Support", value: "support@learnquest.app", desc: "We typically reply within 24 hours", action: () => window.open("mailto:support@learnquest.app") },
                  { icon: <Phone size={20} style={{ color: "var(--lq-green)" }} />, title: "Phone Support", value: "+91 98765 43210", desc: "Mon–Sat, 9 AM – 6 PM IST", action: () => window.open("tel:+919876543210") },
                ].map((contact, i) => (
                  <button
                    key={i}
                    onClick={contact.action}
                    className="flex items-start gap-3 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 w-full"
                    style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)" }}
                    data-testid={`contact-${i}`}
                  >
                    <div className="mt-0.5">{contact.icon}</div>
                    <div>
                      <div className="text-sm font-bold mb-0.5">{contact.title}</div>
                      <div className="text-sm font-black mb-1" style={{ color: "var(--lq-blue)" }}>{contact.value}</div>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{contact.desc}</div>
                    </div>
                    <ExternalLink size={13} className="ml-auto mt-1 opacity-30" />
                  </button>
                ))}
              </div>

              {/* AI Support Agent */}
              <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(155,111,255,.08), rgba(79,142,247,.08))", border: "1px solid rgba(155,111,255,.2)" }}>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center agent-glow"
                    style={{ background: "linear-gradient(135deg, var(--lq-purple), var(--lq-blue))" }}>
                    <Bot size={18} style={{ color: "white" }} />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Aria — AI Support Agent</div>
                    <div className="flex items-center gap-1.5 text-xs" style={{ color: "var(--lq-green)" }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--lq-green)", animation: "urgentPulse 1.5s infinite" }} />
                      Online 24/7
                    </div>
                  </div>
                </div>
                <p className="text-xs mb-3 leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>
                  Aria is our AI-powered support agent. She can help you with course questions, XP issues, account problems, and learning guidance — instantly, anytime.
                </p>
                <button
                  className="gradient-bg text-white text-sm font-bold px-4 py-2.5 rounded-xl transition-transform hover:scale-105"
                  onClick={() => showXPToast("🤖", "Launching AI support agent...", "#9B6FFF")}
                  data-testid="launch-ai-agent-btn"
                >
                  Chat with Aria →
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                {[
                  "📚 How does XP work?",
                  "🔥 How do I maintain my streak?",
                  "💼 How do I find jobs?",
                  "🛒 How do I redeem XP rewards?",
                  "🎓 How do I get my certificate?",
                  "📱 Is there a mobile app?",
                ].map(q => (
                  <button
                    key={q}
                    className="text-left px-3 py-2.5 rounded-xl text-xs font-medium transition-all hover:bg-white/[0.04]"
                    style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)", color: "rgba(136,144,168,1)" }}
                    onClick={() => showXPToast("🤖", `Aria: "${q}" — Opening help article...`, "#9B6FFF")}
                    data-testid={`faq-${q}`}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === "theme" && (
            <div>
              <h2 className="text-lg font-black mb-1 flex items-center gap-2"><Palette size={18} style={{ color: "var(--lq-purple)" }} /> Color Theme</h2>
              <p className="text-xs mb-5" style={{ color: "rgba(136,144,168,1)" }}>Choose a color theme that matches your personality. Changes apply immediately.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {THEMES.map(theme => (
                  <button
                    key={theme.id}
                    onClick={() => { setColorTheme(theme.id); showXPToast("🎨", `Theme changed to ${theme.name}!`, theme.primary); }}
                    className="flex items-center gap-3 p-4 rounded-xl text-left transition-all hover:-translate-y-0.5 w-full"
                    style={{
                      background: user.colorTheme === theme.id ? `${theme.primary}12` : "rgba(22,27,46,1)",
                      border: user.colorTheme === theme.id ? `2px solid ${theme.primary}` : "1px solid rgba(255,255,255,.07)",
                    }}
                    data-testid={`theme-${theme.id}`}
                  >
                    <div className="flex gap-1.5">
                      <div className="w-6 h-6 rounded-full" style={{ background: theme.primary }} />
                      <div className="w-6 h-6 rounded-full" style={{ background: theme.secondary }} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">{theme.name}</div>
                      <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>{theme.id}</div>
                    </div>
                    {user.colorTheme === theme.id && (
                      <div className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: `${theme.primary}20`, color: theme.primary }}>
                        Active
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeSection === "notifications" && (
            <div>
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><Bell size={18} style={{ color: "var(--lq-orange)" }} /> Notifications</h2>
              <div className="space-y-3">
                {[
                  { key: "streakReminder" as const, label: "Streak Reminder", desc: "Daily reminder to maintain your streak", icon: "🔥" },
                  { key: "xpUpdates" as const, label: "XP Updates", desc: "Notifications when you earn XP or level up", icon: "⚡" },
                  { key: "weeklyReport" as const, label: "Weekly Report", desc: "Summary of your weekly progress", icon: "📊" },
                  { key: "jobAlerts" as const, label: "Job Alerts", desc: "New job matches based on your skills", icon: "💼" },
                ].map(setting => (
                  <div key={setting.key} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid rgba(255,255,255,.05)" }}>
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{setting.icon}</span>
                      <div>
                        <div className="text-sm font-bold">{setting.label}</div>
                        <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{setting.desc}</div>
                      </div>
                    </div>
                    <button
                      onClick={() => setNotifSettings(prev => ({ ...prev, [setting.key]: !prev[setting.key] }))}
                      className="w-11 h-6 rounded-full relative transition-all"
                      style={{ background: notifSettings[setting.key] ? "var(--lq-blue)" : "rgba(255,255,255,.1)" }}
                      data-testid={`toggle-${setting.key}`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all"
                        style={{ left: notifSettings[setting.key] ? "calc(100% - 20px)" : "4px" }} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "privacy" && (
            <div>
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><Shield size={18} style={{ color: "var(--lq-green)" }} /> Privacy & Security</h2>
              <div className="space-y-3 text-sm">
                {[
                  { title: "Anti-cheat Monitoring", desc: "Camera and screen are monitored during quizzes/courses for academic integrity. Data is not stored.", icon: "🎥" },
                  { title: "Data Privacy", desc: "Your learning data is private by default. Only your public profile is visible to others.", icon: "🔒" },
                  { title: "XP & Progress", desc: "Your XP, streak, and course progress are securely stored and never shared without consent.", icon: "🛡️" },
                  { title: "Referral Data", desc: "Referral links track join events only. No personal data of referred users is shared with you.", icon: "🔗" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.06)" }}>
                    <span className="text-xl flex-shrink-0">{item.icon}</span>
                    <div>
                      <div className="font-bold mb-0.5">{item.title}</div>
                      <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{item.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === "account" && (
            <div>
              <h2 className="text-lg font-black mb-1 flex items-center gap-2"><User size={18} style={{ color: "var(--lq-yellow)" }} /> Edit Profile</h2>
              <p className="text-xs mb-4" style={{ color: "rgba(136,144,168,1)" }}>
                Keep your profile complete to be visible to hirers and improve job match quality.
              </p>

              {/* Profile Completion Bar */}
              <div className="p-3 rounded-xl mb-4" style={{ background: user.profileCompletion < 70 ? "rgba(255,140,66,.07)" : "rgba(46,204,142,.07)", border: `1px solid ${user.profileCompletion < 70 ? "rgba(255,140,66,.2)" : "rgba(46,204,142,.2)"}` }}>
                <div className="flex items-center gap-2 mb-2">
                  {user.profileCompletion < 70
                    ? <AlertTriangle size={13} style={{ color: "var(--lq-orange)" }} />
                    : <CheckCircle size={13} style={{ color: "var(--lq-green)" }} />
                  }
                  <span className="text-xs font-bold" style={{ color: user.profileCompletion < 70 ? "var(--lq-orange)" : "var(--lq-green)" }}>
                    Profile {user.profileCompletion}% complete
                    {user.profileCompletion < 70 && " — Fill in missing fields to improve job visibility"}
                  </span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.08)" }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${user.profileCompletion}%`, background: user.profileCompletion < 70 ? "var(--lq-orange)" : "var(--lq-green)" }} />
                </div>
              </div>

              {/* Profile Form */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Full Name *</label>
                    <input value={profileForm.name} onChange={e => setProfileForm(p => ({ ...p, name: e.target.value }))}
                      placeholder="Your full name"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Location</label>
                    <input value={profileForm.location} onChange={e => setProfileForm(p => ({ ...p, location: e.target.value }))}
                      placeholder="e.g. Bangalore, India"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Email Address *</label>
                    <input type="email" value={profileForm.email} onChange={e => setProfileForm(p => ({ ...p, email: e.target.value }))}
                      placeholder="your@email.com"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Phone Number *</label>
                    <input type="tel" value={profileForm.phone} onChange={e => setProfileForm(p => ({ ...p, phone: e.target.value }))}
                      placeholder="+91 98765 43210"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Bio *</label>
                  <textarea value={profileForm.bio} onChange={e => setProfileForm(p => ({ ...p, bio: e.target.value }))}
                    placeholder="Tell hirers and other learners about yourself, your goals, and what you're building..."
                    rows={3} className="w-full px-3 py-2.5 rounded-xl text-sm outline-none resize-none"
                    style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>LinkedIn URL *</label>
                    <input value={profileForm.linkedin} onChange={e => setProfileForm(p => ({ ...p, linkedin: e.target.value }))}
                      placeholder="https://linkedin.com/in/yourname"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>GitHub URL *</label>
                    <input value={profileForm.github} onChange={e => setProfileForm(p => ({ ...p, github: e.target.value }))}
                      placeholder="https://github.com/yourname"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Twitter / X</label>
                    <input value={profileForm.twitter} onChange={e => setProfileForm(p => ({ ...p, twitter: e.target.value }))}
                      placeholder="@yourhandle"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                  <div>
                    <label className="text-xs font-bold mb-1.5 block" style={{ color: "rgba(136,144,168,1)" }}>Personal Website</label>
                    <input value={profileForm.website} onChange={e => setProfileForm(p => ({ ...p, website: e.target.value }))}
                      placeholder="https://yourwebsite.com"
                      className="w-full px-3 py-2.5 rounded-xl text-sm outline-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }} />
                  </div>
                </div>

                {profileSaved && (
                  <div className="flex items-center gap-2 p-3 rounded-xl text-xs font-bold"
                    style={{ background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }}>
                    <CheckCircle size={13} /> Profile saved successfully! Completion: {user.profileCompletion}%
                  </div>
                )}

                <button
                  onClick={() => {
                    updateProfile({
                      phone: profileForm.phone, email: profileForm.email,
                      linkedin: profileForm.linkedin, github: profileForm.github,
                      twitter: profileForm.twitter, bio: profileForm.bio,
                      location: profileForm.location, website: profileForm.website,
                    }, profileForm.name);
                    setProfileSaved(true);
                    showXPToast("✅", "Profile updated successfully!", "#2ECC8E");
                    setTimeout(() => setProfileSaved(false), 4000);
                  }}
                  className="w-full py-3 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-[1.02]"
                >
                  Save Profile
                </button>

                <div className="pt-2 border-t" style={{ borderColor: "rgba(255,255,255,.06)" }}>
                  <div className="text-xs font-bold mb-2" style={{ color: "rgba(90,96,122,1)" }}>Account info</div>
                  <div className="text-xs py-1.5 flex justify-between" style={{ color: "rgba(136,144,168,1)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <span>Level</span><strong style={{ color: "white" }}>Level {user.level}</strong>
                  </div>
                  <div className="text-xs py-1.5 flex justify-between" style={{ color: "rgba(136,144,168,1)", borderBottom: "1px solid rgba(255,255,255,.04)" }}>
                    <span>Total XP</span><strong style={{ color: "var(--lq-yellow)" }}>{user.xp.toLocaleString()} XP</strong>
                  </div>
                  <div className="text-xs py-1.5 flex justify-between" style={{ color: "rgba(136,144,168,1)" }}>
                    <span>Referral code</span><strong style={{ color: "var(--lq-purple)" }}>{user.referralCode}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "feedback" && (
            <div>
              <h2 className="text-lg font-black mb-4 flex items-center gap-2"><MessageSquare size={18} style={{ color: "var(--lq-blue)" }} /> Send Feedback</h2>
              <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>Your feedback helps us improve AVIxAI. What's on your mind?</p>

              {feedbackSent ? (
                <div className="p-6 rounded-2xl text-center" style={{ background: "rgba(46,204,142,.08)", border: "1px solid rgba(46,204,142,.2)" }}>
                  <div className="text-4xl mb-3">✅</div>
                  <div className="text-lg font-black mb-2">Thank you for your feedback!</div>
                  <div className="text-sm" style={{ color: "rgba(136,144,168,1)" }}>We've received your message and will review it shortly. You rock! 🚀</div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(136,144,168,1)" }}>Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(i => (
                        <button
                          key={i}
                          onClick={() => setFeedbackForm(prev => ({ ...prev, rating: i }))}
                          className="text-2xl transition-transform hover:scale-125"
                          style={{ opacity: feedbackForm.rating >= i ? 1 : 0.3 }}>
                          ⭐
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(136,144,168,1)" }}>Subject</label>
                    <input
                      type="text"
                      placeholder="e.g., Difficulty tracking, Feature request, Bug report..."
                      value={feedbackForm.subject}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, subject: e.target.value }))}
                      className="w-full px-4 py-2.5 rounded-lg text-sm"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold mb-2 block" style={{ color: "rgba(136,144,168,1)" }}>Message</label>
                    <textarea
                      placeholder="Tell us what you think. Be as detailed as possible to help us understand your experience better."
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm(prev => ({ ...prev, message: e.target.value }))}
                      rows={5}
                      className="w-full px-4 py-2.5 rounded-lg text-sm outline-none resize-none"
                      style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
                    />
                  </div>

                  <button
                    onClick={() => {
                      if (feedbackForm.subject.trim() && feedbackForm.message.trim()) {
                        setFeedbackSent(true);
                        showXPToast("📨", "Feedback sent! Thank you!", "var(--lq-green)");
                        setTimeout(() => setFeedbackSent(false), 5000);
                      } else {
                        showXPToast("⚠️", "Please fill in subject and message", "#FF4D4D");
                      }
                    }}
                    className="w-full py-3 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-[1.02]"
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="mt-8 pt-8 border-t" style={{ borderColor: "rgba(255,255,255,.07)" }}>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.href = "/";
              showXPToast("👋", "You've been logged out. See you soon!", "#FF5FA0");
            }}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all"
            style={{ background: "rgba(255,77,77,.1)", color: "var(--lq-red)" }}
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
}
