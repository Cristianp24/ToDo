const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Asegúrate de tener la instancia de tu aplicación en 'app.js'
const Project = require('../models/Projects');
const User = require('../models/Users');

// Setup para limpiar la base de datos entre tests
beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/yourTestDatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.connection.close();
});

// Setup de usuario de prueba
let user;
beforeEach(async () => {
  user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
  await user.save();
});

// Limpiar datos de la base de datos después de cada prueba
afterEach(async () => {
  await Project.deleteMany({});
  await User.deleteMany({});
});

describe('Projects Controller', () => {
  
  // Test para crear un proyecto
  it('should create a project', async () => {
    const newProject = {
      name: 'Test Project',
      description: 'This is a test project',
      user: user._id,
    };
    
    const response = await request(app)
      .post('/projects')
      .send(newProject);
    
    expect(response.status).toBe(201);
    expect(response.body.message).toBe('Proyecto creado con éxito');
    expect(response.body.project).toHaveProperty('_id');
    expect(response.body.project.name).toBe(newProject.name);
  });

  // Test para obtener todos los proyectos
  it('should get all projects', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      user: user._id,
    });
    await project.save();

    const response = await request(app)
      .get('/projects');

    expect(response.status).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);
    expect(response.body[0].name).toBe('Test Project');
  });

  // Test para actualizar un proyecto
  it('should update a project', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      user: user._id,
    });
    await project.save();

    const updatedProject = {
      name: 'Updated Project',
      description: 'Updated description',
    };

    const response = await request(app)
      .put(`/projects/${project._id}`)
      .send(updatedProject);

    expect(response.status).toBe(200);
    expect(response.body.name).toBe(updatedProject.name);
    expect(response.body.description).toBe(updatedProject.description);
  });

  // Test para eliminar un proyecto
  it('should delete a project', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      user: user._id,
    });
    await project.save();

    const response = await request(app)
      .delete(`/projects/${project._id}`);
    
    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Proyecto eliminado correctamente');
    
    const deletedProject = await Project.findById(project._id);
    expect(deletedProject).toBeNull();
  });

  // Test para asignar un usuario a un proyecto
  it('should assign a user to a project', async () => {
    const project = new Project({
      name: 'Test Project',
      description: 'This is a test project',
      user: user._id,
    });
    await project.save();

    const newUser = new User({
      name: 'Another User',
      email: 'anotheruser@example.com',
      password: 'password123',
    });
    await newUser.save();

    const response = await request(app)
      .post(`/projects/${project._id}/assign`)
      .send({ userId: newUser._id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe('Usuario asignado al proyecto correctamente');
    
    const updatedProject = await Project.findById(project._id);
    expect(updatedProject.user.toString()).toBe(newUser._id.toString());
  });
});
