import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaBox, FaLayerGroup, FaClipboardList } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection

function Home() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalCategories: 0,
    totalInventory: 0
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const token = localStorage.getItem('token');
    console.log('Token:', token); // Debug log
    if (!token) {
      setError('You are not authenticated. Please log in.');
      navigate('/login'); // Redirect to login if no token
      return;
    }

    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/home/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Stats response:', response.data); // Debug log
      setStats(response.data);
    } catch (err) {
      console.error('Error fetching stats:', err.response?.data || err.message); // Debug log
      setError(err.response?.data?.error || 'Failed to fetch dashboard stats.');
      if (err.response?.status === 401) {
        navigate('/login'); // Redirect to login on 401 Unauthorized
      }
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <div className="text-center text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to Inventory Management</h1>
      <div>
        <h3 className="flex items-center justify-center text-gray-500">What You Can Perform Using This System</h3>
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto mt-4">
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FaBox className="text-blue-500" /> Manage Products
              </h3>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Total Products: ${stats.totalProducts}`}
              </p>
              <p className="text-gray-600 mt-1">Add, edit, and organize your product inventory</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FaLayerGroup className="text-blue-500" /> Manage Categories
              </h3>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Total Categories: ${stats.totalCategories}`}
              </p>
              <p className="text-gray-600 mt-1">Create and manage product categories</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-lg mb-2 flex items-center gap-2">
                <FaClipboardList className="text-blue-500" /> Track Inventory
              </h3>
              <p className="text-gray-600">
                {loading ? 'Loading...' : `Total Inventory Items: ${stats.totalInventory}`}
              </p>
              <p className="text-gray-600 mt-1">Monitor stock levels and inventory status</p>
            </div>
          </div>    
        </div>
      </div>
    </div>
  );
}

export default Home;