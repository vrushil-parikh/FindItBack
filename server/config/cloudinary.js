import { v2 as cloudinary } from "cloudinary";
import multer from "multer";

const connectCloudinary = () => {
  cloudinary.url(process.env.CLOUDINARY_URL, { secure: true });
};

// Store file in memory (not on disk)
const upload = multer({ storage: multer.memoryStorage() });

const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: "finditback-posts",
        transformation: [
          { width: 800, height: 600, crop: "limit" },
          { quality: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

export { connectCloudinary, upload, uploadToCloudinary, cloudinary };
