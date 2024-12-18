
const { body } = require('express-validator');

const registerValidator = [
    body('name')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('email')
    .isEmail()
    .withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
    body('password')
    .matches(/^(?=.*[A-Z])(?=.*\d)/).withMessage('La contraseña debe contener al menos una letra mayúscula y un número')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres')
    .notEmpty().withMessage('La contraseña es obligatoria'),

];

const loginValidator = [
    body('email')
      .isEmail()
      .withMessage('Debe ser un correo electrónico válido')
      .normalizeEmail(),
    body('password')
      .notEmpty()
      .withMessage('La contraseña es obligatoria')
  ];


module.exports = { registerValidator, loginValidator};
