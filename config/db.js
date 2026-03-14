const mongoose = require("mongoose")
const dotenv = require("dotenv")
dotenv.config()

const mongoDbUri = process.env.MONGODB_URI

const connectDB = async () => {
  try {
    const connected = await mongoose.connect(mongoDbUri)
    if(connected) {
      console.log("MongoDB Connected");
    }
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message)
  }
}

module.exports = connectDB