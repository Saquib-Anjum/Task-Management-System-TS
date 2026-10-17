
import { z } from "zod";

const taskInputValidator = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Title must contain at least 2 characters")
    .max(150, "Title cannot exceed 150 characters"),

  description: z
    .string()
    .trim()
    .max(1000, "Description cannot exceed 1000 characters")
    .optional(),

  date: z.iso
    .datetime({ message: "Please provide a valid date and time" })
    .optional(),

  status: z
    .enum(["Completed", "Pending"])
    .optional(),
});

// For creating tasks
const createTaskValidator = taskInputValidator;

// For partially updating tasks
const updateTaskValidator = taskInputValidator
  .partial()
  .refine(
    (data) => Object.values(data).some((value) => value !== undefined),
    {
      message: "Provide at least one field to update",
    },
  );

export type TaskInput = z.infer<typeof createTaskValidator>;
export type UpdateTaskInput = z.infer<typeof updateTaskValidator>;

export {
  taskInputValidator,
  createTaskValidator,
  updateTaskValidator,
};
