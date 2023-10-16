import React from 'react';
import MonthlyCalendar from './MonthlyCalendar';
import "../../styles/CalendarPage.css";

interface YearlyViewProps {
  year: number;
}

const YearlyView: React.FC<YearlyViewProps> = ({ year }) => {
  return (
    <div className="yearly-view">
        <div className='container'>
      <h1>{`Year ${year}`}</h1>
      <div className="monthly-calendars">
        {[...Array(12)].map((_, month) => (
          <MonthlyCalendar key={month} year={year} month={month} />
        ))}
      </div>
      </div>
    </div>
  );
};

export default YearlyView;