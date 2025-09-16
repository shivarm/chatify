import User from "../model/user.js";
import bcrypt from "bcryptjs";

import { generateToken } from "../lib/utils.js";
import { ENV } from "../lib/env.js";
import { sendWelcomeEmail } from "../email/emailHandler.js";

export const signup = async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 character" });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "This email already associate with chatify account" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      email,
      password: hashedPassword,
    });

    if (newUser) {
      // persist user first, then issue auth cookie
      const savedUser = await newUser.save();
      generateToken(savedUser._id, res);

      res.status(201).json({
        _id: newUser._id,
        fullName: newUser.fullName,
        email: newUser.email,
        profilePic: newUser.profilePic,
      });

      // send welcome email
      try {
        const { CLIENT_URL } = ENV;
        if (!CLIENT_URL) throw new Error("Client_URL is not set");
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, CLIENT_URL);
      } catch (error) {
        console.log("Error while sending email", error);
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller");
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and Password are required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isPassword = await bcrypt.compare(password, user.password);
    if (!isPassword) return res.status(400).json({ message: "Invalid credentials" });

    generateToken(user._id, res);

    res.status(200).json({
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.log("Error in login controller");
    res.status(500).json({ message: "Something went wrong" });
  }
};
export const logout = (_, res) => {
  res.cookie("jwt", "", { maxAge: 0 });
  res.status(200).json({ message: "logout successfully" });
};
