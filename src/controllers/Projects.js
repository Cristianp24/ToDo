const Project = require('../models/Projects');
const { validationResult } = require('express-validator');

const registerProject = async (req, res) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  const { name, description, user } = req.body;

  try {
    const newProject = new Project({
      name,
      description,
      user,
    });

    const savedProject = await newProject.save();

    res.status(201).json({
      message: 'Proyecto creado con éxito',
      project: savedProject,
    });
  } catch (error) {
    console.error('Error al crear el proyecto:', error);
    res.status(500).json({
      error: 'Hubo un problema al crear el proyecto.',
    });
  }
};

  const getProjects = async (req, res) => {
    try {
      const projects = await Project.find().populate('user');
      res.status(200).json(projects);
    } catch (error) {
      console.error('Error al obtener los proyectos:', error);
      res.status(500).json({ message: 'Error al obtener los proyectos' });
    }
  };


  const updateProject = async (req, res) => {
    const { id } = req.params;

    const { name, description } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const updatedProject = await Project.findByIdAndUpdate(
        id,
        { name, description },
        { new: true, runValidators: true }
      );
      if (!updatedProject) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.status(200).json(updatedProject);
    } catch (error) {
      console.error('Error al actualizar el proyecto:', error);
      res.status(500).json({ message: 'Error al actualizar el proyecto' });
    }
  };

  const deleteProject = async (req, res) => {
    const { id } = req.params;
    try {
      const deletedProject = await Project.findByIdAndDelete(id);
  
      if (!deletedProject) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      res.status(200).json({ message: 'Proyecto eliminado correctamente' });
    } catch (error) {
      console.error('Error al eliminar el proyecto:', error);
      res.status(500).json({ message: 'Error al eliminar el proyecto' });
    }
  };

  const assignUserToProject = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    const { id } = req.params; // ID del proyecto
    const { userId } = req.body; // ID del usuario a asignar
  
    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
      }
      project.user = userId;
      await project.save();
      res.status(200).json({ message: 'Usuario asignado al proyecto correctamente' });
    } catch (error) {
      console.error('Error al asignar usuario al proyecto:', error);
      res.status(500).json({ message: 'Error al asignar usuario al proyecto' });
    }
  };
  
  module.exports = {
    registerProject,
    getProjects,
    updateProject,
    deleteProject,
    assignUserToProject
  };


