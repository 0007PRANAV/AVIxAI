import { useState } from "react";
import { Shield, Flame, Zap, Calendar } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Streak() {
  const { user, addXP, useStreakShield } = useApp();
  const [showFreezeModal, setShowFreezeModal] = useState(false);

  const today = new Date();
  const dayOfWeek = today.getDay();

  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const diff = i - dayOfWeek;
    const date = new Date(today);
    date.setDate(today.getDate() + diff);
    const isPast = i < dayOfWeek;
    const isToday = i === dayOfWeek;
    const isFuture = i > dayOfWeek;
    const dayNum = user.streak - (dayOfWeek - i);
    const isDone = isPast && dayNum > 0 && dayNum <= user.streak;
    return { label: DAYS_OF_WEEK[i], isToday, isPast, isFuture, isDone };
  });

  // Build a calendar of the current month
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay = new Date(year, month, 1).getDay();
  const calendarDays = Array.from({ length: firstDay + daysInMonth }, (_, i) => {
    if (i < firstDay) return null;
    const d = i - firstDay + 1;
    const isPast = d < today.getDate();
    const isToday = d === today.getDate();
    const isFuture = d > today.getDate();
    const isStreakDay = isPast && d >= (today.getDate() - user.streak);
    return { d, isPast, isToday, isFuture, isStreakDay };
  });

  function handleStreakFreeze() {
    if (user.streakShields <= 0) {
      showXPToast("❌", "No streak shields remaining!", "#FF4D4D");
      return;
    }
    useStreakShield();
    showXPToast("🛡️", "Streak shield used! Streak protected for today.", "#4F8EF7");
    setShowFreezeModal(false);
  }

  function handleXPFreeze() {
    if (user.xp < 500) {
      showXPToast("❌", "Need 500 XP to use streak freeze!", "#FF4D4D");
      return;
    }
    showXPToast("⚡", "Streak frozen with 500 XP! -500 XP", "#FFD166");
    setShowFreezeModal(false);
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <span className="fire-anim">🔥</span> Streak Tracker
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>Keep your streak alive to earn bonus XP and unlock milestone rewards.</p>

      {/* Hero */}
      <div className="text-center p-8 rounded-2xl mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(255,140,66,.08), rgba(255,77,77,.08))", border: "1px solid rgba(255,140,66,.18)" }}>
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, rgba(255,140,66,.04), transparent 70%)" }} />
        <div className="relative z-10">
          <div className="text-[80px] font-black leading-none mb-1" style={{ color: "var(--lq-orange)", letterSpacing: "-0.05em" }}>{user.streak}</div>
          <div className="text-4xl fire-anim mb-2">🔥</div>
          <p className="text-base" style={{ color: "rgba(136,144,168,1)" }}>
            {user.streak >= 30 ? "Legendary streak! You're unstoppable 🏆" :
             user.streak >= 14 ? "Amazing dedication! Keep going 💪" :
             user.streak >= 7 ? "One week strong! You're on fire ⚡" :
             "Building momentum! Don't stop now 🚀"}
          </p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="text-center">
              <div className="text-xl font-black" style={{ color: "var(--lq-yellow)" }}>{user.streak * 25}</div>
              <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Bonus XP earned</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-black" style={{ color: "var(--lq-purple)" }}>{user.streakShields}</div>
              <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>Shields left</div>
            </div>
          </div>
        </div>
      </div>

      {/* This Week */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-sm font-bold mb-3 flex items-center gap-2"><Calendar size={14} style={{ color: "var(--lq-blue)" }} /> This Week</h3>
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => (
            <div
              key={i}
              className="flex flex-col items-center p-2 rounded-xl text-center"
              style={{
                background: day.isToday ? "rgba(255,140,66,.2)" : day.isDone ? "rgba(255,140,66,.1)" : day.isFuture ? "rgba(255,255,255,.03)" : "rgba(255,77,77,.07)",
                border: day.isToday ? "1px solid var(--lq-orange)" : day.isDone ? "1px solid rgba(255,140,66,.3)" : day.isFuture ? "1px solid rgba(255,255,255,.04)" : "1px solid rgba(255,77,77,.2)",
                boxShadow: day.isToday ? "0 0 12px rgba(255,140,66,.2)" : "none",
              }}
              data-testid={`streak-day-${i}`}
            >
              <div className="text-base mb-0.5">
                {day.isDone ? "🔥" : day.isToday ? "⭐" : day.isFuture ? "○" : "✕"}
              </div>
              <div className="text-[9px] font-bold" style={{ color: "rgba(136,144,168,1)" }}>{day.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Month Calendar */}
      <div className="p-4 rounded-2xl mb-4" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "rgba(136,144,168,1)" }}>
          {today.toLocaleString("default", { month: "long", year: "numeric" })}
        </h3>
        <div className="grid grid-cols-7 gap-1">
          {DAYS_OF_WEEK.map(d => (
            <div key={d} className="text-center text-[9px] font-bold mb-1" style={{ color: "rgba(90,96,122,1)" }}>{d[0]}</div>
          ))}
          {calendarDays.map((day, i) => (
            <div
              key={i}
              className="aspect-square flex items-center justify-center rounded-lg text-xs font-bold"
              style={!day ? { background: "transparent" } : {
                background: day.isToday ? "var(--lq-orange)" : day.isStreakDay ? "rgba(255,140,66,.18)" : day.isFuture ? "rgba(255,255,255,.03)" : "rgba(255,77,77,.08)",
                color: day.isToday ? "#fff" : day.isStreakDay ? "var(--lq-orange)" : day.isFuture ? "rgba(90,96,122,1)" : "var(--lq-red)",
              }}
            >
              {day?.d}
            </div>
          ))}
        </div>
      </div>

      {/* Streak Protection */}
      <div className="mb-5">
        <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Shield size={16} style={{ color: "var(--lq-blue)" }} /> Streak Protection</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { icon: "🛡️", name: "Free Shield", desc: "Use 1 of your 2 free shields this month to protect your streak for 1 day.", status: "free", statusColor: "var(--lq-green)", statusBg: "rgba(46,204,142,.1)", action: "Use Shield", available: user.streakShields > 0, onClick: handleStreakFreeze },
            { icon: "⚡", name: "XP Freeze", desc: "Spend 500 XP to freeze your streak for 24 hours. Never lose your hard work.", status: "500 XP", statusColor: "var(--lq-yellow)", statusBg: "rgba(255,209,102,.1)", action: "Spend 500 XP", available: user.xp >= 500, onClick: handleXPFreeze },
            { icon: "💳", name: "Premium Shield", desc: "Subscribe to Premium for unlimited streak protection + bonus XP bonuses.", status: "Premium", statusColor: "var(--lq-purple)", statusBg: "rgba(155,111,255,.1)", action: "Go Premium", available: true, onClick: () => showXPToast("👑", "Premium features coming soon!", "#9B6FFF") },
          ].map((shield, i) => (
            <div
              key={i}
              className="p-4 rounded-2xl text-center transition-all hover:-translate-y-0.5"
              style={{ background: "rgba(15,20,34,1)", border: i === 1 ? "1px solid rgba(79,142,247,.3)" : "1px solid rgba(255,255,255,0.07)" }}
              data-testid={`shield-option-${i}`}
            >
              <div className="text-4xl mb-3">{shield.icon}</div>
              <div className="text-sm font-bold mb-2">{shield.name}</div>
              <div className="text-xs leading-relaxed mb-3" style={{ color: "rgba(136,144,168,1)" }}>{shield.desc}</div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full inline-block mb-3"
                style={{ background: shield.statusBg, color: shield.statusColor }}>
                {shield.status}
              </span>
              <button
                onClick={shield.onClick}
                className="w-full py-2.5 rounded-xl text-sm font-bold transition-all hover:scale-[1.02]"
                style={shield.available ? { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", border: "none" } : { background: "rgba(255,255,255,.03)", color: "rgba(90,96,122,1)", border: "1px solid rgba(255,255,255,.07)" }}
                data-testid={`shield-btn-${i}`}
              >
                {shield.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Milestone Rewards */}
      <div>
        <h2 className="text-base font-bold mb-3 flex items-center gap-2"><Zap size={16} style={{ color: "var(--lq-yellow)" }} /> Streak Milestones</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { days: 7, reward: "+100 XP + Fire badge", reached: user.streak >= 7 },
            { days: 14, reward: "+250 XP + Dedication badge", reached: user.streak >= 14 },
            { days: 30, reward: "+750 XP + Elite badge", reached: user.streak >= 30 },
            { days: 100, reward: "+2500 XP + Legend badge", reached: user.streak >= 100 },
          ].map((m, i) => (
            <div
              key={i}
              className="p-3 rounded-xl text-center"
              style={{
                background: m.reached ? "rgba(255,209,102,.07)" : "rgba(15,20,34,1)",
                border: m.reached ? "1px solid rgba(255,209,102,.25)" : "1px solid rgba(255,255,255,0.07)",
                opacity: m.reached ? 1 : 0.6,
              }}
              data-testid={`milestone-${m.days}`}
            >
              <div className="text-2xl mb-1">{m.reached ? "🏆" : "🔒"}</div>
              <div className="text-xl font-black mb-0.5" style={{ color: m.reached ? "var(--lq-yellow)" : "rgba(136,144,168,1)" }}>{m.days}d</div>
              <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>{m.reward}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
