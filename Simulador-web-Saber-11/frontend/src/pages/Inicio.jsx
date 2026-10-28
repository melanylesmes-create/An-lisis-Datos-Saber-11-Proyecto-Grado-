import React from "react";

export default function Inicio({ irA }) {
  return (
    <section>
      <h1>Bienvenido al Simulador Saber 11</h1>
      <p>Accede a simulacros y prepárate para las pruebas Saber 11. ¡Logra tus metas académicas!</p>
      <div className="acciones">
        <button type="button" onClick={() => irA("pruebas")}>Iniciar simulacro</button>
        <button type="button" onClick={() => irA("login")}>Iniciar sesión</button>
      </div>
    </section>
  );
}