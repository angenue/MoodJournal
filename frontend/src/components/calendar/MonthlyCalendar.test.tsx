import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import MonthlyCalendar from "./MonthlyCalendar";
import * as JournalsApi from "../../utils/journal_api";
import { Journal } from "../../models/journal";

jest.mock('../../utils/journal_api');

const mockUpdateMoodData = jest.fn();
const fetchJournals = JournalsApi.fetchJournals as jest.Mock;

const selectedDate = new Date(2023, 9, 3);

const mockMoodData = new Map([
  ['2023-10-03', 'happy'],
]);

  const renderMonthlyCalendar = (overrides = {}) => {
    const props = {
      year: 2023,
      month: 9, // October (0-indexed)
      moodData: mockMoodData,
      updateMoodData: mockUpdateMoodData,
      ...overrides, // This allows you to pass in any props you want to override
    };
  
    return render(<MonthlyCalendar {...props} />);
  };

describe('MonthlyCalendar', () => {
  beforeEach(() => {

    jest.resetAllMocks();
  });

  it('renders with correct month and year', () => {
    const { getByText } = renderMonthlyCalendar();

    // eslint-disable-next-line testing-library/prefer-screen-queries
    expect(getByText('October 2023')).toBeInTheDocument();
  });

  it('colors days based on moodData', () => {
    renderMonthlyCalendar();

    // Check if October 3rd has the correct color class
    const dayTiles = screen.getAllByRole('button');
  const dayTile = dayTiles.find(tile => tile.textContent === '3');

    expect(dayTile).toHaveClass('react-calendar__tile--mood-happy');
  });

  it('opens JournalEntryPopup when a day with a journal entry is clicked', async () => {
    fetchJournals.mockResolvedValue([
      { _id: "6545b9c4afbb87deccba9063",
      mood: "happy",
      journalEntry: "Hello this is a test",
      date: selectedDate, },
    ]);

    renderMonthlyCalendar();

    const dayTiles = screen.getAllByRole('button');
    const dayTile = dayTiles.find(tile => tile.textContent === '3');

    if (!dayTile) {
        throw new Error('Day tile for October 3rd not found');
      }

    fireEvent.click(dayTile);
  

    // Wait for the popup to open
    await waitFor(() => {
      expect(screen.getByText('Tue Oct 03 2023')).toBeInTheDocument(); // Adjust the text to match your popup
    });
  });

  it('closes JournalEntryPopup when cancel is triggered', async () => {
    fetchJournals.mockResolvedValue([
        { _id: "6545b9c4afbb87deccba9063",
        mood: "happy",
        journalEntry: "Hello this is a test",
        date: selectedDate, },
      ]);

      renderMonthlyCalendar();

    const dayTiles = screen.getAllByRole('button');
    const dayTile = dayTiles.find(tile => tile.textContent === '3');

    if (!dayTile) {
        throw new Error('Day tile for October 3rd not found');
      }

    fireEvent.click(dayTile);

  await waitFor(() => {
    expect(screen.getByText('Tue Oct 03 2023')).toBeInTheDocument();
  });

    fireEvent.click(screen.getByRole('button', { name: 'Go Back' }));

    await waitFor(() => {
      expect(screen.queryByText('Tue Oct 03 2023')).not.toBeInTheDocument();
    });
  });


  it('closes popup when the journal is deleted', async () => {
    fetchJournals.mockResolvedValue([
        { _id: "6545b9c4afbb87deccba9063",
        mood: "happy",
        journalEntry: "Hello this is a test",
        date: selectedDate, },
      ]);

      renderMonthlyCalendar();

    const dayTiles = screen.getAllByRole('button');
    const dayTile = dayTiles.find(tile => tile.textContent === '3');

    if (!dayTile) {
        throw new Error('Day tile for October 3rd not found');
      }

    fireEvent.click(dayTile);

  await waitFor(() => {
    expect(screen.getByText('Tue Oct 03 2023')).toBeInTheDocument();
  });

  const deleteButton = screen.getByRole('button', { name: /delete journal/i });
  fireEvent.click(deleteButton);


    await waitFor(() => {
        expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
      });

     // Wait for the confirmation modal to appear and confirm deletion
  const confirmDeleteButton = await screen.findByRole('button', { name: /yes, delete/i });
  fireEvent.click(confirmDeleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Tue Oct 03 2023')).not.toBeInTheDocument();
    });
  });
});