import mongoose from 'mongoose';

const telecallerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
    },
    referralId: {
      type: String,
      required: true,
      unique: true,
    },
    // Array of vendor IDs who used this referral ID
    onboardings: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Telecaller = mongoose.model('Telecaller', telecallerSchema);

export default Telecaller;
