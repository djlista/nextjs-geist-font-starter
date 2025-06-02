const Driver = require('../models/Driver');
const { logAuditEvent } = require('../services/auditService');

module.exports = async (req, res, next) => {
  try {
    const { driverId, documentUpdates } = req.body;
    
    // Apply real-time document updates
    if (documentUpdates) {
      await Driver.findByIdAndUpdate(driverId, documentUpdates);
    }
    
    // Verify compliance with updated documents
    const driver = await Driver.findById(driverId);
    const today = new Date();
    
    if (new Date(driver.art_expiry) < today || new Date(driver.license_expiry) < today) {
      return res.status(403).json({
        error: "invalid_driver_documents",
        message: "Documents remain expired after update"
      });
    }
    
    // Log the document update
    if (documentUpdates) {
      logAuditEvent(
        req.user.id,
        'DRIVER_DOCUMENTS_QUICK_UPDATE',
        { driverId, updates: documentUpdates }
      );
    }
    
    next();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
