import React from "react";
import { motion } from "motion/react";
import southImg from "../../assets/character/character-south.png";

// Single sprite image, used for every pose/direction. Mirrored via CSS
// when facing left, so only one asset is needed.
export default function Character({ x, facing, isWalking }) {
  return (
    <motion.div
      className="pw-character"
      animate={{ left: `${x}%` }}
      transition={{ type: "tween", duration: 0.35, ease: "linear" }}
      style={{ scaleX: facing === "left" ? -1 : 1 }}
    >
      <motion.div
        animate={
          isWalking
            ? { y: [0, -3, 0, -3, 0] }
            : { y: [0, -2, 0] }
        }
        transition={{
          duration: isWalking ? 0.5 : 1.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <img src={southImg} alt="" className="pw-character-sprite" />
      </motion.div>

      <style>{`
        .pw-character {
          position: absolute;
          bottom: calc(var(--gh, 190px) - 60px * var(--s, 1));
          transform-origin: bottom center;
          z-index: 5;
        }
        .pw-character-sprite {
          display: block;
          width: calc(56px * var(--s, 1));
          height: calc(56px * var(--s, 1));
          image-rendering: pixelated;
          image-rendering: crisp-edges;
        }
      `}</style>
    </motion.div>
  );
}
