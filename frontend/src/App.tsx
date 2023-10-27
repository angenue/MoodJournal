
import React, { useState, useEffect } from "react"
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import './styles/App.css';
import { User } from "./models/user";
import * as JournalsApi from "./utils/journal_api";
import { Route, BrowserRouter as Router, Routes} from "react-router-dom";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function fetchLoggedInUser() {
      try {
        const user = await JournalsApi.getLoggedInUser();
        setLoggedInUser(user);
        setIsLoggedIn(!!user);
        console.log(isLoggedIn)
      } catch (error) {
        console.error(error);
        
      }
    }
    fetchLoggedInUser();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  const handleLogin = (user: any) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  return (
    <Router>
      {isLoggedIn ? <AuthenticatedApp loggedInUser={loggedInUser} onLogout={handleLogout}/> : <UnauthenticatedApp onLogin={handleLogin}/>}
    </Router>
  );
};

export default App;
