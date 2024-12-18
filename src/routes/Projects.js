const { Router } = require("express");
const { registerProject, getProjects, updateProject, deleteProject, assignUserToProject } = require("../controllers/Projects");
const { createProjectValidator, updateProjectValidator, assignUserToProjectValidator } = require('../validators/projectValidator');

const router = Router();

router.post("/", createProjectValidator,registerProject);
router.get("/", getProjects);
router.put("/:id", updateProjectValidator, updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/assign", assignUserToProjectValidator,assignUserToProject);



module.exports = router;