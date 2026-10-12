import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const NAV_ITEMS = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "education", label: "Education" },
  { id: "contact", label: "Contact" },
];

const SOCIALS = [
  { id: "email", label: "Email", href: "mailto:sukandesejal@gmail.com", glyph: "@" },
  { id: "github", label: "GitHub", href: "https://github.com/sejalsukande777-web", glyph: "GH" },
  { id: "linkedin", label: "LinkedIn", href: "https://linkedin.com/in/sejal-sukande-65b840337", glyph: "in" },
  { id: "instagram", label: "Instagram", href: "https://www.instagram.com/sejyapsss/", glyph: "IG" },
];

export default function Navigation({ activeScene, onNavigate }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleClick = (id) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  return (
    <nav className="pw-nav">
      <style>{`

        .pw-nav {
          width: 100%;
          max-width: 900px;
          margin: 0 auto 12px auto;
          background: #FFFDF7;
          border: 4px solid #4A3F6B;
          border-radius: 8px;
          box-shadow: 0 4px 0 #4A3F6B;
          font-family: 'Silkscreen', monospace;
          position: relative;
          z-index: 30;
        }
        .pw-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 12px;
        }
        .pw-nav-brand {
          font-size: 12px;
          color: #4A3F6B;
          white-space: nowrap;
        }
        .pw-nav-links {
          display: flex;
          gap: 4px;
          flex-wrap: wrap;
        }
        .pw-nav-link {
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          background: transparent;
          border: 2px solid transparent;
          border-radius: 4px;
          padding: 6px 10px;
          color: #4A3F6B;
          cursor: pointer;
          transition: transform 0.15s ease, background 0.15s ease;
        }
        .pw-nav-link:hover {
          background: #FFE9A8;
        }
        .pw-nav-link:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 1px;
        }
        .pw-nav-link.active {
          background: #4A3F6B;
          color: #FFFDF7;
        }
        .pw-nav-socials {
          display: flex;
          gap: 6px;
        }
        .pw-nav-social {
          width: 26px;
          height: 26px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 8px;
          background: #FFC1CC;
          border: 2px solid #4A3F6B;
          border-radius: 5px;
          color: #4A3F6B;
          text-decoration: none;
          transition: transform 0.15s ease;
        }
        .pw-nav-social:hover { transform: translateY(-2px); }
        .pw-nav-social:focus-visible {
          outline: 3px solid #4A3F6B;
          outline-offset: 1px;
        }

        .pw-nav-hamburger {
          display: none;
          font-family: 'Silkscreen', monospace;
          font-size: 10px;
          background: #FFD873;
          border: 2px solid #4A3F6B;
          border-radius: 4px;
          padding: 6px 10px;
          cursor: pointer;
        }

        .pw-nav-mobile-panel {
          display: none;
        }

        @media (max-width: 720px) {
          .pw-nav-links { display: none; }
          .pw-nav-hamburger { display: block; }
          .pw-nav-mobile-panel {
            display: flex;
            flex-direction: column;
            gap: 4px;
            padding: 0 12px 10px 12px;
          }
          .pw-nav-mobile-panel .pw-nav-link { text-align: left; }
        }

        @media (max-width: 420px) {
          .pw-nav-inner {
            flex-wrap: wrap;
            gap: 8px;
          }
          .pw-nav-brand { font-size: 10px; }
          .pw-nav-socials { gap: 4px; }
          .pw-nav-social { width: 22px; height: 22px; font-size: 7px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pw-nav * { transition: none !important; animation: none !important; }
        }
      `}</style>

      <div className="pw-nav-inner">
        <span className="pw-nav-brand">✦ Sejal's World</span>

        <div className="pw-nav-links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`pw-nav-link ${activeScene === item.id ? "active" : ""}`}
              onClick={() => handleClick(item.id)}
              aria-current={activeScene === item.id ? "page" : undefined}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="pw-nav-socials">
          {SOCIALS.map((s) => (
            <a
              key={s.id}
              className="pw-nav-social"
              href={s.href}
              target={s.id === "email" ? undefined : "_blank"}
              rel="noreferrer"
              aria-label={s.label}
              title={s.label}
            >
              {s.glyph}
            </a>
          ))}
        </div>

        <button
          className="pw-nav-hamburger"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕ Close" : "☰ Menu"}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="pw-nav-mobile-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{ display: "flex" }}
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`pw-nav-link ${activeScene === item.id ? "active" : ""}`}
                onClick={() => handleClick(item.id)}
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
