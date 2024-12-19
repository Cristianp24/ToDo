const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Asegúrate de que tu app esté exportada correctamente
const Task = require('../models/Tasks');
const User = require('../models/Users');
const Project = require('../models/Projects');

describe('GET /tasks', () => {
  let user, project, task;

  beforeAll(async () => {
    const url = 'mongodb://127.0.0.1/test_db'; // Usa tu propia URL de conexión a MongoDB
    await mongoose.connect(url);

    // Crear un usuario y un proyecto para asociarlos con las tareas
    user = await User.create({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
    project = await Project.create({ name: 'Test Project', description: 'Test project description' });

    // Crear una tarea asociada al usuario y al proyecto
    task = await Task.create({
      name: 'Test Task',
      description: 'Test description',
      status: 'pending',
      dueDate: new Date(),
      user: user._id,
      project: project._id,
    });
  });

  afterAll(async () => {
    // Limpiar la base de datos después de las pruebas
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  test('debería retornar todas las tareas con los datos de usuario y proyecto', async () => {
    const response = await request(app).get('/tasks').expect(200);

    // Verifica que la respuesta contenga la tarea creada
    expect(response.body).toBeInstanceOf(Array);
    expect(response.body.length).toBeGreaterThan(0);

    // Verifica que la tarea tenga los campos del usuario y proyecto
    const taskResponse = response.body[0];
    expect(taskResponse).toHaveProperty('name', 'Test Task');
    expect(taskResponse).toHaveProperty('user');
    expect(taskResponse.user).toHaveProperty('name', 'Test User');
    expect(taskResponse.user).toHaveProperty('email', 'testuser@example.com');
    expect(taskResponse).toHaveProperty('project');
    expect(taskResponse.project).toHaveProperty('name', 'Test Project');
  });
  test('debería crear una tarea correctamente', async () => {
    const newTask = {
      name: 'Test Task',
      description: 'Test description',
      status: 'pending',
      dueDate: new Date(),
      userId: user._id,
      projectId: project._id,
    };

    const response = await request(app)
      .post('/tasks')
      .send(newTask)
      .expect(201);

    // Verifica que la tarea se ha creado y tiene los datos correctos
    expect(response.body).toHaveProperty('_id');
    expect(response.body).toHaveProperty('name', newTask.name);
    expect(response.body).toHaveProperty('description', newTask.description);
    expect(response.body).toHaveProperty('status', newTask.status);
    expect(response.body).toHaveProperty('dueDate');
    expect(response.body.user.toString()).toBe(user._id.toString());
    expect(response.body.project.toString()).toBe(project._id.toString());
  });

  test('debería retornar un error si faltan campos requeridos', async () => {
    const newTask = {
      description: 'Test description', // Falta el nombre de la tarea
      status: 'pending',
      dueDate: new Date(),
      userId: user._id,
      projectId: project._id,
    };

    const response = await request(app)
      .post('/tasks')
      .send(newTask)
      .expect(400); // Esperamos un error de validación con estado 400

    expect(response.body.message).toBe('Errores de validación: El nombre debe ser una cadena de texto, El nombre es obligatorio');
  });
});
