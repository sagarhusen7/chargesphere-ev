import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock, Users, Calendar, TrendingUp } from 'lucide-react';
import * as adminAPI from '../services/adminAPI';

const AdminBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    loadData();
  }, [filter]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [bookingsData, statsData] = await Promise.all([
        adminAPI.getAllBookings({ status: filter }),
        adminAPI.getAdminStats()
      ]);
      setBookings(bookingsData.bookings);
      setStats(statsData);
    } catch (error) {
      console.error('Failed to load admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (bookingId) => {
    setProcessingId(bookingId);
    try {
      await adminAPI.approveBooking(bookingId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to approve booking:', error);
      alert('Failed to approve booking');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (bookingId) => {
    if (!confirm('Are you sure you want to reject this booking?')) return;
    
    setProcessingId(bookingId);
    try {
      await adminAPI.rejectBooking(bookingId);
      await loadData(); // Reload data
    } catch (error) {
      console.error('Failed to reject booking:', error);
      alert('Failed to reject booking');
    } finally {
      setProcessingId(null);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case 'confirmed': return 'text-green-400 bg-green-500/10 border-green-500/30';
      case 'completed': return 'text-blue-400 bg-blue-500/10 border-blue-500/30';
      case 'cancelled': return 'text-red-400 bg-red-500/10 border-red-500/30';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/30';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-primary-400 to-electric-400 bg-clip-text text-transparent">
        Admin Dashboard
      </h1>

      {/* Statistics Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-white">{stats.users}</p>
              </div>
              <Users className="w-12 h-12 text-primary-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Pending</p>
                <p className="text-3xl font-bold text-yellow-400">{stats.bookings.pending}</p>
              </div>
              <Clock className="w-12 h-12 text-yellow-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Confirmed</p>
                <p className="text-3xl font-bold text-green-400">{stats.bookings.confirmed}</p>
              </div>
              <CheckCircle className="w-12 h-12 text-green-400" />
            </div>
          </div>

          <div className="glass-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-white/60 text-sm">Completed</p>
                <p className="text-3xl font-bold text-blue-400">{stats.bookings.completed}</p>
              </div>
              <TrendingUp className="w-12 h-12 text-blue-400" />
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-4 mb-6 overflow-x-auto">
        {['pending', 'confirmed', 'completed', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-6 py-2 rounded-lg font-medium capitalize transition-all whitespace-nowrap ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-white/60 hover:bg-white/10'
            }`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto"></div>
          <p className="text-white/60 mt-4">Loading bookings...</p>
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <Calendar className="w-16 h-16 text-white/30 mx-auto mb-4" />
          <p className="text-white/60 text-lg">No {filter} bookings found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="glass-card p-6 hover:shadow-xl transition-all">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                {/* Booking Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-xl font-bold text-white">{booking.station.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(booking.status)}`}>
                      {booking.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-white/60">Customer</p>
                      <p className="text-white font-medium">{booking.user?.name || 'N/A'}</p>
                      <p className="text-white/50 text-xs">{booking.user?.email}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Date & Time</p>
                      <p className="text-white font-medium">{formatDate(booking.bookingDate)}</p>
                      <p className="text-white/50 text-xs">{booking.startTime} • {formatDuration(booking.duration)}</p>
                    </div>
                    <div>
                      <p className="text-white/60">Vehicle & Charger</p>
                      <p className="text-white font-medium">{booking.vehicle.type}</p>
                      <p className="text-white/50 text-xs">{booking.chargerType}</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {booking.status === 'pending' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleApprove(booking._id)}
                      disabled={processingId === booking._id}
                      className="btn-primary px-6 py-2 flex items-center gap-2"
                    >
                      <CheckCircle className="w-5 h-5" />
                      {processingId === booking._id ? 'Processing...' : 'Approve'}
                    </button>
                    <button
                      onClick={() => handleReject(booking._id)}
                      disabled={processingId === booking._id}
                      className="bg-red-500/20 hover:bg-red-500/30 text-red-400 px-6 py-2 rounded-lg font-medium flex items-center gap-2 transition-all"
                    >
                      <XCircle className="w-5 h-5" />
                      Reject
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminBookings;
