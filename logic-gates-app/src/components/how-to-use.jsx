import { useEffect, useState } from "react";

function HowToUse({toggleHowToUse}) {

    const [showOverlay, setShowOverlay] = useState(true)

    useEffect(() => {
        const timer = setTimeout(() => {
          setShowOverlay(false);
        }, 3000);
    
        return () => clearTimeout(timer); // clean up
      }, []);

    return (
        <>
        {showOverlay && <div className="how-to-use-overlay"></div>}

            <div className="how-to-use-popup">
                <span className="close-button" onClick={toggleHowToUse}>x</span>
                <h2> How to Use the Logic Gate App 🤔</h2>
                
                <ol>
                <li>
                    <strong>Enter Logic Description:</strong><br />
                    Use the input box to type your logic using a simple format. Example:
                    <pre>
                    name: Gate1;<br />
                    type: AND;<br />
                    input: A, B;<br />
                    output: C; <br />
                    level: 2; *optional*
                    </pre>
                    *Note: The application defines each gate through its name, it is crucial that each gate contains an unqiue name.
                </li>
        
                <li>
                    <strong>Click "Create Gate":</strong><br />
                    <span>
                        This will add your gate(s) to the canvas. <br /><br />
                        <ol type="a">
                            <li>
                                The first time you click 'Create Gate', it will use an algorithm based on input and output of gates to arrange the levels. 
                            </li>
                            <li>
                                On the second time, you have to declare the levels of each gate, 
                                unless you want it to be added to the highest level of the schematic
                            </li>
                        </ol>
                        
                    </span>
                    

                </li>

                <li>
                    <strong>Use AI:</strong><br />
                    <span>
                        Use AI to help structure your schematic, just click on the 'Use AI' button,
                        enter your prompt and click 'Create Gate'. <br /><br />
                        *Note: Input text like how you use ChatGPT.
                    </span>
                </li>
        
                <li>
                    <strong>Delete Gates:</strong><br />
                    Click a gate to select it, then hit "Delete Gate" in the tools window to remove it.
                </li>
        
                <li>
                    <strong>Save Projects:</strong><br />
                    If you're logged in, you can save your project using the "Save" button.
                </li>
        
                <li>
                    <strong>Load Projects:</strong><br />
                    Use the sidebar to view and load previously saved projects.
                </li>
        
                <li>
                    <strong>Download Netlist:</strong><br />
                    Click on the Download Netlist in the toolbar window <br />
                    It will export the gate structure for others to easily view it on this platform.
                </li>

                <li>
                    <strong>Clear All Gates:</strong><br />
                    To quickly clear the entire canvas, click on the <span style={{color: "red"}}>Clear All Gates</span> button in the toolbar window highlighted in red.
                    
                </li>
                </ol>
        
                <p className="note">Tip: Make sure all gates have unique outputs as circular dependencies
                    &#40;outputs that depend on itself to render&#41;
                    will not render properly OR define it's level manually</p>
            </div>
        </>
    );
  }
  
  export default HowToUse;
  