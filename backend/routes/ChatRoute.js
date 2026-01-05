import "../config/env.js";
import express from "express";
import Chat from "../models/ChatModel.js";
import User from "../models/Usermodel.js";
import { protect } from "../middleware/authmiddleware.js";
import mongoose from "mongoose";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const router = express.Router();

/**
 * Helper: validate that vendor & user exist and roles are correct
 */
const validateVendorUser = async (vendorId, userId) => {
  if (!isValidId(vendorId) || !isValidId(userId)) {
    throw new Error("Invalid vendor or user ID");
  }

  const [vendor, user] = await Promise.all([
    User.findById(vendorId),
    User.findById(userId),
  ]);

  if (!vendor || vendor.role !== "vendor") {
    throw new Error("Invalid vendor");
  }

  if (!user || user.role !== "user") {
    throw new Error("Invalid user");
  }

  return { vendor, user };
};

/**
 * @route   POST /api/chats
 * @desc    Send a message in a vendor-user chat
 * @body    { vendorId, userId, message }
 * @access  Private (user or vendor)
 */
router.post("/", protect, async (req, res) => {
  try {
    const { vendorId, userId, message } = req.body;

    if (!vendorId || !userId || !message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "vendorId, userId and message are required",
      });
    }

    await validateVendorUser(vendorId, userId);

    if (
      req.user._id.toString() !== vendorId.toString() &&
      req.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "You are not part of this conversation",
      });
    }

    const isVendorSender = req.user.role === "vendor";

    const chatMessage = await Chat.create({
      vendor: vendorId,
      user: userId,
      sender: req.user._id,
      message: message.trim(),
      readByVendor: isVendorSender,
      readByUser: !isVendorSender,
    });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
      data: chatMessage,
    });
  } catch (error) {
    console.error("Chat send error:", error);
    res.status(500).json({
      success: false,
      message: error.message || "Failed to send message",
    });
  }
});

/**
 * @route   GET /api/chats/room/:otherUserId
 * @desc    Get all messages in room with other user + mark as read
 * @params  :otherUserId - Vendor or user ID to chat with
 * @access  Private (user or vendor)
 */
router.get("/room/:otherUserId", protect, async (req, res) => {
  try {
    const me = req.user._id;
    const other = req.params.otherUserId;

    if (!isValidId(other)) {
      return res.status(400).json({
        success: false,
        message: "Invalid user ID",
      });
    }

    await Chat.updateMany(
      {
        $or: [
          { vendor: me, user: other },
          { vendor: other, user: me },
        ],
        sender: { $ne: me },
      },
      {
        $set: req.user.role === "vendor"
          ? { readByVendor: true }
          : { readByUser: true },
      }
    );

    const messages = await Chat.find({
      $or: [
        { vendor: me, user: other },
        { vendor: other, user: me },
      ],
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar role")
      .lean();

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error("Chat room fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat room",
    });
  }
});

/**
 * @route   GET /api/chats/my/conversations/list
 * @desc    Get user's conversation list (latest message per chat room)
 * @query   none
 * @access  Private (user or vendor)
 */
router.get("/my/conversations/list", protect, async (req, res) => {
  try {
    const me = req.user._id;
    const isVendor = req.user.role === "vendor";

    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [{ vendor: me }, { user: me }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { vendor: "$vendor", user: "$user" },
          lastMessage: { $first: "$message" },
          lastSender: { $first: "$sender" },
          lastAt: { $first: "$createdAt" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$sender", me] },
                    {
                      $eq: [
                        isVendor ? "$readByVendor" : "$readByUser",
                        false,
                      ],
                    },
                  ],
                },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.vendor",
          foreignField: "_id",
          as: "vendor",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.user",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$vendor" },
      { $unwind: "$user" },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          vendor: {
            _id: "$vendor._id",
            name: "$vendor.name",
            avatar: { $ifNull: ["$vendor.avatar", null] },
          },
          user: {
            _id: "$user._id",
            name: "$user.name",
            avatar: { $ifNull: ["$user.avatar", null] },
          },
          lastMessage: 1,
          lastAt: 1,
          unreadCount: 1,
        },
      },
      { $sort: { "lastAt": -1 } },
    ]);

    res.json({
      success: true,
      data: { conversations },
    });
  } catch (error) {
    console.error("Conversations list error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch conversations",
    });
  }
});

/**
 * @route   GET /api/chats/:vendorId/:userId  
 * @desc    Get messages between specific vendor-user pair (legacy/alternative endpoint)
 * @params  :vendorId - Vendor ObjectId
 *          :userId - User ObjectId
 * @access  Private - must be vendor OR user
 */
router.get("/:vendorId/:userId", protect, async (req, res) => {
  try {
    const { vendorId, userId } = req.params;

    await validateVendorUser(vendorId, userId);

    if (
      req.user._id.toString() !== vendorId.toString() &&
      req.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied - not part of this conversation",
      });
    }

    const messages = await Chat.find({
      vendor: vendorId,
      user: userId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email role avatar")
      .lean();

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error("Specific chat fetch error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
      error: error.message,
    });
  }
});

export default router;
