import { useState, useRef, useEffect } from 'react';
import { 
  User, 
  LogOut, 
  Heart, 
  Calendar, 
  Settings, 
  Shield,
  LayoutDashboard,
  MapPin,
  Car,
  Users,
  BarChart3,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const UserMenu = ({ onProfileClick, onBookingsClick, onFavoritesClick, onDashboardClick }) => {
  const { user, logout, isAdmin } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (confirm('Are you sure you want to logout?')) {
      logout();
      setIsOpen(false);
    }
  };

  const handleMenuClick = (action) => {
    setIsOpen(false);
    action();
  };

  const getInitials = (name) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const customerMenuItems = [
    { icon: User, label: 'My Profile', onClick: onProfileClick },
    { icon: Calendar, label: 'Booking History', onClick: onBookingsClick },
    { icon: Heart, label: 'Favorite Stations', onClick: onFavoritesClick },
    { icon: Settings, label: 'Settings', onClick: () => {} }
  ];

  const adminMenuItems = [
    { icon: User, label: 'My Profile', onClick: onProfileClick },
    { icon: LayoutDashboard, label: 'Dashboard', onClick: onDashboardClick },
    { icon: MapPin, label: 'Manage Stations', onClick: () => {} },
    { icon: Car, label: 'Manage Vehicles', onClick: () => {} },
    { icon: Users, label: 'Manage Users', onClick: () => {} },
    { icon: BarChart3, label: 'Analytics', onClick: () => {} }
  ];

  const menuItems = isAdmin() ? adminMenuItems : customerMenuItems;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all"
      >
        <div className={`w-9 h-9 rounded-full flex items-center justify-center font-semibold text-sm ${
          isAdmin() 
            ? 'bg-gradient-to-br from-electric-500 to-electric-600' 
            : 'bg-gradient-to-br from-primary-500 to-primary-600'
        }`}>
          {getInitials(user.name)}
        </div>
        <div className="hidden md:block text-left">
          <div className="flex items-center space-x-2">
            <p className="text-white font-medium text-sm">{user.name}</p>
            {isAdmin() && (
              <span className="px-2 py-0.5 bg-electric-500/20 text-electric-400 text-xs rounded-full font-medium">
                Admin
              </span>
            )}
          </div>
          <p className="text-white/50 text-xs">{user.email}</p>
        </div>
        <ChevronDown className={`w-4 h-4 text-white/60 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glass-card border border-white/10 rounded-xl overflow-hidden animate-slide-down z-50">
          {/* User Info */}
          <div className="p-4 border-b border-white/10">
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
                isAdmin() 
                  ? 'bg-gradient-to-br from-electric-500 to-electric-600' 
                  : 'bg-gradient-to-br from-primary-500 to-primary-600'
              }`}>
                {getInitials(user.name)}
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <p className="text-white font-semibold">{user.name}</p>
                  {isAdmin() && <Shield className="w-4 h-4 text-electric-400" />}
                </div>
                <p className="text-white/50 text-sm">{user.email}</p>
                <p className="text-white/40 text-xs mt-1">
                  {isAdmin() ? 'Administrator' : 'Customer'}
                </p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            {menuItems.map((item, index) => (
              <button
                key={index}
                onClick={() => handleMenuClick(item.onClick)}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 transition-colors text-left group"
              >
                <item.icon className="w-5 h-5 text-white/60 group-hover:text-primary-400 transition-colors" />
                <span className="text-white/80 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              </button>
            ))}
          </div>

          {/* Logout */}
          <div className="p-2 border-t border-white/10">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-red-500/10 transition-colors text-left group"
            >
              <LogOut className="w-5 h-5 text-white/60 group-hover:text-red-400 transition-colors" />
              <span className="text-white/80 group-hover:text-red-400 transition-colors">
                Logout
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
