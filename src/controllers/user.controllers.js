import { asyncHandler } from "../utils/asyncHandlers.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinay.js";
import { ApiResponse } from "../utils/ApiRseponses.js";


const registerUser = asyncHandler( async (req, res) =>{
    //get info of user from frontend
    
    const {username, email, password, Fullname} = req.body
    console.log("email: ",email);
    
    //check if user already exist - username, email
    const existedUser = User.findOne({email})
    if (existedUser) {
        throw new ApiError(409, "User with email is alredy exist")
    }
    
    //validation - not empty
    if (
        [username, email, password, Fullname].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All field are required")
    }
    
    //check avatar and image 
    const avatarLocalStorage = req.files?.avatar[0]?.path;
    const imageLocalStorage = req.files?.image[0]?.path;
    if (!avatarLocalStorage) {
        throw new ApiError(400, "Avatar is required.")
    }
    
    //upload them on cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalStorage)
    const coverImage = await uploadOnCloudinary(coverImageLocalStorage)
    
    //check avatar is uploaded on cloudinary
    if (!avatar) {
        throw new ApiError(500, "Avatar is not uploaded please try again.")
    }
    
    //register an user - create in db
    const user = await User.create({
        username,
        Fullname,
        email,
        avatar: avatar.url,
        coverImage: coverImage.url,
        password
    })
    
    //remove password & refreshToken field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )
    
    //check user created
    if (!createdUser){
        throw new ApiError(500, "something went wrong while registering user.")
    }
    
    //retuen res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "user registered succesfully")
    )
    
} )

export {registerUser}