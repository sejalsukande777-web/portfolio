// Front-facing pixel-art sprites drawn in code. The AI-made originals were
// drawn at an isometric angle, so these replace them with level, straight-on
// versions that sit flat in the scene.

function build(W, H, paint) {
  if (typeof document === "undefined") return "";
  const grid = Array.from({ length: H }, () => Array(W).fill(null));
  const rect = (x, y, w, h, c) => {
    for (let j = y; j < y + h; j++)
      for (let i = x; i < x + w; i++) if (grid[j] && i >= 0 && i < W) grid[j][i] = c;
  };
  const px = (x, y, c) => rect(x, y, 1, 1, c);
  paint(rect, px, grid);
  const out = grid.map((r) => r.slice());
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++) {
      if (grid[y][x]) continue;
      const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => grid[y + dy] && grid[y + dy][x + dx]);
      if (near) out[y][x] = "#3A2418";
    }
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const ctx = c.getContext("2d");
  out.forEach((row, y) =>
    row.forEach((col, x) => {
      if (!col) return;
      ctx.fillStyle = col;
      ctx.fillRect(x, y, 1, 1);
    })
  );
  return c.toDataURL();
}

// ---------- coffee table with bead board (48x30) ----------
export const tableImg = build(48, 30, (rect, px, grid) => {
  rect(9, 21, 2, 5, "#6B4426");
  rect(37, 21, 2, 5, "#6B4426");
  rect(2, 12, 44, 6, "#E0B27A");
  rect(2, 12, 44, 1, "#F0CC9A");
  for (let x = 4; x < 44; x += 7) rect(x, 15, 3, 1, "#C9975F");
  rect(2, 18, 44, 3, "#B8845A");
  rect(2, 18, 44, 1, "#C99A6A");
  rect(2, 20, 44, 1, "#8B5A38");
  rect(5, 21, 38, 2, "#8B5A38");
  rect(3, 21, 4, 8, "#8B5A38");
  rect(3, 21, 1, 8, "#A9784A");
  rect(41, 21, 4, 8, "#8B5A38");
  rect(41, 21, 1, 8, "#A9784A");
  rect(9, 13, 24, 5, "#5E3B2A");
  const beads = ["#E8412C", "#F7C531", "#5E9E9A", "#F28DA6", "#F59B28"];
  for (let y = 14; y < 17; y++)
    for (let x = 10; x < 32; x++) grid[y][x] = beads[(Math.floor(x / 2) + y * 2) % beads.length];
  rect(34, 4, 10, 9, "#2B2F4A");
  rect(35, 5, 8, 6, "#9AD3E8");
  rect(35, 5, 8, 1, "#CFEFFA");
  rect(37, 8, 2, 2, "#E8412C");
  rect(38, 11, 2, 2, "#2B2F4A");
  rect(4, 9, 5, 3, "#C6604A");
  rect(4, 9, 5, 1, "#E07A5F");
  [["#F7C531", 5], ["#E8412C", 6], ["#5E9E9A", 7]].forEach(([c, x]) => px(x, 8, c));
});

// ---------- study desk: lamp, open book, candle (56x44) ----------
export const deskImg = build(56, 44, (rect, px) => {
  // legs / pedestal / knee space
  rect(3, 28, 17, 14, "#8B5A38"); // left drawer pedestal
  rect(3, 28, 1, 14, "#A9784A");
  [30, 36].forEach((y) => {
    rect(5, y, 13, 4, "#6B4426");
    rect(6, y + 1, 11, 2, "#8B5A38");
    rect(10, y + 1, 3, 1, "#FFD873"); // drawer knob
  });
  rect(20, 28, 20, 12, "#4A2F1F"); // knee space shadow
  rect(21, 28, 18, 10, "#5E3B2A");
  rect(40, 28, 4, 14, "#8B5A38"); // right leg
  rect(40, 28, 1, 14, "#A9784A");
  // desktop (seen slightly from above) + front edge
  rect(1, 19, 46, 6, "#B8845A");
  rect(1, 19, 46, 1, "#D9A56E");
  for (let x = 4; x < 45; x += 9) rect(x, 22, 4, 1, "#9C6A3E");
  rect(1, 25, 46, 3, "#8B5A38");
  rect(1, 25, 46, 1, "#A9784A");
  // open book
  rect(9, 21, 22, 2, "#6B4C9A"); // cover edge
  rect(10, 14, 10, 7, "#FFF3D6");
  rect(21, 14, 9, 7, "#FFF3D6");
  rect(20, 14, 1, 7, "#C9B88A"); // spine
  [16, 18].forEach((y) => {
    rect(11, y, 7, 1, "#D9C79B");
    rect(22, y, 6, 1, "#D9C79B");
  });
  rect(10, 14, 20, 1, "#FFFFFF");
  // desk lamp
  rect(4, 17, 5, 2, "#2B2F4A");
  [[6, 16], [6, 15], [7, 14], [8, 13], [9, 12], [10, 11]].forEach(([x, y]) => rect(x, y, 1, 1, "#4A4F6A"));
  rect(10, 7, 7, 4, "#2B2F4A");
  rect(11, 8, 5, 2, "#FFD873");
  // candle
  rect(36, 18, 5, 2, "#B8860B");
  rect(37, 14, 3, 4, "#FFF3D6");
  rect(38, 11, 1, 3, "#F59B28");
  rect(38, 10, 1, 2, "#FFD873");
});

// ---------- market stall: striped awning, shelf of jars, counter (64x48) ----------
export const stallImg = build(64, 48, (rect, px) => {
  // posts
  rect(5, 12, 3, 32, "#8B5A38");
  rect(5, 12, 1, 32, "#A9784A");
  rect(56, 12, 3, 32, "#8B5A38");
  rect(56, 12, 1, 32, "#A9784A");
  // back wall with boards
  rect(8, 13, 48, 19, "#C9975F");
  for (let x = 12; x < 56; x += 6) rect(x, 13, 1, 19, "#B8845A");
  // shelf with jars
  rect(8, 24, 48, 2, "#6B4426");
  [["#E8412C", 11], ["#F7C531", 17], ["#5E9E9A", 23], ["#F28DA6", 29], ["#F59B28", 35]].forEach(([c, x]) => {
    rect(x, 19, 4, 5, c);
    rect(x, 18, 4, 1, "#FFF8EC");
    px(x, 19, "#FFFFFF");
  });
  rect(44, 20, 9, 4, "#B8860B"); // basket
  rect(44, 20, 9, 1, "#D9A520");
  // awning: red/white stripes with scalloped edge
  for (let y = 3; y < 13; y++) {
    const inset = Math.max(0, 12 - y - 3);
    for (let x = 2 + inset; x < 62 - inset; x++) {
      px(x, y, Math.floor((x - 2) / 4) % 2 ? "#FFF8EC" : "#E04B3A");
    }
  }
  for (let x = 1; x < 63; x++) {
    const stripe = Math.floor((x - 2) / 4) % 2 ? "#FFF8EC" : "#E04B3A";
    px(x, 13, stripe);
    if (Math.floor(x / 2) % 2 === 0) px(x, 14, stripe);
  }
  rect(8, 3, 48, 1, "#F6B1A8");
  // counter
  rect(2, 31, 60, 3, "#E0B27A");
  rect(2, 31, 60, 1, "#F0CC9A");
  rect(3, 34, 58, 11, "#B8845A");
  for (let x = 9; x < 60; x += 8) rect(x, 34, 1, 11, "#8B5A38");
  rect(3, 34, 58, 1, "#8B5A38");
  rect(3, 44, 58, 1, "#6B4426");
  // goods on the counter
  [[12, "#E8412C"], [17, "#E8412C"], [22, "#F59B28"]].forEach(([x, c]) => {
    rect(x, 28, 4, 3, c);
    px(x + 1, 28, "#FFFFFF");
  });
  rect(42, 27, 10, 4, "#8B5A38");
  rect(42, 27, 10, 1, "#A9784A");
  // little OPEN sign
  rect(25, 37, 14, 5, "#FFF8EC");
  rect(25, 37, 14, 1, "#E04B3A");
  rect(25, 41, 14, 1, "#E04B3A");
  [27, 30, 33, 36].forEach((x) => rect(x, 39, 2, 1, "#E04B3A"));
});
