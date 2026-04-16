import jwt from "jsonwebtoken";
import User from "../models/User.js";

// ─── Protect: Verify JWT Token ────────────────────────────────────────────
export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("-password");

    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not found." });
    }

    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid or expired token." });
  }
};

// ─── Admin Only ───────────────────────────────────────────────────────────
// export const adminOnly = (req, res, next) => {
//   if (req.user?.role !== "admin") {
//     return res.status(403).json({ success: false, message: "Access denied. Admins only." });
//   }
//   next();
// };

// ─── Optional Auth (public routes that benefit from auth) ─────────────────
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
    } catch (_) {
      req.user = null;
    }
  }
  next();
};
