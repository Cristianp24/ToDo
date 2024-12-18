const express = require("express");
const usersRouter = require("./routes/Users.js");
const projectsRouter = require("./routes/Projects.js");
const tasksRouter = require("./routes/Tasks.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const errorHandler = require('./middlewares/errorHandler.js');

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
server.use("/tasks", tasksRouter )

server.use(errorHandler)


module.exports = server;