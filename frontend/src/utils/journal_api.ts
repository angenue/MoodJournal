import { Journal } from "../models/journal";
import { User } from "../models/user";

export class ApiError extends Error {
  constructor(public message: string, public status: number) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}



async function fetchData(input: RequestInfo, init?: RequestInit) {
  const response = await fetch(input, init);
  if (response.ok) {
    return response;
  } else {
    const errorBody = await response.json();
    console.log("Error body:", errorBody);
    const errorMessage = errorBody.message || 'Error message';
    throw new ApiError(errorMessage, response.status);
  }
}



export async function getLoggedInUser(): Promise<User> {
  const response = await fetchData("/api/users", { method: "GET" });
  return response.json();
}

export interface SignUpCredentials {
  email: string;
  password: string;
  confirmPassword: string;
}

export async function signUp(credentials: SignUpCredentials): Promise<User> {
  const response = await fetchData("/api/users/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export async function login(credentials: LoginCredentials): Promise<User> {
  const response = await fetchData("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
  return response.json();
}

export async function logout() {
  await fetchData("/api/users/logout", { method: "POST" });
}

export async function fetchJournals(): Promise<Journal[]> {
  const response = await fetchData("api/journals", { method: "GET" });
  return response.json();
}

export async function fetchJournalsByYear(year: number): Promise<Journal[]> {
  const response = await fetchData(`api/journals/${year}`, { method: "GET" });
  return response.json();
}

export async function fetchJournalsByYearAndMonth(
  year: number,
  month: number
): Promise<Journal[]> {
  const response = await fetchData(`api/journals/${year}/${month}`, {
    method: "GET",
  });
  return response.json();
}

export interface journalInput {
  mood: string | null;
  journalEntry?: string;
  selectedDate?: Date;
}

export async function createJournal(journal: journalInput): Promise<Journal> {
  const response = await fetchData("/api/journals", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journal),
  });
  return response.json();
}

export async function updateJournal(
  journalId: string,
  journal: journalInput
): Promise<Journal> {
  const response = await fetchData("/api/journals/" + journalId, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(journal),
  });
  return response.json();
}

export async function deleteJournal(journalId: string) {
  await fetchData("/api/journals/" + journalId, { method: "DELETE" });
}
