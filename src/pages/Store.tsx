import { useState } from "react";
import { ShoppingBag, Lock, CheckCircle } from "lucide-react";
import { useApp } from "@/context/AppContext";
import { showXPToast } from "@/components/XPToast";

const STORE_ITEMS = [
  // Digital Items
  { id: "streak-freeze-7", name: "7-Day Streak Freeze Pack", desc: "Protect your streak for 7 days with premium shields.", icon: "🛡️", price: 1500, category: "power-ups", rarity: "rare", bg: "#1A0D3C", bg2: "#2D1A5A" },
  { id: "xp-boost", name: "2x XP Boost (24h)", desc: "Double your XP earnings for 24 hours. Stack your learning!", icon: "⚡", price: 2000, category: "power-ups", rarity: "rare", bg: "#0D1F3C", bg2: "#1A3A6B" },
  { id: "premium-1mo", name: "1 Month Premium", desc: "Unlock all courses, no XP gates, priority support and exclusive content.", icon: "👑", price: 5000, category: "subscriptions", rarity: "epic", bg: "#2A1A0D", bg2: "#5A3A1A" },
  { id: "cert-frame", name: "Gold Certificate Frame", desc: "A premium gold frame for your AVIxAI certificates. Stand out!", icon: "🖼️", price: 3000, category: "cosmetics", rarity: "rare", bg: "#2A2200", bg2: "#5A4A00" },
  { id: "badge-elite", name: "Elite Learner Badge", desc: "Exclusive profile badge showing you're in the top tier of learners.", icon: "🏅", price: 4000, category: "cosmetics", rarity: "epic", bg: "#1A0D3C", bg2: "#3A1A6B" },
  { id: "ai-coach-mo", name: "AI Career Coach (1 Month)", desc: "Full access to AI Career Coach with resume review, interview prep, and job matching.", icon: "🤖", price: 8000, category: "tools", rarity: "epic", bg: "#0D2A1E", bg2: "#1A5A3C" },
  // Devices (High XP — intentionally expensive)
  { id: "earbuds", name: "Premium Wireless Earbuds", desc: "High-quality wireless earbuds. Redeem with XP if you've been consistent!", icon: "🎧", price: 50000, category: "devices", rarity: "legendary", bg: "#0D2A2A", bg2: "#1A5A5A" },
  { id: "smartwatch", name: "Smart Fitness Watch", desc: "Feature-packed smartwatch. A real reward for top learners!", icon: "⌚", price: 80000, category: "devices", rarity: "legendary", bg: "#2A1A0D", bg2: "#5A3A1A" },
  { id: "tablet", name: "Android Tablet 10\"", desc: "A productivity tablet to turbocharge your learning journey.", icon: "📱", price: 150000, category: "devices", rarity: "legendary", bg: "#1A0D3C", bg2: "#2D1A5A" },
  { id: "laptop", name: "Premium Laptop", desc: "A high-performance laptop — the ultimate reward for elite learners.", icon: "💻", price: 500000, category: "devices", rarity: "legendary", bg: "#0D1F3C", bg2: "#1A3A6B" },
];

const CATEGORIES = ["all", "power-ups", "subscriptions", "tools", "cosmetics", "devices"] as const;
type Category = typeof CATEGORIES[number];

const RARITY_COLORS: Record<string, string> = {
  rare: "var(--lq-purple)",
  epic: "var(--lq-yellow)",
  legendary: "var(--lq-orange)",
};

const RARITY_BG: Record<string, string> = {
  rare: "rgba(155,111,255,.12)",
  epic: "rgba(255,209,102,.12)",
  legendary: "rgba(255,140,66,.12)",
};

export default function Store() {
  const { user, addXP } = useApp();
  const [category, setCategory] = useState<Category>("all");
  const [owned, setOwned] = useState<Set<string>>(new Set());

  const filtered = category === "all" ? STORE_ITEMS : STORE_ITEMS.filter(i => i.category === category);

  function handleRedeem(item: typeof STORE_ITEMS[0]) {
    if (owned.has(item.id)) {
      showXPToast("✅", `You already own ${item.name}!`, "#2ECC8E");
      return;
    }
    if (user.xp < item.price) {
      const diff = item.price - user.xp;
      showXPToast("❌", `Need ${diff.toLocaleString()} more XP for ${item.name}`, "#FF4D4D");
      return;
    }
    addXP(-item.price, "redeem");
    setOwned(prev => new Set([...prev, item.id]));
    showXPToast("🎉", `Redeemed ${item.name}! -${item.price.toLocaleString()} XP`, "#FFD166");
  }

  return (
    <div>
      <h1 className="text-2xl font-black tracking-tight mb-1 flex items-center gap-2">
        <ShoppingBag size={22} style={{ color: "var(--lq-purple)" }} /> XP Store
      </h1>
      <p className="text-sm mb-4" style={{ color: "rgba(136,144,168,1)" }}>
        Redeem your hard-earned XP for real rewards and premium features.
      </p>

      {/* Store Banner */}
      <div className="flex items-center justify-between p-5 rounded-2xl mb-5 relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, rgba(155,111,255,.1), rgba(79,142,247,.1))", border: "1px solid rgba(155,111,255,.2)" }}>
        <div className="absolute right-20 top-1/2 -translate-y-1/2 text-8xl opacity-[0.06] pointer-events-none">🛒</div>
        <div>
          <h2 className="text-xl font-black mb-1">Redeem XP Rewards</h2>
          <p className="text-sm" style={{ color: "rgba(136,144,168,1)" }}>Spend your XP on power-ups, tools, cosmetics, and real devices.</p>
        </div>
        <div className="p-3 rounded-xl text-right" style={{ background: "rgba(255,209,102,.1)", border: "1px solid rgba(255,209,102,.25)" }}>
          <div className="text-2xl font-black" style={{ color: "var(--lq-yellow)" }}>{user.xp.toLocaleString()}</div>
          <div className="text-[10px]" style={{ color: "rgba(136,144,168,1)" }}>Available XP</div>
        </div>
      </div>

      {/* Device note */}
      <div className="flex items-center gap-3 p-3.5 rounded-xl mb-5" style={{ background: "rgba(255,209,102,.05)", border: "1px solid rgba(255,209,102,.15)" }}>
        <span className="text-2xl">📦</span>
        <div className="text-xs" style={{ color: "rgba(136,144,168,1)" }}>
          <strong style={{ color: "var(--lq-yellow)" }}>Device rewards are intentionally high-XP</strong> — they represent months of consistent learning. This ensures only truly dedicated learners can redeem physical items.
          <strong style={{ color: "white" }}> Earbuds: 50K XP · Watch: 80K XP · Tablet: 150K XP · Laptop: 500K XP.</strong>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className="px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all"
            style={category === cat
              ? { background: "rgba(79,142,247,.1)", color: "var(--lq-blue)" }
              : { color: "rgba(136,144,168,1)", background: "rgba(255,255,255,.03)" }
            }
            data-testid={`category-${cat}`}
          >
            {cat === "all" ? "All Items" : cat.replace("-", " ")}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map(item => {
          const canAfford = user.xp >= item.price;
          const isOwned = owned.has(item.id);

          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden transition-all hover:-translate-y-0.5"
              style={{
                background: "rgba(15,20,34,1)",
                border: `1px solid ${item.rarity === "legendary" ? "rgba(255,140,66,.3)" : item.rarity === "epic" ? "rgba(255,209,102,.2)" : "rgba(155,111,255,.18)"}`,
                boxShadow: item.rarity === "legendary" ? "0 0 24px rgba(255,140,66,.06)" : "none",
              }}
              data-testid={`store-item-${item.id}`}
            >
              {/* Item image area */}
              <div className="h-32 flex items-center justify-center text-5xl relative"
                style={{ background: `linear-gradient(135deg, ${item.bg}, ${item.bg2})` }}>
                {item.icon}
                <span
                  className="absolute top-2 right-2 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full"
                  style={{ background: RARITY_BG[item.rarity], color: RARITY_COLORS[item.rarity], border: `1px solid ${RARITY_COLORS[item.rarity]}40` }}
                >
                  {item.rarity}
                </span>
              </div>

              {/* Body */}
              <div className="p-3">
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--lq-blue)" }}>
                  {item.category.replace("-", " ")}
                </div>
                <div className="text-sm font-bold mb-1">{item.name}</div>
                <div className="text-xs leading-relaxed mb-3" style={{ color: "rgba(136,144,168,1)" }}>{item.desc}</div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between px-3 py-2.5" style={{ borderTop: "1px solid rgba(255,255,255,.06)" }}>
                <div>
                  <div className="text-base font-black" style={{ color: "var(--lq-yellow)" }}>{item.price.toLocaleString()} XP</div>
                  {!canAfford && !isOwned && (
                    <div className="text-[9px]" style={{ color: "var(--lq-red)" }}>
                      Need {(item.price - user.xp).toLocaleString()} more XP
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleRedeem(item)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all hover:scale-[1.04]"
                  style={isOwned
                    ? { background: "rgba(46,204,142,.1)", color: "var(--lq-green)", border: "1px solid rgba(46,204,142,.2)" }
                    : canAfford
                    ? { background: "linear-gradient(135deg, var(--lq-blue), var(--lq-purple))", color: "#fff", border: "none" }
                    : { background: "rgba(255,255,255,.04)", color: "rgba(90,96,122,1)", border: "1px solid rgba(255,255,255,.07)", cursor: "not-allowed" }
                  }
                  data-testid={`redeem-${item.id}`}
                >
                  {isOwned ? <><CheckCircle size={12} className="inline mr-1" />Owned</> : canAfford ? "Redeem" : <><Lock size={12} className="inline mr-1" />Locked</>}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
