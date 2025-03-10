import React, { useEffect, useContext, useMemo } from 'react';
import { gridSizeConst } from '../../utils/gridSize';
import { Layer, Line } from 'react-konva';
import { getDetourPath } from './get_Detour_path';
import { cleanUpWires } from './cleanUp_wires';
import { ConnectionsContext } from '../../context/ConnectionsContext';
import { GatesContext } from '../../context/GatesContext';
import { GatesPositionContext } from '../../context/GatesPositionContext';

/**
 * Creates the wires for all gates except the selected/deleted gate.
 */
export function CreateConnections({ selectedGateId, setSelectedGateId }) {
  const { gates } = useContext(GatesContext);
  const { connections, setConnections } = useContext(ConnectionsContext);
  const { gatePositions } = useContext(GatesPositionContext);
  
  // Filter gates except the selected (deleted) one
  const gatesArray = gates.filter(gate => gate.id !== selectedGateId);


  // Reverse the gatesArray to iterate in reverse order
  const reversedGatesArray = [...gatesArray];
  // Build a quick list of all outputs
  const allOutputs = [];
  for (const gate of reversedGatesArray) {
    const positions = gatePositions[gate.id];
    if (positions && Array.isArray(positions.outputPosition)) {
      for (const output of positions.outputPosition) {
        allOutputs.push({
          gateID: gate.id,
          outputName: output.outputName,
          x: output.x,
          y: output.y
        });
      }
    }
  }

  // Build a quick list of all inputs
  const allInputs = [];
  for (const gate of reversedGatesArray) {
    const positions = gatePositions[gate.id];
    if (positions && Array.isArray(positions.inputPositions)) {
      for (const input of positions.inputPositions) {
        allInputs.push({
          gateID: gate.id,
          inputName: input.inputName,
          x: input.x,
          y: input.y
        });
      }
    }
  }

  // Combine all input and output positions into a single array
  const allInputOutputPositions = [...allOutputs, ...allInputs];
  // Data format: [{ gateID, outputName/inputName, x, y }, ...]

  /**
   * 1) Build local wires in memory.
   */
  const localWires = useMemo(() => {
    const wireTracker = {};
    const wiresObj = {};

    for (const gate of reversedGatesArray) {
      const positions = gatePositions[gate.id];
      if (!positions) continue;

      const { inputPositions } = positions;
      // Reverse inputs to iterate in reverse order
      const reversedInputs = [...inputPositions].reverse();

      reversedInputs.forEach((inputPosition) => {
        const matchingOutput = allOutputs.find(
          (output) => output.outputName === inputPosition.inputName
        );
        if (
          matchingOutput &&
          matchingOutput.gateID !== selectedGateId &&
          gate.id !== selectedGateId
        ) {
          const wireKey = `wire-${+matchingOutput.gateID + 1}-${+gate.id + 1}-${inputPosition.inputName}`;

          const pathResult = getDetourPath(
            { x: matchingOutput.x, y: matchingOutput.y },
            { x: inputPosition.x, y: inputPosition.y },
            gates,
            window.innerWidth,
            window.innerHeight,
            wireTracker,
            inputPosition.inputName,
            allInputOutputPositions
          );

          if (pathResult && pathResult.screenPath) {
            const { screenPath: pixelCoords, allGridPoints: gridCoords, gridPath: gridPath } = pathResult;
      

            if (!Array.isArray(pixelCoords) || pixelCoords.some(p => p === undefined)) {
              console.error(`❌ Detected undefined inside pixelCoords BEFORE storing for ${wireKey}:`, pixelCoords);
            }

  
            const clonedPixelCoords = pixelCoords.map(pair => [...pair]);
            const clonedGridCoords = gridCoords.map(pair => [...pair]);
            const clonedGridPath = gridPath.map(pair => [...pair]);
            

            wiresObj[wireKey] = {
              pixelCoordinates: clonedPixelCoords,
              gridCoordinates: clonedGridCoords,
              gridPath: clonedGridPath
            };
   


            if (!wireTracker[inputPosition.inputName]) {
              wireTracker[inputPosition.inputName] = [];
            }
            wireTracker[inputPosition.inputName].push({
              pixelCoordinates: clonedPixelCoords,
              gridCoordinates: clonedGridCoords,
              gridPath: clonedGridPath
            });
          } else {
            console.warn(`Missing pathResult for wire ${wireKey}`);
          }
        }
      });
    }

    return wiresObj;
  }, [gates, gatePositions, selectedGateId, allInputOutputPositions]);


  /**
   * 2) Clean up wires if needed.
   */
  const cleanedWires = useMemo(() => {
    return cleanUpWires(localWires);
  }, [localWires]);

  /**
   * 3) If cleaned wires differ from context, update context once.
   */
  useEffect(() => {
    if (!areSame(cleanedWires, connections)) {
      console.log('connections are not the same, therefore setting connetions');
      setConnections(cleanedWires);
    }
  }, [cleanedWires]);

  /**
   * 4) Convert cleaned wires to <Line> elements for rendering.
   */
  const lineElements = Object.entries(cleanedWires).map(([wireKey, wireData]) => {
    let { pixelCoordinates } = wireData;

    //pixelCoordinates = simplifyPathCustom(pixelCoordinates);

    // Ensure pixelCoordinates are defined and flattened into a single array of numbers
    const flattenedPoints = (pixelCoordinates || []).flatMap(([x, y]) => [x, y]);

    return (
      <Line
        key={wireKey}
        points={flattenedPoints}
        stroke="black"
        strokeWidth={2}
      />
    );
  });

  /**
   * 5) Render final lines
   */
  return <>{lineElements}</>;
}

// Compare helper
function areSame(obj1, obj2) {
  if (obj1 === obj2) return true;
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

function simplifyPathCustom(points) {
  if (!points || points.length <= 2) return points;

  const first = points[0];
  const last = points[points.length - 1];

  // Case 1: Entire path is a straight horizontal or vertical line.
  if (first[0] === last[0] || first[1] === last[1]) {
    return [first, last];
  }

  // Case 2: Process segments. In grid paths the moves are usually purely horizontal or vertical.
  const simplified = [];
  let i = 0;
  while (i < points.length) {
    // Always add the current point (start of a segment)
    simplified.push(points[i]);
    
    // Determine axis of motion between points[i] and points[i+1]
    if (i === points.length - 1) break; // last point reached
    const [x0, y0] = points[i];
    const [x1, y1] = points[i + 1];
    let axis = null;
    if (x0 !== x1 && Math.abs(y1 - y0) < gridSizeConst) {
      axis = 'x'; // horizontal move: y constant
    } else if (y0 !== y1 && Math.abs(x1 - x0) < gridSizeConst) {
      axis = 'y'; // vertical move: x constant
    }
    // If axis is not determined (e.g. a diagonal or duplicate point) just move on.
    if (!axis) {
      i++;
      continue;
    }

    // Look ahead until the axis changes.
    let j = i + 1;
    while (j < points.length) {
      if (axis === 'x') {
        // In a horizontal move the y must remain constant.
        if (Math.abs(points[j][1] - y0) < gridSizeConst) break;
      } else if (axis === 'y') {
        // In a vertical move the x must remain constant.
        if (Math.abs(points[j][0] - x0) < gridSizeConst) break;
      }
      j++; // j is the counter to look infront and will break when it meets the last point
    }
    // j is now the first index where the axis changes (or j === points.length).
    // We want to keep the last point of the current straight segment.
    // (It might be that j-1 is equal to i, in which case nothing extra is added.)
    if (j - 1 > i) {  // just to do a check to make sure that they are not equal and point j is still within range of i
      if (axis === 'x') {
        points[i][0] = points[j - 1][0]; // ✅ Match start X to last X
      } else if (axis === 'y') {
        points[i][1] = points[j - 1][1]; // ✅ Match start Y to last Y
      }
      simplified.push(points[j - 1]);
    }
    i = j - 1; // Continue from the last point of the current segment.
    // If not at the end, move one step forward.
    if (i < points.length - 1) {
      i++;
    }
  }

  // Ensure that the very last point is present.
  
  const finalPoint = points[points.length - 1]; // this is the original last point
  const lastSimplified = simplified[simplified.length - 1]; // this is the simplified last point

  if (lastSimplified[0] !== finalPoint[0] || lastSimplified[1] !== finalPoint[1]) { // ensure that the original last point is present
    simplified.push(finalPoint);
  }
  return simplified;
}