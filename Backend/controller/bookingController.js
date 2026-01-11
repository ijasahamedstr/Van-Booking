

// ============================================================================
// 1. REAL-TIME AVAILABILITY CHECK (GET VANS)

import BookingModel from "../models/Booking.model.js";
import VanaddModels from "../models/Vanadd.models.js";

// ============================================================================
export const getVans = async (req, res) => {
  try {
    const { date } = req.query;

    // A. Fetch all vans from the system
    const allVans = await VanaddModels.find();

    // B. If no date is selected, assume all vans are fully available
    if (!date) {
      const initialVans = allVans.map(van => ({
        ...van.toObject(),
        bookingStatus: "AVAILABLE",
        seatsTaken: 0
      }));
      return res.status(200).json(initialVans);
    }

    // C. REAL-TIME CHECK: Find bookings specifically for the selected date
    const bookingsOnDate = await BookingModel.find({ bookingDate: date });

    // D. Process each van to determine its status
    const vansWithStatus = allVans.map((van) => {
      // Filter bookings for THIS specific van
      const vanBookings = bookingsOnDate.filter((b) => b.van === van.vanname);

      // Count total occupied seats
      let takenSeatsCount = 0;
      vanBookings.forEach((b) => {
        if (b.seatNumbers && b.seatNumbers.length > 0) {
          // It was a full booking or multi-seat booking
          takenSeatsCount += b.seatNumbers.length;
        } else if (b.seatNumber) {
          // It was a single seat booking
          takenSeatsCount += 1;
        }
      });

      // Get Capacity (Default to 14 if not specified)
      const totalCapacity = parseInt(van.seatType) || 14;

      // E. DETERMINE STATUS
      let status = "AVAILABLE";
      
      if (takenSeatsCount >= totalCapacity) {
        status = "FULL";    // 100% Booked
      } else if (takenSeatsCount > 0) {
        status = "PARTIAL"; // Partially Booked
      }

      return {
        ...van.toObject(),
        bookingStatus: status, // Frontend uses this to Hide/Show
        seatsTaken: takenSeatsCount
      };
    });

    // F. Return the calculated list
    res.status(200).json(vansWithStatus);

  } catch (error) {
    console.error("❌ Error fetching vans:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ============================================================================
// 2. CREATE NEW BOOKING
// ============================================================================
export const createBooking = async (req, res) => {
  try {
    console.log("📥 New Booking Request:", req.body);

    const {
      customerName, mobileNumber, bookingDate, bookingCategory,
      van, seatNumber, country, arrivalTime, arrivalMode, seatNumbers,
    } = req.body;

    // Handle Ticket File Upload
    let ticketFilePath = null;
    if (req.file) {
      ticketFilePath = req.file.path;
    }

    // Parse Seat Array (Safe JSON Parse)
    let parsedSeatNumbers = [];
    if (seatNumbers) {
      try {
        parsedSeatNumbers = JSON.parse(seatNumbers);
      } catch (e) {
        parsedSeatNumbers = [];
      }
    }

    // Create Database Object
    const newBooking = new BookingModel({
      customerName,
      mobileNumber,
      bookingDate,
      bookingCategory,
      van,
      seatNumber,
      seatNumbers: parsedSeatNumbers,
      country,
      arrivalTime,
      arrivalMode,
      ticketFile: ticketFilePath,
    });

    // Save to MongoDB
    await newBooking.save();

    console.log("✅ Booking Saved Successfully!");
    res.status(201).json({ message: "Booking successful!", booking: newBooking });

  } catch (error) {
    console.error("❌ Server Error:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ============================================================================
// 3. CHECK SEAT AVAILABILITY (FOR SEAT MAP)
// ============================================================================
export const getBookedSeats = async (req, res) => {
  try {
    const { vanname, date } = req.query;

    if (!vanname || !date) {
      return res.status(400).json({ message: "Van name and date required" });
    }

    // Find all bookings for this specific Van + Date
    const bookings = await BookingModel.find({ van: vanname, bookingDate: date });

    let bookedSeats = [];

    bookings.forEach((b) => {
      // Add single seat
      if (b.seatNumber) bookedSeats.push(b.seatNumber);
      // Add multiple seats (Full Booking)
      if (b.seatNumbers && b.seatNumbers.length > 0) {
        bookedSeats.push(...b.seatNumbers);
      }
    });

    // Remove duplicates
    const uniqueSeats = [...new Set(bookedSeats)];

    res.status(200).json({ bookedSeats: uniqueSeats });

  } catch (error) {
    console.error("❌ Error fetching seats:", error);
    res.status(500).json({ message: "Error fetching seats", error: error.message });
  }
};