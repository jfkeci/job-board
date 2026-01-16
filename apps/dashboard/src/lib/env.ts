import { z } from 'zod';

/**
 * Environment variable schema for the dashboard frontend.
 * All client-side variables must use NEXT_PUBLIC_ prefix.
 */
const envSchema = z.object({
  // Required
  NEXT_PUBLIC_API_URL: z
    .string({ required_error: 'NEXT_PUBLIC_API_URL is required' })
    .url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_DEFAULT_TENANT_ID: z
    .string({ required_error: 'NEXT_PUBLIC_DEFAULT_TENANT_ID is required' })
    .uuid('NEXT_PUBLIC_DEFAULT_TENANT_ID must be a valid UUID'),

  // Optional with defaults
  NEXT_PUBLIC_APP_NAME: z.string().default('job-board Dashboard'),
  NEXT_PUBLIC_APP_ENV: z
    .enum(['development', 'staging', 'production'])
    .default('development'),
});

/**
 * Validated environment configuration.
 * Throws on startup if required variables are missing or invalid.
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_DEFAULT_TENANT_ID: process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
  });

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error(
      'Invalid environment variables. Check the console for details.',
    );
  }

  return parsed.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
