import { Link, useLocation } from 'react-router-dom';
import { Sparkles, Calendar, Home, Layers } from 'lucide-react';

export default function Navbar() {
  const location = useLocation();

  // Removed Admin from the primary client navigation array
  const navLinks = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Services', path: '/services', icon: Layers },
    { name: 'Book Now', path: '/book', icon: Calendar },
  ];

  return (
    <nav className="bg-brandDark/90 backdrop-blur-md border-b border-brandGold/30 sticky top-0 z-50 px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center gap-2 text-2xl font-extrabold text-brandGold tracking-wider">
        <Sparkles className="text-brandPink w-7 h-7 animate-pulse" />
        LUXE<span className="text-brandPink">AURA</span>
      </Link>

      <div className="flex gap-6">
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
    </nav>
  );
}