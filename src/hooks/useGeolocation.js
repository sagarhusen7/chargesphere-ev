import { useState, useEffect } from 'react';

/**
 * Custom hook to get user's geolocation
 * @returns {object} - { position, error, loading }
 */
export const useGeolocation = () => {
  const [position, setPosition] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser');
      setLoading(false);
      return;
    }

    const successHandler = (position) => {
      setPosition({
        lat: position.coords.latitude,
        lng: position.coords.longitude,
        accuracy: position.coords.accuracy
      });
      setLoading(false);
    };

    const errorHandler = (error) => {
      setError(error.message);
      setLoading(false);
      // Set default location (New York City) if geolocation fails
      setPosition({ lat: 40.7128, lng: -74.0060 });
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    });
  }, []);

  return { position, error, loading };
};
