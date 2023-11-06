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

const mockOnSave = jest.fn();
const mockOnCancel = jest.fn();
const mockOnDelete = jest.fn();

const selectedDate = new Date(2023, 9, 3);

// Create a helper function to render the component with default props
const renderJournalEntryPopup = (journalToEdit: Journal | undefined) => {
    render(
      <JournalEntryPopup
        journalToEdit={journalToEdit}
        onSave={mockOnSave}
        onCancel={mockOnCancel}
        onDelete={mockOnDelete}
        selectedDate={selectedDate} // October 3, 2023
      />
    );
  };

  const createMockJournal = (overrides = {}) => {
    // Set default properties for the mock journal
    const defaultJournal = {
      _id: "6545b9c4afbb87deccba9063",
      mood: "happy",
      journalEntry: "Hello this is a test",
      date: selectedDate,
    };
  
    // Override the default properties with any properties passed to the function
    return { ...defaultJournal, ...overrides };
  };

describe("Journal Entry Popup", () => {
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
    renderJournalEntryPopup(undefined);
  
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
    const mockJournal = createMockJournal();

    renderJournalEntryPopup(mockJournal);

    // Wait for the JournalEntryPopup to be displayed
    await waitFor(() => {
      // Assert that the popup is displayed with the correct data
      expect(screen.getByText("Tue Oct 03 2023")).toBeInTheDocument();
    });

    const textarea = screen.getByPlaceholderText('Write your journal entry...') as HTMLTextAreaElement;
  expect(textarea.value).toBe(mockJournal.journalEntry);

  // The word count should reflect the number of words in the mock journal entry
  const wordCount = mockJournal.journalEntry.split(/\s+/).filter(Boolean).length;
  expect(screen.getByText(`Word Count: ${wordCount}/500`)).toBeInTheDocument();

    const selectedMoodButton = screen.getByRole('button', { name: '😃' });
expect(selectedMoodButton).toHaveClass('active');
    
  });

  it('sets selected mood when emoji is clicked', () => {
    renderJournalEntryPopup(undefined);

    const happyEmoji = screen.getByText('😃');
    fireEvent.click(happyEmoji);
    expect(happyEmoji).toHaveClass('active');
  });

  it('updates word count as user types', () => {
    renderJournalEntryPopup(undefined);

    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(screen.getByText('Word Count: 2/500')).toBeInTheDocument();
  });

  it('disables submit button when word limit is exceeded', () => {
    renderJournalEntryPopup(undefined);
    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    const submitButton = screen.getByRole('button', { name: /Save/i });

    fireEvent.change(textarea, { target: { value: 'a '.repeat(501) } }); 

    // Check if the submit button is disabled
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when no mood is selected', () => {
    renderJournalEntryPopup(undefined);
    const submitButton = screen.getByRole('button', { name: /Save/i });

    // no mood has been selected so the button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when mood is selected and word limit is not exceeded', () => {
    renderJournalEntryPopup(undefined);
    const happyEmoji = screen.getByText('😃');
    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    const submitButton = screen.getByRole('button', { name: /Save/i });

    // Simulate selecting a mood
    fireEvent.click(happyEmoji);

    // Simulate typing in the textarea
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    // Check if the submit button is enabled
    expect(submitButton).not.toBeDisabled();
  });
});


describe("Journal Entry Popup CRUD", () => {
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

  it('creates a journal', async () => {
    createJournal.mockResolvedValue({ data: '💗 Diary Submitted' });

    renderJournalEntryPopup(undefined);

    const happyEmoji = screen.getByText('😃');
  const textarea = screen.getByPlaceholderText('Write your journal entry...') as HTMLTextAreaElement;
  const submitButton = screen.getByText('Save');

  fireEvent.click(happyEmoji);
    fireEvent.change(textarea, { target: { value: 'Today was a good day' } });
  

    await waitFor(() => {
        expect(textarea.value).toBe('Today was a good day');
      },{ timeout: 10000 }    );

  
    fireEvent.click(submitButton);

    await waitFor(() => expect(createJournal).toHaveBeenCalled());

    console.log(createJournal.mock.calls);

    expect(createJournal).toHaveBeenCalledWith({
      mood: 'happy',
      journalEntry: 'Today was a good day',
      selectedDate: selectedDate,
    });
  })

  it('updates a journal', async () => {
    const mockJournal = createMockJournal();
    renderJournalEntryPopup(mockJournal);

    const angryEmoji = screen.getByText('😡');
  const textarea = screen.getByText('Hello this is a test') as HTMLTextAreaElement;
  const submitButton = screen.getByText('Save');

  fireEvent.click(angryEmoji);
    fireEvent.change(textarea, { target: { value: 'updating journal entry popup' } });

    expect(textarea.value).toBe('updating journal entry popup');

    fireEvent.click(submitButton);

    await waitFor(() => expect(updateJournal).toHaveBeenCalled());

    console.log(updateJournal.mock.calls);

    expect(updateJournal).toHaveBeenCalledWith(
        mockJournal._id,
        {
          mood: 'angry',
          journalEntry: 'updating journal entry popup',
          selectedDate: selectedDate,
        }
      );

  })

  it('deletes a journal using the delete button', () => {
    const mockJournal = createMockJournal();
    renderJournalEntryPopup(mockJournal);
  })
});