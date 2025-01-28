import './App.css';
import axios from 'axios'
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons
import { GatesProvider } from './context/GatesContext';
import { ConnectionsProvider } from './context/ConnectionsContext';
import { GatesPositionProvider } from './context/GatesPositionContext';

import { useEffect } from 'react';

import Grid from './components/background-grid';

import Home from './pages/home';

function App() {
  
  return (
    <GatesProvider>
      <GatesPositionProvider>
        <ConnectionsProvider>
          <Home />
        </ConnectionsProvider>
      </GatesPositionProvider>
    </GatesProvider>
  );
}

export default App;
