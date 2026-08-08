import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  setDoc,
  updateDoc,
  type DocumentData,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';

import type { Meal, MealFormInput, MealTiming } from '@/features/diet/types/diet.types';
import { db } from '@/lib/firebase';

interface MealDocData {
  name: string;
  description?: string;
  approxKcal: number;
  approxProteinG: number;
  order: number;
  timing: MealTiming;
}

function getMealPlanCollectionRef(uid: string) {
  return collection(db, 'users', uid, 'mealPlan');
}

function getMealRef(uid: string, mealId: string) {
  return doc(getMealPlanCollectionRef(uid), mealId);
}

function mapMealDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): Meal {
  const data = docSnapshot.data() as MealDocData;

  return {
    id: docSnapshot.id,
    name: data.name,
    description: data.description ?? '',
    approxKcal: data.approxKcal,
    approxProteinG: data.approxProteinG,
    order: data.order,
    timing: data.timing,
  };
}

// Ordered by `order` per docs/firestore-data-model.md section 1.7 — the day's display order.
export async function listMeals(uid: string): Promise<Meal[]> {
  const mealsQuery = query(getMealPlanCollectionRef(uid), orderBy('order', 'asc'));
  const snapshot = await getDocs(mealsQuery);

  return snapshot.docs.map(mapMealDoc);
}

export interface CreateMealParams {
  uid: string;
  order: number;
  payload: MealFormInput;
}

// Adicionar refeição — docs/project/fitliving-web.md section 4.3.
export async function createMeal(params: CreateMealParams): Promise<Meal> {
  const { uid, order, payload } = params;
  const mealRef = doc(getMealPlanCollectionRef(uid));

  await setDoc(mealRef, {
    name: payload.name,
    description: payload.description,
    approxKcal: payload.approxKcal,
    approxProteinG: payload.approxProteinG,
    order,
    timing: payload.timing,
  });

  return {
    id: mealRef.id,
    name: payload.name,
    description: payload.description,
    approxKcal: payload.approxKcal,
    approxProteinG: payload.approxProteinG,
    order,
    timing: payload.timing,
  };
}

export interface UpdateMealParams {
  uid: string;
  mealId: string;
  payload: MealFormInput;
}

// Editar refeição — docs/project/fitliving-web.md section 4.3.
export async function updateMeal(params: UpdateMealParams): Promise<void> {
  const { uid, mealId, payload } = params;

  await updateDoc(getMealRef(uid, mealId), {
    name: payload.name,
    description: payload.description,
    approxKcal: payload.approxKcal,
    approxProteinG: payload.approxProteinG,
    timing: payload.timing,
  });
}

export interface DeleteMealParams {
  uid: string;
  mealId: string;
}

// Remover refeição — docs/project/fitliving-web.md section 4.3.
export async function deleteMeal(params: DeleteMealParams): Promise<void> {
  const { uid, mealId } = params;

  await deleteDoc(getMealRef(uid, mealId));
}

export { getMealPlanCollectionRef, getMealRef };
