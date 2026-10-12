import React, { useEffect, useRef } from "react";

// ---------------------------------------------------------------------------
// A real one-point-perspective room, drawn per-pixel on a low-res canvas
// (1 canvas pixel = 4 virtual px):
//   * back wall (flat) with door + two windows
//   * left & right walls that angle in toward the back wall
//   * a plank floor whose boards converge toward the vanishing point
//   * soft corner shading, window light on the floor, gentle vignette
// Furniture is placed in "world" coordinates with project(X, Z), so things
// further from the viewer are automatically smaller and sit higher up.
// ---------------------------------------------------------------------------
export const CELL = 4;
export const COLS = 220; // 880 / 4
export const ROWS = 188; // 752 / 4

export const VX = 440; // vanishing point (eye is above the room, looking down)
export const VY = -300;
export const SB = 328 / 440; // scale of the back wall relative to the front plane
export const L = 700; // room depth in world units (0 = front, L = back wall)
const DMAX = 1 / SB;
const YB = VY + 1050 * SB; // y of the wall/floor line on the back wall (~483)
export const FLOOR_ROW = 121;

// world (X across 0..880, Z depth 0..L) -> screen
export function project(X, Z) {
  const D = 1 + (Z / L) * (DMAX - 1);
  const s = 1 / D;
  return { x: VX + (X - VX) * s, y: VY + 1050 * s, s };
}

// Window glass colours per day stage (matches the exterior sky).
const GLASS = [
  ["#8FD3EE", "#A9DDF2", "#C4E8F6", "#DDF2FA"],
  ["#86CDEA", "#A0D9F0", "#BCE6F5", "#D6F0F9"],
  ["#7CC6E6", "#98D4EE", "#B4E2F4", "#CFEEF8"],
  ["#7E7FC0", "#C98FB0", "#F4A486", "#FFD2A0"],
  ["#3E3F86", "#6A559B", "#A66FA0", "#D88F9C"],
  ["#14163A", "#1E2150", "#2A2D6A", "#363A80"],
];

const parsed = new Map();
const rgb = (h) => {
  let v = parsed.get(h);
  if (!v) {
    const n = parseInt(h.slice(1), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    parsed.set(h, v);
  }
  return v;
};
const hash = (x, y) => Math.abs((x * 73856093) ^ (y * 19349663));
const mod = (a, n) => ((a % n) + n) % n;

// wall pattern in world px: u = distance along the wall, h = height above floor
function wallTex(u, h) {
  if (h < 16) return h >= 12 ? "#A9784A" : "#8B5A38"; // baseboard
  if (h < 118) {
    const pu = mod(u, 170);
    if (pu < 8) return "#B27A4A";
    if (pu >= 20 && pu < 150 && h >= 38 && h < 96) {
      if (pu < 30 || h >= 88) return "#E8BE86";
      if (pu >= 140 || h < 48) return "#B27A4A";
    }
    return "#D9A56E";
  }
  if (h < 126) return "#F0D4A0"; // chair rail
  if (h < 140) return "#B8784D";
  let c = Math.floor(u / 52) % 2 ? "#E3CB98" : "#EBD6A8"; // wallpaper stripes
  const pu = mod(u, 104);
  const ph = mod(h, 96);
  if ((pu >= 22 && pu < 34 && ph >= 28 && ph < 40) || (pu >= 74 && pu < 86 && ph >= 76 && ph < 88)) c = "#D6B97F";
  return c;
}

function draw(ctx, stage) {
  const buf = ctx.createImageData(COLS, ROWS);
  const setRGB = (cx, cy, r, g, b) => {
    if (cx < 0 || cy < 0 || cx >= COLS || cy >= ROWS) return;
    const i = (cy * COLS + cx) * 4;
    buf.data[i] = r;
    buf.data[i + 1] = g;
    buf.data[i + 2] = b;
    buf.data[i + 3] = 255;
  };
  const px = (cx, cy, hex) => {
    const [r, g, b] = rgb(hex);
    setRGB(cx, cy, r, g, b);
  };
  const rect = (x, y, w, h, hex) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) px(i, j, hex);
  };

  const day = stage <= 3;
  const RUG = { x: 265, z: 330, rx: 205, rz: 125 };

  // floor coordinates for a cell
  const floorInfo = (cx, cy) => {
    const x = cx * CELL + 2;
    const y = cy * CELL + 2;
    const s = (y - VY) / 1050;
    const X = VX + (x - VX) / s;
    const Z = (1 / s - 1) / (DMAX - 1) * L;
    const bi = Math.floor(X / 70);
    const zs = Math.floor((Z + mod(bi, 4) * 83) / 230);
    return { X, Z, bi, zs };
  };

  const floorColor = (cx, cy) => {
    const { X, Z, bi, zs } = floorInfo(cx, cy);
    const left = floorInfo(cx - 1, cy);
    const up = floorInfo(cx, cy - 1);
    let c = ["#C9A15F", "#C29958", "#CFA866"][mod(bi, 3)];
    let seam = false;
    if (left.bi !== bi && left.X >= 0) seam = true;
    if (up.zs !== zs && up.Z <= L) seam = true;
    if (seam) c = "#9A6F3F";
    else {
      const h = hash(cx, cy) % 97;
      if (h === 0) c = "#D8B170";
      else if (h === 1) c = "#B58B4C";
    }
    // welcome mat in front of the door
    if (X > 355 && X < 525 && Z > L - 150 && Z < L - 85) {
      const edge = X < 372 || X > 508 || Z < L - 133 || Z > L - 102;
      c = edge ? "#C6604A" : Math.abs(X - 440) < 52 && Z > L - 125 && Z < L - 110 ? "#C6604A" : "#F3E1B7";
    }
    // flat oval rug in front of the sofa
    const r = ((X - RUG.x) / RUG.rx) ** 2 + ((Z - RUG.z) / RUG.rz) ** 2;
    if (r <= 1) {
      c = "#E07A5F";
      if (r > 0.86) c = "#B4503C";
      else if (r > 0.78) c = "#F3E1B7";
      else if (r > 0.52) c = Math.floor(X / 26) % 2 ? "#5E9E9A" : "#4C8884";
      else if (r > 0.34) c = "#F3E1B7";
      else if ((cx + cy) % 4 === 0) c = "#F3E1B7";
    }
    return { c, X, Z };
  };

  const light = [185, 695]; // window X on the back wall
  for (let cy = 0; cy < ROWS; cy++) {
    for (let cx = 0; cx < COLS; cx++) {
      const x = cx * CELL + 2;
      const y = cy * CELL + 2;
      let hex;
      let f = 1;
      let add = [0, 0, 0];

      const yfL = (xx) => VY + 1050 * (1 - xx / 440);
      if (x <= 112 && y < yfL(x)) {
        const s = 1 - x / 440;
        const h = 750 - (VY + (y - VY) / s);
        const Z = (1 / s - 1) / (DMAX - 1) * L;
        hex = wallTex(Z, h);
        f = 0.88 * (1 - 0.16 * Math.max(0, 1 - (L - Z) / 140));
      } else if (x >= 768 && y < yfL(880 - x)) {
        const s = 1 - (880 - x) / 440;
        const h = 750 - (VY + (y - VY) / s);
        const Z = (1 / s - 1) / (DMAX - 1) * L;
        hex = wallTex(Z, h);
        f = 0.82 * (1 - 0.16 * Math.max(0, 1 - (L - Z) / 140));
      } else if (x > 112 && x < 768 && y < YB) {
        const Xw = VX + (x - VX) / SB;
        const h = 750 - (VY + (y - VY) / SB);
        hex = wallTex(Xw, h);
        const d = Math.min(Xw, 880 - Xw);
        f = 1 - 0.14 * Math.max(0, 1 - d / 110);
      } else {
        const fl = floorColor(cx, cy);
        hex = fl.c;
        const dBack = L - fl.Z;
        const dSide = Math.min(fl.X, 880 - fl.X);
        f = 1 - 0.18 * Math.max(0, 1 - dBack / 80) - 0.16 * Math.max(0, 1 - dSide / 70);
        // window light falling on the floor
        light.forEach((wx, i) => {
          const zr = L - fl.Z;
          if (zr < 40 || zr > 340) return;
          const xc = i === 0 ? wx + 0.42 * zr : wx - 0.42 * zr;
          const hw = 62 - zr * 0.05;
          const dx = Math.abs(fl.X - xc);
          if (dx < hw && (dx < hw - 12 || (cx + cy) % 2 === 0)) {
            if (day) add = stage === 3 ? [26, 12, -8] : [22, 17, 6];
            else add = [-4, 2, 14];
          }
        });
      }
      // soft vignette
      const dxn = (x - 440) / 440;
      const dyn = (y - 375) / 375;
      f *= 1 - 0.1 * (dxn * dxn + dyn * dyn * 0.6);
      f = Math.round(f / 0.04) * 0.04;
      const [r, g, b] = rgb(hex);
      setRGB(cx, cy, r * f + add[0], g * f + add[1], b * f + add[2]);
    }
  }

  // ---------------- door: centred on the back wall ----------------
  const dw = 36;
  const dh = 80;
  const dx0 = 110 - dw / 2;
  const dy0 = FLOOR_ROW - dh; // base sits exactly on the wall/floor line
  rect(dx0 - 3, dy0 - 3, dw + 6, dh + 3, "#5E3B2A");
  rect(dx0 - 3, dy0 - 3, 1, dh + 3, "#8B5A38");
  rect(dx0, dy0, dw, dh, "#376785");
  [[0, 0], [1, 0], [0, 1], [dw - 1, 0], [dw - 2, 0], [dw - 1, 1]].forEach(([x, y]) => px(dx0 + x, dy0 + y, "#5E3B2A"));
  rect(dx0 + 6, dy0 + 6, dw - 12, 22, "#193457");
  rect(dx0 + 7, dy0 + 7, dw - 14, 20, "#9AD3E8");
  rect(dx0 + 7, dy0 + 7, dw - 14, 5, "#B9E3F2");
  rect(dx0 + dw / 2 - 1, dy0 + 7, 2, 20, "#2B5679");
  rect(dx0 + 7, dy0 + 16, dw - 14, 2, "#2B5679");
  [33, 56].forEach((oy) => {
    rect(dx0 + 6, dy0 + oy, dw - 12, 19, "#2B5679");
    rect(dx0 + 7, dy0 + oy + 1, dw - 14, 17, "#376785");
    rect(dx0 + 7, dy0 + oy + 1, dw - 14, 1, "#4A86A6");
    rect(dx0 + 7, dy0 + oy + 1, 1, 17, "#4A86A6");
  });
  rect(dx0 + dw - 8, dy0 + 44, 3, 3, "#FFD873");
  px(dx0 + dw - 8, dy0 + 47, "#B8860B");
  rect(dx0 - 4, FLOOR_ROW, dw + 8, 2, "#8B5A38");
  rect(dx0 - 4, FLOOR_ROW, dw + 8, 1, "#A9784A");
  rect(dx0, FLOOR_ROW - 1, dw, 1, "#2B5679");

  // ---------------- two windows (small next to the door) ----------------
  const glass = GLASS[Math.min(stage, GLASS.length - 1)];
  const night = stage >= 4;
  const drawWindow = (cx) => {
    const w = 28;
    const h = 36;
    const x0 = cx - w / 2;
    const top = FLOOR_ROW - 46 - h;
    rect(x0 - 3, top + h + 1, w + 6, 3, "#B8784D");
    rect(x0 - 3, top + h + 1, w + 6, 1, "#E8BE86");
    rect(x0 - 2, top + h + 4, w + 4, 1, "#8B5A38");
    rect(x0 - 2, top - 2, w + 4, h + 4, "#193457");
    rect(x0 - 1, top - 1, w + 2, h + 2, "#2B5679");
    for (let y = 0; y < h - 2; y++) {
      const t = (y / (h - 2)) * 4;
      const band = Math.min(3, Math.floor(t));
      const next = Math.min(3, band + 1);
      for (let x = 0; x < w - 2; x++) {
        const useNext = t - band > 0.75 && (x + y) % 2 === 0;
        px(x0 + 1 + x, top + 1 + y, glass[useNext ? next : band]);
      }
    }
    if (night) {
      [[4, 5], [17, 3], [9, 11], [21, 15], [6, 22], [14, 8]].forEach(([sx, sy]) => px(x0 + sx, top + sy, "#FFFDF7"));
      rect(x0 + 18, top + 7, 4, 4, "#FFF6D9");
    } else if (stage <= 2) {
      rect(x0 + 4, top + 7, 8, 2, "#FFFFFF");
      rect(x0 + 6, top + 5, 4, 2, "#FFFFFF");
      rect(x0 + 14, top + 22, 8, 2, "#FFFFFF");
      rect(x0 + 16, top + 20, 4, 2, "#FFFFFF");
      rect(x0 + 19, top + 3, 4, 4, "#FFD873");
    }
    rect(x0 + w / 2 - 1, top + 1, 2, h - 2, "#2B5679");
    rect(x0 + 1, top + Math.floor(h * 0.45), w - 2, 2, "#2B5679");
    for (let i = 0; i < 4; i++) px(x0 + 2 + i, top + 7 - i, "#E8F7FC");
    rect(x0 - 9, top - 7, w + 18, 2, "#5E3B2A");
    rect(x0 - 10, top - 8, 2, 4, "#FFD873");
    rect(x0 + w + 8, top - 8, 2, 4, "#FFD873");
    const curtain = (c0) => {
      for (let y = top - 5; y < top + h + 6; y++)
        for (let x = 0; x < 6; x++) {
          const fold = x % 3;
          px(c0 + x, y, fold === 0 ? "#A94A38" : fold === 1 ? "#C6604A" : "#E07A5F");
        }
      rect(c0, top + Math.floor(h * 0.62), 6, 2, "#FFD873");
    };
    curtain(x0 - 7);
    curtain(x0 + w + 1);
  };
  drawWindow(62);
  drawWindow(158);

  ctx.putImageData(buf, 0, 0);
}

export default function RoomBackdrop({ stage = 0 }) {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    if (!c) return;
    c.width = COLS;
    c.height = ROWS;
    draw(c.getContext("2d"), stage);
  }, [stage]);
  return (
    <canvas
      ref={ref}
      style={{
        position: "absolute",
        left: 0,
        top: 0,
        width: COLS * CELL,
        height: ROWS * CELL,
        imageRendering: "pixelated",
        zIndex: 0,
      }}
    />
  );
}
