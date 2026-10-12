import React from "react";
import { motion } from "motion/react";

const CONTACTS = [
  {
    id: "email",
    label: "Email",
    value: "sukandesejal@gmail.com",
    href: "mailto:sukandesejal@gmail.com",
    glyph: "@",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/sejalsukande777-web",
    href: "https://github.com/sejalsukande777-web",
    glyph: "GH",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/sejal-sukande-65b840337",
    href: "https://linkedin.com/in/sejal-sukande-65b840337",
    glyph: "in",
  },
  {
    id: "instagram",
    label: "Instagram",
    value: "@sejyapsss",
    href: "https://www.instagram.com/sejyapsss/",
    glyph: "IG",
  },
];

export default function ContactScene() {
  return (
    <div className="contact-scene">
      <style>{`

        .contact-scene {
          width: 100%;
          max-width: 900px;
          border: 4px solid #2A2440;
          border-radius: 10px;
          overflow: hidden;
          box-shadow: 0 8px 0 rgba(0,0,0,0.25);
          font-family: 'Nunito', sans-serif;
        }
        .contact-header {
          background: linear-gradient(180deg, #1B1F3B 0%, #2B2F5C 55%, #4B3F72 100%);
          padding: 26px 24px;
          position: relative;
          overflow: hidden;
        }
        .contact-star {
          position: absolute;
          width: 3px;
          height: 3px;
          background: #FFE9A8;
          border-radius: 50%;
        }
        .contact-header h2 {
          font-family: 'Silkscreen', monospace;
          font-size: 16px;
          margin: 0 0 6px 0;
          color: #FFF6D9;
          position: relative;
        }
        .contact-note {
          font-size: 12px;
          color: #DCE0FF;
          margin: 0;
          max-width: 480px;
          line-height: 1.6;
          position: relative;
        }
        .contact-body {
          background: #23264A;
          padding: 24px;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 14px;
        }
        .contact-link {
          display: flex;
          align-items: center;
          gap: 12px;
          background: #2E3260;
          border: 3px solid #4B3F72;
          border-radius: 8px;
          padding: 14px;
          text-decoration: none;
          box-shadow: 0 3px 0 #4B3F72;
          transition: transform 0.15s ease, box-shadow 0.15s ease;
        }
        .contact-link:hover { transform: translateY(-2px); box-shadow: 0 5px 0 #4B3F72; }
        .contact-link:focus-visible { outline: 3px solid #FFE9A8; outline-offset: 2px; }
        .contact-glyph {
          width: 34px;
          height: 34px;
          flex-shrink: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #FFC1CC;
          border: 2px solid #4B3F72;
          border-radius: 6px;
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          color: #2A2440;
        }
        .contact-text .label {
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          color: #FFE9A8;
          display: block;
          margin-bottom: 3px;
        }
        .contact-text .value {
          font-size: 11px;
          color: #DCE0FF;
          word-break: break-all;
        }
      `}</style>

      <div className="contact-header">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="contact-star"
            style={{ left: `${(i * 37) % 100}%`, top: `${(i * 23) % 70}%` }}
          />
        ))}
        <h2>Contact</h2>
        <p className="contact-note">
          It's gotten late \u2014 thanks for spending the day here. Reach out through
          any of these, I'd love to hear from you.
        </p>
      </div>

      <div className="contact-body">
        {CONTACTS.map((c) => (
          <motion.a
            key={c.id}
            className="contact-link"
            href={c.href}
            target={c.id === "email" ? undefined : "_blank"}
            rel="noreferrer"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.15 }}
          >
            <span className="contact-glyph">{c.glyph}</span>
            <span className="contact-text">
              <span className="label">{c.label}</span>
              <span className="value">{c.value}</span>
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
