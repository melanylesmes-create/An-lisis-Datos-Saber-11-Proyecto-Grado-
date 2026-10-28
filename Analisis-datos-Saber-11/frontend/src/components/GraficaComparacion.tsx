
import { useEffect, useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";
import type { AreaSaber11 } from "./FiltrosGraficas";

interface GraficaComparacionProps {
  registros: ResultadoSaber11[];
  area: AreaSaber11;
}

export default function GraficaComparacion({
  registros,
  area,
}: GraficaComparacionProps) {

  const [imagen, setImagen] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controlador = new AbortController();
    let urlImagen: string | null = null;

    const obtenerGrafica = async () => {
      setCargando(true);
      setError(null);
      setImagen(null);

      try {
        // Solicitamos el token CSRF
        const respuestaCSRF = await fetch(
          "http://localhost:8000/api/archivos/csrf/",
          {
            credentials: "include",
            signal: controlador.signal,
          }
        );

        if (!respuestaCSRF.ok) {
          throw new Error("No se pudo solicitar el token CSRF.");
        }

        const token = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("csrftoken="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No se encontró el token CSRF.");
        }

        // Solicitamos la gráfica comparativa
        const respuesta = await fetch(
          "http://localhost:8000/api/resultados/grafica-comparacion/",
          {
            method: "POST",
            credentials: "include",
            signal: controlador.signal,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": decodeURIComponent(token),
            },
            body: JSON.stringify({ registros, area }),
          }
        );

        if (!respuesta.ok) {
          throw new Error("No fue posible generar la comparación.");
        }

        const archivo = await respuesta.blob();
        urlImagen = URL.createObjectURL(archivo);

        if (!controlador.signal.aborted) {
          setImagen(urlImagen);
        }
      } catch (err) {
        if (!controlador.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error inesperado."
          );
        }
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    };

    if (registros.length > 0) {
      obtenerGrafica();
    }

    return () => {
      controlador.abort();

      if (urlImagen) {
        URL.revokeObjectURL(urlImagen);
      }
    };
  }, [registros, area]);

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-semibold text-[#172B4D]">
        Comparación entre instituciones educativas
      </h3>

      {cargando && (
        <p className="mt-4 text-gray-500">
          Generando gráfica comparativa...
        </p>
      )}

      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {imagen && (
        <img
          src={imagen}
          alt="Comparación de resultados Saber 11 entre instituciones"
          className="mt-6 w-full"
        />
      )}

    </section>
  );
}
