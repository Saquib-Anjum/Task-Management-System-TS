import {Router} from 'express';
import validate from '../../middleware/validate.middleware.js';
import { taskInputValidator, updateTaskValidator } from './task.validator.js';
import protect from '../../middleware/auth.middleware.js';
import { createTask, deleteTask, getTask, getTaskById, updateTask } from './task.controller.js';
const taskRouter = Router();

taskRouter.post('/create',protect,validate(taskInputValidator),createTask);
taskRouter.put('/update/:id',protect,validate(updateTaskValidator),updateTask);
taskRouter.get('/get',protect,getTask);
taskRouter.get('/get/:id',protect, getTaskById);
taskRouter.delete('/delete/:id',protect,deleteTask);

export default taskRouter;