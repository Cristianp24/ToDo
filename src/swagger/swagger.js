const swaggerJsdoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'todo',
            version: '1.0.0',
            description: 'API ToDo Tasks',
            contact: {
                name: 'Cristian'
            },
            servers: [
                {
                    url: 'http://localhost:3000',
                    description: 'Local server'
                }
            ]
        }
    },
    apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;