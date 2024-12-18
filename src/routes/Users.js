const { Router } = require("express");
const { registerUser, loginUser,logoutUser } = require("../controllers/Users");



const router = Router();


router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);



module.exports = router;