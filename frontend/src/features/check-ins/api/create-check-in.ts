import {
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';

import { getCheckInsCollectionRef } from '@/features/check-ins/api/list-check-ins';
import type { CheckIn, CreateCheckInInput } from '@/features/check-ins/types/check-in.types';
import { calculateDeltaWeightKg } from '@/features/check-ins/utils/calculate-delta-weight-kg';
import { fromDateInputValue } from '@/features/check-ins/utils/date-input';
import { db } from '@/lib/firebase';
import { getOrCreateProfile } from '@/lib/profile';

export interface CreateCheckInParams {
  uid: string;
  payload: CreateCheckInInput;
}

async function getMostRecentWeightKg(uid: string): Promise<number | null> {
  const mostRecentQuery = query(getCheckInsCollectionRef(uid), orderBy('date', 'desc'), limit(1));
  const snapshot = await getDocs(mostRecentQuery);

  if (snapshot.empty) {
    return null;
  }

  return (snapshot.docs[0].data().weightKg as number) ?? null;
}

// Writes the new check-in and mirrors its weight into profile/main.currentWeightKg in one
// batched write, per docs/firestore-data-model.md section 1.1's note that currentWeightKg
// is a cached mirror of the latest check-in.
export async function createCheckIn(params: CreateCheckInParams): Promise<CheckIn> {
  const { uid, payload } = params;

  const [previousWeightKg, profile] = await Promise.all([
    getMostRecentWeightKg(uid),
    getOrCreateProfile(uid),
  ]);

  const deltaWeightKg = calculateDeltaWeightKg(
    payload.weightKg,
    previousWeightKg,
    profile.initialWeightKg,
  );

  const checkInRef = doc(getCheckInsCollectionRef(uid));
  const profileRef = doc(db, 'users', uid, 'profile', 'main');
  const batch = writeBatch(db);

  batch.set(checkInRef, {
    date: Timestamp.fromDate(fromDateInputValue(payload.date)),
    weightKg: payload.weightKg,
    waistCm: payload.waistCm,
    notes: payload.notes,
    deltaWeightKg,
    createdAt: serverTimestamp(),
  });

  batch.set(
    profileRef,
    { currentWeightKg: payload.weightKg, updatedAt: serverTimestamp() },
    { merge: true },
  );

  await batch.commit();

  return {
    id: checkInRef.id,
    date: payload.date,
    weightKg: payload.weightKg,
    waistCm: payload.waistCm,
    notes: payload.notes,
    deltaWeightKg,
    createdAt: new Date(),
  };
}
