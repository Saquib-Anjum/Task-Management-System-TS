
import AppError from "../errors/app-error.js";
import type { RequestHandler } from "express";

const routeNotFound:RequestHandler=(req,_res,next)=>{
  next(
    new AppError(`Route not found | ${req.method} | ${req.originalUrl}`,404)
  )
}

export default routeNotFound;