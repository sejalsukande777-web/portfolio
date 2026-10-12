import React from "react";

// Renders a 2D grid of characters as true pixel-art SVG: every "pixel" is a
// plain <rect>, no rounded corners, no blur, no gradients. colorMap maps
// each character to a hex color; '.' or unmapped characters are transparent.
// Defensive: rows are padded/truncated to a consistent width so a stray
// authoring mistake can't break rendering.
export default function PixelSprite({
  grid,
  colorMap,
  pixelSize = 4,
  className,
  style,
  animateFill = false,
}) {
  const width = Math.max(...grid.map((row) => row.length));
  const rows = grid.map((row) => row.padEnd(width, ".").slice(0, width));
  const height = rows.length;

  return (
    <svg
      width={width * pixelSize}
      height={height * pixelSize}
      viewBox={`0 0 ${width * pixelSize} ${height * pixelSize}`}
      className={className}
      style={{ display: "block", imageRendering: "pixelated", ...style }}
      shapeRendering="crispEdges"
      aria-hidden="true"
    >
      {rows.map((row, y) =>
        [...row].map((ch, x) => {
          const color = colorMap[ch];
          if (!color || ch === ".") return null;
          return (
            <rect
              key={`${x}-${y}`}
              x={x * pixelSize}
              y={y * pixelSize}
              width={pixelSize}
              height={pixelSize}
              fill={color}
              style={animateFill ? { transition: "fill 0.6s ease" } : undefined}
            />
          );
        })
      )}
    </svg>
  );
}
