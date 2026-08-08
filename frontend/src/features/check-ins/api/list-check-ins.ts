import {
  collection,
  getDocs,
  orderBy,
  query,
  type DocumentData,
  type QueryDocumentSnapshot,
  type Timestamp,
} from 'firebase/firestore';

import type { CheckIn } from '@/features/check-ins/types/check-in.types';
import { toDateInputValue } from '@/features/check-ins/utils/date-input';
import { db } from '@/lib/firebase';

interface CheckInDocData {
  date: Timestamp;
  weightKg: number;
  waistCm: number;
  notes?: string;
  deltaWeightKg?: number | null;
  createdAt?: Timestamp;
}

function getCheckInsCollectionRef(uid: string) {
  return collection(db, 'users', uid, 'checkins');
}

function mapCheckInDoc(docSnapshot: QueryDocumentSnapshot<DocumentData>): CheckIn {
  const data = docSnapshot.data() as CheckInDocData;

  return {
    id: docSnapshot.id,
    date: toDateInputValue(data.date.toDate()),
    weightKg: data.weightKg,
    waistCm: data.waistCm,
    notes: data.notes ?? '',
    deltaWeightKg: data.deltaWeightKg ?? null,
    createdAt: data.createdAt ? data.createdAt.toDate() : new Date(),
  };
}

// Ordered by date ascending, per docs/firestore-data-model.md section 1.2's
// "Consultas típicas" — this is what the chart and progress stats consume.
export async function listCheckIns(uid: string): Promise<CheckIn[]> {
  const checkInsQuery = query(getCheckInsCollectionRef(uid), orderBy('date', 'asc'));
  const snapshot = await getDocs(checkInsQuery);

  return snapshot.docs.map(mapCheckInDoc);
}

export { getCheckInsCollectionRef };
