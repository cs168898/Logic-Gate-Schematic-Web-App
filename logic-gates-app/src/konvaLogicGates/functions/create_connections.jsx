import React from 'react';
import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../../utils/gridSize';
import {getDetourPath} from './get_Detour_path';


export function CreateConnections({ gatePositions, selectedGateId, setSelectedGateId, gates }){
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
    
    console.log({gatePositions})
    console.log("Gate Positions:", gatePositions);

    const gatesArray = Object.entries(gatePositions).filter(
        ([gateID]) => gateID !== selectedGateId
      ); // Exclude the deleted gate's connections
      //console.log("Derived gatesArray:", gatesArray); // Log gatesArray to ensure correctness

    const pastOutputs = []; // Array to store past gates' outputs

    return(
        <>
        {gatesArray.map(([gateID, positions]) =>{
            console.log(`the current position variable in gatesArray.map is: ${positions}`, positions)
            const { inputPositions, outputPosition } = positions; // The inputPositions and outputPositions variables contain the current I/O positions
            // Ensure outputPosition is processed correctly (handle arrays)
            if (Array.isArray(outputPosition) && outputPosition.length > 0) {
                outputPosition.forEach((output) => {
                    if (gateID !== selectedGateId) { // Skip adding outputs from the deleted gate
                        pastOutputs.push({
                            gateID,
                            outputName: output.outputName, // Access properties of each output
                            x: output.x,                       // Store the coordinates of current output for future inputs
                            y: output.y,
                        });
                    }
                });
            }
            console.log("the past outputs array contain:", pastOutputs)
            console.log(`the input and output positions variable is: ${inputPositions, outputPosition}`)
            const connections = inputPositions.map((inputPosition) => {
               const matchingOutput = pastOutputs.find(
                (output) => output.outputName === inputPosition.inputName); 
                
                if (
                    matchingOutput &&
                    matchingOutput.gateID !== selectedGateId && // Skip if the output gate is the deleted gate
                    gateID !== selectedGateId // Skip if the input gate is the deleted gate
                  ){
                    console.log(`Wire key: wire-${matchingOutput.gateID}-${gateID}-${inputPosition.inputName}`);
                    console.log(`Matchingoutput has value: ${matchingOutput}` );
                    console.log(`The selected gate id is: ${selectedGateId}`);
                    // Calculate the wire path with obstruction checks
                    const wirePath = getDetourPath(
                        { x: matchingOutput.x, y: matchingOutput.y },
                        { x: inputPosition.x, y: inputPosition.y },
                        gates, // Pass the gates array to check for obstructions
                        window.innerWidth,
                        window.innerHeight
                    );
                    return(
                        <Line                                   //Draw the line from the respective gate output to current input
                            key={`wire-${matchingOutput.gateID}-${gateID}-${inputPosition.inputName}`}

                            points={wirePath} // This is obtained from the getDetourPath function

                            stroke={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? "red" : "black"} // Highlight wires of selected gate
                            strokeWidth={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? 3 : 2}     // Increase width for selected wires
  
                        />
                    );
                }
                return null; // If there is no matchingOutput,  no line.
            }).filter((line) => line !== null); // Ensure null values are filtered out to ensure that deleted gates are not recorded anymore

            // create checks for other wires along the way
            // create checks for other gates along the way
            // Render connections for this gate
            return <React.Fragment key={`connections-${gateID}`}>{connections}</React.Fragment>;
        })}

        </>
    )
}