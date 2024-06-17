import { Service } from "typedi";
import { ServiceResponse } from "../types/shared";
import Product from "../models/product.model";


@Service()
export default class ProductService {

    constructor() { }

    public async createProduct(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null, count: undefined },
            success: false,
            error: "",
        }

        try {
            const newProduct = await Product.create(data);

            if (!newProduct) {
                res.errorMessage = 'User product not found!';
                return res;
            }

            res.success = true;
            res.response.result = newProduct;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async getProducts() {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null, count: undefined },
            success: false,
            error: "",
        }

        try {
            const products = await Product.find();

            if (!products) {
                res.errorMessage = 'Products not found!';
                return res;
            }

            res.success = true;
            res.response.result = products;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async updateProduct(productId: string, productData: any): Promise<ServiceResponse<any>> {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        };

        try {
            const updatedProduct = await Product.findOneAndUpdate(
                { _id: productId },
                { $set: productData },
                { new: true }
            );

            if (!updatedProduct) {
                res.errorMessage = 'Product not found';
                return res;
            }

            res.success = true;
            res.response.result = updatedProduct;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            return res;
        }
    }

    public async deleteProduct(productId: string): Promise<ServiceResponse<any>> {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        };

        try {
            const deletedProduct = await Product.findOneAndDelete({ _id: productId });

            if (!deletedProduct) {
                res.errorMessage = 'Product not found';
                return res;
            }

            res.success = true;
            res.response.result = deletedProduct;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            return res;
        }
    }


    public async getProduct(productId: string): Promise<ServiceResponse<any>> {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        };

        try {
            const product = await Product.findById(productId);

            if (!product) {
                res.errorMessage = 'Product not found';
                return res;
            }

            res.success = true;
            res.response.result = product;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            return res;
        }
    }
}