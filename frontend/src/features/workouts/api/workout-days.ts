import {
  collection,
  doc,
  getDocs,
  serverTimestamp,
  writeBatch,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';

import type {
  WorkoutDay,
  WorkoutDayId,
  WorkoutDayType,
} from '@/features/workouts/types/workout.types';
import {
  WORKOUT_DAY_DEFAULTS,
  WORKOUT_DAY_IDS,
} from '@/features/workouts/utils/workout-day-defaults';
import { db } from '@/lib/firebase';

interface WorkoutDayDocData {
  dayId: WorkoutDayId;
  weekday: number;
  type: WorkoutDayType;
  label: string;
  updatedAt?: Timestamp;
}

function getWorkoutDaysCollectionRef(uid: string) {
  return collection(db, 'users', uid, 'workoutDays');
}

function getWorkoutDayRef(uid: string, dayId: WorkoutDayId) {
  return doc(getWorkoutDaysCollectionRef(uid), dayId);
}

function mapWorkoutDayDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): WorkoutDay {
  const data = docSnapshot.data() as WorkoutDayDocData;

  return {
    dayId: data.dayId,
    weekday: data.weekday,
    type: data.type,
    label: data.label,
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
  };
}

// Get-or-create with defaults on first read, per docs/firestore-data-model.md section 1.3 —
// same pattern as src/lib/profile.ts's getOrCreateProfile, but seeding all 5 fixed dayIds
// in one batch instead of a single document.
export async function getOrCreateWorkoutDays(uid: string): Promise<WorkoutDay[]> {
  const snapshot = await getDocs(getWorkoutDaysCollectionRef(uid));
  const existingByDayId = new Map(
    snapshot.docs.map((docSnapshot) => [
      docSnapshot.id as WorkoutDayId,
      mapWorkoutDayDoc(docSnapshot),
    ]),
  );

  const missingDayIds = WORKOUT_DAY_IDS.filter((dayId) => !existingByDayId.has(dayId));

  if (missingDayIds.length > 0) {
    const batch = writeBatch(db);

    for (const dayId of missingDayIds) {
      const defaults = WORKOUT_DAY_DEFAULTS[dayId];
      batch.set(getWorkoutDayRef(uid, dayId), {
        dayId,
        weekday: defaults.weekday,
        type: defaults.type,
        label: defaults.label,
        updatedAt: serverTimestamp(),
      });
    }

    await batch.commit();
  }

  return WORKOUT_DAY_IDS.map(
    (dayId) =>
      existingByDayId.get(dayId) ?? {
        dayId,
        ...WORKOUT_DAY_DEFAULTS[dayId],
        updatedAt: new Date(),
      },
  );
}

export { getWorkoutDayRef, getWorkoutDaysCollectionRef };
