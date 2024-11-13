// LogicGateCanvas.js
import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

function LogicGateCanvas({ gate }) {
  // Define default properties if no gate data is passed
  console.log('logicgatecanvashere')
  const { name = "Default Gate", type = "AND", x = 50, y = 20 } = gate || {};

  return (
  
    <Stage width={window.innerWidth} height={window.innerHeight} className='konvajs-container'>
      <Layer>
        {/* Draw a rectangle to represent the gate */}
        <Rect
          x={x * 20}  // The x position of the gate on the canvas
          y={y * 20}  // The y position of the gate on the canvas
          width={100}  // Gate width
          height={50}  // Gate height
          fill="lightblue"  // Gate fill color
        />
        {/* Draw the gate label */}
        <Text
          x={x*20 + 10}  // Slightly offset from the rectangle
          y={y*20 + 15}
          text={`${name} (${type})`}
          fill="black"  // Text color
        />
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
