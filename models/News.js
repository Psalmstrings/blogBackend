import mongoose from "mongoose";

const newsSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, index: true },
    content: { type: String, required: true },
    coverImage: { type: String, default: "" },
    category: { type: String, default: "General" },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Blogger" },
    isApproved: { type: Boolean, default: true }, // Default approved for direct admin posts
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual property 'approved' pointing to 'isApproved' for frontend compatibility
newsSchema.virtual("approved").get(function() {
  return this.isApproved;
});

export default mongoose.model("News", newsSchema);
