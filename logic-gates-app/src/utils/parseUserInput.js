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
                    if (isValidGate(parsedData)){ // Check if the gate type is valid
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
            if (isValidGate(parsedData)) {
                console.log("key successfully validated")
            gatesArray.push({
                ...parsedData,
                id: gates.length + gatesArray.length, // Assign unique ID based on existing gates + new gates
            });
            
            } else {
            console.error(`Invalid gate: ${JSON.stringify(parsedData)}`);
            }
        }
        return gatesArray; // Return the array of gates
    }


    // Helper function to validate gate data before adding it to the array
    function isValidGate(gateData) {
        // Check required fields
        if (
        !gateData.name ||
        !gateData.type ||
        !gateData.input ||
        !gateData.output ||
        !gateData.x ||
        !gateData.y
        ) {
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
        if (gateData.type.toUpperCase() !== "NOT" && numInputs < 2) {
        return false;
        }
    
        // Update gateData with parsed inputs and number of inputs if all checks pass
        gateData.inputs = inputs;
        gateData.numInputs = numInputs;
        gateData.type = gateData.type.toUpperCase();
        gateData.x = parseInt(gateData.x);
        gateData.y = parseInt(gateData.y);
    
        return true; // All checks passed
    }
  
    /**************************** End Of User Input Functionality *******************************/