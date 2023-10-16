import React, { useState, useEffect } from "react"
import styles from "../styles/Journal.module.css";
import { Card } from "react-bootstrap";
import { Journal as JournalModel } from "../models/journal";
import { mapStringToEmoji } from "../utils/mapStringToEmoji";
import { formatDate } from "../utils/formatDate";
import { Col, Container, Row } from "react-bootstrap";
import * as JournalsApi from "../utils/journal_api";
import {MdDelete} from"react-icons/md";
import { errorMessage, successMessage } from "../utils/toastMessage";
import { ToastContainer } from 'react-toastify';
import JournalEntryPopup from './JournalEntryPopup';

interface JournalProps {
    className?: string,
    //onJournalClicked: (journal: JournalModel) => void,
  }
  
  const Journal: React.FC<JournalProps> = ({ className }) => {
    const [journals, setJournals] = useState<JournalModel[]>([]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [selectedJournal, setSelectedJournal] = useState<JournalModel | null>(null);

  
    useEffect(() => {
      async function loadJournals() {
        try {
          const journals = await JournalsApi.fetchJournals();
          setJournals(journals);
        } catch (error) {
          console.error(error);
          alert(error);
        }
      }
      loadJournals();
    }, []); 

    async function deleteJournal(journal:JournalModel) {
      try {
        await JournalsApi.deleteJournal(journal._id);
        setJournals(journals.filter(existingJournal => existingJournal._id !== journal._id));
        successMessage("💗 Diary Deleted");
      } catch (error) {
        errorMessage("Delete Diary")
        console.error(error);
        alert(error);
      }
    }

    const handlePopupSave = (journal:JournalModel) => {
      // Handle saving the journal entry to the database with the selected date, mood, and journal entry
      console.log(journal);
      setIsPopupOpen(false);
    };

    async function onJournalClicked(journal:JournalModel) {
      try {
        setSelectedJournal(journal);
        setIsPopupOpen(true);
      } catch (error) {
        errorMessage("Could Not Open Journal")
        console.error(error);
        alert(error);
      }
    }
  
    return (
      <Container>
        <ToastContainer />
        <Row xs={1} md={2} xl={3} className="g-4">
          {journals.map((journal) => (
            <Col key={journal._id}>

              <Card className={`${styles.journalCard} ${className}`} 
              onClick={() => onJournalClicked(journal)}>
                <Card.Body className={styles.cardBody}>

                  <Card.Title className={styles.flexCenter}>
                    {mapStringToEmoji(journal.mood) && (
                      <span>{mapStringToEmoji(journal.mood)}</span>
                    )}{" "}

                    {formatDate(journal.date) }
                    
                    <MdDelete 
                    onClick={(e) => {
                      deleteJournal(journal);
                      e.stopPropagation();
                    }}
                    />
                  </Card.Title>

                  <Card.Text className={styles.cardText}>
                    {journal.journalEntry}
                  </Card.Text>
                </Card.Body>
              </Card>

            </Col>
          ))}
        </Row>

       {/* {selectedJournal && (
  <JournalEntryPopup
    journalToEdit={selectedJournal}
    onCancel={() => setSelectedJournal(null)}
    onSave={(updatedJournal) => {
      setJournals(journals.map(existingJournal => existingJournal._id === updatedJournal._id ? updatedJournal : existingJournal));
      setSelectedJournal(null);
    }}
  />
)}

  */}

			
      </Container>
    );
  }

export default Journal;
