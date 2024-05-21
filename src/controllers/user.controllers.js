import { asyncHandler } from "../utils/asyncHandlers.js";
import {ApiError} from "../utils/ApiErrors.js"
import { User } from "../models/user.models.js"
import { uploadOnCloudinary } from "../utils/cloudinay.js";
import { ApiResponse } from "../utils/ApiRseponses.js";


const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        User.refreshToken = refreshToken
        await user.save({ validateBeforesave: false })

        return {refreshToken, accessToken}

    } catch (error) {
        throw new ApiError(500, "something went wrong while generating tokens")
    }
}

const registerUser = asyncHandler( async (req, res) =>{
    //get info of user from frontend
    
    const {username, email, password, Fullname} = await req.body
    
    //check if user already exist - username, email
    const existedUser = await User.findOne({email})
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
    const coverImageLocalStorage = req.files?.coverImage[0]?.path;
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


const loginUser = asyncHandler( async (req, res) =>{
    // req body -> data
    const {username, email, password} = await req.body
    //check username or email
    if (!(username || email)) {
        throw new ApiError(400, "usernmae or email is required")
    }

    const user = await User.findOne({
        $or: [{username},{email}]
    })
    if (!user) {
        throw new ApiError(404, "user does not exist")
    } 
    
    //check password
    const isPaswordValid =  await user.isPasswordCorrect(password);

    if (!isPaswordValid) {
        throw new ApiError(400, "Password is invalid")
    }

    //generate accessToken and refreshToken
    const {refreshToken, accessToken} = await generateAccessAndRefreshToken(user._id)

    const logedInUser = await User.findById(user._id).select("-password -refreshToken")

    //send with cookies

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            201,
            {
                user: logedInUser, accessToken, refreshToken
            },
            "User successfully loged In"
        )
    )

    
} )

const logoutUser = asyncHandler(async(req, res)=>{
    //delete refreshToken
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true   
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    res
    .status(201)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json( new ApiResponse(200, {}, "User logout successfully"))

})

export {
    registerUser,
    loginUser,
    logoutUser
}