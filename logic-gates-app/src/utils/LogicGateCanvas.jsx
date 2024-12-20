// LogicGateCanvas.js
import React from 'react';
import { useState, useCallback } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { AndGate } from '../konvaLogicGates/andGate';
import { OrGate } from '../konvaLogicGates/orGate';
import { NotGate } from '../konvaLogicGates/notGate';
import { CreateConnections } from '../konvaLogicGates/create_connections';

function LogicGateCanvas({ gates, setSelectedGateId, selectedGateId }) {
  const [gatePositions, setGatePositions] = useState({}) // stores the positions of the input and output wire of gates

  // Use useCallback to ensure a stable function reference
  const handleWirePositionUpdate = useCallback((gateID, positions) => { // useCallback to ensure that onWirePositionUpdate does not get re-created on every render.
    setGatePositions((prev) => {
      const updatedGatePositions = {
        ...prev,
        [gateID]: positions,
      };
      console.log("Updated gatePositions:", updatedGatePositions); // Log the updated state
      return updatedGatePositions;
    });
  }, []);
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
                onWirePositionUpdate={handleWirePositionUpdate}
              />
              )}

               {gate.type.toUpperCase() === "OR" && (
                <OrGate
                gate={gate}
                selectedGateId={selectedGateId}
                setSelectedGateId={setSelectedGateId}
                onWirePositionUpdate={handleWirePositionUpdate}
              />
              )}

              {gate.type.toUpperCase() === "NOT" && (
                <NotGate
                gate={gate}
                selectedGateId={selectedGateId}
                setSelectedGateId={setSelectedGateId}
                onWirePositionUpdate={handleWirePositionUpdate}
              />
              )} 
              
            </React.Fragment>
            
          ))}
          <CreateConnections
            gatePositions={gatePositions}
            selectedGateId={selectedGateId}
            setSelectedGateId={setSelectedGateId}
          /> 
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
