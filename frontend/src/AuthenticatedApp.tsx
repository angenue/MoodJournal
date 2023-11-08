import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import MoodDataPage from "./components/graph/MoodDataPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { User } from './models/user';
import 'react-toastify/dist/ReactToastify.css';

interface AuthenticatedAppProps {
  onLogout: () => void;
  loggedInUser: User | null;
}

const AuthenticatedApp = ({ onLogout, loggedInUser }: AuthenticatedAppProps) => {
  return (
    <div style={{ display: 'flex' }}>
     
        <Sidebar onLogoutSuccessful={onLogout}/>
        <div className="content">
          <TopNav/>

          <Routes>
            <Route path="/Home" element={<HomePage />} />
            <Route path="/Calendar" element={<YearlyCalendar/>} /> 
            <Route path="/Graph" element={<MoodDataPage/>} /> 
          </Routes>
        </div>
      
    </div>
  );
};

export default AuthenticatedApp;
