const usuarios = require('../data/usuarios');

function getUsuarios() {
  return usuarios;
}

function addUsuario(nombre, correo, password, rol = 'estudiante') {
  const nuevoUsuario = { id: usuarios.length + 1, nombre, correo, password, rol };
  usuarios.push(nuevoUsuario);
  return nuevoUsuario;
}

function findUsuario(correo, password) {
  return usuarios.find(u => u.correo === correo && u.password === password);
}

module.exports = { getUsuarios, addUsuario, findUsuario };
