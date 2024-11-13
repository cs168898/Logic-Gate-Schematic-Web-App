    /**************************** User Input Functionality *******************************/

    /* Expected User Input:

    name: And Gate;
    type: AND;
    input: A,B;
    output: C;


    */

    export function parseUserInput(inputString){
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
        if (!parsedData.name || !parsedData.type || !parsedData.input || !parsedData.output) {
            throw new Error("Invalid input. Please provide name, type, input, and output.");
        }
      
        // Extract inputs as a list
        const inputs = parsedData.input.split(",").map(input => input.trim());


      
        // Return an object ready to be sent to the backend
        return {
            name: parsedData.name,
            type: parsedData.type,
            inputs: inputs,
            output: parsedData.output
        };
      }
  
    /**************************** End Of User Input Functionality *******************************/