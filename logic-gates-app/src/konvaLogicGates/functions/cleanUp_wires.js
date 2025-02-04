export function cleanUpWires(connections) {
  console.log("Connections before cleanup:", JSON.stringify(connections));
  // Create a shallow copy of the connections
  const updatedConnections = { ...connections };

  // 1) Identify unique end-destinations (based on your key naming convention)
  const uniqueEndDestinationKeys = new Set(
    Object.keys(connections).map((key) => key.split("-").pop())
  );
  console.log("Unique endDestinationKeys:", uniqueEndDestinationKeys);

  // Process each destination separately
  uniqueEndDestinationKeys.forEach((endDestinationKey) => {
    // For each destination, extract both grid and pixel coordinates.
    const wires = Object.entries(connections)
      .filter(([key]) => key.split("-").pop() === endDestinationKey)
      .map(([key, { gridPath, pixelCoordinates }]) => ({
        wireKey: key,
        gridCoords: gridPath || [],
        // Convert flattened pixelCoordinates into an array of [x, y] pairs.
        pixelCoords: pixelCoordinates || []
      }));

    console.log(`Wires for destination "${endDestinationKey}":`, JSON.stringify(wires));
    
    // Array to hold reference wires (which should not be trimmed)
    const referenceWires = [];

    // Process each wire in order
    wires.forEach((wire) => {
      let { wireKey, gridCoords: currGridCoords, pixelCoords: currPixelCoords } = wire;
      console.log("currPixelCoords snapshot:", JSON.stringify(currPixelCoords));
      // If this wire is already a reference, skip further processing.
      if (updatedConnections[wireKey].isReference) {
        console.log(`Skipping trimming for already referenced wire "${wireKey}".`);
        return;
      }

      // Compare with each reference wire using grid coordinates for conflict detection.
      referenceWires.forEach((refWire) => {
        const refGridCoords = refWire.gridCoords;

        // Check for overlapping grid coordinates (skip first and last points)
        for (let k = 1; k < currGridCoords.length - 1; k++) {
          const [currRow, currCol] = currGridCoords[k];

          // Find a matching coordinate in the reference wire's grid coordinates
          console.log('refGridCoords =', refGridCoords)
          console.log('currRow =', currRow)
          console.log('currCol =', currCol)
          const matchIndex = findLastIndex(refGridCoords, ([r, c]) => r === currRow && c === currCol);
          console.log('matchindex:', matchIndex)
          if (matchIndex > 0 && matchIndex < refGridCoords.length - 1 ) {
            console.log(
              `Trimming "${wireKey}" at grid coordinate index ${k} due to conflict with reference wire "${refWire.wireKey}"`
            );
            
            console.log('currentGridCoords=', currGridCoords)
            // Trim both grid and pixel coordinates from index k onward.
            if (k >= 1 && k < currGridCoords.length) {
              currGridCoords = currGridCoords.slice(k);
              currPixelCoords = currPixelCoords.slice(k);
            }
            // Update the corresponding connection: gridPath remain as an array of pairs,
            // and pixelCoordinates are converted back into the flattened format.
            updatedConnections[wireKey].gridPath = currGridCoords;
            console.log('currpixelcoords =', currPixelCoords)
            
            updatedConnections[wireKey].pixelCoordinates = currPixelCoords;

            console.log('updatedConnections[wireKey].pixelCoordinates =', updatedConnections[wireKey].pixelCoordinates)
            break; // Once a conflict is found and processed, exit the inner loop.
          }
        }
      });

      // If after trimming (or if no trimming occurred) the wire still has more than one coordinate,
      // mark it as a reference wire.
      if (currGridCoords.length > 1) {
        updatedConnections[wireKey].isReference = true;
        referenceWires.push({
          wireKey,
          gridCoords: currGridCoords,
          pixelCoords: currPixelCoords,
        });
        console.log(`Wire "${wireKey}" has become (or remained) a reference wire.`);
      } else {
        console.log(`Wire "${wireKey}" is too short after trimming, ignoring.`);
      }
    });
  });

  console.log("Connections after cleanup:", updatedConnections);
  return updatedConnections;
}

function findLastIndex(array, predicate) {
  for (let i = array.length - 1; i >= 0; i--) {
    if (predicate(array[i], i, array)) {
      return i;
    }
  }
  return -1;
}

// Helper: Convert flattened pixelCoordinates into an array of [x, y] pairs.
function convertFlattenedToPairs(flatArray) {
  console.log("convertFlattenedToPairs received:", JSON.stringify(flatArray));
  const pairs = [];
  for (let i = 0; i < flatArray.length; i += 2) {
    pairs.push([flatArray[i], flatArray[i + 1]]);
  }
  return pairs;
}

// Helper: Convert an array of [x, y] pairs back into a flattened array.
function flattenPairs(pairs) {
  return pairs.reduce((acc, pair) => acc.concat(pair), []);
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