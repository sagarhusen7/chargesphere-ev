import React, { useState } from 'react';
import { X, Zap, MapPin, DollarSign, Star, Clock, Check } from 'lucide-react';

const StationComparison = ({ stations, onClose }) => {
  const [selectedStations, setSelectedStations] = useState([]);

  const toggleStation = (station) => {
    if (selectedStations.find(s => s.id === station.id)) {
      setSelectedStations(selectedStations.filter(s => s.id !== station.id));
    } else if (selectedStations.length < 3) {
      setSelectedStations([...selectedStations, station]);
    }
  };

  const getComparisonData = () => {
    return [
      { label: 'Location', key: 'name' },
      { label: 'Distance', key: 'distance', suffix: ' km' },
      { label: 'Price', key: 'pricing', prefix: '$', suffix: '/kWh' },
      { label: 'Rating', key: 'rating', suffix: '/5' },
      { label: 'Availability', key: 'availability' },
      { label: 'Charger Type', key: 'chargerType' },
      { label: 'Power', key: 'power', suffix: ' kW' },
      { label: 'Open Hours', key: 'hours' },
    ];
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-gray-700">
          <div>
            <h2 className="text-2xl font-bold text-white dark:text-white">Station Comparison</h2>
            <p className="text-white/60 dark:text-gray-400 text-sm mt-1">
              Select up to 3 stations to compare ({selectedStations.length}/3)
            </p>
          </div>
          <button
            onClick={onClose}
            className="btn-icon text-white dark:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
          {/* Station Selection */}
          {selectedStations.length < 3 && (
            <div className="mb-6">
              <h3 className="font-semibold text-white dark:text-white mb-3">Available Stations</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {stations
                  .filter(s => !selectedStations.find(sel => sel.id === s.id))
                  .slice(0, 6)
                  .map((station) => (
                    <button
                      key={station.id}
                      onClick={() => toggleStation(station)}
                      className="bg-white/5 dark:bg-gray-800/50 hover:bg-white/10 dark:hover:bg-gray-700/50 border border-white/10 dark:border-gray-700 rounded-lg p-3 text-left transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white dark:text-white text-sm">{station.name}</p>
                          <p className="text-white/60 dark:text-gray-400 text-xs mt-1">
                            {station.distance} km • ${station.pricing}/kWh
                          </p>
                        </div>
                        <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          )}

          {/* Comparison Table */}
          {selectedStations.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10 dark:border-gray-700">
                    <th className="text-left py-3 px-4 text-white/80 dark:text-gray-300 font-medium">
                      Feature
                    </th>
                    {selectedStations.map((station) => (
                      <th key={station.id} className="text-center py-3 px-4 min-w-[200px]">
                        <div className="flex flex-col items-center space-y-2">
                          <span className="font-semibold text-white dark:text-white">{station.name}</span>
                          <button
                            onClick={() => toggleStation(station)}
                            className="text-xs text-red-400 hover:text-red-300"
                          >
                            Remove
                          </button>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {getComparisonData().map((row, idx) => (
                    <tr 
                      key={row.key}
                      className={`border-b border-white/5 dark:border-gray-800 ${
                        idx % 2 === 0 ? 'bg-white/5 dark:bg-gray-800/30' : ''
                      }`}
                    >
                      <td className="py-4 px-4 font-medium text-white/80 dark:text-gray-300">
                        {row.label}
                      </td>
                      {selectedStations.map((station) => (
                        <td key={station.id} className="py-4 px-4 text-center">
                          <span className="text-white dark:text-white">
                            {row.prefix || ''}
                            {row.key === 'availability' ? (
                              station[row.key] === 'Available' ? (
                                <span className="badge badge-success">
                                  <Check className="w-3 h-3 mr-1 inline" />
                                  Available
                                </span>
                              ) : (
                                <span className="badge badge-warning">Busy</span>
                              )
                            ) : (
                              station[row.key]
                            )}
                            {row.suffix || ''}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {selectedStations.length === 0 && (
            <div className="text-center py-12">
              <Zap className="w-16 h-16 text-white/20 dark:text-gray-600 mx-auto mb-4" />
              <p className="text-white/60 dark:text-gray-400">
                Select stations from above to start comparing
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StationComparison;
