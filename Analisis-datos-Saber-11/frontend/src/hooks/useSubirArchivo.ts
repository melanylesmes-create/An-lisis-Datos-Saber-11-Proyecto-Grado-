import { useState } from "react";
import type { RespuestaETL } from "../types/resultado";

// Custom Hook para enviar archivos al backend de Django
export function useSubirArchivo() {

  // Guarda temporalmente la respuesta del ETL
  const [resultado, setResultado] = useState<RespuestaETL | null>(null);

  // Indica si el archivo se está procesando
  const [cargando, setCargando] = useState<boolean>(false);

  // Guarda los mensajes de error
  const [error, setError] = useState<string | null>(null);

  // Función para enviar el archivo a Django
  const subirArchivo = async (archivo: File) => {

    setCargando(true);
    setError(null);
    setResultado(null);

    // FormData permite enviar archivos al backend
    const formData = new FormData();
    formData.append("archivo", archivo);

    try {
      const respuesta = await fetch("/api/archivos/subir/", {
        method: "POST",
        body: formData,
      });

      const datos = await respuesta.json();

      if (!respuesta.ok) {
        throw new Error(datos.error || "Error al procesar el archivo.");
      }

      // Guardamos la respuesta temporalmente en React
      setResultado(datos as RespuestaETL);

    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );

    } finally {
      setCargando(false);
    }
  };

  return {
    resultado,
    cargando,
    error,
    subirArchivo,
  };
}