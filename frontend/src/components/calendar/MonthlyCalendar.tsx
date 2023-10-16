// MonthlyCalendar.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../../styles/MonthlyCalendar.css";
import JournalEntryPopup from "../JournalEntryPopup";
import { Journal as JournalModel } from "../../models/journal";
import * as JournalsApi from "../../utils/journal_api";
import { ToastContainer } from "react-toastify";
import { errorMessage, successMessage } from "../../utils/toastMessage";

interface MonthlyCalendarProps {
  year: number;
  month: number;
}
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ year, month }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalModel | null>(
    null
  );


  const handleDateClick = async (date: Date) => {
    setSelectedDate(date);
    try {
      const allJournals = await JournalsApi.fetchJournals();

      const filteredJournals = allJournals.filter((journal) => {
        const journalDate = new Date(journal.date);
        return (
          journalDate.getFullYear() === date.getFullYear() &&
          journalDate.getMonth() === date.getMonth() &&
          journalDate.getDate() === date.getDate()
        );
      });

      setSelectedJournal(filteredJournals[0]|| null); // Set selected journal or null if none found
      setIsPopupOpen(true); // Open the popup regardless of whether a journal was found
      console.log("Is Popup Open?", isPopupOpen);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handlePopupSave = (journal: JournalModel) => {
    // Handle saving the journal entry to the database with the selected date, mood, and journal entry
    console.log(journal);
    setIsPopupOpen(false);
  };
  
  const closePopup = () => {
    setSelectedDate(null);
    setIsPopupOpen(false);
  };
  

  return (
    <div className="monthly-calendar">
      <ToastContainer />
      <Calendar
        value={selectedDate}
        view="month"
        formatShortWeekday={(locale, date) =>
          new Intl.DateTimeFormat(locale, { weekday: "short" })
            .format(date)
            .charAt(0)
        }
        tileClassName={({ date }) => {
          return date.getDate() === 1 ? "start-of-month" : "";
        }}
        onClickDay={handleDateClick}
      />


      {isPopupOpen && (
        <JournalEntryPopup
          journalToEdit={selectedJournal || undefined}
          onCancel={() => {
            closePopup();
            setSelectedJournal(null);
          }}
          selectedDate={selectedDate as Date}
          onSave={handlePopupSave}
        />
      )}
    </div>
  );
};

export default MonthlyCalendar;
