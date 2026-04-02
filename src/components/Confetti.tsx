import { useEffect, useRef } from "react";

interface Props {
  active: boolean;
}

export function Confetti({ active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;
    const container = containerRef.current;
    const colors = ["#4F8EF7", "#9B6FFF", "#2ECC8E", "#FF8C42", "#FFD166", "#FF5FA0"];
    const pieces = Array.from({ length: 80 }, (_, i) => {
      const el = document.createElement("div");
      const color = colors[i % colors.length];
      const x = (Math.random() - 0.5) * 600;
      const y = -(Math.random() * 400 + 200);
      el.style.cssText = `
        position: fixed;
        left: 50%;
        top: 50%;
        width: ${Math.random() * 10 + 6}px;
        height: ${Math.random() * 6 + 4}px;
        background: ${color};
        border-radius: ${Math.random() > .5 ? "50%" : "2px"};
        pointer-events: none;
        z-index: 9999;
        --tx: ${x}px;
        --ty: ${y}px;
        animation: confettiFall ${Math.random() * 1.5 + 1}s ease-out ${Math.random() * .5}s forwards;
      `;
      return el;
    });
    pieces.forEach(p => container.appendChild(p));
    const cleanup = setTimeout(() => {
      pieces.forEach(p => p.remove());
    }, 3000);
    return () => {
      clearTimeout(cleanup);
      pieces.forEach(p => p.remove());
    };
  }, [active]);

  return <div ref={containerRef} />;
}
