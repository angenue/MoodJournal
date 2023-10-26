import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import MoodDataPage from "./components/graph/MoodDataPage";
import {Journal as JournalModel } from './models/journal';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import * as JournalsApi from "./utils/journal_api";
import SignUp from "./components/SignUp";

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
            <Route path="/Graph" element={<MoodDataPage/>} /> 
            <Route path="/SignUp" element={<SignUp onDismiss={() => {}} onSignUpSuccessful={() => {}}/>} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;
