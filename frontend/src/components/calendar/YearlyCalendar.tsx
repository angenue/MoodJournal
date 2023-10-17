import React, { useState, useEffect } from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import "../../styles/CalendarPage.css";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Journal as JournalModel } from "../../models/journal";
import * as JournalsApi from "../../utils/journal_api";

const YearlyCalendar: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [selectedDate, setSelectedDate] = useState(new Date(currentYear, 0, 1));
  const [moodData, setMoodData] = useState<Map<string, string>>(new Map());


  const fetchMoodDataForYear = async (year: number): Promise<Map<string, string>> => {
    try {
      
      const allJournals = await JournalsApi.fetchJournalsByYear(year);
      const newMoodData = new Map();
  
      allJournals.forEach((journal) => {
        const journalDate = new Date(journal.date);
        const formattedDate = journalDate.toISOString().split('T')[0];
        newMoodData.set(formattedDate, journal.mood);
      });
  
      return newMoodData;
    } catch (error) {
      console.error(error);
      alert(error);
  
      // Return an empty map or throw an error, depending on what you want to do
      return new Map<string, string>();
      // or
      // throw new Error("Failed to fetch mood data");
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

  return (
    <div className="yearly-view">
      <div className='container'>
        <h1>{`Year ${selectedDate.getFullYear()}`}</h1>
        <div className="year-picker">
          <label htmlFor="year">Select Date: </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleChangeDate}
            dateFormat="yyyy"
            showYearPicker
          />
        </div>
        </div>
        <div className="monthly-calendars">
          {[...Array(12)].map((_, month) => (
            <MonthlyCalendar key={month} year={selectedDate.getFullYear()} month={month} fetchMoodData={fetchMoodDataForYear}/>
          ))}
        </div>
      
    </div>
  );
};

export default YearlyCalendar;