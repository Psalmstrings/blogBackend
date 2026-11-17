import MediaItem from "../models/MediaItem.js";
import AuditLog from "../models/AuditLog.js";

// GET ALL MEDIA (Public)
export const getMediaItems = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type) filter.mediaType = type;
    if (category) filter.category = category;

    const items = await MediaItem.find(filter).sort({ displayOrder: 1, createdAt: -1 });
    res.json({ success: true, count: items.length, items });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch media items" });
  }
};

// ADD MEDIA ITEM (Admin)
export const addMediaItem = async (req, res) => {
  try {
    const data = { ...req.body };
    if (req.file) {
      data.url = req.file.path;
      data.mediaType = "image";
    }

    if (!data.url) {
      return res.status(400).json({ success: false, message: "Media URL or file is required" });
    }

    const item = await MediaItem.create(data);

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "ADD_MEDIA_ITEM",
      module: "Media",
      targetId: item._id.toString(),
      details: { title: item.title, type: item.mediaType }
    });

    res.status(201).json({ success: true, message: "Media item added", item });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add media item", error: err.message });
  }
};

// DELETE MEDIA ITEM (Admin)
export const deleteMediaItem = async (req, res) => {
  try {
    const item = await MediaItem.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "Media item not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "DELETE_MEDIA_ITEM",
      module: "Media",
      targetId: req.params.id,
      details: { title: item.title }
    });

    res.json({ success: true, message: "Media item deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
};
