const preguntas = require('../data/preguntas');

function evaluarRespuestas(respuestasUsuario) {
  let puntaje = 0;
  respuestasUsuario.forEach(r => {
    const pregunta = preguntas.find(p => p.id === r.preguntaId);
    if (pregunta && pregunta.respuestaCorrecta === r.respuesta) {
      puntaje++;
    }
  });
  return puntaje;
}

module.exports = { evaluarRespuestas };
