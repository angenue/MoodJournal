import React, { useState, useEffect } from 'react';
import styles from '../../styles/graph.module.css';
import { Bar } from 'react-chartjs-2';

interface MoodData {
    date: string;
    mood: string;
  }
  
  interface BarChartProps {
    moodData: MoodData[];
  }
  
  const BarChart: React.FC<BarChartProps> = ({ moodData }) => {
    const moodLabels = ['angry', 'sad', 'neutral', 'content', 'happy']; // Define moodLabels here

const moodCounts: { [key: string]: number } = {};
moodLabels.forEach(mood => {
  moodCounts[mood] = 0;
});

moodData.forEach(entry => {
  if (moodCounts[entry.mood]) {
    moodCounts[entry.mood]++;
  } else {
    moodCounts[entry.mood] = 1;
  }
});

// Step 2: Create Labels and Data Arrays
const moodDataCounts = moodLabels.map(mood => moodCounts[mood]);

// Step 3: Define Data for Bar Chart
const data = {
  labels: moodLabels,
  datasets: [
    {
      label: 'Mood Counts',
      data: moodDataCounts,
      backgroundColor: [
        '#E76F51', '#577590', '#E9C46A', '#F4A261', '#43aa8b'
      ], // Assign colors as you wish 
    },
  ],
};

const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...moodDataCounts) + 1, // Adjust the max value based on the data
      },
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          generateLabels: (chart: any) => {
            return moodLabels.map((label, index) => {
              return {
                text: label,
                fillStyle: data.datasets[0].backgroundColor[index],
              };
            });
          },
        },
      },
    },
  };

  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
