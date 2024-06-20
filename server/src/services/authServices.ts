import { Service } from "typedi";
import { ServiceResponse } from "../types/shared";
import User from "../models/user.model";
import Cart from "../models/cart.model";
import CartService from "./cartServices";


@Service()
export default class AuthService {

    constructor(private readonly cartService: CartService) {
        this.cartService = cartService
    }

    public async register(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null, count: undefined },
            success: false,
            error: "",
        }

        try {

            const newUser = await User.create(data);

            if (!newUser) {
                res.errorMessage = 'New user cannot be created!';
                return res;
            }

            await this.cartService.addToCart({ userId: newUser._id })

            res.success = true;
            res.response.result = newUser;
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async login(data: any) {
        const res: ServiceResponse<any> = {
            errorMessage: '',
            internalError: false,
            response: { result: null },
            success: false,
            error: "",
        }

        try {
            const user: any = await User.findOne({ email: data.email });

            if (!user) {
                res.errorMessage = 'Invalid credentials';
                return res;
            }

            const isValidPassword = await user.isValidPassword(data.password);

            if (!isValidPassword) {
                res.errorMessage = 'Incorrect password';
                return res;
            }

            const { accessToken, refreshToken } = await this.generateToken(user._id);

            const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

            res.success = true;
            res.response.result = { loggedInUser, accessToken, refreshToken };
            return res;
        } catch (error: any) {
            res.errorMessage = error.message;
            res.internalError = true;
            res.error = error;
            res.success = false;
            return res;
        }
    }

    public async logout(id: any) {
        const res: any = {
            errorMessage: '',
            internalError: false,
            response: {},
            success: false,
            error: undefined,
        };

        try {
            const user = await User.findByIdAndUpdate(
                id,
                {
                    $set: {
                        refreshToken: undefined
                    }
                },
                {
                    new: true
                }
            )

            res.success = true;
            res.response = { user };
            return res;
        } catch (error) {
            res.internalError = true;
            res.errorMessage = error;
            res.error = error;
            return res;
        }
    }

    public async generateToken(id: string) {
        const res: any = {
            errorMessage: '',
            internalError: false,
            response: {},
            success: false,
            error: undefined,
        };
        try {
            if (!id) {
                console.log("Id is required to generate access token")
                return
            }

            const user: any = await User.findById(id);
            const accessToken = await user.generateAccessToken()
            const refreshToken = await user.generateRefreshToken()

            user.refreshToken = refreshToken

            await user.save({ validateBeforeSave: false });

            return { accessToken, refreshToken }

        } catch (error) {
            res.internalError = true;
            res.errorMessage = "Something went wrong while generating access token🥺";
            res.error = error;
            return res;
        }
    }

    public async refreshAccessToken(incomingRefreshToken: string, decodedToken: string | any) {
        const res: any = {
            errorMessage: '',
            internalError: false,
            response: {},
            success: false,
            error: undefined,
        };

        try {
            const user: any = await User.findById(decodedToken?._id);

            if (!user) {
                res.errorMessage = "invalid_refresh_token";
                return res;
            }

            if (!(user?.refreshToken === incomingRefreshToken)) {
                res.errorMessage = "refresh_token_expired";
                return res;
            }

            const { accessToken, refreshToken } = await this.generateToken(user._id);

            res.success = true;
            res.response = { accessToken, refreshToken };
            return res;

        } catch (error) {
            res.internalError = true;
            res.errorMessage = error;
            res.error = error;
            return res;
        }
    }

}