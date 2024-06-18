import { Router } from 'express';
import authMiddleware from '../../middlewares/auth.middleware';
import multer from 'multer';
import Container from "typedi";
import ProductController from "../../controllers/product.controller";
import { upload } from "../../middlewares/multer.middleware";
import Authorization from '../../middlewares/auth.middleware';


export default function productRouteHandler(): Router {
    const productRouter = Router()
    const productController = Container.get(ProductController)
    const auth = new Authorization()

    productRouter.get('/', productController.getProducts)

    //Private routes
    productRouter.get('/:productId', auth.verifyJWT, productController.getProduct)

    productRouter.post('/', auth.verifyJWT, auth.verifyUserRole, upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]), productController.createProduct)

    productRouter.patch('/:productId', auth.verifyJWT, auth.verifyUserRole, upload.fields([
        {
            name: "image",
            maxCount: 1
        }
    ]), productController.updateProduct)

    productRouter.delete('/:productId', auth.verifyJWT, auth.verifyUserRole, productController.deleteProduct)

    return productRouter;
}