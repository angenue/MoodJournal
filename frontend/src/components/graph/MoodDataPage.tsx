//moodDataPage.tsx

import React, { useState } from 'react';
import YearlyMoodGraphs from './YearlyGraph';
import MonthlyMoodGraphs from './MonthlyGraph';
import styles from '../../styles/graph.module.css';
import ReactDatePicker from 'react-datepicker';

const MoodDataPage = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div>
      <div className={styles.pageContainer}>
      <div className={styles.labelContainer}>
      <ReactDatePicker
      closeOnScroll={true}
            selected={selectedDate}
            onChange={date => date && setSelectedDate(date)}
            dateFormat="MMMM, yyyy"
            showMonthYearPicker
          />
      </div>
      
      <YearlyMoodGraphs year={selectedDate.getFullYear()} />
        <MonthlyMoodGraphs year={selectedDate.getFullYear()} month={selectedDate.getMonth() + 1} />
      </div>
    </div>
  );
};

export default MoodDataPage;
