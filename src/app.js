const express = require("express");
const usersRouter = require("./routes/Users.js");
const projectsRouter = require("./routes/Projects.js");
const tasksRouter = require("./routes/Tasks.js");
const transactionRoutes = require("./routes/transactionRoutes.js");
const morgan = require('morgan');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require("cookie-parser");
const errorHandler = require('./middlewares/errorHandler.js');
const swaggerUi = require('swagger-ui-express');
const specs = require('./swagger/swagger.js');
const rateLimit = require('express-rate-limit');


require('dotenv').config();

const server = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // Ventana de tiempo de 15 minutos
  max: 100, // Límite de 100 solicitudes por IP en cada ventana de tiempo
  standardHeaders: true, // Enviar información de límite de tasa en los encabezados estándar
  legacyHeaders: false, // Desactivar los encabezados X-RateLimit-*
});

server.use(limiter);

server.get("/", (req, res) => {
  res.send("BIENVENIDOS A MI RESTAPI DE GESTION DE TAREAS, PRUEBA TECNICA DE BACKEND");
});

server.use(cookieParser());
server.use(cors());
server.use(express.json());
server.use(morgan('dev'));
server.use(session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,  // Asegúrate de usar la URI correcta de MongoDB Atlas
      collectionName: 'sessions'
    }),
  }));

server.use("/users", usersRouter);
server.use("/projects", projectsRouter);
server.use("/tasks", tasksRouter );
server.use('/api', transactionRoutes);
server.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs)) 

server.use(errorHandler)


module.exports = server;