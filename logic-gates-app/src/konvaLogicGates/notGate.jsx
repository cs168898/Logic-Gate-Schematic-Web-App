import React, { useEffect, useRef } from 'react';
import { Stage, Layer, Path, Text, Circle, Line } from 'react-konva';
import { gridSizeConst } from '../utils/gridSize';

export function NotGate({ gate, selectedGateId, setSelectedGateId, onWirePositionUpdate }){
    const notGatePath = `
          M 100,50 
          L 0,0
          L 0,100
          Z
        `;

    // Circle properties for the NOT gate bubble
    const circleRadius = 5; // The radius of the circle
    const circleX = gate.x *gridSizeConst + 105; // X position (a bit outside of the triangle tip)
    const circleY = gate.y *gridSizeConst + 50;  // Y position (aligned with the middle of the triangle)

    // Define start and end points for the input wires
    const startX = gate.x * gridSizeConst; // Input wires will start at x = gate.x
    const startY = gate.y;
    const endX = gate.x*gridSizeConst -20; // This is the edge of the OR gate at x = 0
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
            points={[startX , wireY, endX, wireY]} // Coordinates for the line
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
    outputPosition.push = [{outputName: gate.output, x: circleX + 20, y: circleY}] // set the coordinates of output wire
    const outputwire =(
    <>
    <Line
        key={`${gate.id}-w-output`}
        points={[ circleX + 5, circleY, circleX + 20 , circleY]} // Coordinates for the line
        stroke="black"
        strokeWidth={2}                           
    />
    <Text   //Text to label the outputs
        key={`${gate.id}-output-wire`}
        x={circleX + 20}
        y={circleY - 15}
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
    
    return(
    <>
        <Path
        x={gate.x * gridSizeConst}
        y={gate.y * gridSizeConst}
        data={notGatePath}
        stroke="black"
        strokeWidth={2}
        fill={selectedGateId === gate.id ? "orange" : "lightblue"}
        onClick={() => setSelectedGateId(gate.id)}
        />
        {/* Draw the bubble/circle at the tip of the NOT gate */}
        <Circle
            x={circleX} // Position based on the triangle tip (adding a bit to x)
            y={circleY} // Align with the middle of the triangle
            radius={circleRadius} // Radius of the circle
            stroke="black" // Outline color of the circle
            strokeWidth={2}
            fill={selectedGateId === gate.id ? "orange" : "lightblue"} // Same fill as the triangle
            onClick={() => setSelectedGateId(gate.id)} // Set as selected when clicked
        />
        {inputWires}
        {outputwire}
        <Text
                x={gate.x * gridSizeConst + 10}
                y={gate.y * gridSizeConst + 45}
                text={`${gate.name} (${gate.type})`}
                fill="black"
                onClick={() => setSelectedGateId(gate.id)} // Set as selected when clicked
        />

    </>
    )
}

