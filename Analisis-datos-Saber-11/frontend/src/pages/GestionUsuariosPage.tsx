import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Rol, Usuario } from "../types/usuario";

const API = "http://localhost:8000/api";

interface GestionUsuariosPageProps {
  usuarioActual: Usuario;
}

type FormularioUsuario = {
  tipo_identificacion: string;
  numero_identificacion: string;
  nombre: string;
  apellido: string;
  correo: string;
  contrasena: string;
  rol: Rol;
};

const formularioVacio: FormularioUsuario = {
  tipo_identificacion: "C.C",
  numero_identificacion: "",
  nombre: "",
  apellido: "",
  correo: "",
  contrasena: "",
  rol: "funcionario",
};

export default function GestionUsuariosPage({
  usuarioActual,
}: GestionUsuariosPageProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [formulario, setFormulario] =
    useState<FormularioUsuario>(formularioVacio);
  const [editandoId, setEditandoId] = useState<number | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");

  const cargarUsuarios = async () => {
    setCargando(true);
    setError("");

    try {
      const respuesta = await fetch(`${API}/mostrar/`, {
        credentials: "include",
      });
      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No fue posible cargar los usuarios.");
      }

      setUsuarios(datos.usuarios ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    const temporizador = setTimeout(() => {
      void cargarUsuarios();
    }, 0);

    return () => clearTimeout(temporizador);
  }, []);

  const cambiarCampo = (campo: keyof FormularioUsuario, valor: string) => {
    setFormulario((actual) => ({ ...actual, [campo]: valor }));
  };

  const limpiarFormulario = () => {
    setFormulario(formularioVacio);
    setEditandoId(null);
  };

  const guardarUsuario = async (evento: FormEvent) => {
    evento.preventDefault();
    setError("");
    setMensaje("");

    const esEdicion = editandoId !== null;

    try {
      const respuesta = await fetch(
        esEdicion
          ? `${API}/editar-usuario/${editandoId}/`
          : `${API}/crear-usuario/`,
        {
          method: esEdicion ? "PUT" : "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formulario),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No fue posible guardar el usuario.");
      }

      setMensaje(
        esEdicion
          ? "Usuario actualizado correctamente."
          : "Usuario registrado correctamente."
      );
      limpiarFormulario();
      await cargarUsuarios();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    }
  };

  const seleccionarUsuario = (usuario: Usuario) => {
    setEditandoId(usuario.id_usuario);
    setFormulario({
      tipo_identificacion: usuario.tipo_identificacion,
      numero_identificacion: usuario.numero_identificacion,
      nombre: usuario.nombre,
      apellido: usuario.apellido,
      correo: usuario.correo,
      contrasena: "",
      rol: usuario.rol,
    });
    setError("");
    setMensaje("");
  };

  const eliminarUsuario = async (usuario: Usuario) => {
    if (!window.confirm(`¿Eliminar el usuario ${usuario.nombre}?`)) {
      return;
    }

    setError("");
    setMensaje("");

    try {
      const respuesta = await fetch(
        `${API}/eliminar-usuario/${usuario.id_usuario}/`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "No fue posible eliminar el usuario.");
      }

      if (editandoId === usuario.id_usuario) {
        limpiarFormulario();
      }

      setMensaje("Usuario eliminado correctamente.");
      await cargarUsuarios();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F6F9]">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-[#172B4D]">
            Gestión de usuarios
          </h2>

          <p className="mt-2 text-gray-500">
            Registra, modifica, consulta y elimina los usuarios de la
            plataforma. Esta sección solo está disponible para el
            administrador.
          </p>
        </section>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {error}
          </div>
        )}

        {mensaje && (
          <div className="mb-6 rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {mensaje}
          </div>
        )}

        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-[#172B4D]">
            {editandoId === null ? "Registrar usuario" : "Editar usuario"}
          </h3>

          <form
            onSubmit={guardarUsuario}
            className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2"
          >
            <div>
              <label className="text-sm text-gray-600">Tipo de identificación</label>
              <select
                value={formulario.tipo_identificacion}
                onChange={(e) =>
                  cambiarCampo("tipo_identificacion", e.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="C.C">C.C</option>
                <option value="T.I">T.I</option>
                <option value="PASAPORTE">Pasaporte</option>
              </select>
            </div>

            <div>
              <label className="text-sm text-gray-600">Número de identificación</label>
              <input
                type="text"
                required
                value={formulario.numero_identificacion}
                onChange={(e) =>
                  cambiarCampo("numero_identificacion", e.target.value)
                }
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Nombre</label>
              <input
                type="text"
                required
                value={formulario.nombre}
                onChange={(e) => cambiarCampo("nombre", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Apellido</label>
              <input
                type="text"
                value={formulario.apellido}
                onChange={(e) => cambiarCampo("apellido", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Correo</label>
              <input
                type="email"
                required
                value={formulario.correo}
                onChange={(e) => cambiarCampo("correo", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">
                Contraseña {editandoId !== null && "(dejar vacía para conservar)"}
              </label>
              <input
                type="password"
                required={editandoId === null}
                value={formulario.contrasena}
                onChange={(e) => cambiarCampo("contrasena", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600">Rol</label>
              <select
                value={formulario.rol}
                onChange={(e) => cambiarCampo("rol", e.target.value)}
                className="mt-1 w-full rounded-lg border border-gray-300 p-3"
              >
                <option value="funcionario">Funcionario</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>

            <div className="flex items-end gap-3">
              <button
                type="submit"
                className="rounded-lg bg-[#3366CC] px-6 py-3 font-semibold text-white hover:bg-[#254F9E]"
              >
                {editandoId === null ? "Registrar" : "Guardar cambios"}
              </button>

              {editandoId !== null && (
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="rounded-lg border border-gray-300 px-6 py-3 text-gray-600 hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-[#172B4D]">
              Usuarios registrados
            </h3>

            <button
              type="button"
              onClick={cargarUsuarios}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50"
            >
              Actualizar
            </button>
          </div>

          {cargando ? (
            <p className="mt-5 text-gray-500">Cargando usuarios...</p>
          ) : usuarios.length === 0 ? (
            <p className="mt-5 text-gray-500">
              No hay usuarios registrados.
            </p>
          ) : (
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-500">
                    <th className="py-3 pr-4">Identificación</th>
                    <th className="py-3 pr-4">Nombre</th>
                    <th className="py-3 pr-4">Correo</th>
                    <th className="py-3 pr-4">Rol</th>
                    <th className="py-3">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {usuarios.map((usuario) => (
                    <tr key={usuario.id_usuario} className="border-b border-gray-100">
                      <td className="py-3 pr-4 text-gray-700">
                        {usuario.tipo_identificacion} {usuario.numero_identificacion}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {usuario.nombre} {usuario.apellido}
                      </td>
                      <td className="py-3 pr-4 text-gray-700">
                        {usuario.correo}
                      </td>
                      <td className="py-3 pr-4">
                        <span className="rounded-full bg-[#EAF1FF] px-3 py-1 text-xs font-semibold text-[#3366CC]">
                          {usuario.rol}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => seleccionarUsuario(usuario)}
                            className="rounded-lg border border-gray-300 px-3 py-1 text-gray-600 hover:bg-gray-50"
                          >
                            Editar
                          </button>

                          <button
                            type="button"
                            onClick={() => eliminarUsuario(usuario)}
                            disabled={
                              usuario.id_usuario === usuarioActual.id_usuario
                            }
                            className="rounded-lg border border-red-200 px-3 py-1 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
