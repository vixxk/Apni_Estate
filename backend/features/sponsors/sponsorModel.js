
import mongoose from "mongoose";

const sponsorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    logoUrl: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    location: {
      type: String,
      required: false, // Optional for flexibility
    },
    launchDate: {
      type: String, // Allowing flexibility for "Coming Soon" or specific dates
      required: false,
    },
    contactPhone: {
      type: String,
      required: false,
    },
    contactEmail: {
      type: String,
      required: false,
    },
    website: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const Sponsor = mongoose.model("Sponsor", sponsorSchema);
export default Sponsor;
