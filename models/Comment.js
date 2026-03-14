import mongoose from "mongoose";

const commentSchema = new mongoose.Schema(
  {
    newsId: { type: mongoose.Schema.Types.ObjectId, ref: "News" },
    name: String,
    message: String,
  },
  { timestamps: true }
);

export default mongoose.model("Comment", commentSchema);