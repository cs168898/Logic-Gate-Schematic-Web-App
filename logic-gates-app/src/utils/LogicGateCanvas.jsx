// LogicGateCanvas.js
import React from 'react';
import Grid from '../components/background-grid';
import { useState, useCallback, useEffect, useContext, useRef } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';
import { AndGate } from '../konvaLogicGates/andGate';
import { OrGate } from '../konvaLogicGates/orGate';
import { NotGate } from '../konvaLogicGates/notGate';
import { CreateConnections } from '../konvaLogicGates/functions/create_connections';
import { cleanUpWires } from '../konvaLogicGates/functions/cleanUp_wires';
import { ConnectionsContext } from '../context/ConnectionsContext';
import { GatesContext } from '../context/GatesContext';
import { GatesPositionContext } from '../context/GatesPositionContext';
import { gridSizeConst } from './gridSize';


function LogicGateCanvas({ setSelectedGateId, selectedGateId }) {

  // Access the context of the gates and connections.
  const { gates } = useContext(GatesContext);
  const { connections, setConnections } = useContext(ConnectionsContext);
  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);
  const gridSize = gridSizeConst

  // Use useCallback to ensure a stable function reference
  const handleWirePositionUpdate = useCallback((gateID, positions) => { // useCallback to ensure that onWirePositionUpdate does not get re-created on every render.
    setGatePositions((prev) => {
      const updatedGatePositions = {
        ...prev,
        [gateID]: positions,
      };
      return updatedGatePositions;
    });
  }, []);

  const [stagePos, setStagePos] = useState({ x: 0, y: 0 });

  const handleDragMove = (e) => {
    const stage = e.target;
    const pos = stage.position(); // Get current position

    // Restrict panning to prevent movement beyond the top-left (x < 0, y < 0)
    const newX = Math.min(0, pos.x);
    const newY = Math.min(0, pos.y);

    // Update state to keep track of the position
    setStagePos({ x: newX, y: newY });

    // Force the stage to stay within the constrained area
    stage.position({ x: newX, y: newY });
  };


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
    draggable = {true}
    onDragMove={handleDragMove}
  >   
      <Layer>
      <Grid width={window.innerWidth} height={window.innerHeight} gridSize={gridSize} offsetX={stagePos.x} offsetY={stagePos.y} />
      </Layer>

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
            selectedGateId={selectedGateId}
            setSelectedGateId={setSelectedGateId}
          /> 
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
