import mongoose, {Schema} from "mongoose";

const commentSchema = new Schema(
    {
        owner: {
            type: Schema.Types.ObjectId,
            ref: "user"
        },
        playListName: {
            type: String
        },
        videos: [
            {
                type: Schema.Types.ObjectId,
                ref: "Video"
            }
        ]
    },{timestamps: true}
)

export const Comment = mongoose.model("Comment", commentSchema)