import { Router } from 'express';
import AuthController from '../../controllers/auth.controller';
import Container from "typedi";
import Authorization from '../../middlewares/auth.middleware';

export default function authRouteHandler(): Router {
    const authController = Container.get(AuthController)
    const authRouter = Router()
    const auth = new Authorization()

    authRouter.post('/register', authController.register);
    authRouter.post('/login', authController.login);

    //Private routes
    authRouter.post('/logout', auth.verifyJWT, authController.logout);

    return authRouter;
}