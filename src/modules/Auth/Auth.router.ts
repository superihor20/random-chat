import { Router } from 'express';

import { UserService } from '../User/User.service';

import { AuthController } from './Auth.controller';
import { AuthService } from './Auth.service';

const authRouter = Router();
const userService = new UserService();
const authService = new AuthService(userService);
const authController = new AuthController(authService);

authRouter.post('/sign-up', authController.signUp);
authRouter.get('/sign-in', authController.signIn);

export default authRouter;
