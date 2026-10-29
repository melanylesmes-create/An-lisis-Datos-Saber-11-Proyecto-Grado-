
import React, { useState } from "react";
import Inicio from "./pages/Inicio.jsx";
import Login from "./pages/Login.jsx";
import Pruebas from "./pages/Pruebas.jsx";
import Api from "./pages/Api.jsx";
import Registro from "./pages/Registro.jsx";

const MENU = [
  { id: "inicio", texto: "Inicio" },
  { id: "pruebas", texto: "Simulacro web" },
  { id: "login", texto: "Iniciar sesión" },
  { id: "registro", texto: "Registrarse" },
  { id: "api", texto: "Generar pregunta IA" },
];

export default function App() {
  const [pagina, setPagina] = useState("inicio");
  const [usuario, setUsuario] = useState(null);

  return (
    <div>
      <header className="header">
        <div className="logo">GOV.CO</div>
        <div className="title">
          <h2>ALCALDÍA DE POPAYÁN</h2>
          <h3>SECRETARÍA DE EDUCACIÓN</h3>
        </div>
      </header>

      <nav className="nav">
        {MENU.map((m) => (
          <button
            key={m.id}
            type="button"
            className={pagina === m.id ? "nav-btn activo" : "nav-btn"}
            onClick={() => setPagina(m.id)}
          >
            {m.texto}
          </button>
        ))}

        {usuario && (
          <button
            type="button"
            className="nav-btn salir"
            onClick={() => {
              setUsuario(null);
              setPagina("inicio");
            }}
          >
            Salir ({usuario.nombre})
          </button>
        )}
      </nav>

      <main className="contenido">
        {pagina === "inicio" && <Inicio irA={setPagina} />}

        {pagina === "pruebas" && <Pruebas />}

        {pagina === "api" && <Api />}

        {pagina === "login" && (
          <Login
            onLogin={(u) => {
              setUsuario(u);
              setPagina("inicio");
            }}
          />
        )}

        {pagina === "registro" && (
          <Registro
            onVolverLogin={() => setPagina("login")}
          />
        )}
      </main>
    </div>
  );
}
