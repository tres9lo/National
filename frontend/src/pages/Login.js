import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', formData);
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin();
        navigate('/');
      } else {
        throw new Error('No token received in response');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to login');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Form
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Login"
      />
    </div>
  );
}

export default Login;