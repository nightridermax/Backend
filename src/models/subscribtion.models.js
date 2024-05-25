import mongoose, {Schema} from "mongoose";

const subscribtionSchema = new Schema(
    {
        subscriber: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        
        channel: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    }, {timestamps: true}
)

export const Subscribtion = mongoose.model("Subscribtion", subscribtionSchema)