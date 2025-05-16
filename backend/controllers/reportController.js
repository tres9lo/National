const StockMovementModel = require('../models/stockMovementModel');

exports.generateReport = async (req, res) => {
  try {
    const { startDate, endDate, productId, type } = req.body;
    console.log('Request body:', { startDate, endDate, productId, type }); // Debug log

    // Validate input
    if (!startDate || !endDate) {
      return res.status(400).json({ error: 'Start date and end date are required' });
    }

    // Ensure dates are in correct format (YYYY-MM-DD)
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    // Ensure end date is not before start date
    if (end < start) {
      return res.status(400).json({ error: 'End date cannot be before start date' });
    }

    // If type is provided, ensure it's valid
    if (type && !['IN', 'OUT'].includes(type)) {
      return res.status(400).json({ error: 'Type must be either "IN" or "OUT"' });
    }

    const report = await StockMovementModel.getReport(req.user.userId, startDate, endDate, productId, type);
    console.log('Report data:', report); // Debug log
    res.status(200).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: error.message });
  }
};