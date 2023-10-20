// YearlyGraph.tsx

import React, { useState, useEffect } from 'react';
import styles from '../../styles/graph.module.css';
import * as JournalsApi from "../../utils/journal_api";
import { Chart, registerables } from 'chart.js';
import { Line, Bar, Scatter } from 'react-chartjs-2';
import { ChartOptions } from 'chart.js';
import MoodGraph from './ScatterPlot';
Chart.register(...registerables);



interface YearlyGraphProps {
  year: number;
}

const YearlyGraph: React.FC<YearlyGraphProps> = ({ year }) => {
    const [moodData, setMoodData] = useState<{ date: string; mood: string }[]>([]);

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

  const moodLabels = ['angry', 'sad', 'neutral', 'content', 'happy'];
  const moodColors = ['#43aa8b', '#F4A261', '#E9C46A', '#577590', '#E76F51'];

  const dataPoints = moodData.map(entry => ({
    x: entry.date,
    y: moodLabels.indexOf(entry.mood),
    mood: entry.mood
  }));
  
  const data = {
    labels: moodData.map(entry => entry.mood),
    datasets: [{
        data: dataPoints,
        showLine: true,
        pointRadius: 5,
        tension: 0.4,
        fill: false,
        pointBackgroundColor: dataPoints.map(entry => moodColors[moodLabels.indexOf(entry.mood)]),
        pointBorderColor: dataPoints.map(entry => moodColors[moodLabels.indexOf(entry.mood)]),
        borderColor: '#d2d0ba',
    }],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: Array.from(new Set(moodData.map(entry => entry.date))),
        grid: {
            color: 'rgba(0, 0, 0, 0)', // Set gridline color to transparent
          },
          ticks: {
            display: false, // Hide x-axis labels
          },
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
    plugins: {
      legend: {
        position: 'top',
        labels: {
          generateLabels: (chart: any) => {
            const labels = moodLabels.map((label, index) => {
              return {
                text: label,
                fillStyle: moodColors[index],
              };
            });
            return labels;
          },
        },
        
      },
    }, 
  };
  
  
    return (
        <MoodGraph
        moodData={moodData}
        labels={['angry', 'sad', 'neutral', 'content', 'happy']}
        colors={['#E76F51', '#577590', '#E9C46A', '#F4A261', '#43aa8b']}
        title={`Yearly Mood Data for ${year}`}
        xAxisLabels={Array.from(new Set(moodData.map(entry => entry.date)))}
      />
      
    );
  };

export default YearlyGraph;
