import { z } from "zod";

/**
 * Environment variable schema for the admin dashboard.
 * All client-side variables must use NEXT_PUBLIC_ prefix.
 */
const envSchema = z.object({
  // Required
  NEXT_PUBLIC_API_URL: z
    .string({ required_error: "NEXT_PUBLIC_API_URL is required" })
    .url("NEXT_PUBLIC_API_URL must be a valid URL"),

  // Optional with defaults
  NEXT_PUBLIC_APP_NAME: z.string().default("job-board Admin"),
  NEXT_PUBLIC_APP_ENV: z
    .enum(["development", "staging", "production"])
    .default("development"),
  NEXT_PUBLIC_DASHBOARD_URL: z.string().default("http://localhost:3002"),
  NEXT_PUBLIC_WEB_URL: z.string().default("http://localhost:3000"),
});

/**
 * Validated environment configuration.
 * Throws on startup if required variables are missing or invalid.
 */
function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
    NEXT_PUBLIC_APP_ENV: process.env.NEXT_PUBLIC_APP_ENV,
    NEXT_PUBLIC_DASHBOARD_URL: process.env.NEXT_PUBLIC_DASHBOARD_URL,
    NEXT_PUBLIC_WEB_URL: process.env.NEXT_PUBLIC_WEB_URL,
  });

  if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(parsed.error.flatten().fieldErrors);
    throw new Error(
      "Invalid environment variables. Check the console for details.",
    );
  }

  return parsed.data;
}

export const env = validateEnv();

export type Env = z.infer<typeof envSchema>;
