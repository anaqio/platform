import { z } from 'zod';

/**
 * Environment variable schema validation.
 * Ensures the app has all required variables at runtime with correct types.
 * Inspired by T3 Stack's approach to type-safe environment variables.
 */
const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY: z.string().min(1),
  // Add other environment variables here as needed
});

/**
 * Validated environment variables.
 * Use this instead of process.env for type safety and validation.
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY:
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
});
