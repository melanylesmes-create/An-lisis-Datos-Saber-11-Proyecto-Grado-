
import { useState } from "react";
import { generarPreguntas } from "./Api";

export default function Pruebas() {
  const [preguntas, setPreguntas] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  async function probarGemini() {
    setCargando(true);
    setError("");
    setPreguntas([]);

    try {
      const resultado = await generarPreguntas(
        "Lectura Crítica",
        "Comprensión de textos",
        3
      );

      setPreguntas(resultado);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  }

  return (
    <main>
      <h1>Prueba de Gemini</h1>

      <button onClick={probarGemini} disabled={cargando}>
        {cargando ? "Generando..." : "Generar preguntas"}
      </button>

      {error && <p>{error}</p>}

      {preguntas.map((pregunta, indice) => (
        <article key={indice}>
          <h3>
            {indice + 1}. {pregunta.enunciado}
          </h3>

          {Object.entries(pregunta.opciones).map(
            ([letra, opcion]) => (
              <p key={letra}>
                <strong>{letra}.</strong> {opcion}
              </p>
            )
          )}
        </article>
      ))}
    </main>
  );
}
