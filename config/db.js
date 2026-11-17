import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const getMongoUri = () => {
  const rawUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  if (!rawUri) return "";
  return rawUri.trim().replace(/^["']|["']$/g, "");
};

const connectDB = async () => {
  const uri = getMongoUri();
  if (!uri) {
    console.error(
      "❌ [MongoDB Error] Neither MONGODB_URI nor MONGO_URI is set in environment variables!"
    );
    return;
  }

  // Mask credentials for safe logging
  const maskedUri = uri.replace(
    /\/\/(.*?):(.*?)@/,
    "//$1:********@"
  );

  try {
    const connected = await mongoose.connect(uri);
    if (connected) {
      console.log(`✅ MongoDB Connected to: ${maskedUri}`);
    }
  } catch (error) {
    console.error(`❌ MongoDB Connection Error (${maskedUri}):`, error.message);
    if (error.code === 8000 || error.message.includes("bad auth")) {
      console.error(
        "💡 Hint: Check your database username/password in Render environment variables. Ensure no <password> placeholder remains."
      );
    }
  }
};

export default connectDB;
