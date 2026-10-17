
import type { RequestHandler,Request } from "express";
import jwt, { type JwtPayload } from "jsonwebtoken";

import AppError from "../errors/app-error.js";
import { env } from "../config/env.js";

type AccessTokenPayload = JwtPayload & {
  userId: string;
};

const protect: RequestHandler = (req:Request, _res, next): void => {
  try {
    const authorization = req.headers.authorization;

    // Check whether the Authorization header exists
    if (!authorization) {
      return next(
        new AppError("Authorization token is required", 401),
      );
    }

    // Expected format: Bearer <token>
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      return next(
        new AppError("Invalid authorization header format", 401),
      );
    }

    // Verify the JWT signature and expiration
    const decoded = jwt.verify(token, env.JWT_SECRET);

    // A JWT payload may be an object or a string
    if (
      typeof decoded !== "object" ||
      decoded === null ||
      typeof (decoded as JwtPayload).userId !== "string"
    ) {
      return next(
        new AppError("Invalid access token payload", 401),
      );
    }

    const payload = decoded as AccessTokenPayload;

  
    req.user = {
      userId: payload.userId,
    };

    next();
  } catch {
    next(new AppError("Invalid or expired access token", 401));
  }
};

export default protect;
