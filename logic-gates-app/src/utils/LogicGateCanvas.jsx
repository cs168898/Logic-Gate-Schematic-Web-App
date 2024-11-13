// LogicGateCanvas.js
import React from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { AndGate } from '../konvaLogicGates/andGate';
import { OrGate } from '../konvaLogicGates/orGate';
import { NotGate } from '../konvaLogicGates/notGate';

function LogicGateCanvas({ gates, setSelectedGateId, selectedGateId }) {
  // Define default properties if no gate data is passed
  console.log('logicgatecanvashere')
  
  return (
  
    <Stage 
    width={window.innerWidth} 
    height={window.innerHeight} 
    className='konvajs-container'
    onClick={(e) => {
      // Check if the click is on the stage itself (not on any shape)
      if (e.target === e.target.getStage()) {
        setSelectedGateId(null); // Deselect the gate when clicking on the background
      }
    }}
  >
      <Layer>
        {gates.map((gate) => (
            <React.Fragment key={gate.id}>
              {/* Render gate shape based on type */}
        
              {gate.type.toUpperCase() === "AND" && (
                <AndGate
                gate={gate}
                selectedGateId={selectedGateId}
                setSelectedGateId={setSelectedGateId}
              />
              )}

               {gate.type.toUpperCase() === "OR" && (
                <OrGate
                gate={gate}
                selectedGateId={selectedGateId}
                setSelectedGateId={setSelectedGateId}
              />
              )}

              {gate.type.toUpperCase() === "NOT" && (
                <NotGate
                gate={gate}
                selectedGateId={selectedGateId}
                setSelectedGateId={setSelectedGateId}
              />
              )} 

              
            </React.Fragment>
          ))}
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
