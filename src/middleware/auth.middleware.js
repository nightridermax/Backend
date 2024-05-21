import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) =>{
    try {
        const token = await req.cookies?.refreshToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unauthorized user")
        }
        
        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET)
    
        if (!decodedToken) {
            throw new ApiError(401, "unauthorized user")
        }
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500, "verifyJWT failed")
    }
})

