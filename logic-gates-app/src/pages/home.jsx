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


  /***************************** End Of useState Definitions ********************/


  /***************************** useEffect Statements ***************************/

    // useEffect hook to initialize dragAndDrop on component mount
    useEffect(() => {
      dragAndDrop(); // Initialize the custom drag and drop behavior
    }, []); // Run once after component mounts

  /***************************** End Of UseEffect Statements ***************************/
  
  // Create the handleSubmit function to send userInput into backend
  const handleSubmit = async () =>{
    try{
      console.log(`The user input is: ${userInput}`)
      const gateData = parseUserInput(userInput); // Parse user input before sending it to backend

      const response = await axios.post('http://127.0.0.1:8000/logicgates/', gateData);
      console.log("Logic Gate Created: ", response.data);
    } catch (error){
      console.error("Error: ", error.message) // Log the error if there are errors that happened in the backend
    }

  }

  const [gate, setGate] = useState({
    name: 'Gate1',
    type: 'AND',
    x: 6 ,  // Initial position of the gate on the canvas
    y: 4 
  });

    
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

          <LogicGateCanvas gate={gate} />
          
          <div className="user-input">
            <div className="textarea-button-container">
              <textarea
                className='user-input2'
                id="user-input"
                name="user-input"
                placeholder='-Enter your logic here-'
                value={userInput}
                onChange={(e) => setuserInput(e.target.value)}
                
              ></textarea>
              <div className="button-wrapper">
                <button className="overlay-button" onClick={handleSubmit}>
                  Create Gate
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