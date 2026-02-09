import mongoose from "mongoose";

const vanSchema = new mongoose.Schema({
  vanname: { type: String, required: true },
  seatType: { type: Number, required: true }, // e.g., 14
  Image: [String], // Array of URLs
  description: String,
}, { timestamps: true });

export default mongoose.model("Van", vanSchema);