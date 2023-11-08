import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import Login from './Login';
import * as JournalsApi from "../utils/journal_api";

// Mock the JournalsApi module
jest.mock("../utils/journal_api", () => ({
  login: jest.fn(),
}));

jest.mock("../utils/toastMessage", () => ({
  errorMessage: jest.fn(),
  successMessage: jest.fn(),
}));

const mockedNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => jest.fn().mockImplementation(() => mockedNavigate), // returns the mock function when called
  }));
  
  
const login = JournalsApi.login as jest.Mock;

describe('Login', () => {
  const onLoginSuccessfulMock = jest.fn();
  let alertSpy: jest.SpyInstance<void, [message?: any], any>;

  beforeEach(() => {
    jest.clearAllMocks();
    alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});
    login.mockResolvedValue({});
  });

  afterEach(() => {
    alertSpy.mockRestore();
  });

  it('submits the form with email and password', async () => {
    const mockUser = { email: 'test@example.com', password: 'password123' };
    (JournalsApi.login as jest.Mock).mockResolvedValue(mockUser);

    render(
      <BrowserRouter>
        <Login onLoginSuccessful={onLoginSuccessfulMock} />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText('Email Address'), mockUser.email);
    userEvent.type(screen.getByPlaceholderText('Password'), mockUser.password);

    fireEvent.submit(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => expect(onLoginSuccessfulMock).toHaveBeenCalledWith(mockUser));
  });

  it('shows an error message if the login fails', async () => {
    const errorMessage = 'Invalid credentials';
    (JournalsApi.login as jest.Mock).mockRejectedValue(new Error(errorMessage));

    render(
      <BrowserRouter>
        <Login onLoginSuccessful={onLoginSuccessfulMock} />
      </BrowserRouter>
    );

    userEvent.type(screen.getByPlaceholderText('Email Address'), 'user@example.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'wrong-password');

    fireEvent.click(screen.getByRole('button', { name: 'Login' }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(errorMessage);
    });
  });

  it('navigates to the Sign Up page when the Sign Up button is clicked', async() => {
    render(
      <BrowserRouter>
        <Login onLoginSuccessful={() => {}} />
      </BrowserRouter>
    );

    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();

    userEvent.click(screen.getByRole('button', { name: /sign up/i }));

    // eslint-disable-next-line testing-library/await-async-utils
    waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/SignUp');
    });
  });
});
