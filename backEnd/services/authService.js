import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Helper ───────────────────────────────────────────────────────────────
export const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });

const formatUser = (user) => ({
  _id: user._id,
  name: user.name,
  username: user.username,
  email: user.email,
  avatar: user.avatar,
  role: user.role,
});

// ─── Register ─────────────────────────────────────────────────────────────
export const registerUser = async ({ name, username, email, password }) => {
  const user = await User.create({ name, username, email, password });
  return { token: generateToken(user._id), user: formatUser(user) };
};

// ─── Login ────────────────────────────────────────────────────────────────
export const loginUser = async ({ email, password }) => {
  if (!email || !password) {
    const err = new Error("Please provide email and password");
    err.statusCode = 400;
    throw err;
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    const err = new Error("Invalid email or password");
    err.statusCode = 401;
    throw err;
  }

  return { token: generateToken(user._id), user: formatUser(user) };
};

// ─── Get Current User ─────────────────────────────────────────────────────
export const getCurrentUser = async (userId) => {
  const user = await User.findById(userId).populate("postCount");
  return user;
};

// ─── Update Password ──────────────────────────────────────────────────────
export const updateUserPassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select("+password");

  if (!(await user.comparePassword(currentPassword))) {
    const err = new Error("Current password is incorrect");
    err.statusCode = 400;
    throw err;
  }

  user.password = newPassword;
  await user.save();
};
