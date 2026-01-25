// Mock data for fuel/petrol stations
export const fuelStations = [
  {
    id: 101,
    name: "Shell Gas Station",
    type: "fuel",
    location: { lat: 40.7282, lng: -74.0776 },
    address: "234 Liberty St, Jersey City, NJ 07302",
    fuelTypes: ["Unleaded", "Premium", "Diesel"],
    availability: "available",
    pricing: {
      unleaded: "$3.45/gal",
      premium: "$3.89/gal",
      diesel: "$3.95/gal"
    },
    rating: 4.2,
    amenities: ["Convenience Store", "Car Wash", "ATM"],
    hours: "24/7"
  },
  {
    id: 102,
    name: "BP Energy Station",
    type: "fuel",
    location: { lat: 40.7450, lng: -73.9880 },
    address: "567 E 34th St, New York, NY 10016",
    fuelTypes: ["Unleaded", "Premium", "Diesel", "E85"],
    availability: "available",
    pricing: {
      unleaded: "$3.52/gal",
      premium: "$3.95/gal",
      diesel: "$4.05/gal",
      e85: "$2.89/gal"
    },
    rating: 4.4,
    amenities: ["Convenience Store", "Restroom", "Air Pump"],
    hours: "24/7"
  },
  {
    id: 103,
    name: "Mobil Gas & Go",
    type: "fuel",
    location: { lat: 40.7614, lng: -73.9642 },
    address: "890 Lexington Ave, New York, NY 10065",
    fuelTypes: ["Unleaded", "Premium", "Diesel"],
    availability: "available",
    pricing: {
      unleaded: "$3.48/gal",
      premium: "$3.92/gal",
      diesel: "$3.98/gal"
    },
    rating: 4.1,
    amenities: ["Convenience Store", "Car Wash", "Vacuum"],
    hours: "6 AM - 11 PM"
  },
  {
    id: 104,
    name: "Chevron Service Center",
    type: "fuel",
    location: { lat: 40.7223, lng: -73.9890 },
    address: "123 Delancey St, New York, NY 10002",
    fuelTypes: ["Unleaded", "Premium", "Diesel"],
    availability: "available",
    pricing: {
      unleaded: "$3.50/gal",
      premium: "$3.93/gal",
      diesel: "$4.00/gal"
    },
    rating: 4.3,
    amenities: ["Convenience Store", "ATM", "Air Pump", "Restroom"],
    hours: "24/7"
  },
  {
    id: 105,
    name: "Exxon Express",
    type: "fuel",
    location: { lat: 40.7690, lng: -73.9810 },
    address: "456 Amsterdam Ave, New York, NY 10024",
    fuelTypes: ["Unleaded", "Premium"],
    availability: "available",
    pricing: {
      unleaded: "$3.55/gal",
      premium: "$3.99/gal"
    },
    rating: 4.0,
    amenities: ["Convenience Store", "Car Wash"],
    hours: "24/7"
  },
  {
    id: 106,
    name: "Sunoco Fuel Stop",
    type: "fuel",
    location: { lat: 40.7350, lng: -74.0028 },
    address: "789 Washington St, New York, NY 10014",
    fuelTypes: ["Unleaded", "Premium", "Diesel"],
    availability: "available",
    pricing: {
      unleaded: "$3.46/gal",
      premium: "$3.88/gal",
      diesel: "$3.96/gal"
    },
    rating: 4.5,
    amenities: ["Convenience Store", "Restroom", "ATM", "Air Pump"],
    hours: "24/7"
  }
];

// Helper function to get fuel station by ID
export const getFuelStationById = (id) => {
  return fuelStations.find(station => station.id === id);
};
