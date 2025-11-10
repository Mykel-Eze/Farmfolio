// File: src/components/Header.jsx
import React from 'react';
import { LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/">
              <img src="/farmfolio.png" alt="Farmfolio Logo" className="w-[120px]" />
            </Link>
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-2">
            <Link to="/marketplace" className="nav-marketplace-link flex items-center px-4 py-2 bg-gradient-to-br from-[#83aa45] to-[#a0ad5f] text-white rounded-md">
              <img src="/market-white.png" alt="Marketplace" className="h-4 w-4 mr-2" />
              Markeplace
            </Link>
            <button
              onClick={onLogout}
              className="flex items-center px-2 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;