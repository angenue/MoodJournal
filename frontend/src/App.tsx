import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import {Journal as JournalModel } from './models/journal';
import Journal from "./components/Journal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import * as JournalsApi from "./utils/journal_api";

const App = () => {


  return (
    <div style={{ display: 'flex' }}>
      <Router>
        <Sidebar />
        <div className="content">
          <TopNav />

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Calendar" element={<YearlyCalendar/>} /> 
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
