import React, { useEffect, useRef } from "react";
import { motion } from "motion/react";

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In Progress",
  building: "Currently Building",
};

export default function ProjectPanel({ project, onClose }) {
  const closeBtnRef = useRef(null);

  useEffect(() => {
    closeBtnRef.current?.focus();
    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <motion.div
      className="panel-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={onClose}
      role="presentation"
    >
      <motion.div
        className="project-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-panel-title"
        initial={{ opacity: 0, y: 24, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 24, scale: 0.97 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="panel-header">
          <h3 id="project-panel-title">{project.title}</h3>
          <button
            ref={closeBtnRef}
            className="panel-close"
            onClick={onClose}
            aria-label="Close project panel"
          >
            ✕
          </button>
        </div>

        <span className={`status-pill status-${project.status}`}>
          {STATUS_LABELS[project.status]}
        </span>

        <p className="panel-desc">{project.description}</p>

        {project.technologies.length > 0 && (
          <>
            <h4>Technologies</h4>
            <div className="tech-tags">
              {project.technologies.map((t) => (
                <span key={t} className="tech-tag">
                  {t}
                </span>
              ))}
            </div>
          </>
        )}

        {project.features.length > 0 && (
          <>
            <h4>Key Features</h4>
            <ul className="feature-list">
              {project.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </>
        )}

        <div className="panel-actions">
          {project.github && (
            <a
              className="pixel-btn"
              href={project.github}
              target="_blank"
              rel="noreferrer"
            >
              GitHub ↗
            </a>
          )}
          {project.live && (
            <a
              className="pixel-btn primary"
              href={project.live}
              target="_blank"
              rel="noreferrer"
            >
              Live Demo ↗
            </a>
          )}
          <button className="pixel-btn ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </motion.div>

      <style>{`

        .panel-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(27, 31, 59, 0.55);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 100;
          padding: 20px;
        }
        .project-panel {
          width: min(92%, 480px);
          max-height: 82vh;
          overflow-y: auto;
          background: #FFFDF7;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          box-shadow: 0 8px 0 #4A3F6B;
          padding: 20px;
          font-family: 'Nunito', sans-serif;
          color: #3A3252;
        }
        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .panel-header h3 {
          font-family: 'Silkscreen', monospace;
          font-size: 15px;
          margin: 0;
          color: #4A3F6B;
        }
        .panel-close {
          background: #FFC1CC;
          border: 2px solid #4A3F6B;
          border-radius: 5px;
          width: 28px;
          height: 28px;
          cursor: pointer;
          font-size: 12px;
        }
        .panel-close:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 2px;
        }

        .status-pill {
          display: inline-block;
          font-family: 'Silkscreen', monospace;
          font-size: 9px;
          padding: 4px 8px;
          border-radius: 4px;
          border: 2px solid #4A3F6B;
          margin-bottom: 10px;
        }
        .status-completed { background: #8FD9A8; }
        .status-in-progress { background: #FFD873; }
        .status-building { background: #B9E4F5; }

        .panel-desc {
          font-size: 14px;
          line-height: 1.6;
          margin: 8px 0 14px 0;
        }

        .project-panel h4 {
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          color: #4A3F6B;
          margin: 14px 0 8px 0;
        }

        .tech-tags { display: flex; flex-wrap: wrap; gap: 6px; }
        .tech-tag {
          font-size: 11px;
          font-weight: 700;
          background: #DCE0FF;
          border: 2px solid #4A3F6B;
          border-radius: 4px;
          padding: 3px 8px;
        }

        .feature-list {
          margin: 0;
          padding-left: 18px;
          font-size: 13px;
          line-height: 1.7;
        }

        .panel-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }
        .pixel-btn {
          font-family: 'Silkscreen', monospace;
          font-size: 11px;
          background: #FFFDF7;
          border: 3px solid #4A3F6B;
          border-radius: 5px;
          padding: 8px 14px;
          cursor: pointer;
          box-shadow: 0 3px 0 #4A3F6B;
          text-decoration: none;
          color: #4A3F6B;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          display: inline-block;
        }
        .pixel-btn:hover { transform: translateY(1px); box-shadow: 0 2px 0 #4A3F6B; }
        .pixel-btn:focus-visible { outline: 3px solid #4A3F6B; outline-offset: 2px; }
        .pixel-btn.primary { background: #FFD873; }
        .pixel-btn.ghost { background: transparent; box-shadow: none; }

        @media (prefers-reduced-motion: reduce) {
          .project-panel, .panel-backdrop { transition: none !important; }
        }
      `}</style>
    </motion.div>
  );
}
