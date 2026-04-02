import { useState } from "react";
import { Gift, Copy, Share2, Users, Zap, DollarSign, CheckCircle, Mail } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

export default function Referral() {
  const { user, claimReferralXP } = useApp();
  const [copied, setCopied] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [sentEmails, setSentEmails] = useState<string[]>([]);

  const referralLink = `https://learnquest.app/join?ref=${user.referralCode}`;

  function copyLink() {
    navigator.clipboard.writeText(referralLink).catch(() => {});
    setCopied(true);
    showXPToast("📋", "Referral link copied to clipboard!", "#4F8EF7");
    setTimeout(() => setCopied(false), 2000);
  }

  function handleInvite() {
    const email = inviteEmail.trim().toLowerCase();
    if (!email.includes("@") || !email.includes(".")) {
      showXPToast("❌", "Please enter a valid email address", "#FF4D4D");
      return;
    }

    if (sentEmails.includes(email)) {
      showXPToast("ℹ️", "Invite already sent to this email", "#4F8EF7");
      return;
    }

    setSentEmails(prev => [...prev, email]);
    setInviteEmail("");

    const claimed = claimReferralXP(email);
    if (claimed) {
      showXPToast("🎉", `+15 XP! ${email} joined using your link!`, "#FFD166");
    } else {
      showXPToast("📧", `Invite sent to ${email}! You'll earn 15 XP when they join.`, "#2ECC8E");
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <Gift size={22} style={{ color: "var(--lq-green)" }} /> Invite Friends & Earn
      </h1>
      <p className="text-sm mb-5" style={{ color: "rgba(136,144,168,1)" }}>
        Share LearnQuest with friends. You earn XP when they join and extra rewards when they make purchases.
      </p>

      {/* How it Works */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
        {[
          { icon: "🔗", step: "1", title: "Share Your Link", desc: "Copy your unique referral link and share it on social media, WhatsApp, or email.", reward: null },
          { icon: "👥", step: "2", title: "Friend Joins", desc: "When your friend signs up using your link, you instantly earn XP as a thank you.", reward: "+15 XP" },
          { icon: "💰", step: "3", title: "Friend Purchases", desc: "When your referred friend makes any purchase on LearnQuest, you earn bonus XP.", reward: "+40 XP" },
        ].map((item, i) => (
          <div key={i} className="p-4 rounded-2xl relative overflow-hidden"
            style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
              style={{ background: "rgba(255,255,255,.06)", color: "rgba(90,96,122,1)" }}>
              {item.step}
            </div>
            <div className="text-4xl mb-3">{item.icon}</div>
            <div className="text-sm font-bold mb-1">{item.title}</div>
            <div className="text-xs leading-relaxed mb-2" style={{ color: "rgba(136,144,168,1)" }}>{item.desc}</div>
            {item.reward && (
              <div className="text-base font-black" style={{ color: "var(--lq-yellow)" }}>{item.reward}</div>
            )}
          </div>
        ))}
      </div>

      {/* Your Link */}
      <div className="p-5 rounded-2xl mb-5" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(79,142,247,.2)" }}>
        <h2 className="text-base font-bold mb-1 flex items-center gap-2"><Share2 size={16} style={{ color: "var(--lq-blue)" }} /> Your Referral Link</h2>
        <p className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>Share this link with anyone. When they sign up, you earn automatically.</p>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 px-3 py-2.5 rounded-xl text-xs font-mono overflow-hidden truncate"
            style={{ background: "rgba(8,11,20,1)", border: "1px solid rgba(255,255,255,.08)", color: "rgba(136,144,168,1)" }}>
            {referralLink}
          </div>
          <button
            onClick={copyLink}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
            style={copied
              ? { background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }
              : { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", border: "none" }
            }
          >
            {copied ? <><CheckCircle size={13} /> Copied!</> : <><Copy size={13} /> Copy</>}
          </button>
        </div>
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "📱 WhatsApp", color: "#25D366" },
            { label: "🐦 Twitter/X", color: "#1DA1F2" },
            { label: "📘 Facebook", color: "#1877F2" },
            { label: "💼 LinkedIn", color: "#0A66C2" },
          ].map(s => (
            <button
              key={s.label}
              className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-105"
              style={{ background: `${s.color}18`, color: s.color, border: `1px solid ${s.color}30` }}
              onClick={() => showXPToast("🚀", `Sharing link via ${s.label.split(" ")[1]}!`, s.color)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Invite by Email — earns XP per unique email */}
      <div className="p-5 rounded-2xl mb-5" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
        <h2 className="text-base font-bold mb-1 flex items-center gap-2"><Users size={16} style={{ color: "var(--lq-purple)" }} /> Invite by Email</h2>
        <p className="text-xs mb-3" style={{ color: "rgba(136,144,168,1)" }}>
          Enter your friend's email. You earn <strong style={{ color: "var(--lq-yellow)" }}>+15 XP</strong> the first time each unique email is used.
        </p>
        <div className="flex gap-2">
          <input
            type="email"
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
            placeholder="friend@email.com"
            className="flex-1 px-3 py-2.5 rounded-xl text-sm outline-none"
            style={{ background: "rgba(8,11,20,1)", border: "1px solid rgba(255,255,255,.1)", color: "white" }}
            onKeyDown={e => e.key === "Enter" && handleInvite()}
          />
          <button
            onClick={handleInvite}
            className="px-4 py-2.5 rounded-xl text-sm font-bold gradient-bg text-white transition-transform hover:scale-105"
          >
            Send Invite
          </button>
        </div>

        {/* Sent emails list */}
        {sentEmails.length > 0 && (
          <div className="mt-3 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "rgba(90,96,122,1)" }}>Invites sent this session</div>
            {sentEmails.map(email => (
              <div key={email} className="flex items-center gap-2 text-xs" style={{ color: "rgba(136,144,168,1)" }}>
                <Mail size={11} style={{ color: "var(--lq-green)" }} />
                {email}
                {user.usedReferralEmails.includes(email) && (
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full"
                    style={{ background: "rgba(255,209,102,.1)", color: "var(--lq-yellow)", border: "1px solid rgba(255,209,102,.2)" }}>
                    ✓ +15 XP claimed
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Your Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-5">
        {[
          { icon: <Users size={20} style={{ color: "var(--lq-blue)" }} />, value: user.referrals.toString(), label: "Total Referrals", color: "var(--lq-blue)" },
          { icon: <Zap size={20} style={{ color: "var(--lq-yellow)" }} />, value: `${user.referrals * 15} XP`, label: "XP from Join Bonus", color: "var(--lq-yellow)" },
          { icon: <DollarSign size={20} style={{ color: "var(--lq-green)" }} />, value: `${user.referrals * 40} XP`, label: "XP from Purchases", color: "var(--lq-green)" },
        ].map((stat, i) => (
          <div key={i} className="p-4 rounded-xl text-center" style={{ background: "rgba(15,20,34,1)", border: "1px solid rgba(255,255,255,0.07)" }}>
            <div className="flex justify-center mb-2">{stat.icon}</div>
            <div className="text-2xl font-black mb-0.5" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Reward Details Banner */}
      <div className="p-5 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(46,204,142,.07), rgba(79,142,247,.07))", border: "1px solid rgba(46,204,142,.18)" }}>
        <h2 className="text-base font-bold mb-3">📋 Reward Details</h2>
        <div className="space-y-2 text-sm">
          {[
            { icon: "✅", text: "You earn 15 XP when a referred friend signs up using your link (once per unique email)" },
            { icon: "💰", text: "You earn 40 XP when your referred friend makes any purchase on LearnQuest" },
            { icon: "📅", text: "Referral bonuses are credited instantly to your XP balance" },
            { icon: "♾️", text: "There is no limit — invite unlimited friends and earn unlimited XP" },
            { icon: "🎯", text: "Referral XP can be used in the XP Store to redeem rewards and devices" },
            { icon: "🔐", text: "Each email address can only earn the join bonus once — duplicate emails are tracked" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2.5">
              <span className="flex-shrink-0">{item.icon}</span>
              <span style={{ color: "rgba(136,144,168,1)" }}>{item.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
