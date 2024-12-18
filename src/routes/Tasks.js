const { Router } = require("express");

const { createTask, getTasks, updateTask, deleteTask } = require("../controllers/Tasks");

const router = Router();

router.get("/", getTasks );
router.post("/", createTask);
router.put("/:taskId", updateTask);
router.delete("/:taskId", deleteTask)



module.exports = router;