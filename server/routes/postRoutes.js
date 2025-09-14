import { Router } from "express";
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { upload } from "../config/cloudinary.js";

const postRoutes = Router();

postRoutes.post("/", upload.array("images", 5), createPost);
postRoutes.get("/", getAllPosts);
postRoutes.get("/:id", getPostById);
postRoutes.put("/:id", upload.array("images", 5), updatePost);
postRoutes.delete("/:id", deletePost);

export default postRoutes;
