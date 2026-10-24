const preguntas = require('../data/preguntas');

function getPreguntas() {
  return preguntas;
}

function addPregunta(materia, enunciado, opciones, respuestaCorrecta) {
  const nuevaPregunta = {
    id: preguntas.length + 1,
    materia,
    enunciado,
    opciones,
    respuestaCorrecta
  };
  preguntas.push(nuevaPregunta);
  return nuevaPregunta;
}

module.exports = { getPreguntas, addPregunta };
