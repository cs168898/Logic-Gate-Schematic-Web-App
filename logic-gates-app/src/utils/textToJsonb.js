export function textToJsonb(text) {
    // Split on either a semicolon (with optional trailing space) OR a newline.
    // This will produce individual segments like "name: Gate1", "type: and", "input: A, B".
    // We also call trim() in case the user has extra whitespace around semicolons.
    const segments = text.split(/;\s*|\n/);
  
    const jsonArray = [];
    let currentGate = null;
  
    segments.forEach(segment => {
      const trimmedSegment = segment.trim();
      if (!trimmedSegment) {
        // skip empty segments (e.g., trailing semicolons or extra newlines)
        return;
      }
  
      // Each segment should be "key: value" after trimming.
      const [key, rawValue] = trimmedSegment.split(":").map(item => item.trim());
  
      // Skip if we don't have a proper "key: value" format.
      if (!key || !rawValue) return;
  
      // If the key is "name", we start a new gate object.
      if (key.toLowerCase() === "name") {
        // If we already have a gate in progress, push it into the array.
        if (currentGate) {
          jsonArray.push(currentGate);
        }
        // Start a fresh gate.
        currentGate = {};
      }
  
      // Now determine how to store the rawValue.
      if (rawValue.includes(",")) {
        // e.g. "A, B" → ["A","B"]
        currentGate[key] = rawValue.split(",").map(item => item.trim());
      } else if (!isNaN(rawValue)) {
        // e.g. "200" → number 200
        currentGate[key] = Number(rawValue);
      } else {
        // Otherwise store as string
        currentGate[key] = rawValue;
      }
    });
  
    // If we ended with a gate in progress, push it to the array.
    if (currentGate) {
      jsonArray.push(currentGate);
    }
  
    // Return formatted JSON string
    return JSON.stringify(jsonArray, null, 2);
  }
  