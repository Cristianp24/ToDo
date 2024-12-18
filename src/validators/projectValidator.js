const { body, param } = require('express-validator');

const createProjectValidator = [
  body('name')
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .notEmpty().withMessage('El nombre es obligatorio.'),
  body('description')
    .isString().withMessage('La descripción debe ser una cadena de texto.')
    .notEmpty().withMessage('La descripción es obligatoria.'),
  body('user')
    .isMongoId().withMessage('El ID de usuario debe ser válido.')
    .notEmpty().withMessage('El ID de usuario es obligatorio.')
];

const updateProjectValidator = [
    body('name')
    .optional()
    .isString().withMessage('El nombre debe ser una cadena de texto.')
    .notEmpty().withMessage('El nombre no puede estar vacío.'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto.')
    .notEmpty().withMessage('La descripción no puede estar vacía.'),
  body('user')
    .optional()
    .isMongoId().withMessage('El ID de usuario debe ser válido.')
    .notEmpty().withMessage('El ID de usuario no puede estar vacío.')
];

const assignUserToProjectValidator = [
    body('userId')
      .isMongoId()
      .withMessage('El ID de usuario proporcionado no es válido'),
    param('id')
      .isMongoId()
      .withMessage('El ID del proyecto proporcionado no es válido'),
  ];

module.exports = { createProjectValidator, updateProjectValidator, assignUserToProjectValidator };
