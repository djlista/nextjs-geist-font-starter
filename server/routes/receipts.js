const express = require('express');
const router = express.Router();
const Receipt = require('../models/Receipt');
const { validateDriverCompliance } = require('../middleware/driverValidation');

// POST endpoint for receipt creation with compliance validation
router.post('/', validateDriverCompliance, async (req, res) => {
  try {
    const { driverId, terminalId, products, quantity, notes } = req.body;
    
    // Validate required fields
    if (!driverId || !terminalId || !products || !quantity) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    // Create new receipt
    const newReceipt = await Receipt.create({
      driver: driverId,
      terminal: terminalId,
      products,
      quantity,
      notes,
      status: 'pending',
      createdBy: req.user.id
    });
    
    res.status(201).json(newReceipt);
  } catch (error) {
    console.error('Receipt creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint for receipt list
router.get('/', async (req, res) => {
  try {
    const receipts = await Receipt.find()
      .populate('driver', 'name licenseNumber')
      .populate('terminal', 'name');
      
    res.json(receipts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
