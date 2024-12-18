const CustomError = require('./customError');


const errorHandler = (err, req, res, next) => {
    if (err instanceof CustomError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
  
    // Manejo de errores no personalizados
    console.error(err);
    res.status(500).json({ message: 'Error interno del servidor' });
  };

  module.exports = errorHandler;
  