import { useState } from "react";
import { Search, Star, MapPin, Award, X, Mail, Phone, Github, Linkedin, Twitter, Globe, AlertTriangle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

const TALENT = [
  {
    id: "t1", name: "Arjun Kumar", role: "Full Stack Developer", location: "Bangalore", level: 8, xp: 11200,
    skills: ["React", "Node.js", "MongoDB", "TypeScript"], rate: "₹600/hr", rating: 4.9, reviews: 23, available: true,
    avatar: "A", color: "#4F8EF7", certified: true,
    contact: { email: "arjun.kumar@gmail.com", phone: "+91 98765 43210", linkedin: "linkedin.com/in/arjunkumar", github: "github.com/arjunkumar", twitter: "@arjun_builds", website: "arjunkumar.dev" },
    bio: "3+ years building full-stack apps. React + Node.js specialist. Available for freelance and contract work.",
  },
  {
    id: "t2", name: "Priya Mehta", role: "UI/UX Designer & Developer", location: "Remote", level: 7, xp: 9400,
    skills: ["Figma", "React", "CSS", "Animation"], rate: "₹550/hr", rating: 4.8, reviews: 18, available: true,
    avatar: "P", color: "#9B6FFF", certified: true,
    contact: { email: "priya.mehta@gmail.com", phone: "+91 87654 32109", linkedin: "linkedin.com/in/priyamehta", github: "github.com/priyam", twitter: "@priya_designs", website: "" },
    bio: "Turning ideas into beautiful, user-friendly interfaces. Figma + React. Open to remote opportunities.",
  },
  {
    id: "t3", name: "Ravi Sharma", role: "Python Data Scientist", location: "Pune", level: 7, xp: 8900,
    skills: ["Python", "Pandas", "ML", "TensorFlow"], rate: "₹700/hr", rating: 4.7, reviews: 15, available: false,
    avatar: "R", color: "#2ECC8E", certified: true,
    contact: { email: "ravi.sharma@gmail.com", phone: "+91 76543 21098", linkedin: "linkedin.com/in/ravisharma", github: "github.com/ravisharma", twitter: "", website: "" },
    bio: "Data scientist specializing in ML model development and data pipelines. Currently busy — check back soon.",
  },
  {
    id: "t4", name: "Anita Desai", role: "Frontend Developer", location: "Mumbai", level: 6, xp: 7200,
    skills: ["React", "Vue.js", "JavaScript", "CSS"], rate: "₹400/hr", rating: 4.8, reviews: 31, available: true,
    avatar: "A", color: "#FF8C42", certified: true,
    contact: { email: "anita.desai@gmail.com", phone: "+91 65432 10987", linkedin: "linkedin.com/in/anitadesai", github: "github.com/anitad", twitter: "@anita_frontend", website: "" },
    bio: "Frontend dev with a love for clean, accessible code. React and Vue.js. Open source contributor.",
  },
  {
    id: "t5", name: "Karan Tiwari", role: "DevOps Engineer", location: "Remote", level: 6, xp: 6800,
    skills: ["Docker", "Kubernetes", "AWS", "Linux"], rate: "₹650/hr", rating: 4.6, reviews: 9, available: true,
    avatar: "K", color: "#FF5FA0", certified: false,
    contact: { email: "karan.tiwari@gmail.com", phone: "+91 54321 09876", linkedin: "linkedin.com/in/karantiwari", github: "github.com/karant", twitter: "", website: "karantiwari.io" },
    bio: "Infrastructure engineer. Docker, Kubernetes, and AWS. I automate so developers don't have to worry.",
  },
  {
    id: "t6", name: "Meera Joshi", role: "JavaScript Developer", location: "Delhi", level: 5, xp: 5500,
    skills: ["JavaScript", "React", "Next.js", "GraphQL"], rate: "₹350/hr", rating: 4.7, reviews: 14, available: true,
    avatar: "M", color: "#2EC4B6", certified: true,
    contact: { email: "meera.joshi@gmail.com", phone: "+91 43210 98765", linkedin: "linkedin.com/in/meerajoshi", github: "github.com/meeraj", twitter: "@meera_js", website: "" },
    bio: "JavaScript and React developer. Next.js and GraphQL enthusiast. Available for full-time and freelance.",
  },
];

const SKILL_FILTERS = ["React", "Node.js", "Python", "JavaScript", "TypeScript", "Figma", "AWS", "MongoDB"];

export default function Hire() {
  const { user } = useApp();
  const [search, setSearch] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [contactingTalent, setContactingTalent] = useState<typeof TALENT[0] | null>(null);

  const profileIncomplete = user.profileCompletion < 70;

  const filtered = TALENT.filter(t => {
    const matchesSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.role.toLowerCase().includes(search.toLowerCase());
    const matchesSkills = selectedSkills.length === 0 || selectedSkills.some(s => t.skills.includes(s));
    const matchesAvail = !availableOnly || t.available;
    return matchesSearch && matchesSkills && matchesAvail;
  });

  function toggleSkill(skill: string) {
    setSelectedSkills(prev => prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]);
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Search size={22} style={{ color: "var(--lq-teal)" }} /> Hire Talent
      </h1>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        Connect with verified AVIxAI learners. All talent is skill-tested and XP-verified.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-4">
        {/* Filters */}
        <div className="p-4 rounded-2xl h-fit sticky top-20" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
          <div className="text-xs font-bold uppercase tracking-wider mb-4" style={{ color: "rgba(90,96,122,1)" }}>Filters</div>
          <div className="mb-4">
            <div className="text-xs font-bold mb-2" style={{ color: "white" }}>Skills</div>
            <div className="flex flex-wrap gap-1.5">
              {SKILL_FILTERS.map(skill => (
                <button key={skill} onClick={() => toggleSkill(skill)}
                  className="px-2 py-1 rounded-lg text-[10px] font-bold transition-all"
                  style={selectedSkills.includes(skill)
                    ? { background: "rgba(79,142,247,.15)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.3)" }
                    : { background: "rgba(22,27,46,1)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.06)" }
                  }>
                  {skill}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setAvailableOnly(!availableOnly)}
              className="w-9 h-5 rounded-full relative transition-all"
              style={{ background: availableOnly ? "var(--lq-blue)" : "rgba(255,255,255,.1)" }}>
              <div className="w-3.5 h-3.5 bg-white rounded-full absolute top-0.5 transition-all"
                style={{ left: availableOnly ? "calc(100% - 18px)" : "3px" }} />
            </button>
            <span className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Available now</span>
          </div>
        </div>

        {/* Talent Grid */}
        <div>
          <div className="relative mb-4">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(90,96,122,1)" }} />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, role or skill..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.13)", color: "white" }} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filtered.map(talent => (
              <div key={talent.id} className="p-4 rounded-2xl transition-all hover:-translate-y-0.5"
                style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,.07)" }}>
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
                    style={{ background: `${talent.color}20`, color: talent.color }}>
                    {talent.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold">{talent.name}</span>
                      {talent.certified && <Award size={12} style={{ color: "var(--lq-yellow)" }} />}
                    </div>
                    <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{talent.role}</div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin size={10} style={{ color: "rgba(90,96,122,1)" }} />
                      <span className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>{talent.location}</span>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: talent.available ? "var(--lq-green)" : "rgba(90,96,122,1)" }} />
                      <span className="text-[10px] font-bold" style={{ color: talent.available ? "var(--lq-green)" : "rgba(90,96,122,1)" }}>
                        {talent.available ? "Available" : "Busy"}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-sm font-black">{talent.rate}</div>
                    <div className="flex items-center gap-0.5 justify-end">
                      <Star size={10} fill="var(--lq-yellow)" style={{ color: "var(--lq-yellow)" }} />
                      <span className="text-[10px] font-bold">{talent.rating} ({talent.reviews})</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(155,111,255,.1)", color: "var(--lq-purple)", border: "1px solid rgba(155,111,255,.2)" }}>
                    Lv.{talent.level}
                  </span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(255,209,102,.08)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.18)" }}>
                    ⚡ {talent.xp.toLocaleString()} XP
                  </span>
                </div>

                <p className="text-xs mb-2 leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>{talent.bio}</p>

                <div className="flex flex-wrap gap-1 mb-3">
                  {talent.skills.slice(0, 4).map(s => (
                    <span key={s} className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                      style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)" }}>{s}</span>
                  ))}
                </div>

                <button
                  onClick={() => setContactingTalent(talent)}
                  className="w-full py-2 rounded-xl text-xs font-bold transition-all gradient-bg text-white hover:scale-[1.02]">
                  Contact {talent.name.split(" ")[0]} →
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Details Modal */}
      {contactingTalent && (
        <div className="fixed inset-0 z-[400] flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.75)", backdropFilter: "blur(8px)" }}>
          <div className="w-full max-w-md rounded-2xl" style={{ background: "rgba(10,14,28,1)", border: "1px solid rgba(46,204,142,.25)" }}>
            <div className="flex items-center justify-between p-5 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,.06)" }}>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl font-black"
                  style={{ background: `${contactingTalent.color}20`, color: contactingTalent.color }}>
                  {contactingTalent.avatar}
                </div>
                <div>
                  <h2 className="text-base font-black">{contactingTalent.name}</h2>
                  <p className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{contactingTalent.role}</p>
                </div>
              </div>
              <button onClick={() => setContactingTalent(null)} className="p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                <X size={18} style={{ color: "rgba(136,144,168,1)" }} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {profileIncomplete && (
                <div className="flex items-start gap-2 p-3 rounded-xl text-xs"
                  style={{ background: "rgba(255,140,66,.07)", border: "1px solid rgba(255,140,66,.2)", color: "rgba(200,180,140,1)" }}>
                  <AlertTriangle size={12} style={{ color: "var(--lq-orange)", flexShrink: 0, marginTop: 1 }} />
                  Your profile is only {user.profileCompletion}% complete. Complete it so {contactingTalent.name.split(" ")[0]} can also see your details and contact you back.
                </div>
              )}

              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "rgba(90,96,122,1)" }}>
                Contact Details
              </div>

              {[
                { icon: <Mail size={14} style={{ color: "var(--lq-blue)" }} />, label: "Email", value: contactingTalent.contact.email, href: `mailto:${contactingTalent.contact.email}` },
                { icon: <Phone size={14} style={{ color: "var(--lq-green)" }} />, label: "Phone", value: contactingTalent.contact.phone, href: `tel:${contactingTalent.contact.phone}` },
                { icon: <Linkedin size={14} style={{ color: "#0A66C2" }} />, label: "LinkedIn", value: contactingTalent.contact.linkedin, href: `https://${contactingTalent.contact.linkedin}` },
                { icon: <Github size={14} style={{ color: "white" }} />, label: "GitHub", value: contactingTalent.contact.github, href: `https://${contactingTalent.contact.github}` },
                ...(contactingTalent.contact.twitter ? [{ icon: <Twitter size={14} style={{ color: "#1DA1F2" }} />, label: "Twitter", value: contactingTalent.contact.twitter, href: `https://twitter.com/${contactingTalent.contact.twitter.replace("@", "")}` }] : []),
                ...(contactingTalent.contact.website ? [{ icon: <Globe size={14} style={{ color: "var(--lq-purple)" }} />, label: "Website", value: contactingTalent.contact.website, href: `https://${contactingTalent.contact.website}` }] : []),
              ].map((item, i) => (
                <a key={i} href={item.href} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl transition-all hover:scale-[1.01]"
                  style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,.07)", textDecoration: "none" }}>
                  <div className="flex-shrink-0">{item.icon}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "rgba(90,96,122,1)" }}>{item.label}</div>
                    <div className="text-xs font-medium truncate" style={{ color: "rgba(232,234,240,1)" }}>{item.value}</div>
                  </div>
                  <div className="text-[10px]" style={{ color: "rgba(90,96,122,1)" }}>→</div>
                </a>
              ))}

              <div className="pt-2">
                <div className="flex gap-2">
                  <a href={`mailto:${contactingTalent.contact.email}?subject=Hiring Inquiry from AVIxAI`}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold text-center gradient-bg text-white">
                    Send Email
                  </a>
                  <button onClick={() => { setContactingTalent(null); showXPToast("✅", `Contact details saved for ${contactingTalent.name}!`, "#2ECC8E"); }}
                    className="flex-1 py-2.5 rounded-xl text-xs font-bold"
                    style={{ background: "rgba(255,255,255,.05)", color: "rgba(136,144,168,1)", border: "1px solid rgba(255,255,255,.08)" }}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
