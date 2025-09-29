import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, BookOpen } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsProfileOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-transparent backdrop-blur-md border-b border-white/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-orange-600" />
            <span className="text-xl font-bold text-orange-800">SuchBliss</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <Link
              to="/"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-orange-800 hover:text-orange-600'
              }`}
            >
              Home
            </Link>
            <Link
              to="/pricing"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/pricing') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-orange-800 hover:text-orange-600'
              }`}
            >
              Pricing
            </Link>
            <Link
              to="/blog"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/blog') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-orange-800 hover:text-orange-600'
              }`}
            >
              Blog
            </Link>
            <Link
              to="/events"
              className={`px-3 py-2 text-sm font-medium transition-colors ${
                isActive('/events') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-orange-800 hover:text-orange-600'
              }`}
            >
              Events
            </Link> 
            {user && (
              <Link
                to="/live-classes"
                className={`px-3 py-2 text-sm font-medium transition-colors ${
                  isActive('/live-classes') ? 'text-orange-600 border-b-2 border-orange-600' : 'text-orange-800 hover:text-orange-600'
                }`}
              >
                Live Classes
              </Link>
            )}
          </nav>

          {/* User Menu / Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center space-x-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition-colors"
                >
                  <User className="h-4 w-4" />
                  <span className="text-sm font-medium">{user.name}</span>
                </button>
                
                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border">
                    <div className="p-4 border-b">
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <p className="text-xs text-orange-600 capitalize">{user.plan} Plan</p>
                    </div>
                    <div className="py-2">
                      <Link
                        to={user.role === 'admin' ? '/admin' : '/dashboard'}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Dashboard
                      </Link>
                      <Link
                        to="/referrals"
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        Referrals
                      </Link>
                      {user.email === 'admin@SuchBliss.com' && (
                        <Link
                          to="/admin"
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          Admin Panel
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-orange-800 hover:text-orange-600 text-sm font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-orange-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-orange-800 hover:text-orange-600"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-orange-800 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/pricing"
                className="block px-3 py-2 text-base font-medium text-orange-800 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                to="/blog"
                className="block px-3 py-2 text-base font-medium text-orange-800 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Blog
              </Link>
              <Link
                to="/events"
                className="block px-3 py-2 text-base font-medium text-orange-800 hover:text-orange-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Events
              </Link> 
              {user && (
                <Link
                  to="/live-classes"
                  className="block px-3 py-2 text-base font-medium text-orange-800 hover:text-orange-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Live Classes
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;