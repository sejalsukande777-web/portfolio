import React from "react";

// Small pixel-art speech bubble that tells visitors "click me".
// Put it INSIDE any position:absolute button.
export default function Hint({ text = "!", variant = "object", delay = 0 }) {
  return (
    <span
      className={`hint-bubble hint-${variant}`}
      style={{ animationDelay: `${delay}s` }}
      aria-hidden="true"
    >
      {text}
      <style>{`
        .hint-bubble {
          --hx: -50%;
          position: absolute;
          left: 50%;
          pointer-events: none;
          z-index: 20;
          background: #FFFDF5;
          color: #4A3F6B;
          font-family: 'Silkscreen', monospace;
          line-height: 1;
          white-space: nowrap;
          box-shadow:
            0 -2px 0 0 #4A3F6B,
            0 2px 0 0 #4A3F6B,
            -2px 0 0 0 #4A3F6B,
            2px 0 0 0 #4A3F6B;
          animation: hintBob 1.3s infinite;
        }
        .hint-bubble::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -8px;
          width: 8px;
          height: 6px;
          background: #4A3F6B;
          transform: translateX(-50%);
          clip-path: polygon(0 0, 100% 0, 100% 50%, 75% 50%, 75% 100%, 25% 100%, 25% 50%, 0 50%);
        }
        .hint-object { top: -16px; padding: 3px 5px; font-size: 8px; }
        .hint-house  { top: -24px; padding: 4px 7px; font-size: 8px; letter-spacing: 1px; background: #FFE9A0; }
        .hint-robot {
          --hx: -85%;
          top: 4px;
          padding: 5px 8px;
          font-size: 10px;
          animation: hintBob 1.3s infinite, hintFade 9s forwards;
        }
        .hint-robot::after { left: 85%; }
        @keyframes hintBob {
          0%, 49%   { transform: translate(var(--hx), 0); }
          50%, 100% { transform: translate(var(--hx), -3px); }
        }
        @keyframes hintFade {
          0%, 85% { opacity: 1; }
          100%    { opacity: 0; }
        }
        .project-object-img, .hint-glow, .room-item-clickable .room-item-img {
          animation: hintGlow 2.6s ease-in-out infinite;
        }
        @keyframes hintGlow {
          0%, 100% { filter: drop-shadow(0 0 0 rgba(255, 233, 160, 0)); }
          50%      { filter: drop-shadow(0 0 5px rgba(255, 233, 160, 0.95)); }
        }
        @media (prefers-reduced-motion: reduce) {
          .hint-bubble, .project-object-img, .hint-glow, .room-item-clickable .room-item-img { animation: none; }
        }
      `}</style>
    </span>
  );
}