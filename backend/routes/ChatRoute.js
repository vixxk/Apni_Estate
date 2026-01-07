import "../config/env.js";
import express from "express";
import Chat from "../models/ChatModel.js";
import User from "../models/Usermodel.js";
import { protect } from "../middleware/authmiddleware.js";
import mongoose from "mongoose";
import { normalizeRoom } from "../scripts/chatRoom.js";

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);
const router = express.Router();

/**
 * Helper: validate that vendor & user exist and roles are correct
 */
// keep this in your chat routes file
const validateParticipants = async (id1, id2) => {
  if (!isValidId(id1) || !isValidId(id2)) {
    throw new Error("Invalid participant IDs");
  }

  const [u1, u2] = await Promise.all([User.findById(id1), User.findById(id2)]);

  if (!u1 || !u2) {
    throw new Error("One or both users not found");
  }

  return { u1, u2 };
};

/**
 * @route   POST /api/chats
 * @body    { otherUserId, message }
 * @access  Private (any user/vendor)
 */
router.post("/", protect, async (req, res) => {
  try {
    const me = req.user._id;
    const { otherUserId, message, image } = req.body;

    if (!otherUserId || (!message?.trim() && !image?.url)) {
      return res.status(400).json({
        success: false,
        message: "Message or image is required",
      });
    }

    if (!isValidId(otherUserId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid otherUserId",
      });
    }

    await validateParticipants(me, otherUserId);

    const { participantA, participantB, aIsFirst } = normalizeRoom(
      me,
      otherUserId
    );

    const senderIsA = me.toString() === participantA.toString();

    const chatMessage = await Chat.create({
      participantA,
      participantB,
      sender: me,
      message: message?.trim() || "",
      type: image ? "image" : "text",
      image: image || null,
      readByA: senderIsA,
      readByB: !senderIsA,
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

    const { participantA, participantB } = normalizeRoom(me, other);
    const meIsA = me.toString() === participantA.toString();

    await Chat.updateMany(
      {
        participantA,
        participantB,
        sender: { $ne: me },
      },
      {
        $set: meIsA ? { readByA: true } : { readByB: true },
      }
    );

    const messages = await Chat.find({
      participantA,
      participantB,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name avatar role")
      .lean();

    res.json({
      success: true,
      data: { messages },
    });
  } catch (error) {
    console.error("Chat room fetch error full:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch chat room",
      error: error.message,
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

    const conversations = await Chat.aggregate([
      {
        $match: {
          $or: [{ participantA: me }, { participantB: me }],
        },
      },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { participantA: "$participantA", participantB: "$participantB" },
          lastMessage: { $first: "$message" },
          lastType: { $first: "$type" },
          lastImage: { $first: "$image" },
          lastSender: { $first: "$sender" },
          lastAt: { $first: "$createdAt" },
          lastReadByA: { $first: "$readByA" },
          lastReadByB: { $first: "$readByB" },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $ne: ["$sender", me] },
                    {
                      $eq: [
                        {
                          $cond: [
                            { $eq: ["$participantA", me] },
                            "$readByA",
                            "$readByB",
                          ],
                        },
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
          localField: "_id.participantA",
          foreignField: "_id",
          as: "participantA",
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "_id.participantB",
          foreignField: "_id",
          as: "participantB",
        },
      },
      { $unwind: "$participantA" },
      { $unwind: "$participantB" },
      {
        $addFields: {
          me: {
            $cond: [
              { $eq: ["$participantA._id", me] },
              "$participantA",
              "$participantB",
            ],
          },
          other: {
            $cond: [
              { $eq: ["$participantA._id", me] },
              "$participantB",
              "$participantA",
            ],
          },
        },
      },
      {
        $project: {
          _id: 0,
          roomId: "$_id",
          me: {
            _id: "$me._id",
            name: "$me.name",
            avatar: { $ifNull: ["$me.avatar", null] },
            role: "$me.role",
          },
          other: {
            _id: "$other._id",
            name: "$other.name",
            avatar: { $ifNull: ["$other.avatar", null] },
            role: "$other.role",
          },
          lastMessage: {
            $cond: [
              { $eq: ["$lastType", "image"] },
              "Image",
              "$lastMessage",
            ],
          },
          lastType: 1,
          lastAt: 1,
          unreadCount: 1,
        },
      },
      { $sort: { lastAt: -1 } },
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
    await validateParticipants(vendorId, userId);

    if (
      req.user._id.toString() !== vendorId.toString() &&
      req.user._id.toString() !== userId.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Access denied - not part of this conversation",
      });
    }

    const { participantA, participantB } = normalizeRoom(vendorId, userId);

    const messages = await Chat.find({
      participantA,
      participantB,
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
