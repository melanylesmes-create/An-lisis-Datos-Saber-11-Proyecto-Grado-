const UsuarioModel = require('../models/usuarios.model');

function listarUsuarios(req, res) {
  res.status(200).json(UsuarioModel.getUsuarios());
}

function crearUsuario(req, res) {
  const { nombre, correo, password, rol } = req.body;
  if (!nombre || !correo || !password) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }
  const nuevoUsuario = UsuarioModel.addUsuario(nombre, correo, password, rol);
  res.status(201).json({ mensaje: 'Usuario registrado con éxito', usuario: nuevoUsuario });
}

function login(req, res) {
  const { correo, password } = req.body;
  const usuario = UsuarioModel.findUsuario(correo, password);
  if (usuario) {
    return res.status(200).json({ mensaje: 'Login exitoso', usuario });
  }
  return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
}

module.exports = { listarUsuarios, crearUsuario, login };
