import { render, fireEvent, screen, waitFor, act } from "@testing-library/react";
import YearlyCalendar from "./YearlyCalendar";
import * as JournalsApi from "../../utils/journal_api";
import { Journal } from "../../models/journal";

// Mock the JournalsApi module
jest.mock("../../utils/journal_api", () => ({
    fetchJournalsByYear: jest.fn(),
  }));

  const fetchJournalsByYear = JournalsApi.fetchJournalsByYear as jest.Mock;
  
  describe('YearlyCalendar', () => {
    beforeEach(() => {
      // Clear all mocks before each test
      jest.clearAllMocks();
    });
  
    it('renders correctly with initial state', async () => {
        render(<YearlyCalendar />);

        await waitFor(() => {
          expect(screen.getByText(`Year ${new Date().getFullYear()}`)).toBeInTheDocument();
        });
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  months.forEach(month => {
    expect(screen.getByText(month, { exact: false })).toBeInTheDocument();
  });
    });
  
    /*it('toggles year picker on calendar icon click', () => {
      render(<YearlyCalendar />);
      const calendarIcon = screen.getByRole('button', { name: /Select Year/i });
      fireEvent.click(calendarIcon);
      expect(screen.getByText('2023-2028')).toBeInTheDocument();
    });
  
    it('updates the year when a new year is selected', async () => {
      render(<YearlyCalendar />);
      const calendarIcon = screen.getByRole('button', { name: /Select Year/i });
      fireEvent.click(calendarIcon);
  
      // Select a year in the picker
      const yearOption = screen.getByText('2024'); // Adjust to match your year picker options
      fireEvent.click(yearOption);
  
      await waitFor(() => {
        expect(screen.getByText('Year 2024')).toBeInTheDocument();
      });
    });*/
  });