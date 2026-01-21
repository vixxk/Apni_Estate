import mongoose from 'mongoose';

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User is required for appointment']
  },
  property: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Property',
    required: [true, 'Property is required for appointment']
  },
  date: {
    type: Date,
    required: [true, 'Appointment date is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Appointment date must be in the future'
    }
  },
  time: {
    type: String,
    required: [true, 'Appointment time is required'],
    match: [/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter time in HH:MM format']
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'],
    default: 'pending'
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters'],
    trim: true
  },
  contactInfo: {
    name: String,
    phone: String,
    email: String
  },
  reminderSent: {
    type: Boolean,
    default: false
  },
  feedback: {
    rating: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      maxlength: [500, 'Feedback comment cannot exceed 500 characters']
    },
    submittedAt: Date
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
appointmentSchema.index({ user: 1, date: -1 });
appointmentSchema.index({ property: 1, date: -1 });
appointmentSchema.index({ status: 1 });
appointmentSchema.index({ date: 1 });

// Virtual for formatted date
appointmentSchema.virtual('formattedDate').get(function() {
  return this.date.toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Virtual for formatted time
appointmentSchema.virtual('formattedTime').get(function() {
  const [hours, minutes] = this.time.split(':');
  const hour12 = hours % 12 || 12;
  const ampm = hours < 12 ? 'AM' : 'PM';
  return `${hour12}:${minutes} ${ampm}`;
});

// Virtual for full appointment details
appointmentSchema.virtual('appointmentDetails').get(function() {
  return {
    date: this.formattedDate,
    time: this.formattedTime,
    status: this.status,
    notes: this.notes
  };
});

// Instance method to send reminder
appointmentSchema.methods.sendReminder = async function() {
  // This would integrate with email service
  // For now, just mark as sent
  this.reminderSent = true;
  return this.save();
};

// Instance method to cancel appointment
appointmentSchema.methods.cancel = function(reason = '') {
  this.status = 'cancelled';
  this.notes = reason ? `${this.notes || ''} [CANCELLED: ${reason}]` : this.notes;
  return this.save();
};

// Instance method to confirm appointment
appointmentSchema.methods.confirm = function() {
  this.status = 'confirmed';
  return this.save();
};

// Static method to find upcoming appointments
appointmentSchema.statics.findUpcoming = function(userId, limit = 10) {
  return this.find({
    user: userId,
    date: { $gte: new Date() },
    status: { $in: ['pending', 'confirmed'] }
  })
  .populate('property', 'title location images')
  .sort({ date: 1 })
  .limit(limit);
};

// Static method to find appointments for a property
appointmentSchema.statics.findByProperty = function(propertyId, status = null) {
  const query = { property: propertyId };
  if (status) query.status = status;

  return this.find(query)
    .populate('user', 'name email phone')
    .sort({ date: -1 });
};

// Pre-save middleware to validate date/time conflicts
appointmentSchema.pre('save', async function(next) {
  if (this.isNew || this.isModified('date') || this.isModified('time')) {
    // Check for conflicts (same user, same date/time)
    const conflict = await this.constructor.findOne({
      user: this.user,
      date: this.date,
      time: this.time,
      status: { $in: ['pending', 'confirmed'] },
      _id: { $ne: this._id }
    });

    if (conflict) {
      const error = new Error('You already have an appointment at this date and time');
      return next(error);
    }
  }
  next();
});

const Appointment = mongoose.model('Appointment', appointmentSchema);

export default Appointment;
