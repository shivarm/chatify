import express from "express";

const router = express.Router()

import { getAllContacts, getChatPartners, getMessagesByUser, sendMessage } from "../controller/message.controller.js"
import { protectedRoute } from "../middleware/auth.middleware.js";
import { arcjetProtection } from "../middleware/arcjet.middleware.js";

// the middlewares execute in order - so requests get rate-limited first, then authenticated.
// this is actually more efficient since unauthenticated requests get blocked by rate limiting before hitting the auth middleware.
router.use(arcjetProtection, protectedRoute);

router.get("/contacts", getAllContacts);
router.get("/chats", getChatPartners);
router.get("/:id", getMessagesByUser);
router.post("/send/:id", sendMessage);

export default router