import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import * as JournalsApi from './utils/journal_api';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';
import App from './App';

const getLoggedInUser = JournalsApi.getLoggedInUser as jest.Mock;
// Mock the API module
jest.mock('./utils/journal_api', () => ({
  getLoggedInUser: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
}));

afterEach(() => {
  jest.restoreAllMocks();
});

// Helper function to render the component within the Router context
const renderWithRouter = (ui: JSX.Element, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route);
  return render(ui, { wrapper: BrowserRouter });
};

describe('App', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
  });

  it('renders UnauthenticatedApp when there is no logged in user', async () => {
    // Mock the getLoggedInUser to return null
    getLoggedInUser.mockResolvedValue(null);

    renderWithRouter(<App />);

    // Wait for the API call to resolve and check for unauthenticated content
    await waitFor(() => {
      expect(screen.getByRole('button', { name: /Login/i })).toBeInTheDocument();
    });
  });

  it('renders AuthenticatedApp when there is a logged in user', async () => {
    // Mock the getLoggedInUser to return a user object
    getLoggedInUser.mockResolvedValue({ id: '507f1f77bcf86cd799439011',
    email: 'testuser@example.com', });

    renderWithRouter(<App />);

    // Wait for the API call to resolve and check for authenticated content
    await waitFor(() => {
      expect(screen.getByText(/logout/i)).toBeInTheDocument();
    });
  });
});

describe('Redirection tests', () => {
  it('redirects non-logged in users from /home to login page', async () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    render(
      <MemoryRouter initialEntries={['/home']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('redirects logged-in users from / to /home', async () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);

    getLoggedInUser.mockResolvedValue({ id: '507f1f77bcf86cd799437011',
    email: 'test@example.com', });

    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/Home', { replace: true });
    });
  });

  it('redirects logged-in users from /signup to /home', async () => {
    const navigate = jest.fn();
    jest.spyOn(require('react-router-dom'), 'useNavigate').mockImplementation(() => navigate);
    getLoggedInUser.mockResolvedValue({ id: '507f1f77bcf86cd799439011',
    email: 'testuser@example.com', });

    render(
      <MemoryRouter initialEntries={['/signup']}>
        <App />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/Home', { replace: true });
    });
  });
});
