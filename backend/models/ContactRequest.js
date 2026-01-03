import mongoose from 'mongoose';

const contactRequestSchema = new mongoose.Schema({
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property reference is required']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User reference is required']
  },
  vendor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Vendor reference is required']
  },
  userInfo: {
    name: {
      type: String,
      required: [true, 'User name is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'User email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'User phone is required'],
      trim: true
    }
  },
  propertyInfo: {
    title: {
      type: String,
      default: ''
    },
    price: {
      type: Number,
      default: 0
    },
    type: {
      type: String,
      default: ''
    },
    location: {
      type: String,
      default: ''
    }
  },
  message: {
    type: String,
    maxlength: [500, 'Message cannot exceed 500 characters'],
    default: 'I am interested in this property. Please contact me.'
  },
  status: {
    type: String,
    enum: ['pending', 'contacted', 'closed'],
    default: 'pending'
  },
  vendorNotes: {
    type: String,
    maxlength: [1000, 'Notes cannot exceed 1000 characters']
  },
  contactedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Indexes for performance
contactRequestSchema.index({ property: 1 });
contactRequestSchema.index({ user: 1 });
contactRequestSchema.index({ vendor: 1 });
contactRequestSchema.index({ status: 1 });
contactRequestSchema.index({ createdAt: -1 });
contactRequestSchema.index({ vendor: 1, status: 1, createdAt: -1 });

const ContactRequest = mongoose.model('ContactRequest', contactRequestSchema);

export default ContactRequest;
