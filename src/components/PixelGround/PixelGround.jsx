import React, { useEffect, useRef, useState } from "react";
import { shade } from "../../pixelArt/pixelShapes.js";

// Draws the ground as a REAL low-res pixel canvas (1 canvas pixel = PX screen
// pixels, scaled up with image-rendering: pixelated). Everything is
// deterministic (seeded RNG), so the layout is identical across resizes and
// day/night stages - only the colours change.

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

const toRgb = (hex) => {
  const n = parseInt(hex.replace("#", ""), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};
const toHex = ([r, g, b]) =>
  "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
const mix = (a, b, t) => {
  const A = toRgb(a);
  const B = toRgb(b);
  return toHex(A.map((v, i) => Math.round(v + (B[i] - v) * t)));
};
const lum = (hex) => {
  const [r, g, b] = toRgb(hex);
  return 0.3 * r + 0.59 * g + 0.11 * b;
};
const scaleHex = (hex, f) =>
  toHex(toRgb(hex).map((v) => Math.max(0, Math.min(255, Math.round(v * f)))));

// poppy red, orange, sunflower yellow, daisy white, pink, lilac
const PETALS = ["#E8412C", "#F26B38", "#F7C531", "#FFF8E8", "#F28DA6", "#E8412C", "#F7C531", "#B79CF2"];
const TULIPS = ["#E8412C", "#F28DA6", "#F7C531", "#B79CF2", "#F26B38"];
const BAYER = [[0, 8, 2, 10], [12, 4, 14, 6], [3, 11, 1, 9], [15, 7, 13, 5]].map((r) => r.map((v) => (v + 0.5) / 16));

function draw(canvas, cols, rows, top, bottom, doorCol) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, cols, rows);
  const rand = mulberry32(1337);
  const pick = (arr) => arr[Math.floor(rand() * arr.length)];
  const px = (x, y, c) => {
    if (x < 0 || y < 0 || x >= cols || y >= rows) return;
    ctx.fillStyle = c;
    ctx.fillRect(x, y, 1, 1);
  };

  // how bright is this stage? (dims dirt + flowers at dusk/night)
  const f = Math.max(0.45, Math.min(1, lum(bottom) / lum("#5FB37E")));
  const night = f < 0.62;

  // ---- 1. Grass: six tones, dithered into soft rolling patches ----
  const B = 6;
  const bands = Array.from({ length: B }, (_, i) => mix(top, bottom, i / (B - 1)));
  const idxGrid = [];
  for (let y = 0; y < rows; y++) {
    idxGrid.push([]);
    for (let x = 0; x < cols; x++) {
      const t = y / Math.max(1, rows - 1);
      const n =
        (Math.sin(x * 0.09 + Math.sin(y * 0.22) * 1.6) + Math.sin(y * 0.36 + x * 0.045) + Math.sin((x + y * 1.4) * 0.06)) / 3;
      let v = t * (B - 1.8) + n * 1.05;
      v = Math.max(0, Math.min(B - 1.001, v));
      const idx = Math.min(B - 1, Math.floor(v + BAYER[y & 3][x & 3]));
      idxGrid[y].push(idx);
      px(x, y, bands[idx]);
    }
  }
  const tone = (x, y) => bands[idxGrid[Math.max(0, Math.min(rows - 1, y))][Math.max(0, Math.min(cols - 1, x))]];
  const bottomC = bands[B - 1];

  // ---- 2. Light lip along the top edge ----
  const lip = shade(top, 18);
  for (let x = 0; x < cols; x++) {
    px(x, 0, lip);
    if ((x * 7) % 5 < 2) px(x, 1, lip);
  }

  // ---- 3. Grass blades: V tufts, bigger toward the viewer ----
  for (let i = 0; i < cols * rows * 0.07; i++) {
    const x = 2 + Math.floor(rand() * (cols - 4));
    const y = 4 + Math.floor(rand() * (rows - 5));
    const t = y / rows;
    const h = t < 0.35 ? 2 : t < 0.7 ? 3 : 4;
    const base = tone(x, y);
    const c = shade(base, -24);
    const tip = shade(base, 26);
    px(x, y, c);
    px(x, y - 1, c);
    px(x - 1, y - h + 1, c);
    px(x + 1, y - h + 1, c);
    if (h >= 3) {
      px(x - 1, y - 1, c);
      px(x, y - h + 1, tip);
    }
    if (h === 4) px(x + 1, y - 1, c);
  }

  // ---- 4. Dirt path with stepping stones and a ragged grassy edge ----
  const dirtL = scaleHex("#E2C393", f);
  const dirtM = scaleHex("#D4B27E", f);
  const dirtD = scaleHex("#B88B5E", f);
  const stoneL = scaleHex("#F6E7C8", f);
  const stoneD = scaleHex("#C4A27A", f);
  const onPath = new Set();
  const pathCx = [];
  for (let y = 0; y < rows; y++) {
    const half = 3 + Math.floor(y * 0.22);
    const cx = Math.round(doorCol - y * 0.5 + Math.sin(y * 0.22) * 2);
    pathCx.push([cx, half]);
    for (let x = cx - half; x <= cx + half; x++) {
      onPath.add(x + "," + y);
      const edge = x === cx - half || x === cx + half;
      px(x, y, edge ? dirtD : (x * 3 + y * 5) % 11 === 0 ? dirtM : dirtL);
    }
    // ragged edge crumbs
    if (rand() < 0.45) px(cx - half - 1, y, dirtD);
    if (rand() < 0.45) px(cx + half + 1, y, dirtD);
  }
  for (let y = 4; y < rows - 2; y += 4 + Math.floor(rand() * 3)) {
    const [cx, half] = pathCx[y];
    const sx = cx - half + 2 + Math.floor(rand() * Math.max(1, half * 2 - 5));
    const w = y > rows * 0.6 ? 4 : 3;
    for (let i = 0; i < w; i++) px(sx + i, y, stoneL);
    for (let i = 1; i < w; i++) px(sx + i, y + 1, stoneD);
  }
  const reserved = new Set(onPath);
  const nearPath = (x, y, m) => {
    for (let dx = -m; dx <= m; dx++)
      for (let dy = -m; dy <= m; dy++) if (reserved.has(x + dx + "," + (y + dy))) return true;
    return false;
  };

  // ---- 5. Meadow objects (flowers, rocks, mushrooms), depth-sorted ----
  const dim = Math.max(0.62, f);
  const leafD = shade(bottomC, -26);
  const leafL = shade(tone(10, rows - 4), -2);
  const gold = scaleHex("#FFD04A", dim);
  const orange = scaleHex("#E8761C", dim);
  const brown = scaleHex("#6B3E1F", dim);

  const classOf = (y) => {
    const t = y / (rows - 1);
    return t < 0.18 ? 0 : t < 0.4 ? 1 : t < 0.68 ? 2 : 3;
  };
  const RAD = [1.2, 2, 3.2, 4.8];
  const things = [];
  const clear = (x, y, r) => {
    for (const p of things) {
      const dx = x - p.x;
      const dy = (y - p.y) * 1.8;
      const rr = r + p.r + 1.6;
      if (dx * dx + dy * dy < rr * rr) return false;
    }
    return true;
  };

  // rocks beside the path, two mushrooms low in the grass
  for (let i = 0; i < 5; i++) {
    const y = 8 + Math.floor(rand() * (rows - 14));
    const [cx, half] = pathCx[y];
    const side = i % 2 ? 1 : -1;
    const x = cx + side * (half + 3 + Math.floor(rand() * 3));
    if (clear(x, y, 2)) things.push({ x, y, r: 2, type: "rock", big: y > rows * 0.5 });
  }
  for (let i = 0; i < 2; i++) {
    for (let tries = 0; tries < 30; tries++) {
      const x = 12 + Math.floor(rand() * (cols - 24));
      const y = Math.floor(rows * 0.72) + Math.floor(rand() * (rows * 0.18));
      if (!nearPath(x, y, 6) && clear(x, y, 3)) {
        things.push({ x, y, r: 3, type: "mushroom" });
        break;
      }
    }
  }

  const tries = cols * rows * 1.1;
  for (let i = 0; i < tries; i++) {
    const x = 4 + Math.floor(rand() * (cols - 8));
    const y = 4 + Math.floor(rand() * (rows - 9));
    let cls = classOf(y);
    if (cls > 1 && rand() < 0.15) cls -= 1;
    const d = (Math.sin(x * 0.045 + 1.3) + Math.sin(y * 0.17 + x * 0.02) + Math.sin(x * 0.11 - y * 0.05) + 3) / 6;
    const keep = [0.2, 0.3, 0.6, 0.7][cls];
    if (rand() > keep * (0.015 + 1.4 * Math.pow(d, 7))) continue;
    if (nearPath(x, y, cls + 2) || !clear(x, y, RAD[cls])) continue;
    let species = "poppy";
    const FAR = ["#FFF8E8", "#FFE066", "#F7A8C4", "#C9A7FF", "#FFF8E8", "#9FD0FF"];
    if (cls >= 2) species = pick(cls === 2 ? ["poppy", "daisy", "tulip", "spike", "poppy", "daisy"] : ["poppy", "daisy", "sunflower", "tulip", "cosmos", "poppy", "daisy", "spike"]);
    const color =
      cls < 2 ? pick(FAR) :
      species === "daisy" ? pick(["#FFF8E8", "#FFF8E8", "#F7C0D0"]) :
      species === "sunflower" ? "#F7B829" :
      species === "cosmos" ? pick(["#F7B6C8", "#C9B6FF", "#F7B6C8"]) :
      species === "tulip" ? pick(["#F7B6C8", "#FFE066", "#C9B6FF", "#F59A8C"]) :
      species === "spike" ? pick(["#9B6FE0", "#B58CF0", "#E071A8"]) : pick(["#F59A8C", "#F7B6C8", "#F4A261", "#F59A8C"]);
    things.push({ x, y, r: RAD[cls], cls, species, color, rot: rand() * 6.28, type: "flower" });
  }
  things.sort((a, b) => a.y - b.y);

  const petals = (pix, p, n, orbit, pr, col) => {
    const petal = scaleHex(col, dim);
    const petalD = shade(petal, -42);
    const petalL = shade(petal, 30);
    for (let k = 0; k < n; k++) {
      const a = p.rot + (k * 2 * Math.PI) / n;
      const ox = p.x + Math.cos(a) * orbit;
      const oy = p.y + Math.sin(a) * orbit;
      for (let y = Math.floor(oy - pr - 1); y <= Math.ceil(oy + pr + 1); y++)
        for (let x = Math.floor(ox - pr - 1); x <= Math.ceil(ox + pr + 1); x++) {
          if (Math.hypot(x - ox, y - oy) > pr + 0.15) continue;
          const lit = x - ox + (y - oy);
          pix.set(x + "," + y, [x, y, lit < -0.7 ? petalL : lit > 0.8 ? petalD : petal]);
        }
    }
    return petalD;
  };
  const disc = (pix, cx, cy, r, col) => {
    for (let y = Math.floor(cy - r - 1); y <= Math.ceil(cy + r + 1); y++)
      for (let x = Math.floor(cx - r - 1); x <= Math.ceil(cx + r + 1); x++)
        if (Math.hypot(x - cx, y - cy) <= r + 0.2) pix.set(x + "," + y, [x, y, col, true]);
  };
  const flush = (pix, p, edgeCol) => {
    const edge = [];
    pix.forEach(([x, y, , isCentre]) => {
      if (isCentre) return;
      const open = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => !pix.has(x + dx + "," + (y + dy)));
      if (open && (y > p.y || x > p.x)) edge.push([x, y]);
    });
    pix.forEach(([x, y, c]) => px(x, y, c));
    edge.forEach(([x, y]) => px(x, y, edgeCol));
  };
  const stem = (p, top, len, leaves) => {
    for (let k = 0; k < len; k++) px(p.x, top + k, k % 2 ? leafD : leafL);
    if (leaves) {
      px(p.x - 1, top + len - 2, leafD);
      px(p.x - 2, top + len - 3, leafL);
      px(p.x + 1, top + len - 1, leafD);
      px(p.x + 2, top + len - 2, leafL);
    }
  };

  // hand-drawn blossoms: P petal, L light, D dark, C/B centre, K centre dark, Y sunflower petal
  const ART = {
    daisy5: [".PPP.", "PPCPP", "PCCCP", "PPCPP", ".PPP."],
    daisy7: [".PP.PP.", "PPPPPPP", ".PCCCP.", "PPCCCPP", ".PCCCP.", "PPPPPPP", ".PP.PP."],
    daisy9: ["...P.P...", ".PPPPPPP.", ".PPPPPPP.", "PPPCCCPPP", ".PPCCCPP.", "PPPCCCPPP", ".PPPPPPP.", ".PPPPPPP.", "...P.P..."],
    poppy5: [".LPL.", "LPKPD", "PKKKD", ".PPD.", ".DDD."],
    poppy7: [".LPPPL.", "LPPPPPD", "PPPKPPD", "PPKKKPD", ".PPKPDD", "..DDDD."],
    poppy9: ["..LPPPL..", ".LPPPPPD.", "LPPPKPPPD", "PPPKKKPPD", "PPKKKKKPD", ".PPPKPPDD", "..PPPDD..", "...DDD..."],
    cosmos7: [".P.P.P.", "PPPPPPP", ".PPCPP.", "PPCCCPP", ".PPCPP.", "PPPPPPP", ".P.P.P."],
    tulip5: ["P.L.P", "PLPPD", "PPPPD", ".PPD.", "..D.."],
    tulip7: ["..L.L..", ".LPPPD.", "LPPPPPD", "LPPPPPD", ".PPPPD.", "..DDD.."],
    sun9: ["...Y.Y...", ".Y.YYY.Y.", "..YYYYY..", "YYYBBBYYY", ".YYBKBYY.", "YYYBBBYYY", "..YYYYY..", ".Y.YYY.Y.", "...Y.Y..."],
  };
  const CENTRE = { daisy: "#FFD04A", poppy: "#FFD04A", cosmos: "#FFD04A", tulip: "#F0508A", sun: "#6B3E1F" };
  const drawArt = (p, key) => {
    const g = ART[key];
    const base = key.replace(/\d+$/, "");
    const petal = base === "sun" ? scaleHex("#F7B829", dim) : scaleHex(p.color, dim);
    const cen = scaleHex(CENTRE[base], dim);
    const w = g[0].length;
    const ox = p.x - Math.floor(w / 2);
    const oy = p.y - Math.floor(g.length / 2);
    stem(p, oy + g.length, base === "sun" ? 7 : g.length > 6 ? 6 : 4, true);
    g.forEach((row, j) =>
      [...row].forEach((ch, i) => {
        let c = null;
        if (ch === "P" || ch === "Y") c = petal;
        else if (ch === "L") c = shade(petal, 30);
        else if (ch === "D") c = shade(petal, -42);
        else if (ch === "C" || ch === "B") c = cen;
        else if (ch === "K") c = base === "daisy" ? orange : shade(cen, -40);
        if (c) px(ox + i, oy + j, c);
      })
    );
  };

  const drawFlower = (p) => {
    const petal = scaleHex(p.color, dim);
    const { x: cx, y: cy, cls } = p;
    if (cls === 0) {
      px(cx, cy, petal);
      px(cx, cy + 1, leafD);
      return;
    }
    if (cls === 1) {
      px(cx, cy - 1, petal);
      px(cx - 1, cy, petal);
      px(cx + 1, cy, petal);
      px(cx, cy + 1, petal);
      px(cx, cy, gold);
      px(cx, cy + 2, leafD);
      px(cx, cy + 3, leafL);
      return;
    }
    if (p.species === "spike") {
      const big = cls === 3;
      const len = big ? 9 : 6;
      const budL = shade(petal, 30);
      const petalD = shade(petal, -42);
      for (let k = 0; k < len; k++) {
        const y = cy - 2 + k;
        if (k < len * 0.65) {
          px(cx, y, k % 2 ? petal : budL);
          if (k > 0) px(cx - 1, y, k % 2 ? budL : petal);
          if (k > 0 && k % 2 === 0) px(cx + 1, y, petalD);
        } else px(cx, y, k % 2 ? leafD : leafL);
      }
      px(cx, cy - 3, budL);
      px(cx - 2, cy + len - 3, leafD);
      px(cx + 2, cy + len - 4, leafL);
      return;
    }
    const big = cls === 3;
    const key =
      p.species === "daisy" ? (big ? pick(["daisy7", "daisy9"]) : "daisy5") :
      p.species === "poppy" ? (big ? pick(["poppy7", "poppy9"]) : "poppy5") :
      p.species === "sunflower" ? "sun9" :
      p.species === "cosmos" ? "cosmos7" :
      big ? "tulip7" : "tulip5";
    drawArt(p, key);
  };

  const drawRock = (p) => {
    const L = scaleHex("#D9DAE2", dim);
    const M = scaleHex("#A9AAB6", dim);
    const D = scaleHex("#767788", dim);
    const shadow = shade(tone(p.x, p.y + 2), -28);
    const art = p.big
      ? [".LLM..", "LLMMMD", "MMMMDD", ".DDDD."]
      : [".LM.", "LMMD", ".DD."];
    art.forEach((row, j) =>
      [...row].forEach((ch, i) => {
        const c = ch === "L" ? L : ch === "M" ? M : ch === "D" ? D : null;
        if (c) px(p.x + i - 1, p.y + j - 1, c);
      })
    );
    for (let i = 0; i < art[0].length - 1; i++) px(p.x + i, p.y + art.length - 1, shadow);
  };

  const drawMushroom = (p) => {
    const cap = scaleHex("#E8412C", dim);
    const capD = scaleHex("#A8281C", dim);
    const stemC = scaleHex("#F3E1B7", dim);
    const white = scaleHex("#FFFFFF", dim);
    [[-2, 0], [-1, -1], [0, -1], [1, -1], [2, 0]].forEach(([dx, dy]) => px(p.x + dx, p.y + dy, cap));
    [[-1, 0], [0, 0], [1, 0]].forEach(([dx, dy]) => px(p.x + dx, p.y + dy, capD));
    px(p.x - 1, p.y - 1, white);
    px(p.x + 1, p.y - 1, white);
    px(p.x, p.y + 1, stemC);
    px(p.x, p.y + 2, stemC);
    px(p.x + 1, p.y + 2, shade(stemC, -30));
  };

  things.forEach((p) => (p.type === "rock" ? drawRock(p) : p.type === "mushroom" ? drawMushroom(p) : drawFlower(p)));

  // ---- 6. Foreground tall grass, overlapping the bottom edge ----
  for (let x = 1; x < cols - 1; x += 2 + Math.floor(rand() * 3)) {
    const base = rows - 1;
    const n = 2 + Math.floor(rand() * 3);
    for (let k = 0; k < n; k++) {
      const bx = x + k - 1;
      const h = 3 + Math.floor(rand() * 5);
      const lean = rand() < 0.5 ? -1 : 1;
      const c = shade(bottomC, -18 - (k % 2) * 8);
      for (let j = 0; j < h; j++) {
        const off = j > h - 3 ? lean : 0;
        px(bx + off, base - j, c);
      }
      px(bx + lean, base - h, shade(bottomC, 22));
      if (rand() < 0.12) {
        px(bx + lean, base - h - 1, scaleHex("#C9A86A", dim));
        px(bx + lean, base - h - 2, scaleHex("#E7CD92", dim));
      }
    }
  }
  for (let x = 0; x < cols; x++) px(x, rows - 1, shade(bottomC, -24));

  // ---- 7. Little life: butterflies by day, fireflies by night ----
  if (!night) {
    const bf = (x, y, col) => {
      const w = scaleHex(col, dim);
      const wd = shade(w, -34);
      [[0, 0], [1, 0], [3, 0], [4, 0], [0, 2], [1, 2], [3, 2], [4, 2]].forEach(([dx, dy]) => px(x + dx, y + dy, w));
      [[1, 1], [3, 1]].forEach(([dx, dy]) => px(x + dx, y + dy, wd));
      px(x + 2, y, "#3A2418");
      px(x + 2, y + 1, "#3A2418");
      px(x + 2, y + 2, "#3A2418");
    };
    bf(Math.round(cols * 0.36), Math.round(rows * 0.3), "#FFB86B");
    bf(Math.round(cols * 0.72), Math.round(rows * 0.18), "#F28DA6");
    bf(Math.round(cols * 0.52), Math.round(rows * 0.58), "#9ED0F2");
  } else {
    for (let i = 0; i < 9; i++) {
      const x = 6 + Math.floor(rand() * (cols - 12));
      const y = 4 + Math.floor(rand() * (rows - 10));
      px(x, y, "#F4FF9A");
      const halo = scaleHex("#C9E86A", 0.6);
      [[1, 0], [-1, 0], [0, 1], [0, -1]].forEach(([dx, dy]) => px(x + dx, y + dy, halo));
    }
  }
}

export default function PixelGround({ top, bottom, houseLeftPct, houseOffsetPx }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const [size, setSize] = useState({ w: 960, h: 126 });

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
  const doorCol = Math.round((size.w * houseLeftPct + houseOffsetPx) / PX);

  useEffect(() => {
    const c = canvasRef.current;
    if (!c || cols < 1 || rows < 1) return;
    c.width = cols;
    c.height = rows;
    draw(c, cols, rows, top, bottom, doorCol);
  }, [cols, rows, top, bottom, doorCol]);

  return (
    <div ref={wrapRef} style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
      <canvas
        ref={canvasRef}
        style={{
          display: "block",
          width: cols * PX,
          height: rows * PX,
          imageRendering: "pixelated",
        }}
      />
    </div>
  );
}

