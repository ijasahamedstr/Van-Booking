import express from "express";
import { createBooking, getBookedSeats, getVans } from "../controller/bookingController.js";

const Bookingrouter = express.Router();

// Matches: ${API_HOST}/Vanaddinfo
Bookingrouter.get("/Vanaddinfo",getVans);

// Matches: ${API_HOST}/booking/check-seats
Bookingrouter.get("/booking/check-seats",getBookedSeats);

// Matches: ${API_HOST}/booking
Bookingrouter.post("/booking",createBooking);

export default Bookingrouter;