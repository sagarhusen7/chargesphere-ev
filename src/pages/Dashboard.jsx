import React, { useState, useEffect } from 'react';
import { User, Zap, Heart, Clock, TrendingUp, MapPin, Calendar, Battery } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import * as bookingAPI from '../services/bookingAPI';
import CostCalculator from '../components/CostCalculator';

const Dashboard = () => {
  const { user, getBookings } = useAuth();
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalCharged: 0,
    moneySaved: 0,
    favoriteStations: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [favoriteStations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load real data from backend
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        // Get user bookings
        const bookingsData = await bookingAPI.getUserBookings({ limit: 5 });
        
        // Transform backend data to display format
        const formattedBookings = bookingsData.bookings.map(booking => ({
          id: booking._id,
          station: booking.station.name,
          date: new Date(booking.bookingDate).toLocaleDateString('en-US'),
          time: booking.startTime,
          duration: `${Math.floor(booking.duration / 60)}h ${booking.duration % 60}m`,
          cost: `$${booking.estimatedCost.toFixed(2)}`,
          status: booking.status,
          statusDisplay: booking.status.charAt(0).toUpperCase() + booking.status.slice(1)
        }));
        
        setRecentBookings(formattedBookings);
        
        // Calculate stats
        setStats({
          totalBookings: bookingsData.total || formattedBookings.length,
          totalCharged: 0, // TODO: Calculate from completed bookings
          moneySaved: 0, // TODO: Calculate
          favoriteStations: user?.favorites?.length || 0
        });
      } catch (error) {
        console.error('Failed to load dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadData();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-dark pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-4 mb-2">
            <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-3 rounded-full">
              <User className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white dark:text-white">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-white/60 dark:text-gray-400">
                {user?.role === 'admin' ? 'Administrator' : 'Member'} since {user?.memberSince || 'Jan 2026'}
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-primary-500/20 p-3 rounded-lg">
                <Calendar className="w-6 h-6 text-primary-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white dark:text-white mb-1">{stats.totalBookings}</p>
            <p className="text-white/60 dark:text-gray-400 text-sm">Total Bookings</p>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-electric-500/20 p-3 rounded-lg">
                <Battery className="w-6 h-6 text-electric-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white dark:text-white mb-1">{stats.totalCharged} kWh</p>
            <p className="text-white/60 dark:text-gray-400 text-sm">Energy Charged</p>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-green-500/20 p-3 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-400" />
              </div>
              <TrendingUp className="w-5 h-5 text-green-400" />
            </div>
            <p className="text-2xl font-bold text-white dark:text-white mb-1">${stats.moneySaved}</p>
            <p className="text-white/60 dark:text-gray-400 text-sm">Money Saved</p>
          </div>

          <div className="glass-card p-6 hover:scale-105 transition-transform">
            <div className="flex items-center justify-between mb-4">
              <div className="bg-red-500/20 p-3 rounded-lg">
                <Heart className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-white dark:text-white mb-1">{stats.favoriteStations}</p>
            <p className="text-white/60 dark:text-gray-400 text-sm">Favorite Stations</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Recent Bookings */}
          <div className="lg:col-span-2">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white dark:text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-primary-400" />
                  Recent Bookings
                </h2>
                <button className="text-primary-400 hover:text-primary-300 text-sm font-medium">
                  View All
                </button>
              </div>

              <div className="space-y-4">
                {recentBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className="bg-white/5 dark:bg-gray-800/50 border border-white/10 dark:border-gray-700 rounded-lg p-4 hover:border-primary-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-white dark:text-white mb-1">
                          {booking.station}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-white/60 dark:text-gray-400">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {booking.date}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {booking.time}
                          </span>
                        </div>
                      </div>
                      {booking.status === 'Completed' ? (
                        <span className="badge badge-success">Completed</span>
                      ) : (
                        <span className="badge badge-info">Upcoming</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-white/60 dark:text-gray-400">
                        Duration: <span className="text-white dark:text-white font-medium">{booking.duration}</span>
                      </span>
                      <span className="text-electric-400 font-semibold">{booking.cost}</span>
                    </div>
                  </div>
                ))}
              </div>

              {recentBookings.length === 0 && (
                <div className="text-center py-8">
                  <Zap className="w-12 h-12 text-white/20 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-white/60 dark:text-gray-400">No bookings yet</p>
                  <p className="text-white/40 dark:text-gray-500 text-sm mt-1">
                    Start booking charging stations to see them here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Favorite Stations */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <h2 className="text-xl font-bold text-white dark:text-white flex items-center mb-6">
                <Heart className="w-5 h-5 mr-2 text-red-400" />
                Favorite Stations
              </h2>

              <div className="space-y-3">
                {favoriteStations.map((station) => (
                  <div
                    key={station.id}
                    className="bg-white/5 dark:bg-gray-800/50 border border-white/10 dark:border-gray-700 rounded-lg p-4 hover:border-red-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center space-x-2 flex-1">
                        <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                        <h3 className="font-medium text-white dark:text-white text-sm">
                          {station.name}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-white/60 dark:text-gray-400">
                      <span>{station.visits} visits</span>
                      <span>{station.lastVisit}</span>
                    </div>
                  </div>
                ))}
              </div>

              {favoriteStations.length === 0 && (
                <div className="text-center py-8">
                  <Heart className="w-12 h-12 text-white/20 dark:text-gray-600 mx-auto mb-3" />
                  <p className="text-white/60 dark:text-gray-400 text-sm">No favorites yet</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cost Calculator */}
        <div className="mt-8">
          <CostCalculator />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
