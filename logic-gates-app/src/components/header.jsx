import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { sideBarFunction } from '../utils/sidebar';


function Header() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function for sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="App-header">
      <FontAwesomeIcon icon={faBars}
       className='sidebar-icon' 
       id='sidebar-icon' 
       onClick={toggleSidebar}/>
      <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
        <h2>Projects</h2>
        <button className='close-button' onClick={toggleSidebar}> x </button>
      </div>

      <h1 className="Header">Logic Gates Schematic</h1>
           
    </header>
  )
}

export default Header;