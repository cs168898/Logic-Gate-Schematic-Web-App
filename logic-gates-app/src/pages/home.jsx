import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons

import { useEffect, useState } from 'react';
import { Stage, Layer, Rect, Text } from 'react-konva';

import axios from 'axios';

// Component Imports
import Grid from '../components/background-grid';
import Header from '../components/header';

// Utilities (functions) Imports
import { parseUserInput } from '../utils/parseUserInput';
import { dragAndDrop } from '../utils/dragAndDrop'; // Allows users to drag and drop text area and sidebar windows
import LogicGateCanvas from '../utils/LogicGateCanvas.jsx';



function Home() {
  /***************************** useState Definitions ***************************/
  const [userInput, setuserInput] = useState("")
  const [parsedUserInput, setParsedUserInput] = useState("")

  const [gates, setGates] = useState([]);
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
      setGates(gates.filter((gate) => gate.id !== selectedGateId));
      setSelectedGateId(null);
    }
  };

/***************************** End Of Event Handlers ***************************/



  // Create the handleSubmit function to send userInput into backend
  const handleSubmit = async () =>{
    try{
      console.log(`The user input is: ${userInput}`)
      const gateData = parseUserInput(userInput, gates); // Parse user input before sending it to backend

      setGates([...gates, gateData])

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
          
          <div className="sidebar">
            
            
            <div className="sidebar-tools">
              <h2>Sidebar</h2>
            
              <p>Sidebar Tools</p>
            </div>
          </div>

          <LogicGateCanvas
            gates={gates}
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
                autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
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