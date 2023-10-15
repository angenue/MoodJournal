import React, { useState, useEffect } from "react"
import styles from "../styles/Journal.module.css";
import { Card } from "react-bootstrap";
import { Journal as JournalModel } from "../models/journal";
import { mapStringToEmoji } from "../utils/mapStringToEmoji";
import { formatDate } from "../utils/formatDate";
import { Col, Container, Row } from "react-bootstrap";
import * as JournalsApi from "../utils/journal_api";

interface JournalProps {
    className?: string;
  }
  
  const Journal: React.FC<JournalProps> = ({ className }) => {
    const [journals, setJournals] = useState<JournalModel[]>([]);
  
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
  
    return (
      <Container>
        <Row xs={1} md={2} xl={3} className="g-4">
          {journals.map((journal) => (
            <Col key={journal._id}>
              <Card className={`${styles.journalCard} ${className}`}>
                <Card.Body className={styles.cardBody}>
                  <Card.Title>
                    {mapStringToEmoji(journal.mood) && (
                      <span>{mapStringToEmoji(journal.mood)}</span>
                    )}{" "}
                    {formatDate(journal.date)}
                  </Card.Title>
                  <Card.Text className={styles.cardText}>
                    {journal.journalEntry}
                  </Card.Text>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    );
  };

export default Journal;
