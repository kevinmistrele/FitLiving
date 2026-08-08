import { z } from 'zod';

const envSchema = z.object({
  VITE_FIREBASE_API_KEY: z.string().min(1),
  VITE_FIREBASE_AUTH_DOMAIN: z.string().min(1),
  VITE_FIREBASE_PROJECT_ID: z.string().min(1),
  VITE_FIREBASE_STORAGE_BUCKET: z.string().min(1),
  VITE_FIREBASE_MESSAGING_SENDER_ID: z.string().min(1),
  VITE_FIREBASE_APP_ID: z.string().min(1),
});

const parsedEnv = envSchema.parse(import.meta.env);

export const env = {
  firebaseApiKey: parsedEnv.VITE_FIREBASE_API_KEY,
  firebaseAuthDomain: parsedEnv.VITE_FIREBASE_AUTH_DOMAIN,
  firebaseProjectId: parsedEnv.VITE_FIREBASE_PROJECT_ID,
  firebaseStorageBucket: parsedEnv.VITE_FIREBASE_STORAGE_BUCKET,
  firebaseMessagingSenderId: parsedEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
  firebaseAppId: parsedEnv.VITE_FIREBASE_APP_ID,
} as const;
