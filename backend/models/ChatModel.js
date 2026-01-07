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
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["text", "image"],
      default: "text",
      index: true,
    },

    image: {
      url: { type: String },
      width: { type: Number },
      height: { type: Number },
      size: { type: Number }, 
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

chatSchema.index({ participantA: 1, participantB: 1, createdAt: 1 });

chatSchema.pre("validate", function (next) {
  if (!this.message && !this.image?.url) {
    return next(new Error("Chat message must contain text or image"));
  }
  next();
});

const Chat = mongoose.model("Chat", chatSchema);
export default Chat;
