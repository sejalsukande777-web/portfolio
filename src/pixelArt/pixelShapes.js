// Every shape here is built as a grid of characters, generated
// algorithmically wherever the geometry allows, with real shading (two-tone
// surfaces, brick coursing, paneled doors, framed windows) instead of flat
// single-color fills. That shading is what makes it read as pixel art
// rather than plain colored blocks.

function setRect(grid, x, y, w, h, ch) {
  const rows = grid.map((r) => r.split(""));
  for (let j = y; j < y + h; j++) {
    for (let i = x; i < x + w; i++) {
      if (rows[j] && i >= 0 && i < rows[j].length) rows[j][i] = ch;
    }
  }
  return rows.map((r) => r.join(""));
}

function blank(width, height) {
  return Array.from({ length: height }, () => ".".repeat(width));
}

function padWidth(rows, targetWidth) {
  return rows.map((r) => {
    const extra = targetWidth - r.length;
    const left = Math.floor(extra / 2);
    const right = extra - left;
    return ".".repeat(Math.max(0, left)) + r + ".".repeat(Math.max(0, right));
  });
}

// Darken/lighten a hex color by a fixed amount — used to derive shading
// tones (roof shadow side, cloud underside) from a single base color.
export function shade(hex, amt) {
  const c = hex.replace("#", "");
  const num = parseInt(c, 16);
  let r = (num >> 16) + amt;
  let g = ((num >> 8) & 0xff) + amt;
  let b = (num & 0xff) + amt;
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// ---- Roof: wide, low-pitch gable with diagonal two-tone shading ----
function roofGrid(width, height) {
  const rows = [];
  for (let y = 0; y < height; y++) {
    const t = height === 1 ? 1 : y / (height - 1);
    let filled = Math.round(2 + t * (width - 2));
    filled = Math.max(2, Math.min(width, filled));
    const pad = Math.floor((width - filled) / 2);
    const leftLen = Math.ceil(filled / 2);
    const rightLen = filled - leftLen;
    rows.push(
      ".".repeat(pad) + "F".repeat(leftLen) + "f".repeat(rightLen) + ".".repeat(width - filled - pad)
    );
  }
  return rows;
}

// ---- Brick wall texture: running-bond coursing with mortar lines ----
function brickWall(width, height) {
  const rows = [];
  const brickW = 5;
  for (let y = 0; y < height; y++) {
    let row = "";
    const rowOffset = Math.floor(y / 2) % 2 === 1 ? Math.floor(brickW / 2) : 0;
    const isMortarRow = y % 3 === 2;
    for (let x = 0; x < width; x++) {
      const adjusted = x + rowOffset;
      const isMortarCol = adjusted % brickW === 0;
      if (isMortarRow || isMortarCol) {
        row += "m";
      } else {
        const brickIndex = Math.floor(adjusted / brickW);
        row += brickIndex % 2 === 0 ? "A" : "a";
      }
    }
    rows.push(row);
  }
  return rows;
}

// ---- Window: framed, 4-pane cross divider ----
function windowGrid(size = 7) {
  const mid = Math.floor(size / 2);
  const rows = [];
  for (let y = 0; y < size; y++) {
    let row = "";
    for (let x = 0; x < size; x++) {
      if (x === 0 || x === size - 1 || y === 0 || y === size - 1 || x === mid || y === mid) {
        row += "o";
      } else {
        row += "w";
      }
    }
    rows.push(row);
  }
  return rows;
}

// ---- Door: outlined frame with two recessed panels + knob ----
function doorGrid(w = 8, h = 13) {
  const rows = [];
  for (let y = 0; y < h; y++) {
    let row = "";
    for (let x = 0; x < w; x++) {
      const border = x === 0 || x === w - 1 || y === 0;
      const panel1 =
        (x === 2 && y >= 2 && y <= 5) ||
        (x === w - 3 && y >= 2 && y <= 5) ||
        (y === 2 && x >= 2 && x <= w - 3) ||
        (y === 5 && x >= 2 && x <= w - 3);
      const panel2 =
        (x === 2 && y >= 7 && y <= h - 2) ||
        (x === w - 3 && y >= 7 && y <= h - 2) ||
        (y === 7 && x >= 2 && x <= w - 3) ||
        (y === h - 2 && x >= 2 && x <= w - 3);
      if (border) row += "o";
      else if (panel1 || panel2) row += "p";
      else row += "D";
    }
    rows.push(row);
  }
  return rows;
}

// ---- Full house: roof + chimney + brick wall + windows + door ----
export function houseGrid() {
  const wallWidth = 30;
  const wallHeight = 18;
  const roofWidth = 34;
  const roofHeight = 10;
  const topPad = 4; // room for the chimney to poke above the roofline

  let wall = brickWall(wallWidth, wallHeight);
  const win = windowGrid(7);
  wall = stamp(wall, win, 3, 4);
  wall = stamp(wall, win, wallWidth - 10, 4);
  const door = doorGrid(8, 12);
  wall = stamp(wall, door, Math.floor((wallWidth - 8) / 2), wallHeight - 12);
  wall = setRect(wall, Math.floor(wallWidth / 2), wallHeight - 7, 1, 1, "k"); // doorknob

  let roof = roofGrid(roofWidth, roofHeight);
  wall = padWidth(wall, roofWidth);

  let canvas = [...blank(roofWidth, topPad), ...roof, ...wall];

  // Chimney: sized and positioned so its base sits on solid roof at every
  // overlapping row, so it reads as emerging from the roof, not floating.
  const chimX = 17;
  canvas = setRect(canvas, chimX, 0, 4, 9, "K");
  canvas = setRect(canvas, chimX, 0, 4, 1, "k2");

  return canvas;
}

function stamp(baseRows, patchRows, x, y) {
  let out = baseRows;
  patchRows.forEach((row, j) => {
    [...row].forEach((ch, i) => {
      out = setRect(out, x + i, y + j, 1, 1, ch);
    });
  });
  return out;
}

export const houseColorMap = {
  F: "#C6604A",
  f: "#A84E3C",
  A: "#D8B896",
  a: "#C9A57E",
  m: "#8B6F52",
  w: "#B9E4F5",
  o: "#3A3252",
  D: "#3E6E9E",
  p: "#335A82",
  k: "#FFD873",
  K: "#B98A63",
  k2: "#8B6642",
};

export function houseColorMapForGlow(glow) {
  return {
    ...houseColorMap,
    w: glow > 0.4 ? "#FFE9A8" : "#B9E4F5",
  };
}

// ---- Cloud: wide stepped silhouette with a shaded underside ----
// Puffy cartoon clouds built from overlapping circles with a flat base.
// Shading is solid bands (light top rim, darker bottom 2 rows) - no dithering.
const CLOUD_SHAPES = [
  { w: 30, h: 13, base: 11, circles: [[7, 9, 4], [13, 6, 6], [20, 8, 5], [25, 9, 3]] },
  { w: 22, h: 11, base: 9, circles: [[6, 7, 3], [11, 5, 5], [16, 7, 4]] },
  { w: 28, h: 12, base: 10, circles: [[6, 8, 3], [11, 7, 5], [17, 5, 5], [22, 8, 4]] },
];

export function cloudGrid(variant = 0) {
  const { w, h, base, circles } = CLOUD_SHAPES[variant % CLOUD_SHAPES.length];
  const on = Array.from({ length: h }, () => Array(w).fill(false));
  for (let y = 0; y <= base; y++) {
    for (let x = 0; x < w; x++) {
      for (const [cx, cy, r] of circles) {
        if (Math.hypot(x - cx, y - cy) <= r + 0.3) on[y][x] = true;
      }
    }
  }
  // flatten the underside: fill a solid strip between the outer circles
  const xs = circles.map(([cx, , r]) => [cx - r + 1, cx + r - 1]);
  const x0 = Math.min(...xs.map((v) => v[0]));
  const x1 = Math.max(...xs.map((v) => v[1]));
  for (let y = base - 1; y <= base; y++)
    for (let x = x0; x <= x1; x++) if (x >= 0 && x < w) on[y][x] = true;

  const out = on.map((row) => row.map((v) => (v ? "C" : ".")));
  for (let x = 0; x < w; x++) {
    let top = -1;
    let bottom = -1;
    for (let y = 0; y < h; y++) {
      if (on[y][x]) {
        if (top < 0) top = y;
        bottom = y;
      }
    }
    if (top < 0) continue;
    out[top][x] = "W";
    out[bottom][x] = "c";
    if (bottom - 1 > top && on[bottom - 1][x]) out[bottom - 1][x] = "c";
  }
  return out.map((r) => r.join(""));
}
