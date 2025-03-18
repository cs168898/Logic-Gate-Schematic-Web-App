let wireCounter = 0; // Global or module-level counter

export function detectConflict(gridCoords, wireTracker, pixelCoords, endDestinationKey, gridSizeConst) {
    // 1. store the existing wires into a map for more efficient lookup
    const cellWireMap = new Map();
    
    for (const key of Object.keys(wireTracker)){
      // if the wires are not the same destination as the current wire then create the blocked coordinates
      if (key !== endDestinationKey){
        for (const wire of wireTracker[key]){
          
            if (!wire.someUniqueId) {
                wire.someUniqueId = `wire-${wireCounter++}`; // Generate a unique ID
                }
            
            const wireId = wire.someUniqueId; //Create ID for each wire
            // wire.gridCoords might look like [ [row1, col1], [row2, col2], ... ]
    
            // Mark each cell as occupied by wireId
            for (const [row, col] of wire.gridCoords) {
                cellWireMap.set(`${row},${col}`, wireId);
          }
        }
      }
    }
  
    // 2. Detect all grids that has conflict by comparing the cellWireMap set with the gridCoords that contain current wire coords
    // and identify the direction they are conflicting in
    const conflictCells = [];
    gridCoords.forEach(([row, col], i) => {
      if (cellWireMap.has(`${row},${col}`)) {

        conflictCells.push({ row, col, index: i });

      }
    });

    
    
    // 3. Adjust the path of each conflicting gridCoords wire based on the direction they are conflicting in and move all subsequent
    // points in the wire to make the wires a straight line
  
    if (conflictCells.length > 0) {
      for (const conflictCell of conflictCells) {
        const { row, col, index } = conflictCell;
        const conflictingWireId = cellWireMap.get(`${row},${col}`);
        
        // get the total path of the wire
        const wirePath = findWirePathInTracker(wireTracker, conflictingWireId)
        // e.g., wirePath = [ [r0, c0], [r1, c1], [r2, c2], ...]
  
        // find the index of the wire in the wirePath
        const conflictIndex = wirePath.findIndex(([r, c]) => r === row && c === col);
        // if conflict index exists OR more than or equals the length of wirePath.length
        if (conflictIndex < 0 || conflictIndex >= wirePath.length - 1) {
          // Edge case: conflict at the last cell of the path
          continue;
        }
  
        // GET THE DIRECTION OF CONFLICTING WIRE
        // compare the conflict cell with the *next* cell in that wirepath
        // as the next path should also have the same X or Y axis if its in a straight line
        const [nextRow, nextCol] = wirePath[conflictIndex + 1] // but what if there is no next index
        
        let direction;
        if (row === nextRow && col !== nextCol){
          direction = 'horizontal';
        } else if (col === nextCol && row !== nextRow){
          direction = 'vertical';
        } else {
          direction = 'corner'  // set the direction to 'corner' if it is 
        }
  
        // adjust the wire path accordingly
        if (direction === 'vertical') {
          // shift horizontally
          // increase X
          // Because gridCoords are row/col, row = Y , col = X
          for (let i = index; i < pixelCoords.length; i++) {
            const [px, py] = pixelCoords[i]; // px = pixel x , py = pixel y
            const [gx, gy] = gridCoords[i]; // gx = grid x , gy = grid y
  
            pixelCoords[i] = [px + gridSizeConst, py];
            gridCoords[i] = [gx + 1, gy]
  
          }
        } else if (direction === 'horizontal') {
          // shift vertically
          for (let i = index; i < pixelCoords.length; i++) {
            const [px, py] = pixelCoords[i]; // px = pixel x , py = pixel y
            const [gx, gy] = gridCoords[i]; // gx = grid x , gy = grid y
  
            pixelCoords[i] = [px , py + gridSizeConst];
            gridCoords[i] = [gx , gy + 1]
  
          }
        } else if (direction === 'corner'){
          //shift both horizontally and vertically
          for (let i = index; i < pixelCoords.length; i++) {
            const [px, py] = pixelCoords[i]; // px = pixel x , py = pixel y
            const [gx, gy] = gridCoords[i]; // gx = grid x , gy = grid y
  
            pixelCoords[i] = [px + gridSizeConst , py + gridSizeConst];
            gridCoords[i] = [gx + 1 , gy + 1]
  
          }
        }
      }
    }
    return [pixelCoords, gridCoords];
  }

function findWirePathInTracker(wireTracker, wireId) {
// wireTracker is an object where each property is an array of wire objects
for (const destinationKey of Object.keys(wireTracker)) {
    for (const wire of wireTracker[destinationKey]) {
    if (wire.someUniqueId === wireId) {
        // Return the wire's gridCoords (or the entire wire object)
        return wire.gridCoords;
    }
    }
}

// If no wire is found, return an empty array or null
console.error("no wire is found for the following wireID:", wireId);
return [];
}

  