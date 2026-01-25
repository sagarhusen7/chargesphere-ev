import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Navigation, Zap, Fuel, Star, MapPin } from 'lucide-react';

// Fix for default marker icons in react-leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';

let DefaultIcon = Icon.Default.prototype;
DefaultIcon.options.iconRetinaUrl = iconRetina;
DefaultIcon.options.iconUrl = icon;
DefaultIcon.options.shadowUrl = iconShadow;

// Custom icons for different marker types
const createCustomIcon = (color) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="30" height="45">
        <path fill="${color}" stroke="#fff" stroke-width="1.5" d="M12 0C7.03 0 3 4.03 3 9c0 7.5 9 18 9 18s9-10.5 9-18c0-4.97-4.03-9-9-9z"/>
        <circle cx="12" cy="9" r="4" fill="#fff"/>
      </svg>
    `)}`,
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -45],
  });
};

const chargingStationIcon = createCustomIcon('#0099ff');
const fuelStationIcon = createCustomIcon('#ff6b00');
const userLocationIcon = createCustomIcon('#00e6c3');

// Component to recenter map when user location changes
function ChangeMapView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

const InteractiveMap = ({ 
  stations = [], 
  userLocation = null, 
  selectedStation = null,
  onStationSelect = () => {},
  onBookClick = () => {}
}) => {
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); // Default: New York City
  const [mapZoom, setMapZoom] = useState(13);

  useEffect(() => {
    if (userLocation) {
      setMapCenter([userLocation.lat, userLocation.lng]);
      setMapZoom(13);
    }
  }, [userLocation]);

  useEffect(() => {
    if (selectedStation) {
      setMapCenter([selectedStation.location.lat, selectedStation.location.lng]);
      setMapZoom(15);
    }
  }, [selectedStation]);

  const getAvailabilityBadge = (availability) => {
    switch (availability) {
      case 'available':
        return <span className="badge badge-success">Available</span>;
      case 'busy':
        return <span className="badge badge-warning">Busy</span>;
      case 'full':
        return <span className="badge badge-danger">Full</span>;
      default:
        return <span className="badge badge-info">{availability}</span>;
    }
  };

  return (
    <div className="map-container h-[600px] w-full">
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={true}
      >
        <ChangeMapView center={mapCenter} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User Location Marker */}
        {userLocation && (
          <Marker
            position={[userLocation.lat, userLocation.lng]}
            icon={userLocationIcon}
          >
            <Popup>
              <div className="p-2">
                <div className="flex items-center space-x-2 mb-2">
                  <Navigation className="w-4 h-4 text-electric-500" />
                  <span className="font-semibold text-dark-900">Your Location</span>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Station Markers */}
        {stations.map((station) => (
          <Marker
            key={station.id}
            position={[station.location.lat, station.location.lng]}
            icon={station.type === 'charging' ? chargingStationIcon : fuelStationIcon}
            eventHandlers={{
              click: () => onStationSelect(station),
            }}
          >
            <Popup className="custom-popup" maxWidth={300}>
              <div className="p-1">
                {/* Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-2">
                    {station.type === 'charging' ? (
                      <Zap className="w-5 h-5 text-primary-500 mt-0.5" />
                    ) : (
                      <Fuel className="w-5 h-5 text-orange-500 mt-0.5" />
                    )}
                    <div>
                      <h3 className="font-bold text-dark-900 text-base">{station.name}</h3>
                      <div className="flex items-center space-x-1 mt-1">
                        <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-xs text-dark-700">{station.rating}</span>
                      </div>
                    </div>
                  </div>
                  {getAvailabilityBadge(station.availability)}
                </div>

                {/* Address */}
                <div className="flex items-start space-x-2 mb-3 text-sm text-dark-700">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{station.address}</span>
                </div>

                {/* Details for Charging Stations */}
                {station.type === 'charging' && (
                  <div className="space-y-2 mb-3">
                    <div className="text-sm">
                      <span className="font-medium text-dark-900">Chargers: </span>
                      <span className="text-dark-700">{station.chargerTypes.join(', ')}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-dark-900">Available: </span>
                      <span className="text-dark-700">
                        {station.availableSlots}/{station.totalSlots} slots
                      </span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium text-dark-900">Pricing: </span>
                      <span className="text-primary-600 font-semibold">{station.pricing}</span>
                    </div>
                    {station.distance && (
                      <div className="text-sm">
                        <span className="font-medium text-dark-900">Distance: </span>
                        <span className="text-dark-700">{station.distance} km away</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Details for Fuel Stations */}
                {station.type === 'fuel' && station.pricing && (
                  <div className="space-y-1 mb-3 text-sm">
                    {Object.entries(station.pricing).map(([fuelType, price]) => (
                      <div key={fuelType}>
                        <span className="font-medium text-dark-900 capitalize">{fuelType}: </span>
                        <span className="text-orange-600 font-semibold">{price}</span>
                      </div>
                    ))}
                    {station.distance && (
                      <div className="mt-2">
                        <span className="font-medium text-dark-900">Distance: </span>
                        <span className="text-dark-700">{station.distance} km away</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Book Button for Charging Stations */}
                {station.type === 'charging' && station.availability !== 'full' && (
                  <button
                    onClick={() => onBookClick(station)}
                    className="w-full bg-gradient-to-r from-primary-500 to-electric-500 hover:from-primary-600 hover:to-electric-600 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-sm"
                  >
                    Book Now
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default InteractiveMap;
