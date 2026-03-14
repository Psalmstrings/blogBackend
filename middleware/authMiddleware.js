import jwt from "jsonwebtoken";

export const protect = (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization header first
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    // // 2️⃣ Fallback to cookies
    // if (!token && req.cookies?.token) {
    //   token = req.cookies.token;
    // }

    // 3️⃣ If still no token
    if (!token) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // 4️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // attach user info to request
    next();

  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};