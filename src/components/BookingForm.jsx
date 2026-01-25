import { useState } from 'react';
import { Calendar, Clock, Zap, Car, User, Mail, Phone, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const BookingForm = ({ station, onClose, onBookingComplete }) => {
  const { user, createBooking } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingData, setBookingData] = useState({
    stationId: station?.id || '',
    stationName: station?.name || '',
    date: '',
    time: '',
    duration: '1',
    chargerType: station?.chargerTypes?.[0] || '',
    vehicleMake: '',
    vehicleModel: '',
    licensePlate: '',
    userName: user?.name || '',
    userEmail: user?.email || '',
    userPhone: user?.phone || ''
  });
  const [bookingReference, setBookingReference] = useState('');

  const handleInputChange = (e) => {
    setBookingData({
      ...bookingData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Prepare booking data for backend
      const bookingPayload = {
        station: {
          id: station.id,
          name: station.name,
          address: station.address,
          lat: station.location?.lat,
          lng: station.location?.lng
        },
        vehicle: {
          type: ` ${bookingData.vehicleMake} ${bookingData.vehicleModel}`,
          model: bookingData.licensePlate
        },
        bookingDate: new Date(bookingData.date).toISOString(),
        startTime: bookingData.time,
        duration: parseFloat(bookingData.duration) * 60, // Convert hours to minutes
        chargerType: bookingData.chargerType,
        estimatedCost: 0, // Calculate based on pricing if needed
        notes: `License Plate: ${bookingData.licensePlate}`
      };

      // Call backend API
      const result = await createBooking(bookingPayload);
      
      if (result.success) {
        // Generate booking reference from backend ID
        const ref = 'CS-' + result.booking._id.slice(-8).toUpperCase();
        setBookingReference(ref);
        setStep(3);
        
        // Call completion callback
        setTimeout(() => {
          if (onBookingComplete) {
            onBookingComplete({ ...bookingData, reference: ref });
          }
        }, 1500);
      } else {
        setError(result.error || 'Booking failed. Please try again.');
        setLoading(false);
      }
    } catch (err) {
      setError('Failed to create booking. Please try again.');
      setLoading(false);
      console.error('Booking error:', err);
    }
  };

  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getCurrentTime = () => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  };

  // Step 1: Station and Time Details
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Book Charging Slot</h3>
        <p className="text-white/60">at {station.name}</p>
      </div>

      <div className="glass-card-light p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-dark-700">Available Slots:</span>
          <span className="font-semibold text-dark-900">{station.availableSlots}/{station.totalSlots}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-dark-700">Pricing:</span>
          <span className="font-semibold text-primary-600">{station.pricing}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Calendar className="inline w-4 h-4 mr-1" />
            Date
          </label>
          <input
            type="date"
            name="date"
            value={bookingData.date}
            onChange={handleInputChange}
            min={getTodayDate()}
            required
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Clock className="inline w-4 h-4 mr-1" />
            Time
          </label>
          <input
            type="time"
            name="time"
            value={bookingData.time}
            onChange={handleInputChange}
            required
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            Duration (hours)
          </label>
          <select
            name="duration"
            value={bookingData.duration}
            onChange={handleInputChange}
            className="input-field"
          >
            <option value="0.5">30 minutes</option>
            <option value="1">1 hour</option>
            <option value="1.5">1.5 hours</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
            <option value="4">4 hours</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Zap className="inline w-4 h-4 mr-1" />
            Charger Type
          </label>
          <select
            name="chargerType"
            value={bookingData.chargerType}
            onChange={handleInputChange}
            className="input-field"
          >
            {station.chargerTypes.map((type, index) => (
              <option key={index} value={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={() => setStep(2)}
        disabled={!bookingData.date || !bookingData.time}
        className="btn-primary w-full"
      >
        Continue to Vehicle Details
      </button>
    </div>
  );

  // Step 2: Vehicle and User Details
  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold mb-2">Vehicle & Contact Details</h3>
        <p className="text-white/60">Complete your booking information</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/70 mb-2">
            <Car className="inline w-4 h-4 mr-1" />
            Vehicle Make
          </label>
          <input
            type="text"
            name="vehicleMake"
            value={bookingData.vehicleMake}
            onChange={handleInputChange}
            placeholder="e.g., Tesla"
            required
            className="input-field"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              Vehicle Model
            </label>
            <input
              type="text"
              name="vehicleModel"
              value={bookingData.vehicleModel}
              onChange={handleInputChange}
              placeholder="e.g., Model 3"
              required
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-white/70 mb-2">
              License Plate
            </label>
            <input
              type="text"
              name="licensePlate"
              value={bookingData.licensePlate}
              onChange={handleInputChange}
              placeholder="e.g., ABC-1234"
              required
              className="input-field"
            />
          </div>
        </div>

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
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 p-3 rounded-lg text-sm">
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
          disabled={!bookingData.userName || !bookingData.userEmail || !bookingData.userPhone || loading}
          className="btn-primary flex-1"
        >
          {loading ? 'Creating Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  // Step 3: Confirmation
  const renderStep3 = () => (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="bg-green-500/20 p-4 rounded-full">
          <CheckCircle className="w-16 h-16 text-green-400" />
        </div>
      </div>

      <div>
        <h3 className="text-3xl font-bold mb-2">Booking Confirmed!</h3>
        <p className="text-white/60">Your charging slot has been reserved</p>
      </div>

      <div className="glass-card-light p-6 space-y-4 text-left">
        <div className="text-center mb-4">
          <p className="text-sm text-dark-700 mb-1">Booking Reference</p>
          <p className="text-2xl font-bold text-primary-600">{bookingReference}</p>
        </div>

        <div className="border-t border-dark-300 pt-4 space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-dark-700">Station:</span>
            <span className="font-semibold text-dark-900">{bookingData.stationName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Date:</span>
            <span className="font-semibold text-dark-900">{bookingData.date}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Time:</span>
            <span className="font-semibold text-dark-900">{bookingData.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Duration:</span>
            <span className="font-semibold text-dark-900">{bookingData.duration} hour(s)</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Charger:</span>
            <span className="font-semibold text-dark-900">{bookingData.chargerType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-dark-700">Vehicle:</span>
            <span className="font-semibold text-dark-900">{bookingData.vehicleMake} {bookingData.vehicleModel}</span>
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

        {/* Progress Indicator */}
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

export default BookingForm;
