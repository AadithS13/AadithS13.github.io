"use client";

import { useEffect, useRef } from "react";

/*
 * Space-scene background layer:
 *  - 3-depth twinkling starfield with mouse parallax (far layers move less)
 *  - green particle constellation, drifting + linked, repelled by the cursor
 *  - shooting stars streaking across every few seconds
 *  - soft drifting nebula blobs (CSS, see .nebula in globals.css)
 *  - cursor spotlight glow lerping behind the mouse
 * Honors prefers-reduced-motion (static stars, nothing moves).
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
    let t = 0;

    /* ── stars: 3 parallax depths ── */
    type Star = {
      x: number;
      y: number;
      r: number;
      depth: number; // 0 far … 1 near
      phase: number;
      speed: number;
      base: number; // base alpha
      hue: number; // 0 white, 1 green-ish, 2 blue-ish
    };
    let stars: Star[] = [];

    /* ── constellation particles ── */
    type P = { x: number; y: number; vx: number; vy: number; r: number };
    let particles: P[] = [];

    /* ── shooting stars ── */
    type Shot = {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
    };
    const shots: Shot[] = [];
    let nextShotAt = 0;

    const mouse = { x: -9999, y: -9999, active: false };
    const spotPos = { x: 0, y: 0 };
    let spotInit = false;
    // parallax offset, lerped toward cursor displacement from center
    const par = { x: 0, y: 0 };

    const LINK_DIST = 130;
    const MOUSE_DIST = 170;

    const starColor = (hue: number, a: number) =>
      hue === 1
        ? `rgba(74, 222, 128, ${a})`
        : hue === 2
          ? `rgba(96, 165, 250, ${a})`
          : `rgba(226, 232, 240, ${a})`;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      const starCount = Math.max(90, Math.min(220, Math.floor((width * height) / 9000)));
      stars = Array.from({ length: starCount }, () => {
        const depth = Math.random();
        const roll = Math.random();
        return {
          x: Math.random() * width,
          y: Math.random() * height,
          r: 0.4 + depth * 1.1,
          depth,
          phase: Math.random() * Math.PI * 2,
          speed: 0.4 + Math.random() * 1.4,
          base: 0.12 + depth * 0.5,
          hue: roll < 0.78 ? 0 : roll < 0.9 ? 1 : 2,
        };
      });

      const count = Math.max(36, Math.min(80, Math.floor((width * height) / 26000)));
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.34,
        vy: (Math.random() - 0.5) * 0.34,
        r: Math.random() * 1.4 + 0.6,
      }));
    }

    function spawnShot(now: number) {
      // enter from top-left half, streak down-right (or mirrored)
      const fromLeft = Math.random() < 0.5;
      const speed = 7 + Math.random() * 5;
      const angle = (20 + Math.random() * 25) * (Math.PI / 180);
      shots.push({
        x: fromLeft ? -40 : Math.random() * width * 0.8,
        y: fromLeft ? Math.random() * height * 0.4 : -40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 0,
        maxLife: 60 + Math.random() * 40,
      });
      nextShotAt = now + 3500 + Math.random() * 5500;
    }

    function step(now: number) {
      if (!running) return;
      t += 0.016;
      ctx!.clearRect(0, 0, width, height);

      /* parallax target from cursor displacement */
      if (!reduceMotion && mouse.active) {
        const tx = (mouse.x - width / 2) / (width / 2); // -1..1
        const ty = (mouse.y - height / 2) / (height / 2);
        par.x += (tx - par.x) * 0.03;
        par.y += (ty - par.y) * 0.03;
      }

      /* ── stars ── */
      for (const s of stars) {
        const tw = reduceMotion
          ? 1
          : 0.55 + 0.45 * Math.sin(t * s.speed + s.phase);
        const a = s.base * tw;

        // slow vertical drift + parallax shift (near stars move more)
        let sy = s.y;
        let sx = s.x;
        if (!reduceMotion) {
          s.y += 0.012 + s.depth * 0.03;
          if (s.y > height + 4) s.y = -4;
          sx = s.x - par.x * (6 + s.depth * 22);
          sy = s.y - par.y * (6 + s.depth * 22);
        }

        ctx!.beginPath();
        ctx!.arc(sx, sy, s.r, 0, Math.PI * 2);
        ctx!.fillStyle = starColor(s.hue, a);
        ctx!.fill();

        // 4-point sparkle on the brightest near stars
        if (!reduceMotion && s.depth > 0.82 && tw > 0.92) {
          const len = s.r * 5 * (tw - 0.9) * 10;
          ctx!.strokeStyle = starColor(s.hue, a * 0.5);
          ctx!.lineWidth = 0.6;
          ctx!.beginPath();
          ctx!.moveTo(sx - len, sy);
          ctx!.lineTo(sx + len, sy);
          ctx!.moveTo(sx, sy - len);
          ctx!.lineTo(sx, sy + len);
          ctx!.stroke();
        }
      }

      /* ── shooting stars ── */
      if (!reduceMotion) {
        if (now >= nextShotAt) spawnShot(now);
        for (let i = shots.length - 1; i >= 0; i--) {
          const sh = shots[i];
          sh.x += sh.vx;
          sh.y += sh.vy;
          sh.life++;
          const fade =
            sh.life < 10
              ? sh.life / 10
              : 1 - Math.max(0, (sh.life - sh.maxLife * 0.6) / (sh.maxLife * 0.4));
          if (sh.life > sh.maxLife || sh.x > width + 60 || sh.y > height + 60) {
            shots.splice(i, 1);
            continue;
          }
          const tailX = sh.x - sh.vx * 12;
          const tailY = sh.y - sh.vy * 12;
          const grad = ctx!.createLinearGradient(sh.x, sh.y, tailX, tailY);
          grad.addColorStop(0, `rgba(226, 232, 240, ${0.75 * fade})`);
          grad.addColorStop(0.3, `rgba(96, 165, 250, ${0.3 * fade})`);
          grad.addColorStop(1, "rgba(96, 165, 250, 0)");
          ctx!.strokeStyle = grad;
          ctx!.lineWidth = 1.4;
          ctx!.beginPath();
          ctx!.moveTo(sh.x, sh.y);
          ctx!.lineTo(tailX, tailY);
          ctx!.stroke();
          // bright head
          ctx!.beginPath();
          ctx!.arc(sh.x, sh.y, 1.4, 0, Math.PI * 2);
          ctx!.fillStyle = `rgba(255, 255, 255, ${0.9 * fade})`;
          ctx!.fill();
        }
      }

      /* ── constellation particles ── */
      for (const p of particles) {
        if (!reduceMotion) {
          p.x += p.vx;
          p.y += p.vy;

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

          p.vx *= 0.995;
          p.vy *= 0.995;

          if (p.x < -10) p.x = width + 10;
          if (p.x > width + 10) p.x = -10;
          if (p.y < -10) p.y = height + 10;
          if (p.y > height + 10) p.y = -10;
        }

        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(74, 222, 128, 0.3)";
        ctx!.fill();
      }

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

      /* ── spotlight ── */
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
    nextShotAt = performance.now() + 2000;
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
      {/* drifting nebulas */}
      <div className="nebula nebula-green" />
      <div className="nebula nebula-blue" />
      {/* faint dot grid */}
      <div className="absolute inset-0 bg-dotgrid opacity-30" />
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
