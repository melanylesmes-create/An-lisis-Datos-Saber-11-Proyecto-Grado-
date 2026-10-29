
import React, { useState } from "react";
import "./Registro.css";

const API = "http://localhost:3000/api";

export default function Registro({ onVolverLogin }) {
  const [formulario, setFormulario] = useState({
    tipo_documento: "C.C",
    identificacion: "",
    nombre: "",
    apellido: "",
    correo: "",
    celular: "",
    password: "",
    confirmarPassword: "",
  });

  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    if (formulario.password !== formulario.confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    if (formulario.password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    setCargando(true);

    try {
      const {
        confirmarPassword,
        ...datosRegistro
      } = formulario;

      const respuesta = await fetch(`${API}/usuarios`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosRegistro),
      });

      const data = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          data.mensaje || data.error || "No se pudo registrar el usuario."
        );
      }

      setMensaje("¡Registro exitoso! Ya puedes iniciar sesión.");

      setFormulario({
        tipo_documento: "C.C",
        identificacion: "",
        nombre: "",
        apellido: "",
        correo: "",
        celular: "",
        password: "",
        confirmarPassword: "",
      });
    } catch (err) {
      setError(
        err.message || "No se pudo conectar con el servidor."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="registro-contenedor">
      <div className="registro-caja">
        <h1>Crear cuenta</h1>
        <p className="registro-descripcion">
          Regístrate para utilizar el Simulador Saber 11.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="registro-campo">
            <label htmlFor="tipo_documento">Tipo de documento</label>
            <select
              id="tipo_documento"
              name="tipo_documento"
              value={formulario.tipo_documento}
              onChange={handleChange}
              required
            >
              <option value="C.C">Cédula de ciudadanía</option>
              <option value="T.I">Tarjeta de identidad</option>
              <option value="C.E">Cédula de extranjería</option>
            </select>
          </div>

          <div className="registro-campo">
            <label htmlFor="identificacion">Número de documento</label>
            <input
              id="identificacion"
              name="identificacion"
              type="text"
              value={formulario.identificacion}
              onChange={handleChange}
              placeholder="Ingresa tu documento"
              required
            />
          </div>

          <div className="registro-fila">
            <div className="registro-campo">
              <label htmlFor="nombre">Nombre</label>
              <input
                id="nombre"
                name="nombre"
                value={formulario.nombre}
                onChange={handleChange}
                placeholder="Tu nombre"
                required
              />
            </div>

            <div className="registro-campo">
              <label htmlFor="apellido">Apellido</label>
              <input
                id="apellido"
                name="apellido"
                value={formulario.apellido}
                onChange={handleChange}
                placeholder="Tu apellido"
                required
              />
            </div>
          </div>

          <div className="registro-campo">
            <label htmlFor="correo">Correo electrónico</label>
            <input
              id="correo"
              name="correo"
              type="email"
              value={formulario.correo}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="celular">Celular (opcional)</label>
            <input
              id="celular"
              name="celular"
              type="tel"
              value={formulario.celular}
              onChange={handleChange}
              placeholder="Tu número de celular"
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formulario.password}
              onChange={handleChange}
              placeholder="Mínimo 8 caracteres"
              minLength={8}
              autoComplete="new-password"
              required
            />
          </div>

          <div className="registro-campo">
            <label htmlFor="confirmarPassword">
              Confirmar contraseña
            </label>
            <input
              id="confirmarPassword"
              name="confirmarPassword"
              type="password"
              value={formulario.confirmarPassword}
              onChange={handleChange}
              placeholder="Escribe de nuevo tu contraseña"
              autoComplete="new-password"
              required
            />
          </div>

          {error && (
            <p className="registro-error" role="alert">{error}</p>
          )}

          {mensaje && (
            <p className="registro-exito" role="status">{mensaje}</p>
          )}

          <button
            type="submit"
            className="registro-boton"
            disabled={cargando}
          >
            {cargando ? "Registrando..." : "Registrarme"}
          </button>
        </form>

        <p className="registro-pie">
          ¿Ya tienes una cuenta?{" "}
          <button
            type="button"
            className="registro-enlace"
            onClick={onVolverLogin}
          >
            Inicia sesión
          </button>
        </p>
      </div>
    </div>
  );
}
