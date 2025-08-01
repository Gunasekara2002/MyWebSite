import jwt from "jsonwebtoken";
import User from "../models/User.js"; 

const protect = async (req, res, next) => {
  let token = req.headers.authorization?.split(" ")[1]; 
  if (!token) {
    return res.status(401).json({ message: "unauthorized, no token" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");
    if (!req.user) {
      return res.status(401).json({ message: "unauthorized, no user found" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "unauthorized, Invalid token" });
  }
};

export default protect;

