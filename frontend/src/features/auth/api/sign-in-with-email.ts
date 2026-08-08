import { signInWithEmailAndPassword, type UserCredential } from 'firebase/auth';

import type { LoginPayload } from '@/features/auth/types/auth.types';
import { auth } from '@/lib/firebase';

export function signInWithEmail(payload: LoginPayload): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, payload.email, payload.password);
}
