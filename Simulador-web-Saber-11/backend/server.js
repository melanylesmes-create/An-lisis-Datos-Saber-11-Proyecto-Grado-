const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Importar rutas
const usuariosRoutes = require('./routes/usuarios.routes');
const preguntasRoutes = require('./routes/preguntas.routes');
const simulacroRoutes = require('./routes/simulacro.routes');

// Usar rutas
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/preguntas', preguntasRoutes);
app.use('/api/simulacro', simulacroRoutes);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
