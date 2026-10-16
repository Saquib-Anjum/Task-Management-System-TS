import { z } from "zod";

const signupSchemaValidator = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must contain at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, "Password must contain at least 8 characters")
    .max(50, "Password cannot exceed 50 characters"),
});

const loginSchemaValidator = z.object({
  email: z
    .string()
    .trim()
    .email("Please provide a valid email address")
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(1, "Password is required")
    .max(50, "Password cannot exceed 50 characters"),
});

export { signupSchemaValidator, loginSchemaValidator };

export type SignupInput = z.infer<typeof signupSchemaValidator>;
export type LoginInput = z.infer<typeof loginSchemaValidator>;
