import express from "express";
import {
  getComments,
  addComment,
  deleteComment,
  toggleCommentLike,
} from "../controllers/commentController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:postId", getComments);
router.post("/:postId", protect, addComment);
router.delete("/:id", protect, deleteComment);
router.put("/:id/like", protect, toggleCommentLike);

export default router;
