import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    targetType: { type: String, required: true, enum: ['Destination', 'Service'] },
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: 'targetType',
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot be more than 5'],
    },
    reviewText: {
      type: String,
      required: [true, 'Review text is required'],
      trim: true,
      minlength: [5, 'Review must be at least 5 characters'],
      maxlength: [2000, 'Review cannot exceed 2000 characters'],
    },
    image: { type: String, default: '' },
    helpfulCount: { type: Number, default: 0 },
    helpfulBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// One review per user per target
reviewSchema.index({ user: 1, targetType: 1, targetId: 1 }, { unique: true });
reviewSchema.index({ targetType: 1, targetId: 1 });

export default mongoose.model('Review', reviewSchema);