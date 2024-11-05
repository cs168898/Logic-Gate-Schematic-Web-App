import axios from 'axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons


import { useEffect } from 'react';

import Grid from '../components/background-grid';
import Header from '../components/header';

function Home() {
  // Drag start handler for regular drag functionality
  function dragstartHandler(ev) {
    ev.dataTransfer.setData("text/plain", ev.target.id);
  }

  // Custom drag and drop function
  function dragAndDrop() {
    let cursor = { x: null, y: null }; // Cursor position
    let userInputPosition = { dom: null, x: null, y: null }; // Element position

    document.addEventListener('mousedown', (event) => {
      if (event.target.classList.contains('user-input2') || event.target.classList.contains('sidebar')) {
        // Record initial cursor position and element position on mousedown
        cursor = { x: event.clientX, y: event.clientY };
        userInputPosition = {
          dom: event.target,
          x: event.target.getBoundingClientRect().left,
          y: event.target.getBoundingClientRect().top
        };
      }
    });

    document.addEventListener('mousemove', (event) => {
      if (userInputPosition.dom === null) return; // Only run if the element is selected
      const currentCursor = { x: event.clientX, y: event.clientY };
      const distance = {
        x: currentCursor.x - cursor.x, // Distance moved horizontally
        y: currentCursor.y - cursor.y  // Distance moved vertically
      };
      // Update the element's position based on distance moved
      userInputPosition.dom.style.left = (userInputPosition.x + distance.x) + 'px';
      userInputPosition.dom.style.top = (userInputPosition.y + distance.y) + 'px';
      userInputPosition.dom.style.cursor = 'grab';
    });

    document.addEventListener('mouseup', () => {
      if(userInputPosition.dom == null ) return;
        userInputPosition.dom.style.cursor = 'auto';
        userInputPosition.dom = null; // Stop dragging when the mouse button is released
    });
  }

  // useEffect hook to initialize dragAndDrop on component mount
  useEffect(() => {
    dragAndDrop(); // Initialize the custom drag and drop behavior
  }, []); // Run once after component mounts

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
            <textarea
              name="user-input"
              className='user-input2'
              
              id="user-input"
              placeholder='-Enter your logic here-'
              
            ></textarea>
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