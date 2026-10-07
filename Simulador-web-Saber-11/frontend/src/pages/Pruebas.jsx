import React, { useEffect, useState } from "react";

const API = "http://localhost:3000/api";

export default function Pruebas() {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [puntaje, setPuntaje] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API}/preguntas`)
      .then((r) => r.json())
      .then(setPreguntas)
      .catch(() => setError("No se pudo conectar con el backend (puerto 3000)."));
  }, []);

  const enviar = async () => {
    const respuestasUsuario = Object.entries(respuestas).map(([id, respuesta]) => ({
      preguntaId: Number(id),
      respuesta,
    }));
    try {
      const res = await fetch(`${API}/simulacro/evaluar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ respuestasUsuario }),
      });
      const data = await res.json();
      setPuntaje(data.puntaje);
    } catch {
      setError("No se pudo enviar el simulacro.");
    }
  };

  return (
    <section>
      <h1>Simulacro web</h1>
      {error && <p className="error">{error}</p>}
      {preguntas.map((p) => (
        <div key={p.id} className="pregunta">
          <h3>{p.materia}</h3>
          <p>{p.enunciado}</p>
          {p.opciones.map((op) => (
            <button
              key={op}
              type="button"
              className={respuestas[p.id] === op ? "opcion seleccionada" : "opcion"}
              onClick={() => setRespuestas({ ...respuestas, [p.id]: op })}
            >
              {op}
            </button>
          ))}
        </div>
      ))}
      {preguntas.length > 0 && (
        <button type="button" onClick={enviar}>Finalizar simulacro</button>
      )}
      {puntaje !== null && <h2>Puntaje: {puntaje} / {preguntas.length}</h2>}
    </section>
  );
}