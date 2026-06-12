"use client";

import { useEffect, useRef } from "react";

/*
 * Ambient background layer:
 *  - particle constellation on <canvas>, particles drift and connect,
 *    and are gently pushed by the cursor
 *  - large soft spotlight that lerps toward the cursor
 * Honors prefers-reduced-motion (static dots, no spotlight tracking).
 */
export default function BackgroundFX() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const spotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const spot = spotRef.current;
    if (!canvas || !spot) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = 1;
    let raf = 0;
    let running = true;

    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    const mouse = { x: -9999, y: -9999, active: false };
    const spotPos = { x: 0, y: 0 };
    let spotInit = false;

    const LINK_DIST = 130;
    const MOUSE_DIST = 170;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = Math.max(36, Math.min(90, Math.floor((width * height) / 24000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function step() {
      if (!running) return;
      ctx!.clearRect(0, 0, width, height);

      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // gentle cursor repulsion
          if (mouse.active) {
            const dx = p.x - mouse.x;
            const dy = p.y - mouse.y;
            const d2 = dx * dx + dy * dy;
            if (d2 < MOUSE_DIST * MOUSE_DIST && d2 > 0.01) {
              const d = Math.sqrt(d2);
              const f = ((MOUSE_DIST - d) / MOUSE_DIST) * 0.035;
              p.vx += (dx / d) * f;
              p.vy += (dy / d) * f;
            }
          }

          // damping keeps velocities sane after repulsion kicks
          p.vx *= 0.995;
          p.vy *= 0.995;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(74, 222, 128, 0.28)";
        ctx!.fill();
      }

      // particle ↔ particle links
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const a = particles[i];
          const b = particles[j];
          const dx = a.x - b.x;
          const dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_DIST * LINK_DIST) {
            const alpha = (1 - Math.sqrt(d2) / LINK_DIST) * 0.1;
            ctx!.beginPath();
            ctx!.moveTo(a.x, a.y);
            ctx!.lineTo(b.x, b.y);
            ctx!.strokeStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // cursor ↔ particle links
      if (mouse.active && !reduceMotion) {
        for (const p of particles) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < MOUSE_DIST * MOUSE_DIST) {
            const alpha = (1 - Math.sqrt(d2) / MOUSE_DIST) * 0.22;
            ctx!.beginPath();
            ctx!.moveTo(p.x, p.y);
            ctx!.lineTo(mouse.x, mouse.y);
            ctx!.strokeStyle = `rgba(74, 222, 128, ${alpha})`;
            ctx!.lineWidth = 1;
            ctx!.stroke();
          }
        }
      }

      // spotlight follows cursor with lerp
      if (!reduceMotion && mouse.active) {
        if (!spotInit) {
          spotPos.x = mouse.x;
          spotPos.y = mouse.y;
          spotInit = true;
        } else {
          spotPos.x += (mouse.x - spotPos.x) * 0.08;
          spotPos.y += (mouse.y - spotPos.y) * 0.08;
        }
        spot!.style.transform = `translate3d(${spotPos.x - 350}px, ${spotPos.y - 350}px, 0)`;
        spot!.style.opacity = "1";
      }

      raf = requestAnimationFrame(step);
    }

    function onMove(e: MouseEvent) {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    }
    function onLeave() {
      mouse.active = false;
      if (spot) spot.style.opacity = "0";
    }
    function onVisibility() {
      running = !document.hidden;
      if (running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(step);
      }
    }

    resize();
    raf = requestAnimationFrame(step);
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    document.documentElement.addEventListener("mouseleave", onLeave);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <div aria-hidden className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* faint dot grid */}
      <div className="absolute inset-0 bg-dotgrid opacity-40" />
      <canvas ref={canvasRef} className="absolute inset-0" />
      <div
        ref={spotRef}
        className="absolute top-0 left-0 w-[700px] h-[700px] rounded-full opacity-0 transition-opacity duration-500"
        style={{
          background:
            "radial-gradient(circle, rgba(74,222,128,0.06) 0%, rgba(96,165,250,0.03) 35%, transparent 65%)",
          willChange: "transform",
        }}
      />
    </div>
  );
}
