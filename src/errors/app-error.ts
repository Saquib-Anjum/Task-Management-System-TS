
class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: "fail" | "error";
  public readonly isOperational: boolean;

  constructor(
    message: string,
    statusCode: number = 500,
  ) {
    super(message);

    this.name = "AppError";
    this.statusCode = statusCode;
    this.status = statusCode >= 500 ? "error" : "fail";
    this.isOperational = true;

    Error.captureStackTrace(this, AppError);
  }
}

export default AppError;
