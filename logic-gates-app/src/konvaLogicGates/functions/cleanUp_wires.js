

export function cleanUpWires(connections) {
    // Create a new object to store updated connections
    
    const updatedConnections = { ...connections };
    // Iterate through each endDestinationKey group
    Object.keys(connections).forEach((endDestinationKey) => {
        // Get all wires sharing the same endDestinationKey
        const wires = Object.entries(connections)
            .filter(([key, value]) => key.includes(endDestinationKey))
            .map(([key, { gridCoordinates }]) => ({
                wireKey: key,
                gridCoordinates,
            }));

        // Compare each wire with the rest in the group
        for (let i = 0; i < wires.length; i++) {
            const currentWire = wires[i];
            const currentGridCoords = currentWire.gridCoordinates;

            for (let j = 0; j < wires.length; j++) {
                if (i === j) continue; // Skip comparing the wire with itself

                const otherWire = wires[j];
                const otherGridCoords = otherWire.gridCoordinates;

                // Check for overlapping grid coordinates
                for (let k = 0; k < currentGridCoords.length; k++) {
                    const [currRow, currCol] = currentGridCoords[k];

                    // Find if this grid point exists in the other wire
                    const matchIndex = otherGridCoords.findIndex(
                        ([otherRow, otherCol]) => otherRow === currRow && otherCol === currCol
                    );

                    if (matchIndex !== -1) {
                        const currentEndPoint = currentGridCoords[currentGridCoords.length - 1];
                        const otherEndPoint = otherGridCoords[otherGridCoords.length - 1];

                        // If the current wire endpoint is lower
                        if (currentEndPoint[0] < otherEndPoint[0]) {
                            // Shorten the current wire to exclude points before the match
                            updatedConnections[currentWire.wireKey].gridCoordinates = currentGridCoords.slice(k);
                        }

                        // If the current wire endpoint is higher
                        if (currentEndPoint[0] > otherEndPoint[0]) {
                            // Shorten the current wire to exclude points after the match
                            updatedConnections[currentWire.wireKey].gridCoordinates = currentGridCoords.slice(0, k + 1);
                        }
                    }
                }
            }
        }
    });

    return updatedConnections;
}
