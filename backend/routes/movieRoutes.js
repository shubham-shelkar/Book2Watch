const express = require("express");
const Movie = require("../models/Movie");

const router = express.Router();


// ================= GET ALL MOVIES =================

router.get("/", async (req, res) => {
  try {
    const movies = await Movie.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      movies,
    });

  } catch (error) {
    console.error("Get movies error:", error);

    res.status(500).json({
      message: "Failed to fetch movies",
    });
  }
});


// ================= GET SINGLE MOVIE =================

router.get("/:id", async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      movie,
    });

  } catch (error) {
    console.error("Get movie error:", error);

    res.status(500).json({
      message: "Failed to fetch movie",
    });
  }
});


// ================= ADD MOVIE =================

router.post("/", async (req, res) => {
  try {
    const {
      title,
      genre,
      duration,
      rating,
      language,
      image,
      description,
    } = req.body;

    if (
      !title ||
      !genre ||
      !duration ||
      !rating ||
      !language ||
      !image
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const movie = new Movie({
      title,
      genre,
      duration,
      rating,
      language,
      image,
      description,
    });

    await movie.save();

    res.status(201).json({
      message: "Movie added successfully",
      movie,
    });

  } catch (error) {
    console.error("Add movie error:", error);

    res.status(500).json({
      message: "Failed to add movie",
    });
  }
});


// ================= UPDATE MOVIE =================

router.put("/:id", async (req, res) => {
  try {
    const {
      title,
      genre,
      duration,
      rating,
      language,
      image,
      description,
    } = req.body;

    const movie = await Movie.findByIdAndUpdate(
      req.params.id,
      {
        title,
        genre,
        duration,
        rating,
        language,
        image,
        description,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      message: "Movie updated successfully",
      movie,
    });

  } catch (error) {
    console.error("Update movie error:", error);

    res.status(500).json({
      message: "Failed to update movie",
    });
  }
});


// ================= DELETE MOVIE =================

router.delete("/:id", async (req, res) => {
  try {
    const movie = await Movie.findByIdAndDelete(
      req.params.id
    );

    if (!movie) {
      return res.status(404).json({
        message: "Movie not found",
      });
    }

    res.status(200).json({
      message: "Movie deleted successfully",
    });

  } catch (error) {
    console.error("Delete movie error:", error);

    res.status(500).json({
      message: "Failed to delete movie",
    });
  }
});


module.exports = router;