
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    setIsMenuOpen(false);
  };

  return (
    <nav className="bg-gray-800 text-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl font-bold">
            CodeSolve
          </Link>
          
          <div className="hidden md:flex space-x-6">
            <Link to="/" className="hover:text-gray-300 transition-colors">
              Home
            </Link>
            
            {user && (
              <>
                <Link to="/problems" className="hover:text-gray-300 transition-colors">
                  Problems
                </Link>
                <Link to="/profile" className="hover:text-gray-300 transition-colors">
                  Profile
                </Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="hover:text-gray-300 transition-colors">
                    Admin
                  </Link>
                )}
              </>
            )}
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-300">Hello, {user.firstName}</span>
                <button 
                  onClick={handleLogout}
                  className="bg-transparent hover:bg-gray-700 text-white font-medium py-1 px-3 border border-white rounded-md transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex space-x-2">
                <Link to="/login" className="bg-transparent hover:bg-gray-700 text-white font-medium py-1 px-3 border border-white rounded-md transition-colors">
                  Login
                </Link>
                <Link to="/register" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md transition-colors">
                  Register
                </Link>
              </div>
            )}
          </div>

          <button 
            className="md:hidden focus:outline-none"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-4">
            <div className="flex flex-col space-y-3">
              <Link to="/" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                Home
              </Link>
              
              {user && (
                <>
                  <Link to="/problems" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Problems
                  </Link>
                  <Link to="/profile" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                    Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link to="/admin" className="hover:text-gray-300 transition-colors" onClick={() => setIsMenuOpen(false)}>
                      Admin
                    </Link>
                  )}
                </>
              )}
              
              {user ? (
                <div className="pt-4 border-t border-gray-700">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Hello, {user.firstName}</span>
                    <button 
                      onClick={handleLogout}
                      className="bg-transparent hover:bg-gray-700 text-white font-medium py-1 px-3 border border-white rounded-md transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-gray-700 flex space-x-2">
                  <Link to="/login" className="flex-1 bg-transparent hover:bg-gray-700 text-white font-medium py-1 px-3 border border-white rounded-md text-center transition-colors">
                    Login
                  </Link>
                  <Link to="/register" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-1 px-3 rounded-md text-center transition-colors">
                    Register
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;