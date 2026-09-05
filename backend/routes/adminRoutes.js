const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

const router = express.Router();

const JWT_SECRET =
  process.env.JWT_SECRET || "book2watch_secret";


// =====================================================
// ADMIN AUTH MIDDLEWARE
// =====================================================

const verifyAdminToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Admin authentication required",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "admin") {
      return res.status(403).json({
        message: "Admin access denied",
      });
    }

    req.admin = decoded;

    next();

  } catch (error) {
    console.error("Admin token error:", error);

    return res.status(401).json({
      message: "Invalid or expired admin token",
    });
  }
};


// =====================================================
// ADMIN LOGIN
// =====================================================

router.post("/login", async (req, res) => {
  try {

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const admin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      admin.password
    );

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid admin email or password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        email: admin.email,
        role: "admin",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      message: "Admin login successful",

      token: token,

      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "admin",
      },
    });

  } catch (error) {

    console.error("Admin login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// CREATE ADMIN
// =====================================================

router.post("/create", async (req, res) => {
  try {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const existingAdmin = await Admin.findOne({
      email: email.toLowerCase(),
    });

    if (existingAdmin) {
      return res.status(400).json({
        message: "Admin already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    const admin = new Admin({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({
      message: "Admin created successfully",
    });

  } catch (error) {

    console.error("Create admin error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});


// =====================================================
// CHANGE ADMIN PASSWORD
// =====================================================

router.put(
  "/change-password",
  verifyAdminToken,
  async (req, res) => {

    try {

      const {
        currentPassword,
        newPassword,
        confirmPassword,
      } = req.body;


      // Check fields
      if (
        !currentPassword ||
        !newPassword ||
        !confirmPassword
      ) {
        return res.status(400).json({
          message: "All password fields are required",
        });
      }


      // Check new password length
      if (newPassword.length < 6) {
        return res.status(400).json({
          message:
            "New password must be at least 6 characters",
        });
      }


      // Check confirm password
      if (newPassword !== confirmPassword) {
        return res.status(400).json({
          message:
            "New password and confirm password do not match",
        });
      }


      // Find logged-in admin
      const admin = await Admin.findById(
        req.admin.id
      );

      if (!admin) {
        return res.status(404).json({
          message: "Admin account not found",
        });
      }


      // Check current password
      const isCurrentPasswordCorrect =
        await bcrypt.compare(
          currentPassword,
          admin.password
        );

      if (!isCurrentPasswordCorrect) {
        return res.status(401).json({
          message: "Current password is incorrect",
        });
      }


      // Don't allow same password
      const isSamePassword =
        await bcrypt.compare(
          newPassword,
          admin.password
        );

      if (isSamePassword) {
        return res.status(400).json({
          message:
            "New password must be different from current password",
        });
      }


      // Hash new password
      const hashedPassword =
        await bcrypt.hash(newPassword, 10);


      // Update password
      admin.password = hashedPassword;

      await admin.save();


      res.status(200).json({
        message:
          "Password changed successfully",
      });

    } catch (error) {

      console.error(
        "Change password error:",
        error
      );

      res.status(500).json({
        message: "Server error",
      });
    }
  }
);


module.exports = router;