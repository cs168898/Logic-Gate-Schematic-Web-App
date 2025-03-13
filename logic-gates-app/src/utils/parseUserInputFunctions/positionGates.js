export function positionGates(levelledGatesObj, gatesArray, existingGates) {
    const basePosition = [10, 0]; // Starting point (x=10, y=10)
    let xPosition = basePosition[0];

    let existingGatesObj = JSON.parse(JSON.stringify(existingGates));

    const combinedGatesObj = Object.keys({ ...existingGatesObj, ...levelledGatesObj }).reduce((acc, key) => {
        acc[key] = [...(existingGatesObj[key] || []), ...(levelledGatesObj[key] || [])]; // Merge arrays
        return acc;
    }, {});

    

    // Sort levels numerically before processing (ensures correct order)
    const sortedLevels = Object.keys(combinedGatesObj)
        .sort((a, b) => parseInt(a.replace("level", "")) - parseInt(b.replace("level", "")));

    // Iterate over each level in the correct order
    for (const levelKey of sortedLevels) {
        let levelGates = combinedGatesObj[levelKey];

        let yPosition = basePosition[1]; // Reset vertical position for each level

        // Place each gate in this level
        levelGates = levelGates.map(gate => {
            yPosition += 10; // Stack gates in a column
            return {
                ...gate,
                x: xPosition,
                y: yPosition
            };
        });

        // Update combinedGatesArray with new positioned gates
        combinedGatesObj[levelKey] = levelGates;

        // Move downward for the next gate in the same level
        

        // Move to the right for the next level and maintain spacing
        xPosition += 14;
    }

    console.log("CombinedGates:", combinedGatesObj);
    return combinedGatesObj; // Ensure levels are retained
}