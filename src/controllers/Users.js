// src/controllers/userController.js
const { validationResult } = require('express-validator');
const User = require('../models/Users');
const jwt = require('jsonwebtoken'); // Para crear el token



const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    res.status(500).json({ message: 'Error al obtener los usuarios' });
  }
};

const registerUser = async (req, res) => {
  // Validar los datos de entrada
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario
    const user = new User({
      name,
      email,
      password,
    });

    // Guardar el usuario en la base de datos
    await user.save();

    // Generar el token JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h', // El token expira en 1 hora
    });

    // Responder con el token
    res.status(201).json({
      message: 'Usuario registrado con éxito',
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error en el servidor' });
  }
};

const loginUser = async (req, res) => {
    // Validar los datos de entrada
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
  
    const { email, password } = req.body;
  
    try {
      // Buscar al usuario por email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Usuario no encontrado' });
      }
  
      // Comparar la contraseña
      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Contraseña incorrecta' });
      }
  
      // Generar el token JWT
      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '1h', // El token expira en 1 hora
      });
  
      // Responder con el token
      res.json({
        message: 'Inicio de sesión exitoso',
        token,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error en el servidor' });
    }
  };

   const logoutUser = (req, res) => {
    res.clearCookie("authToken");
    return res.json({ message: "Logout successful" });
  };


module.exports = {
  registerUser,
  loginUser,
  logoutUser,
  getUsers
};
