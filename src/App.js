import logo from './logo.svg';
import './App.css';

// import QCEngine from './simulator/myQCEngine'
// import './simulator/testQCENgine'
// import QuantumCircuit from "./simulator/quantum-circuit.min.js";

function App() {
  let QuantumCircuit = require('./simulator/quantum-circuit.min.js')
  var circuit = new QuantumCircuit(3);
  circuit.addGate("h", 0, 1);
  
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
