import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Form from '../components/Form';
import ListItem from '../components/ListItem';
import ErrorMessage from '../components/ErrorMessage';
import SuccessMessage from '../components/SuccessMessage';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    name: '',
    sku: '',
    description: '',
    price: '',
    minimumStock: '',
    imageUrl: ''
  });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/categories', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Categories fetched:', response.data);
      setCategories(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Error fetching categories:', errorMsg);
      setError(errorMsg);
      setCategories([]);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/products', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      console.log('Products fetched:', response.data);
      setProducts(response.data || []);
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.message;
      console.error('Error fetching products:', errorMsg);
      setError(errorMsg);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = editId
      ? `http://localhost:5000/api/products/${editId}`
      : 'http://localhost:5000/api/products';
    const method = editId ? 'put' : 'post';

    console.log('Submitting form data:', formData);

    axios[method](url, formData, {
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
    })
      .then(() => {
        setSuccess(`Product ${editId ? 'updated' : 'created'} successfully`);
        setFormData({
          categoryId: '',
          name: '',
          sku: '',
          description: '',
          price: '',
          minimumStock: '',
          imageUrl: ''
        });
        setEditId(null);
        setIsModalOpen(false);
        fetchProducts();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || err.message;
        console.error('Error submitting product:', errorMsg);
        setError(errorMsg);
      });
  };

  const handleEdit = (product) => {
    console.log('Editing product:', product);
    setFormData({
      categoryId: product.categoryId || '',
      name: product.name || '',
      sku: product.sku || '',
      description: product.description || '',
      price: product.price || '',
      minimumStock: product.minimumStock || '',
      imageUrl: product.imageUrl || ''
    });
    setEditId(product.productId);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    console.log('Deleting product with ID:', id);
    axios
      .delete(`http://localhost:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      })
      .then(() => {
        setSuccess('Product deleted successfully');
        fetchProducts();
      })
      .catch(err => {
        const errorMsg = err.response?.data?.error || err.message;
        console.error('Error deleting product:', errorMsg);
        setError(errorMsg);
      });
  };

  if (error) return <ErrorMessage message={error} />;

  const formFields = [
    {
      name: 'categoryId',
      type: 'select',
      options:
        categories && Array.isArray(categories) && categories.length > 0
          ? categories.map(cat => ({
              value: cat.categoryId,
              label: cat.name || 'Unnamed Category'
            }))
          : []
    },
    'name',
    'sku',
    'description',
    'price',
    'minimumStock',
    'imageUrl'
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Products</h2>
        <button
          onClick={() => {
            setEditId(null);
            setFormData({
              categoryId: '',
              name: '',
              sku: '',
              description: '',
              price: '',
              minimumStock: '',
              imageUrl: ''
            });
            setIsModalOpen(true);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
        >
          Add New Product
        </button>
      </div>

      {success && <SuccessMessage message={success} onClose={() => setSuccess(null)} />}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">
                {editId ? 'Edit Product' : 'Add New Product'}
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
              fields={formFields}
              buttonText={editId ? 'Update Product' : 'Add Product'}
            />
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg p-6">
        {products.length > 0 ? (
          <div className="grid gap-4">
            {products.map(product => (
              <ListItem
                key={product.productId}
                item={
                  <div className="flex items-center">
                    {product.imageUrl && (
                      <img
                        src={product.imageUrl}
                        alt={product.name || 'Product Image'}
                        className="w-16 h-16 object-cover rounded-lg mr-4"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    )}
                    <div>
                      <h3 className="font-semibold text-lg">{product.name || 'Unnamed Product'}</h3>
                      <p className="text-gray-600">SKU: {product.sku || 'N/A'}</p>
                      <p className="text-green-600 font-semibold">${product.price || '0.00'}</p>
                    </div>
                  </div>
                }
                onEdit={() => handleEdit(product)}
                onDelete={() => handleDelete(product.productId)}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 py-8">No products found.</p>
        )}
      </div>
    </div>
  );
}

export default Products;