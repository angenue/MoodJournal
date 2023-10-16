// MonthlyCalendar.jsx

import React, { useState} from 'react';
import Calendar from 'react-calendar';
import "../../styles/MonthlyCalendar.css";
import JournalEntryPopup from '../JournalEntryPopup';

interface MonthlyCalendarProps {
  year: number;
  month: number;
}
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ year, month }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setIsPopupOpen(true);
  };

  const handlePopupSave = (date: Date, mood: string, journalEntry: string) => {
    // Handle saving the journal entry to the database with the selected date, mood, and journal entry
    console.log(`Date: ${date}, Mood: ${mood}, Journal Entry: ${journalEntry}`);
    setIsPopupOpen(false);
  };

  const handlePopupCancel = () => {
    setSelectedDate(null);
    setIsPopupOpen(false);
  };

  return (
    <div className="monthly-calendar">
      <Calendar
        value={selectedDate}
        view="month"
        formatShortWeekday={(locale, date) =>
          new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date).charAt(0)
        }
        tileClassName={({ date }) => {
          // You can add custom classes to specific dates if needed
          return date.getDate() === 1 ? 'start-of-month' : '';
        }}

        onClickDay={handleDateClick}
      />
    </div>
  );
};


export default MonthlyCalendar;
