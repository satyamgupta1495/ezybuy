import { Router } from 'express';
import productRouteHandler from './product.routes';
import cartRouteHandler from './cart.routes';
import authRouteHandler from './auth.routes';

export default function v1RouteHandler(): Router {
    const v1Router = Router();

    v1Router.use('/auth', authRouteHandler());
    v1Router.use('/product', productRouteHandler());
    v1Router.use('/cart', cartRouteHandler());

    return v1Router;
}
