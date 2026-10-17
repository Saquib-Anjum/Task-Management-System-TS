import express from "express";
import type { Request, Response } from "express";
import userRouter from "./modules/users/user.route.js";
import authRouter from "./modules/auth/auth.route.js";
import routeNotFound from "./middleware/not-found.middleware.js";
import errorMiddleware from "./middleware/error.middleware.js";
import taskRouter from "./modules/tasks/task.route.js";
const app = express();
//configs
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded());
//middlewares

//routes
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/task',taskRouter);
app.get('/',(_req:Request,res:Response)=>{
res.json({
  success:true,
  message:"server is alive"
})
})

app.use(routeNotFound);
app.use(errorMiddleware)

export default app;