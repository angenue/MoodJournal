import React, { useState, useEffect, useRef } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import styles from "../../styles/CalendarPage.module.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as JournalsApi from "../../utils/journal_api";


const YearlyCalendar: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(new Date(currentYear, 0, 1));
  const [moodData, setMoodData] = useState<Map<string, string>>(new Map());


  const fetchMoodDataForYear = async (year: number): Promise<Map<string, string>> => {
    try {
      const moodData = new Map();
  
      try {
        const response = await JournalsApi.fetchJournalsByYear(year);
        const journals = response; // Change this line
  
        journals.forEach((journal) => {
          const journalDate = new Date(journal.date);
          const formattedDate = journalDate.toISOString().split('T')[0];
          moodData.set(formattedDate, journal.mood);
        });
      } catch (error) {
        console.error(`Error fetching data for year ${year}:`, error);
      }
  
      return moodData;
    } catch (error) {
      console.error(error);
      alert(error);
  
      // Return an empty map or throw an error, depending on what you want to do
      return new Map<string, string>();
      // or
      // throw new Error("Failed to fetch mood data");
    }
  };

  const updateMoodData = async (year: number) => {
    try {
      const newMoodData = await fetchMoodDataForYear(year);
      setMoodData(newMoodData);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const newMoodData = await fetchMoodDataForYear(selectedDate.getFullYear());
        setMoodData(newMoodData);
      } catch (error) {
        console.error(error);
        alert(error);
      }
    };

    fetchData();
  }, [selectedDate]);

  const handleChangeDate = (date: Date) => {
    setSelectedDate(date);
  };

  const [showYearPicker, setShowYearPicker] = useState(false);

  const toggleYearPicker = () => {
    setShowYearPicker(prev => !prev);
  };

  

  return (
    <div className={styles["yearly-view"]}>
      <div className={styles.container}>
        <h1
          className={styles.yearTitle}
        >{`Year ${selectedDate.getFullYear()}`}</h1>

        <div className={styles.calendarIcon} onClick={toggleYearPicker}>
          <i className="fa fa-calendar" aria-hidden="true"></i>
        </div>

        <div className={styles["year-picker"]}>
          {showYearPicker && (
            <DatePicker
            closeOnScroll={true}
              selected={selectedDate}
              onChange={handleChangeDate}
              showYearPicker
              dateFormat="yyyy"
              yearItemNumber={6}
            />
          )}
        </div>
      </div>
      <div className={styles["monthly-calendars"]}>
        {[...Array(12)].map((_, month) => (
          <MonthlyCalendar
            key={month}
            year={selectedDate.getFullYear()}
            month={month}
            moodData={moodData}
            updateMoodData={updateMoodData}
          />
        ))}
      </div>
    </div>
  );
};

export default YearlyCalendar;