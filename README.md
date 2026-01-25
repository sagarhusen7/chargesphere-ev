# ChargeSphere - EV Charging Station Locator & Booking Platform

A modern, comprehensive web application for finding EV charging stations, booking charging slots, and renting vehicles. Built with React, Tailwind CSS, and Leaflet for interactive mapping.

## Features

### 🔋 EV Charging Station Locator
- Interactive map showing nearby charging stations
- Real-time availability status
- Filter by charger type, distance, and availability
- Detailed station information (pricing, amenities, ratings)

### ⛽ Fuel Station Finder
- Locate traditional fuel/petrol stations
- View fuel prices and station amenities
- Map-based visualization

### 📅 Booking System
- Book EV charging slots in advance
- Select date, time, and duration
- Instant booking confirmation
- Booking reference tracking

### 🚗 Vehicle Rental
- Browse electric and traditional vehicles
- Filter by type, category, and availability
- Detailed vehicle specifications
- Easy rental booking with cost calculation

### 🗺️ Interactive Map
- OpenStreetMap integration (no API keys required)
- User location detection
- Custom markers for different station types
- Smooth zoom and navigation

## Tech Stack

- **Frontend**: React 18.3+ with Vite
- **Styling**: Tailwind CSS 3.4+
- **Maps**: Leaflet & React-Leaflet (OpenStreetMap)
- **Icons**: Lucide React
- **Router**: React Router DOM

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository or navigate to the project directory

2. Install dependencies:
```bash
npm install
```

Or if you encounter peer dependency issues:
```bash
npm install --legacy-peer-deps
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The optimized build will be in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
chargesphere/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── HeroSection.jsx
│   │   ├── InteractiveMap.jsx
│   │   ├── SearchFilters.jsx
│   │   ├── StationList.jsx
│   │   ├── BookingForm.jsx
│   │   ├── VehicleCard.jsx
│   │   └── RentalBookingForm.jsx
│   ├── pages/              # Main page components
│   │   ├── MapPage.jsx
│   │   └── RentalPage.jsx
│   ├── data/               # Mock data files
│   │   ├── chargingStations.js
│   │   ├── fuelStations.js
│   │   └── vehicles.js
│   ├── hooks/              # Custom React hooks
│   │   └── useGeolocation.js
│   ├── utils/              # Utility functions
│   │   └── calculateDistance.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── index.html
├── package.json
├── vite.config.js
├── tailwind.config.js
└── postcss.config.js
```

## Features Breakdown

### Map Integration
- Uses Leaflet with OpenStreetMap tiles (completely free, no API key needed)
- Custom markers for EV charging stations, fuel stations, and user location
- Interactive popups with station details and booking buttons
- Real-time distance calculation from user location

### Booking System
- Multi-step booking form with validation
- Date/time selection with minimum date constraints
- Vehicle information capture
- Booking confirmation with reference number
- Email confirmation (frontend simulation)

### Vehicle Rental
- Vehicle cards with images, specifications, and pricing
- Filter by type (EV/Non-EV), category, and availability
- Rental booking with duration and cost calculation
- Pickup/return date and location selection

### Responsive Design
- Mobile-first approach
- Hamburger menu for mobile navigation
- Responsive grid layouts
- Touch-friendly interactive elements
- Optimized for tablets and desktops

## Data

Currently using mock data for:
- 8 EV charging stations in New York City
- 6 Fuel/petrol stations
- 10 Rental vehicles (6 EVs, 4 Non-EVs)

To integrate with a real backend:
1. Replace mock data imports with API calls
2. Update booking forms to POST to your backend
3. Add authentication if needed

## Customization

### Color Scheme
Edit `tailwind.config.js` to customize the color palette:
- `primary`: Electric blue theme
- `electric`: Green/cyan accents
- `dark`: Dark background colors

### Map Tiles
To use different map tiles, update the `TileLayer` URL in `InteractiveMap.jsx`

### Add More Stations
Edit files in `src/data/` to add more stations or vehicles

## Browser Support

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Performance

- Lazy loading for images
- Optimized bundle size with Vite
- Efficient re-rendering with React best practices
- Smooth animations with CSS transitions

## License

This project is open source and available under the MIT License.

## Support

For issues or questions, please create an issue in the repository.

---

Built with ❤️ for sustainable transportation
