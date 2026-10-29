
const supabase = require('../config/supabase');
const supabaseAdmin = require('../config/supabaseAdmin');

// Consultar usuarios
async function listarUsuarios(req, res) {
  try {
    const { data, error } = await supabase
      .from('usuario')
      .select(
        'identificacion, nombre, apellido, email, tipo_usuario'
      );

    if (error) {
      console.error(error.message);
      return res.status(500).json({
        mensaje: 'No se pudieron consultar los usuarios',
      });
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
}

// Registrar cuenta y perfil
async function crearUsuario(req, res) {
  let authUserId;
  

  try {
    const {
      identificacion,
      tipo_documento,
      nombre,
      apellido,
      correo,
      password,
      celular,
      institucion_codigo_dane,
    } = req.body;

    if (
      !identificacion ||
      !tipo_documento ||
      !nombre ||
      !apellido ||
      !correo ||
      !password
    ) {
      return res.status(400).json({
        mensaje:
          'Completa identificación, tipo de documento, nombre, apellido, correo y contraseña.',
      });
    }

    if (String(password).length < 8) {
      return res.status(400).json({
        mensaje: 'La contraseña debe tener al menos 8 caracteres.',
      });
    }

    // El registro público siempre crea estudiantes.
    // Los demás roles deben asignarse mediante un proceso autorizado.
   console.log("Paso 1: intentando crear cuenta en Supabase Auth");

    const { data: authData, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email: correo,
        password,
        email_confirm: true,
      });

    if (authError) {
      console.error("Error de Supabase Auth:", authError);
      return res.status(400).json({ mensaje: authError.message });
    }

    console.log("Paso 1 correcto: cuenta creada en Auth");

    if (authError) {
      return res.status(400).json({
        mensaje: authError.message,
      });
    }

    authUserId = authData.user.id;

    const perfil = {
      auth_user_id: authUserId,
      identificacion,
      tipo_documento,
      nombre,
      apellido,
      email: correo,
      tipo_usuario: 'Estudiante',
    };

    if (celular) perfil.celular = celular;

    if (institucion_codigo_dane) {
      perfil['institución_codigo_dane'] =
        institucion_codigo_dane;
    }

    console.log("Paso 2: intentando guardar perfil en la tabla usuario");

    const { data: usuario, error: perfilError } =
      await supabaseAdmin
        .from('usuario')
        .insert(perfil)
        .select(
          'identificacion, nombre, apellido, email, tipo_usuario'
        )
        .single();

    if (perfilError) {

      console.error("Error al guardar perfil:", perfilError);
      // Evita dejar una cuenta sin su perfil correspondiente.
      await supabaseAdmin.auth.admin.deleteUser(authUserId);

      console.error('Error al guardar el perfil:', perfilError.message);

      return res.status(400).json({
        mensaje:
          'Se creó la cuenta, pero no se pudo guardar el perfil. Revisa las columnas y restricciones de la tabla usuario.',
      });
    }

    return res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      usuario,
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    if (authUserId) {
      await supabaseAdmin.auth.admin.deleteUser(authUserId);
    }

    return res.status(500).json({
      mensaje: 'Error interno al registrar el usuario',
    });
  }
}

// Iniciar sesión
async function login(req, res) {
  try {
    const { correo, password } = req.body;

    if (!correo || !password) {
      return res.status(400).json({
        mensaje: 'El correo y la contraseña son obligatorios',
      });
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email: correo,
        password,
      });

    if (error) {
      return res.status(401).json({
        mensaje: 'Correo o contraseña incorrectos',
      });
    }

    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso',
      usuario: {
        id: data.user.id,
        email: data.user.email,
      },
      sesion: data.session,
    });
  } catch (error) {
    console.error('Error en el inicio de sesión:', error);

    return res.status(500).json({
      mensaje: 'Error interno del servidor',
    });
  }
}

module.exports = {
  listarUsuarios,
  crearUsuario,
  login,
};