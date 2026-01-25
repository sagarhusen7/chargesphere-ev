/**
 * Open Charge Map API Service
 * Documentation: https://openchargemap.org/site/develop/api
 * Using CORS proxy to avoid browser CORS restrictions
 */

// Use more reliable CORS proxy
const CORS_PROXY = 'https://api.allorigins.win/raw?url=';
// Fallback proxies if primary fails
const FALLBACK_PROXIES = [
  'https://corsproxy.org/?',
  'https://corsproxy.io/?'
];

const BASE_URL = 'https://api.openchargemap.io/v3/poi';

/**
 * Fetch charging stations from Open Charge Map API with retry logic
 * @param {number} latitude - User's latitude
 * @param {number} longitude - User's longitude
 * @param {number} distance - Search radius in km (default: 25)
 * @param {number} maxResults - Maximum number of results (default: 50)
 * @returns {Promise<Array>} Array of charging stations
 */
export const fetchChargingStations = async (latitude, longitude, distance = 25, maxResults = 50) => {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    distance: distance.toString(),
    maxresults: maxResults.toString(),
    compact: 'true',
    verbose: 'false',
    output: 'json'
  });

  const apiUrl = `${BASE_URL}?${params}`;
  
  // Try primary proxy first
  const proxies = [CORS_PROXY, ...FALLBACK_PROXIES];
  
  for (let i = 0; i < proxies.length; i++) {
    try {
      const proxiedUrl = `${proxies[i]}${encodeURIComponent(apiUrl)}`;
      
      console.log(`🔄 Attempt ${i + 1}/${proxies.length}: Fetching from Open Charge Map...`);
      console.log(`📍 Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}, Radius: ${distance}km`);

      const response = await fetch(proxiedUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        },
        signal: AbortSignal.timeout(10000) // 10 second timeout
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      const transformedData = transformAPIResponse(data);
      
      console.log(`✅ Success! Found ${transformedData.length} charging stations`);
      return transformedData;
      
    } catch (error) {
      console.warn(`⚠️ Proxy ${i + 1} failed:`, error.message);
      
      // If this was the last proxy, throw the error
      if (i === proxies.length - 1) {
        console.error('❌ All proxies failed. Unable to fetch charging stations.');
        throw new Error(`Failed to fetch stations after ${proxies.length} attempts: ${error.message}`);
      }
      
      // Otherwise, continue to next proxy
      console.log(`🔄 Trying fallback proxy ${i + 2}...`);
    }
  }
};

/**
 * Transform Open Charge Map API response to our app's format
 * @param {Array} apiData - Raw API response
 * @returns {Array} Transformed station data
 */
const transformAPIResponse = (apiData) => {
  if (!Array.isArray(apiData)) return [];

  return apiData.map((station, index) => {
    // Extract connection types (charger types)
    const connections = station.Connections || [];
    const chargerTypes = connections
      .map(conn => {
        const level = conn.Level?.Title || '';
        const power = conn.PowerKW ? `${conn.PowerKW}kW` : '';
        if (level && power) return `${level} (${power})`;
        return level || power || 'Standard';
      })
      .filter(Boolean)
      .slice(0, 3); // Limit to 3 types

    // Calculate available slots (estimate based on number of connections)
    const totalSlots = connections.reduce((sum, conn) => sum + (conn.Quantity || 1), 0) || 1;

    // Estimate availability (random for now since API doesn't provide real-time)
    const availableSlots = Math.max(1, Math.floor(totalSlots * (0.3 + Math.random() * 0.5)));

    // Determine availability status
    let availability = 'available';
    if (availableSlots === 0) availability = 'full';
    else if (availableSlots / totalSlots < 0.3) availability = 'busy';

    // Get pricing info (if available)
    const usageCost = station.UsageCost || 'Pricing varies';

    // Get connector types
    const connectorTypes = connections
      .map(conn => conn.ConnectionType?.Title)
      .filter(Boolean)
      .filter((v, i, a) => a.indexOf(v) === i) // unique
      .slice(0, 3);

    return {
      id: station.ID || `station-${index}`,
      name: station.AddressInfo?.Title || `Charging Station ${index + 1}`,
      type: 'charging',
      location: {
        lat: station.AddressInfo?.Latitude || 0,
        lng: station.AddressInfo?.Longitude || 0
      },
      address: formatAddress(station.AddressInfo),
      chargerTypes: chargerTypes.length > 0 ? chargerTypes : ['Standard Charger'],
      availability: availability,
      totalSlots: totalSlots,
      availableSlots: availableSlots,
      pricing: usageCost,
      rating: 4.0 + Math.random() * 0.9, // Generate rating 4.0-4.9 (API doesn't provide ratings)
      amenities: extractAmenities(station),
      power: connections[0]?.PowerKW ? `${connections[0].PowerKW} kW` : 'Standard',
      connectorTypes: connectorTypes.length > 0 ? connectorTypes : ['Type 2'],
      operator: station.OperatorInfo?.Title || 'Independent',
      networkName: station.OperatorInfo?.WebsiteURL || '',
      statusType: station.StatusType?.Title || 'Operational'
    };
  });
};

/**
 * Format address from API response
 */
const formatAddress = (addressInfo) => {
  if (!addressInfo) return 'Address not available';

  const parts = [
    addressInfo.AddressLine1,
    addressInfo.Town,
    addressInfo.StateOrProvince,
    addressInfo.Postcode
  ].filter(Boolean);

  return parts.join(', ') || 'Address not available';
};

/**
 * Extract amenities from station data
 */
const extractAmenities = (station) => {
  const amenities = [];

  if (station.GeneralComments?.toLowerCase().includes('wifi')) {
    amenities.push('WiFi');
  }
  if (station.GeneralComments?.toLowerCase().includes('restroom')) {
    amenities.push('Restroom');
  }
  if (station.UsageType?.Title === '24/7') {
    amenities.push('24/7 Access');
  }
  if (station.AddressInfo?.AccessComments?.toLowerCase().includes('covered')) {
    amenities.push('Covered Parking');
  }

  return amenities;
};

/**
 * Fetch stations by country code
 */
export const fetchStationsByCountry = async (countryCode, maxResults = 100) => {
  try {
    const params = new URLSearchParams({
      countrycode: countryCode,
      maxresults: maxResults.toString(),
      compact: 'true',
      output: 'json'
    });

    const response = await fetch(`${BASE_URL}?${params}`);

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status}`);
    }

    const data = await response.json();
    return transformAPIResponse(data);
  } catch (error) {
    console.error('Error fetching stations by country:', error);
    throw error;
  }
};
