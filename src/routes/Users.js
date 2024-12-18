const { Router } = require("express");
const { registerUser, loginUser,logoutUser,getUsers } = require("../controllers/Users");
const {registerValidator, loginValidator }= require("../validators/usersValidator");


const router = Router();

router.get("/", getUsers);
router.post("/register", registerValidator, registerUser);
router.post("/login",  loginValidator, loginUser);
router.post("/logout", logoutUser)



module.exports = router;