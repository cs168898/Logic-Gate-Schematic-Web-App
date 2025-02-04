// LogicGateCanvas.js
import React from 'react';
import { useState, useCallback, useEffect, useContext } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { AndGate } from '../konvaLogicGates/andGate';
import { OrGate } from '../konvaLogicGates/orGate';
import { NotGate } from '../konvaLogicGates/notGate';
import { CreateConnections } from '../konvaLogicGates/functions/create_connections';
import { cleanUpWires } from '../konvaLogicGates/functions/cleanUp_wires';
import { ConnectionsContext } from '../context/ConnectionsContext';
import { GatesContext } from '../context/GatesContext';
import { GatesPositionContext } from '../context/GatesPositionContext';

function LogicGateCanvas({ setSelectedGateId, selectedGateId }) {

  // Access the context of the gates and connections.
  const { gates } = useContext(GatesContext);
  const { connections, setConnections } = useContext(ConnectionsContext);
  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);


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
        {console.log("Gates in LogicGateCanvas.jsx:", gates)}
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
            selectedGateId={selectedGateId}
            setSelectedGateId={setSelectedGateId}
          /> 
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
