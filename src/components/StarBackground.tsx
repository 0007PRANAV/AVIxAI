import { useMemo } from "react";

export function StarBackground() {
  const stars = useMemo(() =>
    Array.from({ length: 80 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: `${Math.random() * 2 + 1}px`,
      duration: `${Math.random() * 4 + 2}s`,
      delay: `${Math.random() * 4}s`,
    })), []);

  return (
    <div className="star-bg">
      {stars.map(star => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            "--d": star.duration,
            "--del": star.delay,
          } as React.CSSProperties}
        />
      ))}
    </div>
  );
}
