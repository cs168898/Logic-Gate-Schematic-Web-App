export function assignGateLevel(existingGates, gatesToBeProcessed) {


    let levelledGatesObj = JSON.parse(JSON.stringify(existingGates));

    // Get the highest existing ID
    let maxId = Object.values(existingGates)
        .flat()
        .reduce((max, gate) => Math.max(max, gate.id), 0); // Find the highest existing ID

    gatesToBeProcessed.forEach(gate => {
        const levelKey = `level${gate.level}`;
        

        if (!levelledGatesObj[levelKey]) {
            levelledGatesObj[levelKey] = [];
        }

        // check if the gate name already exists in existingGate
        
        // Assign a **new unique ID**
        gate.id = ++maxId;

        levelledGatesObj[levelKey].push(gate);
        
        
    });

    return levelledGatesObj;
}
