import { Service } from "typedi";
import { Request, Response } from 'express';
import { StatusCodes } from "http-status-codes";
import AuthService from "../services/authServices";
import jwt from "jsonwebtoken";

@Service()
class AuthController {

    constructor(private readonly authService: AuthService) {
        this.authService = authService
    }

    register = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const { email, password, role } = req.body;

            const serviceResponse = await this.authService.register({ email, password, role })

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'User created successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    login = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const { email, password, role } = req.body;

            const serviceResponse = await this.authService.login({ email, password, role })

            if (!serviceResponse.success) {
                response.response = serviceResponse.response;
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return;
            }

            response.success = true;
            response.successMsg = 'User logged in successfully 👍';
            response.response = serviceResponse.response;
            res.status(StatusCodes.OK).json(response);
            return;
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    logout = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };
        try {
            const id = req.user._id

            const serviceResponse = await this.authService.logout(id)

            if (!serviceResponse?.response?.user) {
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return
            }

            response.success = true;
            response.successMsg = 'User logged out successfully 👍';
            response.response = serviceResponse.response;

            res.status(StatusCodes.OK).json(response);
            return res;
        } catch (error: any) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

    refreshAccessToken = async (req: Request | any, res: Response) => {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

            console.log("incomingRefreshToken", incomingRefreshToken)

            if (!incomingRefreshToken) {
                response.errorMsg = "Unauthorized error"
                return response
            }

            const decodedToken: any = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);

            console.log("decodedToken", decodedToken)

            const serviceResponse = await this.authService.refreshAccessToken(incomingRefreshToken, decodedToken)

            console.log("serviceResponse", serviceResponse)

            if (!serviceResponse.success) {
                response.errorMsg = serviceResponse.errorMessage;
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(response);
                return
            }

            response.success = true;
            response.successMsg = 'Token refreshed successfully 👍';
            response.response = serviceResponse.response;

            res.status(StatusCodes.OK).json(response);

            return res;

        } catch (error) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }

}

export default AuthController