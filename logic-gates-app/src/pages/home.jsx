import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons


import { useEffect, useState } from 'react';
import axios from 'axios';

// Component Imports
import Grid from '../components/background-grid';
import Header from '../components/header';

// Utilities (functions) Imports
import { parseUserInput } from '../utils/parseUserInput';
import { dragAndDrop } from '../utils/dragAndDrop'; // Allows users to drag and drop text area and sidebar windows



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
    
  return (
    <div className="App">
        <Header />
      <div className='main-wrapper'>
  
          <Grid />
        
        <div className="body-wrapper">
          
          <div className="sidebar">
            
            
            <div className="sidebar-tools">
            
            <h2>Sidebar</h2>
            
              <p>Sidebar Tools</p>
            </div>
          </div>

          <div className="content-area ">
            <h2>Main Content Area</h2>
          </div> {/*content-area*/}

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
          
          
        </div> {/*body wrapper container*/}
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