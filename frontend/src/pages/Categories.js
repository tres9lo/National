import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import ListItem from '../components/ListItem';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [editId, setEditId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    axios.get('http://localhost:5000/api/categories', {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(res => setCategories(res.data))
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId ? `http://localhost:5000/api/categories/${editId}` : 'http://localhost:5000/api/categories';
    const method = editId ? 'put' : 'post';

    axios[method](url, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setSuccess(`Category ${editId ? 'updated' : 'created'} successfully`);
        setFormData({ name: '', description: '' });
        setEditId(null);
        setIsModalOpen(false);
        fetchCategories();
      })
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  const handleEdit = (category) => {
    setFormData({ name: category.name, description: category.description });
    setEditId(category.categoryId);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    axios.delete(`http://localhost:5000/api/categories/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setSuccess('Category deleted successfully');
        fetchCategories();
      })
      .catch(err => setError(err.response?.data?.error || err.message));
  };

  if (error) return <ErrorMessage message={error} />;
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Categories</h2>
        <button
          onClick={() => {
            setFormData({ name: '', description: '' });
            setEditId(null);
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Category
        </button>
      </div>
      
      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}
      
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editId ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <Form
              formData={formData}
              setFormData={setFormData}
              onSubmit={handleSubmit}
              fields={['name', 'description']}
              buttonText={editId ? 'Update Category' : 'Add Category'}
            />
          </div>
        </div>
      )}

      {categories.length > 0 ? (
        <div className="bg-white rounded-lg shadow">
          <ul className="divide-y divide-gray-200">
            {categories.map(category => (
              <ListItem
                key={category.categoryId}
                item={`${category.name} - ${category.description || 'No description'}`}
                onEdit={() => handleEdit(category)}
                onDelete={() => handleDelete(category.categoryId)}
              />
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-8">No categories found.</p>
      )}
    </div>
  );
}

export default Categories;