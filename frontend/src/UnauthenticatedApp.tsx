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
  onLogin: (user: User) => void,
  loggedInUser: User | null
}

const UnauthenticatedApp = ({onLogin, loggedInUser}: UnauthenticatedAppProps) => {


  return (
    
    <Routes>
      <Route path="/" element={<Login onLoginSuccessful={(loggedInUser) => {
onLogin(loggedInUser);
      }}/>} />
      <Route path="/signup" element={<SignUp onSignUpSuccessful={(loggedInUser) => {
          onLogin(loggedInUser);
      }} />} />
    </Routes>
  
  );
};

export default UnauthenticatedApp;
