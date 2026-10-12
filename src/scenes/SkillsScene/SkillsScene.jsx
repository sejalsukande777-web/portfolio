import React from "react";
import { motion } from "motion/react";

const SKILL_CATEGORIES = [
  {
    title: "Languages",
    skills: ["Python", "JavaScript", "SQL"],
  },
  {
    title: "Web Development",
    skills: ["HTML", "CSS", "React (basics)", "Node.js & Express.js (basics)", "FastAPI", "REST APIs"],
  },
  {
    title: "AI / ML / Data",
    skills: [
      "Machine Learning (Regression, Classification, Clustering)",
      "Deep Learning (ANN, CNN, RNN/LSTM)",
      "NLP basics",
      "Generative AI concepts",
      "Large Language Models (LLMs)",
      "Prompt Engineering",
      "FAISS vector search",
      "Hugging Face Transformers",
      "Ollama",
      "Llama3",
      "NumPy",
      "Pandas",
      "Matplotlib",
      "Seaborn",
      "Scikit-learn",
      "TensorFlow",
      "Keras",
      "OpenCV",
      "Streamlit",
      "SQL-based Data Analysis",
    ],
  },
  {
    title: "Databases",
    skills: ["PostgreSQL", "MongoDB", "MySQL"],
  },
  {
    title: "Tools",
    skills: ["Git", "GitHub", "Jupyter Notebook", "VS Code"],
  },
  {
    title: "Cloud / DevOps",
    skills: ["AWS (currently learning)"],
  },
  {
    title: "Other",
    skills: ["OOP", "Data Structures", "Problem Solving", "Automation & Scripting"],
  },
];

export default function SkillsScene() {
  return (
    <div className="skills-scene">
      <style>{`

        .skills-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #4A3F6B;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.15);
          font-family: 'Nunito', sans-serif;
        }
        .skills-header {
          background: linear-gradient(180deg, #79BEE8 0%, #A9D8EE 55%, #FBF1DE 100%);
          padding: 22px 24px;
        }
        .skills-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0;
          color: #4A3F6B;
        }
        .skills-body {
          background: #FFFDF7;
          padding: 22px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 16px;
          max-height: 500px;
          overflow-y: auto;
        }
        .skill-category {
          background: #FFF6E8;
          border: 3px solid #4A3F6B;
          border-radius: 8px;
          padding: 14px;
          box-shadow: 0 3px 0 #4A3F6B;
        }
        .skill-category h3 {
          font-family: 'Silkscreen', monospace;
          font-size: 11px;
          color: #4A3F6B;
          margin: 0 0 10px 0;
        }
        .skill-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 6px;
        }
        .skill-tag {
          font-size: 11px;
          font-weight: 700;
          background: #DCE0FF;
          border: 2px solid #4A3F6B;
          border-radius: 4px;
          padding: 4px 8px;
          color: #3A3252;
        }
      `}</style>

      <div className="skills-header">
        <h2>Skills</h2>
      </div>

      <div className="skills-body">
        {SKILL_CATEGORIES.map((cat) => (
          <motion.div
            key={cat.title}
            className="skill-category"
            whileHover={{ y: -3 }}
            transition={{ duration: 0.15 }}
          >
            <h3>{cat.title}</h3>
            <div className="skill-tags">
              {cat.skills.map((s) => (
                <span key={s} className="skill-tag">
                  {s}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
