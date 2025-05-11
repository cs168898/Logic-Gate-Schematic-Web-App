import { faL } from "@fortawesome/free-solid-svg-icons";
import { showToast } from "../showToast";
 
 // Helper function to validate gate data before adding it to the array
 export function isValidGate(gateToBeProcessed, gatesArray, existingGates, isFirstParse) {
    // Check required fields
    if (!gateToBeProcessed.name) {
        showToast(`One of the gates is missing a name.`);
        return false;
    }


    if (!gateToBeProcessed.type) {
        showToast(`${gateToBeProcessed.name} type is missing.`);
        return false;
    }
    // Validate gate type
    const gatesList = ["AND", "OR", "NOT", "NAND"];
    if (!gatesList.includes(gateToBeProcessed.type.toUpperCase())) {
        showToast(`Please input a valid gate type in ${gateToBeProcessed.name}.The valid gate types are:
        {AND, OR, NOT}`);
    return false;
    }


    if (!gateToBeProcessed.input) {
        showToast(`${gateToBeProcessed.name} input is missing.`);
        return false;
    }

    // Check if the gate already exists in the existing gates context
    const duplicateNameGate = Object.values(existingGates)
    .flat()
    .find(existingGate => existingGate.name === gateToBeProcessed.name);

    if (duplicateNameGate) {
        return false;
    }

    // find for duplicate output in existing gates
    const duplicateOutputGate = Object.values(existingGates)
    .flat()
    .find(existingGate => existingGate.output == gateToBeProcessed.output);

    // find for duplicate output in current user input
    const allParsedOutputs = new Set(gatesArray.flatMap(g => g.output))
    if (allParsedOutputs.has(gateToBeProcessed.output) && isFirstParse){
        showToast(`Circular dependency detected for ${gateToBeProcessed.name}! Output ${gateToBeProcessed.output} has already been declared.`)
        // gateToBeProcessed.isCircular = true;
        return false;
    }

    if (duplicateOutputGate && isFirstParse) {
        showToast(`ERROR: ${gateToBeProcessed.name} has the same output as ${duplicateOutputGate.name}, Circular dependency detected`);
        // gateToBeProcessed.isCircular = true;
        return false;
    }


    //   // ✅ Check for circular dependencies: If output exists as an input, reject
    // const allParsedInputs = new Set(gatesArray.flatMap(g => g.inputs));
    
    // if (allParsedInputs.has(gateToBeProcessed.output)) {
    //     showToast(`ERROR: Circular dependency detected! Output ${gateToBeProcessed.output} is already a required input.`);
    //     return false;
    // }

    

    // Validate number of inputs
    const inputs = gateToBeProcessed.input.split(",").map((input) => input.trim());
    const numInputs = inputs.length;
    if (gateToBeProcessed.type.toUpperCase() === "NOT" && numInputs > 1) {
        console.error(`NOT gate should not contain more than 1 input`);
        alert("NOT gate should not contain more than 1 input");
    return false;
    }

    // Generate a random unique output if not provided
    if (!gateToBeProcessed.output) {
        let uniqueOutput;
        do {
          uniqueOutput = `OUT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
        } while (gatesArray.some((gate) => gate.output === uniqueOutput));
        gateToBeProcessed.output = uniqueOutput;
    }

    // Update gateToBeProcessed with parsed inputs and number of inputs if all checks pass
    gateToBeProcessed.inputs = inputs;
    gateToBeProcessed.numInputs = numInputs;
    gateToBeProcessed.type = gateToBeProcessed.type.toUpperCase();

    return true; // All checks passed
}




