const Task = require("../models/Tasks");
const errorsValidator = require('../validators/errorsValidator');
const CustomError = require('../middlewares/customError');


const createTask = async (req, res, next) => {
  try {
    errorsValidator(req);

    const { name, description, status, dueDate, userId, projectId } = req.body;

    const newTask = new Task({
      name,
      description,
      status,
      dueDate,
      user: userId || null,
      project: projectId || null,
    });

    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (error) {
    next(error);
  }
};

const getTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; 
    const limit = 5; 
    const skip = (page - 1) * limit; 

    const tasks = await Task.find()
      .populate('user', 'name email') 
      .populate('project', 'name') 
      .limit(limit)
      .skip(skip);

    const totalTasks = await Task.countDocuments();
    const totalPages = Math.ceil(totalTasks / limit);

    res.status(200).json({
      tasks,
      currentPage: page,
      totalPages,
      totalTasks,
    });
  } catch (error) {
    console.error('Error al obtener las tareas:', error);
    res.status(500).json({ message: 'Error al obtener las tareas', error });
  }
};

const updateTask = async (req, res, next) => {
  try {
    errorsValidator(req);

    const { taskId } = req.params;
    const { name, description, status, dueDate } = req.body;

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (status !== undefined) updateData.status = status;
    if (dueDate !== undefined) updateData.dueDate = dueDate;

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, { new: true });
    if (!updatedTask) {
      throw new CustomError('Tarea no encontrada.', 404);
    }
    res.status(200).json(updatedTask);
  } catch (error) {
    next(error);
  }
};

const deleteTask = async (req, res, next) => {
  try {
    const { taskId } = req.params;

    const deletedTask = await Task.findByIdAndDelete(taskId);
    if (!deletedTask) {
      throw new CustomError('Tarea no encontrada.', 404);
    }
    res.status(200).json({ message: 'Tarea eliminada correctamente' });
  } catch (error) {
    next(error);
  }
};

const searchTasks = async (req, res, next) => {
  try {
    errorsValidator(req);

    const { query } = req.query;

    if (!query) {
      throw new CustomError('Se requiere un término de búsqueda.', 400);
    }
    const tasks = await Task.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
      ],
    });

    if (tasks.length === 0) {
      throw new CustomError('No se encontraron coincidencias para el término de búsqueda proporcionado.', 404);
    }
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

const filterTasksByDate = (dueDate) => {
  const dueDateObj = new Date(dueDate);

  if (isNaN(dueDateObj)) {
    throw new CustomError('Fecha inválida proporcionada', 400);
  }
  const endOfDay = new Date(dueDateObj.setHours(23, 59, 59, 999));

  return { $lte: endOfDay }; 
};

const filterTasks = async (req, res, next) => {
  try {
    errorsValidator(req);

    const { status, dueDate, user } = req.query;

    if (!status && !dueDate && !user) {
      throw new CustomError('Se requieren parámetros de filtro: status, dueDate o user.', 400);
    }

    const filters = {};

    if (status) {
      filters.status = status;
    }

    if (dueDate) {
      const dateFilter = filterTasksByDate(dueDate);
      filters.dueDate = dateFilter;
    }

    if (user) {
      filters.user = user;
    }

    const tasks = await Task.find(filters).populate('user').populate('project');

    if (tasks.length === 0) {
      throw new CustomError('No se encontraron tareas que coincidan con los filtros proporcionados.', 404);
    }
    res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

  module.exports = { createTask, getTasks, updateTask, deleteTask, searchTasks, filterTasks };