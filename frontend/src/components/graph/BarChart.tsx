import React, { useState, useEffect } from "react";
import styles from "../../styles/graph.module.css";
import { Bar } from "react-chartjs-2";

interface MoodData {
  date: string;
  mood: string;
}

interface BarChartProps {
  moodData: MoodData[];
}

const BarChart: React.FC<BarChartProps> = ({ moodData }) => {
  const moodLabels = ["angry", "sad", "neutral", "content", "happy"];
  const moodCounts: { [key: string]: number } = {};
  moodLabels.forEach((mood) => {
    moodCounts[mood] = 0;
  });

  moodData.forEach((entry) => {
    if (moodCounts[entry.mood]) {
      moodCounts[entry.mood]++;
    } else {
      moodCounts[entry.mood] = 1;
    }
  });

  const moodDataCounts = moodLabels.map((mood) => moodCounts[mood]);

  const data = {
    labels: moodLabels,
    datasets: [
      {
        label: "Mood Counts",
        data: moodDataCounts,
        backgroundColor: [
          "#E76F51",
          "#577590",
          "#E9C46A",
          "#F4A261",
          "#43aa8b",
        ],
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...moodDataCounts) + 1,
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
