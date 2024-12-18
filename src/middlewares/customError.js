class CustomError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.name = this.constructor.name; // Nombre de la clase de error
      this.statusCode = statusCode || 500; // Código de estado HTTP, por defecto 500
      Error.captureStackTrace(this, this.constructor);
    }
  }

  
  module.exports = CustomError;
  