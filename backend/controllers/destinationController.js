import Destination from '../models/Destination.js';

export const getDestinations = async (req, res, next) => {
  try {
    const { category, search, featured, minRating, sort } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { location: { $regex: search, $options: 'i' } },
        { category: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    let sortOption = { popularity: -1 };
    if (sort === 'rating') sortOption = { rating: -1 };
    else if (sort === 'name') sortOption = { name: 1 };
    else if (sort === 'newest') sortOption = { createdAt: -1 };

    const destinations = await Destination.find(filter).sort(sortOption);
    res.json({ success: true, count: destinations.length, data: destinations });
  } catch (err) {
    next(err);
  }
};

export const getDestinationById = async (req, res, next) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

export const createDestination = async (req, res, next) => {
  try {
    const destination = await Destination.create(req.body);
    res.status(201).json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

export const updateDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, data: destination });
  } catch (err) {
    next(err);
  }
};

export const deleteDestination = async (req, res, next) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) return res.status(404).json({ success: false, message: 'Destination not found' });
    res.json({ success: true, message: 'Destination deleted' });
  } catch (err) {
    next(err);
  }
};