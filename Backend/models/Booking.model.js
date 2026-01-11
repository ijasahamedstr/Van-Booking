import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    customerName: { type: String, required: true },
    mobileNumber: { type: String, required: true },
    bookingDate: { type: String, required: true },
    bookingCategory: { type: String, required: true },
    
    // Van Details
    van: { type: String }, // Van Name
    
    // Seat Logic
    seatNumber: { type: String }, // For single seat booking
    seatNumbers: [String],        // For "Full Booking" (stores all seats like ["1","2"..."14"])

    // Flight/Abroad Details
    country: { type: String },
    arrivalTime: { type: String },
    arrivalMode: { type: String }, 
    ticketFile: { type: String }, // Path to uploaded file

    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);