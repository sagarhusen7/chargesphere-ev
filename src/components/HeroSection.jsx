import { ArrowRight, MapPin, Calendar, Car, Zap, Search } from 'lucide-react';

const HeroSection = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-primary-500/20 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-electric-500/20 rounded-full blur-3xl animate-pulse-slow delay-1000"></div>
      </div>

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 animate-slide-up">
            <div className="inline-block">
              <span className="badge badge-info text-sm">
                <Zap className="w-3 h-3 mr-1" />
                Power Your Journey
              </span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Find, Book &{' '}
              <span className="gradient-text">Charge</span>
              {' '}Your EV
            </h1>
            
            <p className="text-xl text-white/70 leading-relaxed">
              Discover nearby EV charging stations, book charging slots in advance, 
              and rent electric vehicles — all in one seamless platform.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#map" className="btn-primary flex items-center justify-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Find Stations</span>
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#rentals" className="btn-secondary flex items-center justify-center space-x-2">
                <Car className="w-5 h-5" />
                <span>Rent Vehicles</span>
              </a>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">500+</div>
                <div className="text-sm text-white/60 mt-1">Charging Stations</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">10K+</div>
                <div className="text-sm text-white/60 mt-1">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold gradient-text">50+</div>
                <div className="text-sm text-white/60 mt-1">Rental Vehicles</div>
              </div>
            </div>
          </div>

          {/* Right Content - Quick Search Card */}
          <div className="animate-slide-up delay-200">
            <div className="glass-card p-8 space-y-6">
              <h3 className="text-2xl font-bold">Quick Station Search</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Location
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/40" />
                    <input
                      type="text"
                      placeholder="Enter your location"
                      className="input-field pl-10"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Station Type
                  </label>
                  <select className="input-field">
                    <option>All Stations</option>
                    <option>EV Charging</option>
                    <option>Fuel Stations</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white/70 mb-2">
                    Radius
                  </label>
                  <select className="input-field">
                    <option>Within 5 km</option>
                    <option>Within 10 km</option>
                    <option>Within 25 km</option>
                    <option>Within 50 km</option>
                  </select>
                </div>

                <a href="#map" className="btn-primary w-full flex items-center justify-center space-x-2">
                  <Search className="w-5 h-5" />
                  <span>Search Stations</span>
                </a>
              </div>

              {/* Features List */}
              <div className="pt-6 border-t border-white/10 space-y-3">
                <div className="flex items-center space-x-3 text-sm text-white/70">
                  <div className="w-2 h-2 rounded-full bg-electric-400"></div>
                  <span>Real-time availability</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white/70">
                  <div className="w-2 h-2 rounded-full bg-electric-400"></div>
                  <span>Instant booking confirmation</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-white/70">
                  <div className="w-2 h-2 rounded-full bg-electric-400"></div>
                  <span>Multiple payment options</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass-card p-6 card-hover">
            <div className="bg-gradient-to-r from-primary-500 to-electric-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Interactive Map</h3>
            <p className="text-white/60">
              Locate charging and fuel stations on an easy-to-use interactive map with real-time data.
            </p>
          </div>

          <div className="glass-card p-6 card-hover">
            <div className="bg-gradient-to-r from-primary-500 to-electric-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Easy Booking</h3>
            <p className="text-white/60">
              Book charging slots and rental vehicles in advance with instant confirmation.
            </p>
          </div>

          <div className="glass-card p-6 card-hover">
            <div className="bg-gradient-to-r from-primary-500 to-electric-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Car className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold mb-2">Vehicle Rentals</h3>
            <p className="text-white/60">
              Rent EVs and traditional vehicles with flexible pricing and convenient pickup locations.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
