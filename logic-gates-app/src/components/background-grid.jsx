import React from 'react';
import { Line } from 'react-konva';

const Grid = ({ width, height, gridSize, offsetX, offsetY }) => {
  const lines = [];

  // Calculate grid start and end positions based on panning offset
  const startX = Math.floor(offsetX / gridSize) * gridSize;
  const startY = Math.floor(offsetY / gridSize) * gridSize;
  const endX = width - startX + gridSize * 10;  // Extra 10 grids beyond view
  const endY = height - startY + gridSize * 10; // Extra 10 grids beyond view

  // Generate vertical grid lines
  for (let x = startX; x <= endX; x += gridSize) {
    lines.push(<Line key={`v-${x}`} points={[x, startY, x, endY]} stroke="#ddd" strokeWidth={1} />);
  }

  // Generate horizontal grid lines
  for (let y = startY; y <= endY; y += gridSize) {
    lines.push(<Line key={`h-${y}`} points={[startX, y, endX, y]} stroke="#ddd" strokeWidth={1} />);
  }

  return <>{lines}</>;
};

export default Grid;
