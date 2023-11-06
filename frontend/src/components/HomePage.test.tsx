import React from 'react';
import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import HomePage from './HomePage';
import * as JournalsApi from '../utils/journal_api';
import { ToastContainer } from 'react-toastify';

const createJournal = JournalsApi.createJournal as jest.Mock;
const getLoggedInUser = JournalsApi.getLoggedInUser as jest.Mock;
global.alert = jest.fn();

// Mock the API module
jest.mock('../utils/journal_api', () => ({
  createJournal: jest.fn(),
  getLoggedInUser: jest.fn(),
}));

// Mock the ToastContainer to avoid rendering it during tests
jest.mock('react-toastify', () => {
  const originalModule = jest.requireActual('react-toastify');
  return {
    ...originalModule,
    toast: {
      ...originalModule.toast,
      error: jest.fn(),
      success: jest.fn(),
    },
    ToastContainer: () => <div>ToastContainer</div>,
  };
});


beforeEach(() => {
  jest.clearAllMocks();
});

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
    createJournal.mockResolvedValue({ data: '💗 Diary Submitted' });

    render(<HomePage />);
    const happyEmoji = screen.getByText('😃');
  const textarea = screen.getByPlaceholderText('Write your journal entry...') as HTMLTextAreaElement;
  const submitButton = screen.getByText('Submit Diary');

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
    });
  });

  it('disables submit button when word limit is exceeded', () => {
    render(<HomePage />);
    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    const submitButton = screen.getByRole('button', { name: /submit diary/i });

    fireEvent.change(textarea, { target: { value: 'a '.repeat(501) } }); 

    // Check if the submit button is disabled
    expect(submitButton).toBeDisabled();
  });

  it('disables submit button when no mood is selected', () => {
    render(<HomePage />);
    const submitButton = screen.getByRole('button', { name: /submit diary/i });

    // no mood has been selected so the button should be disabled
    expect(submitButton).toBeDisabled();
  });

  it('enables submit button when mood is selected and word limit is not exceeded', () => {
    render(<HomePage />);
    const happyEmoji = screen.getByText('😃');
    const textarea = screen.getByPlaceholderText('Write your journal entry...');
    const submitButton = screen.getByRole('button', { name: /submit diary/i });

    // Simulate selecting a mood
    fireEvent.click(happyEmoji);

    // Simulate typing in the textarea
    fireEvent.change(textarea, { target: { value: 'Hello world' } });

    // Check if the submit button is enabled
    expect(submitButton).not.toBeDisabled();
  });

  // Add more tests as needed...
});
