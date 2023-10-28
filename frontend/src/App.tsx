
import React, { useState, useEffect, useMemo } from "react"
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import './styles/App.css';
import { User } from "./models/user";
import * as JournalsApi from "./utils/journal_api";
import { Navigate, Route, BrowserRouter as Router, Routes} from "react-router-dom";

const App = () => {
  const [loggedInUser, setLoggedInUser] = useState<User|null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await JournalsApi.getLoggedInUser();
        setLoggedInUser(user);
        setIsLoggedIn(!!user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, []);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoggedInUser(null);
  };

  const handleLogin = (user: User) => {
    setIsLoggedIn(true);
    setLoggedInUser(user);
  };

  return (
    <Router>
      {isLoggedIn ? (
        <AuthenticatedApp loggedInUser={loggedInUser} onLogout={handleLogout} />
      ) : (
        <Routes>
          <Route
            path="/"
            element={<Navigate to="/Home" replace />}
          />
          <Route
            path="/signup"
            element={<Navigate to="/Home" replace />}
          />
          <Route
            path="/Home"
            element={<UnauthenticatedApp loggedInUser={loggedInUser} onLogin={handleLogin} />}
          />
        </Routes>
      )}
    </Router>
  );
};

export default App;
