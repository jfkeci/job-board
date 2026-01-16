import { z } from 'zod';

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string({ required_error: 'NEXT_PUBLIC_API_URL is required' })
    .url('NEXT_PUBLIC_API_URL must be a valid URL'),
  NEXT_PUBLIC_APP_NAME: z.string().default('job-board Jobs'),
  NEXT_PUBLIC_DASHBOARD_URL: z.string().default('http://localhost:3002'),
  NEXT_PUBLIC_DEFAULT_TENANT_ID: z
    .string()
    .default('00000000-0000-0000-0000-000000000001'),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_DEFAULT_TENANT_ID: process.env.NEXT_PUBLIC_DEFAULT_TENANT_ID,
  });

  if (!parsed.success) {
    console.error('Invalid environment variables:');
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

export const env = validateEnv();
