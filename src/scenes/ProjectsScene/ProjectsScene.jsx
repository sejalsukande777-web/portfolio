import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { projects } from "../../data/projects.js";
import ProjectPanel from "../../components/ProjectPanel/ProjectPanel.jsx";

const STATUS_LABELS = {
  completed: "Completed",
  "in-progress": "In Progress",
  building: "Currently Building",
};

function ProjectCard({ project, onSelect }) {
  return (
    <motion.button
      className="proj-card"
      onClick={() => onSelect(project)}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.18 }}
    >
      {false && <span className="card-sparkle">✦ Featured</span>}
      <h4>{project.title}</h4>
      <span className={`card-status status-${project.status}`}>
        {STATUS_LABELS[project.status]}
      </span>
      <p>{project.description}</p>
      {project.technologies.length > 0 && (
        <div className="card-tags">
          {project.technologies.slice(0, 4).map((t) => (
            <span key={t}>{t}</span>
          ))}
          {project.technologies.length > 4 && (
            <span>+{project.technologies.length - 4}</span>
          )}
        </div>
      )}
    </motion.button>
  );
}

export default function ProjectsScene() {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <div className="projects-scene">
      <style>{`

        .projects-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
          font-family: 'Nunito', sans-serif;
        }
        .projects-header {
          background: linear-gradient(180deg, #5B7FBE 0%, #E58F7E 55%, #FFC97A 100%);
          padding: 20px 24px;
          color: #fff;
        }
        .projects-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0 0 4px 0;
          text-shadow: 0 2px 0 rgba(0,0,0,0.15);
        }
        .projects-header p {
          margin: 0;
          font-size: 12px;
          opacity: 0.95;
        }
        .projects-grid {
          background: #FFFDF7;
          padding: 20px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(230px, 1fr));
          gap: 14px;
          max-height: 480px;
          overflow-y: auto;
        }
        .proj-card {
          text-align: left;
          background: #FFF6E8;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 14px;
          cursor: pointer;
          box-shadow: 0 3px 0 #4A3F6B;
          position: relative;
          transition: box-shadow 0.18s ease;
        }
        .proj-card:hover { box-shadow: 0 5px 0 #4A3F6B; }
        .proj-card:focus-visible { outline: 3px solid #4A3F6B; outline-offset: 2px; }
        .proj-card.featured { background: #FFF0C4; }
        .card-sparkle {
          display: block;
          font-family: 'Silkscreen', monospace;
          font-size: 9px;
          color: #B8860B;
          margin-bottom: 6px;
        }
        .proj-card h4 {
          font-family: 'Silkscreen', monospace;
          font-size: 12px;
          margin: 0 0 6px 0;
          color: #4A3F6B;
        }
        .card-status {
          display: inline-block;
          font-family: 'Silkscreen', monospace;
          font-size: 8px;
          padding: 3px 6px;
          border-radius: 4px;
          border: 2px solid #4A3F6B;
          margin-bottom: 8px;
        }
        .status-completed { background: #8FD9A8; }
        .status-in-progress { background: #FFD873; }
        .status-building { background: #B9E4F5; }
        .proj-card p {
          font-size: 12px;
          line-height: 1.5;
          margin: 0 0 10px 0;
          color: #3A3252;
        }
        .card-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 4px;
        }
        .card-tags span {
          font-size: 9px;
          font-weight: 700;
          background: #DCE0FF;
          border: 1px solid #4A3F6B;
          border-radius: 3px;
          padding: 2px 5px;
        }

        @media (prefers-reduced-motion: reduce) {
          .proj-card { transition: none !important; }
        }
      `}</style>

      <div className="projects-header">
        <h2>Projects</h2>
        <p>Ten builds, all solo — click any card for the full breakdown.</p>
      </div>

      <div className="projects-grid">
        {[...projects].sort((a, b) => (["airdraw-arena", "askmydoc", "polaloo", "reflect", "jobhunter", "smarthire"].indexOf(a.id) + 1 || 99) - (["airdraw-arena", "askmydoc", "polaloo", "reflect", "jobhunter", "smarthire"].indexOf(b.id) + 1 || 99)).map((p) => (
          <ProjectCard key={p.id} project={p} onSelect={setSelectedProject} />
        ))}
      </div>

      <AnimatePresence>
        {selectedProject && (
          <ProjectPanel
            project={selectedProject}
            onClose={() => setSelectedProject(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
