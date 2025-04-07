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
                    This will add your gate(s) to the canvas.
                </li>
        
                <li>
                    <strong>Delete Gates:</strong><br />
                    Click a gate to select it, then hit "Delete Gate" to remove it.
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
                    Export the gate structure for others to easily view it on this platform.
                </li>

                <li>
                    <strong>Clear All Gates:</strong><br />
                    A quick way to completely remove all logic gates on the canvas.
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
  