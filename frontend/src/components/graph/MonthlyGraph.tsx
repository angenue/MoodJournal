// MonthlyGraph.tsx
import React, { useState, useEffect } from 'react';
import styles from '../../styles/graph.module.css';
import * as JournalsApi from "../../utils/journal_api";
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import ScatterPlot from './ScatterPlotGraph';
import BarChart from './BarChart';
import { Container } from 'react-bootstrap';
Chart.register(...registerables);

interface MonthlyGraphProps {
  year: number;
  month: number;
}

const MonthlyGraph: React.FC<MonthlyGraphProps> = ({ year, month}) => {
  const [moodData, setMoodData] = useState<{ date: string; mood: string }[]>([]);

  useEffect(() => {
    const fetchMoodDataForYearAndMonth = async (year: number, month: number) => {
      try {
        const response = await JournalsApi.fetchJournalsByYearAndMonth(year, month);
        const journals = response; // Change this line

        const formattedData = journals.map((journal) => {
          return {
            date: new Date(journal.date).toISOString().split('T')[0],
            mood: journal.mood
          };
        });

        formattedData.sort((a, b) => a.date.localeCompare(b.date)); // Sort by date

        setMoodData(formattedData);
      } catch (error) {
        console.error(`Error fetching data for year ${year}:`, error);
        alert(error);
      }
    };

    fetchMoodDataForYearAndMonth(year, month);
  }, [year, month]);


  const monthNames = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
  ];
  
  // Assuming you have selectedYear and selectedMonth as state variables
  const selectedMonthName = monthNames[month - 1]; // Adjust for 0-based indexing

  return (
    <div>
      <h1>{`Monthly Mood Data for ${selectedMonthName}, ${year}`}</h1>

      <div className={`${styles["container"]}`}>
        <div className={`${styles["graphContainer"]}`}>
        <ScatterPlot
          moodData={moodData}
          labels={["angry", "sad", "neutral", "content", "happy"]}
          colors={["#E76F51", "#577590", "#E9C46A", "#F4A261", "#43aa8b"]}
          xAxisLabels={Array.from(new Set(moodData.map((entry) => entry.date)))}
        />
        </div>
<div className={`${styles["graphContainer"]}`}>
        <BarChart moodData={moodData} />
        </div>
      </div>
    </div>
  );
};

export default MonthlyGraph;
