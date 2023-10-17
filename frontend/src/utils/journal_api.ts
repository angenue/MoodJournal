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

export async function fetchJournalsByYear(year: number): Promise<Journal[]> {
  const response = await fetchData(`api/journals/${year}`, { method: "GET" });
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

export async function updateJournal(journalId: string, journal: journalInput): Promise<Journal> {
  const response = await fetchData("/api/journals/" + journalId,
  {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
  },
  body: JSON.stringify(journal),
  });
  return response.json();
}

export async function deleteJournal(journalId: string) {
  await fetchData("/api/journals/" + journalId, { method: "DELETE"});
}
  