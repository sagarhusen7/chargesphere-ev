import { useState } from 'react';
import { Menu, X, Zap, LogIn, UserPlus, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';
import ThemeToggle from './ThemeToggle';

const Header = ({ onLoginClick, onSignupClick, onProfileClick, onBookingsClick, onFavoritesClick, onDashboardClick, onAdminClick }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, isAdmin } = useAuth();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Find Stations', href: '#map' },
    { name: 'Book Charging', href: '#booking' },
    { name: 'Rent Vehicles', href: '#rentals' },
  ];

  // Add Admin Dashboard link for admin users
  if (isAuthenticated && isAdmin()) {
    navItems.push({
      name: 'Admin Dashboard',
      href: '#admin',
      icon: LayoutDashboard,
      onClick: onAdminClick
    });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ChargeSphere</span>
            </div>
            <ThemeToggle />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.onClick) {
                    e.preventDefault();
                    item.onClick();
                  }
                }}
                className="text-white/80 hover:text-white transition-colors duration-200 font-medium flex items-center space-x-2"
              >
                {item.icon && <item.icon className="w-4 h-4" />}
                <span>{item.name}</span>
              </a>
            ))}
            
            {/* Auth Buttons / User Menu */}
            {isAuthenticated ? (
              <UserMenu
                onProfileClick={onProfileClick}
                onBookingsClick={onBookingsClick}
                onFavoritesClick={onFavoritesClick}
                onDashboardClick={onDashboardClick}
              />
            ) : (
              <div className="flex items-center space-x-3">
                <button 
                  onClick={onLoginClick}
                  className="flex items-center space-x-2 px-4 py-2 text-white/80 hover:text-white transition-colors font-medium"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Login</span>
                </button>
                <button 
                  onClick={onSignupClick}
                  className="btn-primary flex items-center space-x-2"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Sign Up</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {isAuthenticated && (
              <UserMenu
                onProfileClick={onProfileClick}
                onBookingsClick={onBookingsClick}
                onFavoritesClick={onFavoritesClick}
                onDashboardClick={onDashboardClick}
              />
            )}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="btn-icon text-white"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 animate-slide-down">
            <div className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-white/80 hover:text-white transition-colors duration-200 font-medium px-2 py-1 flex items-center space-x-2"
                  onClick={(e) => {
                    if (item.onClick) {
                      e.preventDefault();
                      item.onClick();
                    }
                    setIsMenuOpen(false);
                  }}
                >
                  {item.icon && <item.icon className="w-4 h-4" />}
                  <span>{item.name}</span>
                </a>
              ))}
              
              {/* Mobile Auth Buttons */}
              {!isAuthenticated && (
                <div className="flex flex-col space-y-2 pt-2">
                  <button 
                    onClick={() => {
                      onLoginClick();
                      setIsMenuOpen(false);
                    }}
                    className="btn-secondary w-full flex items-center justify-center space-x-2"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Login</span>
                  </button>
                  <button 
                    onClick={() => {
                      onSignupClick();
                      setIsMenuOpen(false);
                    }}
                    className="btn-primary w-full flex items-center justify-center space-x-2"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Sign Up</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
