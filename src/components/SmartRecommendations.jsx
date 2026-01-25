import React from 'react';
import { Sparkles, Zap, Star, MapPin } from 'lucide-react';
import { getSmartRecommendations } from '../utils/recommendations';

const SmartRecommendations = ({ stations, userLocation, userHistory = [] }) => {
  const recommendations = getSmartRecommendations(userLocation, stations, userHistory);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className="glass-card p-6 mb-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-3 rounded-lg">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-white dark:text-white">Recommended For You</h2>
          <p className="text-white/60 dark:text-gray-400 text-sm">
            Based on your location, preferences, and charging history
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommendations.slice(0, 3).map((station, index) => (
          <div
            key={station.id}
            className="bg-white/5 dark:bg-gray-800/50 border-2 border-purple-500/30 dark:border-purple-500/50 rounded-lg p-4 hover:border-purple-500/60 transition-all hover:scale-105 relative overflow-hidden group"
          >
            {/* Ranking Badge */}
            {index === 0 && (
              <div className="absolute top-2 right-2">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center space-x-1">
                  <Star className="w-3 h-3 fill-white" />
                  <span>Top Pick</span>
                </div>
              </div>
            )}

            {/* Station Info */}
            <div className="mb-3">
              <div className="flex items-start space-x-2 mb-2">
                <Zap className="w-5 h-5 text-electric-400 flex-shrink-0 mt-1" />
                <h3 className="font-semibold text-white dark:text-white text-sm">
                  {station.name}
                </h3>
              </div>

              <div className="flex items-center space-x-3 text-xs text-white/60 dark:text-gray-400 mb-2">
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {station.distance} km
                </span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1 fill-yellow-400 text-yellow-400" />
                  {station.rating}
                </span>
              </div>

              {/* Price */}
              <p className="text-electric-400 font-semibold text-sm mb-3">
                {typeof station.pricing === 'number' 
                  ? `$${station.pricing}/kWh`
                  : station.type === 'fuel' 
                    ? 'Fuel Station'
                    : 'N/A'
                }
              </p>

              {/* Reasons */}
              <div className="space-y-1">
                {station.reasons.slice(0, 2).map((reason, idx) => (
                  <div
                    key={idx}
                    className="flex items-center text-xs text-purple-300 dark:text-purple-400"
                  >
                    <div className="w-1 h-1 bg-purple-400 rounded-full mr-2"></div>
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            {/* Match Score */}
            <div className="mt-3 pt-3 border-t border-white/10 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <span className="text-xs text-white/60 dark:text-gray-400">Match Score</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 h-2 bg-white/10 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full transition-all duration-500"
                      style={{ width: `${station.recommendationScore}%` }}
                    />
                  </div>
                  <span className="text-xs font-semibold text-purple-400">
                    {station.recommendationScore}%
                  </span>
                </div>
              </div>
            </div>

            {/* Hover Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-500/10 to-pink-500/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>

      {recommendations.length > 3 && (
        <div className="mt-4 text-center">
          <button className="text-purple-400 hover:text-purple-300 text-sm font-medium flex items-center space-x-1 mx-auto">
            <span>View all {recommendations.length} recommendations</span>
            <Sparkles className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SmartRecommendations;
