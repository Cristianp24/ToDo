// src/controllers/userController.js
const errorsValidator = require('../validators/errorsValidator');
const User = require('../models/Users');
const jwt = require('jsonwebtoken'); // Para crear el token
const CustomError = require('../middlewares/customError');


const getUsers = async (req, res) => {
  try {
    // Obtenemos el número de página desde los parámetros de consulta (query)
    const page = parseInt(req.query.page) || 1; // Página actual (por defecto 1)
    const limit = 5; // Número de usuarios por página
    const skip = (page - 1) * limit; // Cálculo de los usuarios a saltar

    // Buscamos los usuarios con paginación
    const users = await User.find()
      .limit(limit)
      .skip(skip);

    // Obtenemos el total de usuarios para calcular el total de páginas
    const totalUsers = await User.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    // Devolvemos la respuesta con la paginación incluida
    res.status(200).json({
      users,
      currentPage: page,
      totalPages,
      totalUsers,
    });
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};

const registerUser = async (req, res, next) => {
  try {
    errorsValidator(req);
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      throw new CustomError('El usuario ya existe', 400);
    }

    const user = new User({ name, email, password });
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (req, res, next) => {
  try {
    errorsValidator(req);
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new CustomError('Usuario no encontrado', 400);
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      throw new CustomError('Contraseña incorrecta', 400);
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    res.json({
      message: 'Inicio de sesión exitoso',
      token,
    });
  } catch (error) {
    next(error);
  }
};

const logoutUser = (req, res, next) => {
  try {
    res.clearCookie("authToken");
    res.json({ message: "Logout successful" });
  } catch (error) {
    next(new CustomError('Error al cerrar sesión', 500));
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers
};
