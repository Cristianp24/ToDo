const { Router } = require("express");

const router = Router();

const { createUserAndTask } = require("../controllers/transactionController");


router.post('/create-user-and-task', createUserAndTask);


module.exports = router;