const { Router } = require("express");
const { registerProject, getProjects, updateProject, deleteProject, assignUserToProject } = require("../controllers/Projects");
const { createProjectValidator, updateProjectValidator, assignUserToProjectValidator } = require('../validators/projectValidator');

const router = Router();

router.post("/", createProjectValidator,registerProject);
/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project.
 *     description: Create a new project with the provided details.
 *     tags:
 *       - Projects
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the project.
 *               description:
 *                 type: string
 *                 description: A brief description of the project.
 *               user:
 *                 type: string
 *                 description: The ID of the user associated with the project.
 *             required:
 *               - name
 *               - user
 *     responses:
 *       201:
 *         description: Project successfully created.
 *       400:
 *         description: Bad request. Validation failed.
 *       500:
 *         description: Internal server error.
 */
router.get("/", getProjects);
/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Retrieve a list of all projects.
 *     description: Fetch all projects associated with the authenticated user.
 *     tags:
 *       - Projects
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of projects.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   description:
 *                     type: string
 *                   user:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
router.put("/:id", updateProjectValidator, updateProject);
/**
 * @swagger
 * /projects/{id}:
 *   put:
 *     summary: Update an existing project.
 *     description: Update the details of an existing project by providing the project ID and the fields to be updated.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the project to be updated.
 *         schema:
 *           type: string
 *       - in: body
 *         name: project
 *         description: The project data to be updated.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: The name of the project.
 *             description:
 *               type: string
 *               description: A brief description of the project.
 *             user:
 *               type: string
 *               description: The ID of the user associated with the project.
 *           additionalProperties: false
 *     responses:
 *       200:
 *         description: Project successfully updated.
 *       400:
 *         description: Bad request. Validation failed.
 *       404:
 *         description: Project not found.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:id", deleteProject);
/**
 * @swagger
 * /projects/{id}:
 *   delete:
 *     summary: Eliminar un proyecto existente.
 *     description: Elimina el proyecto especificado por su ID.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del proyecto a eliminar.
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Proyecto eliminado exitosamente.
 *       404:
 *         description: Proyecto no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */
router.post("/:id/assign", assignUserToProjectValidator,assignUserToProject);
/**
 * @swagger
 * /projects/{id}/assign:
 *   post:
 *     summary: Asignar un usuario a un proyecto.
 *     description: Asigna un usuario existente al proyecto especificado por su ID.
 *     tags:
 *       - Projects
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: El ID del proyecto al que se asignará el usuario.
 *         schema:
 *           type: string
 *       - in: body
 *         name: user
 *         description: El ID del usuario a asignar al proyecto.
 *         required: true
 *         schema:
 *           type: object
 *           properties:
 *             userId:
 *               type: string
 *               description: El ID del usuario a asignar al proyecto.
 *           required:
 *             - userId
 *           additionalProperties: false
 *     responses:
 *       200:
 *         description: Usuario asignado exitosamente al proyecto.
 *       400:
 *         description: Solicitud incorrecta. Fallo en la validación.
 *       404:
 *         description: Proyecto o usuario no encontrado.
 *       500:
 *         description: Error interno del servidor.
 */

module.exports = router;