import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true,
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: [
      'apartment', 'house', 'villa', 'plot', 'commercial', 'office',
      'construction services', 'interior', 'legal service', 'vastu',
      'sanitary and hardware', 'home loan', 'construction materials','furniture','decoratives',
      'houses', 'apartments', 'shops', 'commercial plots', 'farm house','others', 'flats', 'villas', 'plots',
      'buy','rent', 'sell', 'lease',
      'manpower', 'plumber', 'electrician', 'painter', 'carpenter', 'mason', 'general labour', 'technician', 'construction worker'
    ],
    lowercase: true
  },
  category: {
    type: String,
    required: [true, 'Property category is required'],
    enum: ['rent', 'sell', 'buy', 'lease', 'none', 'manpower'],
    lowercase: true
  },
  location: {
    address: {
      type: String,
      required: false, 
      trim: true,
      default: ''
    },
    city: {
      type: String,
      required: false, 
      trim: true,
      default: ''
    },
    state: {
      type: String,
      required: false, 
      trim: true,
      default: ''
    },
    pincode: {
      type: String,
      required: false, 
      match: [/^\d{6}$/, 'Please enter a valid 6-digit pincode'],
      default: ''
    },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  features: {
    bedrooms: {
      type: Number,
      min: 0,
      default: 0
    },
    bathrooms: {
      type: Number,
      min: 0,
      default: 0
    },
    area: {
      type: Number,
      min: 0
    },
    floor: Number,
    totalFloors: Number,
    parking: {
      type: Boolean,
      default: false
    },
    furnished: {
      type: String,
      enum: ['furnished', 'semi-furnished', 'unfurnished'],
      default: 'unfurnished'
    },
    amenities: [String]
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    fileId: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Property owner is required']
  },
  contactInfo: {
    phone: String,
    email: String,
    alternatePhone: String
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending' 
  },

  adminReview: {
    reviewedBy: {
      type: String, 
      default: null
    },
    reviewedAt: {
      type: Date,
      default: null
    },
    rejectionReason: {
      type: String,
      trim: true,
      maxlength: [500, 'Rejection reason cannot exceed 500 characters']
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [1000, 'Notes cannot exceed 1000 characters']
    }
  },
  views: {
    type: Number,
    default: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String],
  metadata: {
    yearBuilt: Number,
    propertyTax: Number,
    maintenanceCharges: Number,
    securityDeposit: Number,
    noticePeriod: String
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
propertySchema.index({ 'location.city': 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ category: 1 });
propertySchema.index({ price: 1 });
propertySchema.index({ status: 1 });
propertySchema.index({ createdAt: -1 });
propertySchema.index({ tags: 1 });
propertySchema.index({ owner: 1 });

// Virtual for primary image
propertySchema.virtual('primaryImage').get(function () {
  return this.images.find(img => img.isPrimary) || this.images[0];
});

// Virtual for formatted price
propertySchema.virtual('formattedPrice').get(function () {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(this.price);
});

// Instance method to increment views
propertySchema.methods.incrementViews = function () {
  this.views += 1;
  return this.save();
};

// Static method to find nearby properties
propertySchema.statics.findNearby = function (latitude, longitude, radiusKm = 10) {
  return this.find({
    'location.coordinates.latitude': {
      $gte: latitude - (radiusKm / 111.32),
      $lte: latitude + (radiusKm / 111.32)
    },
    'location.coordinates.longitude': {
      $gte: longitude - (radiusKm / 111.32),
      $lte: longitude + (radiusKm / 111.32)
    },
    status: 'approved' 
  });
};

// Pre-save middleware to set primary image
propertySchema.pre('save', function (next) {
  if (this.images.length > 0 && !this.images.some(img => img.isPrimary)) {
    this.images[0].isPrimary = true;
  }
  next();
});

const Property = mongoose.model('Property', propertySchema, 'properties');

export default Property;
