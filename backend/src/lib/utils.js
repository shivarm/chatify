import jwt from "jsonwebtoken";
import { ENV } from "./env.js";

export const generateToken = async (userId, res) => {
  const token = jwt.sign({ userId }, ENV.JWT_SECRET, {
    expiresIn: "7d",
  });

  // send back to client
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true, // prevent XSS
    sameSite: "strict", // prevent CSRF
    secure: ENV.NODE_ENV === "development" ? false : true,
  });

  return token;
};
