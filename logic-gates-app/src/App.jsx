import './App.css';
import axios from 'axios'
import {
  BrowserRouter as Router,
  Routes,
  Route
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';  // Import specific icons
import { GatesProvider } from './context/GatesContext';
import { ConnectionsProvider } from './context/ConnectionsContext';
import { GatesPositionProvider } from './context/GatesPositionContext';
import { UserProvider } from './context/UserContext';
import { SuccessContext, SuccessProvider } from './context/SuccessContext';

import { useEffect } from 'react';

import Grid from './components/background-grid';

import Home from './pages/home';
import VerifyPage from './components/verify-page';


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/verify" element={<VerifyPage />} />
        <Route path="*" element={
          <SuccessProvider>
            <GatesProvider>
              <GatesPositionProvider>
                <ConnectionsProvider>
                  <UserProvider>
                    <Home />
                  </UserProvider>
                </ConnectionsProvider>
              </GatesPositionProvider>
            </GatesProvider>
          </SuccessProvider>
        } />
      </Routes>
    </Router>
  );
}

export default App;
