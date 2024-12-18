const { Router } = require("express");
const { registerUser, loginUser,logoutUser,getUsers } = require("../controllers/Users");

const router = Router();

router.get("/", getUsers);
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser)



module.exports = router;