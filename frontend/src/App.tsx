import React, { useState, useEffect } from "react"
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import HomePage from './components/HomePage';
import YearlyCalendar from './components/calendar/YearlyCalendar';
import {Journal as JournalModel } from './models/journal';
import Journal from "./components/Journal";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './styles/App.css';
import { Col, Container, Row } from "react-bootstrap";
import styles from "./styles/CalendarPage.module.css";

const App = () => {

  const [journals, setJournals] = useState<JournalModel[]>([]);

    useEffect(() => {
        async function loadJournals() {
            try {
                const response = await fetch("api/journals", {method: "GET"});
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
    <div style={{ display: 'flex' }}>
      <Router>
      <Sidebar/>
      <div className="content">
      <TopNav/>


      <Container>
        <Row xs={1} md={2} xl={3} className="g-4">
      {journals.map(journal => (
        <Col  key={journal._id}>
        <Journal journal={journal} className={styles.journal}/>
        </Col>
      ))}
      </Row>
      </Container>


          {/*<Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/Calendar" element={journals.map(journal => (
        <Journal journal={journal} key={journal._id}/>
      ))} /> 
            </Routes> */}
          </div>
        </Router>
        
      </div>
    
  );
};

export default App;
