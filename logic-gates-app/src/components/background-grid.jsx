import React from "react";
import { Line } from "react-konva";

const Grid = ({ width, height, gridSize, offsetX, offsetY, scale }) => {
  const lines = [];
  const scaledGridSize = gridSize * scale; // ✅ Adjust grid size when zooming

  // ✅ Calculate start positions correctly, considering negative offsets
  const startX = Math.floor(offsetX / scaledGridSize) * scaledGridSize - scaledGridSize * 10;
  const startY = Math.floor(offsetY / scaledGridSize) * scaledGridSize - scaledGridSize * 10;
  const endX = width - offsetX + scaledGridSize * 400; // Extends beyond viewport
  const endY = height - offsetY + scaledGridSize * 400;

  // ✅ Generate vertical grid lines dynamically
  for (let x = startX; x <= endX; x += scaledGridSize) {
    lines.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="#ddd" strokeWidth={1} />);
  }

  // ✅ Generate horizontal grid lines dynamically
  for (let y = startY; y <= endY; y += scaledGridSize) {
    lines.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="#ddd" strokeWidth={1} />);
  }

  return <>{lines}</>;
};

export default Grid;
