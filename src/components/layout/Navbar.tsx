import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, BarChart2, DollarSign, PieChart, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navbar: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white border-b border-gray-200 fixed w-full z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <DollarSign className="h-6 w-6 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">CS425Demo</span>
            </Link>
          </div>

          {isAuthenticated && (
            <>
              {/* Desktop navigation */}
              <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
                <Link to="/dashboard" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/expenses" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Expenses
                </Link>
                <Link to="/budgets" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Budgets
                </Link>
                <Link to="/reports" className="text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                  Reports
                </Link>
              </div>

              <div className="hidden sm:ml-6 sm:flex sm:items-center">
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  <LogOut className="h-4 w-4 mr-1" />
                  Logout
                </button>
              </div>
            </>
          )}

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && isAuthenticated && (
        <div className="sm:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/dashboard"
              className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Dashboard
            </Link>
            <Link
              to="/expenses"
              className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <DollarSign className="h-5 w-5 mr-2" />
              Expenses
            </Link>
            <Link
              to="/budgets"
              className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <PieChart className="h-5 w-5 mr-2" />
              Budgets
            </Link>
            <Link
              to="/reports"
              className="flex items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              <BarChart2 className="h-5 w-5 mr-2" />
              Reports
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMenuOpen(false);
              }}
              className="flex w-full items-center text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-md text-base font-medium"
            >
              <LogOut className="h-5 w-5 mr-2" />
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;