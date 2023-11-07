import { render, fireEvent, screen, waitFor, act, within } from "@testing-library/react";
import YearlyCalendar from "./YearlyCalendar";
import * as JournalsApi from "../../utils/journal_api";
import { Journal } from "../../models/journal";

jest.mock("../../utils/journal_api", () => ({
    fetchJournalsByYear: jest.fn(),
  }));
  
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
  
    it('toggles year picker on calendar icon click',async () => {
      render(<YearlyCalendar />);
      const calendarIcon = screen.getByRole('button', { name: /Select Year/i });
      fireEvent.click(calendarIcon);
      const datePicker = screen.getByRole('textbox'); 
  expect(datePicker).toBeInTheDocument();

  // Click on the DatePicker to show the year range
  fireEvent.click(datePicker);
  const currentYear = new Date().getFullYear();
  const endYearValue = currentYear + 5;

  const startYear = await screen.findByText(currentYear.toString());
  const endYear = await screen.findByText(endYearValue.toString());
  expect(startYear).toBeInTheDocument();
  expect(endYear).toBeInTheDocument();
    });
  
    it('updates the year when a new year is selected', async () => {
      render(<YearlyCalendar />);
      const calendarIcon = screen.getByRole('button', { name: /Select Year/i });
      fireEvent.click(calendarIcon);

      const datePicker = screen.getByRole('textbox'); 
      expect(datePicker).toBeInTheDocument();
   
      fireEvent.click(datePicker);

      const currentYear = new Date().getFullYear();
  const chosenYearValue = currentYear + 2;

      const yearOptionsContainer = document.body;
      const yearButton = within(yearOptionsContainer).getByText(chosenYearValue.toString());
      fireEvent.click(yearButton);
    

      await waitFor(() => {
        expect(screen.getByText(`Year ${chosenYearValue}`)).toBeInTheDocument();
      });
    });
  });