const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email?.trim() || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const admin = await Admin.findOne({
      email: normalizedEmail,
    });

    if (!admin) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const isValid = await admin.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id.toString(),
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      token,
      admin: {
        id: admin._id,
        email: admin.email,
        name: admin.name,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};

exports.verify = async (req, res) => {
  try {
    const admin = await Admin.findById(req.adminId).select("-password");

    if (!admin) {
      return res.status(401).json({
        message: "Admin not found",
      });
    }

    return res.json({
      admin,
    });
  } catch (error) {
    console.error("Verify error:", error);

    return res.status(500).json({
      message: "Server error",
    });
  }
};