// UnauthenticatedApp.tsx
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
import Login from "./components/Login"
import { User } from "./models/user";

interface UnauthenticatedAppProps {
  onLogin: (user: User) => void // Assuming onLogin is a function that doesn't return anything
}

const UnauthenticatedApp = ({onLogin}: UnauthenticatedAppProps) => {
    const [loggedInUser, setLoggedInUser] = useState<User|null>(null);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await JournalsApi.getLoggedInUser();
        setLoggedInUser(user);
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchLoggedInUser();
  }, []);

  return (
    
    <Routes>
      <Route path="/" element={<Login onLoginSuccessful={(user) => {
onLogin(user);
      }}/>} />
      <Route path="/signup" element={<SignUp onSignUpSuccessful={(user) => {
          onLogin(user);
      }} />} />
    </Routes>
  
  );
};

export default UnauthenticatedApp;
