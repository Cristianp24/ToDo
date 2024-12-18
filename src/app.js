const express = require("express");
const usersRouter = require("./routes/Users.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const cookieParser = require("cookie-parser");
const passportConfig = require('./config/passportConfig.js');
const passport = require('passport');
require('dotenv').config();


require("./config/db.js");

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
    secret: process.env.JWT_SECRET, // Cambia esto a una clave secreta segura
    resave: false,
    saveUninitialized: true,
}));

server.use(passport.initialize());
server.use(passport.session());

// // Configuración de passport
passportConfig(passport);

server.use("/users", usersRouter);



server.use((err, req, res, next) => {
  // eslint-disable-line no-unused-vars
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});




module.exports = server;