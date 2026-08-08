import { FirebaseError } from 'firebase/app';

const AUTH_ERROR_MESSAGE_KEYS: Record<string, string> = {
  'auth/invalid-credential': 'auth.login.errors.invalidCredential',
  'auth/invalid-email': 'auth.login.errors.emailInvalid',
  'auth/user-disabled': 'auth.login.errors.userDisabled',
  'auth/too-many-requests': 'auth.login.errors.tooManyRequests',
  'auth/network-request-failed': 'auth.login.errors.network',
};

export function getLoginErrorMessageKey(error: unknown): string {
  if (error instanceof FirebaseError) {
    return AUTH_ERROR_MESSAGE_KEYS[error.code] ?? 'auth.login.errors.generic';
  }

  return 'auth.login.errors.generic';
}
