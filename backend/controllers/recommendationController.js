import User from '../models/User.js';
import Destination from '../models/Destination.js';
import Service from '../models/Service.js';
import Booking from '../models/Booking.js';
import { scoreDestination, scoreService, hasAnyPreferences } from '../utils/recommendationEngine.js';

const DEFAULT_LIMIT = 12;

// GET /api/recommendations/destinations?limit=12
export const getDestinationRecommendations = async (req, res, next) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || DEFAULT_LIMIT);

    const user = await User.findById(req.user._id).populate('favorites').populate('recentlyViewed.destination');
    const allDestinations = await Destination.find();

    if (allDestinations.length === 0) {
      return res.json({ success: true, count: 0, personalized: false, data: [] });
    }

    // Build an "affinity" set from past behavior: categories the user has
    // already shown interest in via favorites or recently-viewed destinations.
    const affinityCategories = new Set();
    user.favorites?.forEach((d) => d?.category && affinityCategories.add(d.category));
    user.recentlyViewed?.forEach((r) => r.destination?.category && affinityCategories.add(r.destination.category));

    const personalized = hasAnyPreferences(user.preferences) || affinityCategories.size > 0;

    let scored = allDestinations.map((d) => {
      const { score, matchPercent, reasons } = scoreDestination(d, user.preferences, affinityCategories);
      return { destination: d, score, matchPercent, reasons };
    });

    if (personalized) {
      // Only surface destinations that actually matched something
      scored = scored.filter((s) => s.score > 0);
    }

    // Cold start / no signal at all: fall back to popularity + rating so the
    // page never shows a hard empty state for a brand-new user.
    if (scored.length === 0) {
      scored = allDestinations
        .slice()
        .sort((a, b) => b.popularity - a.popularity || b.rating - a.rating)
        .map((d) => ({
          destination: d,
          score: 0,
          matchPercent: 0,
          reasons: ['Popular with other travelers'],
        }));
    } else {
      scored.sort((a, b) => b.score - a.score || b.destination.popularity - a.destination.popularity);
    }

    const data = scored.slice(0, limit).map((s) => ({
      ...s.destination.toObject(),
      matchPercent: s.matchPercent,
      reasons: s.reasons,
    }));

    res.json({ success: true, count: data.length, personalized, data });
  } catch (err) {
    next(err);
  }
};

// GET /api/recommendations/services?limit=12
export const getServiceRecommendations = async (req, res, next) => {
  try {
    const limit = Math.min(50, Number(req.query.limit) || DEFAULT_LIMIT);

    const user = await User.findById(req.user._id);
    const allServices = await Service.find({ availability: true });

    if (allServices.length === 0) {
      return res.json({ success: true, count: 0, personalized: false, data: [] });
    }

    const pastBookings = await Booking.find({ user: req.user._id }).populate('service');
    const affinityCategories = new Set();
    pastBookings.forEach((b) => b.service?.category && affinityCategories.add(b.service.category));

    const personalized = hasAnyPreferences(user.preferences) || affinityCategories.size > 0;

    let scored = allServices.map((s) => {
      const { score, matchPercent, reasons } = scoreService(s, user.preferences, affinityCategories);
      return { service: s, score, matchPercent, reasons };
    });

    if (personalized) {
      scored = scored.filter((s) => s.score > 0);
    }

    if (scored.length === 0) {
      scored = allServices
        .slice()
        .sort((a, b) => b.rating - a.rating)
        .map((s) => ({
          service: s,
          score: 0,
          matchPercent: 0,
          reasons: ['Highly rated by other travelers'],
        }));
    } else {
      scored.sort((a, b) => b.score - a.score || b.service.rating - a.service.rating);
    }

    const data = scored.slice(0, limit).map((s) => ({
      ...s.service.toObject(),
      matchPercent: s.matchPercent,
      reasons: s.reasons,
    }));

    res.json({ success: true, count: data.length, personalized, data });
  } catch (err) {
    next(err);
  }
};