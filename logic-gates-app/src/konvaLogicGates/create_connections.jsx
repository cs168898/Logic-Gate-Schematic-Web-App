import React from 'react';
import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../utils/gridSize';


export function CreateConnections({ gatePositions, selectedGateId, setSelectedGateId }){
    
    console.log({gatePositions})
    console.log("Gate Positions:", gatePositions);

    const gatesArray = Object.entries(gatePositions) //Convert the gatePositions object into an array for iteration
    console.log("Derived gatesArray:", gatesArray); // Log gatesArray to ensure correctness

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
                
                if (matchingOutput && matchingOutput.gateID !== selectedGateId){
                    console.log(`Matchingoutput has value: ${matchingOutput}` );
                    return(
                        <Line                                   //Draw the line from the respective gate output to current input
                            key={`wire-${matchingOutput.gateID}-${gateID}-${inputPosition.inputName}`}

                            points={[
                            matchingOutput.x, matchingOutput.y, // Start point: matching output
                            inputPosition.x, inputPosition.y  // End point: current input
                            ]}

                            stroke={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? "red" : "black"} // Highlight wires of selected gate
                            strokeWidth={
                                selectedGateId === gateID || selectedGateId === matchingOutput.gateID ? 3 : 2}     // Increase width for selected wires
                            onClick={() => setSelectedGateId(gateID)}           // Set the selected gate
  
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