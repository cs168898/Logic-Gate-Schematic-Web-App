export function positionGates(levelledGatesObj, gatesArray, existingGates) {
    const basePosition = [10, 0]; // Starting point (x=10, y=10)
    let xPosition = basePosition[0];
    let interval = 14;

    let existingGatesObj = JSON.parse(JSON.stringify(existingGates));

    const combinedGatesObj = Object.keys({ ...existingGatesObj, ...levelledGatesObj }).reduce((acc, key) => {
        acc[key] = [...(existingGatesObj[key] || []), ...(levelledGatesObj[key] || [])]; // Merge arrays
        return acc;
    }, {});
    

    // Sort levels numerically before processing (ensures correct order)
    const sortedLevels = Object.keys(combinedGatesObj)
        .sort((a, b) => parseInt(a.replace("level", "")) - parseInt(b.replace("level", "")));
    console.log('sorted levels = ', sortedLevels);
    // Iterate over each level in the correct order
    for (const levelKey of sortedLevels) {
        let levelGates = combinedGatesObj[levelKey];

        let yPosition = basePosition[1]; // Reset vertical position for each level

        // Place each gate in this level
        levelGates = levelGates.map(gate => {
            yPosition += 10; // Stack gates in a column
            if (gate.level !== 1){
                xPosition = xPosition + interval*(gate.level - 1)
            }

            console.log('the gates x position is = ', xPosition)
            return {
                ...gate,
                x: xPosition,
                y: yPosition
            };
        });

        // Update combinedGatesArray with new positioned gates
        combinedGatesObj[levelKey] = levelGates;

    }

    
    return combinedGatesObj; // Ensure levels are retained
}