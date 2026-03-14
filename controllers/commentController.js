import Comment from "../models/Comment.js";

export const addComment = async (req, res) => {
  try {
    const { name, message } = req.body;

    const comment = await Comment.create({
      newsId: req.params.newsId,
      name,
      message
    });

    res.json(comment);
  } catch (error) {
    res.status(500).json({ error });
  }
};

export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ newsId: req.params.newsId });
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error });
  }
};