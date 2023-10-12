// MonthlyCalendar.jsx

import React from 'react';
import Calendar from 'react-calendar';
import "../../styles/MonthlyCalendar.css";

interface MonthlyCalendarProps {
  year: number;
  month: number;
}
const MonthlyCalendar: React.FC<MonthlyCalendarProps> = ({ year, month }) => {
  return (
    <div className="monthly-calendar">
      <Calendar
        value={new Date(year, month, 1)}
        view="month"
        formatShortWeekday={(locale, date) =>
          new Intl.DateTimeFormat(locale, { weekday: 'short' }).format(date).charAt(0)
        }
        tileClassName={({ date }) => {
          // You can add custom classes to specific dates if needed
          return date.getDate() === 1 ? 'start-of-month' : '';
        }}
      />
    </div>
  );
};


export default MonthlyCalendar;
