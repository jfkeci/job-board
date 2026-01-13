import { z } from 'zod';

/**
 * Zod schema for environment variable validation
 * Provides runtime validation with type coercion and meaningful error messages
 */
export const envSchema = z.object({
  // App Configuration
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.coerce.number().positive().default(3001),
  API_PREFIX: z.string().default('api'),

  // Database Configuration (TypeORM PostgreSQL)
  DB_HOST: z.string().min(1, 'DB_HOST is required'),
  DB_PORT: z.coerce.number().positive().default(5432),
  DB_USERNAME: z.string().min(1, 'DB_USERNAME is required'),
  DB_PASSWORD: z.string().default(''),
  DB_DATABASE: z.string().min(1, 'DB_DATABASE is required'),
  DB_SYNCHRONIZE: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
  DB_LOGGING: z
    .string()
    .transform((val) => val === 'true')
    .default('false'),
});

/**
 * Type inferred from the Zod schema
 */
export type EnvSchemaType = z.infer<typeof envSchema>;

/**
 * Validate environment variables against the schema
 */
export function validateEnv(
  env: Record<string, string | undefined>,
): EnvSchemaType {
  const result = envSchema.safeParse(env);

  if (!result.success) {
    const errors = result.error.errors
      .map((err) => `  - ${err.path.join('.')}: ${err.message}`)
      .join('\n');

    throw new Error(`Configuration validation failed:\n${errors}`);
  }

  return result.data;
}
