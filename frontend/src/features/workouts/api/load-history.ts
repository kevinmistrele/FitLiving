import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  Timestamp,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import type {
  LoadEntry,
  LoadEntryFormInput,
  WorkoutDayId,
} from '@/features/workouts/types/workout.types';
import { calculateIncreasedVsPrevious } from '@/features/workouts/utils/calculate-increased-vs-previous';
import { getMondayOfWeek } from '@/features/workouts/utils/get-monday-of-week';
import { db } from '@/lib/firebase';

interface LoadEntryDocData {
  weekOf: Timestamp;
  loadKg: number;
  repsAchieved: number | null;
  increasedVsPrevious: boolean;
  createdAt?: Timestamp;
}

function getLoadHistoryCollectionRef(uid: string, dayId: WorkoutDayId, exerciseId: string) {
  return collection(db, 'users', uid, 'workoutDays', dayId, 'exercises', exerciseId, 'loadHistory');
}

function mapLoadEntryDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): LoadEntry {
  const data = docSnapshot.data() as LoadEntryDocData;

  return {
    id: docSnapshot.id,
    weekOf: data.weekOf.toDate(),
    loadKg: data.loadKg,
    repsAchieved: data.repsAchieved ?? null,
    increasedVsPrevious: data.increasedVsPrevious ?? false,
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
}

// Ordered ascending by weekOf, per docs/firestore-data-model.md section 1.5 — same
// "Consultas típicas" convention as check-ins (see check-ins/api/list-check-ins.ts).
export async function listLoadHistory(
  uid: string,
  dayId: WorkoutDayId,
  exerciseId: string,
): Promise<LoadEntry[]> {
  const loadHistoryQuery = query(
    getLoadHistoryCollectionRef(uid, dayId, exerciseId),
    orderBy('weekOf', 'asc'),
  );
  const snapshot = await getDocs(loadHistoryQuery);

  return snapshot.docs.map(mapLoadEntryDoc);
}

async function getMostRecentLoadKg(
  uid: string,
  dayId: WorkoutDayId,
  exerciseId: string,
): Promise<number | null> {
  const mostRecentQuery = query(
    getLoadHistoryCollectionRef(uid, dayId, exerciseId),
    orderBy('weekOf', 'desc'),
    limit(1),
  );
  const snapshot = await getDocs(mostRecentQuery);

  if (snapshot.empty) {
    return null;
  }

  return (snapshot.docs[0].data().loadKg as number) ?? null;
}

export interface CreateLoadEntryParams {
  uid: string;
  dayId: WorkoutDayId;
  exerciseId: string;
  payload: LoadEntryFormInput;
}

// Registro semanal de carga — docs/project/fitliving-web.md section 3.2. Computes
// increasedVsPrevious at write time from the most recent entry by weekOf, the same pattern
// create-check-in.ts uses for deltaWeightKg.
export async function createLoadEntry(params: CreateLoadEntryParams): Promise<LoadEntry> {
  const { uid, dayId, exerciseId, payload } = params;

  const previousLoadKg = await getMostRecentLoadKg(uid, dayId, exerciseId);
  const increasedVsPrevious = calculateIncreasedVsPrevious(payload.loadKg, previousLoadKg);
  const repsAchieved = payload.repsAchieved === '' ? null : Number(payload.repsAchieved);

  const loadEntryRef = doc(getLoadHistoryCollectionRef(uid, dayId, exerciseId));
  const weekOf = getMondayOfWeek(new Date());

  await setDoc(loadEntryRef, {
    weekOf: Timestamp.fromDate(weekOf),
    loadKg: payload.loadKg,
    repsAchieved,
    increasedVsPrevious,
    createdAt: serverTimestamp(),
  });

  return {
    id: loadEntryRef.id,
    weekOf,
    loadKg: payload.loadKg,
    repsAchieved,
    increasedVsPrevious,
    createdAt: new Date(),
  };
}

export { getLoadHistoryCollectionRef };
