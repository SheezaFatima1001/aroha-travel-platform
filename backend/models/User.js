import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const DESTINATION_CATEGORIES = ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'];

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    password: { type: String, required: [true, 'Password is required'], minlength: 6, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileImage: { type: String, default: '' },
    bio: { type: String, default: '', maxlength: 500 },
    favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Destination' }],
    recentlyViewed: [
      {
        destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination' },
        viewedAt: { type: Date, default: Date.now },
      },
    ],
    preferences: {
      budget: { type: String, enum: ['Budget', 'Mid-range', 'Luxury', null], default: null },
      travelStyle: {
        type: String,
        enum: ['Adventure', 'Relaxation', 'Cultural', 'Family', 'Luxury', null],
        default: null,
      },
      preferredCategory: { type: String, enum: [...DESTINATION_CATEGORIES, null], default: null },
      preferredLocation: { type: String, default: '', trim: true },
      tripDuration: { type: Number, min: 1, max: 60, default: null },
    },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model('User', userSchema);