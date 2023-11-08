import React from 'react';
import { render, screen } from '@testing-library/react';
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

    // Assert that the logout function was called
    expect(JournalsApi.logout).toHaveBeenCalled();

    // Assert that the onLogoutSuccessful callback was called
    expect(onLogoutSuccessfulMock).toHaveBeenCalled();

    // Assert that navigate was called with the correct argument
    expect(mockedNavigate).toHaveBeenCalledWith('/');

    // Optionally, check if the errorMessage function was called if the logout failed
    // expect(errorMessage).toHaveBeenCalledWith("Logout Unsuccessful");
  });

  // ... Other tests for sidebar links ...
});
