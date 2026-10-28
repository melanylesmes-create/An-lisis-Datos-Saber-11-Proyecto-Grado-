
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

      // 1. Solicitamos a Django la cookie de seguridad CSRF
      const respuestaCSRF = await fetch(
        "http://localhost:8000/api/archivos/csrf/",
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!respuestaCSRF.ok) {
        throw new Error("No fue posible solicitar el token CSRF.");
      }

      // 2. Obtenemos el token CSRF de las cookies
      const token = document.cookie
        .split("; ")
        .find((cookie) => cookie.startsWith("csrftoken="))
        ?.split("=")[1];

      if (!token) {
        throw new Error("No se pudo obtener el token CSRF.");
      }

      // 3. Enviamos el archivo Excel o CSV a Django
      const respuesta = await fetch(
        "http://localhost:8000/api/archivos/subir/",
        {
          method: "POST",
          credentials: "include",
          headers: {
            "X-CSRFToken": decodeURIComponent(token),
          },
          body: formData,
        }
      );

      // 4. Comprobamos que Django haya respondido con JSON
      const tipoContenido = respuesta.headers.get("content-type");

      if (!tipoContenido?.includes("application/json")) {
        throw new Error(
          `El servidor respondió con un error HTTP ${respuesta.status}.`
        );
      }

      // 5. Convertimos la respuesta de Django a JSON
      const datos = await respuesta.json();

      // 6. Verificamos si Django encontró algún error
      if (!respuesta.ok) {
        throw new Error(
          datos.error || datos.mensaje || "Error al procesar el archivo."
        );
      }

      // 7. Guardamos los resultados temporalmente en React
      setResultado(datos as RespuestaETL);

    } catch (err) {

      // Mostramos el error si ocurre algún problema
      setError(
        err instanceof Error
          ? err.message
          : "Ocurrió un error inesperado."
      );

    } finally {

      // Finaliza el estado de carga
      setCargando(false);

    }
  };

  // Devolvemos los estados y la función para usarlos
  // desde otros componentes de React
  return {
    resultado,
    cargando,
    error,
    subirArchivo,
  };
}
