import React from 'react';
import { gridSizeConst } from '../utils/gridSize';

const Grid = () => {
  const gridSize = gridSizeConst;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const lines = [];
  const xHeaders = [];
  const yHeaders = [];

  // Create the grid lines and axis headers
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#ddd" />
    );
    xHeaders.push(`${x / gridSize}`);
  }

  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#ddd" />
    );
    yHeaders.push(`${y / gridSize}`);
  }

  return (
    <svg className="svg-grid">
      {lines}
      {xHeaders.map((header, index) =>
        index !== 0 ? (
          <text
            key={`x-header-${index}`}
            x={index * gridSize + gridSize / 6}
            y={15}
            fontSize="10"
            fill="black"
          >
            {header}
          </text>
        ) : null
      )}
      {yHeaders.map((header, index) =>
        index !== 0 ? (
          <text
            key={`y-header-${index}`}
            x={5}
            y={index * gridSize + gridSize / 1.5}
            fontSize="10"
            fill="black"
          >
            {header}
          </text>
        ) : null
      )}
    </svg>
  );
};

export default Grid;
