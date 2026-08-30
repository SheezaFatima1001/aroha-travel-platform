import mongoose from 'mongoose';
import User from '../models/User.js';
import Trip from '../models/Trip.js';
import Booking from '../models/Booking.js';
import Destination from '../models/Destination.js';

export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const { name, bio, profileImage } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: { ...(name && { name }), ...(bio !== undefined && { bio }), ...(profileImage !== undefined && { profileImage }) } },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: user });
  } catch (err) {
    next(err);
  }
};

export const addFavorite = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.destinationId);
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found' });
    }
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { favorites: req.params.destinationId } },
      { new: true }
    ).populate('favorites');
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

export const removeFavorite = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { favorites: req.params.destinationId } },
      { new: true }
    ).populate('favorites');
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

export const getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ success: true, data: user.favorites });
  } catch (err) {
    next(err);
  }
};

export const addRecentlyViewed = async (req, res, next) => {
  try {
    const { destinationId } = req.params;

    // Single atomic pipeline update: filter out any existing entry for this
    // destination, then prepend a fresh one and cap at 10. Doing this as one
    // aggregation-pipeline update (rather than a separate $pull then $push)
    // avoids a race condition where two near-simultaneous requests (e.g. from
    // React StrictMode's double-invoked effects in development) can both
    // "remove" before either "adds", resulting in duplicate entries.
    const user = await User.findByIdAndUpdate(
      req.user._id,
      [
        {
          $set: {
            recentlyViewed: {
              $concatArrays: [
                [{ destination: new mongoose.Types.ObjectId(destinationId), viewedAt: new Date() }],
                {
                  $slice: [
                    {
                      $filter: {
                        input: '$recentlyViewed',
                        cond: { $ne: ['$$this.destination', new mongoose.Types.ObjectId(destinationId)] },
                      },
                    },
                    9,
                  ],
                },
              ],
            },
          },
        },
      ],
      { new: true }
    ).populate('recentlyViewed.destination');

    res.json({ success: true, data: user.recentlyViewed });
  } catch (err) {
    next(err);
  }
};

export const getDashboard = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('favorites')
      .populate('recentlyViewed.destination');

    const [trips, bookings, featured] = await Promise.all([
      Trip.find({ user: req.user._id }),
      Booking.find({ user: req.user._id }),
      Destination.find({ featured: true }).limit(6),
    ]);

    res.json({
      success: true,
      data: {
        user: { name: user.name, email: user.email, profileImage: user.profileImage, bio: user.bio },
        favorites: user.favorites,
        recentlyViewed: user.recentlyViewed,
        featuredRecommendations: featured,
        stats: {
          favoritesCount: user.favorites.length,
          tripsCount: trips.length,
          bookingsCount: bookings.length,
          recentlyViewedCount: user.recentlyViewed.length,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};