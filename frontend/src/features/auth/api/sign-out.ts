import { signOut as firebaseSignOut } from 'firebase/auth';

import { auth } from '@/lib/firebase';

export function signOut(): Promise<void> {
  return firebaseSignOut(auth);
}
