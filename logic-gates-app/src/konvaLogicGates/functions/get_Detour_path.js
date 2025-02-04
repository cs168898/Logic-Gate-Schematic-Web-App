import { gridSizeConst } from "../../utils/gridSize";

export function getDetourPath(output, input, gates, boardWidth, boardHeight, wireTracker, endDestinationKey) {
  
  const yValuesSet = new Set();
  
  // 1) Build blocked array
  const rows = Math.ceil(boardHeight / gridSizeConst);
  const cols = Math.ceil(boardWidth / gridSizeConst);
  
  let blocked = Array.from({ length: rows }, () => Array(cols).fill(false));

  blocked = blockGrids(blocked, gates, wireTracker, input, endDestinationKey, rows, cols);

  // 2) Use pixel coordinates directly for start and end.
  const startX = output.x;
  const startY = output.y;
  const endX   = input.x;
  const endY   = input.y;
  console.log("Start pixel:", startX, startY);
  console.log("Start grid:", Math.floor(startY / gridSizeConst), Math.floor(startX / gridSizeConst));
  console.log("End pixel:", endX, endY);
  console.log('End grid:', Math.floor(endY / gridSizeConst), Math.floor(endX / gridSizeConst));

  
  // 3) A* search
  let aStarResult = aStarPathPixel(startX, startY, endX, endY, blocked, boardWidth, boardHeight, yValuesSet);
  if (aStarResult) {
    const pathLength = aStarResult.length;
    const manhattanDist = (Math.abs(startX - endX) + Math.abs(startY - endY)) / gridSizeConst;
  
    if (pathLength > manhattanDist * 1.5) {
      console.warn("Detected a big detour. Ignoring conflict and re-running A* without blocking.");
      
      // Option A: Re-run A* but skip blocking
      // Create a fresh 2D array of `false` so absolutely no cell is blocked
      const unblockedArray = Array.from({ length: rows }, () => Array(cols).fill(false));
      aStarResult = aStarPathPixel(startX, startY, endX, endY, unblockedArray, boardWidth, boardHeight, yValuesSet);
      // If fallbackResult is good, use that
      // else fallback to aStarResult or return null
    }
  } else{
    console.error("No path found by A*")
    return null;
  }

  // aStarResult is now our screenPath in pixel coordinates.
  let screenPath = aStarResult;

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

  console.log("screenPath before fixLastBend:", screenPath);
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

  console.log(`about to exit getDetourPath, all grid points = ${allGridPoints}`)
  if (!screenPath){
    console.log("screenPath is null")
  }
  console.log('screenPath= ', screenPath)
  return {screenPath, allGridPoints, gridPath};
}

/**
 * Use A* to find a path on the blocked grid from (sr, sc) to (er, ec).
 * Returns an array of [row, col] or null if no path found.
 */
function aStarPathPixel(startX, startY, endX, endY, blocked, boardWidth, boardHeight, yValuesSet) {
  const step = gridSizeConst;

  // Four possible moves: up, right, down, left.
  const directions = [
    [0, -step, -0.05],  // up added penalty for moving up, encouraging the search to move horizontally first
    [step, 0, 0],      // right
    [0, step, -0.05],      // down
    [-step, 0, 0]      // left
  ];

  /**
   * Modified Manhattan-distance heuristic
   * Bias y-alignment early by adding a penalty if the y-axis is not aligned
   *    h = |r1 - r2| + |c1 - c2|
   */
  // Manhattan-distance heuristic (normalized by step size).
  function heuristic(x, y, tx, ty) {
    return (Math.abs(x - tx) + Math.abs(y - ty)) / step;
  }

  // We'll use a Set to keep track of visited nodes (keys are "x,y")
  const visited = new Set();

  // Parent map for path reconstruction (key: "x,y", value: parent's "x,y")
  const parent = new Map();

  // Priority queue (stores nodes to be evaluated)
  const openSet = []; 

  // function to convert to string
  function nodeKey(x, y) {
    return `${x},${y}`;
  }

  // Min-heap or priority queue for open set
  // We'll just use a simple array .sort() for clarity, but you can use a real PQ library for performance
  
  openSet.push({
    x: startX,
    y: startY,
    g: 0,
    f: heuristic(startX, startY, endX, endY)
  });

  visited.add(nodeKey(startX, startY));
  

  while (openSet.length > 0) {
    openSet.sort((a, b) => a.f - b.f); // sort the node by the lowest f value
    const current = openSet.shift(); // take the lowest f value node
    const { x, y, g } = current;

    // Check if destination reached.
    if (Math.abs(x - endX) < step / 2 && Math.abs(y - endY) < step / 2) {
      // Reconstruct path.
      let path = [];
      let currKey = nodeKey(x, y);
      while (currKey !== nodeKey(startX, startY)) {
        const [cx, cy] = currKey.split(',').map(Number);
        path.push([cx, cy]);
        currKey = parent.get(currKey);
      }
      path.push([startX, startY]);
      path.reverse();
      
      for (const [px, py] of path) {
        yValuesSet.add(py);
      }
      return path;
    }

    // Explore each neighbor.
    for (const [dx, dy, penalty] of directions) {

      const nx = x + dx; //neighbour x
      const ny = y + dy; // neighbour y

      // Check board boundaries, if it exceed, skip to the next neighbour
      if (nx < 0 || nx >= boardWidth || ny < 0 || ny >= boardHeight) continue;

      // Use grid conversion for collision checking.
      const row = Math.floor(ny / gridSizeConst);
      const col = Math.floor(nx / gridSizeConst);
      if (blocked[row][col]) continue;

      const neighborKey = nodeKey(nx, ny);

      // skip if already visited before if not it will loop
      if (visited.has(neighborKey)) continue; 

      visited.add(neighborKey); // add to visited if not visited before
      
      parent.set(neighborKey, nodeKey(x, y));
      const newG = g + 1 + penalty;
      const fVal = newG + heuristic(nx, ny, endX, endY);
      openSet.push({ x: nx, y: ny, g: newG, f: fVal });
    }
  }

  // no path
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

function blockGrids(blocked, gates, wireTracker, input, endDestinationKey, rows, cols) {
  for (const gate of gates) {
    if (gate.x == null || gate.y == null) continue;
    const gateLeft   = gate.x;
    const gateTop    = gate.y;
    const gateRight  = gateLeft + Math.ceil(100 / gridSizeConst);
    const gateBottom = gateTop  + Math.ceil(100 / gridSizeConst);

    for (let r = gateTop; r < gateBottom; r++) {
      for (let c = gateLeft; c < gateRight; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          blocked[r][c] = true;
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
              blocked[r][c] = true;
            }
          });
        }
      });
    }
  }

  return blocked;
}