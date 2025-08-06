import User from "../Models/userModel.js";
import { ApiError } from "../Helpers/apierror.js";
import jwt from "jsonwebtoken";
import { asynchandler } from "../Helpers/asynchandler.js";
export const authmiddleware = asynchandler(async (req, res, next) => {
    const token = req.cookies?.Accesstoken || req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
        throw new ApiError(400, "Unauthorized Request");
    }
    const decodedtoken = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decodedtoken?._id);
    if (!user) {
        throw new ApiError(400, "invalid access token");
    }
    req.user = user;
    next()
})