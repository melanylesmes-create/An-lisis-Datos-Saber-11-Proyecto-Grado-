const express = require('express');
const router = express.Router();
const UsuarioController = require('../controllers/usuarios.controller');

router.get('/', UsuarioController.listarUsuarios);
router.post('/', UsuarioController.crearUsuario);
router.post('/login', UsuarioController.login);

module.exports = router;
