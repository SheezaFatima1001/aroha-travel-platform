import Trip from '../models/Trip.js';

const ensureOwnership = (trip, userId, res) => {
  if (trip.user.toString() !== userId.toString()) {
    res.status(403).json({ success: false, message: 'Not authorized to access this trip' });
    return false;
  }
  return true;
};

export const createTrip = async (req, res, next) => {
  try {
    const trip = await Trip.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).populate('destination').sort({ startDate: 1 });
    res.json({ success: true, count: trips.length, data: trips });
  } catch (err) {
    next(err);
  }
};

export const getTripStats = async (req, res, next) => {
  try {
    const trips = await Trip.find({ user: req.user._id }).populate('destination');
    const now = new Date();
    const upcoming = trips.filter((t) => t.startDate > now && t.status !== 'Cancelled');
    const completed = trips.filter((t) => t.status === 'Completed');
    const totalPlannedDays = trips.reduce((sum, t) => {
      const days = Math.max(1, Math.round((t.endDate - t.startDate) / (1000 * 60 * 60 * 24)) + 1);
      return sum + days;
    }, 0);
    res.json({
      success: true,
      data: {
        totalTrips: trips.length,
        upcomingTrips: upcoming,
        completedTrips: completed,
        totalPlannedDays,
        recentTrips: trips.slice(-5).reverse(),
      },
    });
  } catch (err) {
    next(err);
  }
};

export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id).populate('destination');
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const updateTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;
    Object.assign(trip, req.body);
    await trip.save();
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const deleteTrip = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;
    await trip.deleteOne();
    res.json({ success: true, message: 'Trip deleted' });
  } catch (err) {
    next(err);
  }
};

// ---- Activities (nested within itinerary days) ----

export const addActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;

    const { dayNumber, date, title, location, time, category, description } = req.body;
    let day = trip.itinerary.find((d) => d.dayNumber === dayNumber);
    if (!day) {
      trip.itinerary.push({ dayNumber, date, activities: [] });
      day = trip.itinerary[trip.itinerary.length - 1];
      trip.itinerary.sort((a, b) => a.dayNumber - b.dayNumber);
    }
    day.activities.push({ title, location, time, category, description });
    await trip.save();
    res.status(201).json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const updateActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;

    let found = null;
    for (const day of trip.itinerary) {
      const activity = day.activities.id(req.params.activityId);
      if (activity) {
        Object.assign(activity, req.body);
        found = activity;
        break;
      }
    }
    if (!found) return res.status(404).json({ success: false, message: 'Activity not found' });
    await trip.save();
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};

export const deleteActivity = async (req, res, next) => {
  try {
    const trip = await Trip.findById(req.params.tripId);
    if (!trip) return res.status(404).json({ success: false, message: 'Trip not found' });
    if (!ensureOwnership(trip, req.user._id, res)) return;

    let removed = false;
    for (const day of trip.itinerary) {
      const activity = day.activities.id(req.params.activityId);
      if (activity) {
        activity.deleteOne();
        removed = true;
        break;
      }
    }
    if (!removed) return res.status(404).json({ success: false, message: 'Activity not found' });
    await trip.save();
    res.json({ success: true, data: trip });
  } catch (err) {
    next(err);
  }
};
