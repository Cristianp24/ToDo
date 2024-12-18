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

server.use(errorHandler)

server.use(cookieParser());


server.use(cors());

// Configuración básica de express
server.use(express.json());
server.use(morgan('dev'));
server.use(errorHandler);

// Configuración de la sesión
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
}));

server.use("/users", usersRouter);
server.use("/projects", projectsRouter);
server.use("/tasks", tasksRouter )



server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;