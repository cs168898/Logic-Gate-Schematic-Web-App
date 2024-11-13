    /**************************** User Input Functionality *******************************/

    /* Expected User Input:

    name: And Gate;
    type: AND;
    input: A,B;
    output: C;


    */

    export function parseUserInput(inputString, gates){
        // Split the input string using commas as delimiters
        const lines = inputString.split(";");
        const parsedData = {};

        lines.forEach(line => {
            const [key,value] = line.split(":"); // Store the key value pairs by splitting the line with the delimiter ":"
            if (key && value){
                parsedData[key.trim().toLowerCase()]= value.trim(); // Insert the value of its respective key into the parsedData dicitionary
            }
        })
      
        // Validate parsed data
        if (!parsedData.name || !parsedData.type || !parsedData.input || !parsedData.output || !parsedData.x || !parsedData.y) {
            throw new Error("Invalid input. Please provide name, type, input, output , X and Y.");
        }


        // Check if the user entered a valid gate type
        const gatesList = ['AND', 'OR', 'NOT']

        if (!gatesList.includes(parsedData.type.toUpperCase())) {
            throw new Error("Please enter a valid gate type");
          }
      
        // Extract inputs as a list
        const inputs = parsedData.input.split(",").map(input => input.trim());
        const numInputs = inputs.length


      
        // Return an object ready to be sent to the backend
        return {
            id: gates.length,
            name: parsedData.name,
            type: parsedData.type.toUpperCase(),
            inputs: inputs,
            output: parsedData.output,
            x: parseInt(parsedData.x),
            y: parseInt(parsedData.y),
            numInputs: numInputs
        };
      }
  
    /**************************** End Of User Input Functionality *******************************/