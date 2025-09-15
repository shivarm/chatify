import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = async (userId, res) => {
  const { JWT_SECRET, NODE_ENV } = ENV;
  if (!JWT_SECRET || !NODE_ENV) throw new Error("JWT or NODE_ENV not set");
  const token = jwt.sign({ userId }, JWT_SECRET, {
    expiresIn: "7d",
  });

  // send back to client
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS
    sameSite: "strict", // prevent CSRF
    secure: NODE_ENV === "development" ? false : true,
  });

  return token;
};
