
import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import AppError from '../errors/app-error.js';

const errorMiddleware: ErrorRequestHandler = (
  error: unknown,
  _req,
  res,
  _next,
): void => {
  // Zod validation errors
  if (error instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.issues.map((issue) => ({
        field: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  // Mongoose invalid ObjectId or casting errors
  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({
      success: false,
      message: "Invalid resource identifier",
    });
    return;
  }

  // MongoDB duplicate-key errors
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    res.status(409).json({
      success: false,
      message: "A record with this value already exists",
    });
    return;
  }

  // Known application errors
  if (error instanceof AppError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }

  // Unexpected errors: log details on the server
  console.error(error);

  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};

export default errorMiddleware;
