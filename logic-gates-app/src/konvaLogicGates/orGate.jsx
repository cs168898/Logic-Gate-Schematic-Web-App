import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Path, Text, Line } from 'react-konva';
import { gridSizeConst } from '../utils/gridSize';

export function OrGate({ gate, selectedGateId, setSelectedGateId, onWirePositionUpdate }){
    const orGatePath = `
          M 100,50 
          Q 75,0 0,0 
          Q 20,25 20,50 
          Q 20,75 0,100 
          Q 75,100 100,50
          Z
        `;
    // Define start and end points for the input wires
    const startX = gate.x * gridSizeConst; // Input wires will start at x = gate.x
    const startY = gate.y;
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
        const wireY = endYTop + interval * i;
        inputPositions.push({inputName: gate.inputs[i-1], x: endX, y: wireY})
        inputWires.push(
        <Line
            key={`${gate.id}-w${i}`} // (e.g. GateID - w1) first wire
            points={[startX, wireY, endX+19, wireY]} // Coordinates for the line
            stroke="black"
            strokeWidth={2}
        />,
                <Text //Text to label the inputs
                key={`${gate.id}-input${i}`}
                x={endX}
                y={wireY - 15}
                text={`${gate.inputs[i-1]}`}
                fill="black"
                />
        );
    }
    // Generate output wire
    const outputPosition = [];
    outputPosition.push = [{outputName: gate.output, x: startX + 120, y: endYTop + 50}] // set the coordinates of output wire
    const outputwire =
    <>
     <Line
         key={`${gate.id}-w-output`}
         points={[ startX + 100, endYTop + 50, startX + 120, endYTop + 50]} // Coordinates for the line
         stroke="black"
         strokeWidth={2}                           
    />
     <Text   //Text to label the outputs
             key={`${gate.id}-output-wire`}
             x={startX + 120}
             y={endYTop + 35}
             text={`${gate.output}`}
             fill="black"
    />
    </>
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
    
    return(
    <>
        <Path
        x={gate.x * gridSizeConst}
        y={gate.y * gridSizeConst}
        data={orGatePath}
        stroke="black"
        strokeWidth={2}
        fill={selectedGateId === gate.id ? "orange" : "lightblue"}
        onClick={() => setSelectedGateId(gate.id)}
        />

        {/* Draw input wires */}
        {inputWires}
        {outputwire}

        <Text
                x={gate.x * gridSizeConst + 30}
                y={gate.y * gridSizeConst + 45}
                text={`${gate.name} (${gate.type})`}
                fill="black"
                onClick={() => setSelectedGateId(gate.id)} // Set as selected when clicked
        />

    </>
    )
}

