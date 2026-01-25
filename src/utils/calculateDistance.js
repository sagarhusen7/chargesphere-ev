/**
 * Calculate distance between two coordinates using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} - Distance in kilometers
 */
export const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in kilometers
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal place
};

/**
 * Convert degrees to radians
 * @param {number} degrees
 * @returns {number} - Radians
 */
const toRad = (degrees) => {
  return degrees * (Math.PI / 180);
};

/**
 * Format distance for display
 * @param {number} distance - Distance in kilometers
 * @returns {string} - Formatted distance string
 */
export const formatDistance = (distance) => {
  if (distance < 1) {
    return `${Math.round(distance * 1000)} m`;
  }
  return `${distance} km`;
};

/**
 * Calculate distance and add it to each station
 * @param {array} stations - Array of station objects
 * @param {object} userLocation - User's current location {lat, lng}
 * @returns {array} - Stations with distance property added
 */
export const addDistanceToStations = (stations, userLocation) => {
  if (!userLocation) return stations;

  return stations.map(station => ({
    ...station,
    distance: calculateDistance(
      userLocation.lat,
      userLocation.lng,
      station.location.lat,
      station.location.lng
    )
  }));
};

/**
 * Sort stations by distance from user location
 * @param {array} stations - Array of station objects
 * @returns {array} - Sorted stations
 */
export const sortStationsByDistance = (stations) => {
  return [...stations].sort((a, b) => (a.distance || 0) - (b.distance || 0));
};
