import mongoose from 'mongoose';

const serviceSchema = new mongoose.Schema(
  {
    serviceName: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['Hotels', 'Tours', 'Transport', 'Activities', 'Packages', 'Guides'],
    },
    location: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    availability: { type: Boolean, default: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model('Service', serviceSchema);
