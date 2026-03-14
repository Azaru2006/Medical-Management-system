const bcrypt = require("bcryptjs");
const jwt    = require("jsonwebtoken");
const User   = require("../models/User");
const Doctor = require("../models/Doctor");

const generateToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, password, role, specialization, phone } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    const salt    = await bcrypt.genSalt(10);
    const hashed  = await bcrypt.hash(password, salt);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: role || "doctor",
      specialization: specialization || ""
    });

    // ── AUTO-CREATE Doctor record when role is doctor ─────────────────────
    if (user.role === "doctor") {
      await Doctor.create({
        name:           user.name,
        specialization: user.specialization || specialization || "General",
        phone:          phone || "",
        email:          user.email,
        userId:         user._id
      });
    }

    res.status(201).json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      specialization: user.specialization,
      token:          generateToken(user)
    });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: err.message });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ message: "Invalid credentials" });

    res.json({
      _id:            user._id,
      name:           user.name,
      email:          user.email,
      role:           user.role,
      specialization: user.specialization,
      token:          generateToken(user)
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET ALL USERS (admin only)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE USER (admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};