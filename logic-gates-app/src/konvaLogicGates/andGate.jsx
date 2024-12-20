import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../utils/gridSize';
import React, { useEffect, useRef } from 'react';

export function AndGate({ gate, selectedGateId, setSelectedGateId, onWirePositionUpdate }){
    const andGatePath = `
          M 75,50 
          Q 75,0 0,0 
          Q 0,25 0,50 
          Q 0,75 0,100 
          Q 75,100 75,50
          Z
        `;
    
    // Define start and end points for the input wires
    const startX = gate.x * gridSizeConst; // Input wires will start at x = gate.x
    const startY = gate.y * gridSizeConst;
    const endX = gate.x*gridSizeConst + 0; // This is the edge of the OR gate at x = 0
    const endYTop = gate.y*gridSizeConst; // Top point of the input segment (0, 0)
    const endYBottom = gate.y*gridSizeConst + 100; // Bottom point of the input segment (0, 100)
    const numInputs = gate.numInputs;

    // Calculate interval between input points
    const interval = (endYBottom - endYTop) / (numInputs + 1);

    // Generate input wires
    const inputWires = [];
    const inputPositions = [];
    for (let i = 1; i <= numInputs; i++) {
        const wireY = endYTop + interval * i; // The top of the gate + the (interval * how many times) 
        inputPositions.push({inputName: gate.inputs[i-1], x: startX - 20, y: wireY}) // set the coordinates of input wire
        // ************* NOTE : the startX and endX for ANDGate is switched , the start of the line starts from the gate extending out from the gate
        inputWires.push(
        
            <Line
                key={`${gate.id}-w${i}`} // (e.g. GateID - w1) first wire
                points={[startX - 20, wireY, endX, wireY]} // Coordinates for the line
                stroke="black"
                strokeWidth={2}
            />,
            <Text //Text to label the inputs
                key={`${gate.id}-input${i}`}
                x={startX-20}
                y={wireY - 15}
                text={`${gate.inputs[i-1]}`}
                fill="black"
            />
        
        );
    }

    const outputPosition = [];
    // Generate output wire
    outputPosition.push({outputName: gate.output, x: startX + 75, y: endYTop + 50}) // set the coordinates of output wire
    const outputwire =(
        <>
        <Line
            key={`${gate.id}-w-output`}
            points={[ startX + 75, endYTop + 50, startX + 100, endYTop + 50]} // Coordinates for the line
            stroke="black"
            strokeWidth={2}                           
        />
        <Text   //Text to label the outputs
                key={`${gate.id}-output-wire`}
                x={startX + 90}
                y={endYTop + 35}
                text={`${gate.output}`}
                fill="black"
            />
        </>
)
    const prevPositions = useRef({}); // Holds the previous positions to compare
    // Pass positions back to parent through a callback
    React.useEffect(() => {
        const newPositions = { inputPositions, outputPosition };
        // Compare previous positions with new ones to avoid unnecessary updates
    if (JSON.stringify(prevPositions.current) !== JSON.stringify(newPositions)) {

        onWirePositionUpdate(gate.id, newPositions);

        prevPositions.current = newPositions; // Update the previous positions
      }
    }, [gate.id, inputPositions, outputPosition, onWirePositionUpdate]);
    

    /* 
    Data format of the onWirePositionUpdate function
    [gate.id]: {
        inputPositions: [
        { inputName: "A", x: 50, y: 75 },
        { inputName: "B", x: 50, y: 125 }
        ],
        outputPosition: { outputName: "C", x: 150, y: 100 }
    }
    
  */
    return(
    <>
        <Path
        x={gate.x * gridSizeConst}
        y={gate.y * gridSizeConst}
        data={andGatePath}
        stroke="black"
        strokeWidth={2}
        fill={selectedGateId === gate.id ? "orange" : "lightblue"}
        onClick={() => setSelectedGateId(gate.id)}
        />
        {inputWires}
        {outputwire}
        <Text
                x={gate.x * gridSizeConst + 5}
                y={gate.y * gridSizeConst + 45}
                text={`${gate.name} (${gate.type})`}
                fill="black"
                onClick={() => setSelectedGateId(gate.id)} // Set as selected when clicked
        />

    </>
    )
}

