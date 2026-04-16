import express from "express";
import {
  getUserProfile,
  updateProfile,
  toggleFollow,
  toggleSavePost,
  getSavedPosts,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/saved-posts", protect, getSavedPosts);
router.get("/:username", getUserProfile);
router.put("/profile", protect, updateProfile);
router.put("/:id/follow", protect, toggleFollow);
router.put("/save/:postId", protect, toggleSavePost);

export default router;
