const { Router } = require("express");

const { createTask, getTasks, updateTask, deleteTask, searchTasks, filterTasks } = require("../controllers/Tasks");

const router = Router();

router.get("/", getTasks );
router.get('/search', searchTasks);
router.get('/filter', filterTasks);
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask)




module.exports = router;