import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SignUp from './SignUp';
import * as JournalsApi from "../utils/journal_api";
import { MemoryRouter } from 'react-router-dom';

// Mock the JournalsApi module
jest.mock("../utils/journal_api");

// Mock the toast messages
jest.mock("../utils/toastMessage");

const signUp = JournalsApi.signUp as jest.Mock;

describe('SignUp Component', () => {
  const onSignUpSuccessfulMock = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('calls onSignUpSuccessful when a new user signs up successfully', async () => {
    const mockCredentials = {
      email: 'test@example.com',
      password: 'password123',
      confirmPassword: 'password123',
    };
    const mockUser = {
      id: '1',
      ...mockCredentials,
    };

    signUp.mockResolvedValue(mockUser);

    render(
        <MemoryRouter>
          <SignUp onSignUpSuccessful={onSignUpSuccessfulMock} />
        </MemoryRouter>
      );

    userEvent.type(screen.getByPlaceholderText('Email Address'), mockCredentials.email);
    userEvent.type(screen.getByPlaceholderText('Password'), mockCredentials.password);
    userEvent.type(screen.getByPlaceholderText('Confirm password'), mockCredentials.confirmPassword);

    fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));

    await waitFor(() => {
      expect(onSignUpSuccessfulMock).toHaveBeenCalledWith(mockUser);
    });
  });

  it('shows an alert if the passwords do not match', async () => {
    render(
        <MemoryRouter>
          <SignUp onSignUpSuccessful={onSignUpSuccessfulMock} />
        </MemoryRouter>
      );

    userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'password123');
    userEvent.type(screen.getByPlaceholderText('Confirm password'), 'differentPassword');

    fireEvent.submit(screen.getByRole('button', { name: 'Sign Up' }));

    const alertSpy = jest.spyOn(window, 'alert').mockImplementation(() => {});

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Passwords do not match');
    });

    alertSpy.mockRestore();
  });

  it('shows invalid feedback when the email is not provided', async () => {
    render(
        <MemoryRouter>
          <SignUp onSignUpSuccessful={() => {}} />
        </MemoryRouter>
      );

    // Attempt to submit the form without filling out the email
    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Check for email invalid feedback
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
  });

  it('shows invalid feedback when the password is not provided', async () => {
    render(
        <MemoryRouter>
          <SignUp onSignUpSuccessful={() => {}} />
        </MemoryRouter>
      );

    // Fill out the email but not the password
    userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');

    // Attempt to submit the form without filling out the password
    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    // Check for password invalid feedback
    expect(await screen.findByText('Password is required')).toBeInTheDocument();
  });

  it('shows invalid feedback when the confirmation password is not provided', async () => {
    render(
        <MemoryRouter>
          <SignUp onSignUpSuccessful={() => {}} />
        </MemoryRouter>
      );

    // Fill out the email and password but not the confirmation password
    userEvent.type(screen.getByPlaceholderText('Email Address'), 'test@example.com');
    userEvent.type(screen.getByPlaceholderText('Password'), 'password123');

    userEvent.click(screen.getByRole('button', { name: 'Sign Up' }));

    expect(await screen.findByText('Confirmation password is required')).toBeInTheDocument();
  });
});
