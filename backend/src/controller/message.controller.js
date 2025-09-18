import cloudinary from "../lib/cloudinary.js";
import Message from "../model/message.js";
import User from "../model/user.js";

export const getAllContacts = async (req, res) => {
  try {
    const loggedinUserId = req.user._id;

    if (!loggedinUserId) {
      return res.status(401).json({ message: "Unauthorized user" });
    }
    const filteredUsers = await User.find({ _id: { $ne: loggedinUserId } }).select("-password");
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.log("Error in getAllContacts controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getChatPartners = async (req, res) => {
  try {
    const loggedinUserId = req.user._id;

    // find all messages where the logged-in user is either sender or receiver
    const messages = await Message.find({
      $or: [{ senderId: loggedinUserId }, { receiverId: loggedinUserId }],
    });

    const chatPartnerIdSet = [
      ...new Set(
        messages.map((msg) =>
          msg.senderId.toString() === loggedinUserId.toString()
            ? msg.receiverId.toString()
            : msg.senderId.toString()
        )
      ),
    ];
    const chatPartnerIds = Array.from(chatPartnerIdSet);
    const chatParters = await User.find({ _id: { $in: chatPartnerIds } }).select("-password");
    res.status(200).json(chatParters);
  } catch (error) {
    console.log("Error in getChatPartners controller", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const getMessagesByUser = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: userToChatId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessagesByUser controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl;
    if (image) {
      // upload base64 image
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    await newMessage.save();
    // todo: send message real-time when user is online
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller", error);
    res.status(500).json({ message: "Server error" });
  }
};
