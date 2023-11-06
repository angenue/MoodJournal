import React from "react";
import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import HomePage from "./HomePage";
import JournalEntryPopup, { JournalEntryPopupProps } from "./JournalEntryPopup";
import * as JournalsApi from "../utils/journal_api";
import { Journal } from "../models/journal";
import MonthlyCalendar from "./calendar/MonthlyCalendar";

// Mock the entire JournalsApi module
jest.mock('../utils/journal_api');

// Define the mock functions
const createJournal = JournalsApi.createJournal as jest.Mock;
const updateJournal = JournalsApi.updateJournal as jest.Mock;
const deleteJournal = JournalsApi.deleteJournal as jest.Mock;
const fetchJournals = JournalsApi.fetchJournals as jest.Mock;
const getLoggedInUser = JournalsApi.getLoggedInUser as jest.Mock;

// Mock global alert
global.alert = jest.fn();



describe("Journal Entry Popup", () => {
    const selectedDate = new Date(2023, 9, 3); // Note: months are 0-indexed in JavaScript Dates
  const onSave = jest.fn();
  const onCancel = jest.fn();
  const onDelete = jest.fn();

  beforeEach(() => {
    // Mock the getLoggedInUser to return a user object
    getLoggedInUser.mockResolvedValue({
      id: "507f1f77bcf86cd799439011",
      email: "testuser@example.com",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("renders correctly when there is no journal entry", async () => {
    render(
      <JournalEntryPopup
        journalToEdit={undefined} // No journal to edit
        onSave={onSave}
        onCancel={onCancel}
        onDelete={onDelete}
        selectedDate={selectedDate} // October 3, 2023
      />
    );
  
    expect(screen.getByText("Tue Oct 03 2023")).toBeInTheDocument();

    const textarea = screen.getByPlaceholderText("Write your journal entry...");
    expect(textarea).toBeInTheDocument();
    expect(textarea).toHaveValue(''); 
  
    const moodButtons = screen.getAllByRole('button').filter(button => button.classList.contains('emoji-reaction'));
    moodButtons.forEach(button => {
      expect(button).not.toHaveClass('active');
    });
  });
  

  it("renders correctly when there is a journal entry", async () => {
    const mockJournal = {
      _id: "6545b9c4afbb87deccba9063",
      mood: "happy",
      journalEntry: "Test journal entry",
      date: selectedDate,
    };

    render(
        <JournalEntryPopup
          journalToEdit={mockJournal}
          onSave={onSave}
          onCancel={onCancel}
          onDelete={onDelete}
          selectedDate={selectedDate}
        />
      );
  
    // Wait for the JournalEntryPopup to be displayed
    await waitFor(() => {
      // Assert that the popup is displayed with the correct data
      expect(screen.getByText("Tue Oct 03 2023")).toBeInTheDocument();
    });

    const journalEntryTextarea = screen.getByDisplayValue(mockJournal.journalEntry);
    expect(journalEntryTextarea).toBeInTheDocument();

    const selectedMoodButton = screen.getByRole('button', { name: '😃' });
expect(selectedMoodButton).toHaveClass('active');
    
  });
});
