// File: src/components/Header.jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ onLogout }) => {
  return (
    <header className="bg-white shadow-sm sticky">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/farmfolio.png" alt="Farmfolio Logo" className="w-[120px]" />
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onLogout}
              className="flex items-center px-4 py-2 text-sm text-gray-700 hover:text-red-600 transition-colors"
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