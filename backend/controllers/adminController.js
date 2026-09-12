import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import Review from '../models/Review.js';
import Trip from '../models/Trip.js';

// GET /api/admin/stats  (admin only) - advanced analytics dashboard
export const getAdminStats = async (req, res, next) => {
  try {
    const [
      totalUsers,
      totalDestinations,
      totalServices,
      totalBookings,
      totalReviews,
      totalTrips,
      revenueAgg,
      bookingsByStatus,
      revenueByMonth,
      topDestinationsByFavorite,
      topServicesByBookings,
      ratingDistribution,
    ] = await Promise.all([
      User.countDocuments(),
      Destination.countDocuments(),
      Service.countDocuments(),
      Booking.countDocuments(),
      Review.countDocuments(),
      Trip.countDocuments(),

      Booking.aggregate([
        { $match: { bookingStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' } } },
      ]),

      Booking.aggregate([{ $group: { _id: '$bookingStatus', count: { $sum: 1 } } }]),

      Booking.aggregate([
        { $match: { bookingStatus: { $ne: 'Cancelled' } } },
        {
          $group: {
            _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
            revenue: { $sum: '$totalPrice' },
            bookings: { $sum: 1 },
          },
        },
        { $sort: { '_id.year': 1, '_id.month': 1 } },
        { $limit: 12 },
      ]),

      User.aggregate([
        { $unwind: '$favorites' },
        { $group: { _id: '$favorites', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'destinations', localField: '_id', foreignField: '_id', as: 'destination' } },
        { $unwind: '$destination' },
        { $project: { name: '$destination.name', category: '$destination.category', count: 1 } },
      ]),

      Booking.aggregate([
        { $match: { bookingStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: '$service', bookings: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
        { $sort: { bookings: -1 } },
        { $limit: 5 },
        { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
        { $unwind: '$service' },
        { $project: { serviceName: '$service.serviceName', category: '$service.category', bookings: 1, revenue: 1 } },
      ]),

      Review.aggregate([{ $group: { _id: '$rating', count: { $sum: 1 } } }]),
    ]);

    const statusMap = { Pending: 0, Confirmed: 0, Cancelled: 0, Completed: 0 };
    bookingsByStatus.forEach((s) => { statusMap[s._id] = s.count; });

    const ratingMap = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratingDistribution.forEach((r) => { ratingMap[r._id] = r.count; });

    const monthLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueTimeline = revenueByMonth.map((m) => ({
      label: `${monthLabels[m._id.month - 1]} ${m._id.year}`,
      revenue: m.revenue,
      bookings: m.bookings,
    }));

    res.json({
      success: true,
      data: {
        totals: {
          users: totalUsers,
          destinations: totalDestinations,
          services: totalServices,
          bookings: totalBookings,
          reviews: totalReviews,
          trips: totalTrips,
          revenue: revenueAgg[0]?.total || 0,
        },
        bookingsByStatus: statusMap,
        revenueTimeline,
        topDestinations: topDestinationsByFavorite,
        topServices: topServicesByBookings,
        ratingDistribution: ratingMap,
      },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/admin/users  (admin only)
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json({ success: true, count: users.length, data: users });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/admin/users/:id/role  (admin only)
export const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: "Role must be 'user' or 'admin'" });
    }
    if (req.params.id === req.user._id.toString() && role !== 'admin') {
      return res.status(400).json({ success: false, message: 'You cannot remove your own admin access' });
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

// DELETE /api/admin/users/:id  (admin only)
export const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own account from the admin panel' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, message: 'User deleted' });
  } catch (err) {
    next(err);
  }
};