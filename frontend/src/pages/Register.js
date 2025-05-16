import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Form from '../components/Form';

function Register() {
  const [formData, setFormData] = useState({
    username: '',
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
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);
      if (response && response.data && response.data.token) {
        localStorage.setItem('token', response.data.token);
        navigate('/login');
      } else {
        throw new Error('No token received in response');
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Failed to register');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-4">Register</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <Form
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        buttonText="Register"
      />
    </div>
  );
}

export default Register;