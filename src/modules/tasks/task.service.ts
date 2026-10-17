
import taskModel from "./task.model.js";
import type { TaskInput, UpdateTaskInput } from "./task.validator.js";
import AppError from "../../errors/app-error.js";

// Create task input
type CreateTaskInput = TaskInput & {
  userId: string;
};

// Update task input
type UpdateTaskInputType = UpdateTaskInput & {
  userId: string;
  taskId: string;
};

// Create task service
const createTaskService = async (data: CreateTaskInput) => {
  const { userId, title, description, date, status } = data;

  if (!userId || !title) {
    throw new AppError("User ID and title are required", 400);
  }

  const task = await taskModel.create({
    userId,
    title,
    ...(description !== undefined && { description }),
    ...(date !== undefined && { date: new Date(date) ||Date.now() }),
    status: status ?? "Pending",
  });

  return task;
};

// Update task service
const updateTaskService = async (data: UpdateTaskInputType) => {
  const { userId, taskId, title, description, date, status } = data;

  const task = await taskModel.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  if (title !== undefined) {
    task.title = title;
  }

  if (description !== undefined) {
    task.description = description;
  }

  if (date !== undefined) {
    task.date = new Date(date);
  }

  if (status !== undefined) {
    task.status = status;
  }

  await task.save();

  return task;
};

// Get all tasks belonging to a user
const getTaskService = async (userId: string) => {
  return await taskModel.find({ userId });
};

// Get one task belonging to a user
const getTaskByIdService = async (taskId: string, userId: string) => {
  const task = await taskModel.findOne({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

// Delete task belonging to a user
const deleteTaskService = async (taskId: string, userId: string) => {
  const task = await taskModel.findOneAndDelete({
    _id: taskId,
    userId,
  });

  if (!task) {
    throw new AppError("Task not found", 404);
  }

  return task;
};

export default {
  createTaskService,
  updateTaskService,
  getTaskService,
  getTaskByIdService,
  deleteTaskService,
};
