/**************************** User Input Functionality *******************************/

    /* Expected User Input:

    name: And Gate;
    type: AND;
    input: A,B;
    output: C;
    


    name: Or Gate;
    type: OR;
    input: D,E;
    output: F;
    

    */
import { collectGateLevel } from "./parseUserInputFunctions/collectGateLevel";
import { sortGates } from "./parseUserInputFunctions/sortGates";
import { isValidGate } from "./parseUserInputFunctions/isValidGate";
import { positionGates } from "./parseUserInputFunctions/positionGates";
import { assignGateLevel } from "./parseUserInputFunctions/assignGateLevel";
import { showToast } from "./showToast";

    export function parseUserInput(inputString, gates, isFirstParse, setisFirstParse, useAI){

        console.log('raw text received is: ', inputString)
        inputString = cleanUserInput(inputString)
        console.log('PARSEUSERINPUT ACTIVATED')
        console.log('input receiveing in parseuserinput is: ', inputString)
        // Split the input string using commas as delimiters
        const lines = inputString.split(";");
        const gatesArray = []; // Storage to store all the gates declared in this current input
        let parsedData = {}; // Temporary object to store the current gate's data
        let levelledGatesObj = {};

        

        lines.forEach(line => { // reiterate through each line in the user input

            if (gatesArray.length == 20){
                showToast('please create 20 gates at a time only')
                return levelledGatesObj
            }

            const [key,value] = line.split(":"); // Store the key value pairs by splitting the line with the delimiter ":"
            
            if (key && value){
                const cleanedKey = key.trim().toLowerCase();
                const cleanedValue = value.trim();

                // if any key already exists in parsedData (which means a gate already exists) *Second iteration
                if (parsedData.hasOwnProperty(cleanedKey) && Object.keys(parsedData).length > 0) {
                    
                    if (isValidGate(parsedData, gatesArray, gates, isFirstParse)){ // Check if the gate type is valid
                        
                        //Add the first iteration gate we created to the gatesArray before starting with second
                        gatesArray.push({
                        ...parsedData,
                        id: Object.values(gates).flat().length + gatesArray.length, // Assign an ID based of the existing gates and the number of gates in this input
                        level: parsedData.level ? parseInt(parsedData.level, 10) : null
                        })
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
            if (isValidGate(parsedData, gatesArray, gates, isFirstParse)) {
                 // Check if the gate already exists in gates
                const isDuplicate = Object.values(gates).flat().some(existingGate =>
                    existingGate.name === parsedData.name &&
                    existingGate.type === parsedData.type &&
                    existingGate.input === parsedData.input &&
                    existingGate.output === parsedData.output
                );

                if (isDuplicate) {
                    console.warn(`Skipping duplicate gate: ${JSON.stringify(parsedData)}`);
                } else {
                    gatesArray.push({
                        ...parsedData,
                        id: Object.values(gates).flat().length + gatesArray.length, // Assign unique ID
                        level: parsedData.level ? parseInt(parsedData.level, 10) : null
                    });
                }

            
            }
        }

        // At this point, gates array is built with all the gates already, now we create a function 
        // to check through and build the different level of gates
        // then build the positioning of each gate.
        
        
        if (isFirstParse && !useAI){
            
            levelledGatesObj = collectGateLevel(gatesArray)    // collectGateLevel returns an object with the arrays of level

        } else {
            // on subsequent runs , look for the declared levels by user 
            
            levelledGatesObj = assignGateLevel(gates, gatesArray)
        }
       
        const cleanedGates = removeDuplicateGates(gates, levelledGatesObj);
        

        
        const sortedlevelledGates = sortGates(cleanedGates) // sort the gates position and input pins position in the level
        

        //create a function to remove duplicate gates

      

        
        
        const combinedGatesArray = positionGates(sortedlevelledGates, gatesArray, gates)

        
        const flattenedGatesWithLevels = Object.entries(combinedGatesArray)
                                        .reduce((acc, [levelKey, gates]) => {
                                            acc[levelKey] = gates;  // Preserve level key while keeping gates
                                            return acc;
                                        }, {});

        

        if (Object.values(flattenedGatesWithLevels).flat().length > 50 ){
            showToast(`You have added more than 50 gates this request will be cancelled`);
            return {};
        }                                

        
        setisFirstParse(false) 
        return flattenedGatesWithLevels; // Return the array of gates
    }


   

    
    function removeDuplicateGates(existingGates, levelledGatesObj) {
    const existingGateNames = new Set(
        Object.values(existingGates).flat().map(gate => gate.name)
    );

    Object.keys(levelledGatesObj).forEach(levelKey => {
        levelledGatesObj[levelKey] = levelledGatesObj[levelKey].filter(gate => {
            if (existingGateNames.has(gate.name)) {
                return false; // Remove the duplicate gate
            }
            return true; // Keep unique gate
        });
    });

    
    
    return levelledGatesObj;
}

    
function cleanUserInput(text) {
    // Remove code blocks delimited by triple backticks and curly brackets
    return text.replace(/^```[\s\S]*?\n([\s\S]*?)\n```$/, '$1').trim();
  }
    


      
    /**************************** End Of User Input Functionality *******************************/