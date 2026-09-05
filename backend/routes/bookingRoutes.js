const express = require("express");
const router = express.Router();

const Booking = require("../models/Booking");
const Show = require("../models/Show");

// ==============================
// CREATE BOOKING
// ==============================

router.post("/", async (req, res) => {
  try {
    const {
      movie,
      theatre,
      date,
      time,
      seats,
      totalAmount,
      userId,
      showId,
    } = req.body;

    if (
      !movie ||
      !theatre ||
      !date ||
      !time ||
      !Array.isArray(seats) ||
      seats.length === 0 ||
      totalAmount === undefined ||
      totalAmount === null
    ) {
      return res.status(400).json({
        message: "All booking details are required",
      });
    }

    const bookingId =
      "BK" + Date.now().toString().slice(-8);

    const newBooking = new Booking({
      bookingId,
      userId,
      showId,
      movie,
      theatre,
      date,
      time,
      seats,
      totalAmount,
      paymentStatus: "Paid",
      status: "Confirmed",
    });

    const savedBooking = await newBooking.save();

    res.status(201).json({
      message: "Booking created successfully",
      booking: savedBooking,
    });
  } catch (error) {
    console.error("Booking Error:", error);

    res.status(500).json({
      message: "Server error while creating booking",
    });
  }
});


// ==============================
// GET ALL BOOKINGS
// ==============================

router.get("/", async (req, res) => {
  try {
    const bookings = await Booking.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      bookings,
    });
  } catch (error) {
    console.error("Fetch Bookings Error:", error);

    res.status(500).json({
      message: "Failed to fetch bookings",
    });
  }
});


// ==============================
// GET SINGLE BOOKING
// ==============================

router.get("/:id", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      booking,
    });
  } catch (error) {
    console.error("Single Booking Error:", error);

    res.status(500).json({
      message: "Failed to fetch booking",
    });
  }
});


// ==============================
// CANCEL BOOKING
// ==============================

router.put("/:id/cancel", async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    // Already cancelled
    if (booking.status === "Cancelled") {
      return res.status(400).json({
        message: "Booking is already cancelled",
      });
    }

    // ==============================
    // FIND SHOW
    // ==============================

    let show = null;

    // First priority: showId
    if (booking.showId) {
      show = await Show.findById(booking.showId);
    }

    // Fallback for old bookings
    if (!show) {
      show = await Show.findOne({
        date: booking.date,
        startTime: booking.time,
      }).populate("movie cinema");
    }

    // ==============================
    // RELEASE SEATS
    // ==============================

    if (show) {
      const bookedSeats = Array.isArray(show.bookedSeats)
        ? show.bookedSeats
        : [];

      const seatsToRelease = Array.isArray(booking.seats)
        ? booking.seats
        : [];

      show.bookedSeats = bookedSeats.filter(
        (seat) => !seatsToRelease.includes(seat)
      );

      show.availableSeats =
        show.totalSeats - show.bookedSeats.length;

      await show.save();
    }

    // ==============================
    // UPDATE BOOKING
    // ==============================

    booking.status = "Cancelled";
    booking.paymentStatus = "Refunded";

    await booking.save();

    res.status(200).json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel Booking Error:", error);

    res.status(500).json({
      message: "Failed to cancel booking",
    });
  }
});


module.exports = router;