
import type { ResultadoSaber11 } from "../types/resultado";

// Áreas disponibles en los registros procesados por el ETL.
export type AreaSaber11 =
  | "lectura_critica"
  | "matematicas"
  | "ciencias_sociales"
  | "ciencias_naturales"
  | "ingles";

// Tipos de gráficas que puede seleccionar el usuario.
export type TipoGrafica =
  | "promedios"
  | "comparacion"
  | "ranking"
  | "mapa_calor"
  | "circular"
  | "evolucion"
  | "caja_bigotes";

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
  // Obtiene los nombres únicos para llenar el filtro de instituciones.
  const instituciones = [
    ...new Set(registros.map((registro) => registro.nombre_institucion)),
  ]
    .filter(Boolean)
    .sort((a, b) => a.localeCompare(b));

  return (
    <section className="grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
      <div>
        <label
          htmlFor="filtro-institucion"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Institución educativa
        </label>

        <select
          id="filtro-institucion"
          value={institucion}
          onChange={(evento) => onInstitucionChange(evento.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="todas">Todas las instituciones</option>
          {instituciones.map((nombre) => (
            <option key={nombre} value={nombre}>
              {nombre}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label
          htmlFor="filtro-area"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Área de conocimiento
        </label>

        <select
          id="filtro-area"
          value={area}
          onChange={(evento) =>
            onAreaChange(evento.target.value as AreaSaber11)
          }
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="lectura_critica">Lectura crítica</option>
          <option value="matematicas">Matemáticas</option>
          <option value="ciencias_sociales">Ciencias sociales</option>
          <option value="ciencias_naturales">Ciencias naturales</option>
          <option value="ingles">Inglés</option>
        </select>
      </div>

      <div>
        <label
          htmlFor="filtro-grafica"
          className="mb-2 block text-sm font-medium text-gray-700"
        >
          Tipo de gráfica
        </label>

        <select
          id="filtro-grafica"
          value={tipoGrafica}
          onChange={(evento) =>
            onTipoGraficaChange(evento.target.value as TipoGrafica)
          }
          className="w-full rounded-lg border border-gray-300 p-3"
        >
          <option value="promedios">Promedios por área</option>
          <option value="comparacion">Comparación de instituciones</option>
          <option value="ranking">Ranking de instituciones</option>
          <option value="mapa_calor">Mapa de calor</option>
          <option value="circular">Gráfica circular</option>
          <option value="evolucion">Evolución por año</option>
          <option value="caja_bigotes">Caja y bigotes</option>
        </select>
      </div>
    </section>
  );
}
