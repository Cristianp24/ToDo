const { Router } = require("express");
const { registerUser, loginUser,logoutUser,getUsers } = require("../controllers/Users");
const {registerValidator, loginValidator }= require("../validators/usersValidator");

const router = Router();

router.get("/", getUsers);
/**
 * @swagger
 * /users:
 *   get:
 *     summary: List of all users.
 *     description: Retrieve a list of all users in the system.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Successfully retrieved the list of users.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   name:
 *                     type: string
 *                   email:
 *                     type: string
 *       500:
 *         description: Internal server error.
 */
router.post("/register", registerValidator, registerUser);
/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Registers a new user.
 *     description: Registers a new user by providing the necessary details.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The username of the new user.
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 description: The email address of the new user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password for the new user account.
 *                 example: Password123
 *     responses:
 *       201:
 *         description: User successfully registered.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User successfully registered.
 *       400:
 *         description: Bad request. Validation failed.
 *       500:
 *         description: Internal server error.
 */
router.post("/login",  loginValidator, loginUser);
/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Authenticates a user and returns a JWT token.
 *     description: Authenticates a user by verifying their credentials and returns a JWT token for subsequent requests.
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: The email address of the user.
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: The password of the user.
 *                 example: Password123
 *     responses:
 *       200:
 *         description: User authenticated successfully and JWT token returned.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT token for authenticated user.
 *       400:
 *         description: Bad request. Validation failed.
 *       401:
 *         description: Unauthorized. Invalid credentials.
 *       500:
 *         description: Internal server error.
 */
router.post("/logout", logoutUser);
/**...
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Logs out the current user.
 *     description: Logs out the current user by clearing the authentication token or session.
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: User successfully logged out.
 *       500:
 *         description: Internal server error.
 */

module.exports = router;