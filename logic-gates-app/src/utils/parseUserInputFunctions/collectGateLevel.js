import { showToast } from "../showToast";



export function collectGateLevel(gatesArray) {

    
    const unplacedGates = [...gatesArray]; // copy the gatesArray so we can modify the array without touching original
    const levels = {};          // Will store gates by level, e.g., levels.level1 = [...]
    const CurrentOutputs = new Set();  // Tracks outputs that are already "resolved"
    const circularGates = [];

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
      CurrentOutputs.add(input);
      console.log('external inputs: ', input)
    }

    // Continue until we've assigned every gate or cannot proceed
    while (unplacedGates.length > 0) {
      console.log("Before processing level", levelIndex, "CurrentOutputs:", [...CurrentOutputs]);
      const currentLevel = [];
  
      // Iterate backward so we can remove gates without messing up indices
      // how this process works is that we iterate backwards then check if the current gate's inputs is included 
      // inside the currentOutput variable, if it is not, skip it until we find a gate that 
      // all its inputs is inside the currentOutput variable
      // then update the currentoutput variable to store the new outputs available
      // then repeat.
      for (let i = unplacedGates.length - 1; i >= 0; i--) {
        const gate = unplacedGates[i];
        const inputs = gate.input.split(",").map(input => input.trim());

        // if they already have a level assigned to them, and it is not null
        if (gate.level){
          //if gate level exists add it directly
          if (!levels[`level${gate.level}`]){
            // initialize the level if it dne
            levels[`level${gate.level}`] = []
          }

          levels[`level${gate.level}`].push(gate)
          CurrentOutputs.add(gate.output.trim());
          unplacedGates.splice(i, 1);
          console.log("Placing gate from predefined level:", gate.name);
          console.log("Adding output to CurrentOutputs:", gate.output);
          
          continue;
        }

        // Check if this gate can be placed:
        //   => "placeable" if all inputs are already in the outputs set
        const canPlace = !inputs.some(input => !CurrentOutputs.has(input.trim()));

        if (canPlace) {
          gate.level = levelIndex;  // assign their gate level attribute
          currentLevel.push(gate);
          CurrentOutputs.add(gate.output); // Add its output to resolved signals
          unplacedGates.splice(i, 1);  // Remove from the unplacedGates list
          console.log("Adding output to CurrentOutputs:", gate.output);
          console.log('CAN place this gate: ', gate)
          console.log('inputs = ', inputs)
          console.log('currentOutputs: ', CurrentOutputs)
          console.log('canPlace = ', canPlace);
        } 
        // else if (gate.isCircular){
        //   circularGates.push(gate);
        //   unplacedGates.splice(i, 1);
        // } 
        
        // else{
        //   // Mark as unresolvable and skip
        //   showToast("Skipping unplaceable gate:", gate.name);
        //   gate.unresolvable = true;
        //   unplacedGates.splice(i, 1);
        // }
        
      }
  
      // check If we couldn't place *any* gate, we have an infinite-loop or unresolved-dependency scenario
      // if (currentLevel.length === 0) {
      //   console.warn(
      //     "Unresolved dependencies or circular references detected. Potential infinite loop:",
      //     unplacedGates
      //   );
      //   break; // Stop processing further
      // }
  
      if (currentLevel.length === 0 && circularGates.length === 0) {
        // showToast("Unresolved dependencies or infinite loop detected.");
        break;
      }
        
      if (!levels[`level${levelIndex}`]){
        // if the level does not exist yet create a new array
        levels[`level${levelIndex}`] = [];
      }
      // combine the arrays of the existing gates with the current level
      levels[`level${levelIndex}`].push(...currentLevel);

      

      
      levelIndex++;
    }

    // Process circular gates
    circularGates.forEach(gate => {
      gate.level = levelIndex;
      levels[`level${levelIndex}`] = levels[`level${levelIndex}`] || [];
      levels[`level${levelIndex}`].push(gate);
    });

    for (const levelKey in levels) {
        if (Array.isArray(levels[levelKey])) { // check if it levelkey exist as an array
            levels[levelKey].reverse(); // Reverse the array in-place
        }
    }
    
    
    return levels;
  }