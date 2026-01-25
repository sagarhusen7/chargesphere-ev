import { Star, Gauge, Users, Zap, Fuel, Battery } from 'lucide-react';

const VehicleCard = ({ vehicle, onRentClick, onDetailsClick }) => {
  const isEV = vehicle.type === 'EV';
  const isAvailable = vehicle.availability === 'available';

  return (
    <div className="glass-card overflow-hidden card-hover">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={vehicle.image}
          alt={vehicle.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=800&auto=format&fit=crop';
          }}
        />
        <div className="absolute top-3 left-3">
          <span className={`badge ${isEV ? 'badge-success' : 'badge-info'}`}>
            {isEV ? <Zap className="w-3 h-3 mr-1" /> : <Fuel className="w-3 h-3 mr-1" />}
            {vehicle.type}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
            {isAvailable ? 'Available' : 'Rented'}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 space-y-4">
        {/* Header */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="text-xl font-bold text-white">{vehicle.name}</h3>
              <p className="text-sm text-white/60">{vehicle.category}</p>
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
              <span className="text-sm font-semibold text-white">{vehicle.rating}</span>
            </div>
          </div>
        </div>

        {/* Specifications */}
        <div className="grid grid-cols-2 gap-3 text-sm">
          {isEV ? (
            <>
              <div className="flex items-center space-x-2 text-white/70">
                <Battery className="w-4 h-4 text-electric-400" />
                <span>{vehicle.specifications.range}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Users className="w-4 h-4 text-electric-400" />
                <span>{vehicle.specifications.seats} Seats</span>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center space-x-2 text-white/70">
                <Fuel className="w-4 h-4 text-orange-400" />
                <span>{vehicle.specifications.fuelType}</span>
              </div>
              <div className="flex items-center space-x-2 text-white/70">
                <Users className="w-4 h-4 text-orange-400" />
                <span>{vehicle.specifications.seats} Seats</span>
              </div>
            </>
          )}
          <div className="flex items-center space-x-2 text-white/70 col-span-2">
            <Gauge className="w-4 h-4 text-primary-400" />
            <span className="text-xs">{vehicle.specifications.acceleration}</span>
          </div>
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2">
          {vehicle.features.slice(0, 3).map((feature, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70"
            >
              {feature}
            </span>
          ))}
          {vehicle.features.length > 3 && (
            <span className="text-xs px-2 py-1 rounded-full bg-white/10 text-white/70">
              +{vehicle.features.length - 3} more
            </span>
          )}
        </div>

        {/* Pricing */}
        <div className="border-t border-white/10 pt-4">
          <div className="flex items-end justify-between mb-4">
            <div>
              <p className="text-sm text-white/60">Starting from</p>
              <p className="text-2xl font-bold gradient-text">{vehicle.pricing.daily}</p>
              <p className="text-xs text-white/50">per day</p>
            </div>
            <div className="text-right text-sm text-white/60">
              <p>{vehicle.pricing.hourly}</p>
              <p>{vehicle.pricing.weekly}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => onDetailsClick(vehicle)}
              className="flex-1 bg-white/10 hover:bg-white/20 text-white font-medium py-2 px-4 rounded-lg transition-all duration-200"
            >
              Details
            </button>
            <button
              onClick={() => onRentClick(vehicle)}
              disabled={!isAvailable}
              className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAvailable ? 'Rent Now' : 'Unavailable'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VehicleCard;
