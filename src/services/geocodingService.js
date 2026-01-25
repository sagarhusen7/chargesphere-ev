/**
 * Geocoding Service using Photon (Komoot)
 * Free, fast geocoding API - no key required
 * Documentation: https://photon.komoot.io/
 * Benefits: Faster than Nominatim, better for autocomplete, no rate limits
 */

const PHOTON_BASE_URL = 'https://photon.komoot.io';

/**
 * Search for a location by address/query
 * @param {string} query - Address or location query
 * @returns {Promise<Object>} Location with lat/lng
 */
export const geocodeAddress = async (query) => {
  try {
    const params = new URLSearchParams({
      q: query,
      limit: '1'
    });

    console.log('🔍 Geocoding with Photon:', query);

    const response = await fetch(`${PHOTON_BASE_URL}/api?${params}`);

    if (!response.ok) {
      throw new Error(`Geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.features || data.features.length === 0) {
      throw new Error('Location not found');
    }

    const result = data.features[0];
    const coords = result.geometry.coordinates; // [lng, lat] format
    const props = result.properties;

    // Build display name from properties
    const displayName = props.name
      ? `${props.name}, ${props.city || props.state || props.country || ''}`.replace(/, ,/g, ',').replace(/,$/, '')
      : props.city || props.state || props.country || 'Unknown location';

    console.log('✅ Geocoding successful:', displayName);

    return {
      lat: coords[1], // Photon returns [lng, lat]
      lng: coords[0],
      displayName: displayName,
      address: {
        city: props.city,
        state: props.state,
        country: props.country,
        postcode: props.postcode
      }
    };
  } catch (error) {
    console.error('❌ Geocoding error:', error);
    throw error;
  }
};

/**
 * Reverse geocode - get address from coordinates
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {Promise<Object>} Address details
 */
export const reverseGeocode = async (lat, lng) => {
  try {
    const params = new URLSearchParams({
      lat: lat.toString(),
      lon: lng.toString()
    });

    console.log('🔍 Reverse geocoding with Photon:', lat, lng);

    const response = await fetch(`${PHOTON_BASE_URL}/reverse?${params}`);

    if (!response.ok) {
      throw new Error(`Reverse geocoding failed: ${response.status}`);
    }

    const data = await response.json();

    if (!data || !data.features || data.features.length === 0) {
      throw new Error('Address not found');
    }

    const result = data.features[0];
    const props = result.properties;

    const displayName = props.name
      ? `${props.name}, ${props.city || props.state || props.country || ''}`.replace(/, ,/g, ',').replace(/,$/, '')
      : props.city || props.state || props.country || 'Unknown location';

    console.log('✅ Reverse geocoding successful:', displayName);

    return {
      displayName: displayName,
      address: {
        city: props.city,
        state: props.state,
        country: props.country,
        postcode: props.postcode
      }
    };
  } catch (error) {
    console.error('❌ Reverse geocoding error:', error);
    throw error;
  }
};
