import React from "react";
import { motion } from "motion/react";

export default function EducationScene() {
  return (
    <div className="education-scene">
      <style>{`

        .education-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
          font-family: 'Nunito', sans-serif;
        }
        .education-header {
          background: linear-gradient(180deg, #5B7FBE 0%, #8C7FB0 55%, #C97F9E 100%);
          padding: 22px 24px;
        }
        .education-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0;
          color: #FFFDF7;
          text-shadow: 0 2px 0 rgba(0,0,0,0.2);
        }
        .education-body {
          background: #FFFDF7;
          padding: 24px;
        }
        .education-card {
          background: #FFF6E8;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 18px;
          box-shadow: 0 3px 0 #4A3F6B;
          max-width: 620px;
        }
        .education-card .degree {
          font-family: 'Silkscreen', monospace;
          font-size: 13px;
          color: #4A3F6B;
          margin: 0 0 4px 0;
        }
        .education-card .college {
          font-size: 13px;
          font-weight: 700;
          color: #3A3252;
          margin: 0 0 4px 0;
        }
        .education-card .meta {
          font-size: 12px;
          color: #6B6284;
        }
      `}</style>

      <div className="education-header">
        <h2>Education</h2>
      </div>

      <div className="education-body">
        <motion.div className="education-card" whileHover={{ y: -3 }} transition={{ duration: 0.15 }}>
          <p className="degree">B.E. Electronics &amp; Telecommunication (Pursuing)</p>
          <p className="college">Zeal College of Engineering &amp; Research, Pune</p>
          <p className="meta">Savitribai Phule Pune University (SPPU) \u2014 Final Year</p>
        </motion.div>
      </div>
    </div>
  );
}
