const Task = require("../models/Tasks");

const createTask = async (req, res) => {
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
  const { taskId } = req.params;
  console.log('Task ID:', taskId);
  
  const { name, description, status, dueDate } = req.body;

  // Construir el objeto de actualización solo con los campos proporcionados
  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (description !== undefined) updateData.description = description;
  if (status !== undefined) updateData.status = status;
  if (dueDate !== undefined) updateData.dueDate = dueDate;

  console.log('Datos a actualizar:', updateData);

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
  
  module.exports = { createTask, getTasks, updateTask, deleteTask };