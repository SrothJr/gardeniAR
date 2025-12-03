import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import WeedIdentifier from './components/WeedIdentifier';
import Home from './components/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/identify" element={<WeedIdentifier />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
