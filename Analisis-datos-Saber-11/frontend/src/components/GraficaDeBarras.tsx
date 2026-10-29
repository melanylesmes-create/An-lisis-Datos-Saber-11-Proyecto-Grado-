
import { useEffect, useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";

// Propiedades que recibe el componente
interface GraficasResultadosProps {
  registros: ResultadoSaber11[];
}

export default function GraficasResultados({
  registros,
}: GraficasResultadosProps) {

  // Guarda la dirección temporal de la imagen generada
  const [imagen, setImagen] = useState<string | null>(null);

  // Controla el estado de carga
  const [cargando, setCargando] = useState(false);

  // Guarda los posibles errores
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {

    // Evitamos generar una gráfica sin registros
    if (registros.length === 0) {
      setImagen(null);
      return;
    }

    let cancelado = false;
    let urlImagen: string | null = null;

    const generarGrafica = async () => {
      setCargando(true);
      setError(null);
      setImagen(null);

      try {

        // Solicitamos la cookie CSRF a Django
        const respuestaCSRF = await fetch(
          "http://localhost:8000/api/archivos/csrf/",
          {
            method: "GET",
            credentials: "include",
          }
        );

        if (!respuestaCSRF.ok) {
          throw new Error("No se pudo solicitar el token CSRF.");
        }

        // Obtenemos el token de seguridad
        const token = document.cookie
          .split("; ")
          .find((cookie) => cookie.startsWith("csrftoken="))
          ?.split("=")[1];

        if (!token) {
          throw new Error("No se encontró el token CSRF.");
        }

        // Enviamos los registros procesados a Django
        const respuesta = await fetch(
          "http://localhost:8000/api/resultados/grafica-areas/",
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

        if (!respuesta.ok) {
          throw new Error(
            `No se pudo generar la gráfica. Error HTTP ${respuesta.status}.`
          );
        }

        // Django devuelve una imagen PNG
        const archivoImagen = await respuesta.blob();

        if (!archivoImagen.type.includes("image/png")) {
          throw new Error("Django no devolvió una imagen PNG.");
        }

        // Creamos una URL temporal para mostrar la imagen
        urlImagen = URL.createObjectURL(archivoImagen);

        if (!cancelado) {
          setImagen(urlImagen);
        } else {
          URL.revokeObjectURL(urlImagen);
        }

      } catch (err) {
        if (!cancelado) {
          setError(
            err instanceof Error
              ? err.message
              : "Ocurrió un error al generar la gráfica."
          );
        }
      } finally {
        if (!cancelado) {
          setCargando(false);
        }
      }
    };

    generarGrafica();

    // Liberamos la imagen cuando cambian los registros
    return () => {
      cancelado = true;

      if (urlImagen) {
        URL.revokeObjectURL(urlImagen);
      }
    };

  }, [registros]);

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-semibold text-[#172B4D]">
        Promedio de puntajes por área
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Comparación de los promedios obtenidos en las cinco
        áreas evaluadas de las pruebas Saber 11.
      </p>

      {cargando && (
        <p className="mt-6 text-center text-gray-500">
          Generando gráfica...
        </p>
      )}

      {error && (
        <p className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
          {error}
        </p>
      )}

      {imagen && !cargando && (
        <div className="mt-6 flex justify-center">
          <img
            src={imagen}
            alt="Gráfica de barras con los promedios de las áreas Saber 11"
            className="w-full max-w-4xl"
          />
        </div>
      )}

    </section>
  );
}

