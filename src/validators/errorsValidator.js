// src/utils/validationUtils.js
const { validationResult } = require('express-validator');
const CustomError = require('../middlewares/customError');
const handleValidationErrors = (req) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(err => err.msg);
    throw new CustomError(`Errores de validación: ${errorMessages.join(', ')}`, 400);
  }
};

module.exports = handleValidationErrors;
