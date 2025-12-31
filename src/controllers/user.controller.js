const User = require("../models/User");
const bcrypt = require("bcrypt");

const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      message: "Profile fetched successfully",
      user: req.user,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

const updateProfile = async (req, res) => {
  try {
    const allowedFields = ["fullName", "emailId"];
    const requestFields = Object.keys(req.body || {});

    const invalidFields = requestFields.filter(
      (field) => !allowedFields.includes(field)
    );

    if (invalidFields.length > 0) {
      return res.status(400).json({
        message: `You are not allowed to update: ${invalidFields.join(", ")}`,
      });
    }

    const { fullName, emailId } = req.body || {};

    if (!fullName && !emailId) {
      return res.status(400).json({
        message: "At least one field (fullName or emailId) is required",
      });
    }

    if (fullName !== undefined) {
      if (fullName.trim() === "") {
        return res.status(400).json({
          message: "Full name cannot be empty",
        });
      }
      req.user.fullName = fullName.trim();
    }

    if (emailId !== undefined) {
      const emailRegex = /^\S+@\S+\.\S+$/;

      if (!emailRegex.test(emailId)) {
        return res.status(400).json({
          message: "Invalid eamil format",
        });
      }

      const existingUser = await User.findOne({
        emailId,
        _id: { $ne: req.user._id },
      });

      if (existingUser) {
        return res.status(409).json({
          message: "Email is already in use",
        });
      }
      req.user.emailId = emailId.toLowerCase();
    }

    await req.user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: req.user._id,
        fullName: req.user.fullName,
        emailId: req.user.emailId,
        role: req.user.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body || {};

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message:
          "currentPassword, newPassword, and confirmPassword are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

    if (!passwordRegex.test(newPassword)) {
      return res.status(400).json({
        message:
          "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character",
      });
    }
    const user = await User.findById(req.user._id);

    if (!user || !user.password) {
      return res.status(401).json({
        message: "User authentication error",
      });
    }
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        message: "Current password is incorrect",
      });
    }
    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password must be different from current password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    req.user.password = hashedPassword;
    await req.user.save();

    res.clearCookie("token");

    res.status(200).json({
      message: "Password changed Successfully. Please loigin again!",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { getProfile, updateProfile, changePassword };
