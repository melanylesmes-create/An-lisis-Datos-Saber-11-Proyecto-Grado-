const express = require('express');
const router = express.Router();
const SimulacroController = require('../controllers/simulacro.controller');

router.post('/evaluar', SimulacroController.evaluarSimulacro);

module.exports = router;
