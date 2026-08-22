import Booking from '../models/Booking.js';
import Service from '../models/Service.js';

const ensureOwnership = (booking, userId, res) => {
  if (booking.user.toString() !== userId.toString()) {
    res.status(403).json({ success: false, message: 'Not authorized to access this booking' });
    return false;
  }
  return true;
};

export const createBooking = async (req, res, next) => {
  try {
    const { service: serviceId, bookingDate, numberOfPeople, specialRequest } = req.body;
    const service = await Service.findById(serviceId);
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    if (!service.availability) {
      return res.status(400).json({ success: false, message: 'This service is not currently available' });
    }
    if (!bookingDate || !numberOfPeople || numberOfPeople < 1) {
      return res.status(400).json({ success: false, message: 'Booking date and a valid number of people are required' });
    }

    // Backend always calculates the authoritative price - never trust the client
    const totalPrice = service.price * Number(numberOfPeople);

    const booking = await Booking.create({
      user: req.user._id,
      service: service._id,
      bookingDate,
      numberOfPeople,
      totalPrice,
      specialRequest,
    });
    const populated = await booking.populate('service');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

export const getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).populate('service').sort({ createdAt: -1 });
    res.json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    next(err);
  }
};

export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('service');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ensureOwnership(booking, req.user._id, res)) return;
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

export const updateBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ensureOwnership(booking, req.user._id, res)) return;

    const { bookingDate, numberOfPeople, specialRequest } = req.body;
    if (numberOfPeople) {
      const service = await Service.findById(booking.service);
      booking.totalPrice = service.price * Number(numberOfPeople);
      booking.numberOfPeople = numberOfPeople;
    }
    if (bookingDate) booking.bookingDate = bookingDate;
    if (specialRequest !== undefined) booking.specialRequest = specialRequest;

    await booking.save();
    const populated = await booking.populate('service');
    res.json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (!ensureOwnership(booking, req.user._id, res)) return;
    if (booking.bookingStatus === 'Completed') {
      return res.status(400).json({ success: false, message: 'Completed bookings cannot be cancelled' });
    }
    booking.bookingStatus = 'Cancelled';
    await booking.save();
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};
