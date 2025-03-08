
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BarChart2, Users, LogOut } from 'lucide-react';

const NavBar = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { path: '/dashboard', name: 'Dashboard', icon: <BarChart2 className="w-5 h-5" /> },
    { path: '/users', name: 'Users', icon: <Users className="w-5 h-5" /> },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
    }`}>
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/dashboard" 
            className="text-xl font-semibold tracking-tight transition-opacity hover:opacity-80"
          >
            <span className="text-primary">Elegance</span>
            <span className="text-foreground">OS</span>
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary/80'
                }`}
              >
                {link.icon}
                <span className="ml-2">{link.name}</span>
              </Link>
            ))}
          </nav>

          {/* User menu */}
          {user && (
            <div className="flex items-center space-x-4">
              <div className="hidden md:flex items-center">
                <img
                  src={user.avatar || 'https://i.pravatar.cc/150?img=1'}
                  alt="User avatar"
                  className="w-8 h-8 rounded-full object-cover border border-border"
                />
                <span className="ml-2 text-sm font-medium">{user.name}</span>
              </div>
              
              <button
                onClick={logout}
                className="rounded-full p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                aria-label="Logout"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default NavBar;
