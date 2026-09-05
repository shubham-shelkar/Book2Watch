const express = require("express");
const router = express.Router();

const Show = require("../models/Show");

// ==========================================
// GET ALL SHOWS
// ==========================================

router.get("/", async (req, res) => {
  try {
    const shows = await Show.find()
      .populate("movie", "title image")
      .populate("cinema", "name location city")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      shows: shows,
    });
  } catch (error) {
    console.error("GET SHOWS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch shows",
      error: error.message,
    });
  }
});

// ==========================================
// GET SINGLE SHOW
// ==========================================

router.get("/:id", async (req, res) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate("movie", "title image")
      .populate("cinema", "name location city");

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.status(200).json(show);
  } catch (error) {
    console.error("GET SINGLE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch show",
      error: error.message,
    });
  }
});

// ==========================================
// ADD SHOW
// ==========================================

router.post("/", async (req, res) => {
  try {
    const {
      movie,
      cinema,
      date,
      startTime,
      ticketPrice,
      totalSeats,
      status,
    } = req.body;

    // ==========================================
    // REQUIRED FIELDS
    // ==========================================

    if (
      !movie ||
      !cinema ||
      !date ||
      !startTime ||
      ticketPrice === undefined ||
      !totalSeats
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    // ==========================================
    // CREATE SHOW
    // ==========================================

    const show = new Show({
      movie,
      cinema,
      date,
      startTime,
      ticketPrice: Number(ticketPrice),
      totalSeats: Number(totalSeats),

      // Initially all seats are available
      availableSeats: Number(totalSeats),

      // Initially no seats are booked
      bookedSeats: [],

      status: status || "Active",
    });

    const savedShow = await show.save();

    // ==========================================
    // POPULATE MOVIE + CINEMA
    // ==========================================

    const populatedShow = await Show.findById(savedShow._id)
      .populate("movie", "title image")
      .populate("cinema", "name location city");

    res.status(201).json({
      message: "Show added successfully",
      show: populatedShow,
    });
  } catch (error) {
    console.error("ADD SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to add show",
      error: error.message,
    });
  }
});

// ==========================================
// UPDATE SHOW
// ==========================================

router.put("/:id", async (req, res) => {
  try {
    const {
      movie,
      cinema,
      date,
      startTime,
      ticketPrice,
      totalSeats,
      availableSeats,
      status,
    } = req.body;

    // ==========================================
    // GET EXISTING SHOW
    // ==========================================

    const existingShow = await Show.findById(req.params.id);

    if (!existingShow) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    // ==========================================
    // KEEP EXISTING BOOKED SEATS
    // ==========================================

    const bookedSeats = existingShow.bookedSeats || [];

    // ==========================================
    // UPDATE DATA
    // ==========================================

    const updateData = {
      movie,
      cinema,
      date,
      startTime,
      ticketPrice: Number(ticketPrice),
      totalSeats: Number(totalSeats),
      status: status || "Active",

      // IMPORTANT:
      // Existing booked seats should NOT be deleted
      bookedSeats: bookedSeats,
    };

    // ==========================================
    // AVAILABLE SEATS
    // ==========================================

    if (availableSeats !== undefined) {
      updateData.availableSeats = Number(availableSeats);
    } else {
      updateData.availableSeats =
        Number(totalSeats) - bookedSeats.length;
    }

    // Make sure available seats never become negative
    if (updateData.availableSeats < 0) {
      updateData.availableSeats = 0;
    }

    // ==========================================
    // UPDATE SHOW
    // ==========================================

    const updatedShow = await Show.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("movie", "title image")
      .populate("cinema", "name location city");

    res.status(200).json({
      message: "Show updated successfully",
      show: updatedShow,
    });
  } catch (error) {
    console.error("UPDATE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to update show",
      error: error.message,
    });
  }
});

// ==========================================
// BOOK SEATS
// ==========================================
// Ye endpoint Payment ke time use hoga.
//
// Example:
// POST /api/shows/SHOW_ID/book-seats
//
// Body:
// {
//   "seats": ["D9", "D10"]
// }
// ==========================================

router.post("/:id/book-seats", async (req, res) => {
  try {
    const { seats } = req.body;

    // ==========================================
    // VALIDATE SEATS
    // ==========================================

    if (!Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        message: "Please select at least one seat.",
      });
    }

    // Remove duplicate seats
    const uniqueSeats = [...new Set(seats)];

    // ==========================================
    // FIND SHOW
    // ==========================================

    const show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    // ==========================================
    // CHECK ALREADY BOOKED SEATS
    // ==========================================

    const alreadyBooked = uniqueSeats.filter((seat) =>
      show.bookedSeats.includes(seat)
    );

    if (alreadyBooked.length > 0) {
      return res.status(409).json({
        message: "Some seats are already booked.",
        bookedSeats: alreadyBooked,
      });
    }

    // ==========================================
    // CHECK AVAILABLE SEATS
    // ==========================================

    if (uniqueSeats.length > show.availableSeats) {
      return res.status(400).json({
        message: "Not enough seats available.",
      });
    }

    // ==========================================
    // ADD SEATS TO BOOKED SEATS
    // ==========================================

    show.bookedSeats.push(...uniqueSeats);

    // ==========================================
    // UPDATE AVAILABLE SEATS
    // ==========================================

    show.availableSeats =
      show.totalSeats - show.bookedSeats.length;

    if (show.availableSeats < 0) {
      show.availableSeats = 0;
    }

    await show.save();

    // ==========================================
    // RESPONSE
    // ==========================================

    const updatedShow = await Show.findById(show._id)
      .populate("movie", "title image")
      .populate("cinema", "name location city");

    res.status(200).json({
      message: "Seats booked successfully",
      show: updatedShow,
      bookedSeats: updatedShow.bookedSeats,
      availableSeats: updatedShow.availableSeats,
    });
  } catch (error) {
    console.error("BOOK SEATS ERROR:", error);

    res.status(500).json({
      message: "Failed to book seats",
      error: error.message,
    });
  }
});

// ==========================================
// DELETE SHOW
// ==========================================

router.delete("/:id", async (req, res) => {
  try {
    const deletedShow = await Show.findByIdAndDelete(req.params.id);

    if (!deletedShow) {
      return res.status(404).json({
        message: "Show not found",
      });
    }

    res.status(200).json({
      message: "Show deleted successfully",
    });
  } catch (error) {
    console.error("DELETE SHOW ERROR:", error);

    res.status(500).json({
      message: "Failed to delete show",
      error: error.message,
    });
  }
});

module.exports = router;