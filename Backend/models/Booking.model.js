import mongoose from "mongoose";

const BookingSchema = new mongoose.Schema({
  customerName: String,
  mobileNumber: String,
  bookingDate: String, // YYYY-MM-DD
  bookingCategory: String, // Full Booking | Seat Booking
  vanId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Van",
  },
  seatNumber: Number, // null for full booking
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Booking", BookingSchema);
