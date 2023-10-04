import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import { Button } from 'react-bootstrap';
import { Journal } from './models/journal';

function App() {
const [journals, setJournals] = useState<Journal[]>([]);

useEffect(() => {
  async function loadJournals() {
    try {
      const response = await fetch("/api/journals", { method: "GET"});
      const journals = await response.json();
      setJournals(journals);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }
  loadJournals();
}, []);

  return (
    <div className="App">
      {JSON.stringify(journals)}
    </div>
  );
}

export default App;
