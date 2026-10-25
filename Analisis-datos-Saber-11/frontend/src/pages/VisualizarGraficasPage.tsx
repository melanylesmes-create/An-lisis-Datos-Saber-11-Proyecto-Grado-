
import { useState } from "react";

import GraficaRanking from "../components/GraficaRanking";
import EncabezadoInstitucional from "../components/EncabezadoInstitucional";
import GraficasResultados from "../components/GraficasResultados";
import FiltrosGraficas from "../components/FiltrosGraficas";
import GraficaComparacion from "../components/GraficaComparacion";
import type { ResultadoSaber11 } from "../types/resultado";
import type {
  AreaSaber11,
  TipoGrafica,
} from "../components/FiltrosGraficas";

// Propiedades recibidas desde App.tsx
interface VisualizarGraficasPageProps {
  registros: ResultadoSaber11[];
  onVolver: () => void;
}

export default function VisualizarGraficasPage({
  registros,
  onVolver,
}: VisualizarGraficasPageProps) {

  // Institución seleccionada por el usuario
  const [institucion, setInstitucion] = useState("todas");

  // Área que queremos analizar
  const [area, setArea] = useState<AreaSaber11>("matematicas");

  // Tipo de análisis seleccionado
  const [tipoGrafica, setTipoGrafica] =
    useState<TipoGrafica>("promedios");

  // Filtramos los registros por institución
  const registrosFiltrados =
    institucion === "todas"
      ? registros
      : registros.filter(
          (registro) =>
            registro.nombre_institucion === institucion
        );

      
const descargarPDF = async () => {
  if (registrosFiltrados.length === 0) {
    alert("No hay resultados para generar el informe.");
    return;
  }

  try {
    // Solicitamos el token CSRF a Django
    const respuestaCSRF = await fetch(
      "http://localhost:8000/api/archivos/csrf/",
      { credentials: "include" }
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

    // Enviamos los registros y el área seleccionada
    const respuesta = await fetch(
      "http://localhost:8000/api/exportar/pdf-completo/",
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": decodeURIComponent(token),
        },
        body: JSON.stringify({
          registros: registrosFiltrados,
          area: area,
        }),
      }
    );

    if (!respuesta.ok) {
      const error = await respuesta.json().catch(() => null);
      throw new Error(
        error?.error || "No fue posible generar el PDF."
      );
    }

    // Convertimos la respuesta en un archivo descargable
    const archivo = await respuesta.blob();
    const url = URL.createObjectURL(archivo);

    const enlace = document.createElement("a");
    enlace.href = url;
    enlace.download = "Informe_Completo_Saber11.pdf";

    document.body.appendChild(enlace);
    enlace.click();
    enlace.remove();

    URL.revokeObjectURL(url);

  } catch (error) {
    alert(
      error instanceof Error
        ? error.message
        : "Ocurrió un error al descargar el PDF."
    );
  }
};

  return (
    <div className="min-h-screen bg-[#F4F6F9]">

      {/* Encabezado institucional */}
      <EncabezadoInstitucional />

      <main className="mx-auto max-w-6xl px-6 py-10">

        {/* Botón para regresar */}
        <button
          type="button"
          onClick={onVolver}
          className="mb-6 rounded-lg border border-gray-300
                     bg-white px-5 py-2 text-[#3366CC]
                     hover:bg-blue-50"
        >
          ← Volver a los resultados
        </button>

        {/* Título */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-[#172B4D]">
            Análisis y visualización de resultados
          </h2>

          <p className="mt-2 text-gray-500">
            Consulta y comparación de los resultados Saber 11
            de las instituciones educativas de Popayán.
          </p>
        </section>

        {/* Filtros */}
        <FiltrosGraficas
          registros={registros}
          institucion={institucion}
          area={area}
          tipoGrafica={tipoGrafica}
          onInstitucionChange={setInstitucion}
          onAreaChange={setArea}
          onTipoGraficaChange={setTipoGrafica}
        />

        {/* Cantidad de registros seleccionados */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Registros seleccionados
          </p>

          <p className="mt-2 text-3xl font-bold text-[#3366CC]">
            {registrosFiltrados.length}
          </p>
        </section>

     
     
{/* Visualización según el tipo de análisis */}
{registrosFiltrados.length === 0 ? (

  <p className="mt-6 text-gray-500">
    No hay registros para mostrar.
  </p>

) : tipoGrafica === "promedios" ? (

  <GraficasResultados
    registros={registrosFiltrados}
  />

) : tipoGrafica === "comparacion" ? (

  <GraficaComparacion
    registros={registrosFiltrados}
    area={area}
  />

) : tipoGrafica === "ranking" ? (

  <GraficaRanking
    registros={registrosFiltrados}
    area={area}
  />

) : null}

{/* Botón para descargar el informe completo */}
<div className="mt-8 flex justify-end">
  <button
    type="button"
    onClick={descargarPDF}
    disabled={registrosFiltrados.length === 0}
    className="rounded-lg bg-[#3366CC] px-6 py-3
               font-semibold text-white shadow-sm
               hover:bg-[#254F9E]
               disabled:cursor-not-allowed
               disabled:opacity-50"
  >
    Descargar informe PDF
  </button>
</div>
      </main>
    </div>
  );
}

