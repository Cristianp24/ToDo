const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app');
const Task = require('../models/Tasks');
const User = require('../models/Users');
const Project = require('../models/Projects');

describe('Task Management API', () => {
    let user, project, task;
  
    // Configuración inicial de la base de datos
    beforeAll(async () => {
      const url = 'mongodb://127.0.0.1/test_db'; // Cambia esta URL según tu entorno
      await mongoose.connect(url);
  
      // Crear usuario y proyecto para asociar con las tareas
      user = await User.create({ name: 'Test User', email: 'testuser@example.com', password: 'password123' });
      project = await Project.create({ name: 'Test Project', description: 'Test project description' });
  
      // Crear tarea de prueba
      task = await Task.create({
        name: 'Test Task',
        description: 'Test description',
        status: 'pending',
        dueDate: new Date(),
        user: user._id,
        project: project._id,
      });
    });
  
    // Limpiar la base de datos al finalizar las pruebas
    afterAll(async () => {
      await mongoose.connection.dropDatabase();
      await mongoose.connection.close();
    });
  
    // --- TEST: GET /tasks ---
    describe('GET /tasks', () => {
      test('debería retornar las tareas con los datos de usuario y proyecto con paginación', async () => {
        // Crear algunas tareas de prueba en la base de datos
        const task1 = new Task({ name: 'Test Task 1', user: userId1, project: projectId1 });
        const task2 = new Task({ name: 'Test Task 2', user: userId2, project: projectId2 });
        const task3 = new Task({ name: 'Test Task 3', user: userId1, project: projectId1 });
        const task4 = new Task({ name: 'Test Task 4', user: userId2, project: projectId2 });
        const task5 = new Task({ name: 'Test Task 5', user: userId1, project: projectId1 });
        const task6 = new Task({ name: 'Test Task 6', user: userId2, project: projectId2 });
        await task1.save();
        await task2.save();
        await task3.save();
        await task4.save();
        await task5.save();
        await task6.save();
    
        // Hacer una solicitud a la primera página
        const response = await request(app)
          .get('/tasks?page=1')
          .expect(200);
    
        // Verificar la respuesta de la página 1
        expect(response.body.tasks).toHaveLength(5); // Debería haber 5 tareas en la página 1
        expect(response.body.currentPage).toBe(1);
        expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
        expect(response.body.totalTasks).toBe(6); // Total de tareas en la base de datos
    
        // Verificar los datos de la tarea
        const taskResponse = response.body.tasks[0];
        expect(taskResponse).toHaveProperty('name', 'Test Task 1');
        expect(taskResponse).toHaveProperty('user');
        expect(taskResponse.user).toHaveProperty('name', 'Test User 1');
        expect(taskResponse.user).toHaveProperty('email', 'testuser1@example.com');
        expect(taskResponse).toHaveProperty('project');
        expect(taskResponse.project).toHaveProperty('name', 'Test Project 1');
    
        // Hacer una solicitud a la segunda página
        const responsePage2 = await request(app)
          .get('/tasks?page=2')
          .expect(200);
    
        // Verificar la respuesta de la página 2
        expect(responsePage2.body.tasks).toHaveLength(1); // Solo debería haber 1 tarea en la página 2
        expect(responsePage2.body.currentPage).toBe(2);
        expect(responsePage2.body.totalPages).toBeGreaterThanOrEqual(1);
        expect(responsePage2.body.totalTasks).toBe(6); // Total de tareas en la base de datos
    
        // Verificar la tarea recibida en la página 2
        const taskResponsePage2 = responsePage2.body.tasks[0];
        expect(taskResponsePage2).toHaveProperty('name', 'Test Task 6');
        expect(taskResponsePage2).toHaveProperty('user');
        expect(taskResponsePage2.user).toHaveProperty('name', 'Test User 2');
        expect(taskResponsePage2.user).toHaveProperty('email', 'testuser2@example.com');
        expect(taskResponsePage2).toHaveProperty('project');
        expect(taskResponsePage2.project).toHaveProperty('name', 'Test Project 2');
      });
    });
    // --- TEST: POST /tasks ---
    describe('POST /tasks', () => {
      test('debería crear una tarea correctamente', async () => {
        const newTask = {
          name: 'New Test Task',
          description: 'New test description',
          status: 'pending',
          dueDate: new Date(),
          userId: user._id,
          projectId: project._id,
        };
  
        const response = await request(app)
          .post('/tasks')
          .send(newTask)
          .expect(201);
  
        expect(response.body).toHaveProperty('_id');
        expect(response.body).toHaveProperty('name', newTask.name);
        expect(response.body).toHaveProperty('description', newTask.description);
        expect(response.body).toHaveProperty('status', newTask.status);
        expect(response.body).toHaveProperty('dueDate');
        expect(response.body.user.toString()).toBe(user._id.toString());
        expect(response.body.project.toString()).toBe(project._id.toString());
      });
  
      test('debería retornar un error si faltan campos requeridos', async () => {
        const incompleteTask = {
          description: 'Missing name field',
          status: 'pending',
          dueDate: new Date(),
          userId: user._id,
          projectId: project._id,
        };
  
        const response = await request(app)
          .post('/tasks')
          .send(incompleteTask)
          .expect(400);
  
        expect(response.body.message).toBe(
          'Errores de validación: El nombre debe ser una cadena de texto, El nombre es obligatorio'
        );
      });
    });
  
    // --- TEST: PUT /tasks/:taskId ---
    describe('PUT /tasks/:taskId', () => {
      test('debería actualizar una tarea correctamente', async () => {
        const updatedData = {
          name: 'Updated Task Name',
          description: 'Updated description',
          status: 'in progress',
          dueDate: '2024-02-12',
        };
  
        const response = await request(app)
          .put(`/tasks/${task._id}`)
          .send(updatedData)
          .expect(200);
  
        expect(response.body).toHaveProperty('_id', task._id.toString());
        expect(response.body).toHaveProperty('name', updatedData.name);
        expect(response.body).toHaveProperty('description', updatedData.description);
        expect(response.body).toHaveProperty('status', updatedData.status);
        expect(new Date(response.body.dueDate).toISOString()).toBe(
          new Date(updatedData.dueDate).toISOString()
        );
      });
  
      test('debería retornar un error si la tarea no existe', async () => {
        const invalidTaskId = new mongoose.Types.ObjectId();
  
        const response = await request(app)
          .put(`/tasks/${invalidTaskId}`)
          .send({ name: 'Nonexistent Task' })
          .expect(404);
  
        expect(response.body.message).toBe('Tarea no encontrada.');
      });
  
      test('debería retornar un error si los datos enviados son inválidos', async () => {
        const invalidData = { status: 'invalid-status' };
  
        const response = await request(app)
          .put(`/tasks/${task._id}`)
          .send(invalidData)
          .expect(400);
  
        expect(response.body.message).toContain('Errores de validación');
      });
    });
    describe('GET /tasks/search?query', () => {
        test('debería devolver tareas que coincidan con el nombre', async () => {
          const response = await request(app)
            .get('/tasks/search?query=Test')
            .expect(200);
    
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(0);
    
          const taskResponse = response.body[0];
          expect(taskResponse.name).toMatch(/Test/i);
        });
  
        test('debería devolver tareas que coincidan con la descripción', async () => {
          const response = await request(app)
            .get('/tasks/search?query=description')
            .expect(200);
  
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(0);
  
          const taskResponse = response.body[0];
          expect(taskResponse.description).toMatch(/description/i);
        });
  
        test('debería retornar un error si no se encuentra ninguna tarea', async () => {
          const response = await request(app)
            .get('/tasks/search?query=nonexistent')
            .expect(404);
  
          expect(response.body.message).toBe('No se encontraron coincidencias para el término de búsqueda proporcionado.');
        });
  
        test('debería retornar un error si no se proporciona un término de búsqueda', async () => {
          const response = await request(app)
            .get('/tasks/search')
            .expect(400);
  
          expect(response.body.message).toBe('Se requiere un término de búsqueda.');
        });
      });
      describe('GET /tasks/filter', () => {
        test('debería filtrar tareas por status correctamente', async () => {
          const response = await request(app)
            .get('/tasks/filter?status=pending')
            .expect(200);
      
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(0);
  
          // Verificar que todas las tareas retornadas tengan el status correcto
          response.body.forEach((task) => {
            expect(task.status).toBe('pending');
          });
        });
        test('debería filtrar tareas por dueDate correctamente', async () => {
            const date = '2024-12-25'; // Fecha límite que proporcionamos en la consulta
            const response = await request(app)
              .get(`/tasks/filter?dueDate=${date}`)
              .expect(200);
          
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBeGreaterThan(0);
          
            // Verificar que todas las tareas retornadas tengan la dueDate correcta
            response.body.forEach((task) => {
              const taskDueDate = new Date(task.dueDate);
              // Comparamos la fecha de la tarea con la fecha proporcionada, asegurándonos de que sea menor o igual al final del día
              const providedDate = new Date(date);
              providedDate.setHours(23, 59, 59, 999); // Aseguramos que la fecha proporcionada tenga el valor máximo de hora
              expect(taskDueDate <= providedDate).toBe(true);
            });
          });
        test('debería filtrar tareas por user correctamente', async () => {
          const userId = user._id.toString(); // Usando el ID del usuario creado en el beforeAll
          const response = await request(app)
            .get(`/tasks/filter?user=${userId}`)
            .expect(200);
      
          expect(response.body).toBeInstanceOf(Array);
          expect(response.body.length).toBeGreaterThan(0);
      
          // Verificar que todas las tareas retornadas pertenezcan al usuario correcto
          response.body.forEach((task) => {
            expect(task.user._id.toString()).toBe(userId);
          });
        });
      
        test('debería retornar un error si no se pasan parámetros de filtro', async () => {
          const response = await request(app)
            .get('/tasks/filter')
            .expect(400);
      
          expect(response.body.message).toBe(
            'Se requieren parámetros de filtro: status, dueDate o user.'
          );
        });
      
        test('debería retornar un error si no se encuentran tareas que coincidan con los filtros', async () => {
          const invalidUserId = new mongoose.Types.ObjectId(); // Un ID de usuario inexistente
          const response = await request(app)
            .get(`/tasks/filter?user=${invalidUserId}`)
            .expect(404);
      
          expect(response.body.message).toBe(
            'No se encontraron tareas que coincidan con los filtros proporcionados.'
          );
        });
      });
  });
  