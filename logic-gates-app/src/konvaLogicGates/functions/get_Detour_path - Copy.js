import { gridSizeConst } from "../../utils/gridSize";

export function getDetourPath(output, input, gates, boardWidth, boardHeight, wireTracker, endDestinationKey, allInputOutputPositions) {
  // NOTICE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // row = y
  // col = x
  // NOTICE !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!

  const yValuesSet = new Set();
  
  // 1) Build costGrid array
  const rows = Math.ceil(boardHeight / gridSizeConst); // Total rows and cols on the screen
  const cols = Math.ceil(boardWidth / gridSizeConst); // Total rows and cols on the screen

  const outputRow = Math.floor(output.y / gridSizeConst);
  const outputCol = Math.floor(output.x / gridSizeConst);
  const inputRow = Math.floor(input.y / gridSizeConst);
  const inputCol = Math.floor(input.x / gridSizeConst);

  
  let costGrid  = Array.from({ length: rows }, () => Array(cols).fill(0));
  

  costGrid  = setGridCosts(costGrid, gates, 
                            wireTracker, 
                            endDestinationKey, 
                            rows, cols,
                            outputRow, outputCol,
                            inputRow, inputCol,
                            allInputOutputPositions);

  // 2) Use pixel coordinates directly for start and end.
  const startX = output.x;
  const startY = output.y;
  const endX   = input.x;
  const endY   = input.y;
 


  // 3) A* search
  let aStarResult = aStarPathPixel(startX, startY, endX, endY, 
    costGrid , boardWidth, boardHeight, 
    yValuesSet,
    rows, cols);


  // aStarResult is now our screenPath in pixel coordinates.
  let screenPath = aStarResult;

  // If the pathfinder returned null, handle it safely.
  if (!screenPath) {
    console.warn("No path found. Returning an empty path.");
    return {
      screenPath: [],
      allGridPoints: [],
      gridPath: []
    };
  }

  // 4) Calculate all grid points covered by the path
  const allGridPoints = [];
  for (let i = 0; i < screenPath.length - 1; i++) {
    const [x1, y1] = screenPath[i];
    const [x2, y2] = screenPath[i + 1];
    const row = Math.floor(y1 / gridSizeConst);
    const col1 = Math.floor(x1 / gridSizeConst);
    const col2 = Math.floor(x2 / gridSizeConst);
    if (y1 === y2) {
      // Horizontal line: same row
      for (let c = Math.min(col1, col2); c <= Math.max(col1, col2); c++) {
        allGridPoints.push([row, c]);
      }
    } else if (x1 === x2) {
      // Vertical line: same column
      const col = Math.floor(x1 / gridSizeConst);
      const row1 = Math.floor(y1 / gridSizeConst);
      const row2 = Math.floor(y2 / gridSizeConst);
      for (let r = Math.min(row1, row2); r <= Math.max(row1, row2); r++) {
        allGridPoints.push([r, col]);
      }
    }
  }

  // screenPath[0] = [screenPath[0][0], output.y];     // output wire *change the Y first
  // screenPath[1] = [output.x , screenPath[1][1]];     // output wire * change the X now

  
  // if ((yValuesSet.size > 1)){
  //   // add a bent right before the input wire
  // screenPath[screenPath.length - 1] = [screenPath[screenPath.length - 1][0], input.y]; // input wire *Change Y  
  // screenPath[screenPath.length - 2] = [input.x, screenPath[screenPath.length - 2][1]]; // input wire
  // }

  // 5b) Force the very first point to be exactly the output pin.
  if (screenPath.length > 0) {
    screenPath[0] = [output.x, output.y];
  }
  
  // 5c) Adjust the final segment to the exact input pin y axis
  //screenPath = fixLastBend(screenPath, input, output);

  // 6) Flatten for Konva's <Line points={...} />
  // 6b) Also produce a grid-based path of the same length
  const gridPath = screenPath.map(([x, y]) => {
    // row = y / gridSizeConst, col = x / gridSizeConst
    // Use Math.floor or Math.round as needed
    const row = Math.floor(y / gridSizeConst);
    const col = Math.floor(x / gridSizeConst);
    return [row, col];
  });

  return {screenPath, allGridPoints, gridPath};
}

/**
 * Use A* to find a path on the costGrid grid from (sr, sc) to (er, ec).
 * Returns an array of [row, col] or null if no path found.
 */
function aStarPathPixel(startX, startY, endX, endY, costGrid, boardWidth, boardHeight, yValuesSet, rows, cols) {
  const step = gridSizeConst;
  
  // Align start and end positions to grid centers
  startX = Math.floor(startX / step) * step + step / 2;
  startY = Math.floor(startY / step) * step + step / 2;
  endX = Math.floor(endX / step) * step + step / 2;
  endY = Math.floor(endY / step) * step + step / 2;

  // Possible movement directions (ensuring movement by one full grid size)
  let directions;
    
  // check if they are on a different level
  if (endX > startX + gridSizeConst * 5){
    if (endY < startY) {
      // Heavily encourage Up by using a bigger negative penalty for Y starting below and ending ontop
      directions = [
        [0, -step, -1.4],  // Up gets -1.0
        [step, 0,  0],     // Right
        [0, step, -0.5],  // Down
        [-step, 0,  0]     // Left
      ];
    } else{
      // Heavily encourage Down by using a bigger negative penalty for Y starting above and ending below
      directions = [
        [0, -step, -0.5],  // Up gets -1.0
        [step, 0,  0],     // Right
        [0, step, -1.4],  // Down
        [-step, 0,  0]     // Left
      ];
    }
  } else{
    directions = [
      [0, -step, -0.5], // Up
      [step, 0,  0],     
      [0, step, -0.5],  // Down
      [-step, 0,  0]
    ];
  }
    
  
  

  function heuristic(x, y, tx, ty) {
    return (Math.abs(x - tx) + Math.abs(y - ty)) / step;
  }

  const parent = new Map();
  const openSet = [];
  
  function nodeKey(x, y) {
    return `${x},${y}`;
  }

  openSet.push({
    x: startX,
    y: startY,
    g: 0,
    f: heuristic(startX, startY, endX, endY)
  });

  const gScore = {};
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      gScore[nodeKey(c * step + step / 2, r * step + step / 2)] = Number.POSITIVE_INFINITY;
    }
  }
  gScore[nodeKey(startX, startY)] = 0;

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f);
    const current = openSet.shift();
    const { x, y } = current;

    if (Math.abs(x - endX) <= step / 2 && Math.abs(y - endY) <= step / 2) {
      let path = [];
      let currKey = nodeKey(x, y);
      while (currKey !== nodeKey(startX, startY)) {
        const [cx, cy] = currKey.split(',').map(Number);
        const centeredX = Math.floor(cx / step) * step + step / 2;
        const centeredY = Math.floor(cy / step) * step + step / 2;
        path.push([centeredX, centeredY]);
        currKey = parent.get(currKey);
      }
      path.push([startX, startY]);
      path.reverse();
      
      for (const [px, py] of path) {
        yValuesSet.add(py);
      }
      return path;
    }

    for (const [dx, dy, penalty] of directions) {
      const nx = x + dx;
      const ny = y + dy;

      if (nx < 0 || nx >= boardWidth || ny < 0 || ny >= boardHeight) continue;

      // Convert to centered coordinates
      const col = Math.floor(nx / step);
      const row = Math.floor(ny / step);
      const nxCentered = col * step + step / 2;
      const nyCentered = row * step + step / 2;
      
      const neighborKey = nodeKey(nxCentered, nyCentered);
      const newG = gScore[nodeKey(x, y)] + costGrid[row][col] + 1 + penalty;

      if (newG < gScore[neighborKey]) {
        gScore[neighborKey] = newG;
        parent.set(neighborKey, nodeKey(x, y));
        const fVal = newG + heuristic(nxCentered, nyCentered, endX, endY);
        openSet.push({ x: nxCentered, y: nyCentered, g: newG, f: fVal });
      }
    }
  }

  console.error("No path found after exhausting all options.");
  return null;
}




function fixLastBend(screenPath, input, output) {
  if (screenPath.length < 2) return screenPath;

  const secondToLastIdx = screenPath.length - 2;
  const lastIdx         = screenPath.length - 1;

  const [sx, sy] = screenPath[secondToLastIdx];
  const [ex, ey] = [input.x, input.y];

  if (input.x < output.x){
    screenPath[secondToLastIdx] = [ex, sy];
  } else {
    screenPath[secondToLastIdx] = [sx, ey];
  }
  
  screenPath[lastIdx] = [ex, ey];

  return screenPath;
}

function setGridCosts(costGrid, gates, wireTracker, endDestinationKey, 
                      rows, cols, outputRow, outputCol, 
                      inputRow, inputCol, allInputOutputPositions) 
{
  for (const gate of gates) {
    if (gate.x == null || gate.y == null) continue;
    const gateLeft   = gate.x;
    const gateTop    = gate.y;
    const gateRight  = gateLeft + Math.ceil(100 / gridSizeConst);
    const gateBottom = gateTop  + Math.ceil(100 / gridSizeConst);

    for (let r = gateTop; r < gateBottom; r++) {
      for (let c = gateLeft; c < gateRight; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {

            let skip = false;
            if (
              (r === inputRow && c === inputCol) ||
              (r === outputRow && c === outputCol)
            ) {
              // This is the input pin or the output pin. Skip!
              skip = true;
            }
            if (!skip) {
              
              costGrid[r][c] = Number.POSITIVE_INFINITY;
            }
              
        }
      }
    }
  }

  for (const key of Object.keys(wireTracker)) {
    if (key !== endDestinationKey) {
      const wireDataArray = wireTracker[key];
      wireDataArray.forEach(({ gridCoordinates }) => {
        if (gridCoordinates) {
          
          gridCoordinates.forEach(([r, c]) => {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              let inputOrOutput = false;
              if (
                (r === inputRow && c === inputCol) ||
                (r === outputRow && c === outputCol)
              ) {
                // This is the input pin or the output pin. Skip!
                inputOrOutput = true;
                costGrid[r][c] = 20;
                // // costGrid[r+1][c]= Number.POSITIVE_INFINITY;
                // // costGrid[r-1][c]= Number.POSITIVE_INFINITY;
                // costGrid[r][c+1]= Number.POSITIVE_INFINITY;
                // costGrid[r][c-1]= Number.POSITIVE_INFINITY;
              } 
              if (!inputOrOutput){
                costGrid[r][c] = 10; // or Infinity if you truly never want to cross wires
              }
              
              
            }
          });
        }
      });
    }
  }
  // Ensure costGrid is properly initialized before using it


// Set all input/output positions in grid coordinates to Infinity
for (const gate of allInputOutputPositions) {
  let r = Math.floor(gate.x / gridSizeConst); // ✅ row corresponds to Y
  let c = Math.floor(gate.y / gridSizeConst); // ✅ column corresponds to X
  if (r >= 0 && r < rows && c >= 0 && c < cols) {
    costGrid[r][c] = Number.POSITIVE_INFINITY;
  }
}


  return costGrid;

  
}