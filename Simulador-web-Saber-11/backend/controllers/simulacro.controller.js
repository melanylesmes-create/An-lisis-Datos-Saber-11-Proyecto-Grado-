const SimulacroModel = require('../models/simulacro.model');

function evaluarSimulacro(req, res) {
  const { respuestasUsuario } = req.body;
  if (!respuestasUsuario || !Array.isArray(respuestasUsuario)) {
    return res.status(400).json({ mensaje: 'Formato inválido de respuestas' });
  }
  const puntaje = SimulacroModel.evaluarRespuestas(respuestasUsuario);
  res.status(200).json({ mensaje: 'Evaluación completada', puntaje });
}

module.exports = { evaluarSimulacro };
