
import type { Request, Response, NextFunction } from "express";
import AppError from "../../errors/app-error.js";
import taskService from "./task.service.js";

// Create task controller
const createTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication failed", 401);
    }

    const { userId } = req.user;

    const task = await taskService.createTaskService({
      ...req.body,
      userId,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: task,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// Update task controller
const updateTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication failed", 401);
    }

    const { userId } = req.user;
    const { taskId } = req.params;

    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }

    const task = await taskService.updateTaskService({
      ...req.body,
      userId,
      taskId,
    });

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: task,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// Get all tasks
const getTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication failed", 401);
    }

    const { userId } = req.user;
    const tasks = await taskService.getTaskService(userId);

    res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      count: tasks.length,
      data: tasks,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// Get task by ID
const getTaskById = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication failed", 401);
    }

    const { userId } = req.user;
    const { taskId } = req.params;

    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }

    const task = await taskService.getTaskByIdService(
      taskId.toString(),
      userId,
    );

    res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: task,
    });
  } catch (err: unknown) {
    next(err);
  }
};

// Delete task
const deleteTask = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.user) {
      throw new AppError("Authentication failed", 401);
    }

    const { userId } = req.user;
    const { taskId } = req.params;

    if (!taskId) {
      throw new AppError("Task ID is required", 400);
    }

    await taskService.deleteTaskService(taskId.toString(),userId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (err: unknown) {
    next(err);
  }
};

export {
  createTask,
  updateTask,
  getTask,
  getTaskById,
  deleteTask,
};
