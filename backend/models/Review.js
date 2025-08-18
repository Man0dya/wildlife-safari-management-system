import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookingId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking', 
    required: true 
  },
  packageId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Package', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  title: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 100 
  },
  review: { 
    type: String, 
    required: true, 
    trim: true, 
    maxlength: 1000 
  },
  images: [{
    url: { type: String, required: true },
    deleteUrl: { type: String },
    id: { type: String }
  }],
  isVerified: { 
    type: Boolean, 
    default: false 
  },
  isActive: { 
    type: Boolean, 
    default: true 
  }
}, { 
  timestamps: true 
});

// Ensure one review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

// Index for better query performance
reviewSchema.index({ packageId: 1, isActive: 1 });
reviewSchema.index({ userId: 1 });
reviewSchema.index({ rating: 1 });

const Review = mongoose.model("Review", reviewSchema);

export default Review;

