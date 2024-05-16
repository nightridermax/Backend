import mongoose, {Schema} from "mongoose";
import mongooseAggregatePaginate from "mongoose-aggregate-paginate-v2";

const videoSchema = new Schema(
    {
        videoFile: {
            type: String,  //cloudinary URI
            required: true
        },
        thumbnail: {
            type: String,  //cloudinary URI
            required: true
        },
        title: {
            type: String,  
            required: true
        },
        describtion: {
            type: String
        },
        duration: {
            type: String  //cloudinary URI
        },
        views: {
            type: Number,  
            default: 0
        },
        isPublished: {
            type: Boolean,  
            default: true
        },
        owner: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }
    },{timestamps: true}
)

videoSchema.plugin(mongooseAggregatePaginate);

export const Video = mongoose.model("Video", videoSchema)