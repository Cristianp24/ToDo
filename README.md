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










localhost:3000/tasks/filter/?status=complete

localhost:3000/tasks/filter?dueDate=2024-12-25

localhost:3000/tasks/filter?user=6762549451367a8a8db5adca

localhost:3000/tasks/search?query=Descripción || localhost:3000/tasks/search?query=nombre




