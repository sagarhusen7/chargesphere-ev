import { Zap, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-900 border-t border-white/10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-primary-500 to-electric-500 p-2 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">ChargeSphere</span>
            </div>
            <p className="text-white/60 text-sm">
              Your all-in-one platform for EV charging station discovery, booking, and vehicle rentals.
              Driving the future of sustainable mobility.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="btn-icon text-white/60 hover:text-primary-400">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="btn-icon text-white/60 hover:text-primary-400">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="btn-icon text-white/60 hover:text-primary-400">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="btn-icon text-white/60 hover:text-primary-400">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#home" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">
                  Home
                </a>
              </li>
              <li>
                <a href="#map" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">
                  Find Stations
                </a>
              </li>
              <li>
                <a href="#booking" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">
                  Book Charging
                </a>
              </li>
              <li>
                <a href="#rentals" className="text-white/60 hover:text-white transition-colors duration-200 text-sm">
                  Rent Vehicles
                </a>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-semibold mb-4">Services</h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">EV Charging Stations</li>
              <li className="text-white/60 text-sm">Fuel Stations</li>
              <li className="text-white/60 text-sm">Slot Booking</li>
              <li className="text-white/60 text-sm">Vehicle Rentals</li>
              <li className="text-white/60 text-sm">EV Fleet Management</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-2 text-white/60 text-sm">
                <Mail className="w-4 h-4" />
                <span>info@chargesphere.com</span>
              </li>
              <li className="flex items-center space-x-2 text-white/60 text-sm">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-start space-x-2 text-white/60 text-sm">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>123 EV Street, New York, NY 10001</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/40 text-sm">
            © {currentYear} ChargeSphere. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-white/40 hover:text-white text-sm transition-colors duration-200">
              Cookie Policy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
