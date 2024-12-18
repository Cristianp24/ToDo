const express = require("express");
const usersRouter = require("./routes/Users.js");
const projectsRouter = require("./routes/Projects.js");
const tasksRouter = require("./routes/Tasks.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const errorHandler = require('./middlewares/errorHandler.js');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger.js');


require('dotenv').config();

const server = express();

server.use(cookieParser());
server.use(cors());
server.use(express.json());
server.use(morgan('dev'));
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
}));

server.use("/users", usersRouter);
server.use("/projects", projectsRouter);
server.use("/tasks", tasksRouter );
server.use('/api', transactionRoutes);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)) 

server.use(errorHandler)


module.exports = server;