import { textToJsonb } from './textToJsonb';
import { jsonbToText } from './jsonbToText';

// This example merges gates from "newText" into the existing text "prevText."
export function mergeGates(prevText, newText) {
  // Step 1: Convert existing text to array
  let prevArray = [];
  try {
    const prevJsonString = textToJsonb(prevText); // returns JSON string
    prevArray = JSON.parse(prevJsonString); // convert to JS array
  } catch (err) {
    console.error('Failed parsing prevText:', err);
    // fallback to empty array if parse fails
  }

  // Step 2: Convert new text to array
  let newArray = [];
  try {
    const newJsonString = textToJsonb(newText);
    newArray = JSON.parse(newJsonString);
  } catch (err) {
    console.error('Failed parsing newText:', err);
    // fallback to empty array if parse fails
  }

  // Step 3: Merge by gate name
  // For each gate in newArray, find if there's an old gate with the same name.
  // If so, replace it. Otherwise push it.
  newArray.forEach(newGate => {
    if (!newGate.name) {
      // if new gate doesn't have a 'name' for some reason, skip or push
      return;
    }

    const existingIndex = prevArray.findIndex(g => g.name === newGate.name);
    if (existingIndex !== -1) {
      // found an old gate with the same name, replace it
      prevArray[existingIndex] = newGate;
    } else {
      // no existing gate with that name, push
      prevArray.push(newGate);
    }
  });

  // Step 4: Convert merged array back to text
  const mergedJsonString = JSON.stringify(prevArray, null, 2);
  const mergedText = jsonbToText(mergedJsonString);

  return mergedText;
}
