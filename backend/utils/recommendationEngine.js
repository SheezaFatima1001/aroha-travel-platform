// Rule-based recommendation engine.
//
// This is intentionally NOT a machine-learning model - it's a transparent,
// explainable scoring system: user preferences + existing data + simple
// business rules => a ranked list with a percentage match and a human
// readable reason. That transparency is the point: every point awarded
// can be traced back to a specific rule.

const TRAVEL_STYLE_TO_DESTINATION_CATEGORY = {
  Adventure: ['Adventure', 'Mountains', 'Nature'],
  Relaxation: ['Beaches', 'Nature', 'Luxury'],
  Cultural: ['Historical', 'Cultural', 'Religious'],
  Family: ['Cities', 'Nature', 'Historical'],
  Luxury: ['Luxury', 'Cities'],
};

const TRAVEL_STYLE_TO_SERVICE_CATEGORY = {
  Adventure: ['Activities', 'Tours', 'Guides', 'Transport'],
  Relaxation: ['Hotels', 'Packages'],
  Cultural: ['Tours', 'Packages', 'Guides'],
  Family: ['Packages', 'Hotels', 'Transport'],
  Luxury: ['Hotels', 'Packages'],
};

// Business-rule proxy: since Destination has no price field, we assign each
// category a typical budget tier so the "matching budget = +2" rule still
// applies to destinations, not just services.
const CATEGORY_BUDGET_TIER = {
  Mountains: 'Mid-range',
  Adventure: 'Mid-range',
  Nature: 'Budget',
  Cities: 'Mid-range',
  Historical: 'Budget',
  Cultural: 'Budget',
  Religious: 'Budget',
  Luxury: 'Luxury',
  Beaches: 'Mid-range',
};

const SERVICE_BUDGET_PRICE_RANGE = {
  Budget: [0, 50],
  'Mid-range': [51, 150],
  Luxury: [151, Infinity],
};

// Business-rule proxy: typical ideal trip length per destination category,
// used to score the "matching duration = +1" rule.
const CATEGORY_DURATION_RANGE = {
  Mountains: [5, 10],
  Adventure: [4, 8],
  Nature: [3, 6],
  Cities: [2, 4],
  Historical: [1, 3],
  Cultural: [2, 4],
  Religious: [1, 2],
  Luxury: [3, 5],
  Beaches: [3, 6],
};

const MAX_DESTINATION_SCORE = 3 + 3 + 2 + 1 + 2; // category + style + budget + duration + personalization
const MAX_SERVICE_SCORE = 3 + 2 + 2 + 1 + 2; // style + location + budget + duration-proxy + personalization

const locationMatches = (haystack, needle) => {
  if (!needle) return false;
  return haystack?.toLowerCase().includes(needle.trim().toLowerCase());
};

/**
 * @param {object} destination - Mongoose Destination document (lean or hydrated)
 * @param {object} prefs - user.preferences
 * @param {Set<string>} affinityCategories - categories the user has favorited/viewed before
 */
export function scoreDestination(destination, prefs, affinityCategories = new Set()) {
  let score = 0;
  const reasons = [];

  if (prefs?.preferredCategory && destination.category === prefs.preferredCategory) {
    score += 3;
    reasons.push(`matches your preferred category (${destination.category})`);
  } else if (prefs?.travelStyle && TRAVEL_STYLE_TO_DESTINATION_CATEGORY[prefs.travelStyle]?.includes(destination.category)) {
    score += 3;
    reasons.push(`fits your ${prefs.travelStyle.toLowerCase()} travel style`);
  }

  if (prefs?.preferredLocation && locationMatches(`${destination.country} ${destination.location}`, prefs.preferredLocation)) {
    score += 2;
    reasons.push(`located in ${prefs.preferredLocation}, your preferred location`);
  }

  if (prefs?.budget && CATEGORY_BUDGET_TIER[destination.category] === prefs.budget) {
    score += 2;
    reasons.push(`fits your ${prefs.budget.toLowerCase()} budget`);
  }

  if (prefs?.tripDuration) {
    const range = CATEGORY_DURATION_RANGE[destination.category];
    if (range && prefs.tripDuration >= range[0] && prefs.tripDuration <= range[1]) {
      score += 1;
      reasons.push(`good fit for a ${prefs.tripDuration}-day trip`);
    }
  }

  if (affinityCategories.has(destination.category)) {
    score += 2;
    reasons.push('similar to destinations you\u2019ve saved or viewed before');
  }

  const matchPercent = Math.min(100, Math.round((score / MAX_DESTINATION_SCORE) * 100));
  return { score, matchPercent, reasons };
}

/**
 * @param {object} service - Mongoose Service document
 * @param {object} prefs - user.preferences
 * @param {Set<string>} affinityCategories - service categories from the user's past bookings
 */
export function scoreService(service, prefs, affinityCategories = new Set()) {
  let score = 0;
  const reasons = [];

  if (prefs?.travelStyle && TRAVEL_STYLE_TO_SERVICE_CATEGORY[prefs.travelStyle]?.includes(service.category)) {
    score += 3;
    reasons.push(`fits your ${prefs.travelStyle.toLowerCase()} travel style`);
  }

  if (prefs?.preferredLocation && locationMatches(service.location, prefs.preferredLocation)) {
    score += 2;
    reasons.push(`located in ${prefs.preferredLocation}, your preferred location`);
  }

  if (prefs?.budget) {
    const [min, max] = SERVICE_BUDGET_PRICE_RANGE[prefs.budget] || [0, Infinity];
    if (service.price >= min && service.price <= max) {
      score += 2;
      reasons.push(`priced within your ${prefs.budget.toLowerCase()} budget`);
    }
  }

  if (prefs?.tripDuration && prefs.tripDuration >= 3 && service.category === 'Packages') {
    score += 1;
    reasons.push('a multi-day package suited to your trip length');
  }

  if (affinityCategories.has(service.category)) {
    score += 2;
    reasons.push('similar to services you\u2019ve booked before');
  }

  const matchPercent = Math.min(100, Math.round((score / MAX_SERVICE_SCORE) * 100));
  return { score, matchPercent, reasons };
}

export const hasAnyPreferences = (prefs) =>
  Boolean(prefs && (prefs.budget || prefs.travelStyle || prefs.preferredCategory || prefs.preferredLocation || prefs.tripDuration));