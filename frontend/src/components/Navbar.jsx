import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 text-white p-2 rounded-lg font-bold text-lg flex items-center justify-center w-9 h-9">
              💼
            </div>
            <span className="font-bold text-xl text-gray-900 tracking-tight">
              Job Application Tracker
            </span>
          </div>

          {/* User Info & Actions */}
          {isAuthenticated && (
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700 hidden sm:inline-block">
                Welcome, <span className="text-blue-600 font-semibold">{user?.name || "User"}</span>
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3.5 py-1.5 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
