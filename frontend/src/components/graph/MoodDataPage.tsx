//moodDataPage.tsx

import React, { useState } from 'react';
import YearlyMoodGraphs from './YearlyGraph';
import MonthlyMoodGraphs from './MonthlyGraph';

const MoodDataPage = () => {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);

  return (
    <div>
      <h1>Mood Data</h1>
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
      <YearlyMoodGraphs year={selectedYear} />
      <MonthlyMoodGraphs year={selectedYear} month={selectedMonth} />
    </div>
  );
};

export default MoodDataPage;
