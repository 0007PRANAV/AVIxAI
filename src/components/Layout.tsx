import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Bell, Zap, Flame, ShoppingBag, BookOpen, Trophy, Briefcase, Bot, Home, Users, Settings, Star, Gift, LayoutDashboard, GraduationCap, Search, ChevronRight, Shield, Award, LogOut } from "lucide-react";
import { useApp, getLevelFromXP, getXPForLevel, getXPForNextLevel } from "@/context/AppContext";
import { NotificationPanel } from "./NotificationPanel";

const LEARNER_NAV = [
  { section: "Learn", items: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/courses", label: "Courses", icon: BookOpen },
    { href: "/quizzes", label: "Quizzes", icon: Star },
    { href: "/streak", label: "Streak", icon: Flame },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
  ]},
  { section: "Work", items: [
    { href: "/jobs", label: "Find Jobs", icon: Briefcase },
    { href: "/agent", label: "AI Agent", icon: Bot },
  ]},
  { section: "Tools", items: [
    { href: "/store", label: "XP Store", icon: ShoppingBag },
    { href: "/referral", label: "Invite Friends", icon: Gift },
    { href: "/community", label: "Community", icon: Users },
    { href: "/friends", label: "Friends", icon: Users },
    { href: "/portfolio", label: "Portfolio", icon: GraduationCap },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

const HIRER_NAV = [
  { section: "Hire", items: [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/hire", label: "Hire Talent", icon: Search },
    { href: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { href: "/agent", label: "AI Agent", icon: Bot },
  ]},
  { section: "Tools", items: [
    { href: "/community", label: "Community", icon: Users },
    { href: "/friends", label: "Friends", icon: Users },
    { href: "/portfolio", label: "My Portfolio", icon: GraduationCap },
    { href: "/settings", label: "Settings", icon: Settings },
  ]},
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, setMode, unreadCount } = useApp();
  const [location] = useLocation();
  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const currentXP = user.xp;
  const currentLevel = user.level;
  const xpForCurrentLevel = getXPForLevel(currentLevel);
  const xpForNextLevel = getXPForNextLevel(currentLevel);
  const xpProgress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

  const levelColors: Record<number, string> = {
    1: "#2ECC8E", 2: "#4F8EF7", 3: "#9B6FFF", 4: "#FFD166", 5: "#FF8C42", 6: "#FF5FA0",
  };
  const levelColor = levelColors[Math.min(currentLevel, 6)] || "#FF5FA0";

  const navGroups = user.mode === "hirer" ? HIRER_NAV : LEARNER_NAV;

  return (
    <div className="min-h-screen" style={{ fontFamily: "Outfit, sans-serif" }}>
      {/* Top Nav */}
      <nav
        className="fixed top-0 left-0 right-0 z-[200] h-[60px] flex items-center justify-between px-5"
        style={{ background: "rgba(8,11,20,.92)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}
      >
        <div className="flex items-center gap-4">
          <button
            className="lg:hidden p-1.5 rounded-lg"
            style={{ background: "rgba(255,255,255,.06)" }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            data-testid="sidebar-toggle"
          >
            <div className="space-y-1.5">
              <div className="w-5 h-0.5 bg-white/60" />
              <div className="w-5 h-0.5 bg-white/60" />
              <div className="w-5 h-0.5 bg-white/60" />
            </div>
          </button>
          <Link href="/">
            <span className="text-xl font-black tracking-tight cursor-pointer" data-testid="logo">
              AVI<span style={{ color: "var(--lq-blue)" }}>xAI</span>
            </span>
          </Link>
        </div>

        {/* Mode Toggle */}
        <div className="hidden md:flex items-center gap-2 px-1 py-1 rounded-full" style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.13)" }}>
          <button
            onClick={() => setMode("learner")}
            className="px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={user.mode === "learner" ? { background: "var(--lq-blue)", color: "#fff" } : { color: "rgba(136,144,168,1)" }}
            data-testid="mode-learner"
          >Learner</button>
          <button
            onClick={() => setMode("hirer")}
            className="px-3 py-1 rounded-full text-xs font-bold transition-all"
            style={user.mode === "hirer" ? { background: "var(--lq-purple)", color: "#fff" } : { color: "rgba(136,144,168,1)" }}
            data-testid="mode-hirer"
          >Hirer</button>
        </div>

        <div className="flex items-center gap-2">
          {/* XP Pill */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
            style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.13)", color: "var(--lq-yellow)" }}
            data-testid="nav-xp"
          >
            <Zap size={13} />
            <span>{user.xp.toLocaleString()} XP</span>
          </div>

          {/* Streak Pill */}
          <Link href="/streak">
            <div className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer"
              style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.13)", color: "var(--lq-orange)" }}
              data-testid="nav-streak"
            >
              <span className="fire-anim">🔥</span>
              <span>{user.streak}</span>
              {user.streak > 0 && (
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full pulse-dot"
                  style={{ background: "var(--lq-red)", border: "2px solid #080B14" }} />
              )}
            </div>
          </Link>

          {/* Notifications */}
          <button
            className="relative p-2 rounded-xl transition-all"
            style={{ background: "rgba(22,27,46,1)", border: "1px solid rgba(255,255,255,0.13)" }}
            onClick={() => setShowNotifications(!showNotifications)}
            data-testid="notification-bell"
          >
            <Bell size={16} style={{ color: "rgba(136,144,168,1)" }} />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[9px] font-bold flex items-center justify-center"
                style={{ background: "var(--lq-red)", color: "#fff" }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Avatar → links to /portfolio */}
          <Link href="/portfolio">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-black cursor-pointer transition-transform hover:scale-110"
              style={{ background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", border: "2px solid rgba(79,142,247,.3)" }}
              data-testid="user-avatar"
              title="View My Portfolio"
            >
              {user.name[0]}
            </div>
          </Link>
        </div>
      </nav>

      {/* Notification Panel */}
      {showNotifications && (
        <NotificationPanel onClose={() => setShowNotifications(false)} />
      )}

      {/* App Shell */}
      <div className="flex pt-[60px] min-h-screen">
        {/* Sidebar overlay for mobile */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/60 z-[150] lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-[60px] h-[calc(100vh-60px)] w-[220px] z-[160] overflow-y-auto flex flex-col transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
          style={{ background: "rgba(15,20,34,1)", borderRight: "1px solid rgba(255,255,255,0.07)" }}
        >
          <div className="p-3 flex flex-col gap-1.5">
            {/* Level Card */}
            <div className="p-3 rounded-xl mb-1" style={{ background: "linear-gradient(135deg, rgba(79,142,247,.07), rgba(155,111,255,.07))", border: "1px solid rgba(155,111,255,.14)" }}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[11px] font-bold" style={{ color: "rgba(136,144,168,1)" }}>Level</span>
                <span className="text-sm font-black" style={{ color: levelColor }}>Lv. {currentLevel}</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,.06)" }}>
                <div
                  className="h-full rounded-full xp-bar-fill transition-all duration-1000"
                  style={{ width: `${Math.min(xpProgress, 100)}%`, background: "linear-gradient(90deg, var(--lq-blue), var(--lq-purple))" }}
                />
              </div>
              <div className="text-[10px] text-right mt-1" style={{ color: "rgba(90,96,122,1)" }}>
                {currentXP.toLocaleString()} / {xpForNextLevel.toLocaleString()} XP
              </div>
            </div>

            {/* Mode badge */}
            <div className="flex items-center gap-2 p-2 rounded-xl mb-1 text-xs font-bold"
              style={{ background: user.mode === "hirer" ? "rgba(155,111,255,.08)" : "rgba(79,142,247,.08)", border: `1px solid ${user.mode === "hirer" ? "rgba(155,111,255,.18)" : "rgba(79,142,247,.18)"}`, color: user.mode === "hirer" ? "var(--lq-purple)" : "var(--lq-blue)" }}>
              {user.mode === "hirer" ? "🏢 Hirer Mode" : "🎓 Learner Mode"}
              <div className="ml-auto flex gap-1">
                <button onClick={() => setMode("learner")} className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: user.mode === "learner" ? "rgba(79,142,247,.25)" : "rgba(255,255,255,.06)", color: user.mode === "learner" ? "var(--lq-blue)" : "rgba(90,96,122,1)" }}>L</button>
                <button onClick={() => setMode("hirer")} className="text-[9px] px-1.5 py-0.5 rounded"
                  style={{ background: user.mode === "hirer" ? "rgba(155,111,255,.25)" : "rgba(255,255,255,.06)", color: user.mode === "hirer" ? "var(--lq-purple)" : "rgba(90,96,122,1)" }}>H</button>
              </div>
            </div>

            {/* Streak Mini — only in learner mode */}
            {user.mode === "learner" && (
              <div className="flex items-center gap-2 p-2.5 rounded-xl mb-1" style={{ background: "rgba(255,140,66,.07)", border: "1px solid rgba(255,140,66,.18)" }}>
                <span className="text-2xl fire-anim">🔥</span>
                <div className="flex-1">
                  <div className="text-base font-black" style={{ color: "var(--lq-orange)" }}>{user.streak} days</div>
                  <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>Current streak</div>
                </div>
                <Shield size={14} style={{ color: "var(--lq-blue)", cursor: "pointer" }} />
              </div>
            )}

            {/* Dynamic Nav Groups */}
            {navGroups.map(group => (
              <div key={group.section}>
                <div className="text-[9px] font-bold tracking-widest uppercase px-2 pt-2 pb-1" style={{ color: "rgba(90,96,122,1)" }}>{group.section}</div>
                {group.items.map(item => (
                  <SidebarItem key={item.href} href={item.href} label={item.label} icon={item.icon} active={location === item.href} onClick={() => setSidebarOpen(false)} />
                ))}
              </div>
            ))}
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 lg:ml-[220px] min-h-screen overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

function SidebarItem({ href, label, icon: Icon, active, onClick }: {
  href: string; label: string; icon: any; active: boolean; onClick?: () => void;
}) {
  return (
    <Link href={href}>
      <div
        className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg cursor-pointer transition-all text-[13px] font-medium"
        style={active
          ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)", border: "1px solid rgba(79,142,247,.15)" }
          : { color: "rgba(136,144,168,1)", border: "1px solid transparent" }
        }
        onClick={onClick}
        data-testid={`nav-${href.replace("/", "") || "home"}`}
      >
        <Icon size={15} />
        <span>{label}</span>
        {active && <ChevronRight size={13} className="ml-auto opacity-50" />}
      </div>
    </Link>
  );
}
