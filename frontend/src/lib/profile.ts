import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

// Shared across features: check-ins (this task) needs initialWeightKg/goals/window/
// currentWeightKg, and the future Dieta module will need the rest of the same document
// (heightCm/age/activityLevel/etc. — not built yet). See docs/architecture/state-management.md's
// cross-feature-sharing rule and the precedent set by src/lib/auth-store.ts.
export interface Profile {
  initialWeightKg: number;
  currentWeightKg: number | null;
  goalNovemberComfortableKg: number;
  goalCapKg: number;
  goalOverweightExitKg: number;
  novemberWindowStart: Date;
  novemberWindowEnd: Date;
  updatedAt: Date | null;
}

export interface ProfileUpdate {
  initialWeightKg?: number;
  currentWeightKg?: number;
  goalNovemberComfortableKg?: number;
  goalCapKg?: number;
  goalOverweightExitKg?: number;
  novemberWindowStart?: Date;
  novemberWindowEnd?: Date;
}

function getProfileRef(uid: string) {
  return doc(db, 'users', uid, 'profile', 'main');
}

// Defaults from docs/firestore-data-model.md section 1.1 — only populate the document
// on first creation, never hardcoded elsewhere in the app.
function getDefaultProfileFields() {
  const currentYear = new Date().getFullYear();

  return {
    initialWeightKg: 105,
    goalNovemberComfortableKg: 94,
    goalCapKg: 90,
    goalOverweightExitKg: 82,
    novemberWindowStart: new Date(currentYear, 10, 1),
    novemberWindowEnd: new Date(currentYear, 10, 30),
  };
}

interface ProfileDocData {
  initialWeightKg: number;
  currentWeightKg?: number;
  goalNovemberComfortableKg: number;
  goalCapKg: number;
  goalOverweightExitKg: number;
  novemberWindowStart: Timestamp;
  novemberWindowEnd: Timestamp;
  updatedAt?: Timestamp;
}

function mapProfileDocData(data: ProfileDocData): Profile {
  return {
    initialWeightKg: data.initialWeightKg,
    currentWeightKg: data.currentWeightKg ?? null,
    goalNovemberComfortableKg: data.goalNovemberComfortableKg,
    goalCapKg: data.goalCapKg,
    goalOverweightExitKg: data.goalOverweightExitKg,
    novemberWindowStart: data.novemberWindowStart.toDate(),
    novemberWindowEnd: data.novemberWindowEnd.toDate(),
    updatedAt: data.updatedAt ? data.updatedAt.toDate() : null,
  };
}

// Gets the single-owner profile doc, creating it with the spec's defaults on first use.
// Only the fields this task needs are read/written — setDoc(..., { merge: true }) so a
// future Dieta module can add heightCm/age/activityLevel/etc. without clobbering this.
export async function getOrCreateProfile(uid: string): Promise<Profile> {
  const profileRef = getProfileRef(uid);
  const snapshot = await getDoc(profileRef);

  if (snapshot.exists()) {
    return mapProfileDocData(snapshot.data() as ProfileDocData);
  }

  const defaults = getDefaultProfileFields();

  await setDoc(
    profileRef,
    {
      ...defaults,
      novemberWindowStart: Timestamp.fromDate(defaults.novemberWindowStart),
      novemberWindowEnd: Timestamp.fromDate(defaults.novemberWindowEnd),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );

  return {
    ...defaults,
    currentWeightKg: null,
    updatedAt: new Date(),
  };
}

export async function updateProfile(uid: string, fields: ProfileUpdate): Promise<void> {
  const profileRef = getProfileRef(uid);
  const { novemberWindowStart, novemberWindowEnd, ...rest } = fields;

  await setDoc(
    profileRef,
    {
      ...rest,
      ...(novemberWindowStart && { novemberWindowStart: Timestamp.fromDate(novemberWindowStart) }),
      ...(novemberWindowEnd && { novemberWindowEnd: Timestamp.fromDate(novemberWindowEnd) }),
      updatedAt: serverTimestamp(),
    },
    { merge: true },
  );
}
