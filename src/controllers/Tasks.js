const Task = require("../models/Tasks");
const { validationResult } = require('express-validator');

const createTask = async (req, res) => {
  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, description, status, dueDate, userId, projectId } = req.body;

    const newTask = new Task({
      name,
      description,
      status,
      dueDate,
      user: userId || null, // Asignar el userId al campo user
      project: projectId || null,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    console.error('Error al crear la tarea:', error);
    res.status(500).json({ message: 'Error al crear la tarea.', error });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find()
      .populate('user', 'name email')
      .populate('project', 'name');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las tareas', error });
  }
};

const updateTask = async (req, res) => {
  // Verificar si hay errores de validación
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { taskId } = req.params;
  const { name, description, status, dueDate } = req.body;

  // Construir el objeto de actualización solo con los campos proporcionados
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate;

  try {
    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Tarea no encontrada.' });
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    console.error('Error al actualizar la tarea:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    await Task.findByIdAndDelete(taskId);
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la tarea', error });
  }
};

const searchTasks = async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ message: 'Se requiere un término de búsqueda.' });
  }

  try {
    const tasks = await Task.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } }
      ]
    });
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error al buscar tareas:', error);
    res.status(500).json({ message: 'Error interno del servidor.' });
  }
};

const filterTasksByDate = (dueDate) => {
  const dueDateObj = new Date(dueDate);
  
  // Verificar que la fecha recibida es válida
  if (isNaN(dueDateObj)) {
    return { error: 'Fecha inválida proporcionada' };
  }

  // Establecer la fecha al final del día (23:59:59) para incluir todas las tareas antes de esa fecha
  const endOfDay = new Date(dueDateObj.setHours(23, 59, 59, 999));

  return { $lte: endOfDay }; // Devolver solo tareas con fechas menores o iguales a la proporcionada
};

// Controlador para filtrar tareas
const filterTasks = async (req, res) => {
  try {
    // Extraer los parámetros de filtro desde la query string
    const { status, dueDate, user } = req.query;

    // Construir el objeto de filtros
    const filters = {};

    // Filtrar por estado, si se proporciona
    if (status) {
      filters.status = status;
    }

    // Filtrar por fecha de vencimiento hasta la fecha proporcionada, si se proporciona
    if (dueDate) {
      const dateFilter = filterTasksByDate(dueDate);
      
      if (dateFilter.error) {
        return res.status(400).json({ message: dateFilter.error });
      }

      // Agregar el filtro por fecha al objeto de filtros
      filters.dueDate = dateFilter;
    }

    // Filtrar por usuario asignado, si se proporciona
    if (user) {
      filters.user = user;
    }

    // Realizar la consulta a la base de datos con los filtros
    const tasks = await Task.find(filters).populate('user').populate('project');

    // Responder con las tareas filtradas
    res.status(200).json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener las tareas filtradas.' });
  }
};
  module.exports = { createTask, getTasks, updateTask, deleteTask, searchTasks, filterTasks };