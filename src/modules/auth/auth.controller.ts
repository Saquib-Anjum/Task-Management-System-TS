
import type { Request, Response, NextFunction } from "express";
import {
  signupService,
  loginService,
} from "./auth.service.js";

const signup = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const user = await signupService(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: user,
    });
  } catch (error: unknown) {
    next(error);
  }
};

const login = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const result = await loginService(req.body);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error: unknown) {
    next(error);
  }
};

const getRefreshToken = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // TODO: Call the refresh-token service once implemented.
    res.status(501).json({
      success: false,
      message: "Refresh-token functionality is not implemented yet",
    });
  } catch (error: unknown) {
    next(error);
  }
};

export { signup, login, getRefreshToken };
