import React, {useEffect, useContext} from 'react';
import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../../utils/gridSize';
import {getDetourPath} from './get_Detour_path';
import { detectConflict } from './detectConflict';
import { cleanUpWires } from './cleanUp_wires';
import { ConnectionsContext } from '../../context/ConnectionsContext';
import { GatesContext } from '../../context/GatesContext';
import { GatesPositionContext } from '../../context/GatesPositionContext';

export function CreateConnections({selectedGateId, setSelectedGateId}){

   
    /*
        ARGS:

            gatePositions: contains the object of 
            [gate.id]: {
                inputPositions: [
                { inputName: "A", x: 50, y: 75 },
                { inputName: "B", x: 50, y: 125 }
                ],
                outputPosition: { outputName: "C", x: 150, y: 100 }
            }


            gates: contains the information of the gate name, type, input, output, x and y

            selectedGateId: the variable that contains the selected gate ID.
    */
    
    const { gates } = useContext(GatesContext);
    const { connections, setConnections } = useContext(ConnectionsContext);
    const { gatePositions} = useContext(GatesPositionContext);

    console.log({gatePositions})
    console.log("Gate Positions:", gatePositions);

    const gatesArray = Object.entries(gatePositions).filter(
        ([gateID]) => gateID !== selectedGateId
      ); // Exclude the deleted gate's connections
      //console.log("Derived gatesArray:", gatesArray); // Log gatesArray to ensure correctness
    // Make a reversed copy
    const reversedGatesArray = [...gatesArray].reverse();

    const allOutputs = [];
    for (const [gateID, positions] of gatesArray) {
      const { outputPosition } = positions;
      if (Array.isArray(outputPosition)) {
        for (const output of outputPosition) {
          allOutputs.push({
            gateID,
            outputName: output.outputName,
            x: output.x,
            y: output.y
          });
        }
      }
    }
    const pastOutputs = []; // Array to store past gates' outputs
    const wireTracker = {}; // Tracker to store wire locations and their end destinations
    const tempConnections = {}; // store newly computed wires in local object

    useEffect(() => {
      // Clean up if needed
      const cleaned = cleanUpWires(connections);
  
      // Compare cleaned with existing
      if (JSON.stringify(cleaned) !== JSON.stringify(connections)) {
        setConnections(cleaned);
        console.log("Updated connections with newly built wires.");
      }
    }, [tempConnections, connections, setConnections]);

    return(
        <>
        {reversedGatesArray.map(([gateID, positions]) =>{
            
            const reversedInputs = [...positions.inputPositions].reverse();
            
            const wireElements = reversedInputs.map((inputPosition) => {
               const matchingOutput = allOutputs.find(
                (output) => output.outputName === inputPosition.inputName); 
                
                if (
                    matchingOutput &&
                    matchingOutput.gateID !== selectedGateId && // Skip if the output gate is the deleted gate
                    gateID !== selectedGateId // Skip if the input gate is the deleted gate
                  ){
                    // Group wires by end destination
                    const endDestinationKey = inputPosition.inputName;
                    console.log(`Wire key: wire-${matchingOutput.gateID}-${gateID}-${inputPosition.inputName}`);
                    // Calculate the wire path with obstruction checks
                    const wireKey = `wire-${matchingOutput.gateID}-${gateID}-${inputPosition.inputName}`;
                    const pathResult = getDetourPath( // gridCoords is the current wires grid points
                        { x: matchingOutput.x, y: matchingOutput.y },
                        { x: inputPosition.x, y: inputPosition.y },
                        gates,
                        window.innerWidth,
                        window.innerHeight,
                        wireTracker,
                        endDestinationKey
                    );

                    console.log("pathResult:", pathResult); // Preferred


                    const { pixelCoordinates, gridCoordinates } = convertDetourPathToGridRowsCols(
                      pathResult
                    );

                    // Save wire data in tempConnections
                    tempConnections[wireKey] = { pixelCoordinates, gridCoordinates };
                    

                    if (!wireTracker[endDestinationKey]) { // If the array item does not exist yet,
                        wireTracker[endDestinationKey] = []; //Create the array item as an empty array
                    }

                    // let pixelCoords = [...pixelCoordinates];
                    // console.log(`the gridCoords are: ${gridCoordinates}`)
                    // const [newpixelCoords, newGridCoords] = detectConflict(gridCoordinates, wireTracker, pixelCoords, endDestinationKey)

                    // // Update the variables with the returned values
                    // pixelCoords = newpixelCoords;
                    // console.log(`pixelCoords = `, pixelCoords)
                    // const gridCoords = newGridCoords;

                    const flattenedpixelCoords = rowsColsToXyPairs(pixelCoordinates);
                    console.log("Flattened Adjusted Path:", flattenedpixelCoords , 'for input:', endDestinationKey);

                    // Store the adjusted path in the wire tracker
                    wireTracker[endDestinationKey].push({ pixelCoordinates, gridCoordinates });
                    

                    
                    return(
                        <Line                                   //Draw the line from the respective gate output to current input
                            key={wireKey}
                            points={flattenedpixelCoords} // This is obtained from the getDetourPath function

                            stroke={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? "red" : "black"} // Highlight wires of selected gate
                            strokeWidth={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? 3 : 2}     // Increase width for selected wires
  
                        />
                    );
                }
                return null; // If there is no matchingOutput,  no line.
            });


            // create checks for other wires along the way
            // create checks for other gates along the way
            // Render connections for this gate
            return <React.Fragment key={`connections-${gateID}`}>{wireElements}</React.Fragment>;
        })}

        </>
    );
    
}

/**
 * Takes the object returned by getDetourPath:
 *   {
 *     pixelCoords: [x1, y1, x2, y2, ...],
 *     gridCoords:  [x1, y1, x2, y2, ...]  // may be undefined or empty
 *   }
 * 
 * And returns an object like:
 *   {
 *     pixelAsGrid: [ [r1, c1], [r2, c2], ... ],
 *     gridAsGrid:  [ [r1, c1], [r2, c2], ... ]  // or []
 *   }
 * 
 * Where [r, c] = [Math.floor(y / gridSizeConst), Math.floor(x / gridSizeConst)].
 */
function convertDetourPathToGridRowsCols(detourPathResult) {
  if (!detourPathResult) return null;

  const { flattened: pixelCoords, allGridPoints: gridCoords } = detourPathResult;

  // 1. Convert pixelCoords -> [r, c]
  const pixelCoordinates = pixelCoords ? xyPairsToRowsCols(pixelCoords) : [];

  // 2. Use gridCoords directly (no conversion needed)
  const gridCoordinates = gridCoords || [];

  return { pixelCoordinates, gridCoordinates };
}


/**
 * Converts an array like [x1, y1, x2, y2, ...] 
 * into [ [row1, col1], [row2, col2], ... ]
 */

function xyPairsToRowsCols(xyArray) {
  if (!xyArray || xyArray.length < 2) return [];
  const out = [];
  
  for (let i = 0; i < xyArray.length; i += 2) {
    const x = xyArray[i];
    const y = xyArray[i + 1];
    
    out.push([y, x]);
  }

  return out;
}

function rowsColsToXyPairs(rowsColsArray) {
  if (!rowsColsArray || rowsColsArray.length === 0) return [];
  const flattened = [];
  
  for (const [y, x] of rowsColsArray) {
    flattened.push(x, y);
  }
  
  return flattened;
}