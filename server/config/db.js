import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Database Connected"),
        console.log("Registered models:", mongoose.modelNames());
    });
    await mongoose.connect(`${process.env.MONGODB_URI}/finditback`);
  } catch (error) {
    console.error("Database connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;
