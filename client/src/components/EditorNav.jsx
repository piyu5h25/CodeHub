import React from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';

const EditorNav = () => {
 

  return (
    <nav className="bg-[#180525] shadow-md border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-15">
          {/* Logo */}
          <Link to="/" className="text-2xl font-bold text-pink-500 flex items-center gap-2">
            <Logo />
            
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex pr-10 space-x-8">
            
            <Link
              to="/problems"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Problems
            </Link>
            <Link
              to="/compiler"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Compiler
            </Link>
            <Link
              to="/leaderboard"
              className="text-gray-300 hover:text-pink-500 transition font-medium"
            >
              Leaderboard
            </Link>
          </div>

          
        </div>
      </div>
    </nav>
  );
};

export default EditorNav