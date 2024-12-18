const { Router } = require("express");
const { registerProject, getProjects, updateProject, deleteProject, assignUserToProject } = require("../controllers/Projects");
const router = Router();



router.post("/", registerProject);
router.get("/", getProjects);
 router.put("/:id", updateProject);
router.delete("/:id", deleteProject);
router.post("/:id/assign", assignUserToProject);



module.exports = router;