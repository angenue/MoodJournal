import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import * as JournalsApi from './utils/journal_api';
import { BrowserRouter, MemoryRouter } from 'react-router-dom';
import { JSX } from 'react/jsx-runtime';
import UnauthenticatedApp from './UnauthenticatedApp';

const mockOnLogin = jest.fn();

describe('Unauthenticated App', () => {

    beforeEach(() => {
        jest.restoreAllMocks();
      });

test('renders UnauthenticatedApp component', () => {
    render(
        // Wrap UnauthenticatedApp with MemoryRouter
        <MemoryRouter initialEntries={['/']}>
          <UnauthenticatedApp onLogin={mockOnLogin} loggedInUser={null} />
        </MemoryRouter>
      );
    
      // You can add assertions based on your component's behavior
      expect(screen.getByText('Login')).toBeInTheDocument();
      expect(screen.getByText('Sign Up')).toBeInTheDocument();
});
});