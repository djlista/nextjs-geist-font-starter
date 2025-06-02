const express = require('express');
const router = express.Router();
const DeliveryNote = require('../models/DeliveryNote');
const { validateDriverCompliance } = require('../middleware/driverValidation');

// POST endpoint for delivery note creation with compliance validation
router.post('/', validateDriverCompliance, async (req, res) => {
  try {
    const { driverId, destination, items } = req.body;
    
    // Validate required fields
    if (!driverId || !destination || !items) {
      return res.status(400).json({ error: 'Invalid delivery note data' });
    }
    
    // Create new delivery note
    const newNote = await DeliveryNote.create({
      driver: driverId,
      destination,
      items,
      status: 'pending',
      createdBy: req.user.id
    });
    
    res.status(201).json(newNote);
  } catch (error) {
    console.error('Delivery note creation error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint for delivery note list
router.get('/', async (req, res) => {
  try {
    const notes = await DeliveryNote.find()
      .populate('driver', 'name licenseNumber')
      .populate('destination', 'name');
      
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
