import mongoose from "mongoose";

let isConnected = false; // Track the connection status

const connectDB = async () => {
  if (isConnected) {
    console.log("MongoDB is already connected");
    return;
  }

  try {
    const uri = process.env.MONGODB_URI as string;

    if (!uri) {
      throw new Error("Please define the MONGO_URI environment variable");
    }
    await mongoose.connect(uri);

    const connection = mongoose.connection;
    connection.once("connected", () => {
      isConnected = true; // Set the flag after successful connection

      console.log("MongoDB connected successfully");
    });
    connection.on("error", (err) => {
      console.error("MongoDB connection error:", err);
      process.exit(1);
    });
  } catch (error) {
    console.error("Login error:", error);

    console.error("MongoDB connection error:", error);
  }
};

export default connectDB;
