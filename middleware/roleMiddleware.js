export const authorize = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (!req.user.role) {
      return res.status(403).json({ message: "User role not found" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Forbidden" });
    }

    next();
  };
};

// Admin only middleware
export const adminOnly = authorize("admin");

// Blogger only middleware
export const bloggerOnly = authorize("blogger");