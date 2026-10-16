import {Router}from 'express'
import { getRefreshToken, login, signup } from './auth.controller.js';
import { signupSchemaValidator,loginSchemaValidator } from './auth.validator.js';
import validate from '../../middleware/validate.middleware.js';
const authRouter = Router();
authRouter.post('/signup',validate(signupSchemaValidator),signup);
authRouter.post('/login',validate(loginSchemaValidator),login);
authRouter.post('/refresh-token',getRefreshToken);
export default authRouter;