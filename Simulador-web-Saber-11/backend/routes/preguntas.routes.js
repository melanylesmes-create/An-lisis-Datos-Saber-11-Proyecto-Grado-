const express = require('express');
const router = express.Router();
const PreguntaController = require('../controllers/preguntas.controller');

router.get('/', PreguntaController.listarPreguntas);
router.post('/', PreguntaController.crearPregunta);

module.exports = router;
