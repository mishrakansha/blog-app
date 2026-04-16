import express from "express";
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
  toggleLike,
  getMyPosts,
  getTrendingPosts,
} from "../controllers/postController.js";
import { protect, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", optionalAuth, getAllPosts);
router.get("/trending", getTrendingPosts);
router.get("/my-posts", protect, getMyPosts);
router.get("/:slug", optionalAuth, getPostBySlug);

router.post("/", protect, createPost);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);
router.put("/:id/like", protect, toggleLike);

export default router;
