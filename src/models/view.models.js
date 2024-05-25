import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema(
    {
        video: {
            type: Schema.Types.ObjectId,
            ref: "video"
        },
        viewBy: {
            type: Schema.Types.ObjectId,
            ref: "user"
        }
    },{timestamps: true}
)

export const Comment = mongoose.model("Comment", commentSchema)