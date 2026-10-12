import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import ProjectPanel from "../../components/ProjectPanel/ProjectPanel.jsx";
import { projects } from "../../data/projects.js";
import sofaImg from "../../assets/furniture/sofa.png";
import bookshelfImg from "../../assets/furniture/bookshelf.png";
import tableImg from "../../assets/objects/bead-table.png"; import deskImg from "../../assets/objects/study-desk.png";
import RoomBackdrop, { project } from "../../components/RoomBackdrop/RoomBackdrop.jsx";
import { useDayNight } from "../../context/DayNightContext.jsx";
import robotImg from "../../assets/objects/robot.png";
import Hint from "../../components/Hint/Hint.jsx";
import mailSorterImg from "../../assets/objects/mail-sorter.png";
import cameraImg from "../../assets/objects/camera.png";
import arcadeCabinetImg from "../../assets/objects/arcade-cabinet.png";




// ---- Virtual room coordinate system ----
// Every position below is defined in this fixed 880x750 space, then the
// whole room is scaled to fit the actual viewport (see RoomScaler). This
// is what keeps furniture proportional and non-distorted at any size,
// instead of hand-tuning separate pixel values per breakpoint.
const ROOM_WIDTH = 880;
const ROOM_HEIGHT = 750;
const FLOOR_TOP = 484; // (old wall/floor CSS only; the room is drawn by RoomBackdrop)

// Each asset's *content* bounding box within its (square, 64x64) canvas —
// measured directly from the PNGs, not guessed — so floor anchoring lines
// up with where the furniture is actually drawn, not the padded edge.
// bottomRatio = where the drawn base sits in the 64px canvas; xr = content
// left/right edge (0-64) so shadows match the real silhouette.
const ASSET = {
  sofa: { img: sofaImg, bottomRatio: 0.766, xr: [4, 60] },
  bookshelf: { img: bookshelfImg, bottomRatio: 0.938, xr: [11, 52] },
  journal: { img: deskImg, bottomRatio: 0.89, xr: [6, 58] },
  robot: { img: robotImg, bottomRatio: 0.891, xr: [16, 47] },
  "mail-sorter": { img: mailSorterImg, bottomRatio: 0.875, xr: [7, 57] },
  camera: { img: cameraImg, bottomRatio: 0.781, xr: [7, 57] },
  "craft-table": { img: tableImg, bottomRatio: 0.85, xr: [4, 60] },
  "arcade-cabinet": { img: arcadeCabinetImg, bottomRatio: 0.891, xr: [14, 50] },
};

// ---- Layout in WORLD coordinates (X across 0..880, Z depth: 0 = front, 700 = back wall) ----
// project() turns that into screen position + a depth scale, so things further
// back are smaller and sit higher, exactly like a real room seen in perspective.
const place = (o) => {
  const { x, y, s } = project(o.X, o.Z);
  return { ...o, centerX: x, groundY: y, width: o.wf * s };
};

const sofa = place({ asset: "sofa", X: 165, Z: 672, wf: 360 });
const PLACEMENTS = [
  // back wall: sofa under the left window, bookshelf in the right corner,
  // EduInbox rack standing right beside the bookshelf
  sofa,
  place({ asset: "bookshelf", X: 775, Z: 660, wf: 330 }),
  place({ asset: "mail-sorter", projectId: "eduinbox", X: 612, Z: 665, wf: 130 }),
  // camera resting on the sofa seat
  {
    asset: "camera",
    projectId: "emotion-detection",
    centerX: sofa.centerX - 0.183 * sofa.width,
    groundY: sofa.groundY - 0.23 * sofa.width,
    width: 0.16 * sofa.width,
    z: 90,
  },
  // front-left corner: arcade (big, because it is close to us)
  place({ asset: "arcade-cabinet", projectId: "airdraw-arena", X: 80, Z: 60, wf: 250 }),
  // bead table on the rug in front of the sofa
  place({ asset: "craft-table", projectId: "bead-pattern-maker", X: 265, Z: 330, wf: 230 }),
  // robot on the open floor, desk in the front-right corner
  place({ asset: "robot", projectId: "smarthire", X: 500, Z: 260, wf: 170 }),
  place({ asset: "journal", projectId: "reflect", X: 700, Z: 110, wf: 290 }),
];

function pct(value, total) {
  return `${(value / total) * 100}%`;
}

// Scales the fixed 880x750 room to exactly fill its container's width, so
// the coordinate system stays pixel-accurate at any screen size instead
// of stretching, overflowing, or needing separate per-breakpoint values.
function RoomScaler({ children }) {
  const outerRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = outerRef.current;
    if (!el) return;
    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;
      setScale(width / ROOM_WIDTH);
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={outerRef} className="room-scaler-outer">
      <div
        className="room-scaler-inner"
        style={{
          width: ROOM_WIDTH,
          height: ROOM_HEIGHT,
          transform: `scale(${scale})`,
        }}
      >
        {children}
      </div>
    </div>
  );
}

export default function HouseInterior({ onExit }) {
  const [selectedProject, setSelectedProject] = useState(null);
  const { stageIndex } = useDayNight();
  const projectById = Object.fromEntries(projects.map((p) => [p.id, p]));

  return (
    <motion.div
      className="interior-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="interior-room"
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="interior-header">
          <span>✦ Sejal's Hall</span>
          <button className="exit-btn" onClick={onExit} aria-label="Exit house">
            ✕ Exit
          </button>
        </div>

        <RoomScaler>
          <RoomBackdrop stage={stageIndex} />

          {PLACEMENTS.map((p, i) => {
            const asset = ASSET[p.asset];
            const project = p.projectId ? projectById[p.projectId] : null;

            // Content-aware floor anchoring: the image's actual drawn
            // base (not its padded canvas edge) touches groundY.
            const contentBottomPx = asset.bottomRatio * p.width;
            const canvasTop = p.groundY - contentBottomPx;
            const zIndex = p.z ?? 10 + Math.round(p.groundY / 10); // closer = in front

            const commonStyle = {
              left: pct(p.centerX - p.width / 2, ROOM_WIDTH),
              top: pct(canvasTop, ROOM_HEIGHT),
              width: pct(p.width, ROOM_WIDTH),
              zIndex,
            };

            const [x0, x1] = asset.xr;
            const shW = ((x1 - x0) / 64) * p.width * 0.95;
            const shCx = p.centerX + (((x0 + x1) / 2 - 32) / 64) * p.width;
            const shadow =
              p.shadow === false ? null : (
                <div
                  key={"sh" + i}
                  className="room-shadow"
                  style={{
                    left: pct(shCx - shW / 2, ROOM_WIDTH),
                    top: pct(p.groundY - 6, ROOM_HEIGHT),
                    width: pct(shW, ROOM_WIDTH),
                    zIndex: p.z ? p.z - 1 : undefined,
                  }}
                />
              );

            if (project) {
              return (
                <React.Fragment key={i}>
                {shadow}
                <motion.button
                  className="room-item room-floor-item room-item-clickable"
                  style={commonStyle}
                  onClick={() => setSelectedProject(project)}
                  aria-label={`View project: ${project.title}`}
                  title={project.title}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.96 }}
                >
                  <img src={asset.img} alt="" className="room-item-img" />
                  {p.asset === "robot" && <Hint text="CLICK AROUND!" variant="robot" />}
                </motion.button>
                </React.Fragment>
              );
            }

            return (
              <React.Fragment key={i}>
                {shadow}
                <img
                  src={asset.img}
                  alt=""
                  className="room-item room-floor-item room-item-img"
                  style={commonStyle}
                />
              </React.Fragment>
            );
          })}
        </RoomScaler>
      </motion.div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Silkscreen:wght@400;700&family=Nunito:wght@400;600;700;800&display=swap');

        .interior-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(27, 31, 59, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 90;
          padding: 20px;
        }
        .interior-room {
          width: min(96%, 900px);
          background: #F4E3C1;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          box-shadow: 0 10px 0 rgba(0,0,0,0.2);
          overflow: hidden;
          font-family: 'Nunito', sans-serif;
        }
        .interior-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #C6604A;
          padding: 12px 18px;
          font-family: 'Silkscreen', monospace;
          font-size: 12px;
          color: #FFFDF7;
        }
        .exit-btn {
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          background: #FFD873;
          color: #4A3F6B;
          border: 2px solid #4A3F6B;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
        }
        .exit-btn:focus-visible {
          outline: 3px solid #FFFDF7;
          outline-offset: 2px;
        }

        .room-scaler-outer {
          width: 100%;
          aspect-ratio: ${ROOM_WIDTH} / ${ROOM_HEIGHT};
          position: relative;
          overflow: hidden;
        }
        .room-scaler-inner {
          position: absolute;
          top: 0;
          left: 0;
          transform-origin: top left;
        }

        .room-wall {
          position: absolute;
          top: 0;
          left: 0;
          width: ${ROOM_WIDTH}px;
          height: ${FLOOR_TOP}px;
          background: linear-gradient(180deg, #EAD3A6 0%, #E4CB98 100%);
        }
        .room-floor {
          position: absolute;
          top: ${FLOOR_TOP}px;
          left: 0;
          width: ${ROOM_WIDTH}px;
          height: ${ROOM_HEIGHT - FLOOR_TOP}px;
          background: linear-gradient(180deg, #C9A15F 0%, #B98E4E 100%);
          border-top: 4px solid #8B6642;
        }

        .room-item {
          position: absolute;
          image-rendering: pixelated;
        }
        .room-item-img {
          display: block;
          width: 100%;
          height: auto;
          image-rendering: pixelated;
        }
        .room-shadow {
          position: absolute;
          height: 12px;
          background: rgba(60, 35, 15, 0.28);
          clip-path: polygon(12% 0, 88% 0, 100% 50%, 88% 100%, 12% 100%, 0 50%);
          pointer-events: none;
          z-index: 5;
        }
        .room-wall-item {
          filter: drop-shadow(0 4px 4px rgba(50, 30, 10, 0.25));
        }
        .room-door {
          filter: drop-shadow(0 6px 5px rgba(50, 30, 10, 0.35));
        }
        .room-item-clickable {
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
        }
        .room-item-clickable img {
          display: block;
          width: 100%;
          height: auto;
        }
        .room-item-clickable:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 4px;
          border-radius: 4px;
        }
      `}</style>
    </motion.div>
  );
}
