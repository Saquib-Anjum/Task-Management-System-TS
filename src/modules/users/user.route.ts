import {Router} from 'express';
import protect from '../../middleware/auth.middleware.js';
import { deleteUser, getuser, updateUser } from './user.controller.js';
import validate from '../../middleware/validate.middleware.js';
import { updateUserSchema } from './user.validator.js';
const userRouter = Router();

userRouter.get('/me',protect,getuser);
userRouter.put('/update',protect,validate(updateUserSchema),updateUser);

userRouter.delete('/delete',protect,deleteUser)

export default userRouter;