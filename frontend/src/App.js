import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import Categories from './pages/Categories';
import Inventory from './pages/Inventory';
import StockMovements from './pages/StockMovements';
import Reports from './pages/Reports';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Initialize from localStorage on mount
    return !!localStorage.getItem('token');
  });

  useEffect(() => {
    // Sync state with localStorage on mount and changes
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsAuthenticated(!!token);
    };

    // Check initial state
    checkAuth();

    // Add event listener for storage changes (e.g., from other tabs)
    window.addEventListener('storage', checkAuth);

    // Cleanup listener on unmount
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  const handleLogin = () => {
    const token = localStorage.getItem('token');
    console.log('Login successful, token found:', token); // Debug log
    setIsAuthenticated(!!token);
  };

  const handleLogout = () => {
    console.log('Logging out, removing token'); // Debug log
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <BrowserRouter>
      <Navbar isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route
          path="/register"
          element={isAuthenticated ? <Navigate to="/" /> : <Register />}
        />
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/products"
          element={isAuthenticated ? <Products /> : <Navigate to="/login" />}
        />
        <Route
          path="/categories"
          element={isAuthenticated ? <Categories /> : <Navigate to="/login" />}
        />
        <Route
          path="/inventory"
          element={isAuthenticated ? <Inventory /> : <Navigate to="/login" />}
        />
        <Route
          path="/stock-movements"
          element={isAuthenticated ? <StockMovements /> : <Navigate to="/login" />}
        />
        <Route
          path="/reports"
          element={isAuthenticated ? <Reports /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;