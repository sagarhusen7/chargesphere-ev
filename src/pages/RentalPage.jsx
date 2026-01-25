import { useState } from 'react';
import VehicleCard from '../components/VehicleCard';
import { rentalVehicles } from '../data/vehicles';
import { Car, Filter, Search } from 'lucide-react';

const RentalPage = ({ onRentClick }) => {
  const [vehicles, setVehicles] = useState(rentalVehicles);
  const [filteredVehicles, setFilteredVehicles] = useState(rentalVehicles);
  const [filters, setFilters] = useState({
    type: 'all',
    category: 'all',
    availability: 'all',
    search: ''
  });

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    applyFilters(newFilters);
  };

  const applyFilters = (currentFilters) => {
    let filtered = [...vehicles];

    // Filter by type
    if (currentFilters.type !== 'all') {
      filtered = filtered.filter(v => v.type === currentFilters.type);
    }

    // Filter by category
    if (currentFilters.category !== 'all') {
      filtered = filtered.filter(v => v.category === currentFilters.category);
    }

    // Filter by availability
    if (currentFilters.availability !== 'all') {
      filtered = filtered.filter(v => v.availability === currentFilters.availability);
    }

    // Filter by search
    if (currentFilters.search.trim() !== '') {
      const query = currentFilters.search.toLowerCase();
      filtered = filtered.filter(v =>
        v.name.toLowerCase().includes(query) ||
        v.category.toLowerCase().includes(query)
      );
    }

    setFilteredVehicles(filtered);
  };

  const handleDetailsClick = (vehicle) => {
    // Could open a modal or navigate to details page
    console.log('View details for:', vehicle);
  };

  return (
    <section id="rentals" className="section-container">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-block mb-4">
          <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-3 rounded-xl">
            <Car className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Rent <span className="gradient-text">Vehicles</span>
        </h2>
        <p className="text-xl text-white/70 max-w-2xl mx-auto">
          Choose from our fleet of electric and traditional vehicles for your journey
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
              <input
                type="text"
                placeholder="Search vehicles..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field pl-10"
              />
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="input-field"
            >
              <option value="all">All Types</option>
              <option value="EV">Electric Vehicles</option>
              <option value="Non-EV">Non-EV</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="input-field"
            >
              <option value="all">All Categories</option>
              <option value="Sedan">Sedan</option>
              <option value="SUV">SUV</option>
              <option value="Hatchback">Hatchback</option>
            </select>
          </div>

          {/* Availability Filter */}
          <div>
            <select
              value={filters.availability}
              onChange={(e) => handleFilterChange('availability', e.target.value)}
              className="input-field"
            >
              <option value="all">All Status</option>
              <option value="available">Available Only</option>
              <option value="rented">Rented</option>
            </select>
          </div>
        </div>

        {/* Quick Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange('type', 'EV')}
            className="text-xs px-3 py-1.5 rounded-full bg-green-500/20 text-green-400 border border-green-500/30 hover:bg-green-500/30 transition-colors duration-200"
          >
            Electric Only
          </button>
          <button
            onClick={() => handleFilterChange('category', 'SUV')}
            className="text-xs px-3 py-1.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:bg-blue-500/30 transition-colors duration-200"
          >
            SUVs
          </button>
          <button
            onClick={() => handleFilterChange('availability', 'available')}
            className="text-xs px-3 py-1.5 rounded-full bg-primary-500/20 text-primary-400 border border-primary-500/30 hover:bg-primary-500/30 transition-colors duration-200"
          >
            Available Now
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-white/60">
          Showing {filteredVehicles.length} vehicle{filteredVehicles.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Vehicle Grid */}
      {filteredVehicles.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onRentClick={onRentClick}
              onDetailsClick={handleDetailsClick}
            />
          ))}
        </div>
      ) : (
        <div className="glass-card p-12 text-center">
          <Car className="w-16 h-16 text-white/40 mx-auto mb-4" />
          <p className="text-xl text-white/60 mb-2">No vehicles found</p>
          <p className="text-white/40">Try adjusting your filters</p>
        </div>
      )}
    </section>
  );
};

export default RentalPage;
