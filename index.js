require("dotenv").config();
const server = require("./src/app.js");
const connectDB = require("./src/config/db.js"); // Importamos la función para conectar MongoDB
const PORT = process.env.PORT || 3001;

// Conectar a MongoDB
connectDB().then(() => {
  console.log('MongoDB connected');

  // Iniciar el servidor una vez que la conexión a la base de datos se haya establecido
  server.listen(PORT, () => {
    console.log("Server is running on port", PORT);
  });
}).catch(err => {
  console.error('Error during MongoDB connection:', err);
});
