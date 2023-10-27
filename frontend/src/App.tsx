
import React, { useState, useEffect } from "react"
import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import './styles/App.css';
import { User } from "./models/user";
import * as JournalsApi from "./utils/journal_api";

const App = () => {
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

  return loggedInUser ? (
    <AuthenticatedApp />
  ) : (
    <UnauthenticatedApp />
  );
};

export default App;
