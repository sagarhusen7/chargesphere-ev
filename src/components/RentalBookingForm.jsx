import { useState } from 'react';
import { Calendar, Clock, User, Mail, Phone, X, CheckCircle, MapPin, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const RentalBookingForm = ({ vehicle, onClose, onBookingComplete }) => {
  const { user, createBooking } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    vehicleId: vehicle?.id || '',
    vehicleName: vehicle?.name || '',
    pickupDate: '',
    pickupTime: '',
    returnDate: '',
    returnTime: '',
    pickupLocation: 'New York, NY',
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || '',
    licenseNumber: ''
  });
  const [bookingReference, setBookingReference] = useState('');

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const calculateDuration = () => {
    if (!bookingData.pickupDate || !bookingData.returnDate) return 0;
    const pickup = new Date(bookingData.pickupDate);
    const returnD = new Date(bookingData.returnDate);
    const diffTime = Math.abs(returnD - pickup);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const calculateCost = () => {
    const days = calculateDuration();
    const dailyRate = parseFloat(vehicle.pricing.daily.replace(/[$,]/g, ''));
    return (days * dailyRate).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare rental booking data for backend
      const rentalPayload = {
        station: {
          id: `rental-${vehicle.id}`,
          name: `Vehicle Rental: ${vehicle.name}`,
          address: bookingData.pickupLocation,
          lat: 40.7128,
          lng: -74.0060
        },
        vehicle: {
          type: `${vehicle.category} - ${vehicle.name}`,
          model: bookingData.licenseNumber
        },
        bookingDate: new Date(bookingData.pickupDate).toISOString(),
        startTime: bookingData.pickupTime,
        duration: calculateDuration() * 24 * 60, // Convert days to minutes
        chargerType: 'Vehicle Rental',
        estimatedCost: parseFloat(calculateCost()),
        notes: `Return: ${bookingData.returnDate} at ${bookingData.returnTime} | Location: ${bookingData.pickupLocation}`
      };

      // Call backend API - this saves with status: 'pending'
      const result = await createBooking(rentalPayload);
      
      if (result.success) {
        // Generate booking reference from backend ID
        const ref = 'RV-' + result.booking._id.slice(-8).toUpperCase();
        setBookingReference(ref);
        setStep(3);
        
        setTimeout(() => {
          if (onBookingComplete) {
            onBookingComplete({ ...bookingData, reference: ref, status: 'pending' });
          }
        }, 1500);
      } else {
        setError(result.error || 'Booking failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to submit rental request. Please try again.');
      setLoading(false);
      console.error('Rental booking error:', err);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Rent {vehicle.name}</h3>
        <p className="text-white/60">{vehicle.category} • {vehicle.type}</p>
      </div>

      <div className="glass-card-light p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-700">Daily Rate:</span>
          <span className="font-semibold text-primary-600">{vehicle.pricing.daily}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-700">Weekly Rate:</span>
          <span className="font-semibold text-primary-600">{vehicle.pricing.weekly}</span>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-white/70 mb-2">
          <MapPin className="inline w-4 h-4 mr-1" />
          Pickup Location
        </label>
        <select
          name="pickupLocation"
          value={bookingData.pickupLocation}
          onChange={handleInputChange}
          className="input-field"
        >
          <option>New York, NY</option>
          <option>Brooklyn, NY</option>
          <option>Queens, NY</option>
          <option>Manhattan, NY</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Pickup Date
          </label>
          <input
            type="date"
            name="pickupDate"
            value={bookingData.pickupDate}
            onChange={handleInputChange}
            min={getTodayDate()}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Pickup Time
          </label>
          <input
            type="time"
            name="pickupTime"
            value={bookingData.pickupTime}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Return Date
          </label>
          <input
            type="date"
            name="returnDate"
            value={bookingData.returnDate}
            onChange={handleInputChange}
            min={bookingData.pickupDate || getTodayDate()}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Return Time
          </label>
          <input
            type="time"
            name="returnTime"
            value={bookingData.returnTime}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
      </div>

      {bookingData.pickupDate && bookingData.returnDate && (
        <div className="glass-card-light p-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-dark-700">Duration</p>
              <p className="text-lg font-bold text-dark-900">{calculateDuration()} days</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-dark-700">Estimated Total</p>
              <p className="text-2xl font-bold text-primary-600">${calculateCost()}</p>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => setStep(2)}
        disabled={!bookingData.pickupDate || !bookingData.returnDate || !bookingData.pickupTime || !bookingData.returnTime}
        className="btn-primary w-full"
      >
        Continue to Contact Details
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Your Information</h3>
        <p className="text-white/60">Complete your rental booking</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <User className="inline w-4 h-4 mr-1" />
            Full Name
          </label>
          <input
            type="text"
            name="userName"
            value={bookingData.userName}
            onChange={handleInputChange}
            placeholder="John Doe"
            required
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <Mail className="inline w-4 h-4 mr-1" />
              Email
            </label>
            <input
              type="email"
              name="userEmail"
              value={bookingData.userEmail}
              onChange={handleInputChange}
              placeholder="john@example.com"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              <Phone className="inline w-4 h-4 mr-1" />
              Phone
            </label>
            <input
              type="tel"
              name="userPhone"
              value={bookingData.userPhone}
              onChange={handleInputChange}
              placeholder="+1 (555) 123-4567"
              required
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Driver's License Number
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={bookingData.licenseNumber}
            onChange={handleInputChange}
            placeholder="DL123456789"
            required
            className="input-field"
          />
        </div>
      </div>

      <div className="glass-card-light p-4 space-y-2 text-sm">
        <h4 className="font-semibold text-dark-900 mb-2">Booking Summary</h4>
        <div className="flex justify-between">
          <span className="text-dark-700">Vehicle:</span>
          <span className="font-medium text-dark-900">{vehicle.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-dark-700">Duration:</span>
          <span className="font-medium text-dark-900">{calculateDuration()} days</span>
        </div>
        <div className="flex justify-between border-t border-dark-300 pt-2">
          <span className="font-semibold text-dark-900">Total:</span>
          <span className="font-bold text-primary-600 text-lg">${calculateCost()}</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4" />
          {error}
        </div>
      )}

      <div className="flex gap-4">
        <button
          onClick={() => setStep(1)}
          className="btn-secondary flex-1"
          disabled={loading}
        >
          Back
        </button>
        <button
          onClick={handleSubmit}
          disabled={!bookingData.userName || !bookingData.userEmail || !bookingData.userPhone || !bookingData.licenseNumber || loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Submitting...' : 'Submit Rental Request'}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="bg-yellow-500/20 p-4 rounded-full">
          <Clock className="w-16 h-16 text-yellow-400" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-2">Rental Submitted!</h3>
        <p className="text-white/60">Awaiting admin approval</p>
        <span className="inline-block mt-3 px-4 py-2 rounded-full text-sm font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
          Status: Pending Approval
        </span>
      </div>

      <div className="glass-card-light p-6 space-y-4 text-left">
        <div className="text-center mb-4">
          <p className="text-sm text-dark-700 mb-1">Booking Reference</p>
          <p className="text-2xl font-bold text-primary-600">{bookingReference}</p>
        </div>

        <div className="border-t border-dark-300 pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-700">Vehicle:</span>
            <span className="font-semibold text-dark-900">{vehicle.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Pickup:</span>
            <span className="font-semibold text-dark-900">
              {bookingData.pickupDate} at {bookingData.pickupTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Return:</span>
            <span className="font-semibold text-dark-900">
              {bookingData.returnDate} at {bookingData.returnTime}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Location:</span>
            <span className="font-semibold text-dark-900">{bookingData.pickupLocation}</span>
          </div>
          <div className="flex justify-between border-t border-dark-300 pt-3">
            <span className="text-dark-700">Total Cost:</span>
            <span className="font-bold text-primary-600 text-lg">${calculateCost()}</span>
          </div>
        </div>
      </div>

      <p className="text-sm text-white/60">
        A confirmation email has been sent to <span className="text-white">{bookingData.userEmail}</span>
      </p>

      <button
        onClick={onClose}
        className="btn-primary w-full"
      >
        Done
      </button>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="glass-card max-w-2xl w-full max-h-[90vh] overflow-y-auto custom-scrollbar p-8 relative animate-slide-up">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 btn-icon text-white/60 hover:text-white"
        >
          <X className="w-6 h-6" />
        </button>

        {step < 3 && (
          <div className="flex items-center justify-center mb-8 space-x-2">
            {[1, 2].map((s) => (
              <div
                key={s}
                className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                  s <= step ? 'bg-gradient-to-r from-primary-500 to-electric-500' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        )}

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default RentalBookingForm;
