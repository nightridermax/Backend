import { asyncHandler } from "../utils/asyncHandlers.js";


const registerUser = asyncHandler( async (req, res) =>{
    res.status(200).json({
        message: "User registered."
    })
} )

export {registerUser}