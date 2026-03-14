import News from "../models/News.js";

// CREATE NEWS

// CREATE NEWS
export const createNews = async (req, res) => {
  try {
    const { title, content, category } = req.body;

    if (!title || !content) {
      return res.status(400).json({ message: "Title and content are required." });
    }

    let imageUrl = req.file ? req.file.path : ""; // multer-storage-cloudinary stores URL in path

    const news = await News.create({
      title,
      content,
      category,
      coverImage: imageUrl, // this is the Cloudinary URL
      author: req.user.id,
      isApproved: false,
    });

    res.status(201).json({ message: "News created successfully", news });
  } catch (err) {
    console.error("Error creating news:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// HEADLINES ONLY
export const getHeadlines = async (req, res) => {
  try {
    // Populate author field with name and email (adjust fields as needed)
    const headlines = await News.find({}, "title createdAt author").populate(
      "author",
      "name email"
    );

    res.json(headlines);
  } catch (error) {
    console.error("Error fetching headlines:", error);
    res.status(500).json({ error: "Failed to fetch headlines" });
  }
};

export const getNews = async (req, res) => {
  try {
    const newsList = await News.find().populate("author", "name");

    return res.json({
      message: "All news fetched successfully",
      total: newsList.length,
      news: newsList
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error", error });
  }
};

// FULL NEWS
export const getNewsById = async (req, res) => {
  try {
    const news = await News.findById(req.params.id).populate("author", "name");
    res.json(news);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// EDIT NEWS
export const editNews = async (req, res) => {
  try {
    const updated = await News.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(500).json({ error });
  }
};

// DELETE NEWS
export const deleteNews = async (req, res) => {
  try {
    await News.findByIdAndDelete(req.params.id);
    res.json({ message: "News deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
};