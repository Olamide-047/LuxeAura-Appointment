import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Home, Layers, Menu, X } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Layers },
    { name: 'Book Now', path: '/book', icon: Calendar },
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close menu when clicking outside the navbar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <div ref={navRef} className="sticky top-0 z-50">
      <nav className="bg-brandDark/90 backdrop-blur-md border-b border-brandGold/30 px-6 py-4 flex justify-between items-center relative z-50">
        {/* Brand Logo */}
        <Link 
          to="/" 
          onClick={closeMobileMenu}
          className="flex items-center gap-2 text-2xl font-extrabold text-brandGold tracking-wider"
        >
          <Sparkles className="text-brandPink w-7 h-7 animate-pulse" />
          LUXE<span className="text-brandPink">AURA</span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex gap-6">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition ${
                  isActive
                    ? 'bg-brandPink text-white shadow-lg shadow-brandPink/30'
                    : 'text-gray-300 hover:text-brandGold'
                }`}
              >
                <Icon className="w-4 h-4" />
                {link.name}
              </Link>
            );
          })}
        </div>

        {/* Hamburger Toggle Button */}
        <button
          type="button"
          onClick={toggleMobileMenu}
          aria-label="Toggle navigation menu"
          className="md:hidden text-gray-300 hover:text-brandGold focus:outline-none p-1 transition"
        >
          {isMobileMenuOpen ? (
            <X className="w-7 h-7 text-brandGold" />
          ) : (
            <Menu className="w-7 h-7 text-brandGold" />
          )}
        </button>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-brandDark/95 border-b border-brandGold/30 backdrop-blur-md md:hidden flex flex-col p-4 space-y-3 shadow-xl z-50">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-base font-medium transition ${
                    isActive
                      ? 'bg-brandPink text-white shadow-md shadow-brandPink/20'
                      : 'text-gray-300 hover:bg-brandGold/10 hover:text-brandGold'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.name}
                </Link>
              );
            })}
          </div>
        )}
      </nav>

      {/* Screen Backdrop Overlay */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 md:hidden"
        />
      )}
    </div>
  );
}