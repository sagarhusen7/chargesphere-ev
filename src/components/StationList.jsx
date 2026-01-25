import { MapPin, Star, Zap, Fuel, Navigation2, MessageSquare } from 'lucide-react';
import { navigateToStation, formatETA, calculateETA } from '../utils/navigation';

const StationList = ({ stations = [], onStationClick, onBookClick, onNavigateClick, onReviewClick, userLocation }) => {
  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available':
        return <span className="badge badge-success text-xs">Available</span>;
      case 'busy':
        return <span className="badge badge-warning text-xs">Busy</span>;
      case 'full':
        return <span className="badge badge-danger text-xs">Full</span>;
      default:
        return <span className="badge badge-info text-xs">{availability}</span>;
    }
  };

  if (stations.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <MapPin className="w-12 h-12 text-white/40 mx-auto mb-4" />
        <p className="text-white/60">No stations found matching your criteria.</p>
        <p className="text-white/40 text-sm mt-2">Try adjusting your filters or search area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 custom-scrollbar max-h-[700px] overflow-y-auto pr-2">
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm text-white/60">
          Found {stations.length} station{stations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {stations.map((station) => (
        <div
          key={station.id}
          className="glass-card p-5 hover:bg-white/15 transition-all duration-300 cursor-pointer"
          onClick={() => onStationClick(station)}
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${
                station.type === 'charging' 
                  ? 'bg-primary-500/20' 
                  : 'bg-orange-500/20'
              }`}>
                {station.type === 'charging' ? (
                  <Zap className={`w-5 h-5 ${
                    station.type === 'charging' 
                      ? 'text-primary-400' 
                      : 'text-orange-400'
                  }`} />
                ) : (
                  <Fuel className="w-5 h-5 text-orange-400" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-white mb-1">{station.name}</h3>
                <div className="flex items-center space-x-3 text-sm">
                  <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                    <span className="text-white/70">{station.rating}</span>
                  </div>
                  {station.distance && (
                    <div className="flex items-center space-x-1 text-white/60">
                      <Navigation2 className="w-3 h-3" />
                      <span>{station.distance} km</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            {getAvailabilityBadge(station.availability)}
          </div>

          {/* Address */}
          <div className="flex items-start space-x-2 text-sm text-white/60 mb-3">
            <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
            <span>{station.address}</span>
          </div>

          {/* Details - Charging Stations */}
          {station.type === 'charging' && (
            <div className="space-y-2 mb-4">
              <div className="flex flex-wrap gap-2">
                {station.chargerTypes.map((charger, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full bg-primary-500/20 text-primary-300 border border-primary-500/30"
                  >
                    {charger}
                  </span>
                ))}
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {station.availableSlots}/{station.totalSlots} slots available
                </span>
                <span className="text-primary-400 font-semibold">
                  {station.pricing}
                </span>
              </div>
            </div>
          )}

          {/* Details - Fuel Stations */}
          {station.type === 'fuel' && station.pricing && (
            <div className="mb-4">
              <div className="grid grid-cols-2 gap-2 text-sm">
                {Object.entries(station.pricing).slice(0, 2).map(([fuelType, price]) => (
                  <div key={fuelType} className="text-white/60">
                    <span className="capitalize">{fuelType}: </span>
                    <span className="text-orange-400 font-semibold">{price}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (userLocation) {
                  navigateToStation(station, userLocation);
                } else {
                  navigateToStation(station);
                }
              }}
              className="flex items-center justify-center space-x-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm border border-blue-500/30"
              title={station.distance ? `ETA: ${formatETA(calculateETA(station.distance))}` : 'Navigate'}
            >
              <Navigation2 className="w-4 h-4" />
              <span>Navigate</span>
            </button>
            
            {station.type === 'charging' && onReviewClick && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onReviewClick(station);
                }}
                className="flex items-center justify-center space-x-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-3 rounded-lg transition-all duration-200 text-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Review</span>
              </button>
            )}
            
            {station.type === 'charging' && station.availability !== 'full' && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onBookClick(station);
                }}
                className="col-span-2 bg-gradient-to-r from-primary-500 to-electric-500 hover:from-primary-600 hover:to-electric-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
              >
                Book Now
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default StationList;
