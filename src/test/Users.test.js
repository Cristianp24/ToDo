const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); // Asegúrate de que esta ruta apunte correctamente a tu aplicación Express
const User = require('../models/Users'); // Asegúrate de que esta ruta apunte correctamente a tu modelo de usuario

describe('POST /register', () => {
    beforeAll(async () => {
      // Conectar a la base de datos de prueba
      const url = `mongodb://127.0.0.1/test_db`;
      await mongoose.connect(url);
    });
  
    afterAll(async () => {
      // Limpiar y cerrar la conexión de la base de datos
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });
  
    test('debería registrar un nuevo usuario y devolver un token', async () => {
      const newUser = {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'Contraseña123',
      };
  
      const response = await request(app)
        .post('/users/register')
        .send(newUser)
        .expect(201);
  
      expect(response.body).toHaveProperty('message', 'Usuario registrado con éxito');
      expect(response.body).toHaveProperty('token');
    });
  
    test('debería retornar un error si el usuario ya existe', async () => {
      const existingUser = {
        name: 'Ana Gómez',
        email: 'ana.gomez@example.com',
        password: 'Contraseña123',
      };
  
      // Crear el usuario en la base de datos
      await User.create(existingUser);
  
      const response = await request(app)
        .post('/users/register')
        .send(existingUser)
        .expect(400);
  
        expect(response.body).toHaveProperty('message');
    });
  
    test('debería retornar un error si faltan campos requeridos', async () => {
        const incompleteUser = {
          name: 'Carlos López',
          email: 'carlos.lopez@example.com',
          // Falta el campo 'password'
        };
      
        const response = await request(app)
          .post('/users/register')
          .send(incompleteUser)
          .expect(400);
      
        // Verificar que la respuesta tiene el mensaje de error adecuado
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('La contraseña es obligatoria');
      });
  });


  describe('POST /login', () => {
    beforeAll(async () => {
      // Conectar a la base de datos de prueba
      const url = `mongodb://127.0.0.1/test_db`;
      await mongoose.connect(url);
    });
  
    afterAll(async () => {
      // Limpiar y cerrar la conexión de la base de datos
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });
  
    test('debería iniciar sesión con credenciales correctas y devolver un token', async () => {
      const newUser = {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'Contraseña123',
      };
  
      // Crear el usuario en la base de datos
      await User.create(newUser);
  
      const loginUser = {
        email: 'juan.perez@example.com',
        password: 'Contraseña123',
      };
  
      const response = await request(app)
        .post('/users/login')
        .send(loginUser)
        .expect(200);
  
      expect(response.body).toHaveProperty('message', 'Inicio de sesión exitoso');
      expect(response.body).toHaveProperty('token');
    });
  
    test('debería retornar un error si el usuario no existe', async () => {
      const loginUser = {
        email: 'usuario.inexistente@example.com',
        password: 'Contraseña123',
      };
  
      const response = await request(app)
        .post('/users/login')
        .send(loginUser)
        .expect(400);
  
      expect(response.body).toHaveProperty('message', 'Usuario no encontrado');
    });
  
    test('debería retornar un error si la contraseña es incorrecta', async () => {
      const newUser = {
        name: 'Ana Gómez',
        email: 'ana.gomez@example.com',
        password: 'Contraseña123',
      };
  
      // Crear el usuario en la base de datos
      await User.create(newUser);
  
      const loginUser = {
        email: 'ana.gomez@example.com',
        password: 'ContraseñaIncorrecta',
      };
  
      const response = await request(app)
        .post('/users/login')
        .send(loginUser)
        .expect(400);
  
      expect(response.body).toHaveProperty('message', 'Contraseña incorrecta');
    });
  
    test('debería retornar un error si faltan campos requeridos', async () => {
        const incompleteUser = {
          email: 'carlos.lopez@example.com',
          // Falta el campo 'password'
        };
      
        const response = await request(app)
          .post('/users/login')
          .send(incompleteUser)
          .expect(400);
      
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('La contraseña es obligatoria');
      });

      describe('GET /users', () => {
        beforeEach(async () => {
  // Limpiar la base de datos antes de cada prueba
  await User.deleteMany(); // Elimina todos los usuarios antes de cada prueba
});

test('debería retornar una lista de usuarios con paginación', async () => {
  // Crear algunos usuarios de prueba en la base de datos
  const user1 = new User({ name: 'Juan Pérez', email: 'juan.perez@example.com', password: 'Contraseña123' });
  const user2 = new User({ name: 'Ana Gómez', email: 'ana.gomez@example.com', password: 'Contraseña123' });
  const user3 = new User({ name: 'Carlos Sánchez', email: 'carlos.sanchez@example.com', password: 'Contraseña123' });
  const user4 = new User({ name: 'María López', email: 'maria.lopez@example.com', password: 'Contraseña123' });
  const user5 = new User({ name: 'Pedro Ruiz', email: 'pedro.ruiz@example.com', password: 'Contraseña123' });
  const user6 = new User({ name: 'Laura Martínez', email: 'laura.martinez@example.com', password: 'Contraseña123' });
  await user1.save();
  await user2.save();
  await user3.save();
  await user4.save();
  await user5.save();
  await user6.save();

  // Hacer una solicitud a la primera página
  const response = await request(app)
    .get('/users?page=1')
    .expect(200);

  // Verificar la respuesta de la página 1
  expect(response.body.users).toHaveLength(5); // Debería haber 5 usuarios en la página 1
  expect(response.body.currentPage).toBe(1);
  expect(response.body.totalPages).toBeGreaterThanOrEqual(1);
  expect(response.body.totalUsers).toBe(6); // Total de usuarios en la base de datos

  // Verificar los usuarios que se recibieron
  expect(response.body.users[0]).toHaveProperty('name', 'Juan Pérez');
  expect(response.body.users[1]).toHaveProperty('name', 'Ana Gómez');
  expect(response.body.users[2]).toHaveProperty('name', 'Carlos Sánchez');
  expect(response.body.users[3]).toHaveProperty('name', 'María López');
  expect(response.body.users[4]).toHaveProperty('name', 'Pedro Ruiz');

  // Hacer una solicitud a la segunda página
  const responsePage2 = await request(app)
    .get('/users?page=2')
    .expect(200);

  // Verificar la respuesta de la página 2
  expect(responsePage2.body.users).toHaveLength(1); // Solo debería haber un usuario en la página 2
  expect(responsePage2.body.currentPage).toBe(2);
  expect(responsePage2.body.totalPages).toBeGreaterThanOrEqual(1);
  expect(responsePage2.body.totalUsers).toBe(6); // Total de usuarios en la base de datos

  // Verificar el usuario recibido en la página 2
  expect(responsePage2.body.users[0]).toHaveProperty('name', 'Laura Martínez');
});
        test('debería retornar un error si hay un problema al obtener los usuarios', async () => {
          // Simular un error de base de datos
          jest.spyOn(User, 'find').mockRejectedValueOnce(new Error('Error al obtener usuarios'));
      
          const response = await request(app)
            .get('/users')
            .expect(500);
      
          expect(response.body).toHaveProperty('message', 'Error al obtener los usuarios');
        });
  });
  
  });