const User = require("../models/User");

const getAllUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const users = await User.find()
      .select("-password")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalUsers = await User.countDocuments();

    res.status(200).json({
      page,
      limit,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      users,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

const userStatusController = async (req, res) => {
  try {
    const { id, action } = req.params;

    // Validate allowed actions
    if (!["activate", "deactivate"].includes(action)) {
      return res.status(400).json({
        message: "Only activate or deactivate actions are allowed",
      });
    }

    // Decide status
    const status = action === "activate" ? "action" : "inactive";

    // Update user
    const user = await User.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: `User ${status} successfully`,
      user,
    });
  } catch (err) {
    res.status(500).json({
      message: "Server error",
      error: err.message,
    });
  }
};

module.exports = { getAllUsers, userStatusController };
