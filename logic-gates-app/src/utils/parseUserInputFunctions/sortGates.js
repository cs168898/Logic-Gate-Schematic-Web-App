
export function sortGates(levels){
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
        console.log('levels:', levels)
    }
    return levels;
}