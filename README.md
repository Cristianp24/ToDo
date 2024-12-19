Welcome to Advanced ToDo App 


## Description

This ResApi was developed to be able to create, read, modify and delete: tasks, projects, register and login, assign users to projects, assign tasks to users within a project as well as search and filter tasks

## Technologies Used

- Node.js
- Express
- MongoDB
- Swagger UI

## Installation

   Clone Repo 

   git clone https://github.com/Cristianp24/ToDo

Navigate to the Project Directory:

cd ToDo

Install Dependencies: 

npm install

Config 

Create an .env file at the root of the project and add the following variables:

PORT=
MONGO_URI=
JWT_SECRET=

Ejecute

To start the server in development mode:

npm run dev

To start the server in porduction mode:

npm start 

To start the server for see changes in live (like nodemon) :

node --watch index.js


## Documentation Api

All documentation with Swagger UI

https://todo-restapi-za6s.onrender.com/api-docs || localhost:3000/api-docs

Aditional endpoints for search by page: 

 https://todo-restapi-za6s.onrender.com/projects?page=3 || localhost:3000/projects?page=3
 https://todo-restapi-za6s.onrender.com/tasks?page=3    || localhost:3000/tasks?page=3 
 https://todo-restapi-za6s.onrender.com/users?page=3    || localhost:3000/users?page=3


## Test 

Download MongoDB Local for Tests from https://www.mongodb.com/try/download/community
Create db_test local for tests

run script for run tests : npm test






