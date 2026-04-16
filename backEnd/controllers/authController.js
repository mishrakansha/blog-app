import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Helper: Generate Token ───────────────────────────────────────────────
const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

// ─── @desc    Register User
// ─── @route   POST /api/auth/register
// ─── @access  Public
export const register = async (req, res) => {
  const { name, username, email, password } = req.body;

  const user = await User.create({ name, username, email, password });

  res.status(201).json({
    success: true,
    message: "Account created successfully!",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
};

// ─── @desc    Login User
// ─── @route   POST /api/auth/login
// ─── @access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Please provide email and password" });
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  res.json({
    success: true,
    message: "Login successful!",
    token: generateToken(user._id),
    user: {
      _id: user._id,
      name: user.name,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
    },
  });
};

// ─── @desc    Get Logged In User
// ─── @route   GET /api/auth/me
// ─── @access  Private
export const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).populate("postCount");
  res.json({ success: true, user });
};

// ─── @desc    Update Password
// ─── @route   PUT /api/auth/update-password
// ─── @access  Private
export const updatePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    return res.status(400).json({ success: false, message: "Current password is incorrect" });
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: "Password updated successfully" });
};
