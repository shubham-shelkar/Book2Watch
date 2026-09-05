const express = require("express");
const User = require("../models/User");

const router = express.Router();


// ===============================
// GET ALL USERS
// ===============================
router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      users: users,
    });

  } catch (error) {
    console.error("Get users error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// GET SINGLE USER
// ===============================
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      user: user,
    });

  } catch (error) {
    console.error("Get single user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// CHANGE USER STATUS
// ===============================
router.put("/:id/status", async (req, res) => {
  try {
    const { status } = req.body;

    if (!["Active", "Inactive"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        status: status,
      },
      {
        new: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: `User ${status.toLowerCase()} successfully`,
      user: user,
    });

  } catch (error) {
    console.error("Change status error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// ===============================
// DELETE USER
// ===============================
router.delete("/:id", async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "User deleted successfully",
    });

  } catch (error) {
    console.error("Delete user error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


module.exports = router;