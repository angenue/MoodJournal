import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import MoodDataPage from "./components/graph/MoodDataPage";
import { BrowserRouter as Router, Route, Routes,useNavigate } from 'react-router-dom';
import './styles/App.css';
import { User } from './models/user';
import * as JournalsApi from "./utils/journal_api";
import 'react-toastify/dist/ReactToastify.css';
import { successMessage } from "./utils/toastMessage";

interface AuthenticatedAppProps {
  onLogout: () => void;
  loggedInUser: User | null; // Assuming onLogin is a function that doesn't return anything
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