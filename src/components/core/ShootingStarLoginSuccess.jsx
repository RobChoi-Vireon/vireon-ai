import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * ShootingStarLoginSuccess
 * A full-screen, Rolls‑Royce headliner–inspired starfield with a deliberate,
 * slow, premium-feel shooting‑star sequence for post‑login success.
 *
 * Usage:
 * <ShootingStarLoginSuccess
 *   durationMs={7000}
 *   title="Welcome back, Robert"
 *   subtitle="Vireon is syncing your Market Pulse"
 *   onComplete={() => router.push("/dashboard")}
 * />
 */
export default function ShootingStarLoginSuccess({
  durationMs = 6500,
  title = "Login Successful",
  subtitle = "Preparing your workspace…",
  onComplete,
}) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const startRef = useRef(null);
  const [phase, setPhase] = useState("idle");
  const [mounted, setMounted] = useState(false);

  // Respect reduced motion
  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c) return;
    const ctx = c.getContext("2d");
    if (!ctx) return;

    let W = (c.width = c.offsetWidth * devicePixelRatio);
    let H = (c.height = c.offsetHeight * devicePixelRatio);

    const resize = () => {
      W = c.width = c.offsetWidth * devicePixelRatio;
      H = c.height = c.offsetHeight * devicePixelRatio;
      initStars();
    };
    const ro = new ResizeObserver(resize);
    ro.observe(c);

    let stars = [];
    const STAR_COUNT = Math.min(300, Math.floor((c.offsetWidth * c.offsetHeight) / 3500));

    function rand(a, b) {
      return a + Math.random() * (b - a);
    }

    function initStars() {
      stars = new Array(STAR_COUNT).fill(0).map(() => ({
        x: Math.random() * W,
        y: Math.random() * H,
        z: rand(0.2, 1.2),
        tw: rand(0.2, 1.0),
        phase: Math.random() * Math.PI * 2,
      }));
    }
    initStars();

    // Animation pacing
    const shootDelay = prefersReducedMotion ? 600 : 1800;
    const crestDelay = prefersReducedMotion ? 1200 : 4300;
    const outDelay = Math.max(crestDelay + 800, durationMs - 400);

    // Cubic bezier path for the shooting star (diagonal arc)
    const path = {
      p0: { x: -0.1, y: 0.1 },
      p1: { x: 0.25, y: 0.0 },
      p2: { x: 0.65, y: 0.35 },
      p3: { x: 1.1, y: 0.6 },
    };
    function cubicBezier(t) {
      const { p0, p1, p2, p3 } = path;
      const x =
        Math.pow(1 - t, 3) * p0.x +
        3 * Math.pow(1 - t, 2) * t * p1.x +
        3 * (1 - t) * Math.pow(t, 2) * p2.x +
        Math.pow(t, 3) * p3.x;
      const y =
        Math.pow(1 - t, 3) * p0.y +
        3 * Math.pow(1 - t, 2) * t * p1.y +
        3 * (1 - t) * Math.pow(t, 2) * p2.y +
        Math.pow(t, 3) * p3.y;
      return { x: x * W, y: y * H };
    }

    // Glow helper
    function radialGlow(x, y, r, a) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, `rgba(255,255,255,${a})`);
      g.addColorStop(1, "rgba(255,255,255,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    function draw(timestamp) {
      if (startRef.current === null) startRef.current = timestamp;
      const t = timestamp - (startRef.current || 0);

      // Deep space background
      ctx.clearRect(0, 0, W, H);
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, "#05060a");
      bg.addColorStop(1, "#0a0f1a");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      // Twinkling stars
      for (let s of stars) {
        const tw = (Math.sin(s.phase + t * 0.002 * s.tw) + 1) * 0.5;
        const r = (0.6 + 1.2 * tw) * s.z * devicePixelRatio;
        ctx.globalAlpha = 0.25 + 0.65 * tw;
        ctx.beginPath();
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
        ctx.fillStyle = "#f5f7ff";
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      if (t > shootDelay && t < crestDelay) {
        if (phase !== "shoot") setPhase("shoot");
        const span = crestDelay - shootDelay;
        let u = (t - shootDelay) / span;
        u = Math.min(Math.max(u, 0), 1);
        const eased = 1 - Math.pow(1 - u, 3);
        const pos = cubicBezier(eased);

        // Comet trail
        const trailLen = 80 * devicePixelRatio;
        for (let i = 0; i < trailLen; i++) {
          const b = Math.max(0, 1 - i / trailLen);
          const p = cubicBezier(Math.max(0, eased - i / (trailLen * 3)));
          ctx.globalAlpha = 0.15 * b;
          radialGlow(p.x, p.y, 10 * b * devicePixelRatio, 0.6 * b);
        }
        ctx.globalAlpha = 1;

        // Star head
        radialGlow(pos.x, pos.y, 18 * devicePixelRatio, 0.9);

        // Light streak
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.moveTo(pos.x - 40 * devicePixelRatio, pos.y - 8 * devicePixelRatio);
        ctx.lineTo(pos.x + 70 * devicePixelRatio, pos.y + 10 * devicePixelRatio);
        ctx.lineWidth = 2 * devicePixelRatio;
        ctx.strokeStyle = "rgba(255,255,255,0.9)";
        ctx.stroke();
        ctx.restore();
      } else if (t >= crestDelay && t < outDelay) {
        if (phase !== "crest") setPhase("crest");
        const cx = W * 0.5, cy = H * 0.5;
        radialGlow(cx, cy, Math.min(W, H) * 0.35, 0.06);
        radialGlow(cx, cy, Math.min(W, H) * 0.15, 0.08);
      } else if (t >= outDelay) {
        if (phase !== "out") setPhase("out");
        const fade = Math.min(1, (t - outDelay) / 600);
        ctx.fillStyle = `rgba(5,6,10,${fade})`;
        ctx.fillRect(0, 0, W, H);
        if (t >= durationMs) {
          cancel();
          onComplete && onComplete();
          return;
        }
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    function cancel() {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
      startRef.current = null;
      ro.disconnect();
    }

    rafRef.current = requestAnimationFrame(draw);
    return cancel;
  }, [durationMs, onComplete, phase]);

  const crestVisible = phase === "crest" || phase === "out";

  return (
    <div className="fixed inset-0 z-[9999] bg-black text-white">
      <canvas ref={canvasRef} className="h-full w-full block" />

      <AnimatePresence>
        {mounted && crestVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="pointer-events-none absolute inset-0 grid place-items-center"
          >
            <div className="flex flex-col items-center gap-4 text-center">
              <CrestCheck />
              <div className="space-y-1">
                <h1 className="text-2xl md:text-3xl font-semibold tracking-tight drop-shadow">
                  {title}
                </h1>
                <p className="text-sm md:text-base text-zinc-300">
                  {subtitle}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ProgressBar durationMs={durationMs} />
    </div>
  );
}

function CrestCheck() {
  return (
    <motion.div
      initial={{ scale: 0.7, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 14 }}
      className="relative"
    >
      <div className="h-16 w-16 md:h-20 md:w-20 rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg grid place-items-center">
        <motion.svg
          width="36"
          height="36"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-white drop-shadow"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeInOut", delay: 0.2 }}
        >
          <path d="M20 6L9 17l-5-5" />
        </motion.svg>
      </div>
      <div className="absolute inset-0 rounded-2xl">
        <div
          className="absolute inset-0 rounded-2xl blur-2xl opacity-50"
          style={{
            background:
              "radial-gradient(closest-side, rgba(255,255,255,0.25), transparent)",
          }}
        />
      </div>
    </motion.div>
  );
}

function ProgressBar({ durationMs }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <div className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none">
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[60%] max-w-xl">
        <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
          {mounted && (
            <motion.div
              className="h-full bg-white/60"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{
                duration: Math.max(0.2, durationMs / 1000 - 0.4),
                ease: "linear",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}