import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import MoodDataPage from "./components/graph/MoodDataPage";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { User } from './models/user';
import * as JournalsApi from "./utils/journal_api";

const AuthenticatedApp = () => {
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
    <div style={{ display: 'flex' }}>
      <Router>
        <Sidebar onLogoutSuccessful={() => setLoggedInUser(null)}/>
        <div className="content">
          <TopNav loggedInUser={loggedInUser}/>

          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Calendar" element={<YearlyCalendar/>} /> 
            <Route path="/Graph" element={<MoodDataPage/>} /> 
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default AuthenticatedApp;
