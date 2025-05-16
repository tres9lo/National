import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import ListItem from '../components/ListItem';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function Reports() {
  const [products, setProducts] = useState([]);
  const [report, setReport] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    productId: '',
    type: ''
  });
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setProducts(response.data);
      console.log('Fetched products:', response.data); // Debug log
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to fetch products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    if (!formData.startDate || !formData.endDate) {
      setError('Both start date and end date are required.');
      return;
    }
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      setError('Invalid date format. Please use YYYY-MM-DD.');
      return;
    }
    if (end < start) {
      setError('End date cannot be before start date.');
      return;
    }

    try {
      setLoading(true);
      const response = await axios.post(
        'http://localhost:5000/api/reports',
        formData,
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
      );
      console.log('Report response:', response.data); // Debug log
      setReport(response.data);
      setSuccess('Report generated successfully');
      setShowForm(false);
    } catch (err) {
      console.error('Report error:', err.response?.data || err.message); // Debug log
      setError(err.response?.data?.error || 'Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setFormData({
      startDate: '',
      endDate: '',
      productId: '',
      type: ''
    });
    setReport([]);
    setSuccess(null);
    setError(null);
  };

  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="p-4 max-w-7xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Stock Movement Reports</h2>
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {loading && <p className="text-blue-600 mb-4">Loading...</p>}
      
      <button 
        onClick={() => setShowForm(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 transition duration-200"
      >
        Create Report
      </button>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md mx-4 relative transform transition-all duration-300">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 focus:outline-none"
              aria-label="Close modal"
            >
              ✕
            </button>
            <h3 className="text-lg font-medium mb-4 text-gray-800">Generate Report</h3>
            <Form
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              fields={[
                { name: 'startDate', type: 'date', label: 'Start Date' },
                { name: 'endDate', type: 'date', label: 'End Date' },
                { 
                  name: 'productId', 
                  type: 'select', 
                  label: 'Product',
                  options: [{ value: '', label: 'All Products' }, ...products.map(prod => ({ value: prod.productId, label: prod.name }))]
                },
                { 
                  name: 'type', 
                  type: 'select', 
                  label: 'Type',
                  options: [
                    { value: '', label: 'All Types' },
                    { value: 'IN', label: 'Stock In' },
                    { value: 'OUT', label: 'Stock Out' }
                  ]
                }
              ]}
              buttonText="Generate Report"
              additionalButton={{
                text: 'Clear',
                onClick: handleClear,
                className: 'bg-gray-500 hover:bg-gray-600 text-white'
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">Report Results</h3>
        {report.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Product</th>
                  <th className="py-3 px-6 text-left">Quantity</th>
                  <th className="py-3 px-6 text-left">Type</th>
                  <th className="py-3 px-6 text-left">Date</th>
                  <th className="py-3 px-6 text-left">Notes</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {report.map(movement => (
                  <tr key={movement.movementId} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6">{movement.productName}</td>
                    <td className="py-3 px-6">{movement.quantity}</td>
                    <td className="py-3 px-6">{movement.type}</td>
                    <td className="py-3 px-6">{new Date(movement.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-6">{movement.notes || 'None'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-gray-500 italic">No stock movements found for the selected criteria. Generate a report or adjust your filters.</p>
        )}
      </div>
    </div>
  );
}

export default Reports;