// MonthlyCalendar.jsx
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "../../styles/MonthlyCalendar.css";
import JournalEntryPopup from "../JournalEntryPopup";
import { Journal as JournalModel } from "../../models/journal";
import * as JournalsApi from "../../utils/journal_api";
import { getMoodColor } from "../../utils/moodColors";

interface MonthlyCalendarProps {
  year: number;
  month: number;
}
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ year, month }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    new Date(year, month, 1)  // Initialize with the first day of the specified month and year
  );
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedJournal, setSelectedJournal] = useState<JournalModel | null>(
    null
  );
  const [moodData, setMoodData] = useState<Map<string, string>>(new Map());

  useEffect(() => {
    const fetchMoodData = async () => {
      try {
        const allJournals = await JournalsApi.fetchJournals();
        const newMoodData = new Map();

        allJournals.forEach((journal) => {
          const journalDate = new Date(journal.date);
          const formattedDate = journalDate.toISOString().split('T')[0];
          newMoodData.set(formattedDate, journal.mood);
        });

        setMoodData(newMoodData);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };

    fetchMoodData();
  }, []);
  


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

  function tileClassName({ date }: {date:any}) {
    const formattedDate = date.toISOString().split('T')[0];
    const moodForDate = moodData.get(formattedDate) || '';
    const moodClassName = `react-calendar__tile--mood-${moodForDate.toLowerCase()}`;
    
    // Add your custom logic here
    const startOfMonthClassName = date.getDate() === 1 ? 'start-of-month' : '';

    // Combine the class names
    return `${moodClassName} ${startOfMonthClassName}`;
  }
  

  return (
    <div className="monthly-calendar">
      
<Calendar
  value={selectedDate}
  view="month"
  tileClassName={(tileClassName)}
  formatShortWeekday={(locale, date) =>
    new Intl.DateTimeFormat(locale, { weekday: "short" })
      .format(date)
      .charAt(0)
  }
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
