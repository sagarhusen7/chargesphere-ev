// Navigation utility functions

/**
 * Open Google Maps with directions to a location
 */
export const navigateToStation = (station, userLocation = null) => {
  const destination = encodeURIComponent(`${station.lat},${station.lng}`);

  let url;
  if (userLocation) {
    const origin = encodeURIComponent(`${userLocation.lat},${userLocation.lng}`);
    url = `https://www.google.com/maps/dir/${origin}/${destination}`;
  } else {
    url = `https://www.google.com/maps/search/?api=1&query=${destination}`;
  }

  window.open(url, '_blank');
};

/**
 * Calculate estimated time of arrival (ETA) in minutes
 */
export const calculateETA = (distance, averageSpeed = 50) => {
  // distance in km, speed in km/h
  const hours = distance / averageSpeed;
  return Math.round(hours * 60); // return minutes
};

/**
 * Format ETA for display
 */
export const formatETA = (minutes) => {
  if (minutes < 60) {
    return `${minutes} min`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

/**
 * Get navigation apps available on device
 */
export const getAvailableNavApps = () => {
  return [
    { name: 'Google Maps', id: 'google' },
    { name: 'Waze', id: 'waze' },
    { name: 'Apple Maps', id: 'apple' }
  ];
};

/**
 * Open specific navigation app
 */
export const openNavApp = (appId, station, userLocation = null) => {
  const lat = station.lat;
  const lng = station.lng;

  let url;

  switch (appId) {
    case 'google':
      if (userLocation) {
        url = `https://www.google.com/maps/dir/${userLocation.lat},${userLocation.lng}/${lat},${lng}`;
      } else {
        url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
      }
      break;

    case 'waze':
      url = `https://waze.com/ul?ll=${lat},${lng}&navigate=yes`;
      break;

    case 'apple':
      if (userLocation) {
        url = `http://maps.apple.com/?saddr=${userLocation.lat},${userLocation.lng}&daddr=${lat},${lng}`;
      } else {
        url = `http://maps.apple.com/?daddr=${lat},${lng}`;
      }
      break;

    default:
      url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  }

  window.open(url, '_blank');
};
