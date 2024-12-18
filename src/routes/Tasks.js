const { Router } = require("express");
const { createTask, getTasks, updateTask, deleteTask, searchTasks, filterTasks } = require("../controllers/Tasks");
const { createTaskValidator, updateTaskValidator } = require("../validators/tasksValidator");

const router = Router();

router.get("/", getTasks );
/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Retrieves a list of tasks.
 *     description: Fetches all tasks from the database.
 *     tags:
 *       - Tasks
 *     responses:
 *       200:
 *         description: A list of tasks.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                     example: 60d5f9b2b8f8c72b8c8c8c8c
 *                   name:
 *                     type: string
 *                     description: The name of the task.
 *                     example: Complete project documentation
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                     example: Write comprehensive documentation for the project.
 *                   status:
 *                     type: string
 *                     description: The current status of the task.
 *                     example: In Progress
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     description: The due date for the task.
 *                     example: 2024-12-31
 *       500:
 *         description: Internal server error.
 */
router.get('/search', searchTasks);
/**
 * @swagger
 * /tasks/search:
 *   get:
 *     summary: Retrieves tasks based on a search query.
 *     description: Fetches tasks from the database that match the specified search query in either the name or description fields.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: query
 *         schema:
 *           type: string
 *         description: The search query to filter tasks by name or description.
 *         example: Complete project documentation
 *     responses:
 *       200:
 *         description: A list of tasks matching the search query.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                     example: 60d5f9b2b8f8c72b8c8c8c8c
 *                   name:
 *                     type: string
 *                     description: The name of the task.
 *                     example: Complete project documentation
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                     example: Write comprehensive documentation for the project.
 *                   status:
 *                     type: string
 *                     description: The current status of the task.
 *                     example: In Progress
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     description: The due date for the task.
 *                     example: 2024-12-31
 *       400:
 *         description: Bad request. Validation failed. The 'query' parameter is required.
 *       500:
 *         description: Internal server error.
 */
router.get('/filter', filterTasks);
/**
 * @swagger
 * /tasks/filter:
 *   get:
 *     summary: Retrieves tasks based on a single filter criterion.
 *     description: Fetches tasks from the database that match the specified filter criterion. Only one filter parameter should be provided at a time.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: query
 *         name: dueDate
 *         schema:
 *           type: string
 *           format: date
 *         description: The due date of the tasks to filter by.
 *         example: 2024-12-25
 *       - in: query
 *         name: user
 *         schema:
 *           type: string
 *         description: The user ID to filter tasks by.
 *         example: 6762549451367a8a8db5adca
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: The status of the tasks to filter by.
 *         example: pending
 *     responses:
 *       200:
 *         description: A list of tasks matching the filter criterion.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                     description: The unique identifier of the task.
 *                     example: 60d5f9b2b8f8c72b8c8c8c8c
 *                   name:
 *                     type: string
 *                     description: The name of the task.
 *                     example: Complete project documentation
 *                   description:
 *                     type: string
 *                     description: A detailed description of the task.
 *                     example: Write comprehensive documentation for the project.
 *                   status:
 *                     type: string
 *                     description: The current status of the task.
 *                     example: In Progress
 *                   dueDate:
 *                     type: string
 *                     format: date
 *                     description: The due date for the task.
 *                     example: 2024-12-31
 *                   userId:
 *                     type: string
 *                     description: The user ID associated with the task.
 *                     example: 60d5f9b2b8f8c72b8c8c8c8c
 *       400:
 *         description: Bad request. Validation failed. Only one filter parameter should be provided at a time.
 *       500:
 *         description: Internal server error.
 */
router.post("/", createTaskValidator, createTask);
/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Creates a new task.
 *     description: Adds a new task to the database with the provided details.
 *     tags:
 *       - Tasks
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task.
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 example: Write comprehensive documentation for the project.
 *               status:
 *                 type: string
 *                 description: The current status of the task.
 *                 example: pending
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date for the task.
 *                 example: 2024-02-12
 *               userId:
 *                 type: string
 *                 description: The user ID associated with the task.
 *                 example: 6762549451367a8a8db5adca
 *               projectId:
 *                 type: string
 *                 description: The project ID to which the task belongs.
 *                 example: 67627cdaf92580f2514154da
 *     responses:
 *       201:
 *         description: Task created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the task.
 *                   example: 60d5f9b2b8f8c72b8c8c8c8c
 *                 name:
 *                   type: string
 *                   description: The name of the task.
 *                   example: Complete project documentation
 *                 description:
 *                   type: string
 *                   description: A detailed description of the task.
 *                   example: Write comprehensive documentation for the project.
 *                 status:
 *                   type: string
 *                   description: The current status of the task.
 *                   example: pending
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   description: The due date for the task.
 *                   example: 2024-02-12
 *                 userId:
 *                   type: string
 *                   description: The user ID associated with the task.
 *                   example: 6762549451367a8a8db5adca
 *                 projectId:
 *                   type: string
 *                   description: The project ID to which the task belongs.
 *                   example: 67627cdaf92580f2514154da
 *       400:
 *         description: Bad request. Validation failed. Ensure all required fields are provided and correctly formatted.
 *       500:
 *         description: Internal server error.
 */
router.put("/:taskId", updateTaskValidator, updateTask);
/**
 * @swagger
 * /tasks/{taskId}:
 *   put:
 *     summary: Updates an existing task.
 *     description: Updates the details of an existing task identified by its taskId.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to be updated.
 *         example: 67633c628b851c685d2b5999
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the task.
 *                 example: Complete project documentation
 *               description:
 *                 type: string
 *                 description: A detailed description of the task.
 *                 example: Write comprehensive documentation for the project.
 *               status:
 *                 type: string
 *                 description: The current status of the task.
 *                 example: pending
 *               dueDate:
 *                 type: string
 *                 format: date
 *                 description: The due date for the task.
 *                 example: 2024-02-12
 *               userId:
 *                 type: string
 *                 description: The user ID associated with the task.
 *                 example: 6762549451367a8a8db5adca
 *               projectId:
 *                 type: string
 *                 description: The project ID to which the task belongs.
 *                 example: 67627cdaf92580f2514154da
 *     responses:
 *       200:
 *         description: Task updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The unique identifier of the task.
 *                   example: 67633c628b851c685d2b5999
 *                 name:
 *                   type: string
 *                   description: The name of the task.
 *                   example: Complete project documentation
 *                 description:
 *                   type: string
 *                   description: A detailed description of the task.
 *                   example: Write comprehensive documentation for the project.
 *                 status:
 *                   type: string
 *                   description: The current status of the task.
 *                   example: pending
 *                 dueDate:
 *                   type: string
 *                   format: date
 *                   description: The due date for the task.
 *                   example: 2024-02-12
 *                 userId:
 *                   type: string
 *                   description: The user ID associated with the task.
 *                   example: 6762549451367a8a8db5adca
 *                 projectId:
 *                   type: string
 *                   description: The project ID to which the task belongs.
 *                   example: 67627cdaf92580f2514154da
 *       400:
 *         description: Bad request. Validation failed. Ensure all required fields are provided and correctly formatted.
 *       404:
 *         description: Task not found. The task with the specified taskId does not exist.
 *       500:
 *         description: Internal server error.
 */
router.delete("/:taskId", deleteTask)
/**
 * @swagger
 * /tasks/{taskId}:
 *   delete:
 *     summary: Deletes a task by its ID.
 *     description: Removes the task identified by the specified taskId from the database.
 *     tags:
 *       - Tasks
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique identifier of the task to be deleted.
 *         example: 67633c628b851c685d2b5999
 *     responses:
 *       200:
 *         description: Task deleted successfully.
 *       400:
 *         description: Bad request. Validation failed. Ensure the taskId is correctly formatted.
 *       404:
 *         description: Task not found. The task with the specified taskId does not exist.
 *       500:
 *         description: Internal server error.
 */


module.exports = router;