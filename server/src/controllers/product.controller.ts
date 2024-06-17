import { Request, Response } from 'express';
import { Service } from "typedi";
import { StatusCodes } from "http-status-codes";
import ProductService from '../services/productServices';
import { uploadToCloudinary } from '../utils/cloudinaryService';

@Service()
class ProductController {
    constructor(private readonly productService: ProductService) {
        this.productService = productService
    }

    createProduct = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const { title, description, price } = req.body;

            const productImage = req.files?.image?.[0]?.path

            if (!productImage) {
                response.errorMsg = "Product image is required!"
                res.status(StatusCodes.CONFLICT).json(response);
                return;
            }

            const imagePath: any = await uploadToCloudinary(productImage);

            if (!imagePath) {
                response.errorMsg = "Profile image is required!"
                res.status(StatusCodes.CONFLICT).json(response);
                return;
            }

            const serviceResponse = await this.productService.createProduct({ title, description, price, image: imagePath?.url })

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product created successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    getProducts = async (req: Request, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const serviceResponse = await this.productService.getProducts()

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product fetched successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    updateProduct = async (req: Request, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { productId } = req.params;
            const productData = req.body;

            const serviceResponse = await this.productService.updateProduct(productId, productData);

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product updated successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    deleteProduct = async (req: Request, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { productId } = req.params;

            const serviceResponse = await this.productService.deleteProduct(productId);

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product deleted successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    getProduct = async (req: Request, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { productId } = req.params;

            const serviceResponse = await this.productService.getProduct(productId);

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product details fetch successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}

export default ProductController;
