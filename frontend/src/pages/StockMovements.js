import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';
import { FaBoxes, FaArrowUp, FaArrowDown, FaTrash, FaClipboardList } from 'react-icons/fa';

function StockMovements() {
  const [stockMovements, setStockMovements] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  useEffect(() => {
    fetchStockMovements();
  }, []);

  const fetchStockMovements = () => {
    axios.get('http://localhost:5000/api/stockMovements/', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setStockMovements(res.data))
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/stockMovements/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setSuccess('Stock movement deleted successfully');
        fetchStockMovements();
      })
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <FaBoxes className="text-3xl text-blue-600" />
        <h2 className="text-3xl font-bold text-gray-800">Stock Movements</h2>
      </div>
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      {stockMovements.length > 0 ? (
        <div className="space-y-4 h-[600px] overflow-y-auto">
          {stockMovements.map(movement => (
            <div
              key={movement.movementId}
              className="bg-gray-50 p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {movement.type === 'IN' ? (
                    <FaArrowUp className="text-green-500 text-xl" />
                  ) : (
                    <FaArrowDown className="text-red-500 text-xl" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <FaClipboardList className="text-gray-600" />
                      <span className="font-semibold">Product: {movement.productName}</span>
                    </div>
                    <div className="text-gray-600 mt-1">
                      Quantity: {movement.quantity} ({movement.type})
                    </div>
                    <div className="text-gray-500 text-sm mt-1">
                      {movement.notes || 'No notes'}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(movement.movementId)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <FaBoxes className="text-5xl mx-auto mb-4 text-gray-400" />
          <p className="text-lg">No stock movements found.</p>
        </div>
      )}
    </div>
  );
}

export default StockMovements;