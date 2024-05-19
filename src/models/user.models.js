import mongoose, {Schema} from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true,
            trim: true
        },
        email:{
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        Fullname:{
            type: String,
            required: true,
            index: true,
            trim: true
        },
        avtar:{
            type: String,
            required: true
        },
        coverImage:{
            type: String
        },
        watchHistory:[
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ],
        password:{
            type: String,
            required: [true, "Password is required."]
        },
        refreshToken: {
            type: String
        }
    },{timestamps: true}
)

// Password encrypt & check
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next()
})

userSchema.methods.isPasswordCorrect = async function
(password){
    return await bcrypt.compare(password, this.password);
}

// Token
userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id: this._id,
            email: this.email,
            username: this.username
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}
userSchema.methods.generateRefreshToken = function(){
    jwt.sign(
        {
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}


export const User = mongoose.model("User", userSchema)