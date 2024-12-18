const { body, param, query } = require('express-validator');

const createTaskValidator = [
    body('name')
    .isString().withMessage('El nombre debe ser una cadena de texto')
    .notEmpty().withMessage('El nombre es obligatorio'),
  body('description')
    .optional()
    .isString().withMessage('La descripción debe ser una cadena de texto'),
  body('status')
    .optional()
    .isIn(['pending', 'in progress', 'complete']).withMessage('El estado debe ser uno de los siguientes: pending, in progress, complete'),
  body('dueDate')
    .optional()
    .isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  body('userId')
    .optional()
    .isMongoId().withMessage('El ID de usuario debe ser un ObjectId de MongoDB válido'),
  body('projectId')
    .isMongoId().withMessage('El ID de proyecto es obligatorio y debe ser un ObjectId de MongoDB válido'),
];


const updateTaskValidator = [
    param('taskId')
      .isMongoId().withMessage('El ID de la tarea debe ser un ObjectId de MongoDB válido'),
    body('name')
      .optional()
      .isString().withMessage('El nombre debe ser una cadena de texto')
      .notEmpty().withMessage('El nombre no puede estar vacío'),
    body('description')
      .optional()
      .isString().withMessage('La descripción debe ser una cadena de texto'),
    body('status')
      .optional()
      .isIn(['pending', 'in progress', 'complete']).withMessage('El estado debe ser uno de los siguientes: pending, in progress, complete'),
    body('dueDate')
      .optional()
      .isISO8601().withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601'),
  ];

  const searchTasksValidator = [
    query('query')
      .notEmpty()
      .withMessage('Se requiere un término de búsqueda.')
      .isString()
      .withMessage('El término de búsqueda debe ser una cadena de texto.')
  ];
  
  const filterTasksValidator = [
    query('status')
      .optional()
      .isIn(['pendiente', 'en progreso', 'completada'])
      .withMessage('El estado debe ser uno de los siguientes: pendiente, en progreso, completada.'),
    query('dueDate')
      .optional()
      .isISO8601()
      .withMessage('La fecha de vencimiento debe ser una fecha válida en formato ISO 8601.'),
    query('user')
      .optional()
      .isMongoId()
      .withMessage('El ID de usuario debe ser un ID de MongoDB válido.')
  ];


module.exports = { createTaskValidator, updateTaskValidator, searchTasksValidator, filterTasksValidator };