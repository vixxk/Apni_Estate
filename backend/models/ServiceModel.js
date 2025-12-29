import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    categories: {
      type: [String],
      required: true,
    },

    priceRange: {
      min: { type: Number, required: true },
      max: { type: Number, required: true },
    },

    images: [
      {
        url: { type: String, required: true },
        fileId: { type: String, required: true },
        isPrimary: { type: Boolean, default: false },
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
