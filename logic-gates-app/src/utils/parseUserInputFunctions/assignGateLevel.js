export function assignGateLevel(existingGates, gatesToBeProcessed) {
    function isEmpty(obj) {
        return Object.keys(obj).length === 0;
    }
    
    let levelledGatesObj = JSON.parse(JSON.stringify(existingGates));
    let highestLevelForThisRun = null;

    // iterate in reverse and find the first array that is non empty
    // then the highest level is adding one to that level
    for(let i = Object.keys(levelledGatesObj).length ; i > 0 ;  i--){
        if (!isEmpty(levelledGatesObj)){
            highestLevelForThisRun = i + 1
            break;
        }
    }
    console.log('the highest level for this run: ', highestLevelForThisRun)
     

    // Get the highest existing ID
    let maxId = Object.values(existingGates)
        .flat()
        .reduce((max, gate) => Math.max(max, gate.id), 0); // Find the highest existing ID

    gatesToBeProcessed.forEach(gate => {
        let levelKey = ''
        if(!gate.level){
            // if level key is not declared, 
            // assign their level to the highest level
            gate.level = highestLevelForThisRun
        } 

        levelKey = `level${gate.level}`
        

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
