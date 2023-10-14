import React, { useState, useEffect } from "react"
import styles from "../styles/Journal.module.css";
import { Card } from "react-bootstrap";
import { Journal, Journal as JournalModel } from "../models/journal";

interface JournalProps {
    journal: JournalModel,
}

const Journal = ({ journal } : JournalProps) => {

    const {
        mood,
        journalEntry,
        date
    } = journal;
    return  (
        <Card className={styles.journalCard}>
            <Card.Body>
            <Card.Title>
                {mood} 
            </Card.Title>
            <Card.Text className={styles.cardText}>
                {journalEntry}
            </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Journal;