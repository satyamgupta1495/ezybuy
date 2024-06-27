import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";
import jwt from 'jsonwebtoken';
import User from "../models/user.model";

class Authorization {

    public async verifyJWT(req: any, res: Response, next: NextFunction) {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                response.errorMsg = 'Token not found 🚧'
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return res;
            }

            const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN);

            const user = await User.findById(decodedToken?._id).select('-password -refreshToken');
            if (!user) {
                response.errorMsg = 'No user found with this token!'
                response.status(StatusCodes.UNAUTHORIZED).json(response);
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return res;
            }

            req.user = user;
            next()
        } catch (error) {
            response.internalError = true;
            response.errorMessage = error?.message;
            response.error = error;
            res.status(StatusCodes.UNAUTHORIZED).json(response);
        }
    }

    public async verifyUserRole(req: any, res: Response, next: NextFunction) {
        const response: any = {
            success: false,
            errorMsg: '',
            successMsg: '',
            response: {},
        };

        try {
            const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
            if (!token) {
                response.errorMsg = 'Token not found 🚧'
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return res;
            }

            const decodedToken: any = jwt.verify(token, process.env.ACCESS_TOKEN);

            if (decodedToken?.role !== "superadmin") {
                response.errorMsg = 'Unauthorized access 🚧';
                res.status(StatusCodes.UNAUTHORIZED).json(response);
                return res;
            }
            next()
        } catch (error) {
            response.internalError = true;
            response.errorMessage = "Invalid token";
            response.error = error;
            res.status(StatusCodes.UNAUTHORIZED).json(response);
        }
    }

}

export default Authorization;