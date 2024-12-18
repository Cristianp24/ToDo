const express = require("express");
const usersRouter = require("./routes/Users.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");

require('dotenv').config();



const server = express();


const myOwnMiddleware = (req, res, next) => {
    console.log("Middleware serverlied!!");
    next();
};

server.use(cookieParser());


server.use(cors());

// Configuración básica de express
server.use(express.json());
server.use(morgan('dev'));
server.use(myOwnMiddleware);

// Configuración de la sesión
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
}));

server.use("/users", usersRouter);



server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;