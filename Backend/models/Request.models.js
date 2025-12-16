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
      trim: true,
    },

    requestType: {
      type: String,
      required: true,
      enum: [
        "Van Not Available – Need Full Booking",
        "Van For Event Booking",
        "Cancel Full Booking",
        "Cancel Seat Booking",
        "Emergency Service", // ✅ NEW
      ],
    },

    bookingDate: {
      type: Date,
    },

    van: {
      type: String,
      trim: true,
    },

    seatNumber: {
      type: String,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    /* ---------------- EMERGENCY FIELDS ---------------- */
    emergencyReason: {
      type: String,
      trim: true,
    },

    emergencyArea: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Request", requestSchema);
