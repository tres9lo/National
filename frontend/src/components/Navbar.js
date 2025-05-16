import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaBox, FaLayerGroup, FaClipboardList, FaBoxes, FaChartBar, FaSignInAlt, FaSignOutAlt, FaUserPlus } from 'react-icons/fa';

function Navbar({ isAuthenticated, onLogout }) {
  const navigate = useNavigate();

  console.log('Navbar props:', { isAuthenticated, onLogout }); // Debug log

  const handleLogout = () => {
    if (typeof onLogout !== 'function') {
      console.error('onLogout is not a function:', onLogout);
      return;
    }
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2 text-xl font-semibold">
              <FaHome /> TECTONA FURNITURE
            </Link>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <Link to="/" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaHome /> Home
                </Link>
                <Link to="/products" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaBox /> Products
                </Link>
                <Link to="/categories" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaLayerGroup /> Categories
                </Link>
                <Link to="/inventory" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaClipboardList /> Inventory
                </Link>
                <Link to="/stock-movements" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaBoxes /> Stock Movements
                </Link>
                <Link to="/reports" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaChartBar /> Reports
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition"
                >
                  <FaSignOutAlt /> Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaSignInAlt /> Login
                </Link>
                <Link to="/register" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-blue-700 transition">
                  <FaUserPlus /> Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;