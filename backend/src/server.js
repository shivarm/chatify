import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "node:path";

import { ENV } from "./lib/env.js";
import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.routes.js";
import messageRoutes from "./routes/message.routes.js";

const app = express();
const __dirname = path.resolve();

const PORT = ENV.PORT || 5001;

app.use(express.json({ limit: "5mb" }));
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.json(__dirname, "../client/dist")));

  app.get("*", (_, res) => {
    res.sendFile(path.join(__dirname, "../client/dist/index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  connectDB();
});
