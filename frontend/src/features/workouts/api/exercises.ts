import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';

import type {
  Exercise,
  ExerciseFormInput,
  WorkoutDayId,
} from '@/features/workouts/types/workout.types';
import { db } from '@/lib/firebase';

interface ExerciseDocData {
  name: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  order: number;
  completedThisWeek?: boolean;
  lastCompletedAt?: Timestamp | null;
  createdAt?: Timestamp;
}

function getExercisesCollectionRef(uid: string, dayId: WorkoutDayId) {
  return collection(db, 'users', uid, 'workoutDays', dayId, 'exercises');
}

function getExerciseRef(uid: string, dayId: WorkoutDayId, exerciseId: string) {
  return doc(getExercisesCollectionRef(uid, dayId), exerciseId);
}

function mapExerciseDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Exercise {
  const data = docSnapshot.data() as ExerciseDocData;

  return {
    id: docSnapshot.id,
    name: data.name,
    sets: data.sets,
    repsMin: data.repsMin,
    repsMax: data.repsMax,
    order: data.order,
    completedThisWeek: data.completedThisWeek ?? false,
    lastCompletedAt: data.lastCompletedAt ? data.lastCompletedAt.toDate() : null,
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
}

// Ordered by `order` per docs/firestore-data-model.md section 1.4 — the day's display order.
export async function listExercises(uid: string, dayId: WorkoutDayId): Promise<Exercise[]> {
  const exercisesQuery = query(getExercisesCollectionRef(uid, dayId), orderBy('order', 'asc'));
  const snapshot = await getDocs(exercisesQuery);

  return snapshot.docs.map(mapExerciseDoc);
}

export interface CreateExerciseParams {
  uid: string;
  dayId: WorkoutDayId;
  order: number;
  payload: ExerciseFormInput;
}

// Adicionar exercício — docs/project/fitliving-web.md section 3.3.
export async function createExercise(params: CreateExerciseParams): Promise<Exercise> {
  const { uid, dayId, order, payload } = params;
  const exerciseRef = doc(getExercisesCollectionRef(uid, dayId));

  await setDoc(exerciseRef, {
    name: payload.name,
    sets: payload.sets,
    repsMin: payload.repsMin,
    repsMax: payload.repsMax,
    order,
    completedThisWeek: false,
    lastCompletedAt: null,
    createdAt: serverTimestamp(),
  });

  return {
    id: exerciseRef.id,
    name: payload.name,
    sets: payload.sets,
    repsMin: payload.repsMin,
    repsMax: payload.repsMax,
    order,
    completedThisWeek: false,
    lastCompletedAt: null,
    createdAt: new Date(),
  };
}

export interface UpdateExerciseParams {
  uid: string;
  dayId: WorkoutDayId;
  exerciseId: string;
  payload: ExerciseFormInput;
}

// Editar nome/séries/faixa de reps — docs/project/fitliving-web.md section 3.3.
export async function updateExercise(params: UpdateExerciseParams): Promise<void> {
  const { uid, dayId, exerciseId, payload } = params;

  await updateDoc(getExerciseRef(uid, dayId, exerciseId), {
    name: payload.name,
    sets: payload.sets,
    repsMin: payload.repsMin,
    repsMax: payload.repsMax,
  });
}

export interface DeleteExerciseParams {
  uid: string;
  dayId: WorkoutDayId;
  exerciseId: string;
}

export async function deleteExercise(params: DeleteExerciseParams): Promise<void> {
  const { uid, dayId, exerciseId } = params;

  await deleteDoc(getExerciseRef(uid, dayId, exerciseId));
}

export interface SetExerciseCompletedParams {
  uid: string;
  dayId: WorkoutDayId;
  exerciseId: string;
  completed: boolean;
}

// Checkbox "concluído no dia" — docs/project/fitliving-web.md section 3.2. Only stamps
// lastCompletedAt when marking complete; unchecking clears completedThisWeek but keeps the
// previous lastCompletedAt as history (see is-completed-this-week.ts for the read-side
// weekly reset logic this enables without a scheduled job).
export async function setExerciseCompleted(params: SetExerciseCompletedParams): Promise<void> {
  const { uid, dayId, exerciseId, completed } = params;

  await updateDoc(getExerciseRef(uid, dayId, exerciseId), {
    completedThisWeek: completed,
    ...(completed && { lastCompletedAt: serverTimestamp() }),
  });
}

export { getExerciseRef, getExercisesCollectionRef };
