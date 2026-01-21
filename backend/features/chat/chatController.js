import mongoose from 'mongoose';
import Chat from './chatModel.js';
import User from '../users/userModel.js';
import { normalizeRoom } from '../../scripts/chatRoom.js';
import { uploadToImageKit } from '../../config/imagekit.js';
import { asyncHandler } from '../../middleware/asyncHandler.js';

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

/**
 * Helper: validate that vendor & user exist and roles are correct
 */
const validateParticipants = async (id1, id2) => {
  if (!isValidId(id1) || !isValidId(id2)) {
    throw new Error('Invalid participant IDs');
  }

  const [u1, u2] = await Promise.all([User.findById(id1), User.findById(id2)]);

  if (!u1 || !u2) {
    throw new Error('One or both users not found');
  }

  return { u1, u2 };
};

// @desc    Send a message
// @route   POST /api/chats
// @access  Private
export const sendMessage = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const { otherUserId, message, image } = req.body;

  if (!otherUserId || (!message?.trim() && !image?.url)) {
    res.status(400);
    throw new Error('Message or image is required');
  }

  if (!isValidId(otherUserId)) {
    res.status(400);
    throw new Error('Invalid otherUserId');
  }

  await validateParticipants(me, otherUserId);

  const { participantA, participantB } = normalizeRoom(me, otherUserId);

  const senderIsA = me.toString() === participantA.toString();

  const chatMessage = await Chat.create({
    participantA,
    participantB,
    sender: me,
    message: message?.trim() || '',
    type: image ? 'image' : 'text',
    image: image || null,
    readByA: senderIsA,
    readByB: !senderIsA,
  });

  res.status(201).json({
    success: true,
    message: 'Message sent successfully',
    data: chatMessage,
  });
});

// @desc    Get all messages in room with other user + mark as read
// @route   GET /api/chats/room/:otherUserId
// @access  Private
export const getChatRoomMessages = asyncHandler(async (req, res) => {
  const me = req.user._id;
  const other = req.params.otherUserId;

  if (!isValidId(other)) {
    res.status(400);
    throw new Error('Invalid user ID');
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
    .populate('sender', 'name avatar role')
    .lean();

  res.json({
    success: true,
    data: { messages },
  });
});

// @desc    Get user's conversation list (latest message per chat room)
// @route   GET /api/chats/my/conversations/list
// @access  Private
export const getMyConversations = asyncHandler(async (req, res) => {
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
        _id: { participantA: '$participantA', participantB: '$participantB' },
        lastMessage: { $first: '$message' },
        lastType: { $first: '$type' },
        lastImage: { $first: '$image' },
        lastSender: { $first: '$sender' },
        lastAt: { $first: '$createdAt' },
        lastReadByA: { $first: '$readByA' },
        lastReadByB: { $first: '$readByB' },
        unreadCount: {
          $sum: {
            $cond: [
              {
                $and: [
                  { $ne: ['$sender', me] },
                  {
                    $eq: [
                      {
                        $cond: [
                          { $eq: ['$participantA', me] },
                          '$readByA',
                          '$readByB',
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
        from: 'users',
        localField: '_id.participantA',
        foreignField: '_id',
        as: 'participantA',
      },
    },
    {
      $lookup: {
        from: 'users',
        localField: '_id.participantB',
        foreignField: '_id',
        as: 'participantB',
      },
    },
    { $unwind: '$participantA' },
    { $unwind: '$participantB' },
    {
      $addFields: {
        me: {
          $cond: [
            { $eq: ['$participantA._id', me] },
            '$participantA',
            '$participantB',
          ],
        },
        other: {
          $cond: [
            { $eq: ['$participantA._id', me] },
            '$participantB',
            '$participantA',
          ],
        },
      },
    },
    {
      $project: {
        _id: 0,
        roomId: '$_id',
        me: {
          _id: '$me._id',
          name: '$me.name',
          avatar: { $ifNull: ['$me.avatar', null] },
          role: '$me.role',
        },
        other: {
          _id: '$other._id',
          name: '$other.name',
          avatar: { $ifNull: ['$other.avatar', null] },
          role: '$other.role',
        },
        lastMessage: {
          $cond: [
            { $eq: ['$lastType', 'image'] },
            'Image',
            '$lastMessage',
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
});

// @desc    Get messages between specific vendor-user pair
// @route   GET /api/chats/:vendorId/:userId
// @access  Private
export const getSpecificChat = asyncHandler(async (req, res) => {
  const { vendorId, userId } = req.params;
  await validateParticipants(vendorId, userId);

  if (
    req.user._id.toString() !== vendorId.toString() &&
    req.user._id.toString() !== userId.toString()
  ) {
    res.status(403);
    throw new Error('Access denied - not part of this conversation');
  }

  const { participantA, participantB } = normalizeRoom(vendorId, userId);

  const messages = await Chat.find({
    participantA,
    participantB,
  })
    .sort({ createdAt: 1 })
    .populate('sender', 'name email role avatar')
    .lean();

  res.json({
    success: true,
    data: { messages },
  });
});

// @desc    Upload chat image
// @route   POST /api/upload/chat-image
// @access  Private
export const uploadChatImage = asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No image uploaded');
  }

  const image = await uploadToImageKit(req.file, 'chat');

  res.json({
    success: true,
    data: {
      image: {
        url: image.url,
        width: image.width,
        height: image.height,
        size: req.file.size,
      },
    },
  });
});
