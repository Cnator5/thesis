// src/config/connectDB.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is missing in your .env file");
}

const options = {
  autoIndex: process.env.NODE_ENV !== "production",
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
};

async function connectDB() {
  try {
    await mongoose.connect(uri, options);
    console.log("✅ MongoDB connected");

    mongoose.connection.on("error", (err) => console.error("MongoDB error:", err));
    mongoose.connection.on("disconnected", () => console.warn("MongoDB disconnected"));
    mongoose.connection.on("reconnected", () => console.log("MongoDB reconnected"));
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err);
    process.exit(1);
  }
}

export default connectDB;