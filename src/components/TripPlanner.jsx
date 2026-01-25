import React, { useState } from 'react';
import { MapPin, Zap, Clock, Battery, Navigation } from 'lucide-react';

const TripPlanner = () => {
  const [formData, setFormData] = useState({
    startLocation: '',
    endLocation: '',
    vehicleRange: 300, // km
    currentCharge: 80, // percentage
    desiredArrivalCharge: 20 // percentage
  });

  const [tripPlan, setTripPlan] = useState(null);

  // Calculate trip details
  const calculateTrip = (e) => {
    e.preventDefault();
    
    // Simulated distance calculation (would use real API in production)
    const distance = Math.floor(Math.random() * 400) + 100; // 100-500km
    
    const usableRange = (formData.vehicleRange * formData.currentCharge) / 100;
    const rangeNeeded = distance + ((formData.vehicleRange * formData.desiredArrivalCharge) / 100);
    
    const needsCharging = usableRange < rangeNeeded;
    const chargingStopsCount = needsCharging ? Math.ceil((rangeNeeded - usableRange) / (formData.vehicleRange * 0.7)) : 0;
    
    // Simulated charging stops
    const chargingStops = [];
    if (needsCharging) {
      for (let i = 0; i < chargingStopsCount; i++) {
        const stopDistance = Math.floor((distance / (chargingStopsCount + 1)) * (i + 1));
        chargingStops.push({
          id: i + 1,
          location: `Charging Station ${i + 1}`,
          distance: stopDistance,
          chargeTime: 25 + Math.floor(Math.random() * 15), // 25-40 min
          chargeAmount: 60 + Math.floor(Math.random() * 20), // 60-80%
          available: Math.random() > 0.2 // 80% availability
        });
      }
    }
    
    const totalChargingTime = chargingStops.reduce((sum, stop) => sum + stop.chargeTime, 0);
    const drivingTime = Math.floor(distance / 80 * 60); // Assuming 80 km/h average
    const totalTime = drivingTime + totalChargingTime;
    
    setTripPlan({
      distance,
      drivingTime,
      totalChargingTime,
      totalTime,
      chargingStops,
      estimatedArrivalCharge: needsCharging ? 
        formData.desiredArrivalCharge + 5 : 
        formData.currentCharge - Math.floor((distance / formData.vehicleRange) * 100)
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('Charge') || name === 'vehicleRange' ? parseInt(value) : value
    }));
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-3 rounded-lg">
          <Navigation className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white dark:text-white">EV Trip Planner</h2>
          <p className="text-white/60 dark:text-gray-400">Plan your journey with charging stops</p>
        </div>
      </div>

      <form onSubmit={calculateTrip} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Start Location */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Start Location
            </label>
            <input
              type="text"
              name="startLocation"
              value={formData.startLocation}
              onChange={handleInputChange}
              placeholder="Enter starting point"
              className="input-field"
              required
            />
          </div>

          {/* End Location */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              Destination
            </label>
            <input
              type="text"
              name="endLocation"
              value={formData.endLocation}
              onChange={handleInputChange}
              placeholder="Enter destination"
              className="input-field"
              required
            />
          </div>

          {/* Vehicle Range */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <Battery className="w-4 h-4 inline mr-1" />
              Vehicle Range (km): {formData.vehicleRange}
            </label>
            <input
              type="range"
              name="vehicleRange"
              min="150"
              max="600"
              step="50"
              value={formData.vehicleRange}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 dark:text-gray-500 mt-1">
              <span>150 km</span>
              <span>600 km</span>
            </div>
          </div>

          {/* Current Charge */}
          <div>
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <Zap className="w-4 h-4 inline mr-1" />
              Current Charge: {formData.currentCharge}%
            </label>
            <input
              type="range"
              name="currentCharge"
              min="10"
              max="100"
              step="5"
              value={formData.currentCharge}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 dark:text-gray-500 mt-1">
              <span>10%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Desired Arrival Charge */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-white/80 dark:text-gray-300 mb-2">
              <Battery className="w-4 h-4 inline mr-1" />
              Desired Arrival Charge: {formData.desiredArrivalCharge}%
            </label>
            <input
              type="range"
              name="desiredArrivalCharge"
              min="10"
              max="50"
              step="5"
              value={formData.desiredArrivalCharge}
              onChange={handleInputChange}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-white/50 dark:text-gray-500 mt-1">
              <span>10%</span>
              <span>50%</span>
            </div>
          </div>
        </div>

        <button type="submit" className="btn-primary w-full">
          <Navigation className="w-5 h-5 inline mr-2" />
          Plan My Trip
        </button>
      </form>

      {/* Trip Plan Results */}
      {tripPlan && (
        <div className="mt-6 space-y-4 animate-slide-up">
          {/* Summary */}
          <div className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-4 border border-white/10 dark:border-gray-700">
            <h3 className="font-semibold text-lg text-white dark:text-white mb-3">Trip Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-white/60 dark:text-gray-400 text-sm">Distance</p>
                <p className="text-xl font-bold text-white dark:text-white">{tripPlan.distance} km</p>
              </div>
              <div>
                <p className="text-white/60 dark:text-gray-400 text-sm">Driving Time</p>
                <p className="text-xl font-bold text-white dark:text-white">{Math.floor(tripPlan.drivingTime / 60)}h {tripPlan.drivingTime % 60}m</p>
              </div>
              <div>
                <p className="text-white/60 dark:text-gray-400 text-sm">Charging Time</p>
                <p className="text-xl font-bold text-electric-400">{tripPlan.totalChargingTime} min</p>
              </div>
              <div>
                <p className="text-white/60 dark:text-gray-400 text-sm">Total Time</p>
                <p className="text-xl font-bold text-primary-400">{Math.floor(tripPlan.totalTime / 60)}h {tripPlan.totalTime % 60}m</p>
              </div>
            </div>
          </div>

          {/* Charging Stops */}
          {tripPlan.chargingStops.length > 0 ? (
            <div>
              <h3 className="font-semibold text-lg text-white dark:text-white mb-3">
                Recommended Charging Stops ({tripPlan.chargingStops.length})
              </h3>
              <div className="space-y-3">
                {tripPlan.chargingStops.map((stop) => (
                  <div 
                    key={stop.id}
                    className="bg-white/5 dark:bg-gray-800/50 rounded-lg p-4 border border-white/10 dark:border-gray-700 hover:border-primary-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Zap className="w-5 h-5 text-electric-400" />
                          <span className="font-semibold text-white dark:text-white">{stop.location}</span>
                          {stop.available ? (
                            <span className="badge badge-success text-xs">Available</span>
                          ) : (
                            <span className="badge badge-warning text-xs">Busy</span>
                          )}
                        </div>
                        <div className="grid grid-cols-3 gap-3 text-sm">
                          <div>
                            <p className="text-white/60 dark:text-gray-400">Distance</p>
                            <p className="text-white dark:text-white font-medium">{stop.distance} km</p>
                          </div>
                          <div>
                            <p className="text-white/60 dark:text-gray-400">Charge Time</p>
                            <p className="text-white dark:text-white font-medium">{stop.chargeTime} min</p>
                          </div>
                          <div>
                            <p className="text-white/60 dark:text-gray-400">Charge To</p>
                            <p className="text-white dark:text-white font-medium">{stop.chargeAmount}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
              <p className="text-green-400 font-medium flex items-center">
                <Battery className="w-5 h-5 mr-2" />
                No charging stops needed! You can reach your destination with your current charge.
              </p>
              <p className="text-green-300/60 text-sm mt-1">
                Estimated arrival charge: {tripPlan.estimatedArrivalCharge}%
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TripPlanner;
