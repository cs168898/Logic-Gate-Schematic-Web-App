import React from 'react';
import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../utils/gridSize';

export function AndGate({ gate, selectedGateId, setSelectedGateId }){
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
    for (let i = 1; i <= numInputs; i++) {
        const wireY = endYTop + interval * i;
        inputWires.push(
        <Line
            key={`${gate.id}-w${i}`} // (e.g. GateID - w1) first wire
            points={[startX - 20, wireY, endX, wireY]} // Coordinates for the line
            stroke="black"
            strokeWidth={2}
        />
        );
    }

    // Generate output wire
    const outputwire =
    <Line
        key={`${gate.id}-w-output`}
        points={[ startX + 75, endYTop + 50, startX + 100, endYTop + 50]} // Coordinates for the line
        stroke="black"
        strokeWidth={2}                           
    />
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

