
import React, { useState } from "react";
import { generarPreguntas } from "../Service/gemini.js";
import { jsPDF } from "jspdf";

export default function api({ irA }) {
  const [area, setArea] = useState("Lectura Crítica");
  const [tema, setTema] = useState("");
  const [preguntas, setPreguntas] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function crearPreguntas() {
    if (!tema.trim()) {
      setError("Escribe el tema de las preguntas.");
      return;
    }

    setCargando(true);
    setError("");
    setPreguntas([]);

    try {
      const resultado = await generarPreguntas(area, tema, 3);
      setPreguntas(resultado || []);
    } catch (err) {
      setError(err.message || "Error al generar preguntas.");
    } finally {
      setCargando(false);
    }
  }

  function crearPDF() {
    if (preguntas.length === 0) {
      setError("Primero debes generar las preguntas para crear el PDF.");
      return;
    }

    const documento = new jsPDF();
    const margen = 15;
    const anchoTexto = 180;
    let y = 20;

    // Título
    documento.setFontSize(18);
    documento.text("Simulador Saber 11", margen, y);
    y += 10;

    documento.setFontSize(12);
    documento.text(`Área: ${area}`, margen, y);
    y += 7;

    const temaLineas = documento.splitTextToSize(
      `Tema: ${tema}`,
      anchoTexto
    );
    documento.text(temaLineas, margen, y);
    y += temaLineas.length * 6 + 5;

    documento.setFontSize(11);

    // Preguntas y opciones
    preguntas.forEach((pregunta, indice) => {
      const enunciado = documento.splitTextToSize(
        `${indice + 1}. ${pregunta.enunciado}`,
        anchoTexto
      );

      // Comprobar si queda espacio para el enunciado
      if (y + enunciado.length * 6 > 275) {
        documento.addPage();
        y = 20;
      }

      documento.setFont("helvetica", "bold");
      documento.text(enunciado, margen, y);
      y += enunciado.length * 6 + 2;

      documento.setFont("helvetica", "normal");

      Object.entries(pregunta.opciones || {}).forEach(
        ([letra, opcion]) => {
          const lineas = documento.splitTextToSize(
            `${letra}. ${opcion}`,
            anchoTexto - 5
          );

          if (y + lineas.length * 6 > 280) {
            documento.addPage();
            y = 20;
          }

          documento.text(lineas, margen + 4, y);
          y += lineas.length * 6 + 1;
        }
      );

      y += 5;
    });

    // Respuestas al final
    documento.addPage();
    y = 20;

    documento.setFontSize(16);
    documento.setFont("helvetica", "bold");
    documento.text("Respuestas y explicaciones", margen, y);
    y += 12;

    documento.setFontSize(11);

    preguntas.forEach((pregunta, indice) => {
      const respuesta = documento.splitTextToSize(
        `${indice + 1}. Respuesta correcta: ${pregunta.respuestaCorrecta}`,
        anchoTexto
      );

      const explicacion = documento.splitTextToSize(
        `Explicación: ${pregunta.explicacion || "No disponible."}`,
        anchoTexto
      );

      if (y + (respuesta.length + explicacion.length) * 6 + 5 > 280) {
        documento.addPage();
        y = 20;
      }

      documento.setFont("helvetica", "bold");
      documento.text(respuesta, margen, y);
      y += respuesta.length * 6 + 2;

      documento.setFont("helvetica", "normal");
      documento.text(explicacion, margen, y);
      y += explicacion.length * 6 + 6;
    });

    const nombreArchivo = `Preguntas_Saber11_${area.replace(
      /\s+/g,
      "_"
    )}.pdf`;

    documento.save(nombreArchivo);
    setError("");
  }

  return (
    <section>
      <h1>Generar preguntas a través de IA</h1>
      <p>Generación de preguntas con Groq</p>

      <label htmlFor="area">Área:</label>
      <select
        id="area"
        value={area}
        onChange={(e) => setArea(e.target.value)}
      >
        <option>Lectura Crítica</option>
        <option>Matemáticas</option>
        <option>Ciencias Naturales</option>
        <option>Sociales y Ciudadanas</option>
        <option>Inglés</option>
      </select>

      <br />
      <br />

      <label htmlFor="tema">Tema:</label>
      <input
        id="tema"
        value={tema}
        onChange={(e) => setTema(e.target.value)}
        placeholder="Ej. Comprensión de textos"
      />

      <div className="acciones">
        <button
          type="button"
          onClick={crearPreguntas}
          disabled={cargando}
        >
          {cargando ? "Generando..." : "Crear preguntas"}
        </button>

        <button
          type="button"
          onClick={crearPDF}
          disabled={cargando || preguntas.length === 0}
        >
          Crear PDF
        </button>
      </div>

      {error && <p role="alert">{error}</p>}

      {preguntas.map((pregunta, indice) => (
        <article key={indice}>
          <h3>
            {indice + 1}. {pregunta.enunciado}
          </h3>

          {Object.entries(pregunta.opciones || {}).map(
            ([letra, opcion]) => (
              <p key={letra}>
                <strong>{letra}.</strong> {opcion}
              </p>
            )
          )}

          <details>
            <summary>Ver respuesta correcta</summary>
            <p>{pregunta.respuestaCorrecta}</p>
            <p>{pregunta.explicacion}</p>
          </details>
        </article>
      ))}
    </section>
  );
}
