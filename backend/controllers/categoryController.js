const CategoryModel = require('../models/categoryModel');

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await CategoryModel.getAll(req.user.userId);
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const category = await CategoryModel.getById(req.params.id, req.user.userId);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    const categoryId = await CategoryModel.create({ name, description }, req.user.userId);
    res.status(201).json({ message: 'Category created', categoryId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    if (!name) return res.status(400).json({ error: 'Name is required' });
    await CategoryModel.update(req.params.id, { name, description }, req.user.userId);
    res.status(200).json({ message: 'Category updated' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    await CategoryModel.delete(req.params.id, req.user.userId);
    res.status(200).json({ message: 'Category deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};