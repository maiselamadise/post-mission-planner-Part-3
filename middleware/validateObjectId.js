const mongoose = require('mongoose');

// Rejects malformed ids with 400 before they reach the database
module.exports = function validateObjectId(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: 'Invalid id format' });
  }
  next();
};
