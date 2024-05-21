import { ApiError } from "../utils/ApiErrors.js";
import { asyncHandler } from "../utils/asyncHandlers.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";

export const verifyJWT = asyncHandler(async(req, _, next) =>{
    try {
        const token = await req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")

        if (!token) {
            throw new ApiError(401, "unauthorized user")
        }
        
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        if (!decodedToken) {
            throw new ApiError(401, "kal ache se shikh ke aana beta: haking")
        }
    
        const user = await User.findById(decodedToken._id).select("-password -refreshToken")
    
        req.user = user
        next()
    } catch (error) {
        throw new ApiError(500, "verifyJWT failed")
    }
})

