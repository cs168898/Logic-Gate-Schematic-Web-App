export function jsonbToText(input) {
    let jsonArray;

    try {
        // Try parsing JSON first
        jsonArray = JSON.parse(input);
    } catch (error) {
        console.error("Invalid JSONB input! It might be plain text.");
        return "Input is not a JSONB input";
    }

    // Check if input is an array or a single object
    if (!Array.isArray(jsonArray)) {
        jsonArray = [jsonArray]; // Convert single object to array for consistency
    }

    // Define the desired key order
    const keyOrder = ["name", "type", "input", "output","level", "x", "y"];

    // Function to reorder keys based on the predefined order
    function reorderKeys(obj, keyOrder) {
        let reordered = {};
        keyOrder.forEach(key => {
            if (key in obj) reordered[key] = obj[key];
        });
        return reordered;
    }

    let text = "";

    jsonArray.forEach((gate) => {
        const reorderedGate = reorderKeys(gate, keyOrder); // Reorder the gate properties
        
        for (const [key, value] of Object.entries(reorderedGate)) {
            let formattedValue;

            if (Array.isArray(value)) {
                formattedValue = `${value.join(", ")}`;
            } else {
                formattedValue = `${value}`;
            }

            // Append semicolon only if it doesn't already exist
            if (!formattedValue.trim().endsWith(";")) {
                formattedValue += ";";
            }

            text += `  ${key}: ${formattedValue}\n`;
        }
        text += `\n`; // Separate gates with a newline
    });

    return text.trim(); // Remove extra space at the end
}
