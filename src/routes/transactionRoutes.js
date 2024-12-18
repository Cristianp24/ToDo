const { Router } = require("express");

const router = Router();

const { createUserAndTask } = require("../controllers/transactionController");

/**
 * @swagger
 * /api/create-user-and-task:
 *   post:
 *     summary: Crea un nuevo usuario y una tarea asociada
 *     tags:
 *       - Create User and Task
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *                   password:
 *                     type: string
 *                 required:
 *                   - name
 *                   - email
 *                   - password
 *               task:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                   project:
 *                     type: string
 *                   description:
 *                     type: string
 *                 required:
 *                   - name
 *                   - project
 *     responses:
 *       201:
 *         description: Usuario y tarea creados exitosamente
 *       500:
 *         description: Error al crear usuario y tarea
 */
router.post('/create-user-and-task', createUserAndTask);


module.exports = router;