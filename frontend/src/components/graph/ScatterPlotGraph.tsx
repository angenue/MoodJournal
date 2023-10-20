import React from 'react';
import { Scatter } from 'react-chartjs-2';
import styles from '../../styles/graph.module.css';
import * as JournalsApi from "../../utils/journal_api";
import { Chart, registerables } from 'chart.js';
import { ChartOptions } from 'chart.js';
Chart.register(...registerables);

interface ScatterPlotProps {
    moodData: { date: string; mood: string }[];
    labels: string[];
    colors: string[];
    xAxisLabels: string[];
  }

  const ScatterPlot: React.FC<ScatterPlotProps> = ({ moodData, labels, colors, xAxisLabels }) => {
  const dataPoints = moodData.map(entry => ({
    x: entry.date,
    y: labels.indexOf(entry.mood),
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
      pointBackgroundColor: dataPoints.map(entry => colors[labels.indexOf(entry.mood)]),
      pointBorderColor: dataPoints.map(entry => colors[labels.indexOf(entry.mood)]),
      borderColor: '#d2d0ba',
    }],
  };

  const options = {
    scales: {
      x: {
        type: 'category',
        labels: xAxisLabels,
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
            return labels[value];
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
              const legendLabels = labels.map((label, index) => {
                return {
                  text: label,
                  fillStyle: colors[index],
                };
              });
              return legendLabels;
            },
          },
        },
      },
  };

  

  return (
    <div>
      <Scatter data={data} options={options as ChartOptions<'scatter'>} />
    </div>
  );
};

export default ScatterPlot;
