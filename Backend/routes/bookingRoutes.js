import express from "express";
import multer from "multer";
import { createBooking, getBookedSeats, getVans } from "../controller/bookingController.js";

const Bookingrouter = express.Router();

// --- Multer Config for File Uploads ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Files will be saved in a folder named 'uploads' in the root
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    // Save as timestamp-originalName to avoid duplicates
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

// --- API Endpoints ---

// 1. Save Booking (Supports file upload with field name 'ticketFile')
Bookingrouter.post("/", upload.single("ticketFile"), createBooking);

// 2. Check Seat Availability
Bookingrouter.get("/countSeats", getBookedSeats);

// 3. Get List of Vans
Bookingrouter.get("/Vanaddinfo", getVans);

export default Bookingrouter;