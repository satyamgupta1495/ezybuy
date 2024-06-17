import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import { Service } from "typedi";
import CartService from "../services/cartServices";

@Service()
class CartController {

    constructor(private readonly cartService: CartService) {
        this.cartService = cartService
    }

    addToCart = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { productId, quantity } = req.body;
            const userId = req.user?._id

            const serviceResponse = await this.cartService.addToCart({ userId, productId, quantity })

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product added to cart successfully 👍';
            response.response = serviceResponse.response;
            return res.status(StatusCodes.OK).json(response);

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    getCart = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const userId = req.user._id;
            const serviceResponse = await this.cartService.getCart(userId)

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Cart fetched successfully 👍';
            response.response = serviceResponse.response;
            return res.status(StatusCodes.OK).json(response);
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    checkout = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { shippingAddress } = req.body;
            const userId = req.user._id;

            const serviceResponse = await this.cartService.checkout({ userId, shippingAddress })

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Order placed successfully 👍';
            response.response = serviceResponse.response;
            return res.status(StatusCodes.OK).json(response);

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    removeFromCart = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const { productId, action } = req.body;
            const userId = req.user._id;

            const serviceResponse = await this.cartService.removeFromCart({ userId, productId, action });

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'Product removed from cart successfully 👍';
            response.response = serviceResponse.response;
            return res.status(StatusCodes.OK).json(response);

        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
}

export default CartController;
