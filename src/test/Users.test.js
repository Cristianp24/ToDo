const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../app'); 
const User = require('../models/Users'); 

describe('POST /register', () => {
    beforeAll(async () => {
    
      const url = `mongodb://127.0.0.1/test_db`;
      await mongoose.connect(url);
    });
  
    afterAll(async () => {
    
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
         
        };
      
        const response = await request(app)
          .post('/users/register')
          .send(incompleteUser)
          .expect(400);
      
        expect(response.body).toHaveProperty('message');
        expect(response.body.message).toContain('La contraseña es obligatoria');
      });
  });


  describe('POST /login', () => {
    beforeAll(async () => {

      const url = `mongodb://127.0.0.1/test_db`;
      await mongoose.connect(url);
    });
  
    afterAll(async () => {
    
      await mongoose.connection.db.dropDatabase();
      await mongoose.connection.close();
    });
  
    test('debería iniciar sesión con credenciales correctas y devolver un token', async () => {
      const newUser = {
        name: 'Juan Pérez',
        email: 'juan.perez@example.com',
        password: 'Contraseña123',
      };
  
    
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

            await User.deleteMany(); // 
          });
          
          test('debería retornar una lista de usuarios', async () => {
            // Crear algunos usuarios de prueba en la base de datos
            const user1 = new User({ name: 'Juan Pérez', email: 'juan.perez@example.com', password: 'Contraseña123' });
            const user2 = new User({ name: 'Ana Gómez', email: 'ana.gomez@example.com', password: 'Contraseña123' });
            await user1.save();
            await user2.save();
          
            const response = await request(app)
              .get('/users')
              .expect(200);
          
            expect(response.body).toHaveLength(2);
            expect(response.body[0]).toHaveProperty('name', 'Juan Pérez');
            expect(response.body[1]).toHaveProperty('name', 'Ana Gómez');
          });
        test('debería retornar un error si hay un problema al obtener los usuarios', async () => {
          jest.spyOn(User, 'find').mockRejectedValueOnce(new Error('Error al obtener usuarios'));
      
          const response = await request(app)
            .get('/users')
            .expect(500);

          expect(response.body).toHaveProperty('message', 'Error al obtener los usuarios');
        });
  });
  
  });