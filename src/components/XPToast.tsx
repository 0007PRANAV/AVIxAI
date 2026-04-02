import { useEffect, useState } from "react";

interface ToastItem {
  id: string;
  icon: string;
  message: string;
  color: string;
}

let toastQueue: ToastItem[] = [];
let listeners: ((items: ToastItem[]) => void)[] = [];

export function showXPToast(icon: string, message: string, color = "#FFD166") {
  const item: ToastItem = { id: Date.now().toString(), icon, message, color };
  toastQueue = [...toastQueue, item];
  listeners.forEach(l => l([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter(t => t.id !== item.id);
    listeners.forEach(l => l([...toastQueue]));
  }, 3000);
}

export function XPToastContainer() {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    listeners.push(setToasts);
    return () => { listeners = listeners.filter(l => l !== setToasts); };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col gap-2 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold shadow-2xl"
          style={{
            background: "rgba(15,20,34,0.95)",
            border: `1px solid rgba(255,255,255,0.13)`,
            animation: "slideIn .3s ease",
            color: toast.color,
          }}
          data-testid="xp-toast"
        >
          <span style={{ fontSize: "1.2rem" }}>{toast.icon}</span>
          <span style={{ color: "#E8EAF0" }}>{toast.message}</span>
        </div>
      ))}
    </div>
  );
}
