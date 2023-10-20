// MonthlyGraph.tsx
import React, { useState, useEffect } from 'react';
import * as JournalsApi from "../../utils/journal_api";

interface MonthlyGraphProps {
  year: number;
  month: number;
}

const MonthlyGraph: React.FC<MonthlyGraphProps> = ({ year, month}) => {
    const [moodData, setMoodData] = useState<Map<string, string>>(new Map());

    const fetchMoodDataForYearAndMonth = async (year: number, month: number): Promise<Map<string, string>> => {
        try {
          const moodData = new Map();
      
          try {
            const response = await JournalsApi.fetchJournalsByYearAndMonth(year, month);
            const journals = response; // Change this line
      
            journals.forEach((journal) => {
              const journalDate = new Date(journal.date);
              const formattedDate = journalDate.toISOString().split('T')[0];
              moodData.set(formattedDate, journal.mood);
            });
          } catch (error) {
            console.error(`Error fetching data for year ${year}:`, error);
          }
      
          return moodData;
        } catch (error) {
          console.error(error);
          alert(error);
      
          // Return an empty map or throw an error, depending on what you want to do
          return new Map<string, string>();
          // or
          // throw new Error("Failed to fetch mood data");
        }
      };

    useEffect(() => {
        const fetchData = async () => {
            try {
              const newMoodData = await fetchMoodDataForYearAndMonth(year, month);
              setMoodData(newMoodData);
            } catch (error) {
              console.error(error);
              alert(error);
            }
      };
  
      fetchData();
    }, [year, month]);
  return (
    <div>
      <h2>Monthly Graph for {month}/{year}</h2>
      {/* Your graph implementation goes here */}
    </div>
  );
};

export default MonthlyGraph;
