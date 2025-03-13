export function assignGateLevel(existingGates, gatesToBeProcessed) {


    let levelledGatesObj = JSON.parse(JSON.stringify(existingGates));

    // Get the highest existing ID
    let maxId = Object.values(existingGates)
        .flat()
        .reduce((max, gate) => Math.max(max, gate.id), 0); // Find the highest existing ID

    gatesToBeProcessed.forEach(gate => {
        const levelKey = `level${gate.level}`;
        console.log('level and gate is: ', levelKey, gate)

        if (!levelledGatesObj[levelKey]) {
            levelledGatesObj[levelKey] = [];
        }

        // Check if the gate already exists
        const existingGatesInLevel = existingGates[levelKey] || [];
        console.log('existinggates = ', existingGates)
        console.log('existingGAtes with Level=', existingGates[levelKey])
        

        // check if the gate name already exists in existingGate
        
        // Assign a **new unique ID**
        gate.id = ++maxId;

        levelledGatesObj[levelKey].push(gate);
        console.log('levelledGatesObj itself:',levelledGatesObj);
        console.log('levelledGatesObj at this specific level key:',levelledGatesObj[levelKey]);
        
    });

    return levelledGatesObj;
}
