module.exports = (err, req, res, next) => {
    console.error(err.stack);
    if (err.name === 'SequelizeUniqueConstraintError') {
    return res.status(400).json({ message: 'Duplicate field value', error: err.message });
  }
  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Validation error', error: err.errors.map(e => e.message) });
  }
    res.status(500).json({ message: 'Something went wrong', error: err.message });
};
