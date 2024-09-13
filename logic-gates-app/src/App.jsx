import logo from './logo.svg';
import './App.css';
import axios from 'axios'

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1 className="Header">Logic Gates Schematic</h1>
      </header>
      <div>
        <div className="content-area">
          
        </div>
        <div className="user-input">
          <textarea name="user-input" id="user-input"></textarea>
        </div>
      </div>
      
    </div>
  );
}

export default App;
