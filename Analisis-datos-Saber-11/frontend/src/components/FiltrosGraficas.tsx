
import type { ResultadoSaber11 } from "../types/resultado";

// Áreas evaluadas en las pruebas Saber 11
export type AreaSaber11 =
  | "lectura_critica"
  | "matematicas"
  | "ciencias_sociales"
  | "ciencias_naturales"
  | "ingles";

// Tipos de análisis disponibles
export type TipoGrafica =
  | "promedios"
  | "comparacion"
  | "ranking";

// Propiedades recibidas desde la página principal
interface FiltrosGraficasProps {
  registros: ResultadoSaber11[];
  institucion: string;
  area: AreaSaber11;
  tipoGrafica: TipoGrafica;
  onInstitucionChange: (valor: string) => void;
  onAreaChange: (valor: AreaSaber11) => void;
  onTipoGraficaChange: (valor: TipoGrafica) => void;
}

export default function FiltrosGraficas({
  registros,
  institucion,
  area,
  tipoGrafica,
  onInstitucionChange,
  onAreaChange,
  onTipoGraficaChange,
}: FiltrosGraficasProps) {

  // Obtenemos los nombres únicos de las instituciones
  const instituciones = [
    ...new Set(
      registros.map((registro) => registro.nombre_institucion)
    ),
  ].sort();

  return (
    <section className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

      <h3 className="text-xl font-semibold text-[#172B4D]">
        Filtros de análisis
      </h3>

      <p className="mt-2 text-sm text-gray-500">
        Selecciona los criterios para visualizar y comparar
        los resultados de las instituciones educativas.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-3">

        {/* Filtro por institución educativa */}
        <div>
          <label
            htmlFor="institucion"
            className="mb-2 block text-sm font-semibold text-[#172B4D]"
          >
            Institución educativa
          </label>

          <select
            id="institucion"
            value={institucion}
            onChange={(e) => onInstitucionChange(e.target.value)}
            className="w-full rounded-lg border border-gray-300
                       bg-white px-3 py-3 text-sm text-gray-700"
          >
            <option value="todas">Todas las instituciones</option>

            {instituciones.map((nombre) => (
              <option key={nombre} value={nombre}>
                {nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Filtro por área evaluada */}
        <div>
          <label
            htmlFor="area"
            className="mb-2 block text-sm font-semibold text-[#172B4D]"
          >
            Área evaluada
          </label>

          <select
            id="area"
            value={area}
            onChange={(e) =>
              onAreaChange(e.target.value as AreaSaber11)
            }
            className="w-full rounded-lg border border-gray-300
                       bg-white px-3 py-3 text-sm text-gray-700"
          >
            <option value="lectura_critica">Lectura crítica</option>
            <option value="matematicas">Matemáticas</option>
            <option value="ciencias_sociales">Sociales y Ciudadanas</option>
            <option value="ciencias_naturales">Ciencias Naturales</option>
            <option value="ingles">Inglés</option>
          </select>
        </div>

        {/* Filtro por tipo de gráfica */}
        <div>
          <label
            htmlFor="tipoGrafica"
            className="mb-2 block text-sm font-semibold text-[#172B4D]"
          >
            Tipo de análisis
          </label>

          <select
            id="tipoGrafica"
            value={tipoGrafica}
            onChange={(e) =>
              onTipoGraficaChange(e.target.value as TipoGrafica)
            }
            className="w-full rounded-lg border border-gray-300
                       bg-white px-3 py-3 text-sm text-gray-700"
          >
            <option value="promedios">Promedios por área</option>
            <option value="comparacion">Comparación entre instituciones</option>
            <option value="ranking">Ranking por área</option>
          </select>
        </div>

      </div>
    </section>
  );
}
