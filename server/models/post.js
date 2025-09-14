import mongoose from "mongoose";
import mongooseSequence from "mongoose-sequence";
import User from "../models/user.js";
const AutoIncrement = mongooseSequence(mongoose);

const postSchema = new mongoose.Schema({
  postId: { type: Number },

  title: {
    type: String,
    required: [true, "Title is required"],
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [100, "Title must not exceed 100 characters"],
  },

  description: {
    type: String,
    required: [true, "Description is required"],
    trim: true,
    minlength: [10, "Description must be at least 10 characters long"],
    maxlength: [1000, "Description must not exceed 1000 characters"],
  },

  category: {
    type: String,
    required: [true, "Category is required"],
    enum: {
      values: [
        "electronics",
        "clothing",
        "accessories",
        "documents",
        "keys",
        "bags",
        "books",
        "pets",
        "other",
      ],
      message: "Invalid category selected",
    },
    lowercase: true,
  },

  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: User,
    required: [true, "User authentication required"],
  },

  images: [
    {
      type: String,
      validate: {
        validator: function (url) {
          if (!url) return true; // Allow empty strings
          const urlPattern =
            /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
          return urlPattern.test(url);
        },
        message: "Invalid image URL format",
      },
    },
  ],

  createdAt: { type: Date, default: Date.now },

  type: {
    type: String,
    enum: {
      values: ["lost", "found"],
      message: 'Type must be either "lost" or "found"',
    },
    required: [true, "Type is required"],
    lowercase: true,
  },

  status: {
    type: String,
    enum: {
      values: ["open", "closed", "resolved"],
      message: "Invalid status value",
    },
    default: "open",
    lowercase: true,
  },
});

// Validate images array length
postSchema.pre("save", function (next) {
  if (this.images && this.images.length > 5) {
    next(new Error("Maximum 5 images allowed"));
  } else {
    next();
  }
});

// Auto-increment postId starting from 1
postSchema.plugin(AutoIncrement, { inc_field: "postId" });

export default mongoose.model("Post", postSchema);
