import mongoose from 'mongoose';
import crypto from 'crypto';

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
    bookingId: { type: String, unique: true },
    bookingDate: { type: Date, required: true },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    specialRequest: { type: String, default: '' },
    bookingStatus: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled', 'Completed'], default: 'Pending' },
  },
  { timestamps: true }
);

bookingSchema.pre('validate', function (next) {
  if (!this.bookingId) {
    this.bookingId = 'BK-' + crypto.randomBytes(4).toString('hex').toUpperCase();
  }
  next();
});

export default mongoose.model('Booking', bookingSchema);
