import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true,
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    requestType: {
      type: String,
      required: true,
      enum: [
        "Van Not Available – Need Full Booking",
        "Van For Event Booking",
        "Cancel Full Booking",
        "Cancel Seat Booking",
      ],
    },
    bookingDate: {
      type: Date,
    },
    van: {
      type: String,
    },
    seatNumber: {
      type: String,
    },
    description: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Request", requestSchema);
