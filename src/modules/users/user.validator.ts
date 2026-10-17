import { z } from "zod";

const updateUserSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must contain at least 2 characters")
      .max(100, "Name cannot exceed 100 characters")
      .optional(),

    email: z
      .string()
      .trim()
      .email("Please provide a valid email address")
      .transform((email) => email.toLowerCase())
      .optional(),
    password: z
      .string()
      .min(8, "Password must contain at least 8 characters")
      .max(50, "Password cannot exceed 50 characters"),
  })
  .refine((data) => data.name !== undefined || data.email !== undefined, {
    message: "Provide at least one field to update",
  });

export { updateUserSchema };
export type UpdateUserInput = z.infer<typeof updateUserSchema>;




