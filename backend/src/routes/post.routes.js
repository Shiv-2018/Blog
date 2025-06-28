// routes/post.routes.js
import { Router } from "express";
import {
  createPost,
  getPostById,
  toggleLikePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getPublicPosts,
} from "../controllers/post.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/all").get(verifyJWT, getAllPosts); // GET /api/v1/posts/all

router.route("/public").get(getPublicPosts);
router.route("/:id").get(getPostById); // GET /api/v1/posts/:id

router.route("/").post(verifyJWT, createPost); // POST /api/v1/posts
router.route("/:id").delete(verifyJWT, deletePost); // DELETE /api/v1/posts/:id
router.route("/:id/like").post(toggleLikePost); // POST /api/v1/posts/:id/like

// User-specific routes
router.route("/user/:userId").get(verifyJWT, getUserPosts); // GET /api/v1/posts/user/:userId

export default router;

// Make sure in your main app.js you have:
// app.use("/api/v1/posts", postRoutes);
