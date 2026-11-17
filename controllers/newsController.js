import News from "../models/News.js";
import AuditLog from "../models/AuditLog.js";
import slugify from "slugify";

// CREATE NEWS
export const createNews = async (req, res) => {
  try {
    const { title, content, category, isApproved } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, message: "Title and content are required." });
    }

    let imageUrl = req.file ? req.file.path : (req.body.coverImage || "");

    const slug = slugify(title, { lower: true, strict: true }) + "-" + Date.now().toString().slice(-4);

    // If an admin creates news, approve automatically; if blogger, check approval settings
    const approved = req.user?.role === "admin" || req.user?.role === "superadmin" || isApproved === "true" || isApproved === true;

    const news = await News.create({
      title,
      slug,
      content,
      category: category || "General",
      coverImage: imageUrl,
      author: req.user?.id,
      isApproved: approved,
    });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "CREATE_NEWS",
      module: "News",
      targetId: news._id.toString(),
      details: { title: news.title, isApproved: news.isApproved }
    });

    res.status(201).json({ success: true, message: "News created successfully", news });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ success: false, message: "Server error", error: err.message });
  }
};

// HEADLINES ONLY (Returns latest published headlines)
export const getHeadlines = async (req, res) => {
  try {
    const headlines = await News.find({}, "title slug coverImage category isApproved createdAt author")
      .sort({ createdAt: -1 })
      .populate("author", "name email");

    res.json(headlines);
  } catch (error) {
    console.error("Error fetching headlines:", error);
    res.status(500).json({ error: "Failed to fetch headlines" });
  }
};

// ALL NEWS (Supports pagination & search)
export const getNews = async (req, res) => {
  try {
    const { category, search, page = 1, limit = 10, all } = req.query;
    const filter = {};

    // For public website, only show approved news unless all=true requested by admin
    if (all !== "true") {
      filter.isApproved = { $ne: false }; // Show approved or documents without isApproved set
    }
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: "i" } },
        { content: { $regex: search, $options: "i" } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [newsList, total] = await Promise.all([
      News.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate("author", "name"),
      News.countDocuments(filter),
    ]);

    return res.json({
      success: true,
      message: "All news fetched successfully",
      total,
      page: Number(page),
      totalPages: Math.ceil(total / Number(limit)),
      news: newsList,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// GET NEWS BY ID OR SLUG
export const getNewsById = async (req, res) => {
  try {
    let news;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      news = await News.findById(req.params.id).populate("author", "name email");
    } else {
      news = await News.findOne({ slug: req.params.id }).populate("author", "name email");
    }

    if (!news) return res.status(404).json({ success: false, message: "News not found" });

    // Increment views asynchronously
    News.findByIdAndUpdate(news._id, { $inc: { views: 1 } }).exec();

    res.json(news);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// EDIT NEWS
export const editNews = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (req.file) {
      updateData.coverImage = req.file.path;
    }

    const updated = await News.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "News not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "EDIT_NEWS",
      module: "News",
      targetId: updated._id.toString(),
      details: { title: updated.title }
    });

    res.json(updated);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// APPROVE NEWS
export const approveNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      { isApproved: true },
      { new: true }
    );
    if (!updated) return res.status(404).json({ success: false, message: "News not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "APPROVE_NEWS",
      module: "News",
      targetId: updated._id.toString(),
      details: { title: updated.title }
    });

    res.json({ success: true, message: "News approved successfully", news: updated });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// DELETE NEWS
export const deleteNews = async (req, res) => {
  try {
    const deleted = await News.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "News not found" });

    await AuditLog.create({
      adminId: req.user?.id,
      adminEmail: req.user?.email || "Admin",
      action: "DELETE_NEWS",
      module: "News",
      targetId: req.params.id,
      details: { title: deleted.title }
    });

    res.json({ success: true, message: "News deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET DASHBOARD STATS
export const getDashboardStats = async (req, res) => {
  try {
    const [totalNews, approvedNews, pendingNews] = await Promise.all([
      News.countDocuments(),
      News.countDocuments({ isApproved: true }),
      News.countDocuments({ isApproved: false }),
    ]);

    res.json({
      success: true,
      stats: {
        totalNews,
        approvedNews,
        pendingNews,
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats" });
  }
};
