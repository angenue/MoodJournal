import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import { Button } from 'react-bootstrap';
import { Journal as JournalModel} from './models/journal';
import Journal from './components/Journal';

function App() {
const [journals, setJournals] = useState<JournalModel[]>([]);

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
    <div>
      {journals.map(journal => (
        <Journal journal={journal} key={journal._id}/>
      ))}
    </div>
  );
}

export default App;
