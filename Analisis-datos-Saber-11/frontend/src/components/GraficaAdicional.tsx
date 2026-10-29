
import { useEffect, useState } from "react";
import type { ResultadoSaber11 } from "../types/resultado";
import type { AreaSaber11, TipoGrafica } from "./FiltrosGraficas";

interface GraficaAdicionalProps {
  registros: ResultadoSaber11[];
  tipo: Extract<TipoGrafica, "circular" | "evolucion" | "caja_bigotes">;
  area: AreaSaber11;
}

// Relaciona cada tipo de gráfica con su ruta y su título.
const configuracion = {
  circular: {
    ruta: "grafica-circular/",
    titulo: "Distribución de los promedios por área",
    necesitaArea: false,
  },
  evolucion: {
    ruta: "grafica-evolucion/",
    titulo: "Evolución anual del área seleccionada",
    necesitaArea: true,
  },
  caja_bigotes: {
    ruta: "grafica-caja-bigotes/",
    titulo: "Distribución de los puntajes",
    necesitaArea: true,
  },
} as const;

export default function GraficaAdicional({
  registros,
  tipo,
  area,
}: GraficaAdicionalProps) {
  const [imagen, setImagen] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Evita mostrar una gráfica anterior cuando cambian los filtros.
    let urlImagen: string | null = null;
    const controlador = new AbortController();

    async function cargarGrafica() {
      if (registros.length === 0) {
        setImagen(null);
        setError("No hay registros para generar la gráfica.");
        setCargando(false);
        return;
      }

      setCargando(true);
      setError(null);
      setImagen(null);

      try {
        // Solicita la cookie CSRF que Django utiliza para proteger el POST.
        const respuestaCSRF = await fetch(
          "http://localhost:8000/api/archivos/csrf/",
          {
            credentials: "include",
            signal: controlador.signal,
          },
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

        const opciones = configuracion[tipo];

        // Envía los registros y, cuando corresponde, el área seleccionada.
        const respuesta = await fetch(
          `http://localhost:8000/api/resultados/${opciones.ruta}`,
          {
            method: "POST",
            credentials: "include",
            signal: controlador.signal,
            headers: {
              "Content-Type": "application/json",
              "X-CSRFToken": decodeURIComponent(token),
            },
            body: JSON.stringify({
              registros,
              ...(opciones.necesitaArea ? { area } : {}),
            }),
          },
        );

        if (!respuesta.ok) {
          const detalle = await respuesta.json().catch(() => null);
          throw new Error(
            detalle?.error || "No fue posible generar la gráfica.",
          );
        }

        // Convierte la respuesta PNG en una URL que el navegador puede mostrar.
        const archivo = await respuesta.blob();
        urlImagen = URL.createObjectURL(archivo);
        setImagen(urlImagen);
      } catch (errorCapturado) {
        if (errorCapturado instanceof Error &&
            errorCapturado.name === "AbortError") {
          return;
        }

        setError(
          errorCapturado instanceof Error
            ? errorCapturado.message
            : "Ocurrió un error al generar la gráfica.",
        );
      } finally {
        if (!controlador.signal.aborted) {
          setCargando(false);
        }
      }
    }

    cargarGrafica();

    // Cancela las solicitudes anteriores y libera la imagen al cambiar filtros.
    return () => {
      controlador.abort();
      if (urlImagen) {
        URL.revokeObjectURL(urlImagen);
      }
    };
  }, [registros, tipo, area]);

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-gray-800">
        {configuracion[tipo].titulo}
      </h2>

      {cargando && (
        <p className="text-gray-600">Generando gráfica...</p>
      )}

      {error && (
        <p role="alert" className="text-red-600">
          {error}
        </p>
      )}

      {imagen && !cargando && (
        <img
          src={imagen}
          alt={configuracion[tipo].titulo}
          className="mx-auto h-auto max-w-full"
        />
      )}
    </section>
  );
}
