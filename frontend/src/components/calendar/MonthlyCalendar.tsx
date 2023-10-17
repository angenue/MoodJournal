// MonthlyCalendar.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../../styles/MonthlyCalendar.css";
import JournalEntryPopup from "../JournalEntryPopup";
import { Journal as JournalModel } from "../../models/journal";
import * as JournalsApi from "../../utils/journal_api";
import { errorMessage, successMessage } from "../../utils/toastMessage";
import { ToastContainer } from "react-toastify";

interface MonthlyCalendarProps {
  year: number;
  month: number;
  moodData: Map<string, string>;
  updateMoodData: (year: number) => Promise<void>;
}
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ year, month, moodData, updateMoodData }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(year, month, 1)  // Initialize with the first day of the specified month and year
);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalModel | null>(null);

  useEffect(() => {
    const currentDate = selectedDate || new Date(); // Use selectedDate if it exists, otherwise use the current date
    const currentDateYear = currentDate.getFullYear();
    const currentDateMonth = currentDate.getMonth();
  
    if (currentDateYear !== year || currentDateMonth !== month) {
      setSelectedDate(new Date(year, month, 1));
    }

    console.log(selectedDate);
  }, [year, month, selectedDate]);
  
  

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
      console.log("selected date", selectedDate)
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };

  const handlePopupSave = async (journal: JournalModel) => {
    // Handle saving the journal entry to the database with the selected date, mood, and journal entry
    console.log(journal);
    setIsPopupOpen(false);
    await updateMoodData(year);
  };

  const handlePopupDelete = async (deletedJournal: JournalModel) => {
    try {
      successMessage("💗 Diary Deleted");
      setIsPopupOpen(false);
      await updateMoodData(year);
    } catch (error) {
      errorMessage("Delete Diary");
      console.error(error);
      alert(error);
    }
  };
  
  
  const closePopup = () => {
    //setSelectedDate(null);
    setIsPopupOpen(false);
  };

  function tileClassName({ date }: { date: any }) {
    const formattedDate = date.toISOString().split('T')[0];
    const moodForDate = moodData.get(formattedDate) || '';
    const moodClassName = `react-calendar__tile--mood-${moodForDate.toLowerCase()}`;

    return moodClassName;
  }
  

  return (
    <div className="monthly-calendar">
      <ToastContainer/>
<Calendar
  value={selectedDate}
  activeStartDate={new Date(year, month, 1)}
  view="month"
  tileClassName={(tileClassName)}
  formatShortWeekday={(locale, date) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" })
      .format(date)
      .charAt(0)
  }
  onClickDay={handleDateClick}
  tileDisabled={({ date }) => {
    // Disable tiles for days in other months
    return date.getMonth() !== month;
  }}
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
          onDelete={handlePopupDelete}
        />
      )}
    </div>
  );
};

export default MonthlyCalendar;
