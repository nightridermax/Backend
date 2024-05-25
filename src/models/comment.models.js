import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema(
    {
        content: {
            type: String
        },
        video: {
            type: Schema.Types.ObjectId,
            ref: "video"
        },
        commentBy: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },{timestamps: true}
)

export const Comment = mongoose.model("Comment", commentSchema)