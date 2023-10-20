// YearlyGraph.tsx

import React, { useState, useEffect } from 'react';
import * as JournalsApi from "../../utils/journal_api";
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
Chart.register(...registerables);


interface YearlyGraphProps {
  year: number;
}

const YearlyGraph: React.FC<YearlyGraphProps> = ({ year }) => {
    const [moodData, setMoodData] = useState<{ date: string; mood: string }[]>([]);
  const moodNames = ['happy', 'content', 'neutral', 'sad', 'angry'];

  useEffect(() => {
    const fetchMoodDataForYear = async (year: number) => {
      try {
        const response = await JournalsApi.fetchJournalsByYear(year);
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

    fetchMoodDataForYear(year);
  }, [year]);

  const moodLabels = ['happy', 'content', 'neutral', 'sad', 'angry'];
  const moodColors = ['#43aa8b', '#F4A261', '#E9C46A', '#577590', '#E76F51'];

  const dataPoints = moodData.map(entry => ({
    x: entry.date,
    y: moodLabels.indexOf(entry.mood),
    mood: entry.mood
  }));
  
  const data = {
    
    datasets: [{
        data: dataPoints,
        showLine: true,
        pointRadius: 5,
        fill: false,
        pointBackgroundColor: dataPoints.map(entry => moodColors[moodLabels.indexOf(entry.mood)]),
        pointBorderColor: dataPoints.map(entry => moodColors[moodLabels.indexOf(entry.mood)]),
        borderColor: '#d2d0ba',
    }],
  };

  const options = {
    scales: {
      x: {
        type: 'category' as const,
        labels: Array.from(new Set(moodData.map(entry => entry.date))),
      },
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value: any) => {
            return moodLabels[value];
          },
          max: 4,
          min: 0,
          stepSize: 1,
        },
      },
    },
  };


  
    return (
      <div>
        <h2>Yearly Mood Data for {year}</h2>
        <Scatter data={data} options={options} />
      </div>
    );
  };

export default YearlyGraph;
