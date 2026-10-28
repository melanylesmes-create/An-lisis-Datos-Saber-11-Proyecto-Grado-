
import { useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";

interface AnalisisIAProps {
  registros: ResultadoSaber11[];
}

export default function AnalisisIA({
  registros,
}: AnalisisIAProps) {
  const [interpretacion, setInterpretacion] = useState("");
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const generarAnalisis = async () => {
    setCargando(true);
    setError("");
    setInterpretacion("");

    try {
      // Solicitamos el token CSRF de Django
      const respuestaCSRF = await fetch(
        "http://localhost:8000/api/archivos/csrf/",
        { credentials: "include" }
      );

      if (!respuestaCSRF.ok) {
        throw new Error("No se pudo obtener el token CSRF.");
      }

      const token = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrftoken="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se encontró el token CSRF.");
      }

      // Enviamos los registros a Django
      const respuesta = await fetch(
        "http://localhost:8000/api/analisis-ia/analizar/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            "X-CSRFToken": decodeURIComponent(token),
          },
          body: JSON.stringify({ registros }),
        }
      );

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(
          datos.error || "No se pudo generar el análisis."
        );
      }

      setInterpretacion(datos.interpretacion);

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Ocurrió un error inesperado."
      );
    } finally {
      setCargando(false);
    }
  };

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
      <h3 className="text-xl font-bold text-[#172B4D]">
        Análisis de resultados con inteligencia artificial
      </h3>

      <p className="mt-2 text-gray-500">
        Genera una interpretación de los resultados Saber 11
        utilizando Ollama y Python.
      </p>

      <button
        type="button"
        onClick={generarAnalisis}
        disabled={cargando || registros.length === 0}
        className="mt-5 rounded-lg bg-[#3366CC] px-6 py-3 font-semibold text-white hover:bg-[#254F9E] disabled:opacity-50"
      >
        {cargando ? "Analizando resultados..." : "Analizar con IA"}
      </button>

      {error && (
        <p className="mt-4 text-red-600">{error}</p>
      )}

      {interpretacion && (
        <div className="mt-6 rounded-lg bg-blue-50 p-5">
          <h4 className="mb-3 font-semibold text-[#172B4D]">
            Interpretación generada por Ollama
          </h4>

          <p className="whitespace-pre-line text-gray-700">
            {interpretacion}
          </p>
        </div>
      )}
    </section>
  );
}
