import { createContext, useContext, useState, useEffect } from 'react';
import * as authAPI from '../services/authAPI';
import * as bookingAPI from '../services/bookingAPI';
import * as userAPI from '../services/userAPI';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      if (token && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
          // Optionally verify token with backend
          const userData = await authAPI.getCurrentUser();
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } catch (error) {
          console.error('Failed to load user:', error);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };

    loadUser();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const data = await authAPI.login({ email, password });
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message || 'Login failed' };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const data = await authAPI.register(userData);
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message || 'Signup failed' };
    }
  };

  // Logout function
  const logout = () => {
    authAPI.logout();
    setUser(null);
    return { success: true };
  };

  // Update profile function
  const updateProfile = async (updates) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }
    
    try {
      const data = await userAPI.updateUserProfile(updates);
      setUser(data);
      localStorage.setItem('user', JSON.stringify(data));
      return { success: true, user: data };
    } catch (error) {
      return { success: false, error: error.message || 'Update failed' };
    }
  };

  // Check if current user is admin
  const isAdmin = () => {
    return user?.role === 'admin';
  };

  // Check if current user is customer
  const isCustomer = () => {
    return user?.role === 'customer';
  };

  // Get user bookings
  const getBookings = async () => {
    if (!user) return [];
    try {
      const data = await bookingAPI.getUserBookings();
      return data.bookings || [];
    } catch (error) {
      console.error('Failed to get bookings:', error);
      return [];
    }
  };

  // Create booking
  const createBooking = async (bookingData) => {
    if (!user) {
      return { success: false, error: 'Please login to book' };
    }
    
    try {
      const data = await bookingAPI.createBooking(bookingData);
      return { success: true, booking: data };
    } catch (error) {
      return { success: false, error: error.message || 'Booking failed' };
    }
  };

  // Cancel booking
  const cancelBooking = async (bookingId) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }
    
    try {
      await bookingAPI.cancelBooking(bookingId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Cancellation failed' };
    }
  };

  // Get favorites
  const getFavorites = async () => {
    if (!user) return [];
    try {
      const data = await userAPI.getUserFavorites();
      return data || [];
    } catch (error) {
      console.error('Failed to get favorites:', error);
      return [];
    }
  };

  // Add to favorites
  const addFavorite = async (stationId, stationName) => {
    if (!user) {
      return { success: false, error: 'Please login to save favorites' };
    }
    
    try {
      await userAPI.addFavorite({ stationId, stationName });
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to add favorite' };
    }
  };

  // Remove from favorites
  const removeFavorite = async (stationId) => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }
    
    try {
      await userAPI.removeFavorite(stationId);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message || 'Failed to remove favorite' };
    }
  };

  // Check if station is favorite
  const isFavorite = async (stationId) => {
    if (!user) return false;
    try {
      const favorites = await getFavorites();
      return favorites.some(fav => fav.stationId === stationId);
    } catch (error) {
      return false;
    }
  };

  // Toggle favorite
  const toggleFavorite = async (stationId, stationName) => {
    const isFav = await isFavorite(stationId);
    if (isFav) {
      return await removeFavorite(stationId);
    } else {
      return await addFavorite(stationId, stationName);
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    isAuthenticated: !!user,
    isAdmin,
    isCustomer,
    // Booking functions
    getBookings,
    createBooking,
    cancelBooking,
    // Favorite functions
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    toggleFavorite
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
