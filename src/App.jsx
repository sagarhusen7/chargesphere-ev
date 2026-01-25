import { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MapPage from './pages/MapPage';
import RentalPage from './pages/RentalPage';
import Dashboard from './pages/Dashboard';
import AdminBookings from './components/AdminBookings';
import BookingForm from './components/BookingForm';
import RentalBookingForm from './components/RentalBookingForm';
import LoginModal from './components/LoginModal';
import SignupModal from './components/SignupModal';

function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'dashboard', or 'admin'
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [showRentalBookingForm, setShowRentalBookingForm] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [selectedStation, setSelectedStation] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);

  const handleBookStation = (station) => {
    setSelectedStation(station);
    setShowBookingForm(true);
  };

  const handleRentVehicle = (vehicle) => {
    setSelectedVehicle(vehicle);
    setShowRentalBookingForm(true);
  };

  const handleCloseBookingForm = () => {
    setShowBookingForm(false);
    setSelectedStation(null);
  };

  const handleCloseRentalBookingForm = () => {
    setShowRentalBookingForm(false);
    setSelectedVehicle(null);
  };

  const handleBookingComplete = (bookingData) => {
    console.log('Booking completed:', bookingData);
    // Booking is automatically saved to user history via AuthContext
  };

  const handleRentalBookingComplete = (bookingData) => {
    console.log('Rental booking completed:', bookingData);
    // Rental booking is automatically saved to user history via AuthContext
  };

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  // Placeholder functions for user menu actions
  const handleProfileClick = () => {
    console.log('Profile clicked');
    // TODO: Implement profile modal/page
  };

  const handleBookingsClick = () => {
    console.log('Bookings clicked');
    // TODO: Implement bookings history modal/page
  };

  const handleFavoritesClick = () => {
    console.log('Favorites clicked');
    // TODO: Implement favorites modal/page
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
    // Scroll to top when switching views
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Header 
          onLoginClick={() => setShowLoginModal(true)}
          onSignupClick={() => setShowSignupModal(true)}
          onProfileClick={handleProfileClick}
          onBookingsClick={handleBookingsClick}
          onFavoritesClick={handleFavoritesClick}
          onDashboardClick={handleDashboardClick}
          onAdminClick={handleAdminClick}
        />
        
        <main>
          {currentView === 'home' ? (
            <>
              <HeroSection />
              <MapPage onBookClick={handleBookStation} />
              <RentalPage onRentClick={handleRentVehicle} />
            </>
          ) : currentView === 'admin' ? (
            <AdminBookings onBackToHome={handleBackToHome} />
          ) : (
            <Dashboard onBackToHome={handleBackToHome} />
          )}
        </main>

        <Footer />

        {/* Booking Modals */}
        {showBookingForm && selectedStation && (
          <BookingForm
            station={selectedStation}
            onClose={handleCloseBookingForm}
            onBookingComplete={handleBookingComplete}
          />
        )}

        {showRentalBookingForm && selectedVehicle && (
          <RentalBookingForm
            vehicle={selectedVehicle}
            onClose={handleCloseRentalBookingForm}
            onBookingComplete={handleRentalBookingComplete}
          />
        )}

        {/* Auth Modals */}
        {showLoginModal && (
          <LoginModal
            onClose={() => setShowLoginModal(false)}
            onSwitchToSignup={handleSwitchToSignup}
          />
        )}

        {showSignupModal && (
          <SignupModal
            onClose={() => setShowSignupModal(false)}
            onSwitchToLogin={handleSwitchToLogin}
          />
        )}
      </div>
    </AuthProvider>
  );
}

export default App;
