import { useContext, useEffect, useState } from 'react';

// Component Imports
import Grid from '../components/background-grid';
import Header from '../components/header';

// Utilities (functions) Imports
import { parseUserInput } from '../utils/parseUserInput';
import { dragAndDrop } from '../utils/dragAndDrop'; // Allows users to drag and drop text area and sidebar windows
import LogicGateCanvas from '../utils/LogicGateCanvas';
import { GatesContext } from '../context/GatesContext';
import { GatesPositionContext } from '../context/GatesPositionContext';


function Home() {
  /***************************** useState Definitions ***************************/
  const [userInput, setuserInput] = useState("")
  const [parsedUserInput, setParsedUserInput] = useState("")

  const { gates, setGates } = useContext(GatesContext);

  const { gatePositions, setGatePositions } = useContext(GatesPositionContext);

  const [selectedGateId, setSelectedGateId] = useState(null);



  /***************************** End Of useState Definitions ********************/


  /***************************** useEffect Statements ***************************/

    // useEffect hook to initialize dragAndDrop on component mount
    useEffect(() => {
      dragAndDrop(); // Initialize the custom drag and drop behavior
    }, []); // Run once after component mounts

  /***************************** End Of UseEffect Statements ***************************/
  
  /***************************** Event Handlers ***************************/
  
  // Handle clicking on a gate to select it
  const handleSelectGate = (id) => {
    if(id === selectedGateId){
      setSelectedGateId(null);
    } else{
      setSelectedGateId(id);
    }
    
  };

  // Handle deleting the selected gate
  const handleDeleteGate = () => {
    if (selectedGateId !== null) {
      // Remove the gate from gates
      setGates((prev) => prev.filter((gate) => gate.id !== selectedGateId));
  
      // Remove the gate's positions from gatePositions
      setGatePositions((prev) => {
        const { [selectedGateId]: _, ...rest } = prev; // Update the gatePositions state with the key selectedGateId to '_' which is a placeholder variable (not used).
        console.log("Updated gatePositions after deletion:", rest);
        return rest;
      });
  
      setSelectedGateId(null); // Clear selection
    }
  };

/***************************** End Of Event Handlers ***************************/



  // Create the handleSubmit function to send userInput into backend
  const handleSubmit = async () =>{
    try{
      console.clear(); // clear the console of all previous logs
      console.log(`The user input is: ${userInput}`)
      const gateData = parseUserInput(userInput, gates); // Parse user input before sending it to backend
      console.log("Gate Data: ", gateData)
      setGates([...gates, ...gateData]) // Keep track of all the logic gate inside the 'gates' variable
      
      //const response = await axios.post('http://127.0.0.1:8000/logicgates/', gateData);
      //console.log("Logic Gate Created: ", response.data);
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    }

  }
  
  const handleClearGates = async () =>{
    try{
      

      setGates([]) // Keep track of all the logic gate inside the 'gates' variable
      setGatePositions({}); // Clear all wire positions
      setSelectedGateId(null); // Clear selection
      console.clear();
      //const response = await axios.post('http://127.0.0.1:8000/logicgates/', gateData);
      //console.log("Logic Gate Created: ", response.data);
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    }

  }
    
  return (
    <div className="App">
        <Header />
      <div className='main-wrapper'>
  
        <Grid />
        
        <div className="content-overlay">
          
          <div className="tools-window">
            
            
            <div className="tools-window-inner">
              <h2>Tools</h2>
            
              <button className='clear' onClick={handleClearGates}>Clear All Gates
              </button>

            </div>
          </div>

          <LogicGateCanvas
            setSelectedGateId={handleSelectGate}
            selectedGateId={selectedGateId}
          />
          
          <div className="user-input">
            <div className="textarea-button-container">
              <textarea
                className='user-input2'
                id="user-input"
                name="user-input"
                placeholder='-Enter your logic here-'
                value={userInput}
                onChange={(e) => setuserInput(e.target.value)}
                autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false"
              ></textarea>
              <div className="button-wrapper">
                <button className="create-button" onClick={handleSubmit}>
                  Create Gate
                </button>
                <button className="delete-button" onClick={handleDeleteGate} disabled={selectedGateId === null}>
                  Delete Gate
                </button>
              </div>
            </div>
          </div> {/*user-input*/}
          
          
        </div> {/*content overlay container*/}
      </div>
    </div>
  );
}

export default Home;

/////////////////////////////   NOTES ////////////////////////////

{/*
    1. Create the grid background with tracking capability to allow the user to insert logic gates
    in specific grid region. DONE
    
    2. Create the parsing logic from user input.

    3. Display the location of the logic gates through the parsing logic.

    4. Create stimulation of logic flow.

    5. Create additional logic gates.
    
*/}