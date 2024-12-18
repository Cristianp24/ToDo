const mongoose = require('mongoose');
const User = require('../models/Users');
const Task = require('../models/Tasks');

const createUserAndTask = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const user = new User({ name: 'Nuevo Usuario', email: 'usuario@example.com', password: 'contraseña' });
    await user.save({ session });

    const task = new Task({ name: 'Nueva Tarea', project:"67627cdbf92580f2514154dc" ,description: 'Descripción de la tarea', userId: "67627cdbf92580f2514154dc" });
    await task.save({ session });

    await session.commitTransaction();
    res.status(201).json({ message: 'Usuario y tarea creados exitosamente' });
  } catch (error) {
    await session.abortTransaction();
    console.error('Error en la transacción:', error);
    res.status(500).json({ error: 'Error al crear usuario y tarea' });
  } finally {
    session.endSession();
  }
};

module.exports = { createUserAndTask };