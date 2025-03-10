/**************************** User Input Functionality *******************************/

    /* Expected User Input:

    name: And Gate;
    type: AND;
    input: A,B;
    output: C;
    x: 10;
    y: 20;


    name: Or Gate;
    type: OR;
    input: D,E;
    output: F;
    x: 15;
    y: 25;

    */


    export function parseUserInput(inputString, gates){

        console.log('PARSEUSERINPUT ACTIVATED')
        // Split the input string using commas as delimiters
        const lines = inputString.split(";");
        const gatesArray = []; // Storage to store all the gates declared in this current input
        let parsedData = {}; // Temporary object to store the current gate's data

        lines.forEach(line => { // reiterate through each line in the user input
            const [key,value] = line.split(":"); // Store the key value pairs by splitting the line with the delimiter ":"

            if (key && value){
                const cleanedKey = key.trim().toLowerCase();
                const cleanedValue = value.trim();

                // if any key already exists in parsedData (which means a gate already exists) *Second iteration
                if (parsedData.hasOwnProperty(cleanedKey) && Object.keys(parsedData).length > 0) {
                    console.log("duplicate entry found, inserting secodn object")
                    if (isValidGate(parsedData, gatesArray, gates)){ // Check if the gate type is valid
                        console.log("key successfully validated for second object")
                        //Add the first iteration gate we created to the gatesArray before starting with second
                        gatesArray.push({
                        ...parsedData,
                        id: gates.length +  gatesArray.length, // Assign an ID based of the existing gates and the number of gates in this input
                        })
                    } else{
                        console.error(`Invalid gate: ${JSON.stringify(parsedData)}`); //Log the gate that has error
                    }

                    //Reset the parsedData for the next gate

                    parsedData = {};
                    
                }

                // Add key-value pair of current gate to parsedData ( first or subsequent iterations )
                parsedData[cleanedKey] = cleanedValue;

            }
        })
      
        // Validate and push the last gate if it exists
        if (Object.keys(parsedData).length > 0) {
            if (isValidGate(parsedData, gatesArray, gates)) {
            gatesArray.push({
                ...parsedData,
                id: gates.length + gatesArray.length, // Assign unique ID based on existing gates + new gates
            });
            
            } else {
            console.error(`Invalid gate: ${JSON.stringify(parsedData)}`);
            }
        }

        // At this point, gates array is built with all the gates already, now we create a function 
        // to check through and build the different level of gates
        // then build the positioning of each gate.
        const levelledGatesArrays = collectGateLevel(gatesArray)    // collectGateLevel returns an object with the arrays of level
        const sortedlevelledGates = sortGates(levelledGatesArrays)
        console.log('sortedlevelledGates', sortedlevelledGates);
        positionGates(sortedlevelledGates, gatesArray)
        const flattenedGatesArray = Object.values(levelledGatesArrays).flat();
        console.log("Flattened Gates Array:", JSON.stringify(flattenedGatesArray, null, 2));
        return flattenedGatesArray; // Return the array of gates
    }


    // Helper function to validate gate data before adding it to the array
    function isValidGate(gateData, gatesArray, existingGates) {
        // Check required fields
        if (
        !gateData.name ||
        !gateData.type ||
        !gateData.input
        ) {
        return false;
        }
    
        // Check if the gate already exists in the existing gates context
        if (existingGates.some(gate => gate.name === gateData.name)) {
            console.warn(`Gate with name ${gateData.name} already exists. Skipping.`);
            return false;
        }

        // Validate gate type
        const gatesList = ["AND", "OR", "NOT"];
        if (!gatesList.includes(gateData.type.toUpperCase())) {
        return false;
        }
    
        // Validate number of inputs
        const inputs = gateData.input.split(",").map((input) => input.trim());
        const numInputs = inputs.length;
        if (gateData.type.toUpperCase() === "NOT" && numInputs > 1) {
            console.error(`NOT gate should not contain more than 1 input`);
            alert("NOT gate should not contain more than 1 input");
        return false;
        }
    
        // Generate a random unique output if not provided
        if (!gateData.output) {
            let uniqueOutput;
            do {
              uniqueOutput = `OUT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
            } while (gatesArray.some((gate) => gate.output === uniqueOutput));
            gateData.output = uniqueOutput;
        }

        // Update gateData with parsed inputs and number of inputs if all checks pass
        gateData.inputs = inputs;
        gateData.numInputs = numInputs;
        gateData.type = gateData.type.toUpperCase();
    
        return true; // All checks passed
    }

    function collectGateLevel(gatesArray) {

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

    function positionGates(levelledGatesArrays, gatesArray) {
    // Validate input
    if (!levelledGatesArrays || typeof levelledGatesArrays !== "object") {
        throw new Error("Invalid levelledGatesArrays input");
    }
    
    const basePosition = [10, 10]; // Starting point (x=10, y=10)
    let xPosition = basePosition[0];
    let yPosition = basePosition[1];
    
    // For each level in the object
    for (const [levelKey, levelGates] of Object.entries(levelledGatesArrays)) {
        if (!Array.isArray(levelGates)) {
        console.warn(`Skipping invalid level data for ${levelKey}`);
        continue;
        }
    
        console.log(`Assigning positions for gates in ${levelKey}...`);
    
        // Place each gate in this level
        for (const gate of levelGates) {
        if (typeof gate !== "object") {
            console.warn("Skipping invalid gate:", gate);
            continue;
        }
    
        // Assign x,y if not already assigned
        if (!("x" in gate) && !("y" in gate)) {
            gate.x = xPosition;
            gate.y = yPosition;
        }
    
        // Reflect these coordinates back into the original gatesArray
        // const gateInMainArray = gatesArray.find((g) => g.id === gate.id);
        // if (gateInMainArray) {
        //     gateInMainArray.x = gate.x;
        //     gateInMainArray.y = gate.y;
        // }
    
        // Move downward for the next gate in the same level
        yPosition += 10;     // in terms of grid, same for x axis
        }
    
        // After finishing this level, move to the right and reset vertical position
        xPosition += 14;
        yPosition = basePosition[1];
    }
    }

    function sortGates(levels){
        // function to sort gates to prevent cross wiring

        const levelKeys = Object.keys(levels); // Get all level keys (e.g., "level1", "level2", etc.)
        
        // Initialize sorted flag for all gates outside of the loop
        for (const levelKey of levelKeys) {
            for (const gate of levels[levelKey]) {
                if (gate.sorted === undefined) {
                    gate.sorted = false;
                }
            }
        }
        
        for (let i = 1; i < levelKeys.length; i++) {             // Start from level2 onward

            const prevLevel = levels[levelKeys[i - 1]]; // Previous level
            const currentLevel = levels[levelKeys[i]]; // Current level

            //get all the outputs from the previous level
            const prevOutputs = new Set(prevLevel.map(gate => gate.output));

            // Temp queue for prioritized gates
            const prioritizedQueue = [];
            const remainingGates = [];

            // Track gate names to avoid duplicates
            const addedGates = new Set();

            // iterate through the gates in the current level
            for (const gate of currentLevel){
                
                

                const inputs = gate.input.split(",").map(input => input.trim());

                // Check if ay inputs matches an output from the prev level
                const matchingInputs = inputs.filter(input => prevOutputs.has(input));
                const matchingInputCount = matchingInputs.length;
                let matchingInputIndex = -1; // Default to -1 if no match is found
                let matchingInput = null; // Keep track of the actual matching input

                for (const output of prevOutputs) {
                    const index = inputs.findIndex(input => input === output);
                    if (index !== -1) {
                        matchingInputIndex = index;
                        matchingInput = output;
                        break; // Stop as soon as we find the first match
                    }
                }

                if (matchingInputCount === 1){
                    // if only 1 input matches the previous level output
                    // Handle the case where exactly one input matches, change the position of the gate within the level
                    const [matchingInput] = matchingInputs;
                    const prevIndex = prevLevel.findIndex(prevGate => prevGate.output === matchingInput);
                    // clamp prevIndex if needed
                    

                    if (!addedGates.has(gate.id)) {
                        if (prioritizedQueue[prevIndex]) {
                            // If the index already exists in the current level, insert at specific index
                            prioritizedQueue.splice(prevIndex, 0 , gate); // insert gate at specific index and push everything else back
                        } else {
                            // If the index does not exist, just push it to the array normally
                            if (prioritizedQueue.length <= prevIndex) {
                                prioritizedQueue.push(gate);
                            } else{
                                // Place the gate at the same index as in the previous level
                                prioritizedQueue[prevIndex] = gate;
                            }
                            
                        }
                        gate.sorted = true;
                        // Add the gate to the tracking set
                        addedGates.add(gate.id);
                    } else{
                        console.log(`gate has already been added to array ${gate}`)
                    }

                } else if(matchingInputCount >= 2 && gate.type.toUpperCase() !== 'NOT'){
                    console.log(`else if loop activated`)
                    // if 2 inputs match the previous level output
                    // move the matching input to the front of the inputs array
                    // THIS IS TO SORT THE INPUT PINS

                    // Check if the gate is already sorted to avoid re-sorting the input pins
                    if (gate.sorted) {
                        remainingGates.push(gate);
                        console.log(`the gate: ${gate} has been sorted therefore skipping sorting for input pins`)
                        continue;
                    }
                    
                    const [matchingInput] = inputs.splice(matchingInputIndex, 1);   //put the index of the matchingInput as the first
                    gate.inputs = [matchingInput, ...inputs]; // update gate input order

                    // add the gate to the prioritized queue
                    // THIS IS TO SORT THE GATES POSITION
                    prioritizedQueue.push(gate);

                    // Mark the gate as sorted
                    gate.sorted = true;
                    console.log(`the gate: ${gate} has been marked as sorted`)

                    // Add the gate to the tracking set
                    addedGates.add(gate.id);


                } else{
                    if (!addedGates.has(gate.id)) {
                        gate.inputs = [...inputs];
                        gate.sorted = true;
                        addedGates.add(gate.id);
                        remainingGates.push(gate);
                    } else{
                        console.log(`gate has already been added to array ${gate}`)
                    }
                }

            }
            // Remove null values from prioritizedQueue
            const cleanedPrioritizedQueue = prioritizedQueue.filter(Boolean);

            levels[levelKeys[i]] = [...cleanedPrioritizedQueue, ...remainingGates];
        }
        return levels;
    }


      
    /**************************** End Of User Input Functionality *******************************/