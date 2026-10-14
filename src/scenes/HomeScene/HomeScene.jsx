import React, { useState, useMemo, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import Character from "../../components/Character/Character.jsx";
import ProjectObject from "../../components/ProjectObject/ProjectObject.jsx";
import ProjectPanel from "../../components/ProjectPanel/ProjectPanel.jsx";
import PixelSprite from "../../components/PixelSprite/PixelSprite.jsx";
import { projects } from "../../data/projects.js";
import { useDayNight } from "../../context/DayNightContext.jsx";
import PixelHills from "../../components/PixelHills/PixelHills.jsx";
import PixelGround from "../../components/PixelGround/PixelGround.jsx";
import {
  cloudGrid,
  shade,
} from "../../pixelArt/pixelShapes.js";
import HouseInterior from "../HouseInterior/HouseInterior.jsx";
import houseImg from "../../assets/house/house.png";
import bikeImg from "../../assets/decor/bike.png";
import Hint from "../../components/Hint/Hint.jsx";
import treeClusterImg from "../../assets/decor/tree-cluster.png";

const CLOUD_GRIDS = [cloudGrid(0), cloudGrid(1), cloudGrid(2)];
const BIG_STAR = [".#.", "#o#", ".#."];

function discGrid(r, craters) {
  const n = r * 2 + 1;
  const rows = [];
  for (let y = 0; y < n; y++) {
    let row = "";
    for (let x = 0; x < n; x++) {
      const d = Math.hypot(x - r, y - r);
      if (d > r + 0.4) row += ".";
      else if (d > r - 1) row += "s";
      else row += "S";
    }
    rows.push(row.split(""));
  }
  if (craters) {
    [[r - 2, r - 2], [r + 1, r + 1], [r - 1, r + 2], [r + 2, r - 1]].forEach(([x, y]) => {
      if (rows[y] && rows[y][x] === "S") rows[y][x] = "m";
    });
  }
  return rows.map((r2) => r2.join(""));
}
const SUN_GRID = discGrid(5, false);
const MOON_GRID = discGrid(5, true);

// ---- Day/Night stage system ----
const STAGES = [
  {
    id: "morning",
    label: "Morning",
    sky: ["#8FCFEB", "#B9E4F5", "#FFFDF7"],
    sunY: 20,
    sunX: 70,
    sunColor: "#FFD873",
    haloColor: "#FFF3C4",
    cloudTint: "#FFFDF7",
    groundTop: "#8FD9A8",
    groundBottom: "#5FB37E",
    showMoon: false,
    showStars: 0,
    windowGlow: 0,
  },
  {
    id: "lateMorning",
    label: "Late Morning",
    sky: ["#7FC6EA", "#AEDFF2", "#FDF8EE"],
    sunY: 14,
    sunX: 74,
    sunColor: "#FFDD8A",
    haloColor: "#FFF0C0",
    cloudTint: "#FFFDF7",
    groundTop: "#8AD79F",
    groundBottom: "#57AC77",
    showMoon: false,
    showStars: 0,
    windowGlow: 0,
  },
  {
    id: "afternoon",
    label: "Afternoon",
    sky: ["#79BEE8", "#A9D8EE", "#FBF1DE"],
    sunY: 8,
    sunX: 78,
    sunColor: "#FFCF6E",
    haloColor: "#FFE7A8",
    cloudTint: "#FFF6E8",
    groundTop: "#86D19A",
    groundBottom: "#4F9F6E",
    showMoon: false,
    showStars: 0,
    windowGlow: 0,
  },
  {
    id: "sunset",
    label: "Sunset",
    sky: ["#5B7FBE", "#E58F7E", "#FFC97A"],
    sunY: 22,
    sunX: 82,
    sunColor: "#FF9E5E",
    haloColor: "#FFCB8C",
    cloudTint: "#FFD6B8",
    groundTop: "#7BBE8E",
    groundBottom: "#457D5C",
    showMoon: false,
    showStars: 8,
    windowGlow: 0.3,
  },
  {
    id: "dusk",
    label: "Dusk",
    sky: ["#2F3B72", "#5C4E8C", "#B67B9E"],
    sunY: 30,
    sunX: 86,
    sunColor: "#FF8A65",
    haloColor: "#E8A6C4",
    cloudTint: "#C9AEDC",
    groundTop: "#5D9C79",
    groundBottom: "#33604A",
    showMoon: true,
    showStars: 30,
    windowGlow: 0.7,
  },
  {
    id: "night",
    label: "Night",
    sky: ["#17164A", "#4A2F8A", "#C2609A"],
    sunY: 16,
    sunX: 72,
    sunColor: "#FFF6D9",
    haloColor: "#DCE0FF",
    cloudTint: "#7B6BA8",
    groundTop: "#3E6E58",
    groundBottom: "#20402F",
    showMoon: true,
    showStars: 110,
    windowGlow: 1,
  },
];

function lerpColor(a, b, t) {
  const pa = a.match(/\w\w/g).map((h) => parseInt(h, 16));
  const pb = b.match(/\w\w/g).map((h) => parseInt(h, 16));
  const p = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${p[0]}, ${p[1]}, ${p[2]})`;
}

function useBlendedStage(index) {
  // Blend between current and next stage isn't needed since we crossfade whole layers.
  return STAGES[index];
}

const sparkGrid = (n) => {
  const T = Math.pow(n, 0.75) + 0.1;
  return Array.from({ length: n * 2 + 1 }, (_, y) =>
    Array.from({ length: n * 2 + 1 }, (_, x) => {
      const dx = Math.abs(x - n);
      const dy = Math.abs(y - n);
      if (Math.pow(dx, 0.75) + Math.pow(dy, 0.75) > T) return ".";
      const d = dx + dy;
      return d <= 1 ? "o" : d <= Math.ceil(n / 2) ? "a" : "b";
    }).join("")
  );
};const SPARK_M = sparkGrid(3);
const SPARK_L = sparkGrid(5);

const SPARK_S = sparkGrid(2);

function Star({ x, y, delay, color }) {
  const kind = delay === 20 || delay === 77 ? "L" : delay === 8 || delay === 41 || delay === 63 || delay === 99 ? "M" : "d";
  const dur = 2.6 + (delay % 4);
  const bright = 0.35 + (((delay * 37) % 10) / 10) * 0.55;
  return (
    <div
      className="pw-star"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        animationDuration: `${3 + (delay % 4)}s`,
        animationDelay: `${(delay % 7) * 0.4}s`,
      }}
    >
      {kind === "d" ? (
        <div
          style={{
            width: delay % 7 === 0 ? 3 : 2,
            height: delay % 7 === 0 ? 3 : 2,
            background: delay % 4 === 0 ? "#CFC8FF" : delay % 2 ? "#FFFDF7" : color,
            opacity: bright,
            boxShadow: "0 0 2px rgba(255, 243, 200, 0.5)",
          }}
        />
      ) : (
        <div
          style={{
            animation: `sparkPulse ${dur}s ease-in-out infinite`,
            animationDelay: `${(delay % 5) * 0.5}s`,
            filter: "drop-shadow(0 0 3px rgba(255, 243, 200, 0.9))",
          }}
        >
          <PixelSprite
            grid={kind === "L" ? SPARK_L : kind === "M" ? SPARK_M : SPARK_S}
            colorMap={{ o: "#FFFFFF", a: color, b: "#B9B3E8" }}
            pixelSize={2}
          />
        </div>
      )}
      <style>{`
        @keyframes sparkPulse {
          0%, 100% { transform: scale(0.8); opacity: 0.6; }
          50% { transform: scale(1.15); opacity: 1; }
        }
        .celestial { filter: drop-shadow(0 0 14px rgba(255, 246, 217, 0.9)) drop-shadow(0 0 40px rgba(220, 224, 255, 0.6)); }
      `}</style>
    </div>
  );
}

function Cloud({ x, y, size = 4, tint, speed, variant = 0 }) {
  return (
    <motion.div
      className="pixel-cloud"
      style={{
        position: "absolute",
        left: `${x}%`,
        top: `${y}%`,
      }}
      animate={{ x: [0, 16, 0] }}
      transition={{ duration: speed, repeat: Infinity, ease: "easeInOut" }}
    >
      <PixelSprite
        grid={CLOUD_GRIDS[variant]}
        colorMap={{ C: tint, c: shade(tint, -22), W: shade(tint, 14) }}
        pixelSize={size}
        animateFill
      />
    </motion.div>
  );
}

function Celestial({ stage }) {
  const isNight = stage.showMoon;
  const c = stage.sunColor;
  return (
    <motion.div
      className="celestial"
      animate={{ left: `${stage.sunX}%`, top: `${stage.sunY}%` }}
      transition={{ duration: 0.9, ease: "easeInOut" }}
    >
      <PixelSprite
        grid={isNight ? MOON_GRID : SUN_GRID}
        colorMap={{ S: c, s: shade(c, -22), m: shade(c, -50) }}
        pixelSize={3}
        animateFill
      />
    </motion.div>
  );
}

function House({ glow, onEnter }) {
  return (
    <motion.button
      className="pixel-house"
      onClick={onEnter}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      aria-label="Enter the house"
      title="Enter the house"
    >
      <img src={houseImg} alt="" className="pixel-house-img" />
      <Hint text="COME IN" variant="house" />
      <motion.div
        className="pixel-house-glow"
        animate={{ opacity: glow }}
        transition={{ duration: 0.8 }}
      />
    </motion.button>
  );
}

function DialogueBox({ text, onNext, onClose }) {
  return (
    <motion.div
      className="dialogue-box"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 16 }}
      transition={{ duration: 0.25 }}
    >
      <p>{text}</p>
      <div className="dialogue-actions">
        {onNext && (
          <button className="pixel-btn" onClick={onNext}>
            Next ▸
          </button>
        )}
        {onClose && (
          <button className="pixel-btn ghost" onClick={onClose}>
            Skip
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function PixelWorldScaffold() {
  const { stageIndex } = useDayNight();
  const [introStep, setIntroStep] = useState(0);
  const [introVisible, setIntroVisible] = useState(true);
  const [nightStep, setNightStep] = useState(0);
  const [nightVisible, setNightVisible] = useState(true);
  const [showInterior, setShowInterior] = useState(false);
  const stage = useBlendedStage(stageIndex);
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" && window.innerWidth <= 560
  );
  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth <= 560);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // The world reflects real exploration progress: time only ever moves
  // forward, driven by which scenes have been visited (see DayNightContext).

  // ---- Character movement (desktop: arrow keys or click-to-walk) ----
  const [charX, setCharX] = useState(48);
  const [facing, setFacing] = useState("right");
  const [isWalking, setIsWalking] = useState(false);
  const walkTimeout = useRef(null);
  const keysDown = useRef(new Set());

  useEffect(() => {
    const speed = 1.4; // % per tick
    let frame;

    const tick = () => {
      if (keysDown.current.size > 0) {
        setCharX((prev) => {
          let next = prev;
          if (keysDown.current.has("ArrowLeft")) {
            next = Math.max(4, prev - speed);
            setFacing("left");
          }
          if (keysDown.current.has("ArrowRight")) {
            next = Math.min(94, prev + speed);
            setFacing("right");
          }
          return next;
        });
        setIsWalking(true);
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);

    const onKeyDown = (e) => {
      if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        keysDown.current.add(e.key);
      }
    };
    const onKeyUp = (e) => {
      keysDown.current.delete(e.key);
      if (keysDown.current.size === 0) setIsWalking(false);
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, []);

  // ---- Project objects in the world (featured ones shown on Home) ----
  const [selectedProject, setSelectedProject] = useState(null);
  const marketProject = useMemo(
    () => projects.find((p) => p.id === "kinfolk-craft"),
    []
  );
  const featuredInWorld = useMemo(
    () => ["jobhunter", "askmydoc"].map((id) => projects.find((p) => p.id === id)),
    []
  );
  const handleGroundClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = ((e.clientX - rect.left) / rect.width) * 100;
    const target = Math.min(94, Math.max(4, pct));
    setFacing(target > charX ? "right" : "left");
    setIsWalking(true);
    setCharX(target);
    clearTimeout(walkTimeout.current);
    walkTimeout.current = setTimeout(() => setIsWalking(false), 400);
  };

  const skyGradient = `linear-gradient(180deg, ${stage.sky[0]} 0%, ${stage.sky[1]} 55%, ${stage.sky[2]} 100%)`;

  const stars = useMemo(() => {
    let seed = 7;
    const rnd = () => {
      seed = (seed * 16807) % 2147483647;
      return seed / 2147483647;
    };
    return Array.from({ length: stage.showStars }, (_, i) => ({
      x: 2 + rnd() * 96,
      y: 2 + rnd() * 46,
      delay: i,
    }));
  }, [stage.showStars]);

  const intro = [
    "Hi! I'm Sejal.",
    "Welcome to my little corner of the internet.",
    "Feel free to explore \u2014 or jump straight to the menu.",
  ];

  const nightReturn = [
    "It's getting late.",
    "Thanks for spending the day here.",
  ];

  return (
    <div className="pw-root">
      <style>{`
        .pw-root {
          --gh: 190px;
          --s: 1;
          --star-color: #FFE9A8;
          position: relative;
          width: 100%;
          height: 560px;
          overflow: hidden;
          border-radius: 10px;
          border: 4px solid #4A3F6B;
          font-family: 'Nunito', sans-serif;
          image-rendering: pixelated;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
        }

        .sky-layer {
          position: absolute;
          inset: 0;
          transition: background 0.9s ease;
        }

        .celestial {
          position: absolute;
          transform: translate(-50%, -50%);
          z-index: 8;
        }
        .moon-craters { position: relative; width: 100%; height: 100%; }
        .moon-craters span {
          position: absolute;
          background: rgba(80,80,110,0.35);
          border-radius: 50%;
        }
        .moon-craters span:nth-child(1) { width: 6px; height: 6px; top: 6px; left: 8px; }
        .moon-craters span:nth-child(2) { width: 4px; height: 4px; top: 18px; left: 20px; }
        .moon-craters span:nth-child(3) { width: 5px; height: 5px; top: 20px; left: 6px; }

        .pw-star {
          position: absolute;
          animation-name: pw-twinkle;
          animation-timing-function: steps(1, end);
          animation-iteration-count: infinite;
        }
        @keyframes pw-twinkle {
          0%, 60%, 100% { opacity: 1; }
          70%, 85% { opacity: 0.3; }
        }

        .pixel-cloud { z-index: 2; }

        .ground {
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: var(--gh);
          border-top: 4px solid #4A3F6B;
          z-index: 1;
          overflow: hidden;
        }
        .ground-art {
          position: absolute;
          inset: 0;
        }
        .pw-tree-cluster {
          position: absolute;
          left: 28%;
          bottom: calc(var(--gh) - 74px * var(--s));
          width: calc(260px * var(--s));
          height: auto;
          image-rendering: pixelated;
          z-index: 3;
        }
        .pw-bike {
          position: absolute;
          right: 1.5%;
          bottom: calc(var(--gh) - 106px * var(--s));
          width: calc(110px * var(--s));
          height: calc(110px * var(--s));
          image-rendering: pixelated;
          z-index: 3;
        }
        .pw-shadow {
          position: absolute;
          height: 10px;
          background: rgba(20, 35, 25, 0.28);
          clip-path: polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%);
          pointer-events: none;
          z-index: 2;
        }

        .pixel-house {
          position: absolute;
          bottom: calc(var(--gh) - 52px * var(--s));
          left: 8%;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          z-index: 4;
        }
        .pixel-house:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 4px;
        }
        .pixel-house-img {
          display: block;
          width: calc(210px * var(--s));
          height: calc(210px * var(--s));
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        .pixel-house-glow {
          position: absolute;
          top: 30%;
          left: 22%;
          width: 22%;
          height: 18%;
          background: radial-gradient(circle, rgba(255,233,168,0.9) 0%, rgba(255,233,168,0) 70%);
          pointer-events: none;
          opacity: 0;
        }

        .dialogue-box {
          position: absolute;
          bottom: 20px;
          left: 20px;
          right: 20px;
          max-width: 420px;
          margin: 0 auto;
          background: #FFFDF7;
          border: 4px solid #4A3F6B;
          border-radius: 8px;
          padding: 14px 18px;
          box-shadow: 0 4px 0 #4A3F6B;
          z-index: 10;
          box-sizing: border-box;
        }
        .dialogue-box p {
          margin: 0 0 10px 0;
          font-family: 'Silkscreen', monospace;
          font-size: 13px;
          line-height: 1.6;
          color: #3A3252;
        }
        .dialogue-actions {
          display: flex;
          gap: 8px;
          justify-content: flex-end;
          flex-wrap: wrap;
        }
        .pixel-btn {
          font-family: 'Silkscreen', monospace;
          font-size: 11px;
          background: #FFD873;
          border: 3px solid #4A3F6B;
          border-radius: 4px;
          padding: 6px 12px;
          cursor: pointer;
          box-shadow: 0 3px 0 #4A3F6B;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          white-space: nowrap;
        }
        .pixel-btn:hover { transform: translateY(1px); box-shadow: 0 2px 0 #4A3F6B; }
        .pixel-btn.ghost { background: transparent; color: #4A3F6B; }

        .time-badge {
          position: absolute;
          top: 10px;
          left: 10px;
          font-family: 'Silkscreen', monospace;
          font-size: 9px;
          padding: 6px 10px;
          border: 2px solid #4A3F6B;
          border-radius: 5px;
          background: rgba(255,255,255,0.85);
          color: #4A3F6B;
          z-index: 20;
        }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }

        /* Mobile: shorter world, scaled-down sprites, bigger tap targets */
        @media (max-width: 560px) {
          .pw-root { --gh: 140px; --s: 0.7; height: calc(100svh - 150px); min-height: 440px; max-height: 720px; border-radius: 8px; border-width: 3px; } .project-object-img { transform: scale(0.72); transform-origin: bottom left; }
          .dialogue-box { left: 12px; right: 12px; padding: 10px 12px; bottom: 10px; }
          .dialogue-box p { font-size: 11px; margin-bottom: 8px; }
          .dialogue-actions { gap: 6px; }
          .dialogue-box .pixel-btn { font-size: 10px; padding: 7px 11px; min-height: 30px; }
        }

        @media (max-width: 380px) {
          .pw-root { --gh: 120px; --s: 0.6; height: calc(100svh - 140px); min-height: 400px; }
        }
      `}</style>

      <AnimatePresence mode="sync">
        <motion.div
          key={stage.id}
          className="sky-layer"
          style={{ background: skyGradient }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {stars.map((s, i) => (
        <Star key={i} {...s} color="#FFE9A8" />
      ))}

      <AnimatePresence mode="sync">
        <motion.div
          key={"hills-" + stage.id}
          style={{ position: "absolute", left: 0, right: 0, bottom: "var(--gh)", height: 80, zIndex: 1, pointerEvents: "none" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.9, ease: "easeInOut" }}
        >
          <PixelHills skyBottom={stage.sky[2]} groundTop={stage.groundTop} groundBottom={stage.groundBottom} />
        </motion.div>
      </AnimatePresence>

      <Cloud x={6} y={9} size={4} tint={stage.cloudTint} speed={18} variant={0} />
      <Cloud x={52} y={5} size={3} tint={stage.cloudTint} speed={22} variant={1} />
      <Cloud x={72} y={19} size={4} tint={stage.cloudTint} speed={16} variant={2} />

      <Celestial stage={stage} />

      <img
        src={treeClusterImg}
        alt=""
        className="pw-tree-cluster"
      />

      <House glow={stage.windowGlow} onEnter={() => setShowInterior(true)} />

      <motion.button className="pw-bike" onClick={() => setSelectedProject(projects.find((p) => p.id === "polaloo"))} aria-label="View project: Polaloo" title="Polaloo" whileHover={{ scale: 1.08, y: -3 }} whileTap={{ scale: 0.95 }} transition={{ duration: 0.2 }} style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer" }}><img src={bikeImg} alt="" style={{ width: "100%", height: "100%", display: "block", imageRendering: "pixelated" }} /><Hint /></motion.button>

      {/* soft pixel shadows plant everything on the ground */}
      <div className="pw-shadow" style={{ left: "calc(8% + 8px)", width: "calc(190px * var(--s))", bottom: "calc(var(--gh) - 34px * var(--s))" }} />
      <div className="pw-shadow" style={{ left: "calc(28% + 30px * var(--s))", width: "calc(190px * var(--s))", bottom: "calc(var(--gh) - 28px * var(--s))" }} />
      <div className="pw-shadow" style={{ right: "calc(1.5% + 11px * var(--s))", width: "calc(88px * var(--s))", bottom: "calc(var(--gh) - 84px * var(--s))" }} />
      <div className="pw-shadow" style={{ left: "calc(62% + 12px)", width: 40, bottom: "calc(var(--gh) - 50px)" }} />
      <div className="pw-shadow" style={{ left: "calc(56.1% + 8px)", width: 28, bottom: "calc(var(--gh) - 32px)" }} />

      <ProjectObject
        project={featuredInWorld[0]}
        x={62}
        y="calc(var(--gh) - 53px)"
        size={64}
        onSelect={setSelectedProject}
      />
      <ProjectObject
        project={featuredInWorld[1]}
        x={56.1}
        y="calc(var(--gh) - 35px)"
        size={44}
        z={4}
        onSelect={setSelectedProject}
      />
      {marketProject && (
        <ProjectObject
          project={marketProject}
          x={68}
          y="calc(var(--gh) - 33px)"
          size={140}
          z={2}
          onSelect={setSelectedProject}
        />
      )}

      <Character x={charX} facing={facing} isWalking={isWalking} />

      <motion.div
        className="ground"
        onClick={handleGroundClick}
        style={{ cursor: "pointer" }}
        animate={{ backgroundColor: stage.groundBottom }}
        transition={{ duration: 0.9 }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={stage.id}
            className="ground-art"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.9, ease: "easeInOut" }}
          >
            <PixelGround
              top={stage.groundTop}
              bottom={stage.groundBottom}
              houseLeftPct={0.08}
              houseOffsetPx={isMobile ? 105 * 0.7 : 105}
            />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {introVisible && stageIndex === 0 && (
          <DialogueBox
            text={intro[introStep]}
            onNext={
              introStep < intro.length - 1
                ? () => setIntroStep((d) => d + 1)
                : () => setIntroVisible(false)
            }
            onClose={() => setIntroVisible(false)}
          />
        )}
        {nightVisible && stageIndex === 5 && (
          <DialogueBox
            text={nightReturn[nightStep]}
            onNext={
              nightStep < nightReturn.length - 1
                ? () => setNightStep((d) => d + 1)
                : () => setNightVisible(false)
            }
            onClose={() => setNightVisible(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedProject && (
          <ProjectPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showInterior && (
          <HouseInterior onExit={() => setShowInterior(false)} />
        )}
      </AnimatePresence>
    </div>
  );
}
