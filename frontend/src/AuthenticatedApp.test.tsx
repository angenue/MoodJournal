import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import * as JournalsApi from './utils/journal_api';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';
import AuthenticatedApp from './AuthenticatedApp';
import Sidebar from './components/Sidebar';

const mockOnLogout = jest.fn();
const mockLoggedInUser = {
    id: '507f1f77bcf86cd799437011',
    email: 'test@example.com',
};

describe('Authenticated App', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
      });

test('renders AuthenticatedApp component', () => {
    render(
        <MemoryRouter initialEntries={['/Home']}>
        <AuthenticatedApp onLogout={mockOnLogout} loggedInUser={mockLoggedInUser} />
      </MemoryRouter>
      );

  expect(screen.getByText('MOODY')).toBeInTheDocument();
  expect(screen.getByText('Home')).toBeInTheDocument();
  expect(screen.getByText('Calendar')).toBeInTheDocument();
  expect(screen.getByText('Graph')).toBeInTheDocument();
  expect(screen.getByText('Logout')).toBeInTheDocument();
});
});