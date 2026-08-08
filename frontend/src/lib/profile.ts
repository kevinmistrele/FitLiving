import { useQuery } from '@tanstack/react-query';
import { doc, getDoc, serverTimestamp, setDoc, Timestamp } from 'firebase/firestore';

import { db } from '@/lib/firebase';

// Shared across features: check-ins needs initialWeightKg/goals/window/currentWeightKg, and
// the Dieta module (docs/firestore-data-model.md section 1.1) needs heightCm/age/sex/
// activityLevel/dietDeficitLevel on the same document. See docs/architecture/
// state-management.md's cross-feature-sharing rule and the precedent set by
// src/lib/auth-store.ts.
export type Sex = 'male' | 'female';
export const SEX_OPTIONS: Sex[] = ['male', 'female'];

// Multipliers documented in docs/firestore-data-model.md section 2.1.
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';
export const ACTIVITY_LEVEL_OPTIONS: ActivityLevel[] = [
  'sedentary',
  'light',
  'moderate',
  'active',
  'very_active',
];

// Fixed kcal/day deficits documented in docs/firestore-data-model.md section 2.2.
export type DietDeficitLevel = 'mild' | 'moderate' | 'aggressive';
export const DIET_DEFICIT_LEVEL_OPTIONS: DietDeficitLevel[] = ['mild', 'moderate', 'aggressive'];

export interface Profile {
  heightCm: number | null;
  age: number | null;
  sex: Sex | null;
  activityLevel: ActivityLevel;
  dietDeficitLevel: DietDeficitLevel;
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
  heightCm?: number;
  age?: number;
  sex?: Sex;
  activityLevel?: ActivityLevel;
  dietDeficitLevel?: DietDeficitLevel;
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
// on first creation, never hardcoded elsewhere in the app. heightCm/age/sex have no sensible
// default (section 4.1 requires the user to fill them in) so they're left unset here and
// surface as `null` until the diet profile form is saved.
function getDefaultProfileFields() {
  const currentYear = new Date().getFullYear();

  return {
    activityLevel: 'moderate' as ActivityLevel,
    dietDeficitLevel: 'moderate' as DietDeficitLevel,
    initialWeightKg: 105,
    goalNovemberComfortableKg: 94,
    goalCapKg: 90,
    goalOverweightExitKg: 82,
    novemberWindowStart: new Date(currentYear, 10, 1),
    novemberWindowEnd: new Date(currentYear, 10, 30),
  };
}

interface ProfileDocData {
  heightCm?: number;
  age?: number;
  sex?: Sex;
  activityLevel?: ActivityLevel;
  dietDeficitLevel?: DietDeficitLevel;
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
    heightCm: data.heightCm ?? null,
    age: data.age ?? null,
    sex: data.sex ?? null,
    // Fallback covers profile docs created before this module existed (no activityLevel/
    // dietDeficitLevel stored yet) — same "moderate" default as a brand-new profile.
    activityLevel: data.activityLevel ?? 'moderate',
    dietDeficitLevel: data.dietDeficitLevel ?? 'moderate',
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
// Only the fields each module needs are read/written — setDoc(..., { merge: true }) so
// the Dieta module's heightCm/age/sex/activityLevel/dietDeficitLevel writes never clobber
// what check-ins/workouts already wrote to this same document.
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
    heightCm: null,
    age: null,
    sex: null,
    currentWeightKg: null,
    updatedAt: new Date(),
  };
}

// Shared query hook: check-ins and diet both read/invalidate the same profile document
// (check-ins for goals/currentWeightKg, diet for heightCm/age/sex/activityLevel and to
// recompute TDEE/macros whenever a new check-in mirrors a fresh currentWeightKg here).
// Lives in lib, not in either feature, precisely so both can share one real query key
// instead of two features independently typing the same ['profile', uid] literal.
export const profileQueryKey = (uid: string) => ['profile', uid] as const;

export function useProfileQuery(uid: string | undefined) {
  return useQuery({
    queryKey: profileQueryKey(uid ?? ''),
    queryFn: () => getOrCreateProfile(uid ?? ''),
    enabled: Boolean(uid),
  });
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
