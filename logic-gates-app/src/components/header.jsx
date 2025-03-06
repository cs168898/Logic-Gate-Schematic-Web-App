import React, { useState, useContext } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import { sideBarFunction } from '../utils/sidebar';
import Login from './login';

import { UserContext } from '../context/UserContext';


function Header({ onSidebarToggle }) {
  const [seen, setSeen] = useState(false);
  const {  user, setUser, loggedin, setLoggedin  } = useContext(UserContext);

  function togglePop (){
    setSeen(!seen);
  }

  function logOut() {
    // Clear any authentication tokens or session data here
    setLoggedin(false);
    setUser(null);
    console.log('Logged out successfully');
  }

  return (
    <header className="App-header">
      <FontAwesomeIcon icon={faBars}
       className='sidebar-icon' 
       id='sidebar-icon' 
       onClick={onSidebarToggle}/>
      

      <h1 className="Header">Logic Gates Schematic</h1>
      <p> {loggedin ? user.username : ''}</p>
      <button onClick={loggedin ? logOut: togglePop}>{loggedin? 'Logout' : 'Login'}</button>
      {seen ? <Login toggle={togglePop} setLoggedin={setLoggedin} setUser={setUser} /> : null}

    </header>
  )
}

export default Header;