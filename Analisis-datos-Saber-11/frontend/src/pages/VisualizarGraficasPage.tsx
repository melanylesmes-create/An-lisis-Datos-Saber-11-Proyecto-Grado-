
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



      </main>
    </div>
  );
}

