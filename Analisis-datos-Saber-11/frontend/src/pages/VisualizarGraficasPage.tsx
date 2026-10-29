
import { useState } from "react";
import GraficaAdicional from "../components/GraficaAdicional";
import GraficaMapaCalor from "../components/GraficaMapaCalor";
import GraficaRanking from "../components/GraficaRanking";
import GraficasResultados from "../components/GraficaDeBarras";
import FiltrosGraficas from "../components/FiltrosGraficas";
import GraficaComparacion from "../components/GraficaComparacion";
import type { ResultadoSaber11 } from "../types/resultado";
import AnalisisAI from "../components/AnalisisAI";
import type {
  AreaSaber11,
  TipoGrafica,
} from "../components/FiltrosGraficas";

// Define las propiedades que recibe la página.
interface VisualizarGraficasPageProps {
  registros: ResultadoSaber11[];
  onVolver: () => void;
}

export default function VisualizarGraficasPage({
  registros,
  onVolver,
}: VisualizarGraficasPageProps) {
  // Guarda los filtros seleccionados por el usuario.
  const [institucion, setInstitucion] = useState("todas");
  const [area, setArea] = useState<AreaSaber11>("matematicas");
  const [tipoGrafica, setTipoGrafica] =
    useState<TipoGrafica>("promedios");

  // Filtra los registros según la institución seleccionada.
  const registrosFiltrados =
    institucion === "todas"
      ? registros
      : registros.filter(
          (registro) =>
            registro.nombre_institucion === institucion
        );

  // Solicita a Django la generación del informe PDF.
  const descargarPDF = async () => {
    if (registrosFiltrados.length === 0) {
      alert("No hay resultados para generar el informe.");
      return;
    }

    try {
      // Solicita la cookie CSRF necesaria para el POST.
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

      // Envía los registros filtrados y el área seleccionada.
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
            area,
          }),
        }
      );

      if (!respuesta.ok) {
        const error = await respuesta.json().catch(() => null);
        throw new Error(
          error?.error || "No fue posible generar el PDF."
        );
      }

      // Convierte la respuesta de Django en un archivo descargable.
      const archivo = await respuesta.blob();
      const url = URL.createObjectURL(archivo);
      const enlace = document.createElement("a");

      enlace.href = url;
      enlace.download = "Informe_Completo_Saber11.pdf";
      document.body.appendChild(enlace);
      enlace.click();
      enlace.remove();

      // Libera la URL temporal del archivo.
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
      <div className="mx-auto max-w-6xl px-6 py-10">
        {/* Permite regresar a la pantalla anterior. */}
        <button
          type="button"
          onClick={onVolver}
          className="mb-6 rounded-lg border border-gray-300 bg-white px-5 py-2 text-[#3366CC] hover:bg-blue-50"
        >
          ← Volver a los resultados
        </button>

        {/* Presenta el título y el propósito de la página. */}
        <section className="mb-8">
          <h2 className="text-3xl font-bold text-[#172B4D]">
            Análisis y visualización de resultados
          </h2>

          <p className="mt-2 text-gray-500">
            Consulta y comparación de los resultados Saber 11
            de las instituciones educativas de Popayán.
          </p>
        </section>

        {/* Permite seleccionar institución, área y tipo de gráfica. */}
        <FiltrosGraficas
          registros={registros}
          institucion={institucion}
          area={area}
          tipoGrafica={tipoGrafica}
          onInstitucionChange={setInstitucion}
          onAreaChange={setArea}
          onTipoGraficaChange={setTipoGrafica}
        />

        {/* Muestra la cantidad de registros incluidos en el análisis. */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Registros seleccionados
          </p>

          <p className="mt-2 text-3xl font-bold text-[#3366CC]">
            {registrosFiltrados.length}
          </p>
        </section>

        {/* Presenta la gráfica correspondiente a la opción seleccionada. */}
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
        ) : tipoGrafica === "mapa_calor" ? (
          <GraficaMapaCalor
            registros={registrosFiltrados}
          />
        ) : tipoGrafica === "circular" ? (
          <GraficaAdicional
            registros={registrosFiltrados}
            tipo="circular"
            area={area}
          />
        ) : tipoGrafica === "evolucion" ? (
          <GraficaAdicional
            registros={registrosFiltrados}
            tipo="evolucion"
            area={area}
          />
        ) : tipoGrafica === "caja_bigotes" ? (
          <GraficaAdicional
            registros={registrosFiltrados}
            tipo="caja_bigotes"
            area={area}
          />
        ) : null}

        {/* Permite solicitar el análisis de resultados mediante IA. */}
        {registrosFiltrados.length > 0 && (
          <AnalisisAI
            key={institucion}
            registros={registrosFiltrados}
          />
        )}

        {/* Permite descargar el informe completo en PDF. */}
        <div className="mt-8 flex justify-end">
          <button
            type="button"
            onClick={descargarPDF}
            disabled={registrosFiltrados.length === 0}
            className="rounded-lg bg-[#3366CC] px-6 py-3 font-semibold text-white shadow-sm hover:bg-[#254F9E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Descargar informe PDF
          </button>
        </div>
      </div>
    </div>
  );
}
