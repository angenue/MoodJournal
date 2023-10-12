import React from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';

const App = () => {
  return (
    <div style={{ display: 'flex' }}>
      <Router>
      <Sidebar/>

      <div className="content">
      <TopNav/>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Calendar" element={<YearlyCalendar year={2023} />} />
            {/* Add more routes as needed */}
          </Routes>
          </div>
        </Router>
        
      </div>
    
  );
};

export default App;
