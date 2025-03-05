import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { sideBarFunction } from '../utils/sidebar';


function Header({ onSidebarToggle }) {
  

  return (
    <header className="App-header">
      <FontAwesomeIcon icon={faBars}
       className='sidebar-icon' 
       id='sidebar-icon' 
       onClick={onSidebarToggle}/>
      

      <h1 className="Header">Logic Gates Schematic</h1>
           
    </header>
  )
}

export default Header;