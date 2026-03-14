import Blogger from "../models/Blogger.js";


// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await Blogger.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error });
  }
}; 

// SUSPEND USER
export const suspendUser = async (req, res) => {
  try {
    const user = await Blogger.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isSuspended = true;
    await user.save();
        res.json({ message: "User suspended successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }
};

// REACTIVATE USER
export const reactivateUser = async (req, res) => {
  try {
    const user = await Blogger.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.isSuspended = false;
    await user.save();
        res.json({ message: "User reactivated successfully" });
    } catch (error) {
        res.status(500).json({ error });
    }  
};