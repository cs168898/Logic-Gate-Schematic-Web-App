


export function collectGateLevel(gatesArray) {

    const unplaced = [...gatesArray]; // copy the gatesArray so we can modify the array without touching original
    const levels = {};          // Will store gates by level, e.g., levels.level1 = [...]
    const outputs = new Set();  // Tracks outputs that are already "resolved"
    let levelIndex = 1;         // Label levels as level1, level2, etc.

    // Step 1: get all outputs from the gates
    const allOutputs = new Set(gatesArray.map(gate => gate.output));

    // Step 2: Detect external inputs
    const allInputs = gatesArray.flatMap(gate =>
        gate.input.split(",").map(input => input.trim())
    );

    const externalInputs = new Set(
        allInputs.filter(input => !allOutputs.has(input)) // if the input is not inside the all outputs array, then it is external
    );

    
    // Step 3: Initialize outputs with external inputs
    for (const input of externalInputs) {
        outputs.add(input);
    }

    // Continue until we've assigned every gate or cannot proceed
    while (unplaced.length > 0) {
      const currentLevel = [];
  
      // Iterate backward so we can remove gates without messing up indices
      for (let i = unplaced.length - 1; i >= 0; i--) {
        const gate = unplaced[i];
        const inputs = gate.input.split(",").map(input => input.trim());

        // Check if this gate can be placed:
        //   => "placeable" if all inputs are already in the outputs set
        const canPlace = !inputs.some(input => !outputs.has(input));

        if (canPlace) {
          currentLevel.push(gate);
          unplaced.splice(i, 1);  // Remove from the unplaced list
          outputs.add(gate.output); // Add its output to resolved signals
        }
        
      }
  
      // If we couldn't place *any* gate, we have an infinite-loop or unresolved-dependency scenario
      if (currentLevel.length === 0) {
        console.warn(
          "Unresolved dependencies or circular references detected. Potential infinite loop:",
          unplaced
        );
        break; // Stop processing further
      }
  
      // Store all gates placed in this pass as the next level
      levels[`level${levelIndex}`] = currentLevel;
      levelIndex++;
    }

    for (const levelKey in levels) {
        if (Array.isArray(levels[levelKey])) { // check if it levelkey exist as an array
            levels[levelKey].reverse(); // Reverse the array in-place
        }
    }
    
    return levels;
  }