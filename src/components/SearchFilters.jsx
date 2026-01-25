import { useState } from 'react';
import { Search, Filter, X, MapPin } from 'lucide-react';

const SearchFilters = ({ onFilterChange, onReset }) => {
  const [filters, setFilters] = useState({
    stationType: 'all',
    chargerType: 'all',
    availability: 'all',
    distance: '25',
    searchQuery: ''
  });

  const [showFilters, setShowFilters] = useState(true);

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      stationType: 'all',
      chargerType: 'all',
      availability: 'all',
      distance: '25',
      searchQuery: ''
    };
    setFilters(resetFilters);
    onReset();
  };

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary-400" />
          <h3 className="text-xl font-bold">Filters & Search</h3>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn-icon lg:hidden"
        >
          {showFilters ? <X /> : <Filter />}
        </button>
      </div>

      {/* Filters */}
      <div className={`space-y-4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
        {/* Search by Location */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Search Location
          </label>
          <div className="flex space-x-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Enter address, city, or area..."
                value={filters.searchQuery}
                onChange={(e) => handleFilterChange('searchQuery', e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && filters.searchQuery.trim()) {
                    handleFilterChange('locationSearch', filters.searchQuery);
                  }
                }}
                className="input-field pl-10"
              />
            </div>
            <button
              onClick={() => {
                if (filters.searchQuery.trim()) {
                  handleFilterChange('locationSearch', filters.searchQuery);
                }
              }}
              disabled={!filters.searchQuery.trim()}
              className="btn-primary px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
              Go
            </button>
          </div>
          <p className="text-xs text-white/50 mt-1">
            Try: "Vijayawada", "Times Square", or any address
          </p>
        </div>

        {/* Station Type */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Station Type
          </label>
          <select
            value={filters.stationType}
            onChange={(e) => handleFilterChange('stationType', e.target.value)}
            className="input-field"
          >
            <option value="all">All Stations</option>
            <option value="charging">EV Charging Only</option>
            <option value="fuel">Fuel Stations Only</option>
          </select>
        </div>

        {/* Charger Type (for EV stations) */}
        {(filters.stationType === 'all' || filters.stationType === 'charging') && (
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Charger Type
            </label>
            <select
              value={filters.chargerType}
              onChange={(e) => handleFilterChange('chargerType', e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="fast">Fast DC</option>
              <option value="ultra">Ultra-Fast DC</option>
              <option value="level2">Level 2 AC</option>
              <option value="tesla">Tesla Supercharger</option>
            </select>
          </div>
        )}

        {/* Availability */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Availability
          </label>
          <select
            value={filters.availability}
            onChange={(e) => handleFilterChange('availability', e.target.value)}
            className="input-field"
          >
            <option value="all">All Stations</option>
            <option value="available">Available Now</option>
            <option value="busy">Busy</option>
            <option value="full">Full</option>
          </select>
        </div>

        {/* Distance */}
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Maximum Distance
          </label>
          <select
            value={filters.distance}
            onChange={(e) => handleFilterChange('distance', e.target.value)}
            className="input-field"
          >
            <option value="all">Any Distance</option>
            <option value="5">Within 5 km</option>
            <option value="10">Within 10 km</option>
            <option value="25">Within 25 km</option>
            <option value="50">Within 50 km</option>
          </select>
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="btn-secondary w-full flex items-center justify-center space-x-2"
        >
          <X className="w-4 h-4" />
          <span>Clear All Filters</span>
        </button>

        {/* Quick Filters */}
        <div className="pt-4 border-t border-white/10">
          <p className="text-sm font-medium text-white/70 mb-3">Quick Filters</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleFilterChange('availability', 'available')}
              className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200"
            >
              Available Now
            </button>
            <button
              onClick={() => handleFilterChange('chargerType', 'fast')}
              className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
            >
              Fast Charging
            </button>
            <button
              onClick={() => handleFilterChange('distance', '5')}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 hover:bg-purple-500/30 transition-colors duration-200"
            >
              Nearby (5km)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
