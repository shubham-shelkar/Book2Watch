const express = require("express");
const router = express.Router();

const Cinema = require("../models/Cinema");

// ===============================
// GET ALL CINEMAS
// ===============================
router.get("/", async (req, res) => {
  try {
    const cinemas = await Cinema.find().sort({ createdAt: -1 });

    res.status(200).json({
      cinemas: cinemas,
    });
  } catch (error) {
    console.error("GET CINEMAS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch cinemas",
      error: error.message,
    });
  }
});

// ===============================
// GET SINGLE CINEMA
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const cinema = await Cinema.findById(req.params.id);

    if (!cinema) {
      return res.status(404).json({
        message: "Cinema not found",
      });
    }

    res.status(200).json(cinema);
  } catch (error) {
    console.error("GET SINGLE CINEMA ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch cinema",
      error: error.message,
    });
  }
});

// ===============================
// ADD CINEMA
// ===============================
router.post("/", async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      city,
      screens,
      contact,
      image,
      description,
      status,
    } = req.body;

    if (
      !name ||
      !location ||
      !address ||
      !city ||
      !screens ||
      !contact
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const cinema = new Cinema({
      name: name,
      location: location,
      address: address,
      city: city,
      screens: Number(screens),
      contact: contact,
      image: image || "",
      description: description || "",
      status: status || "Active",
    });

    const savedCinema = await cinema.save();

    res.status(201).json({
      message: "Cinema added successfully",
      cinema: savedCinema,
    });
  } catch (error) {
    console.error("ADD CINEMA ERROR:", error);

    res.status(500).json({
      message: "Failed to add cinema",
      error: error.message,
    });
  }
});

// ===============================
// UPDATE CINEMA
// ===============================
router.put("/:id", async (req, res) => {
  try {
    const {
      name,
      location,
      address,
      city,
      screens,
      contact,
      image,
      description,
      status,
    } = req.body;

    const updatedCinema = await Cinema.findByIdAndUpdate(
      req.params.id,
      {
        name: name,
        location: location,
        address: address,
        city: city,
        screens: Number(screens),
        contact: contact,
        image: image || "",
        description: description || "",
        status: status || "Active",
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedCinema) {
      return res.status(404).json({
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      message: "Cinema updated successfully",
      cinema: updatedCinema,
    });
  } catch (error) {
    console.error("UPDATE CINEMA ERROR:", error);

    res.status(500).json({
      message: "Failed to update cinema",
      error: error.message,
    });
  }
});

// ===============================
// DELETE CINEMA
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const deletedCinema = await Cinema.findByIdAndDelete(
      req.params.id
    );

    if (!deletedCinema) {
      return res.status(404).json({
        message: "Cinema not found",
      });
    }

    res.status(200).json({
      message: "Cinema deleted successfully",
    });
  } catch (error) {
    console.error("DELETE CINEMA ERROR:", error);

    res.status(500).json({
      message: "Failed to delete cinema",
      error: error.message,
    });
  }
});

module.exports = router;