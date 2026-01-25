// Mock data for rental vehicles
export const rentalVehicles = [
  {
    id: 201,
    name: "Tesla Model 3",
    type: "EV",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&auto=format&fit=crop",
    specifications: {
      range: "358 miles",
      seats: 5,
      acceleration: "0-60 mph in 3.1s",
      topSpeed: "162 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$15/hour",
      daily: "$89/day",
      weekly: "$550/week"
    },
    availability: "available",
    rating: 4.9,
    features: ["Autopilot", "Premium Audio", "Glass Roof", "Heated Seats"],
    location: "New York, NY"
  },
  {
    id: 202,
    name: "Tesla Model Y",
    type: "EV",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?w=800&auto=format&fit=crop",
    specifications: {
      range: "330 miles",
      seats: 7,
      acceleration: "0-60 mph in 3.5s",
      topSpeed: "155 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$18/hour",
      daily: "$109/day",
      weekly: "$680/week"
    },
    availability: "available",
    rating: 4.8,
    features: ["Autopilot", "Third Row Seats", "Panoramic Roof", "Premium Audio"],
    location: "New York, NY"
  },
  {
    id: 203,
    name: "Chevrolet Bolt EV",
    type: "EV",
    category: "Hatchback",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop",
    specifications: {
      range: "259 miles",
      seats: 5,
      acceleration: "0-60 mph in 6.5s",
      topSpeed: "93 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$12/hour",
      daily: "$65/day",
      weekly: "$390/week"
    },
    availability: "available",
    rating: 4.5,
    features: ["Backup Camera", "Apple CarPlay", "Android Auto", "Heated Seats"],
    location: "New York, NY"
  },
  {
    id: 204,
    name: "Ford Mustang Mach-E",
    type: "EV",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop",
    specifications: {
      range: "314 miles",
      seats: 5,
      acceleration: "0-60 mph in 3.5s",
      topSpeed: "111 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$16/hour",
      daily: "$95/day",
      weekly: "$595/week"
    },
    availability: "available",
    rating: 4.7,
    features: ["Panoramic Roof", "B&O Sound", "Co-Pilot360", "Heated Seats"],
    location: "New York, NY"
  },
  {
    id: 205,
    name: "Hyundai Ioniq 5",
    type: "EV",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=800&auto=format&fit=crop",
    specifications: {
      range: "303 miles",
      seats: 5,
      acceleration: "0-60 mph in 4.5s",
      topSpeed: "115 mph",
      charging: "Ultra-fast DC charging"
    },
    pricing: {
      hourly: "$14/hour",
      daily: "$79/day",
      weekly: "$490/week"
    },
    availability: "rented",
    rating: 4.6,
    features: ["Solar Roof", "V2L", "Augmented Reality HUD", "Relaxation Seats"],
    location: "New York, NY"
  },
  {
    id: 206,
    name: "Toyota Camry",
    type: "Non-EV",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=800&auto=format&fit=crop",
    specifications: {
      fuelType: "Gasoline",
      mpg: "32 combined",
      seats: 5,
      acceleration: "0-60 mph in 7.6s",
      topSpeed: "135 mph"
    },
    pricing: {
      hourly: "$10/hour",
      daily: "$55/day",
      weekly: "$330/week"
    },
    availability: "available",
    rating: 4.4,
    features: ["Backup Camera", "Apple CarPlay", "Cruise Control", "Bluetooth"],
    location: "New York, NY"
  },
  {
    id: 207,
    name: "Honda CR-V",
    type: "Non-EV",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop",
    specifications: {
      fuelType: "Gasoline",
      mpg: "30 combined",
      seats: 5,
      acceleration: "0-60 mph in 7.5s",
      topSpeed: "127 mph"
    },
    pricing: {
      hourly: "$12/hour",
      daily: "$69/day",
      weekly: "$410/week"
    },
    availability: "available",
    rating: 4.5,
    features: ["AWD", "Honda Sensing", "Sunroof", "Heated Seats"],
    location: "New York, NY"
  },
  {
    id: 208,
    name: "BMW 3 Series",
    type: "Non-EV",
    category: "Sedan",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&auto=format&fit=crop",
    specifications: {
      fuelType: "Gasoline",
      mpg: "28 combined",
      seats: 5,
      acceleration: "0-60 mph in 5.6s",
      topSpeed: "155 mph"
    },
    pricing: {
      hourly: "$20/hour",
      daily: "$125/day",
      weekly: "$780/week"
    },
    availability: "available",
    rating: 4.8,
    features: ["Sport Package", "Premium Audio", "Navigation", "Leather Seats"],
    location: "New York, NY"
  },
  {
    id: 209,
    name: "Nissan Leaf",
    type: "EV",
    category: "Hatchback",
    image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=800&auto=format&fit=crop",
    specifications: {
      range: "226 miles",
      seats: 5,
      acceleration: "0-60 mph in 7.4s",
      topSpeed: "90 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$11/hour",
      daily: "$59/day",
      weekly: "$350/week"
    },
    availability: "available",
    rating: 4.3,
    features: ["ProPILOT Assist", "e-Pedal", "NissanConnect", "Around View Monitor"],
    location: "New York, NY"
  },
  {
    id: 210,
    name: "Audi e-tron",
    type: "EV",
    category: "SUV",
    image: "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&auto=format&fit=crop",
    specifications: {
      range: "222 miles",
      seats: 5,
      acceleration: "0-60 mph in 5.5s",
      topSpeed: "124 mph",
      charging: "Fast DC charging"
    },
    pricing: {
      hourly: "$22/hour",
      daily: "$139/day",
      weekly: "$870/week"
    },
    availability: "available",
    rating: 4.7,
    features: ["Virtual Cockpit", "Matrix LED", "Air Suspension", "B&O Sound"],
    location: "New York, NY"
  }
];

// Filter vehicles by type
export const filterVehiclesByType = (vehicles, type) => {
  if (type === 'all') return vehicles;
  return vehicles.filter(vehicle => vehicle.type === type);
};

// Filter vehicles by availability
export const filterVehiclesByAvailability = (vehicles, availability) => {
  if (availability === 'all') return vehicles;
  return vehicles.filter(vehicle => vehicle.availability === availability);
};

// Get vehicle by ID
export const getVehicleById = (id) => {
  return rentalVehicles.find(vehicle => vehicle.id === id);
};
