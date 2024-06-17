import { Service } from "typedi";
import { ServiceResponse } from "../types/shared";
import Cart from "../models/cart.model";
import sendEmail from "../utils/sendEmail";


@Service()
export default class CartService {

    constructor() { }

    public async addToCart(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null, count: undefined },
            success: false,
            error: "",
        }

        try {
            const { userId, productId, quantity } = data;
            let cart = await Cart.findOne({ userId: userId });

            if (!cart) {
                cart = await Cart.create({ userId, products: [{ productId, quantity }] });
            } else {
                const productIndex = cart?.products?.findIndex(p => p.productId?.toString() === productId);
                if (productIndex >= 0) {
                    cart.products[productIndex].quantity = Number(cart?.products[productIndex]?.quantity) + Number(quantity);
                } else {
                    cart.products.push({ productId, quantity });
                }
            }

            await cart.save();
            res.success = true;
            res.response.result = cart;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async getCart(userId: string) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        }

        try {
            const cart = await Cart.findOne({ userId });

            if (!cart) {
                res.errorMessage = 'Cart not found!';
                return res;
            }

            res.success = true;
            res.response.result = cart;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async checkout(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        };

        try {
            const { shippingAddress, userId } = data;

            const cart: any = await Cart.findOne({ userId }).populate({
                path: 'products.productId',
                model: 'Product' 
            });

            if (!cart) {
                res.errorMessage = 'Cart not found';
                return res;
            }

            await sendEmail(userId, cart);

            const updatedCart = await Cart.findOneAndUpdate(
                { _id: cart._id },
                { $set: { products: [], shippingAddress } },
                { new: true }
            );

            if (!updatedCart) {
                res.errorMessage = 'Failed to update cart';
                return res;
            }

            res.success = true;
            res.response.result = updatedCart;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async removeFromCart(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        }

        try {
            const { userId, productId, action } = data;

            const cart = await Cart.findOne({ userId });

            if (!cart) {
                res.errorMessage = 'Cart not found';
                return res;
            }

            const productIndex = cart.products.findIndex(p => p.productId.toString() === productId);

            if (productIndex === -1) {
                res.errorMessage = 'Product not found in cart';
                return res;
            }

            if (action === 'delete') {
                cart.products.splice(productIndex, 1);
            } else {
                if (cart.products[productIndex].quantity <= 1) {
                    cart.products.splice(productIndex, 1);
                } else {
                    cart.products[productIndex].quantity--;
                }
            }

            await cart.save();

            res.success = true;
            res.response.result = cart;
            return res;

        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            return res;
        }
    }
}