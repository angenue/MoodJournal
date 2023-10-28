
import React, { useState, useEffect, useMemo } from "react"
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import './styles/App.css';
import { User } from "./models/user";
import * as JournalsApi from "./utils/journal_api";
import { Navigate, Route, BrowserRouter as Router, Routes, useNavigate} from "react-router-dom";

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

  console.log('isLoggedIn:', isLoggedIn);
console.log('loggedInUser:', loggedInUser);

const navigate = useNavigate();

useEffect(() => {
    if (isLoggedIn && loggedInUser) {
      if (window.location.pathname === "/" || window.location.pathname === "/SignUp") {
        navigate("/Home", { replace: true });
      }
    } else {
      if (window.location.pathname !== "/SignUp") {
        navigate("/", { replace: true }); // Navigate to login if user is not logged in
      }
    }
  }, [isLoggedIn, loggedInUser, navigate]);

return (
 
    <Routes>
      <Route
        path="*"
        element={
          isLoggedIn && loggedInUser ? (
            <AuthenticatedApp loggedInUser={loggedInUser} onLogout={handleLogout} />
          ) : (
            <UnauthenticatedApp loggedInUser={loggedInUser} onLogin={handleLogin} />
          )
        }
      />
    </Routes>
 
);
};

export default App;
