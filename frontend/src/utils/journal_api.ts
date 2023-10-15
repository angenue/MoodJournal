import { Journal } from "../models/journal";

async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
      return response;
  } else {
    const errorBody = await response.json();
    const errorMessage = errorBody.error;
    throw Error(errorMessage);
    
  }
}

export async function fetchJournals(): Promise<Journal[]> {
  const response = await fetchData("api/journals", {method: "GET"});
  return await response.json();
}

export interface journalInput {
    mood: string | null,
    journalEntry?: string,
    selectedDate?: Date,
  }

  export async function createJournal(journal: journalInput): Promise<Journal> {
    const response = await fetchData("/api/journals",
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(journal),
        });
    return response.json();
}
  