const express    = require("express");
const router     = express.Router();
const {
  register,
  login,
  getProfile,
  getUsers,
  deleteUser
} = require("../controllers/authController");
const { protect, allowRoles } = require("../middleware/authMiddleware");

// Public routes
router.post("/register", register);
router.post("/login",    login);

// Protected routes
router.get("/profile",        protect, getProfile);
router.get("/users",          protect, allowRoles("admin"), getUsers);
router.delete("/users/:id",   protect, allowRoles("admin"), deleteUser);

module.exports = router;