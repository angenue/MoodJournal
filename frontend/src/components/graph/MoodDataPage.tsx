//moodDataPage.tsx

import React, { useState } from 'react';
import YearlyMoodGraphs from './YearlyGraph';
import MonthlyMoodGraphs from './MonthlyGraph';
import styles from '../../styles/graph.module.css';

const MoodDataPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  return (
    <div>
      <div>
        <label>
          Select Year:
          <input
            type="number"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          />
        </label>
        <label>
          Select Month:
          <input
            type="number"
            min="1"
            max="12"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          />
        </label>
      </div>
      <div className={styles.pageContainer}>
      <YearlyMoodGraphs year={selectedYear} />
      <MonthlyMoodGraphs year={selectedYear} month={selectedMonth} />
      </div>
    </div>
  );
};

export default MoodDataPage;
