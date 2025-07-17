// lib/definitions.ts
import { z } from "zod";

/**
 * Signup form validation schema using Zod
 */
export const SignupFormSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters long." })
    .trim(),
  email: z.string().email({ message: "Please enter a valid email." }).trim(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters long." })
    .regex(/[a-zA-Z]/, { message: "Must contain at least one letter." })
    .regex(/[0-9]/, { message: "Must contain at least one number." })
    .regex(/[^a-zA-Z0-9]/, {
      message: "Must contain at least one special character.",
    })
    .trim(),
});

export type SignupFormValues = z.infer<typeof SignupFormSchema>;

/**
 * Form state used in server actions or API handlers
 */
export type FormState =
  | {
      errors?: Partial<Record<keyof SignupFormValues, string[]>>;
      message?: string;
    }
  | undefined;

/**
 * JWT session payload used for encoding/decoding JWTs
 */
export type SessionPayload = {
  userId: string;
  expiresAt: string; // ISO string (not Date object) for token compatibility
};
