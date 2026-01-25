import { useState, useEffect } from 'react';
import InteractiveMap from '../components/InteractiveMap';
import SearchFilters from '../components/SearchFilters';
import StationList from '../components/StationList';
import TripPlanner from '../components/TripPlanner';
import SmartRecommendations from '../components/SmartRecommendations';
import StationComparison from '../components/StationComparison';
import ReviewModal from '../components/ReviewModal';
import { useGeolocation } from '../hooks/useGeolocation';
import { fetchChargingStations } from '../services/chargingStationAPI';
import { geocodeAddress } from '../services/geocodingService';
import { fuelStations } from '../data/fuelStations';
import { addDistanceToStations, sortStationsByDistance } from '../utils/calculateDistance';
import { MapIcon, AlertCircle, Loader2 } from 'lucide-react';

const MapPage = ({ onBookClick }) => {
  const { position: userLocation, loading: locationLoading } = useGeolocation();
  const [searchLocation, setSearchLocation] = useState(null); // Location from address search
  const [currentLocation, setCurrentLocation] = useState(null); // Active location (user or searched)
  const [allStations, setAllStations] = useState([]);
  const [filteredStations, setFilteredStations] = useState([]);
  const [selectedStation, setSelectedStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchInfo, setSearchInfo] = useState(''); // Info about current search location
  const [filters, setFilters] = useState({
    stationType: 'all',
    chargerType: 'all',
    availability: 'all',
    distance: '25',
    searchQuery: '',
    locationSearch: null
  });
  const [showComparison, setShowComparison] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStation, setReviewStation] = useState(null);
  const [stationReviews, setStationReviews] = useState({}); // Store reviews by station ID

  // Update current location when user location or search location changes
  useEffect(() => {
    if (searchLocation) {
      setCurrentLocation(searchLocation);
    } else if (userLocation) {
      setCurrentLocation(userLocation);
      setSearchInfo('');
    }
  }, [userLocation, searchLocation]);

  // Fetch real-time charging stations when current location is available
  useEffect(() => {
    const loadStations = async () => {
      if (!currentLocation) return;

      setLoading(true);
      setError(null);

      try {
        // Fetch real charging stations from API
        const radius = parseInt(filters.distance) || 25;
        
        console.log('Fetching stations for location:', currentLocation);
        
        const chargingStations = await fetchChargingStations(
          currentLocation.lat,
          currentLocation.lng,
          radius,
          50 // max results
        );

        console.log(`✅ Fetched ${chargingStations.length} real charging stations from API`);

        // Combine with fuel stations (still using mock data)
        const combined = [...chargingStations, ...fuelStations];
        
        // Add distances
        const withDistances = addDistanceToStations(combined, currentLocation);
        const sorted = sortStationsByDistance(withDistances);
        
        setAllStations(sorted);
        setFilteredStations(sorted);
        setLoading(false);
      } catch (err) {
        console.error('⚠️ API Error:', err.message);
        
        // Fallback to mock data from chargingStations.js
        console.log('📦 Using fallback mock data');
        
        try {
          const { chargingStations: mockChargingStations } = await import('../data/chargingStations');
          const combined = [...mockChargingStations, ...fuelStations];
          const withDistances = addDistanceToStations(combined, currentLocation);
          const sorted = sortStationsByDistance(withDistances);
          
          setAllStations(sorted);
          setFilteredStations(sorted);
          setError(`⚠️ Using demo stations - ${err.message || 'API temporarily unavailable'}`);
        } catch (fallbackErr) {
          // If even mock data fails, just show fuel stations
          const withDistances = addDistanceToStations(fuelStations, currentLocation);
          setAllStations(withDistances);
          setFilteredStations(withDistances);
          setError('⚠️ Limited stations available (API temporarily unavailable)');
        }
        
        setLoading(false);
      }
    };

    loadStations();
  }, [currentLocation, filters.distance]);

  // Apply filters
  useEffect(() => {
    let filtered = [...allStations];

    // Filter by station type
    if (filters.stationType !== 'all') {
      filtered = filtered.filter(s => s.type === filters.stationType);
    }

    // Filter by charger type
    if (filters.chargerType !== 'all' && filters.stationType !== 'fuel') {
      filtered = filtered.filter(s => {
        if (s.type !== 'charging') return false;
        const chargerText = s.chargerTypes.join(' ').toLowerCase();
        return chargerText.includes(filters.chargerType.toLowerCase());
      });
    }

    // Filter by availability
    if (filters.availability !== 'all') {
      filtered = filtered.filter(s => s.availability === filters.availability);
    }

    // Filter by distance (already handled in API call, but filter locally too)
    if (filters.distance !== 'all' && currentLocation) {
      const maxDistance = parseFloat(filters.distance);
      filtered = filtered.filter(s => !s.distance || s.distance <= maxDistance);
    }

    // Filter by name/address search query (NOT location search)
    if (filters.searchQuery.trim() !== '' && !filters.locationSearch) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.address.toLowerCase().includes(query)
      );
    }

    setFilteredStations(filtered);
  }, [filters, allStations, currentLocation]);

  const handleFilterChange = async (newFilters) => {
    // Handle location search
    if (newFilters.locationSearch) {
      setLoading(true);
      setError(null);
      
      try {
        console.log('Geocoding address:', newFilters.locationSearch);
        const location = await geocodeAddress(newFilters.locationSearch);
        
        console.log('Geocoded location:', location);
        setSearchLocation(location);
        setSearchInfo(`📍 Searching near: ${location.displayName}`);
        
        // Clear the locationSearch trigger but keep searchQuery
        setFilters({
          ...newFilters,
          locationSearch: null
        });
      } catch (err) {
        console.error('Geocoding error:', err);
        setError(`Could not find location: "${newFilters.locationSearch}". Please try a different search.`);
        setLoading(false);
      }
    } else {
      setFilters(newFilters);
    }
  };

  const handleReset = () => {
    setFilters({
      stationType: 'all',
      chargerType: 'all',
      availability: 'all',
      distance: '25',
      searchQuery: '',
      locationSearch: null
    });
    setSearchLocation(null);
    setSearchInfo('');
  };

  const handleStationSelect = (station) => {
    setSelectedStation(station);
  };

  const handleReviewClick = (station) => {
    setReviewStation(station);
    setShowReviewModal(true);
  };

  const handleReviewSubmit = (reviewData) => {
    // Store review locally (in real app, this would call an API)
    setStationReviews(prev => ({
      ...prev,
      [reviewData.stationId]: [
        ...(prev[reviewData.stationId] || []),
        { ...reviewData, userName: 'Current User', helpfulCount: 0 }
      ]
    }));
    console.log('Review submitted:', reviewData);
  };

  return (
    <section id="map" className="section-container">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-3 rounded-xl">
            <MapIcon className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Find <span className="gradient-text">Charging Stations</span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Real-time EV charging stations and fuel stations near you
        </p>
        {!loading && allStations.length > 0 && (
          <p className="text-sm text-electric-400 mt-2">
            ✨ Showing {allStations.filter(s => s.type === 'charging').length} real charging stations from Open Charge Map
          </p>
        )}
        {searchInfo && (
          <p className="text-sm text-primary-400 mt-1 font-medium">
            {searchInfo}
          </p>
        )}
      </div>

      {/* Error/Warning Message */}
      {error && (
        <div className={`glass-card p-4 mb-6 flex items-center space-x-3 ${
          error.includes('demo stations') || error.includes('Limited stations') 
            ? 'bg-yellow-500/10 border-yellow-500/30' 
            : 'bg-red-500/10 border-red-500/30'
        }`}>
          <AlertCircle className={`w-5 h-5 ${
            error.includes('demo stations') || error.includes('Limited stations')
              ? 'text-yellow-400' 
              : 'text-red-400'
          }`} />
          <p className={
            error.includes('demo stations') || error.includes('Limited stations')
              ? 'text-yellow-300' 
              : 'text-red-300'
          }>{error}</p>
        </div>
      )}

      {/* Smart Recommendations */}
      {!loading && currentLocation && filteredStations.length > 0 && (
        <SmartRecommendations 
          stations={filteredStations}
          userLocation={currentLocation}
          userHistory={[]} // Will be populated from auth context in future
        />
      )}

      {/* Trip Planner */}
      <div className="mb-6">
        <TripPlanner />
      </div>

      {/* Actions Bar */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-white/60 dark:text-gray-400">
            {filteredStations.length} stations found
          </p>
        </div>
        <button
          onClick={() => setShowComparison(true)}
          className="btn-secondary"
          disabled={filteredStations.length === 0}
        >
          Compare Stations
        </button>
      </div>

      {/* Map and Filters Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Filters Sidebar */}
        <div className="lg:col-span-3">
          <SearchFilters 
            onFilterChange={handleFilterChange}
            onReset={handleReset}
          />
        </div>

        {/* Map */}
        <div className="lg:col-span-6 order-first lg:order-none">
          <div className="sticky top-20">
            {locationLoading || loading ? (
              <div className="glass-card h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
                  <p className="text-white/60">
                    {locationLoading ? 'Getting your location...' : 'Loading real-time stations...'}
                  </p>
                  <p className="text-white/40 text-sm mt-2">
                    Fetching charging stations from Open Charge Map API
                  </p>
                </div>
              </div>
            ) : (
              <InteractiveMap
                stations={filteredStations}
                userLocation={currentLocation}
                selectedStation={selectedStation}
                onStationSelect={handleStationSelect}
                onBookClick={onBookClick}
              />
            )}
          </div>
        </div>

        {/* Station List Sidebar */}
        <div className="lg:col-span-3">
          {loading ? (
            <div className="glass-card p-8 text-center">
              <Loader2 className="w-8 h-8 text-primary-400 animate-spin mx-auto mb-2" />
              <p className="text-white/60 text-sm">Loading stations...</p>
            </div>
          ) : (
            <StationList
              stations={filteredStations}
              onStationClick={handleStationSelect}
              onBookClick={onBookClick}
              onReviewClick={handleReviewClick}
              userLocation={currentLocation}
            />
          )}
        </div>
      </div>

      {/* Station Comparison Modal */}
      {showComparison && (
        <StationComparison
          stations={filteredStations}
          onClose={() => setShowComparison(false)}
        />
      )}

      {/* Review Modal */}
      {showReviewModal && reviewStation && (
        <ReviewModal
          station={reviewStation}
          onClose={() => {
            setShowReviewModal(false);
            setReviewStation(null);
          }}
          onSubmit={handleReviewSubmit}
        />
      )}
    </section>
  );
};

export default MapPage;
