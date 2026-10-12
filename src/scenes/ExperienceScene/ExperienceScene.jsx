import React from "react";
import { motion } from "motion/react";

export default function ExperienceScene() {
  return (
    <div className="experience-scene">
      <style>{`

        .experience-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
          font-family: 'Nunito', sans-serif;
        }
        .experience-header {
          background: linear-gradient(180deg, #2F3B72 0%, #5C4E8C 55%, #B67B9E 100%);
          padding: 22px 24px;
        }
        .experience-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0;
          color: #FFFDF7;
          text-shadow: 0 2px 0 rgba(0,0,0,0.2);
        }
        .experience-body {
          background: #FFFDF7;
          padding: 24px;
        }
        .experience-card {
          background: #FFF6E8;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 3px 0 #4A3F6B;
          max-width: 620px;
        }
        .experience-card .org {
          font-family: 'Silkscreen', monospace;
          font-size: 13px;
          color: #4A3F6B;
          margin: 0 0 4px 0;
        }
        .experience-card .meta {
          font-size: 12px;
          color: #6B6284;
          margin: 0 0 12px 0;
        }
        .experience-card .desc {
          font-size: 13px;
          line-height: 1.7;
          color: #3A3252;
          margin: 0 0 12px 0;
        }
        .experience-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .experience-tags span {
          font-size: 10px;
          font-weight: 700;
          background: #DCE0FF;
          border: 2px solid #4A3F6B;
          border-radius: 4px;
          padding: 3px 7px;
        }
      `}</style>

      <div className="experience-header">
        <h2>Experience</h2>
      </div>

      <div className="experience-body">
        <motion.div className="experience-card" whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <p className="org">Practical Training \u2014 Marvellous Infosystems, Pune</p>
          <p className="meta">2026</p>
          <p className="desc">
            Completed hands-on training covering Python, Data Science, Machine Learning,
            Deep Learning, and Generative AI \u2014 building real-world projects across ML
            pipelines, deep learning, and LLM-based applications during the training.
          </p>
          <div className="experience-tags">
            <span>Python</span>
            <span>Data Science</span>
            <span>Machine Learning</span>
            <span>Deep Learning</span>
            <span>Generative AI</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
