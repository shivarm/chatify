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
        if (!CLIENT_URL) throw new Error("Clent URL is not set");
        await sendWelcomeEmail(savedUser.email, savedUser.fullName, CLIENT_URL);
      } catch (error) {
        console.log("Error while sending email", error);
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error while signup controller");
    res.status(500).json({ message: "Something went wrong" });
  }
};
