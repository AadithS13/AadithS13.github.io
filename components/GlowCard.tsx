"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";

/*
 * Card whose border + inner sheen light up around the cursor.
 * Mouse position is written to --mx/--my CSS vars; the glow itself
 * is pure CSS (see .glow-card in globals.css).
 */
export default function GlowCard({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    el.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <div ref={ref} onMouseMove={onMouseMove} className={`glow-card ${className}`}>
      {children}
    </div>
  );
}
