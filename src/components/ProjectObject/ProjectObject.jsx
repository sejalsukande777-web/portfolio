import React from "react";
import Hint from "../Hint/Hint.jsx";
import { motion } from "motion/react";
import mailboxImg from "../../assets/objects/mailbox.png";
import bookImg from "../../assets/objects/book.png";
import journalImg from "../../assets/objects/journal.png";
import robotImg from "../../assets/objects/robot.png";
import mailSorterImg from "../../assets/objects/mail-sorter.png";
import cameraImg from "../../assets/objects/camera.png";
import craftTableImg from "../../assets/objects/craft-table.png";
import stallImg from "../../assets/objects/craft-stall.png";
import arcadeCabinetImg from "../../assets/objects/arcade-cabinet.png";

const OBJECT_IMAGES = {
  mailbox: mailboxImg,
  book: bookImg,
  journal: journalImg,
  robot: robotImg,
  "mail-sorter": mailSorterImg,
  camera: cameraImg,
  "craft-table": craftTableImg,
  "market-stall": stallImg,
  "arcade-cabinet": arcadeCabinetImg,
};

const ASPECT = { "market-stall": 1 };

// Real pixel-art sprite images (AI-generated), not CSS shapes.
export default function ProjectObject({ project, x, y, onSelect, size = 48, z }) {
  const label = `View project: ${project.title}`;
  const src = OBJECT_IMAGES[project.worldObject];

  return (
    <motion.button
      className="project-object"
      style={{ left: typeof x === "number" ? `${x}%` : x, bottom: y, ...(z !== undefined ? { zIndex: z } : {}) }}
      onClick={() => onSelect(project)}
      whileHover={{ scale: 1.08, y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ duration: 0.2 }}
      aria-label={label}
      title={project.title}
    >
      {src ? (
        <img
          src={src}
          alt=""
          className="project-object-img"
          style={{ width: size, height: size * (ASPECT[project.worldObject] || 1) }}
        />
      ) : (
        <div style={{ width: size, height: size, background: "#FFD873" }} />
      )}
      <Hint />
      {project.featured && <span className="featured-sparkle">✦</span>}

      <style>{`
        .project-object {
          position: absolute;
          background: transparent;
          border: none;
          padding: 0;
          cursor: pointer;
          z-index: 6;
        }
        .project-object:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 4px;
          border-radius: 4px;
        }
        .project-object-img {
          display: block;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
        .featured-sparkle {
          position: absolute;
          top: -10px;
          right: -6px;
          font-size: 12px;
          color: #FFD873;
        }
        @media (max-width: 560px) {
          .project-object {
            padding: 10px;
            margin: -10px;
          }
        }
      `}</style>
    </motion.button>
  );
}
