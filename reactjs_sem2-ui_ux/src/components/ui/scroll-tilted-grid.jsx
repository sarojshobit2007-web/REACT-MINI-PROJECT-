"use client";;
import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  cubicBezier,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";

export const DEFAULT_GRID_IMAGES = [
  "https://i.pinimg.com/736x/de/0f/9c/de0f9c57bf7ae1c48ea467ffe9817fdc.jpg",
  "https://i.pinimg.com/736x/80/17/36/8017367dbe52dae63b58a678018795ee.jpg",
  "https://i.pinimg.com/736x/0d/b6/1f/0db61f5245c835228df83398f6d96ceb.jpg",
  "https://i.pinimg.com/736x/39/27/f5/3927f53cebd0a148ba806fbd15e1fdd9.jpg",
  "https://i.pinimg.com/1200x/5f/ae/6d/5fae6de0940fe4a2471f34fb1b259b77.jpg",
  "https://i.pinimg.com/736x/df/04/61/df0461286b3e5291300adbffa70b3e9e.jpg",
  "https://i.pinimg.com/736x/6d/45/f1/6d45f1c96c3316c3bc5055ed6e8e3b8f.jpg",
  "https://i.pinimg.com/736x/a9/4c/e0/a94ce014127cfded1c7160b110eb7a86.jpg",
  "https://i.pinimg.com/736x/fe/f0/8a/fef08a661d0ef55561d99a293c79dd81.jpg",
  "https://i.pinimg.com/736x/84/c6/10/84c610443c77c1e34398f071fdc3b71a.jpg",
  "https://i.pinimg.com/736x/54/13/9d/54139d6fd658b1d5e71cdc07ea37a57c.jpg",
  "https://i.pinimg.com/736x/2d/0b/74/2d0b74227b38d56fcc8b9f4872addcfc.jpg",
];

// Smooth easing — avoids the janky linear default
const ease = cubicBezier(0.22, 1, 0.36, 1);

const MAX_WIDTH_CLASS = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  none: "",
};

const GAP_CLASS = {
  4: "gap-4",
  6: "gap-6",
  8: "gap-8",
  10: "gap-10",
  12: "gap-12",
  14: "gap-14",
};

function Tile({ item, side, config }) {
  const ref = useRef(null);

  // Observe scroll progress relative to this tile only
  const { scrollYProgress: p } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  const reduce = useReducedMotion();
  const sign = side === "L" ? -1 : 1;
  const { aspectRatio, perspective, maxTilt, rounded } = config;

  // ── Keep only GPU-composited transforms (no filter/blur/contrast) ──────────
  // translateY: card drifts up as it scrolls into view
  const ty = useTransform(p, [0, 0.5, 1], ["18%", "0%", "-18%"], { ease });
  // rotateX: the "tilt forward / settle / tilt back" effect
  const rx = useTransform(p, [0, 0.5, 1], [maxTilt * 0.6, 0, -maxTilt * 0.6], { ease });
  // slight horizontal drift per column
  const tx = useTransform(
    p,
    [0, 0.5, 1],
    [`${sign * 10}%`, "0%", `${sign * 10}%`],
    { ease }
  );
  // opacity: fade in from edges
  const opacity = useTransform(p, [0, 0.25, 0.75, 1], [0, 1, 1, 0], { ease });

  if (reduce) {
    return (
      <figure ref={ref} className="relative z-10 m-0">
        <div
          className="relative w-full overflow-hidden"
          style={{ aspectRatio, borderRadius: rounded }}
        >
          <div className="absolute inset-0">{item}</div>
        </div>
      </figure>
    );
  }

  return (
    <motion.figure
      ref={ref}
      className="relative z-10 m-0"
      // perspective on the parent enables the rotateX 3-D effect
      style={{ perspective }}
    >
      <motion.div
        className="relative w-full overflow-hidden"
        style={{
          aspectRatio,
          borderRadius: rounded,
          // Keep all motion on compositor-only properties
          x: tx,
          y: ty,
          rotateX: rx,
          opacity,
          // Promote to its own GPU layer — prevents layout thrash
          willChange: "transform, opacity",
          transform: "translateZ(0)",
        }}
      >
        {item}
      </motion.div>
    </motion.figure>
  );
}

/**
 * Editorial scroll-tilted grid. Cards tilt in from below,
 * settle into focus, then tilt out above — silky smooth.
 */
export function ScrollTiltedGrid({
  images = DEFAULT_GRID_IMAGES,
  loop = false,
  initialCycles = 3,
  aspectRatio = "3/4",
  maxWidth = "lg",
  gap = 10,
  perspective = 900,
  maxTilt = 50,      // reduced from 70 — less extreme = smoother
  maxBlur = 0,       // kept in signature for API compat; no longer used
  rounded = "0.375rem",
  className,
} = {}) {
  const [cycles, setCycles] = useState(loop ? initialCycles : 1);
  const sentinelRef = useRef(null);

  useEffect(() => {
    if (!loop) return;
    const el = sentinelRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) setCycles((c) => c + 2);
      },
      { rootMargin: "1500px 0px 1500px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [loop]);

  const items = useMemo(
    () => (loop ? Array.from({ length: cycles }, () => images).flat() : [...images]),
    [loop, cycles, images]
  );

  const config = useMemo(
    () => ({ aspectRatio, perspective, maxTilt, rounded }),
    [aspectRatio, perspective, maxTilt, rounded]
  );

  const gridClass = [
    "mx-auto mt-4 mb-24 grid w-full grid-cols-1 sm:grid-cols-2 px-6 py-8",
    MAX_WIDTH_CLASS[maxWidth],
    GAP_CLASS[gap],
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={["relative w-full", className].filter(Boolean).join(" ")}>
      <div className={gridClass}>
        {items.map((item, i) => (
          <Tile
            key={`${i}`}
            item={item}
            side={i % 2 === 0 ? "L" : "R"}
            config={config}
          />
        ))}
      </div>
      {loop ? <div ref={sentinelRef} aria-hidden className="h-px w-full" /> : null}
    </section>
  );
}
