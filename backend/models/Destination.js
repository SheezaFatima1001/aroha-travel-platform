import mongoose from 'mongoose';

const destinationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: ['Mountains', 'Beaches', 'Historical', 'Cultural', 'Adventure', 'Cities', 'Nature', 'Religious', 'Luxury'],
    },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    popularity: { type: Number, min: 0, default: 0 },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

destinationSchema.index({ name: 'text', country: 'text', location: 'text' });

export default mongoose.model('Destination', destinationSchema);
