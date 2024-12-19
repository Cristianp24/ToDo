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


let user;
beforeEach(async () => {
  user = new User({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
  await user.save();
});


afterEach(async () => {
  await Project.deleteMany({});
  await User.deleteMany({});
});

describe('Projects Controller', () => {
  
 
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
