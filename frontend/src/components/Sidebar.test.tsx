import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import Sidebar from './Sidebar';
import * as JournalsApi from "../utils/journal_api";

// Mock the useNavigate function from react-router-dom
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockedNavigate,
}));

const logout = JournalsApi.logout as jest.Mock;

// Mock JournalsApi
jest.mock("../utils/journal_api");

// Mock the toast messages
jest.mock("../utils/toastMessage");

// ... other imports and mocks

describe('Sidebar Component', () => {
    const onLogoutSuccessfulMock = jest.fn();
  
    beforeEach(() => {
      mockedNavigate.mockReset();
      onLogoutSuccessfulMock.mockReset();
     logout.mockResolvedValue({}); 
    });
  
    it('navigates to "/" when the logout button is clicked', async () => {
      render(
        <MemoryRouter>
          <Sidebar onLogoutSuccessful={onLogoutSuccessfulMock} />
        </MemoryRouter>
      );
  
      // Find and click the logout button
      const logoutButton = screen.getByText('Logout');
      userEvent.click(logoutButton);
  
      // Wait for any asynchronous actions to complete
      await waitFor(() => {
        // Assert that the onLogoutSuccessful callback was called
        expect(onLogoutSuccessfulMock).toHaveBeenCalled();
      });
  
      // Assert that navigate was called with the correct argument
      expect(mockedNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to "/Calendar" when the Calendar button is clicked', async () => {
        render(
            <MemoryRouter>
              <Sidebar onLogoutSuccessful={() => {}} />
            </MemoryRouter>
          );
    
        const calendarButton = screen.getByText('Calendar');
        userEvent.click(calendarButton);
    
        // eslint-disable-next-line testing-library/no-node-access
        const homeLink = screen.getByText('Calendar').closest('a');
        expect(homeLink).toHaveAttribute('href', '/Calendar');
      });
      it('has the correct link to the Home page', () => {
        render(
          <MemoryRouter>
            <Sidebar onLogoutSuccessful={() => {}} />
          </MemoryRouter>
        );
    
        // eslint-disable-next-line testing-library/no-node-access
        const homeLink = screen.getByText('Home').closest('a');
        expect(homeLink).toHaveAttribute('href', '/Home');
      });

      it('has the correct link to the Graph page', () => {
        render(
          <MemoryRouter>
            <Sidebar onLogoutSuccessful={() => {}} />
          </MemoryRouter>
        );
    
        // eslint-disable-next-line testing-library/no-node-access
        const homeLink = screen.getByText('Graph').closest('a');
        expect(homeLink).toHaveAttribute('href', '/Graph');
      });

  });
  
