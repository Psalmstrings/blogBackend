import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: String,
    content: String,
    coverImage: String,
    category: String,
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Blogger" },
    isApproved: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export default mongoose.model("News", newsSchema);