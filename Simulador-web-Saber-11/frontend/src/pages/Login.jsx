import React, { useState } from "react";

const API = "http://localhost:3000/api";

export default function Login({ onLogin }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch(`${API}/usuarios/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, password }),
      });
      const data = await res.json();
      if (!res.ok) return setError(data.mensaje || "Error al iniciar sesión");
      onLogin(data.usuario);
    } catch {
      setError("No se pudo conectar con el backend (¿está corriendo en el puerto 3000?)");
    }
  };

  return (
    <div className="login-box">
      <h1>Acceso al módulo</h1>
      <form onSubmit={handleSubmit}>
        <label>Correo</label>
        <input type="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="admin@test.com" required />
        <label>Contraseña</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Tu contraseña" required />
        {error && <p className="error">{error}</p>}
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}