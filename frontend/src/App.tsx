import React from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';

const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Router>
      <Sidebar/>

      <div className="content">
        
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as needed */}
          </Routes>
          </div>
        </Router>
        
      </div>
    
  );
};

export default App;
