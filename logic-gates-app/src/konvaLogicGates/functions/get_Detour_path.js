import { gridSizeConst } from "../../utils/gridSize";

export function getDetourPath(output, input, gates, boardWidth, boardHeight, wireTracker, endDestinationKey) {
  
  const yValuesSet = new Set();
  
  // 1) Build blocked array
  const rows = Math.ceil(boardHeight / gridSizeConst);
  const cols = Math.ceil(boardWidth / gridSizeConst);
  
  let blocked = Array.from({ length: rows }, () => Array(cols).fill(false));

  blocked = blockGrids(blocked, gates, wireTracker, input, endDestinationKey, rows, cols);

  // 2) Convert output/input coords (in px) to grid coords
  const startRow = Math.floor((output.y) / gridSizeConst);
  const startCol = Math.floor((output.x )/ gridSizeConst);
  const endRow   = Math.floor(input.y / gridSizeConst);
  const endCol   = Math.floor(input.x / gridSizeConst);
  console.log("Start grid:", startRow, startCol);
  console.log("End grid:", endRow, endCol);

  // Quick boundary checks
  if (startRow < 0 || startRow >= rows || startCol < 0 || startCol >= cols) {
    console.error("Start point out of bounds:", startRow, startCol);
    return null;
  }
  if (endRow < 0 || endRow >= rows || endCol < 0 || endCol >= cols) {
    console.error("End point out of bounds:", endRow, endCol);
    return null;
  }

  // 3) A* search
  let aStarResult = aStarPath(startRow, startCol, endRow, endCol, blocked, yValuesSet);
  if (aStarResult) {
    const pathLength = aStarResult.length;
    const manhattanDist = Math.abs(startRow - endRow) + Math.abs(startCol - endCol);
  
    if (pathLength > manhattanDist * 3) {
      console.warn("Detected a big detour. Ignoring conflict and re-running A* without blocking.");
  
      // Option A: Re-run A* but skip blocking
      // Create a fresh 2D array of `false` so absolutely no cell is blocked
      const unblockedArray = Array.from({ length: rows }, () => Array(cols).fill(false));
      aStarResult = aStarPath(startRow, startCol, endRow, endCol, unblockedArray, yValuesSet);
      // If fallbackResult is good, use that
      // else fallback to aStarResult or return null
    }
  } else if(!aStarResult){
    console.error("No path found by A*")
    return null;
  }

  // 4) Convert A* path from grid coords to pixel coords
  let screenPath = aStarResult.map(([r, c]) => [
    c * gridSizeConst + gridSizeConst % gridSizeConst,  // Intermediate grid point (center of grid cell)
    r * gridSizeConst + gridSizeConst % gridSizeConst
  ]);

  // 4.5) Calculate all grid points covered by the path
  const allGridPoints = [];
  for (let i = 0; i < aStarResult.length - 1; i++) {
      const [startR, startC] = aStarResult[i];
      const [endR, endC] = aStarResult[i + 1];

      if (startR === endR) {
          // Horizontal line
          for (let c = Math.min(startC, endC); c <= Math.max(startC, endC); c++) {
              allGridPoints.push([startR, c]);
          }
      } else if (startC === endC) {
          // Vertical line
          for (let r = Math.min(startR, endR); r <= Math.max(startR, endR); r++) {
              allGridPoints.push([r, startC]);
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

  // 5) simplify the path
  screenPath = simplifyPath(screenPath);
  
  // 5b) Force the very first point to the exact output pin
  if (screenPath.length > 0) {
    screenPath[0] = [output.x, output.y];
  }
  
  // 5c) Adjust the final segment to the exact input pin y axis
  screenPath = fixLastBend(screenPath, input, output);

  // 6) Flatten for Konva's <Line points={...} />
  const flattened = screenPath.flatMap(([x, y]) => [x, y]);
  console.log(`about to exit getDetourPath, all grid points = ${allGridPoints}`)
  console.log(`about to exit getDetourPath, flattened = ${flattened}`)
  return {flattened, allGridPoints};
}

/**
 * Use A* to find a path on the blocked grid from (sr, sc) to (er, ec).
 * Returns an array of [row, col] or null if no path found.
 */
function aStarPath(sr, sc, er, ec, blocked, yValuesSet) {
  const rows = blocked.length;
  const cols = blocked[0].length;

  // 4-directional movement
  const directions = [
    [-1, 0, 0.05],  // up
    [0, 1, 0],   // right
    [1, 0, 0],   // down
    [0, -1, 0],  // left
  ];

  /**
   * Modified Manhattan-distance heuristic
   * Bias y-alignment early by adding a penalty if the y-axis is not aligned
   *    h = |r1 - r2| + |c1 - c2|
   */
  function heuristic(r, c, tr, tc) {
    const yMisalignmentPenalty = Math.abs(r - tr) > 0 ? 1 : 0; // Encourage y-alignment
    return Math.abs(r - tr) + Math.abs(c - tc) + yMisalignmentPenalty;
  }

  // Store whether visited & the cost so far
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  // Parent for path reconstruction
  const parent = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );
  // Min-heap or priority queue for open set
  // We'll just use a simple array .sort() for clarity, but you can use a real PQ library for performance
  const openSet = [];

  // Start node
  const startNode = {
    r: sr,
    c: sc,
    g: 0, // cost from start
    f: heuristic(sr, sc, er, ec), // estimated cost total: g + h
  };
  openSet.push(startNode); // This will store all the nodes that are being considered

  visited[sr][sc] = true;

  while (openSet.length > 0) {
    // 1) Sort to pop the node with the smallest f
    openSet.sort((a, b) => a.f - b.f); // Sort the nodes with the least cost to the destination to the most
    const current = openSet.shift(); // remove the node with smallest f

    const { r, c, g } = current;
    // 2) If we've reached the end, reconstruct path
    if (r === er && c === ec) {
      return reconstructPath(parent, sr, sc, er, ec, yValuesSet);
    }

    // 3) Explore neighbors
    for (const [dr, dc, penalty] of directions) {
      const nr = r + dr;  // new row
      const nc = c + dc;  // new col
      // Validate
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !blocked[nr][nc]
      ) {
        if (!visited[nr][nc]) {
          visited[nr][nc] = true;
          parent[nr][nc] = [r, c];
          let newG = 0;
          if (sc > ec){     // If the starting point x axis is more than the end point x axis, meaning wire travels right to left
            newG = g + 1 + penalty; // distance from the start so far
          } else{
            newG = g + 1; // distance from the start so far
          }

          const hVal = heuristic(nr, nc, er, ec); // heuristic cost
          const fVal = newG + hVal;   // estimated total cost of path

          openSet.push({
            r: nr,
            c: nc,
            g: newG,
            f: fVal,
          });
        }
      }
    }
  }

  // no path
  return null;
}

// Reconstruct path from parent array
function reconstructPath(parent, sr, sc, er, ec, yValuesSet) {
  let path = [];
  let current = [er, ec];

  while (current) {
    path.push(current);

    // Convert grid row (Y) to pixel Y and add to the set
    const [cr, cc] = current;
    const pixelY = cr * gridSizeConst + gridSizeConst / 2;
    yValuesSet.add(pixelY);

    current = parent[cr][cc];
    if (current && current[0] === sr && current[1] === sc) {
      path.push(current);
      const startPixelY = current[0] * gridSizeConst + gridSizeConst / 2;
      yValuesSet.add(startPixelY);
      break;
    }
  }
  path.reverse();
  return path;
}

function simplifyPath(points) {
  // This function is to remove redundant points that dont change the direction of the wire
  if (points.length <= 2) return points;

  const simplified = [points[0]]; // Always include the first point because it is the starting point

  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i - 1]; // Previous point
    const [x2, y2] = points[i];     // Middle point
    const [x3, y3] = points[i + 1]; // Next point

    // If not in a straight line, keep the middle point
    if (!((x1 === x2 && x2 === x3) || (y1 === y2 && y2 === y3))) {
      simplified.push(points[i]); // Keep the middle point
    }
  }
 
  simplified.push(points[points.length - 1]); // Always include the last point
  return simplified;
}


function fixLastBend(screenPath, input, output) {
  // If there's fewer than 2 points, nothing to fix
  if (screenPath.length < 2) return screenPath;

  // The second-to-last point
  const secondToLastIdx = screenPath.length - 2;
  const lastIdx         = screenPath.length - 1;

  const [sx, sy] = screenPath[secondToLastIdx];
  const [ex, ey] = [input.x, input.y]; // real final point

  // Step 1) Make the second-to-last point match the final Y
  //         so that vertical segment lines up with actual input.y
  //         ( do the reverse if you prefer matching X first.)
  if (input.x < output.x){
    screenPath[secondToLastIdx] = [ex, sy];
  } else{
    screenPath[secondToLastIdx] = [sx, ey];
  }
  

  // Step 2) Make the very last point exactly (input.x, input.y).
  screenPath[lastIdx] = [ex, ey];

  return screenPath;
}

function blockGrids(blocked, gates, wireTracker, input, endDestinationKey, rows, cols){
  // Mark the grid cells that are 'blocked' by gates
  for (const gate of gates) {
    if (gate.x == null || gate.y == null) continue;
    const gateLeft   = gate.x;
    const gateTop    = gate.y;
    const gateRight  = gateLeft + Math.ceil(100 / gridSizeConst);
    const gateBottom = gateTop  + Math.ceil(100 / gridSizeConst);
    console.log("gate type : ", gate.type, "gateLeft = ", gateLeft, "gateTop = ", gateTop, "gateRight = ", gateRight, "gateBottom = ", gateBottom);

    for (let r = gateTop; r < gateBottom; r++) {
      for (let c = gateLeft; c < gateRight; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          blocked[r][c] = true;
        }
      }
    }
  }

  // If the end destination is different , block the grids with the wires from wireTracker
  for (const key of Object.keys(wireTracker)){
    if (key !== endDestinationKey){
      // then we mark it as blocked
      const wireDataArray = wireTracker[key];
      wireDataArray.forEach(({gridCoordinates}) => {
        if (gridCoordinates){
          gridCoordinates.forEach(([r, c]) => {
            if (r >= 0 && r < rows && c >= 0 && c < cols) {
              blocked[r][c] = true;
            }
          });
        }
      })
    }
  }

  return blocked;

}