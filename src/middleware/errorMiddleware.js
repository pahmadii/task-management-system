const logger = require('../utils/logger');  


module.exports = (err, req, res, next) => {
 logger.error(err.stack);

  if (res.headersSent) return next(err);

  if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Duplicate field value', error: err.message });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation error', error: err.errors.map(e => e.message) });
  }
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error', error: err.message });
  }

return res.status(400).json({ message: 'An unexpected error occurred. Please try again.', error: err.message });

};
