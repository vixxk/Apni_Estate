import mongoose from "mongoose";

const chatSchema = new mongoose.Schema(
  {
    participantA: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    participantB: {
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

    readByA: {
      type: Boolean,
      default: false,
    },
    readByB: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// index for faster lookups by room
chatSchema.index({ participantA: 1, participantB: 1, createdAt: 1 });

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
