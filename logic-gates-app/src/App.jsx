import './App.css';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons


import { useEffect } from 'react';

import Grid from './components/background-grid';

import Home from './pages/home';

function App() {
  
  return (
    <Home />
  );
}

export default App;
