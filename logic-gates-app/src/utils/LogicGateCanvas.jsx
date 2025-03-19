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
import { debounce } from 'lodash';


function LogicGateCanvas({ setSelectedGateId, selectedGateId }) {

  // Access the context of the gates and connections.
  const { gates } = useContext(GatesContext);
  const { connections, setConnections } = useContext(ConnectionsContext);
  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);
  const gridSize = gridSizeConst
  const [stageScale, setStageScale] = useState(0.8);
  const resizeTimeoutRef = useRef(null);

  const stageRef = useRef(null);
  const scaleBy = 1.12; // Define the zoom scale factor
  const minScale = 0.7;  // Prevent zooming out too much
  const maxScale = 2;  // Allow zooming in up to this limit

  const [stageDimensions, setStageDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  // Calculate the rightmost and downward-most gate positions
  const calculateStageDimensions = useCallback(() => {
    const allGates = Object.values(gates).flat();
    if (allGates.length === 0) {
      return { width: window.innerWidth, height: window.innerHeight }; // Default dimensions
    }

    const rightmostX = Math.max(...allGates.map((gate) => gate.x * gridSizeConst)) + gridSizeConst * 5; // Add padding
    const downwardMostY = Math.max(...allGates.map((gate) => gate.y * gridSizeConst)) + gridSizeConst * 5; // Add padding

    return {
      width: Math.max(rightmostX, window.innerWidth), // Ensure it doesn't shrink below the viewport
      height: Math.max(downwardMostY, window.innerHeight),
    };
  }, [gates]);

  // Update stage dimensions when gates change
  useEffect(() => {
    setStageDimensions(calculateStageDimensions());
  }, [gates, calculateStageDimensions]);

  const updateStageDimensions = debounce(() => {
    setStageDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, 200);
  
  useEffect(() => {
    window.addEventListener('resize', updateStageDimensions);
    return () => window.removeEventListener('resize', updateStageDimensions);
  }, []);
  

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

  

  
  // zoom function
  function zoomStage(event) {
    event.evt.preventDefault();
    if (!stageRef.current) return;

    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointerPos = stage.getPointerPosition();
    if (!pointerPos) return;

    // Determine zoom direction
    const zoomIn = event.evt.deltaY < 0;
    let newScale = zoomIn ? oldScale * scaleBy : oldScale / scaleBy;

    // zoom limits
    newScale = Math.max(minScale, Math.min(maxScale, newScale));
    

    // Adjust position to keep zoom centered on cursor
    const mousePointTo = {
      x: (pointerPos.x - stage.x()) / oldScale,
      y: (pointerPos.y - stage.y()) / oldScale,
    };

    const stageBox = stage.getClientRect();
    const stageWidth = stageBox.width;
    const stageHeight = stageBox.height;
    const boardWidth = stageWidth * newScale;
    const boardHeight = stageHeight * newScale;

    let newPos = {
      x: pointerPos.x - mousePointTo.x * newScale,
      y: pointerPos.y - mousePointTo.y * newScale,
    };

    newPos.x = Math.max(Math.min(newPos.x, 0), -(boardWidth - window.innerWidth));
    newPos.y = Math.max(Math.min(newPos.y, 0), -(boardHeight - window.innerHeight));

    setStageScale(newScale);
    setStagePos(newPos);

    stage.scale({ x: newScale, y: newScale });
    stage.position(newPos);
    stage.batchDraw();


    
  }
  

  return (
  
    <Stage 
    ref={stageRef}
    width={stageDimensions.width} 
    height={stageDimensions.height} 
    className='konvajs-container'
    onClick={(e) => {
      // Check if the click is on the stage itself (not on any shape)
      if (e.target === e.target.getStage()) {
        setSelectedGateId(null); // Deselect the gate when clicking on the background
      }
    }}
    draggable = {true}
    onDragMove={handleDragMove}
    onWheel={zoomStage}
    scaleX={stageScale}
    scaleY={stageScale}
  >   
      <Layer>
      <Grid width={window.innerWidth} height={window.innerHeight} 
      gridSize={gridSize} offsetX={stagePos.x} 
      offsetY={stagePos.y} scale = {stageScale} />
      </Layer>

      <Layer>
        {Object.values(gates).flat().map((gate) => (
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
            width={stageDimensions.width}
            height={stageDimensions.height}
          /> 
      </Layer>
    </Stage>
    
  );
}

export default LogicGateCanvas;
