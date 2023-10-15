import React, { useState, useEffect } from "react"
import styles from "../styles/Journal.module.css";
import { Card } from "react-bootstrap";
import { Journal as JournalModel } from "../models/journal";
import { mapStringToEmoji } from "../utils/mapStringToEmoji";
import { formatDate } from "../utils/formatDate";

interface JournalProps {
    journal: JournalModel,
    className?: string,
}

const Journal = ({ journal, className } : JournalProps) => {

    const {
        mood,
        journalEntry,
        date
    } = journal;
    
    //format date to month day, year
    const formattedDate = formatDate(date);

    // Convert mood to emoji
    const moodEmoji = mapStringToEmoji(mood);
    
    return  (
        <Card className={`${styles.journalCard} ${className}`}>
            <Card.Body className={styles.cardBody}>
            <Card.Title>
            {moodEmoji && <span>{moodEmoji}</span>} {formattedDate}
            </Card.Title>
            <Card.Text className={styles.cardText}>
                {journalEntry}
            </Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Journal;