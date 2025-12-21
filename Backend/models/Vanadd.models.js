import mongoose from "mongoose";

const VanSchema = new mongoose.Schema({
    vanname: {
        type: String,
        required: true,
        trim: true
    },
    Seat: {
        type: Number,
        required: true
    },
    Type: {
        type: String,
        enum: ["AC", "NoAC"],
        required: true
    },
    type2: {
        type: String,
        enum: ["Automatic", "Manual"],
        required: true
    },
    Image: {
        type: [String], // array of image URLs
        required: true
    },
    date: {
        type: String
    }
}, { timestamps: true });

export default mongoose.model("Van", VanSchema);
