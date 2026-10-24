const PreguntaModel = require('../models/preguntas.model');

function listarPreguntas(req, res) {
  res.status(200).json(PreguntaModel.getPreguntas());
}

function crearPregunta(req, res) {
  const { materia, enunciado, opciones, respuestaCorrecta } = req.body;
  if (!materia || !enunciado || !opciones || !respuestaCorrecta) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  const nuevaPregunta = PreguntaModel.addPregunta(materia, enunciado, opciones, respuestaCorrecta);
  res.status(201).json({ mensaje: 'Pregunta registrada con éxito', pregunta: nuevaPregunta });
}

module.exports = { listarPreguntas, crearPregunta };
