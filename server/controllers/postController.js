// NOTE
// Cloudinary connection Done and now working fine

import Post from "../models/post.js";
import { uploadToCloudinary, cloudinary } from "../config/cloudinary.js";

// Validation helper functions
const validatePostData = (data) => {
  const errors = [];

  if (!data.title || data.title.trim() === "") {
    errors.push("Title is required");
  } else if (data.title.trim().length < 3) {
    errors.push("Title must be at least 3 characters long");
  } else if (data.title.trim().length > 100) {
    errors.push("Title must not exceed 100 characters");
  }

  if (!data.description || data.description.trim() === "") {
    errors.push("Description is required");
  } else if (data.description.trim().length < 10) {
    errors.push("Description must be at least 10 characters long");
  } else if (data.description.trim().length > 1000) {
    errors.push("Description must not exceed 1000 characters");
  }

  if (!data.category || data.category.trim() === "") {
    errors.push("Category is required");
  } else {
    const validCategories = [
      "electronics",
      "clothing",
      "accessories",
      "documents",
      "keys",
      "bags",
      "books",
      "pets",
      "other",
    ];
    if (!validCategories.includes(data.category.toLowerCase())) {
      errors.push("Invalid category selected");
    }
  }

  if (!data.type || data.type.trim() === "") {
    errors.push("Type is required");
  } else {
    const validTypes = ["lost", "found"];
    if (!validTypes.includes(data.type.toLowerCase())) {
      errors.push('Type must be either "lost" or "found"');
    }
  }

  if (!data.createdBy) {
    errors.push("User authentication required");
  }

  return errors;
};

const validateImageLimit = (imageCount, existingCount = 0) => {
  const totalCount = imageCount + existingCount;
  if (totalCount > 5) {
    if (existingCount > 0) {
      return `Maximum 5 images allowed. You have ${existingCount} existing images.`;
    }
    return "Maximum 5 images allowed";
  }
  return null;
};

const deletePostImages = async (images) => {
  if (!images || images.length === 0) return;

  try {
    const deletePromises = images.map((imageUrl) => {
      const urlParts = imageUrl.split("/");
      const filename = urlParts[urlParts.length - 1];
      const publicId = `finditback-posts/${filename.split(".")[0]}`;

      console.log("Deleting image:", publicId);
      return cloudinary.uploader.destroy(publicId);
    });

    await Promise.all(deletePromises);
    console.log("Post images deleted from Cloudinary");
  } catch (error) {
    console.error("Error deleting post images:", error);
  }
};

// Create a new post
export const createPost = async (req, res) => {
  try {
    console.log("Files received:", req.files);
    console.log("Body data:", req.body);

    // Upload images to Cloudinary
    const imageUrls = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        console.log("Image uploaded:", result.secure_url);
        imageUrls.push(result.secure_url);
      }
    }

    // Prepare post data
    const postData = {
      title: req.body.title?.trim(),
      description: req.body.description?.trim(),
      category: req.body.category?.toLowerCase(),
      type: req.body.type?.toLowerCase(),
      createdBy: req.body.createdBy,
      images: imageUrls,
    };

    console.log("Post data prepared:", postData);

    // Validate post data
    const validationErrors = validatePostData(postData);
    if (validationErrors.length > 0) {
      console.log("Validation failed, cleaning up images...");
      await deletePostImages(imageUrls);

      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    // Check image limit
    const imageLimitError = validateImageLimit(imageUrls.length);
    if (imageLimitError) {
      console.log("Image limit exceeded, cleaning up...");
      await deletePostImages(imageUrls);

      return res.status(400).json({
        error: "Validation failed",
        details: [imageLimitError],
      });
    }

    // Create and save post
    const post = new Post(postData);
    await post.save();

    // Populate user details for response
    await post.populate("createdBy", "name email");

    console.log("Post created successfully:", post.postId);

    res.status(201).json({
      success: true,
      message: "Post created successfully",
      data: post,
    });
  } catch (err) {
    console.error("Error creating post:", err);

    // Cleanup uploaded images on error
    if (req.files && req.files.length > 0) {
      const uploadedUrls = req.files.map((file) => file.secure_url);
      await deletePostImages(uploadedUrls);
    }

    // Handle mongoose validation errors
    if (err.name === "ValidationError") {
      const validationErrors = Object.values(err.errors).map(
        (error) => error.message
      );
      return res.status(400).json({
        error: "Validation failed",
        details: validationErrors,
      });
    }

    res.status(500).json({
      error: "Internal server error",
      message: err.message,
    });
  }
};

export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    console.log(`Retrieved ${posts.length} posts`);

    res.status(200).json({
      success: true,
      count: posts.length,
      data: posts,
    });
  } catch (err) {
    console.error("Error fetching posts:", err);
    res.status(500).json({ error: err.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findOne({ postId: req.params.id }).populate(
      "createdBy",
      "name email"
    );

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    console.log(`Retrieved post: ${post.postId}`);

    res.status(200).json({
      success: true,
      data: post,
    });
  } catch (err) {
    console.error("Error fetching post:", err);
    res.status(500).json({ error: err.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    console.log("Updating post:", req.params.id);
    console.log("New files:", req.files);
    console.log("Update data:", req.body);

    // Get existing post
    const existingPost = await Post.findOne({ postId: req.params.id });
    if (!existingPost) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Prepare update data
    const updateData = { ...req.body };
    delete updateData.createdBy; // Prevent updating creator
    delete updateData.postId; // Prevent updating postId

    // Handle new image uploads
    if (req.files && req.files.length > 0) {
      console.log("Processing new images...");

      const newImageUrls = [];
      for (const file of req.files) {
        const result = await uploadToCloudinary(file.buffer);
        newImageUrls.push(result.secure_url);
      }

      const existingImages = existingPost.images || [];

      // Check combined image limit
      const imageLimitError = validateImageLimit(
        newImageUrls.length,
        existingImages.length
      );
      if (imageLimitError) {
        console.log("Image limit exceeded, cleaning up new uploads...");
        await deletePostImages(newImageUrls);

        return res.status(400).json({
          error: "Validation failed",
          details: [imageLimitError],
        });
      }

      // Combine existing images with new ones
      updateData.images = [...existingImages, ...newImageUrls];
      console.log(
        `Images updated: ${existingImages.length} existing + ${newImageUrls.length} new = ${updateData.images.length} total`
      );
    }

    // Clean text fields
    if (updateData.title && updateData.title.trim() !== "") {
      updateData.title = updateData.title.trim();
    }
    if (updateData.description && updateData.description.trim() !== "") {
      updateData.description = updateData.description.trim();
    }
    if (updateData.category) {
      updateData.category = updateData.category.toLowerCase();
    }
    if (updateData.type) {
      updateData.type = updateData.type.toLowerCase();
    }

    // Update post
    const post = await Post.findOneAndUpdate(
      { postId: req.params.id },
      updateData,
      { new: true, runValidators: true }
    ).populate("createdBy", "name email");

    console.log("Post updated successfully:", post.postId);

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  } catch (err) {
    console.error("Error updating post:", err);

    res.status(500).json({ error: err.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    console.log("Deleting post:", req.params.id);

    const post = await Post.findOne({ postId: req.params.id });

    if (!post) {
      return res.status(404).json({
        success: false,
        message: "Post not found",
      });
    }

    // Delete images from Cloudinary
    if (post.images && post.images.length > 0) {
      console.log(`Deleting ${post.images.length} images from Cloudinary...`);
      await deletePostImages(post.images);
    }

    // Delete post from database
    await Post.findOneAndDelete({ postId: req.params.id });

    console.log("Post deleted successfully:", req.params.id);

    res.status(200).json({
      success: true,
      message: "Post and associated images deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting post:", err);
    res.status(500).json({ error: err.message });
  }
};
