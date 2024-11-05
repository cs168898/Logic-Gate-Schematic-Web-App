import React from 'react';

const Grid = () => {
  const gridSize = 20;
  const width = window.innerWidth;
  const height = window.innerHeight;

  const lines = []; // Create the array that will store all the lines
  const gridCells = []; // Array to track each grid cell (box)
  const xHeaders = []; // Array to track X axis headers
  const yHeaders = []; // Array to track Y axis headers

  // Create the X axis lines and track X positions
  for (let x = 0; x <= width; x += gridSize) {
    lines.push(
      <line key={`v-${x}`} x1={x} y1={0} x2={x} y2={height} stroke="#ddd" />
    );
    xHeaders.push(`X${x / gridSize}`); // Track headers as 'x1', 'x2', etc.
  }

  // Create the Y axis lines and track Y positions
  for (let y = 0; y <= height; y += gridSize) {
    lines.push(
      <line key={`h-${y}`} x1={0} y1={y} x2={width} y2={y} stroke="#ddd" />
    );
    yHeaders.push(`Y${y / gridSize}`); // Track headers as 'y1', 'y2', etc.
  }

  return (
    <svg width={width} height={height} style={{ border: '1px solid grey' }}>
      {/* Draw the grid lines */}
      {lines}

      {/* Draw X axis headers (for visual purposes) */}
      {xHeaders.map((header, index) =>{
          if ( index != 0){
            return(
        
              <text
                key={`x-header-${index}`}
                x={index * gridSize + gridSize / 6}
                y={15}
                fontSize="10"
                fill="black"
              >
                {header}
              </text>
            )
          } else{
            return null;
          }
      }  )}

      {/* Draw Y axis headers (for visual purposes) */}
      {yHeaders.map((header, index) => {
        if ( index != 0){
          return(
            <text
            key={`y-header-${index}`}
            x={5}
            y={index * gridSize + gridSize / 1.5}
            fontSize="10"
            fill="black"
          >
            {header}
          </text>
          )} else {
            return null;
          }
        
      })}
    </svg>
  );
};

export default Grid;