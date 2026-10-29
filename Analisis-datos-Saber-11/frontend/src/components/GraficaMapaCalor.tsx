
import { useEffect, useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";

// Define los registros que recibe el componente
interface GraficaMapaCalorProps {
  registros: ResultadoSaber11[];
}

export default function GraficaMapaCalor({
  registros,
}: GraficaMapaCalorProps) {

  // Guarda la imagen, el estado de carga y los posibles errores
  const [imagen, setImagen] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controlador = new AbortController();
    let urlImagen: string | null = null;

    // Solicita al backend la generación del mapa de calor
    const obtenerGrafica = async () => {
      setCargando(true);
      setError(null);
      setImagen(null);

      try {
        // Solicita el token CSRF necesario para enviar el POST
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

        // Obtiene el token CSRF almacenado en las cookies
        const token = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("csrftoken="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No se encontró el token CSRF.");
        }

        // Envía los registros al endpoint del mapa de calor
        const respuesta = await fetch(
          "http://localhost:8000/api/resultados/grafica-mapa-calor/",
          {
            method: "POST",
            credentials: "include",
            signal: controlador.signal,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": decodeURIComponent(token),
            },
            body: JSON.stringify({ registros }),
          }
        );

        if (!respuesta.ok) {
          // Intenta mostrar el error enviado por Django
          const contenidoError = await respuesta.json().catch(() => null);

          throw new Error(
            contenidoError?.error ||
            "No fue posible generar el mapa de calor."
          );
        }

        // Convierte la respuesta del backend en una imagen
        const archivo = await respuesta.blob();
        urlImagen = URL.createObjectURL(archivo);

        // Muestra la imagen si la solicitud sigue activa
        if (!controlador.signal.aborted) {
          setImagen(urlImagen);
        }
      } catch (err) {
        // Muestra el error sin actualizar un componente desmontado
        if (!controlador.signal.aborted) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error inesperado."
          );
        }
      } finally {
        // Finaliza el estado de carga
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    };

    // Genera la gráfica únicamente si hay registros disponibles
    if (registros.length > 0) {
      obtenerGrafica();
    } else {
      setError("No hay registros disponibles para generar el mapa de calor.");
    }

    // Cancela solicitudes y libera la imagen al desmontar o actualizar
    return () => {
      controlador.abort();

      if (urlImagen) {
        URL.revokeObjectURL(urlImagen);
      }
    };
  }, [registros]);

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Título de la gráfica */}
      <h3 className="text-xl font-semibold text-[#172B4D]">
        Mapa de calor de resultados por institución
      </h3>

      {/* Informa mientras se genera la imagen */}
      {cargando && (
        <p className="mt-4 text-gray-500">
          Generando mapa de calor...
        </p>
      )}

      {/* Muestra los errores de generación */}
      {error && (
        <p className="mt-4 text-red-600">
          {error}
        </p>
      )}

      {/* Muestra el mapa de calor generado por Django */}
      {imagen && (
        <img
          src={imagen}
          alt="Mapa de calor de los resultados Saber 11 por institución y área"
          className="mt-6 w-full"
        />
      )}

    </section>
  );
}
