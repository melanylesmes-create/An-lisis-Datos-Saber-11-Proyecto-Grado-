const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

let usuarios = [
  { id: 1, nombre: "Admin", correo: "admin@test.com", password: "123", rol: "administrador" }
];

let preguntas = [
  {
    id: 1,
    materia: "Matemáticas",
    enunciado: "¿Cuánto es 2 + 2?",
    opciones: ["2", "3", "4", "5"],
    respuestaCorrecta: "4"
  }
];

app.post('/api/login', (req, res) => {
  const { correo, password } = req.body;
  const usuario = usuarios.find(u => u.correo === correo && u.password === password);

  if (usuario) {
    return res.status(200).json({ mensaje: 'Login exitoso', usuario });
  }
  return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
});

app.get('/api/usuarios', (req, res) => res.status(200).json(usuarios));

app.post('/api/usuarios', (req, res) => {
  const { nombre, correo, password, rol } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  const nuevoUsuario = { id: usuarios.length + 1, nombre, correo, password, rol: rol || 'estudiante' };
  usuarios.push(nuevoUsuario);
  res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
});

app.get('/api/preguntas', (req, res) => res.status(200).json(preguntas));

app.post('/api/preguntas', (req, res) => {
  const { materia, enunciado, opciones, respuestaCorrecta } = req.body;
  if (!materia || !enunciado || !opciones || !respuestaCorrecta) {
    return res.status(400).json({ mensaje: 'Faltan datos de la pregunta' });
  }
  const nuevaPregunta = { id: preguntas.length + 1, materia, enunciado, opciones, respuestaCorrecta };
  preguntas.push(nuevaPregunta);
  res.status(201).json({ mensaje: 'Pregunta creada con éxito', pregunta: nuevaPregunta });
});

app.post('/api/simulacro/evaluar', (req, res) => {
  const { respuestasUsuario } = req.body;

  if (!respuestasUsuario || !Array.isArray(respuestasUsuario)) {
    return res.status(400).json({ mensaje: 'Formato de respuestas inválido' });
  }

  let puntaje = 0;
  respuestasUsuario.forEach(r => {
    const pregunta = preguntas.find(p => p.id === r.preguntaId);
    if (pregunta && pregunta.respuestaCorrecta === r.respuesta) {
      puntaje += 1;
    }
  });

  res.status(200).json({
    mensaje: 'Simulacro finalizado',
    totalPreguntas: respuestasUsuario.length,
    aciertos: puntaje,
    puntajePorcentaje: `${((puntaje / respuestasUsuario.length) * 100).toFixed(1)}%`
  });
});

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));