const ProductModel = require('../models/productModel');

exports.getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.getAll(req.user.userId);
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const product = await ProductModel.getById(req.params.id, req.user.userId);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { categoryId, name, sku, description, price, minimumStock, imageUrl } = req.body;
    if (!categoryId || !name || !sku) return res.status(400).json({ error: 'Category ID, name, and SKU are required' });
    const productId = await ProductModel.create({ categoryId, name, sku, description, price, minimumStock, imageUrl }, req.user.userId);
    res.status(201).json({ message: 'Product created', productId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { categoryId, name, sku, description, price, minimumStock, imageUrl } = req.body;
    if (!categoryId || !name || !sku) return res.status(400).json({ error: 'Category ID, name, and SKU are required' });
    await ProductModel.update(req.params.id, { categoryId, name, sku, description, price, minimumStock, imageUrl }, req.user.userId);
    res.status(200).json({ message: 'Product updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    await ProductModel.delete(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};