import React, { useEffect, useRef, useState } from "react";
import { shade } from "../../pixelArt/pixelShapes.js";

// Horizon layer: distant stepped hills + a bumpy tree line, drawn as a real
// low-res pixel canvas. Sits between the sky and the ground so the world
// has depth instead of objects floating in empty sky.
const PX = 4;

function mulberry32(seed) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const toRgb = (h) => {
  const n = parseInt(h.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = toRgb(b);
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t));
  return "#" + ((1 << 24) + (c[0] << 16) + (c[1] << 8) + c[2]).toString(16).slice(1);
};

function draw(canvas, cols, rows, skyBottom, groundTop, groundBottom) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, cols, rows);
  const px = (x, y, c) => {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 1, 1);
  };
  const far = mix(skyBottom, groundTop, 0.55);
  const farHi = shade(far, 14);
  const near = shade(mix(groundTop, groundBottom, 0.45), -14);
  const nearHi = shade(near, 22);
  const nearLo = shade(near, -18);

  // far hills: stepped rolling silhouette
  for (let x = 0; x < cols; x++) {
    const h = Math.round(
      rows * 0.5 + Math.sin(x * 0.06) * rows * 0.16 + Math.sin(x * 0.17 + 1) * rows * 0.07
    );
    const top = rows - h;
    for (let y = top; y < rows; y++) px(x, y, y === top ? farHi : far);
  }

  // near tree line: round blobs with light top-left / dark bottom-right
  const rand = mulberry32(99);
  let x = -2;
  while (x < cols) {
    const r = 3 + Math.floor(rand() * 3);
    const cx = x + r;
    const cy = rows - r + 1;
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const d = Math.hypot(dx, dy);
        if (d > r + 0.2) continue;
        let c = near;
        if (dx + dy < -r * 0.7) c = nearHi;
        else if (dx + dy > r * 0.9) c = nearLo;
        px(cx + dx, cy + dy, c);
      }
    }
    x += r * 2 - 1;
  }
  for (let xx = 0; xx < cols; xx++) for (let y = rows - 3; y < rows; y++) px(xx, y, near);
}

export default function PixelHills({ skyBottom, groundTop, groundBottom }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 960, h: 80 });

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const measure = () => setSize({ w: el.clientWidth, h: el.clientHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const cols = Math.ceil(size.w / PX);
  const rows = Math.ceil(size.h / PX);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || cols < 1 || rows < 1) return;
    c.width = cols;
    c.height = rows;
    draw(c, cols, rows, skyBottom, groundTop, groundBottom);
  }, [cols, rows, skyBottom, groundTop, groundBottom]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          left: 0,
          bottom: 0,
          width: cols * PX,
          height: rows * PX,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}
