import React from "react";
import { motion } from "motion/react";

const CAREER_DIRECTIONS = [
  { label: "AI / Deep Learning Engineer", tag: "Primary" },
  { label: "Full-Stack / API Developer", tag: "Secondary" },
];

const ACHIEVEMENTS = [
  { title: "Smart India Hackathon (SIH)", note: "Participant" },
  { title: "Department-level Hackathon", note: "Participant" },
  { title: "\"Aspire\" by Unstoppable Women", note: "Online hackathon \u2014 Participant" },
  { title: "Debate Competition", note: "Reached the final round" },
];

const ABOUT_TEXT = `I'm a final-year ENTC engineering student who somehow ended up completely fascinated by what's happening inside a program rather than just outside it. Give me an idea and I need to know why it worked, or why it didn't — that curiosity is basically how most of my projects started. I pick things up fast, and I'm the kind of person who listens closely and makes sure nobody in the room feels left out — talking to people comes naturally to me, and I genuinely enjoy it.

I've been leaning hard into AI/ML and software development because I love watching this space evolve rather than feeling nervous about it. Outside of code, I'm a nature person through and through — clouds, stars, the moon, sunlight — which is honestly the whole reason this portfolio looks the way it does. I also dance and get lost in music whenever I need to reset.`;

export default function AboutScene() {
  return (
    <div className="about-scene">
      <style>{`

        .about-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
          font-family: 'Nunito', sans-serif;
        }
        .about-header {
          background: linear-gradient(180deg, #7FC6EA 0%, #AEDFF2 55%, #FDF8EE 100%);
          padding: 22px 24px;
        }
        .about-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0;
          color: #4A3F6B;
        }
        .about-body {
          background: #FFFDF7;
          padding: 24px;
        }
        .about-text {
          font-size: 14px;
          line-height: 1.8;
          color: #3A3252;
          white-space: pre-line;
          max-width: 640px;
          margin: 0 0 24px 0;
        }

        .about-section-title {
          font-family: 'Silkscreen', monospace;
          font-size: 11px;
          color: #4A3F6B;
          margin: 0 0 10px 0;
        }

        .career-row {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 26px;
        }
        .career-chip {
          background: #DCE0FF;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 10px 14px;
          box-shadow: 0 3px 0 #4A3F6B;
        }
        .career-chip .label {
          font-size: 13px;
          font-weight: 800;
          color: #3A3252;
          display: block;
        }
        .career-chip .tag {
          font-family: 'Silkscreen', monospace;
          font-size: 8px;
          color: #4A3F6B;
        }

        .achievements-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 10px;
        }
        .achievement-card {
          background: #FFF6E8;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 12px 14px;
        }
        .achievement-card .title {
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          color: #4A3F6B;
          display: block;
          margin-bottom: 4px;
        }
        .achievement-card .note {
          font-size: 12px;
          color: #3A3252;
        }
      `}</style>

      <div className="about-header">
        <h2>About Me</h2>
      </div>

      <div className="about-body">
        <p className="about-text">{ABOUT_TEXT}</p>

        <h3 className="about-section-title">Career Direction</h3>
        <div className="career-row">
          {CAREER_DIRECTIONS.map((c) => (
            <motion.div key={c.label} className="career-chip" whileHover={{ y: -2 }}>
              <span className="label">{c.label}</span>
              <span className="tag">{c.tag}</span>
            </motion.div>
          ))}
        </div>

        <h3 className="about-section-title">Achievements</h3>
        <div className="achievements-grid">
          {ACHIEVEMENTS.map((a) => (
            <div key={a.title} className="achievement-card">
              <span className="title">{a.title}</span>
              <span className="note">{a.note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
