import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-[#180525] shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-pink-500 flex items-center gap-2">
            <Logo />
            
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Home
            </Link>
            <Link
              to="/problems"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Problems
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Leaderboard
            </Link>
          </div>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300 hidden sm:block">
                  Welcome, <span className="text-pink-400">{user.firstName}</span>
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg transition"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
