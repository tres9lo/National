import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import ListItem from '../components/ListItem';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function Inventory() {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ productId: '', quantity: '', type: 'IN', notes: '' });
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = () => {
    axios.get('http://localhost:5000/api/inventory', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setInventory(res.data))
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  const fetchProducts = () => {
    axios.get('http://localhost:5000/api/products', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setProducts(res.data))
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:5000/api/inventory/stock', formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => {
        setSuccess(res.data.message);
        setFormData({ productId: '', quantity: '', type: 'IN', notes: '' });
        setIsModalOpen(false);
        fetchInventory();
      })
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Inventory</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition duration-200"
        >
          Add Stock Movement
        </button>
      </div>
      
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Stock Movement</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>
            <Form
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              fields={[
                { name: 'productId', type: 'select', options: products.map(prod => ({ value: prod.productId, label: prod.name })) },
                'quantity',
                { name: 'type', type: 'select', options: [{ value: 'IN', label: 'Stock In' }, { value: 'OUT', label: 'Stock Out' }] },
                'notes'
              ]}
              buttonText="Submit Stock Movement"
            />
          </div>
        </div>
      )}

      {inventory.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {inventory.map(item => (
              <ListItem
                key={item.inventoryId}
                item={
                  <div className="py-4 px-6">
                    <span className="font-medium">Product: {products.find(p => p.productId === item.productId)?.name || 'Unknown'}</span>
                    <span className="ml-4">Quantity: {item.quantity}</span>
                  </div>
                }
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No inventory items found.</p>
      )}
    </div>
  );
}

export default Inventory;