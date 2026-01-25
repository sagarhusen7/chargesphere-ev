// Mock data for EV charging stations
export const chargingStations = [
  {
    id: 1,
    name: "ChargeSphere Downtown Hub",
    type: "charging",
    location: { lat: 40.7128, lng: -74.0060 },
    address: "123 Main St, New York, NY 10001",
    chargerTypes: ["Fast DC", "Level 2 AC"],
    availability: "available",
    totalSlots: 8,
    availableSlots: 5,
    pricing: "$0.35/kWh",
    rating: 4.8,
    amenities: ["WiFi", "Restroom", "Cafe"],
    power: "150 kW",
    connectorTypes: ["CCS", "CHAdeMO", "Type 2"]
  },
  {
    id: 2,
    name: "PowerCharge Station",
    type: "charging",
    location: { lat: 40.7589, lng: -73.9851 },
    address: "456 Broadway, New York, NY 10013",
    chargerTypes: ["Fast DC", "Ultra-Fast DC"],
    availability: "available",
    totalSlots: 6,
    availableSlots: 2,
    pricing: "$0.42/kWh",
    rating: 4.6,
    amenities: ["WiFi", "Shopping"],
    power: "350 kW",
    connectorTypes: ["CCS", "Type 2"]
  },
  {
    id: 3,
    name: "GreenCharge Plaza",
    type: "charging",
    location: { lat: 40.7580, lng: -73.9855 },
    address: "789 Times Square, New York, NY 10036",
    chargerTypes: ["Level 2 AC"],
    availability: "busy",
    totalSlots: 4,
    availableSlots: 1,
    pricing: "$0.28/kWh",
    rating: 4.5,
    amenities: ["Covered Parking", "Security"],
    power: "22 kW",
    connectorTypes: ["Type 2", "Type 1"]
  },
  {
    id: 4,
    name: "EcoCharge Center",
    type: "charging",
    location: { lat: 40.7614, lng: -73.9776 },
    address: "321 Park Ave, New York, NY 10022",
    chargerTypes: ["Fast DC", "Level 2 AC"],
    availability: "available",
    totalSlots: 10,
    availableSlots: 8,
    pricing: "$0.38/kWh",
    rating: 4.9,
    amenities: ["WiFi", "Restroom", "Cafe", "Shopping"],
    power: "150 kW",
    connectorTypes: ["CCS", "CHAdeMO", "Type 2"]
  },
  {
    id: 5,
    name: "VoltHub Station",
    type: "charging",
    location: { lat: 40.7489, lng: -73.9680 },
    address: "555 5th Ave, New York, NY 10017",
    chargerTypes: ["Fast DC"],
    availability: "full",
    totalSlots: 5,
    availableSlots: 0,
    pricing: "$0.40/kWh",
    rating: 4.4,
    amenities: ["WiFi", "Security"],
    power: "120 kW",
    connectorTypes: ["CCS"]
  },
  {
    id: 6,
    name: "ChargePoint Express",
    type: "charging",
    location: { lat: 40.7411, lng: -74.0047 },
    address: "888 Hudson St, New York, NY 10014",
    chargerTypes: ["Ultra-Fast DC", "Fast DC"],
    availability: "available",
    totalSlots: 12,
    availableSlots: 9,
    pricing: "$0.45/kWh",
    rating: 4.7,
    amenities: ["WiFi", "Restroom", "Shopping", "Restaurant"],
    power: "350 kW",
    connectorTypes: ["CCS", "Type 2"]
  },
  {
    id: 7,
    name: "Tesla Supercharger",
    type: "charging",
    location: { lat: 40.7580, lng: -74.0020 },
    address: "999 West Side Hwy, New York, NY 10001",
    chargerTypes: ["Tesla Supercharger V3"],
    availability: "available",
    totalSlots: 16,
    availableSlots: 12,
    pricing: "$0.48/kWh",
    rating: 4.9,
    amenities: ["WiFi", "Lounge", "Restroom"],
    power: "250 kW",
    connectorTypes: ["Tesla"]
  },
  {
    id: 8,
    name: "EV Station Plus",
    type: "charging",
    location: { lat: 40.7305, lng: -73.9925 },
    address: "147 Canal St, New York, NY 10013",
    chargerTypes: ["Level 2 AC", "Fast DC"],
    availability: "available",
    totalSlots: 6,
    availableSlots: 4,
    pricing: "$0.32/kWh",
    rating: 4.3,
    amenities: ["Covered Parking"],
    power: "50 kW",
    connectorTypes: ["CCS", "Type 2", "Type 1"]
  }
];

// Helper function to filter stations
export const filterStations = (stations, filters) => {
  return stations.filter(station => {
    // Filter by availability
    if (filters.availability && filters.availability !== 'all') {
      if (station.availability !== filters.availability) return false;
    }

    // Filter by charger type
    if (filters.chargerType && filters.chargerType !== 'all') {
      if (!station.chargerTypes.some(type => type.toLowerCase().includes(filters.chargerType.toLowerCase()))) {
        return false;
      }
    }

    return true;
  });
};

// Helper function to get station by ID
export const getStationById = (id) => {
  return chargingStations.find(station => station.id === id);
};
