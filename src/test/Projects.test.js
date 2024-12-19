const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Project = require('../models/Projects');
const User = require('../models/Users');

beforeAll(async () => {
  await mongoose.connect('mongodb://localhost:27017/yourTestDatabase');
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
  describe('GET /projects', () => {
    test('debería retornar los proyectos con paginación y datos de usuario', async () => {
      // Crear algunos proyectos de prueba en la base de datos
      const user1 = new User({ name: 'Juan Pérez', email: 'juan.perez@example.com', password: 'Contraseña123' });
      const user2 = new User({ name: 'Ana Gómez', email: 'ana.gomez@example.com', password: 'Contraseña123' });
      await user1.save();
      await user2.save();
  
      const project1 = new Project({ name: 'Proyecto 1', description: 'Descripción del Proyecto 1', user: user1._id });
      const project2 = new Project({ name: 'Proyecto 2', description: 'Descripción del Proyecto 2', user: user1._id });
      const project3 = new Project({ name: 'Proyecto 3', description: 'Descripción del Proyecto 3', user: user2._id });
      const project4 = new Project({ name: 'Proyecto 4', description: 'Descripción del Proyecto 4', user: user2._id });
      const project5 = new Project({ name: 'Proyecto 5', description: 'Descripción del Proyecto 5', user: user1._id });
      const project6 = new Project({ name: 'Proyecto 6', description: 'Descripción del Proyecto 6', user: user1._id });
      await project1.save();
      await project2.save();
      await project3.save();
      await project4.save();
      await project5.save();
      await project6.save();
  
      // Hacer una solicitud a la primera página
      const response = await request(app)
        .get('/projects?page=1')
        .expect(200);
  
      // Verificar la respuesta de la página 1
      expect(response.body.projects).toHaveLength(5); // Debería haber 5 proyectos en la página 1
      expect(response.body.currentPage).toBe(1);
      expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
      expect(response.body.totalProjects).toBe(6); // Total de proyectos en la base de datos
  
      // Verificar los datos del proyecto
      const projectResponse = response.body.projects[0];
      expect(projectResponse).toHaveProperty('name', 'Proyecto 1');
      expect(projectResponse).toHaveProperty('user');
      expect(projectResponse.user).toHaveProperty('name', 'Juan Pérez');
      expect(projectResponse.user).toHaveProperty('email', 'juan.perez@example.com');
  
      // Hacer una solicitud a la segunda página
      const responsePage2 = await request(app)
        .get('/projects?page=2')
        .expect(200);
  
      // Verificar la respuesta de la página 2
      expect(responsePage2.body.projects).toHaveLength(1); // Solo debería haber 1 proyecto en la página 2
      expect(responsePage2.body.currentPage).toBe(2);
      expect(responsePage2.body.totalPages).toBeGreaterThanOrEqual(1);
      expect(responsePage2.body.totalProjects).toBe(6); // Total de proyectos en la base de datos
  
      
      const projectResponsePage2 = responsePage2.body.projects[0];
      expect(projectResponsePage2).toHaveProperty('name', 'Proyecto 6');
      expect(projectResponsePage2).toHaveProperty('user');
      expect(projectResponsePage2.user).toHaveProperty('name', 'Juan Pérez');
      expect(projectResponsePage2.user).toHaveProperty('email', 'juan.perez@example.com');
    });
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
