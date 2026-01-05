import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    readByVendor: {
      type: Boolean,
      default: false,
    },
    readByUser: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// index for faster lookups by room
chatSchema.index({ vendor: 1, user: 1, createdAt: 1 });

const Chat = mongoose.model("Chat", chatSchema);

export default Chat;
