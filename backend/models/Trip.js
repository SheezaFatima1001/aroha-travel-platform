import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  location: { type: String, default: '' },
  time: { type: String, default: '' },
  category: { type: String, default: 'General' },
  description: { type: String, default: '' },
});

const daySchema = new mongoose.Schema({
  dayNumber: { type: Number, required: true },
  date: { type: Date },
  activities: [activitySchema],
});

const tripSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    tripName: { type: String, required: true, trim: true },
    destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    numberOfTravelers: { type: Number, required: true, min: 1, default: 1 },
    description: { type: String, default: '' },
    status: { type: String, enum: ['Planned', 'Ongoing', 'Completed', 'Cancelled'], default: 'Planned' },
    itinerary: [daySchema],
  },
  { timestamps: true }
);

export default mongoose.model('Trip', tripSchema);
