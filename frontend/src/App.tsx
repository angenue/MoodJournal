import React from 'react';
import Sidebar from './components/Sidebar';
import HomePage from './components/HomePage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';

const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar/>

      <div className="content">
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more routes as needed */}
          </Routes>
        </Router>
      </div>
    </div>
  );
};

export default App;
