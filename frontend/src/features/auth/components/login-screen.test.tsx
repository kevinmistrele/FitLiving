import userEvent from '@testing-library/user-event';
import { FirebaseError } from 'firebase/app';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { LoginScreen } from '@/features/auth/components/login-screen';
import { render, screen, waitFor } from '@/testing/test-utils';

const mockedSignIn = vi.mocked(signInWithEmailAndPassword);

describe('LoginScreen', () => {
  beforeEach(() => {
    mockedSignIn.mockReset();
  });

  it('renders the login form', () => {
    render(<LoginScreen />);

    expect(screen.getByRole('heading', { name: 'Sign in' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign in' })).toBeInTheDocument();
  });

  it('shows validation errors and does not call sign-in on empty submit', async () => {
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText('Enter your email.')).toBeInTheDocument();
    expect(screen.getByText('Enter your password.')).toBeInTheDocument();
    expect(mockedSignIn).not.toHaveBeenCalled();
  });

  it('shows a user-facing message when sign-in fails', async () => {
    mockedSignIn.mockRejectedValueOnce(
      new FirebaseError('auth/invalid-credential', 'INVALID_LOGIN_CREDENTIALS'),
    );
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.type(screen.getByLabelText('Email'), 'owner@example.com');
    await user.type(screen.getByLabelText('Password'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    expect(await screen.findByText("These details don't match our records.")).toBeInTheDocument();
    expect(screen.queryByText('INVALID_LOGIN_CREDENTIALS')).not.toBeInTheDocument();
  });

  it('signs in with the entered credentials on success', async () => {
    mockedSignIn.mockResolvedValueOnce({} as never);
    const user = userEvent.setup();
    render(<LoginScreen />);

    await user.type(screen.getByLabelText('Email'), 'owner@example.com');
    await user.type(screen.getByLabelText('Password'), 'correct-password');
    await user.click(screen.getByRole('button', { name: 'Sign in' }));

    await waitFor(() => {
      expect(mockedSignIn).toHaveBeenCalledWith(
        expect.anything(),
        'owner@example.com',
        'correct-password',
      );
    });
  });
});
