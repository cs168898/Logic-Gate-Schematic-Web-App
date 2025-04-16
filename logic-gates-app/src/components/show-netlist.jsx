function ShowNetlist({gates}){

    const levels = Object.values(gates); // Array of arrays
    console.log('levels = ', levels)
    const allExistingGates = levels.flat().map(gate => 
        `name: ${gate.name}; 
type: ${gate.type}; 
input: ${gate.input}; 
output: ${gate.output}; 
level: ${gate.level};

`
).join('');

    return(
        <div className="netlist-input">
            <span className="netlist-title">Netlist</span>
            <div className="netlist-input-inner">
                {/* <span>Current Netlist</span> */}
                <textarea className="netlist-textarea" value={allExistingGates}/>
            </div>
            
        </div>
    )
}


export default ShowNetlist