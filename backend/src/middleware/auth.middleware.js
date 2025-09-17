import jwt from "jsonwebtoken";
import User from "../model/user.js";
import { ENV } from "../lib/env.js";

export const protectedRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    const { JWT_SECRET } = ENV;
    if (!JWT_SECRET) {
      return res.status(400).json("JWT_SECRET not set");
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    req.user = user; // we can get user in next middleware
    next();
  } catch (error) {
    console.log("Error in protectedRoute middleware", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};
