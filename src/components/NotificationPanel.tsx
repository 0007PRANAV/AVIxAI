import { X, Bell, Zap, Flame, Briefcase, Star } from "lucide-react";
import { useApp } from "@/context/AppContext";

const typeIcons: Record<string, React.ReactNode> = {
  xp: <Zap size={14} style={{ color: "var(--lq-yellow)" }} />,
  badge: <Star size={14} style={{ color: "var(--lq-purple)" }} />,
  streak: <Flame size={14} style={{ color: "var(--lq-orange)" }} />,
  job: <Briefcase size={14} style={{ color: "var(--lq-green)" }} />,
  system: <Bell size={14} style={{ color: "var(--lq-blue)" }} />,
};

export function NotificationPanel({ onClose }: { onClose: () => void }) {
  const { user, markNotificationRead, markAllNotificationsRead } = useApp();

  return (
    <div
      className="fixed top-[64px] right-4 w-80 rounded-2xl z-[300] overflow-hidden"
      style={{ background: "rgba(15,20,34,.97)", border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 20px 60px rgba(0,0,0,.7)" }}
      data-testid="notification-panel"
    >
      <div className="flex items-center justify-between px-4 py-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
        <span className="text-sm font-bold">Notifications</span>
        <div className="flex items-center gap-2">
          <button
            className="text-xs font-semibold transition-opacity"
            style={{ color: "var(--lq-blue)" }}
            onClick={markAllNotificationsRead}
            data-testid="mark-all-read"
          >
            Mark all read
          </button>
          <button onClick={onClose} className="p-1 rounded-lg hover:opacity-70" data-testid="close-notifications">
            <X size={14} style={{ color: "rgba(136,144,168,1)" }} />
          </button>
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto">
        {user.notifications.length === 0 ? (
          <div className="p-6 text-center text-sm" style={{ color: "rgba(90,96,122,1)" }}>No notifications</div>
        ) : (
          user.notifications.map(notif => (
            <div
              key={notif.id}
              className="flex items-start gap-3 px-4 py-3 cursor-pointer transition-all"
              style={{
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: notif.read ? "transparent" : "rgba(79,142,247,.04)",
              }}
              onClick={() => markNotificationRead(notif.id)}
              data-testid={`notification-${notif.id}`}
            >
              <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: "rgba(255,255,255,.06)" }}>
                {typeIcons[notif.type]}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold mb-0.5 flex items-center gap-2">
                  {notif.title}
                  {!notif.read && (
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: "var(--lq-blue)" }} />
                  )}
                </div>
                <div className="text-[11px] leading-relaxed" style={{ color: "rgba(136,144,168,1)" }}>{notif.message}</div>
                <div className="text-[10px] mt-1" style={{ color: "rgba(90,96,122,1)" }}>{notif.time}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
