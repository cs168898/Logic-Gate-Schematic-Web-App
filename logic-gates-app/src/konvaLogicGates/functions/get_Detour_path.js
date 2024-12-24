import { gridSizeConst } from "../../utils/gridSize";

export function getDetourPath(output, input, gates, boardWidth, boardHeight) {
  // 1) Build blocked array *Initialize a grid of 2d array of boolean values
  const rows = Math.ceil(boardHeight / gridSizeConst);
  const cols = Math.ceil(boardWidth / gridSizeConst);

  const blocked = Array.from({ length: rows }, () => 
    Array(cols).fill(false)
  );

  // Mark the grid cells that are 'blocked' by gates
  for (const gate of gates) {
    if (gate.x == null || gate.y == null) continue;
    const gateLeft = gate.x;
    const gateTop = gate.y;
    const gateRight = gateLeft + Math.ceil(100 / gridSizeConst);
    const gateBottom = gateTop + Math.ceil(100 / gridSizeConst);

  // in grid terms, row = y and col = x, just imagine turning the screen sideways
    for (let r = gateTop; r < gateBottom; r++) {
      for (let c = gateLeft; c < gateRight; c++) {
        if (r >= 0 && r < rows && c >= 0 && c < cols) {
          blocked[r][c] = true;
        }
      }
    }
  }

  // 2) Convert output/input coords (in px) to grid coords
  const startRow = Math.floor(output.y / gridSizeConst);
  const startCol = Math.floor(output.x / gridSizeConst);
  const endRow = Math.floor(input.y / gridSizeConst);
  const endCol = Math.floor(input.x / gridSizeConst);

  // 3) BFS
  const bfsResult = bfsPath(startRow, startCol, endRow, endCol, blocked);
  if (!bfsResult) {
    console.error("No path found!");
    return null;
  }

  // 4) Convert BFS path to screen coords
  let screenPath = bfsResult.map(([r, c]) => [
    c * gridSizeConst + gridSizeConst / 2,
    r * gridSizeConst + gridSizeConst / 2
  ]);

  // 5) Simplify the path for orth routing
  screenPath = simplifyPath(screenPath);

  return screenPath;
}

// BFS logic
function bfsPath(startRow, startCol, endRow, endCol, blocked) {
  const rows = blocked.length;
  const cols = blocked[0].length;
  const directions = [
    [-1, 0], // up
    [0, 1],  // right
    [1, 0],  // down
    [0, -1]  // left
  ];

  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));
  const parent = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => null)
  );

  const queue = [];
  queue.push([startRow, startCol]);
  visited[startRow][startCol] = true;

  while (queue.length) {
    const [r, c] = queue.shift();
    if (r === endRow && c === endCol) {
      return reconstructPath(parent, startRow, startCol, r, c);
    }

    for (const [dr, dc] of directions) {
      const nr = r + dr;
      const nc = c + dc;
      if (
        nr >= 0 && nr < rows &&
        nc >= 0 && nc < cols &&
        !blocked[nr][nc] &&
        !visited[nr][nc]
      ) {
        visited[nr][nc] = true;
        parent[nr][nc] = [r, c];
        queue.push([nr, nc]);
      }
    }
  }

  return null; // no path
}

function reconstructPath(parent, sr, sc, er, ec) {
  let path = [];
  let current = [er, ec];

  while (current) {
    path.push(current);
    const [cr, cc] = current;
    current = parent[cr][cc];
    if (current && current[0] === sr && current[1] === sc) {
      path.push(current);
      break;
    }
  }

  path.reverse();
  return path;
}

function simplifyPath(points) {
  if (points.length <= 2) return points;

  const simplified = [points[0]];
  for (let i = 1; i < points.length - 1; i++) {
    const [x1, y1] = points[i - 1];
    const [x2, y2] = points[i];
    const [x3, y3] = points[i + 1];
    // If not in a straight line, keep the middle point
    if (!((x1 === x2 && x2 === x3) || (y1 === y2 && y2 === y3))) {
      simplified.push(points[i]);
    }
  }
  simplified.push(points[points.length - 1]);
  return simplified;
}
