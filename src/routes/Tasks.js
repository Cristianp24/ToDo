const { Router } = require("express");
const { createTask, getTasks, updateTask, deleteTask, searchTasks, filterTasks } = require("../controllers/Tasks");
const { createTaskValidator, updateTaskValidator } = require("../validators/tasksValidator");
const router = Router();

router.get("/", getTasks );
router.get('/search', searchTasks);
router.get('/filter', filterTasks);
router.post("/", createTaskValidator, createTask);
router.put("/:taskId", updateTaskValidator, updateTask);
router.delete("/:taskId", deleteTask)




module.exports = router;