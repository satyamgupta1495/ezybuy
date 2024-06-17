import { Router } from 'express';
import Container from "typedi";
import CartController from '../../controllers/cart.controller';
import Authorization from '../../middlewares/auth.middleware';

export default function cartRouteHandler(): Router {
    const cartController = Container.get(CartController)
    const cartRouter = Router()
    const auth = new Authorization()

    //private routes
    cartRouter.post('/add', auth.verifyJWT, cartController.addToCart);
    cartRouter.get('/', auth.verifyJWT, cartController.getCart);
    cartRouter.post('/checkout', auth.verifyJWT, cartController.checkout);
    cartRouter.post('/remove', auth.verifyJWT, cartController.removeFromCart);

    return cartRouter;
}