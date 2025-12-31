const express = require("express");
const authMiddleware = require("../middlewares/auth.middleware");
const adminMiddleware = require("../middlewares/admin.middleware");

const {
  getAllUsers,
  userStatusController,
} = require("../controllers/admin.controller");

const router = express.Router();

router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.patch(
  "/users/:id/:action",
  authMiddleware,
  adminMiddleware,
  userStatusController
);

module.exports = router;
