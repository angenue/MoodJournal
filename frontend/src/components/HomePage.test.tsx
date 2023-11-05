import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import * as JournalsApi from '../utils/journal_api';
import { ToastContainer } from 'react-toastify';

const createJournal = JournalsApi.createJournal as jest.Mock;
const getLoggedInUser = JournalsApi.getLoggedInUser as jest.Mock;

// Mock the API module
jest.mock('../utils/journal_api', () => ({
  createJournal: jest.fn(),
  getLoggedInUser: jest.fn(),
}));

// Mock the ToastContainer to avoid rendering it during tests
jest.mock('react-toastify', () => ({
  ToastContainer: () => <div>ToastContainer</div>,
}));

describe('HomePage', () => {
  beforeEach(() => {
    // Mock the getLoggedInUser to return a user object
    getLoggedInUser.mockResolvedValue({
      id: '507f1f77bcf86cd799439011',
      email: 'testuser@example.com',
      // ... other user properties
    });
  });

  it('renders correctly', () => {
    const { asFragment } = render(<HomePage />);
    expect(asFragment()).toMatchSnapshot();
  });

  it('updates word count as user types', () => {
    render(<HomePage />);
    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    fireEvent.change(textarea, { target: { value: 'Hello world' } });
    expect(screen.getByText('Word Count: 2/500')).toBeInTheDocument();
  });

  it('sets selected mood when emoji is clicked', () => {
    render(<HomePage />);
    const happyEmoji = screen.getByText('😃');
    fireEvent.click(happyEmoji);
    expect(happyEmoji).toHaveClass('active');
  });

  it('submits the form with the correct data', async () => {
    // Mock the API call
    createJournal.mockResolvedValue({ data: '💗 Diary Submitted' });

    render(<HomePage />);
    const happyEmoji = screen.getByText('😃');
  const textarea = screen.getByPlaceholderText('Write your journal entry...') as HTMLTextAreaElement;
  const submitButton = screen.getByText('Submit Diary');

    // Simulate user interactions
    fireEvent.click(happyEmoji);
    fireEvent.change(textarea, { target: { value: 'Today was a good day' } });
  
    // Wait for state updates if necessary
    await waitFor(() => {
      expect(textarea.value).toBe('Today was a good day');
    });
  
    fireEvent.click(submitButton);

    // Wait for the API call to resolve
    await waitFor(() => expect(createJournal).toHaveBeenCalled());

    console.log(createJournal.mock.calls);

    // Check if the API was called with the correct parameters
    expect(createJournal).toHaveBeenCalledWith({
      mood: 'happy',
      journalEntry: 'Today was a good day',
      // ... any other properties that need to be submitted
    });
  });

  // Add more tests as needed...
});
